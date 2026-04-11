const { REPURCHASE_BONUS_CONFIG } = require("../../config/repurchaseBonusConfig");
const { isActiveUser, resolveDirectSponsorUser } = require("./qualificationService");
const {
    calculateConfiguredAmount,
    creditRepurchaseIncome,
} = require("./fundDistributionService");

const processSponsorIncome = async ({ buyer, order, repurchase, session = null }) => {
    const config = REPURCHASE_BONUS_CONFIG.sponsorIncome;
    if (!config?.enabled || !buyer || !order) {
        return { created: false, reason: "disabled_or_invalid" };
    }

    const sponsor = await resolveDirectSponsorUser(buyer, { session });
    if (!sponsor) {
        return { created: false, reason: "sponsor_not_found" };
    }

    if (!isActiveUser(sponsor)) {
        return { created: false, reason: "sponsor_inactive" };
    }

    const baseValue = config.base === "amount" ? Number(order.total || 0) : Number(order.bv || 0);
    const amount = calculateConfiguredAmount(baseValue, config);
    const referenceId = `repurchase:sponsor:${order._id}`;

    return creditRepurchaseIncome({
        userId: sponsor._id,
        incomeType: config.incomeType,
        amount,
        sourceUserId: buyer._id,
        sourceOrderId: order._id,
        referenceId,
        remark: `Sponsor income from repurchase by ${buyer.memberId || buyer.userName || buyer._id}`,
        meta: {
            repurchaseId: repurchase?._id || null,
            sponsorId: sponsor._id,
            sponsorMemberId: sponsor.memberId || "",
            orderAmount: Number(order.total || 0),
            bv: Number(order.bv || 0),
            calculationBase: config.base,
            ruleValue: Number(config.value || 0),
        },
        session,
    });
};

module.exports = {
    processSponsorIncome,
};
