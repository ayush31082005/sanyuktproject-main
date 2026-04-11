const IncomeHistory = require("../../models/IncomeHistory");
const RepurchaseLevelIncome = require("../../models/RepurchaseLevelIncome");
const { REPURCHASE_INCOME_TYPES } = require("../../config/repurchaseBonusConfig");

const parsePositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeIncomeType = (value) => String(value || "").trim().toLowerCase().replace(/-/g, "_");

const assertValidIncomeType = (value) => {
    const normalizedType = normalizeIncomeType(value);
    if (!REPURCHASE_INCOME_TYPES.includes(normalizedType)) {
        const error = new Error("Invalid repurchase income type.");
        error.statusCode = 400;
        throw error;
    }

    return normalizedType;
};

const buildDateFilter = ({ fromDate, toDate }) => {
    const createdAt = {};

    if (fromDate) {
        const start = new Date(fromDate);
        if (!Number.isNaN(start.getTime())) {
            start.setHours(0, 0, 0, 0);
            createdAt.$gte = start;
        }
    }

    if (toDate) {
        const end = new Date(toDate);
        if (!Number.isNaN(end.getTime())) {
            end.setHours(23, 59, 59, 999);
            createdAt.$lte = end;
        }
    }

    return Object.keys(createdAt).length ? { createdAt } : {};
};

const buildDatePredicate = ({ fromDate, toDate }) => {
    const start = fromDate ? new Date(fromDate) : null;
    const end = toDate ? new Date(toDate) : null;

    if (start && !Number.isNaN(start.getTime())) {
        start.setHours(0, 0, 0, 0);
    }

    if (end && !Number.isNaN(end.getTime())) {
        end.setHours(23, 59, 59, 999);
    }

    return (value) => {
        const rowDate = new Date(value);
        if (Number.isNaN(rowDate.getTime())) {
            return false;
        }

        if (start && !Number.isNaN(start.getTime()) && rowDate < start) {
            return false;
        }

        if (end && !Number.isNaN(end.getTime()) && rowDate > end) {
            return false;
        }

        return true;
    };
};

const sortByCreatedAtDesc = (rows = []) =>
    rows.sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0));

const dedupeRows = (rows, buildKey) => {
    const seen = new Set();
    const result = [];

    for (const row of rows) {
        const key = buildKey(row);
        if (seen.has(key)) {
            continue;
        }

        seen.add(key);
        result.push(row);
    }

    return result;
};

const getRepurchaseReport = async ({
    userId,
    incomeType,
    fromDate = null,
    toDate = null,
    page = 1,
    limit = 20,
}) => {
    const normalizedType = assertValidIncomeType(incomeType);
    const safePage = parsePositiveInt(page, 1);
    const safeLimit = Math.min(parsePositiveInt(limit, 20), 100);
    const skip = (safePage - 1) * safeLimit;

    const query = {
        userId,
        type: normalizedType,
        ...buildDateFilter({ fromDate, toDate }),
    };

    const [summaryRows, totalRecords, rows] = await Promise.all([
        IncomeHistory.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalBV: { $sum: { $ifNull: ["$meta.bv", 0] } },
                },
            },
        ]),
        IncomeHistory.countDocuments(query),
        IncomeHistory.find(query)
            .populate("sourceUserId", "userName memberId")
            .populate("sourceOrderId", "_id total bv orderType status createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .lean(),
    ]);

    const summary = summaryRows[0] || { totalAmount: 0, totalBV: 0 };

    return {
        incomeType: normalizedType,
        totalAmount: Number(summary.totalAmount || 0),
        totalBV: Number(summary.totalBV || 0),
        totalRecords,
        page: safePage,
        limit: safeLimit,
        totalPages: totalRecords > 0 ? Math.ceil(totalRecords / safeLimit) : 0,
        records: rows.map((row) => ({
            _id: row._id,
            incomeType: row.type,
            amount: Number(row.amount || 0),
            walletType: row.walletType || "",
            levelNo: Number(row.level || 0),
            referenceId: row.referenceId || "",
            remark: row.remark || row.description || "",
            description: row.description || "",
            createdAt: row.createdAt,
            sourceUser: row.sourceUserId
                ? {
                      _id: row.sourceUserId._id,
                      memberId: row.sourceUserId.memberId,
                      userName: row.sourceUserId.userName,
                  }
                : null,
            sourceOrder: row.sourceOrderId
                ? {
                      _id: row.sourceOrderId._id,
                      total: Number(row.sourceOrderId.total || 0),
                      bv: Number(row.sourceOrderId.bv || 0),
                      orderType: row.sourceOrderId.orderType || "",
                      status: row.sourceOrderId.status || "",
                      createdAt: row.sourceOrderId.createdAt,
                  }
                : null,
            meta: row.meta || {},
        })),
    };
};

const getSelfRepurchaseIncomeReportData = async ({
    userId,
    fromDate = null,
    toDate = null,
    page = 1,
    limit = 50,
}) => {
    const safePage = parsePositiveInt(page, 1);
    const safeLimit = Math.min(parsePositiveInt(limit, 50), 100);
    const skip = (safePage - 1) * safeLimit;

    const query = {
        userId,
        type: "self_repurchase",
        ...buildDateFilter({ fromDate, toDate }),
    };

    const [summaryRows, totalRecords, rows] = await Promise.all([
        IncomeHistory.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    totalBV: { $sum: { $ifNull: ["$meta.bv", 0] } },
                },
            },
        ]),
        IncomeHistory.countDocuments(query),
        IncomeHistory.find(query)
            .populate("sourceOrderId", "_id total bv status createdAt orderType")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .lean(),
    ]);

    const summary = summaryRows[0] || { totalAmount: 0, totalBV: 0 };

    const normalizedRows = rows.map((row) => ({
        _id: row._id,
        createdAt: row.createdAt,
        orderId: row.sourceOrderId?._id || row.sourceOrderId || null,
        bv: Number(row.meta?.bv || row.sourceOrderId?.bv || 0),
        amount: Number(row.amount || 0),
        referenceId: row.referenceId || "",
        remark: row.remark || row.description || "",
    }));

    return {
        incomeType: "self_repurchase",
        totalSelfRepurchase: Number(summary.totalAmount || 0),
        totalAmount: Number(summary.totalAmount || 0),
        totalBV: Number(summary.totalBV || 0),
        totalRecords,
        page: safePage,
        limit: safeLimit,
        totalPages: totalRecords > 0 ? Math.ceil(totalRecords / safeLimit) : 0,
        recentRepurchases: normalizedRows,
        records: normalizedRows,
    };
};

const getRepurchaseLevelIncomeReportData = async ({ userId }) => {
    const [legacyRows, ledgerRows] = await Promise.all([
        RepurchaseLevelIncome.find({ userId })
            .populate("fromUserId", "userName memberId name")
            .sort({ createdAt: -1 })
            .lean(),
        IncomeHistory.find({ userId, type: "repurchase_level" })
            .populate("sourceUserId", "userName memberId name")
            .sort({ createdAt: -1 })
            .lean(),
    ]);

    const normalizedLegacyRows = legacyRows.map((row) => ({
        _id: row._id,
        createdAt: row.createdAt,
        fromUserId: row.fromUserId
            ? {
                  _id: row.fromUserId._id,
                  userName: row.fromUserId.userName || row.fromUserId.name || "",
                  memberId: row.fromUserId.memberId || "",
              }
            : null,
        generation: Number(row.generation || 0),
        bv: Number(row.bv || 0),
        commissionPercent: Number(row.commissionPercent || 0),
        commissionAmount: Number(row.commissionAmount || 0),
        dedupeKey: `rep:${row.repurchaseId || row._id}:lvl:${row.generation || 0}:src:${row.fromUserId?._id || ""}`,
    }));

    const normalizedLedgerRows = ledgerRows.map((row) => ({
        _id: row._id,
        createdAt: row.createdAt,
        fromUserId: row.sourceUserId
            ? {
                  _id: row.sourceUserId._id,
                  userName: row.sourceUserId.userName || row.sourceUserId.name || "",
                  memberId: row.sourceUserId.memberId || "",
              }
            : null,
        generation: Number(row.level || row.meta?.levelNo || 0),
        bv: Number(row.meta?.bv || 0),
        commissionPercent: Number(row.meta?.percent || 0),
        commissionAmount: Number(row.amount || 0),
        dedupeKey: `rep:${row.meta?.repurchaseId || row.sourceOrderId || row._id}:lvl:${row.level || row.meta?.levelNo || 0}:src:${row.sourceUserId?._id || ""}`,
    }));

    const combinedRows = sortByCreatedAtDesc(
        dedupeRows(
            [...normalizedLedgerRows, ...normalizedLegacyRows],
            (row) => row.dedupeKey
        )
    );

    const grouped = new Map();
    const activeDownlineSet = new Set();

    for (const row of combinedRows) {
        const generation = Number(row.generation || 0);
        if (!generation) {
            continue;
        }

        const existing = grouped.get(generation) || {
            generation,
            totalIncome: 0,
            totalBV: 0,
            commissionPercent: Number(row.commissionPercent || 0),
            downlineMembers: new Set(),
        };

        existing.totalIncome += Number(row.commissionAmount || 0);
        existing.totalBV += Number(row.bv || 0);
        if (!existing.commissionPercent && row.commissionPercent) {
            existing.commissionPercent = Number(row.commissionPercent || 0);
        }

        if (row.fromUserId?._id) {
            const memberKey = String(row.fromUserId._id);
            existing.downlineMembers.add(memberKey);
            activeDownlineSet.add(memberKey);
        }

        grouped.set(generation, existing);
    }

    const generationBreakdownRows = [...grouped.values()]
        .sort((left, right) => left.generation - right.generation)
        .map((row) => ({
            generation: Number(row.generation || 0),
            totalIncome: Number(row.totalIncome || 0),
            totalBV: Number(row.totalBV || 0),
            downlineMembers: row.downlineMembers.size,
            commissionPercent: Number(row.commissionPercent || 0),
        }));

    return {
        totalLevelIncome: combinedRows.reduce(
            (sum, row) => sum + Number(row.commissionAmount || 0),
            0
        ),
        activeDownline: activeDownlineSet.size,
        activeLevels: generationBreakdownRows.length,
        generationBreakdown: generationBreakdownRows,
        recentTransactions: combinedRows.slice(0, 50).map(({ dedupeKey, ...row }) => row),
    };
};

module.exports = {
    normalizeIncomeType,
    assertValidIncomeType,
    getRepurchaseReport,
    getSelfRepurchaseIncomeReportData,
    getRepurchaseLevelIncomeReportData,
};
