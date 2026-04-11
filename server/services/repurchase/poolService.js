const mongoose = require("mongoose");
const Order = require("../../models/Order");
const PoolClosing = require("../../models/PoolClosing");
const User = require("../../models/User");
const {
    REPURCHASE_BONUS_CONFIG,
    REPURCHASE_FUND_TYPES,
    QUALIFYING_REPURCHASE_ORDER_STATUSES,
} = require("../../config/repurchaseBonusConfig");
const { isDiamondQualified } = require("./qualificationService");
const { roundCurrency, distributeFundPool } = require("./fundDistributionService");

const resolvePeriodWindow = ({ periodType = "monthly", periodStart = null, periodEnd = null }) => {
    const normalizedType = String(periodType || "monthly").trim().toLowerCase();
    const now = new Date();

    if (periodStart && periodEnd) {
        const start = new Date(periodStart);
        const end = new Date(periodEnd);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
            const error = new Error("Invalid pool closing period.");
            error.statusCode = 400;
            throw error;
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return { periodType: normalizedType, periodStart: start, periodEnd: end };
    }

    if (normalizedType === "weekly") {
        const day = now.getDay();
        const daysSinceMonday = day === 0 ? 6 : day - 1;
        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(now.getDate() - daysSinceMonday);
        currentWeekStart.setHours(0, 0, 0, 0);

        const start = new Date(currentWeekStart);
        start.setDate(currentWeekStart.getDate() - 7);

        const end = new Date(currentWeekStart);
        end.setMilliseconds(-1);

        return { periodType: normalizedType, periodStart: start, periodEnd: end };
    }

    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 1);
    end.setMilliseconds(-1);

    return { periodType: "monthly", periodStart: start, periodEnd: end };
};

const buildPeriodKey = ({ periodType, periodStart, periodEnd }) =>
    `${periodType}:${periodStart.toISOString().slice(0, 10)}:${periodEnd.toISOString().slice(0, 10)}`;

const closeRepurchasePool = async ({
    periodType = "monthly",
    periodStart = null,
    periodEnd = null,
    processedBy = null,
}) => {
    const session = await mongoose.startSession();

    try {
        let result;
        await session.withTransaction(async () => {
            const resolvedPeriod = resolvePeriodWindow({ periodType, periodStart, periodEnd });
            const periodKey = buildPeriodKey(resolvedPeriod);

            const existingClosing = await PoolClosing.findOne({ periodKey }).session(session);
            if (existingClosing) {
                result = {
                    created: false,
                    reason: "already_processed",
                    poolClosing: existingClosing,
                };
                return;
            }

            const [turnoverRows, candidateDiamondUsers] = await Promise.all([
                Order.aggregate([
                    {
                        $match: {
                            orderType: "repurchase",
                            status: { $in: QUALIFYING_REPURCHASE_ORDER_STATUSES },
                            createdAt: {
                                $gte: resolvedPeriod.periodStart,
                                $lte: resolvedPeriod.periodEnd,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalTurnover: { $sum: "$total" },
                        },
                    },
                ]).session(session),
                User.find({ activeStatus: true }).session(session),
            ]);

            const eligibleDiamondUsers = candidateDiamondUsers.filter(isDiamondQualified);
            const totalRepurchaseTurnover = roundCurrency(turnoverRows[0]?.totalTurnover || 0);
            const totalPoolAmount = roundCurrency(
                (totalRepurchaseTurnover * Number(REPURCHASE_BONUS_CONFIG.pool.percent || 0)) / 100
            );

            const poolClosingRows = await PoolClosing.create(
                [
                    {
                        periodType: resolvedPeriod.periodType,
                        periodKey,
                        periodStart: resolvedPeriod.periodStart,
                        periodEnd: resolvedPeriod.periodEnd,
                        totalRepurchaseTurnover,
                        poolPercent: Number(REPURCHASE_BONUS_CONFIG.pool.percent || 0),
                        totalPoolAmount,
                        totalDiamondUsers: eligibleDiamondUsers.length,
                        status: "pending",
                        processedBy,
                    },
                ],
                { session }
            );

            const closingDoc = poolClosingRows[0];
            const baseAllocationPercent = roundCurrency(100 / REPURCHASE_FUND_TYPES.length);
            const distributions = [];

            for (let index = 0; index < REPURCHASE_FUND_TYPES.length; index += 1) {
                const incomeType = REPURCHASE_FUND_TYPES[index];
                const isLast = index === REPURCHASE_FUND_TYPES.length - 1;
                const allocationPercent = isLast
                    ? roundCurrency(100 - baseAllocationPercent * index)
                    : baseAllocationPercent;

                const distribution = await distributeFundPool({
                    eligibleUsers: eligibleDiamondUsers,
                    totalPoolAmount,
                    incomeType,
                    allocationPercent,
                    periodKey,
                    periodStart: resolvedPeriod.periodStart,
                    periodEnd: resolvedPeriod.periodEnd,
                    session,
                });

                distributions.push(distribution);
            }

            closingDoc.distributions = distributions;
            closingDoc.status = "completed";
            closingDoc.processedAt = new Date();
            await closingDoc.save({ session });

            result = {
                created: true,
                poolClosing: closingDoc,
            };
        });

        return result;
    } finally {
        await session.endSession();
    }
};

const listPoolClosings = async ({ page = 1, limit = 20 } = {}) => {
    const safePage = Number.parseInt(page, 10) > 0 ? Number.parseInt(page, 10) : 1;
    const safeLimit = Number.parseInt(limit, 10) > 0 ? Math.min(Number.parseInt(limit, 10), 100) : 20;
    const skip = (safePage - 1) * safeLimit;

    const [rows, totalRecords] = await Promise.all([
        PoolClosing.find()
            .populate("processedBy", "userName memberId")
            .sort({ periodEnd: -1, createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .lean(),
        PoolClosing.countDocuments(),
    ]);

    return {
        page: safePage,
        limit: safeLimit,
        totalRecords,
        totalPages: totalRecords > 0 ? Math.ceil(totalRecords / safeLimit) : 0,
        records: rows,
    };
};

module.exports = {
    closeRepurchasePool,
    listPoolClosings,
};
