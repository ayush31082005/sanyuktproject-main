const User = require("../models/User");
const IncomeHistory = require("../models/IncomeHistory");
const { processQualifiedFirstPurchase } = require("../services/matchingService");
const {
    resolveGenerationWalletCreditAmount,
} = require("../services/generationWalletCappingService");
const { createWalletLedgerEntry } = require("./walletLedgerUtils");

exports.processOrderMLM = async (userId, bv, pv, options = {}) => {
    try {
        const { orderId = null, orderType = null, orderTotal = null } = options;

        const user = await User.findById(userId);
        if (!user) {
            console.error(`MLM Order Process: User not found: ${userId}`);
            return { processed: false, reason: "user_not_found" };
        }

        let firstPurchaseResult = null;

        if (orderType === "first" && orderTotal != null) {
            firstPurchaseResult = await processQualifiedFirstPurchase({
                userId: user._id,
                sourceOrderId: orderId,
                orderAmount: orderTotal,
                orderPv: Number(pv || 0),
                orderBv: Number(bv || 0),
            });
        }

        if (!firstPurchaseResult?.processed && (Number(bv || 0) > 0 || Number(pv || 0) > 0)) {
            user.bv = Number(user.bv || 0) + Number(bv || 0);
            user.pv = Number(user.pv || 0) + Number(pv || 0);
            await user.save();
        }

        const generationPercentages = [
            0.05, 0.04, 0.03, 0.02, 0.01, 0.01, 0.005, 0.005, 0.005, 0.005,
            0.004, 0.004, 0.003, 0.003, 0.003, 0.003, 0.003, 0.003, 0.002, 0.002,
        ];

        let genParentId = user.parent;
        for (let i = 0; i < generationPercentages.length; i += 1) {
            if (!genParentId) {
                break;
            }

            const genParent = await User.findById(genParentId);
            if (!genParent) {
                break;
            }

            const income = Number(bv || 0) * generationPercentages[i];
            if (income > 0) {
                const capSummary = await resolveGenerationWalletCreditAmount({
                    userId: genParent._id,
                    amount: income,
                });
                const creditedAmount = Number(capSummary.amount || 0);
                if (creditedAmount <= 0) {
                    genParentId = genParent.parent;
                    continue;
                }

                const baseDescription = `Generation income from purchase by ${user.memberId} (Level ${i + 1})`;
                const description = capSummary.capApplied
                    ? `${baseDescription} [capped from ${capSummary.requestedAmount}]`
                    : baseDescription;

                await User.findByIdAndUpdate(genParent._id, {
                    $inc: { totalGenerationIncome: creditedAmount },
                });

                await createWalletLedgerEntry({
                    userId: genParent._id,
                    walletType: "generation-wallet",
                    txType: "credit",
                    amount: creditedAmount,
                    sourceType: "Generation",
                    sourceId: orderId || null,
                    entryType: "Generation",
                    referenceId: `generation:first:${orderId || user._id}:L${i + 1}:${genParent._id}`,
                    description,
                    meta: {
                        sourceUserId: user._id,
                        sourceMemberId: user.memberId || "",
                        level: i + 1,
                        bv: Number(bv || 0),
                        requestedAmount: capSummary.requestedAmount,
                        cappedAmount: capSummary.cappedAmount,
                        cappingLimit: capSummary.cappingLimit,
                        cappingUsedBefore: capSummary.cappingUsed,
                        remainingCapAfter: capSummary.remainingCapAfterCredit,
                    },
                });

                await IncomeHistory.create({
                    userId: genParent._id,
                    fromUserId: user._id,
                    sourceUserId: user._id,
                    sourceOrderId: orderId || null,
                    amount: creditedAmount,
                    type: "Generation",
                    walletType: "generation-wallet",
                    level: i + 1,
                    description,
                    meta: {
                        requestedAmount: capSummary.requestedAmount,
                        cappedAmount: capSummary.cappedAmount,
                        cappingLimit: capSummary.cappingLimit,
                        cappingUsedBefore: capSummary.cappingUsed,
                        remainingCapAfter: capSummary.remainingCapAfterCredit,
                    },
                });
            }

            genParentId = genParent.parent;
        }

        return {
            processed: true,
            firstPurchaseResult,
        };
    } catch (error) {
        console.error("MLM Order Process Error:", error);
        throw error;
    }
};
