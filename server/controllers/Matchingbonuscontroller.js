const {
    FILTER_TO_PACKAGE,
    getMatchingReportData,
    normalizeMatchingFilter,
} = require("../services/matchingService");

const getRateForFilter = (filter) => {
    if (filter === "diamond") return 400;
    if (filter === "gold") return 200;
    return 100;
};

exports.getMatchingBonusReport = async (req, res) => {
    try {
        const type = String(req.params.type || "").toLowerCase();
        const config = FILTER_TO_PACKAGE[type];

        if (!config) {
            return res.status(400).json({
                success: false,
                message: "Invalid bonus type. Use silver, gold or diamond.",
            });
        }

        const report = await getMatchingReportData({
            userId: req.user._id,
            filterType: type,
        });

        return res.json({
            success: true,
            data: {
                packageType: config.packageType,
                packageName: config.name,
                userHasPackage: report.packageType === config.packageType,
                activeStatus: report.activeStatus,
                totalEarned: report.totalEarned,
                thisMonth: report.thisMonth,
                todayEarned: report.todayEarned,
                cappingUsed: report.cappingUsed,
                cappingLimit: config.capping,
                carryForwardBV: report.carryForwardBV,
                leftBV: report.leftBV,
                rightBV: report.rightBV,
                matchedPV: report.matchedPV,
                personalPV: report.personalPV,
                config: {
                    bv: config.bv,
                    pv: config.pv,
                    capping: config.capping,
                    rate: getRateForFilter(type),
                },
                history: report.history.map((entry) => ({
                    _id: entry._id,
                    date: entry.createdAt,
                    description: entry.description || "Matching Bonus",
                    matchedPV: entry.matchedPV,
                    bonusAmount: entry.amount,
                    status: "credited",
                    sourceUser: entry.sourceUser,
                    sourceOrder: entry.sourceOrder,
                })),
            },
        });
    } catch (error) {
        console.error("getMatchingBonusReport error:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

exports.getMatchingReport = async (req, res) => {
    try {
        const targetUserId =
            req.params.userId === "me" ? String(req.user._id) : String(req.params.userId);

        if (req.user.role !== "admin" && String(req.user._id) !== targetUserId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this report",
            });
        }

        const report = await getMatchingReportData({
            userId: targetUserId,
            filterType: req.query.type || null,
        });

        return res.json({
            success: true,
            data: report,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

exports.getAllMatchingSummary = async (req, res) => {
    try {
        const report = await getMatchingReportData({ userId: req.user._id });

        const summary = Object.entries(FILTER_TO_PACKAGE).map(([filter, config]) => {
            const ledgerType = normalizeMatchingFilter(filter);
            const totals = report.totalsByType[ledgerType] || {
                amount: 0,
                matchedPV: 0,
                count: 0,
            };

            return {
                type: filter,
                packageKey: config.packageType,
                name: config.name,
                capping: config.capping,
                totalEarned: totals.amount,
                matchedPV: totals.matchedPV,
                totalEntries: totals.count,
            };
        });

        return res.json({ success: true, data: summary });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};
