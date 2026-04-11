const { placeRepurchaseOrder: placeRepurchaseOrderService } = require("../services/repurchase/repurchaseOrderService");
const {
    getSelfRepurchaseIncomeReportData,
    getRepurchaseLevelIncomeReportData,
    getRepurchaseReport,
} = require("../services/repurchase/reportService");
const {
    closeRepurchasePool,
    listPoolClosings,
} = require("../services/repurchase/poolService");

const handleError = (res, error, fallbackMessage) => {
    console.error(fallbackMessage, error);
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
    });
};

const buildTypedReportHandler = (incomeType) => async (req, res) => {
    try {
        const report = await getRepurchaseReport({
            userId: req.user._id,
            incomeType,
            fromDate: req.query.fromDate || null,
            toDate: req.query.toDate || null,
            page: req.query.page || 1,
            limit: req.query.limit || 20,
        });

        return res.json({ success: true, data: report });
    } catch (error) {
        return handleError(res, error, `[REPURCHASE] Failed to load ${incomeType} report`);
    }
};

exports.placeRepurchaseOrder = async (req, res) => {
    try {
        const result = await placeRepurchaseOrderService({
            userId: req.user._id,
            cart: req.body.cart,
            payFrom: req.body.payFrom,
            orderTo: req.body.orderTo,
            shippingAddress: req.body.shippingAddress,
            accountPassword: req.body.accountPassword,
            directSellerId: req.body.directSellerId,
        });

        return res.status(201).json(result);
    } catch (error) {
        return handleError(res, error, "[REPURCHASE] Repurchase order failed");
    }
};

exports.getSelfRepurchaseIncome = async (req, res) => {
    try {
        const data = await getSelfRepurchaseIncomeReportData({
            userId: req.user._id,
            fromDate: req.query.fromDate || null,
            toDate: req.query.toDate || null,
            page: req.query.page || 1,
            limit: req.query.limit || 50,
        });
        return res.json({ success: true, data });
    } catch (error) {
        return handleError(res, error, "[REPURCHASE] Failed to load self repurchase report");
    }
};

exports.getRepurchaseLevelIncome = async (req, res) => {
    try {
        const data = await getRepurchaseLevelIncomeReportData({ userId: req.user._id });
        return res.json({ success: true, data });
    } catch (error) {
        return handleError(res, error, "[REPURCHASE] Failed to load repurchase level report");
    }
};

exports.getIncomeReport = async (req, res) => {
    try {
        const report = await getRepurchaseReport({
            userId: req.user._id,
            incomeType: req.params.incomeType,
            fromDate: req.query.fromDate || null,
            toDate: req.query.toDate || null,
            page: req.query.page || 1,
            limit: req.query.limit || 20,
        });

        return res.json({ success: true, data: report });
    } catch (error) {
        return handleError(res, error, "[REPURCHASE] Failed to load repurchase report");
    }
};

exports.getSponsorIncomeReport = buildTypedReportHandler("sponsor_income");
exports.getRoyaltyBonusReport = buildTypedReportHandler("royalty_bonus");
exports.getHouseFundReport = buildTypedReportHandler("house_fund");
exports.getLeadershipFundReport = buildTypedReportHandler("leadership_fund");
exports.getCarFundReport = buildTypedReportHandler("car_fund");
exports.getTravelFundReport = buildTypedReportHandler("travel_fund");
exports.getBikeFundReport = buildTypedReportHandler("bike_fund");

exports.processPoolClosing = async (req, res) => {
    try {
        const result = await closeRepurchasePool({
            periodType: req.body.periodType || "monthly",
            periodStart: req.body.periodStart || null,
            periodEnd: req.body.periodEnd || null,
            processedBy: req.user._id,
        });

        return res.status(result.created ? 201 : 200).json({
            success: true,
            alreadyProcessed: !result.created,
            data: result.poolClosing,
        });
    } catch (error) {
        return handleError(res, error, "[REPURCHASE] Pool closing failed");
    }
};

exports.getPoolClosingList = async (req, res) => {
    try {
        const data = await listPoolClosings({
            page: req.query.page || 1,
            limit: req.query.limit || 20,
        });

        return res.json({ success: true, data });
    } catch (error) {
        return handleError(res, error, "[REPURCHASE] Failed to load pool closing list");
    }
};
