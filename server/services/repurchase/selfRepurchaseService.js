const {
    REPURCHASE_BONUS_CONFIG,
    QUALIFYING_REPURCHASE_ORDER_STATUSES,
} = require("../../config/repurchaseBonusConfig");
const {
    calculateConfiguredAmount,
    creditRepurchaseIncome,
} = require("./fundDistributionService");

const processSelfRepurchaseBonus = async ({ buyer, order, repurchase, session = null }) => {
    if (!buyer || !order || String(order.orderType || "") !== "repurchase") {
        return { created: false, reason: "invalid_order_type" };
    }

    const config = {
        enabled: Boolean(REPURCHASE_BONUS_CONFIG.enableSelfRepurchaseIncome),
        incomeType: "self_repurchase",
        base: "bv",
        mode: "percent",
        value: Number(REPURCHASE_BONUS_CONFIG.selfIncomePercent || 0),
    };

    if (!config.enabled) {
        return { created: false, reason: "disabled" };
    }

    if (!QUALIFYING_REPURCHASE_ORDER_STATUSES.includes(String(order.status || "").toLowerCase())) {
        return { created: false, reason: "order_not_qualified" };
    }

    const baseValue = Number(order.bv || repurchase?.bv || 0);
    const amount = calculateConfiguredAmount(baseValue, config);
    const referenceId = `SELF-${order._id}-${buyer._id}`;

    return creditRepurchaseIncome({
        userId: buyer._id,
        incomeType: config.incomeType,
        amount,
        sourceUserId: buyer._id,
        sourceOrderId: order._id,
        referenceId,
        remark: `BV-based self repurchase income from order ${String(order._id).slice(-8).toUpperCase()}`,
        entryType: "income",
        meta: {
            repurchaseId: repurchase?._id || null,
            orderAmount: Number(order.total || 0),
            bv: baseValue,
            calculationBase: config.base,
            selfIncomePercent: Number(config.value || 0),
        },
        session,
    });
};

module.exports = {
    processSelfRepurchaseBonus,
};
