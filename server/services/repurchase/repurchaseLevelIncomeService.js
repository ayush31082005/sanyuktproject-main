const { REPURCHASE_BONUS_CONFIG } = require("../../config/repurchaseBonusConfig");
const { isActiveUser, getSponsorChain } = require("./qualificationService");
const {
    calculateConfiguredAmount,
    creditRepurchaseIncome,
} = require("./fundDistributionService");

const processRepurchaseLevelIncome = async ({ buyer, order, repurchase, session = null }) => {
    if (!buyer || !order) {
        return [];
    }

    const sponsorChain = await getSponsorChain(buyer, {
        session,
        limit: REPURCHASE_BONUS_CONFIG.repurchaseLevel.length,
    });

    const results = [];
    for (let index = 0; index < REPURCHASE_BONUS_CONFIG.repurchaseLevel.length; index += 1) {
        const rule = REPURCHASE_BONUS_CONFIG.repurchaseLevel[index];
        const sponsor = sponsorChain[index];
        const levelNo = index + 1;

        if (!rule || !sponsor) {
            break;
        }

        if (!isActiveUser(sponsor)) {
            results.push({
                created: false,
                levelNo,
                userId: sponsor._id,
                reason: "upline_inactive",
            });
            continue;
        }

        const amount = calculateConfiguredAmount(Number(order.bv || 0), rule);
        const referenceId = `repurchase:level:${order._id}:L${levelNo}`;

        const payoutResult = await creditRepurchaseIncome({
            userId: sponsor._id,
            incomeType: "repurchase_level",
            amount,
            sourceUserId: buyer._id,
            sourceOrderId: order._id,
            levelNo,
            referenceId,
            remark: `Repurchase level income L${levelNo} from ${buyer.memberId || buyer.userName || buyer._id}`,
            meta: {
                repurchaseId: repurchase?._id || null,
                bv: Number(order.bv || 0),
                percent: Number(rule.value || 0),
                levelNo,
                buyerMemberId: buyer.memberId || "",
            },
            session,
        });

        results.push({
            ...payoutResult,
            levelNo,
            userId: sponsor._id,
        });
    }

    return results;
};

module.exports = {
    processRepurchaseLevelIncome,
};
