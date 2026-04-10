const mongoose = require("mongoose");
const User = require("../models/User");
const Order = require("../models/Order");
const IncomeHistory = require("../models/IncomeHistory");
const { createIncomeEntry } = require("./incomeService");
const { creditWallet } = require("./walletService");
const {
    propagateBinaryVolume,
    resolveTotalLeftPV,
    resolveTotalRightPV,
    resolveUsedLeftPV,
    resolveUsedRightPV,
    syncBinaryTreeSnapshot,
} = require("./binaryService");

const MATCHING_PACKAGE_CONFIG = Object.freeze({
    "599": {
        packageType: "599",
        name: "Silver",
        amount: 599,
        pv: 0.25,
        bv: 250,
        capping: 2000,
    },
    "1299": {
        packageType: "1299",
        name: "Gold",
        amount: 1299,
        pv: 0.5,
        bv: 500,
        capping: 4000,
    },
    "2699": {
        packageType: "2699",
        name: "Diamond",
        amount: 2699,
        pv: 1,
        bv: 1000,
        capping: 10000,
    },
});

const MATCHING_RULES = Object.freeze([
    {
        key: "diamond",
        ledgerType: "diamond_matching",
        label: "Diamond Matching",
        units: 4,
        amount: 400,
    },
    {
        key: "gold",
        ledgerType: "gold_matching",
        label: "Gold Matching",
        units: 2,
        amount: 200,
    },
    {
        key: "silver",
        ledgerType: "silver_matching",
        label: "Silver Matching",
        units: 1,
        amount: 100,
    },
]);

const MATCHING_LEDGER_TYPES = MATCHING_RULES.map((rule) => rule.ledgerType);

const FILTER_TO_LEDGER_TYPE = {
    silver: "silver_matching",
    gold: "gold_matching",
    diamond: "diamond_matching",
};

const FILTER_TO_PACKAGE = {
    silver: MATCHING_PACKAGE_CONFIG["599"],
    gold: MATCHING_PACKAGE_CONFIG["1299"],
    diamond: MATCHING_PACKAGE_CONFIG["2699"],
};

const SUCCESSFUL_ORDER_STATUSES = [
    "paid",
    "processing",
    "shipped",
    "reached_store",
    "out_for_delivery",
    "delivered",
];

const toPvUnits = (value) => Math.max(0, Math.round(Number(value || 0) * 4));
const fromPvUnits = (value) => Number((Number(value || 0) / 4).toFixed(2));
const roundCurrency = (value) => Number(Number(value || 0).toFixed(2));

const normalizeMatchingFilter = (value) => {
    if (!value) {
        return null;
    }

    const normalized = String(value).trim().toLowerCase();
    return FILTER_TO_LEDGER_TYPE[normalized] || null;
};

const resolvePackageByVolume = ({ pv = 0, bv = 0, amount = 0 }) => {
    const numericPV = Number(pv || 0);
    const numericBV = Number(bv || 0);
    const numericAmount = Number(amount || 0);

    if (numericPV >= MATCHING_PACKAGE_CONFIG["2699"].pv || numericBV >= MATCHING_PACKAGE_CONFIG["2699"].bv) {
        return MATCHING_PACKAGE_CONFIG["2699"];
    }

    if (numericPV >= MATCHING_PACKAGE_CONFIG["1299"].pv || numericBV >= MATCHING_PACKAGE_CONFIG["1299"].bv) {
        return MATCHING_PACKAGE_CONFIG["1299"];
    }

    if (numericPV >= MATCHING_PACKAGE_CONFIG["599"].pv || numericBV >= MATCHING_PACKAGE_CONFIG["599"].bv) {
        return MATCHING_PACKAGE_CONFIG["599"];
    }

    return (
        Object.values(MATCHING_PACKAGE_CONFIG).find(
            (config) => Math.abs(Number(config.amount) - numericAmount) < 0.01
        ) || null
    );
};

const getDailyCapping = (user) =>
    Number(user?.dailyCapping || MATCHING_PACKAGE_CONFIG[user?.packageType]?.capping || 0);

const getStartOfDay = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return start;
};

const isSuccessfulOrderStatus = (status) =>
    SUCCESSFUL_ORDER_STATUSES.includes(String(status || "").toLowerCase());

const markOrderBinaryStatus = async ({
    orderId,
    status,
    note = "",
    packageType = "",
    pv = 0,
    session = null,
}) => {
    if (!orderId) {
        return null;
    }

    return Order.findByIdAndUpdate(
        orderId,
        {
            $set: {
                binaryProcessStatus: status,
                binaryProcessedAt: new Date(),
                binaryProcessNote: note,
                mlmPackageType: packageType || "",
                mlmPV: Number(pv || 0),
            },
        },
        { new: true, session }
    );
};

const runMatchingForUser = async ({
    userId,
    sourceUserId = null,
    sourceOrderId = null,
    session = null,
}) => {
    const user = await User.findById(userId).session(session);
    if (!user) {
        return {
            userId,
            matched: false,
            reason: "user_not_found",
        };
    }

    if (!user.activeStatus || !MATCHING_PACKAGE_CONFIG[user.packageType]) {
        await syncBinaryTreeSnapshot({ user, session });
        return {
            userId: String(user._id),
            matched: false,
            reason: "user_not_eligible",
        };
    }

    const totalLeftPV = resolveTotalLeftPV(user);
    const totalRightPV = resolveTotalRightPV(user);
    const usedLeftPV = resolveUsedLeftPV(user);
    const usedRightPV = resolveUsedRightPV(user);

    let leftUnits = toPvUnits(totalLeftPV - usedLeftPV);
    let rightUnits = toPvUnits(totalRightPV - usedRightPV);

    if (leftUnits <= 0 || rightUnits <= 0) {
        await syncBinaryTreeSnapshot({ user, session });
        return {
            userId: String(user._id),
            matched: false,
            reason: "insufficient_volume",
        };
    }

    const startOfDay = getStartOfDay();
    const todayIncomeRows = await IncomeHistory.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(user._id),
                type: { $in: MATCHING_LEDGER_TYPES },
                createdAt: { $gte: startOfDay },
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
            },
        },
    ]).session(session);

    let remainingCap = Math.max(
        0,
        getDailyCapping(user) - Number(todayIncomeRows[0]?.totalAmount || 0)
    );

    if (remainingCap <= 0) {
        await syncBinaryTreeSnapshot({ user, session });
        return {
            userId: String(user._id),
            matched: false,
            reason: "daily_capping_reached",
        };
    }

    const matchedEntries = [];
    let consumedUnits = 0;
    let totalIncome = 0;

    for (const rule of MATCHING_RULES) {
        const maxByPV = Math.min(
            Math.floor(leftUnits / rule.units),
            Math.floor(rightUnits / rule.units)
        );
        const maxByCap = Math.floor(remainingCap / rule.amount);
        const count = Math.min(maxByPV, maxByCap);

        if (count <= 0) {
            continue;
        }

        const ruleUnits = count * rule.units;
        const matchedPV = fromPvUnits(ruleUnits);
        const amount = count * rule.amount;

        leftUnits -= ruleUnits;
        rightUnits -= ruleUnits;
        remainingCap -= amount;
        consumedUnits += ruleUnits;
        totalIncome += amount;

        matchedEntries.push({
            ...rule,
            count,
            matchedPV,
            amount,
        });
    }

    if (!matchedEntries.length) {
        await syncBinaryTreeSnapshot({ user, session });
        return {
            userId: String(user._id),
            matched: false,
            reason: "cap_prevented_matching",
        };
    }

    const consumedPV = fromPvUnits(consumedUnits);

    user.totalLeftPV = totalLeftPV;
    user.totalRightPV = totalRightPV;
    user.usedLeftPV = roundCurrency(usedLeftPV + consumedPV);
    user.usedRightPV = roundCurrency(usedRightPV + consumedPV);
    user.leftTeamPV = totalLeftPV;
    user.rightTeamPV = totalRightPV;
    user.totalMatchingBonus = roundCurrency(Number(user.totalMatchingBonus || 0) + totalIncome);
    user.matchedPV = roundCurrency(Number(user.matchedPV || 0) + consumedPV);

    await user.save({ session });

    for (const entry of matchedEntries) {
        const incomeEntry = await createIncomeEntry({
            userId: user._id,
            type: entry.ledgerType,
            amount: entry.amount,
            matchedPV: entry.matchedPV,
            sourceUserId,
            sourceOrderId,
            description: `${entry.label} bonus for ${entry.matchedPV} PV pair`,
            meta: {
                matchCount: entry.count,
                ruleKey: entry.key,
            },
            session,
        });

        await creditWallet({
            userId: user._id,
            amount: entry.amount,
            walletType: "e-wallet",
            sourceType: entry.ledgerType,
            sourceId: sourceOrderId || incomeEntry?._id || null,
            description: `${entry.label} bonus credited to wallet`,
            meta: {
                incomeLedgerId: incomeEntry?._id || null,
                matchedPV: entry.matchedPV,
                sourceUserId,
                sourceOrderId,
            },
            session,
        });
    }

    await syncBinaryTreeSnapshot({ user, session });

    return {
        userId: String(user._id),
        matched: true,
        totalIncome,
        consumedPV,
        entries: matchedEntries,
    };
};

const applyMatchingBonusesForUser = async (params) => {
    const shouldManageSession = !params.session;
    const session = params.session || (await mongoose.startSession());

    try {
        if (!shouldManageSession) {
            return runMatchingForUser({ ...params, session });
        }

        let result;
        await session.withTransaction(async () => {
            result = await runMatchingForUser({ ...params, session });
        });
        return result;
    } finally {
        if (shouldManageSession) {
            await session.endSession();
        }
    }
};

const processQualifiedFirstPurchase = async ({
    userId,
    sourceOrderId = null,
    orderAmount,
    orderPv = 0,
    orderBv = 0,
}) => {
    const packageConfig = resolvePackageByVolume({
        amount: orderAmount,
        pv: orderPv,
        bv: orderBv,
    });
    const qualifiedPV = Number(orderPv || packageConfig?.pv || 0);
    const qualifiedBV = Number(orderBv || packageConfig?.bv || 0);

    if (!packageConfig) {
        await markOrderBinaryStatus({
            orderId: sourceOrderId,
            status: "skipped",
            note: "Order PV/BV does not match a qualifying binary package.",
        });

        return {
            processed: false,
            reason: "non_qualifying_volume",
        };
    }

    const session = await mongoose.startSession();

    try {
        let result;

        await session.withTransaction(async () => {
            const user = await User.findById(userId).session(session);
            if (!user) {
                throw new Error("User not found");
            }

            if (
                user.activeStatus &&
                MATCHING_PACKAGE_CONFIG[user.packageType] &&
                user.firstPurchaseProcessedAt
            ) {
                result = {
                    processed: false,
                    reason: "user_already_active",
                    packageType: user.packageType,
                };

                await markOrderBinaryStatus({
                    orderId: sourceOrderId,
                    status: "skipped",
                    note: "User is already active on a qualifying package.",
                    session,
                });
                return;
            }

            if (user.firstPurchaseOrderId) {
                result = {
                    processed: false,
                    reason: "already_processed",
                    firstPurchaseOrderId: String(user.firstPurchaseOrderId),
                };

                await markOrderBinaryStatus({
                    orderId: sourceOrderId,
                    status: "skipped",
                    note: "First purchase MLM logic already processed for this user.",
                    session,
                });
                return;
            }

            user.activeStatus = true;
            user.packageType = packageConfig.packageType;
            user.dailyCapping = packageConfig.capping;
            user.bv = Number(user.bv || 0) + qualifiedBV;
            user.pv = Number(user.pv || 0) + qualifiedPV;
            user.firstPurchaseOrderId = sourceOrderId || null;
            user.firstPurchaseProcessedAt = new Date();

            await user.save({ session });
            await syncBinaryTreeSnapshot({ user, session });

            const affectedUplineIds = await propagateBinaryVolume({
                sourceUserId: user._id,
                pv: qualifiedPV,
                bv: qualifiedBV,
                session,
            });

            const matchingResults = [];
            for (const affectedUserId of affectedUplineIds) {
                const matchingResult = await runMatchingForUser({
                    userId: affectedUserId,
                    sourceUserId: user._id,
                    sourceOrderId,
                    session,
                });
                matchingResults.push(matchingResult);
            }

            await markOrderBinaryStatus({
                orderId: sourceOrderId,
                status: "processed",
                note: `Qualified ${packageConfig.name} first purchase processed successfully using ${qualifiedPV} PV.`,
                packageType: packageConfig.packageType,
                pv: qualifiedPV,
                session,
            });

            result = {
                processed: true,
                packageType: packageConfig.packageType,
                pv: qualifiedPV,
                bv: qualifiedBV,
                affectedUplineIds,
                matchingResults,
            };
        });

        return result;
    } finally {
        await session.endSession();
    }
};

const syncEligibleFirstPurchasesForUser = async (userId) => {
    const user = await User.findById(userId).select(
        "_id activeStatus packageType firstPurchaseOrderId firstPurchaseProcessedAt"
    );

    if (!user) {
        return null;
    }

    if (user.firstPurchaseOrderId && user.firstPurchaseProcessedAt) {
        return null;
    }

    const candidateOrders = await Order.find({
        user: user._id,
        orderType: "first",
        status: { $in: SUCCESSFUL_ORDER_STATUSES },
        binaryProcessStatus: { $in: ["pending", "skipped", "failed"] },
    })
        .sort({ createdAt: 1 })
        .lean();

    for (const order of candidateOrders) {
        const outcome = await processQualifiedFirstPurchase({
            userId: user._id,
            sourceOrderId: order._id,
            orderAmount: Number(order.total || 0),
            orderPv: Number(order.pv || 0),
            orderBv: Number(order.bv || 0),
        });

        if (outcome?.processed) {
            return outcome;
        }
    }

    return null;
};

const syncEligibleFirstPurchases = async ({ userId = null, limit = 50 } = {}) => {
    const query = {
        orderType: "first",
        status: { $in: SUCCESSFUL_ORDER_STATUSES },
        binaryProcessStatus: { $in: ["pending", "skipped", "failed"] },
    };

    if (userId) {
        query.user = userId;
    }

    const candidateOrders = await Order.find(query)
        .sort({ createdAt: 1 })
        .limit(limit)
        .lean();

    const results = [];
    for (const order of candidateOrders) {
        const outcome = await processQualifiedFirstPurchase({
            userId: order.user,
            sourceOrderId: order._id,
            orderAmount: Number(order.total || 0),
            orderPv: Number(order.pv || 0),
            orderBv: Number(order.bv || 0),
        });
        results.push({
            orderId: String(order._id),
            userId: String(order.user),
            outcome,
        });
    }

    return results;
};

const processPendingMatchingForAllUsers = async () => {
    const users = await User.find({
        activeStatus: true,
        packageType: { $in: Object.keys(MATCHING_PACKAGE_CONFIG) },
    })
        .select("_id")
        .lean();

    const results = [];
    for (const user of users) {
        const result = await applyMatchingBonusesForUser({ userId: user._id });
        results.push(result);
    }

    return results;
};

const getMatchingReportData = async ({ userId, filterType = null }) => {
    await syncEligibleFirstPurchases();
    await syncEligibleFirstPurchasesForUser(userId);

    const ledgerType = normalizeMatchingFilter(filterType);
    if (filterType && !ledgerType) {
        const error = new Error("Invalid matching type filter. Use silver, gold, or diamond.");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(userId)
        .select(
            "userName memberId packageType activeStatus pv dailyCapping totalMatchingBonus matchedPV totalLeftPV totalRightPV usedLeftPV usedRightPV leftTeamPV rightTeamPV"
        )
        .lean();

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const totalLeftPV = resolveTotalLeftPV(user);
    const totalRightPV = resolveTotalRightPV(user);
    const usedLeftPV = resolveUsedLeftPV(user);
    const usedRightPV = resolveUsedRightPV(user);
    const availableLeftPV = Math.max(0, totalLeftPV - usedLeftPV);
    const availableRightPV = Math.max(0, totalRightPV - usedRightPV);

    const matchQuery = {
        userId: new mongoose.Types.ObjectId(userId),
        type: ledgerType ? ledgerType : { $in: MATCHING_LEDGER_TYPES },
    };

    const [history, totals, todayTotals, monthTotals, overallTodayTotals, groupedTotals] = await Promise.all([
        IncomeHistory.find(matchQuery)
            .populate("sourceUserId", "memberId userName")
            .populate("sourceOrderId", "_id total orderType createdAt")
            .sort({ createdAt: -1 })
            .lean(),
        IncomeHistory.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalMatchedPV: { $sum: "$matchedPV" },
                },
            },
        ]),
        IncomeHistory.aggregate([
            {
                $match: {
                    ...matchQuery,
                    createdAt: { $gte: getStartOfDay() },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]),
        IncomeHistory.aggregate([
            {
                $match: {
                    ...matchQuery,
                    createdAt: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]),
        IncomeHistory.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    type: { $in: MATCHING_LEDGER_TYPES },
                    createdAt: { $gte: getStartOfDay() },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]),
        IncomeHistory.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    type: { $in: MATCHING_LEDGER_TYPES },
                },
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" },
                    totalMatchedPV: { $sum: "$matchedPV" },
                    count: { $sum: 1 },
                },
            },
        ]),
    ]);

    const totalsByType = groupedTotals.reduce((acc, row) => {
        acc[row._id] = {
            amount: Number(row.totalAmount || 0),
            matchedPV: Number(row.totalMatchedPV || 0),
            count: Number(row.count || 0),
        };
        return acc;
    }, {});

    return {
        userId: String(user._id),
        memberId: user.memberId,
        name: user.userName,
        packageType: user.packageType || "none",
        activeStatus: Boolean(user.activeStatus),
        filterType: ledgerType,
        totalEarned: Number(totals[0]?.totalAmount || 0),
        totalMatchedPV: Number(totals[0]?.totalMatchedPV || 0),
        todayEarned: Number(todayTotals[0]?.totalAmount || 0),
        thisMonth: Number(monthTotals[0]?.totalAmount || 0),
        cappingLimit: getDailyCapping(user),
        cappingUsed: Number(overallTodayTotals[0]?.totalAmount || 0),
        personalPV: Number(user.pv || 0),
        matchedPV: Number(user.matchedPV || 0),
        totalLeftPV,
        totalRightPV,
        usedLeftPV,
        usedRightPV,
        availableLeftPV: roundCurrency(availableLeftPV),
        availableRightPV: roundCurrency(availableRightPV),
        leftBV: roundCurrency(totalLeftPV * 1000),
        rightBV: roundCurrency(totalRightPV * 1000),
        carryForwardBV: roundCurrency(Math.max(availableLeftPV, availableRightPV) * 1000),
        totalsByType,
        history: history.map((entry) => ({
            _id: entry._id,
            type: entry.type,
            amount: Number(entry.amount || 0),
            matchedPV: Number(entry.matchedPV || 0),
            description: entry.description || "",
            createdAt: entry.createdAt,
            sourceUser: entry.sourceUserId
                ? {
                      _id: entry.sourceUserId._id,
                      memberId: entry.sourceUserId.memberId,
                      name: entry.sourceUserId.userName,
                  }
                : null,
            sourceOrder: entry.sourceOrderId
                ? {
                      _id: entry.sourceOrderId._id,
                      total: Number(entry.sourceOrderId.total || 0),
                      orderType: entry.sourceOrderId.orderType || "",
                      createdAt: entry.sourceOrderId.createdAt,
                  }
                : null,
        })),
    };
};

module.exports = {
    MATCHING_PACKAGE_CONFIG,
    MATCHING_RULES,
    MATCHING_LEDGER_TYPES,
    FILTER_TO_PACKAGE,
    SUCCESSFUL_ORDER_STATUSES,
    isSuccessfulOrderStatus,
    normalizeMatchingFilter,
    resolvePackageByVolume,
    processQualifiedFirstPurchase,
    syncEligibleFirstPurchases,
    syncEligibleFirstPurchasesForUser,
    applyMatchingBonusesForUser,
    processPendingMatchingForAllUsers,
    getMatchingReportData,
};
