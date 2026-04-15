const User = require("../../models/User");
const IncomeHistory = require("../../models/IncomeHistory");
const { createIncomeLedgerEntry } = require("../incomeLedgerService");
const {
    resolveGenerationWalletCreditAmount,
} = require("../generationWalletCappingService");
const { creditWallet } = require("../walletService");
const { REPURCHASE_WALLET_TYPE } = require("../../config/repurchaseBonusConfig");

const roundCurrency = (value) => Number(Number(value || 0).toFixed(2));

const USER_TOTAL_FIELD_MAP = Object.freeze({
    self_repurchase: "totalSelfRepurchaseIncome",
    sponsor_income: "totalSponsorIncome",
    repurchase_level: "totalRepurchaseLevelIncome",
    royalty_bonus: "totalRoyaltyBonus",
    house_fund: "totalHouseFund",
    leadership_fund: "totalLeadershipFund",
    car_fund: "totalCarFund",
    travel_fund: "totalTravelFund",
    bike_fund: "totalBikeFund",
});

const calculateConfiguredAmount = (baseValue, rule = {}) => {
    const numericBase = Number(baseValue || 0);
    const numericRuleValue = Number(rule?.value || 0);

    if (numericBase <= 0 || numericRuleValue <= 0) {
        return 0;
    }

    if (String(rule.mode || "percent").toLowerCase() === "flat") {
        return roundCurrency(numericRuleValue);
    }

    return roundCurrency((numericBase * numericRuleValue) / 100);
};

const creditRepurchaseIncome = async ({
    userId,
    incomeType,
    amount,
    sourceUserId = null,
    sourceOrderId = null,
    levelNo = null,
    referenceId = "",
    remark = "",
    entryType = "income",
    meta = {},
    session = null,
}) => {
    const requestedAmount = roundCurrency(amount);
    if (!userId || requestedAmount <= 0) {
        return { created: false, reason: "invalid_amount" };
    }

    const normalizedReferenceId = String(referenceId || "").trim();

    if (normalizedReferenceId) {
        const existing = await IncomeHistory.findOne({
            userId,
            type: incomeType,
            referenceId: normalizedReferenceId,
        }).session(session);

        if (existing) {
            return {
                created: false,
                duplicate: true,
                incomeEntry: existing,
            };
        }
    }

    const capSummary =
        REPURCHASE_WALLET_TYPE === "generation-wallet"
            ? await resolveGenerationWalletCreditAmount({
                  userId,
                  amount: requestedAmount,
                  session,
              })
            : {
                  amount: requestedAmount,
                  requestedAmount,
                  cappedAmount: 0,
                  cappingLimit: 0,
                  cappingUsed: 0,
                  remainingCapAfterCredit: requestedAmount,
                  capApplied: false,
                  skipped: false,
                  reason: "not_applicable",
              };

    const finalAmount = roundCurrency(capSummary.amount);
    if (finalAmount <= 0) {
        return {
            created: false,
            reason: capSummary.reason || "daily_capping_reached",
            capSummary,
        };
    }

    const finalRemark = capSummary.capApplied
        ? `${remark} [capped from ${capSummary.requestedAmount}]`
        : remark;
    const cappedMeta = {
        ...meta,
        requestedAmount: capSummary.requestedAmount,
        cappedAmount: capSummary.cappedAmount,
        cappingLimit: capSummary.cappingLimit,
        cappingUsedBefore: capSummary.cappingUsed,
        remainingCapAfter: capSummary.remainingCapAfterCredit,
    };

    const incomeEntry = await createIncomeLedgerEntry({
        userId,
        incomeType,
        amount: finalAmount,
        walletType: REPURCHASE_WALLET_TYPE,
        sourceUserId,
        sourceOrderId,
        fromUserId: sourceUserId,
        levelNo,
        description: finalRemark,
        remark: finalRemark,
        referenceId: normalizedReferenceId,
        meta: cappedMeta,
        session,
    });

    const walletEntry = await creditWallet({
        userId,
        amount: finalAmount,
        walletType: REPURCHASE_WALLET_TYPE,
        sourceType: incomeType,
        entryType,
        sourceId: sourceOrderId || incomeEntry?._id || null,
        referenceId: normalizedReferenceId,
        description: finalRemark,
        meta: {
            ...cappedMeta,
            incomeLedgerId: incomeEntry?._id || null,
        },
        session,
    });

    const incUpdate = {
        totalGenerationIncome: finalAmount,
    };

    const totalField = USER_TOTAL_FIELD_MAP[incomeType];
    if (totalField) {
        incUpdate[totalField] = finalAmount;
    }

    await User.findByIdAndUpdate(
        userId,
        { $inc: incUpdate },
        { session }
    );

    return {
        created: true,
        incomeEntry,
        walletEntry,
        amount: finalAmount,
        capSummary,
    };
};

const distributeFundPool = async ({
    eligibleUsers = [],
    totalPoolAmount = 0,
    incomeType,
    allocationPercent = 0,
    periodKey,
    periodStart,
    periodEnd,
    session = null,
}) => {
    const totalEligibleUsers = eligibleUsers.length;
    const allocatedAmount = roundCurrency((Number(totalPoolAmount || 0) * Number(allocationPercent || 0)) / 100);

    if (!incomeType || allocatedAmount <= 0 || totalEligibleUsers === 0) {
        return {
            incomeType,
            allocationPercent: roundCurrency(allocationPercent),
            totalAllocated: allocatedAmount,
            perUserAmount: 0,
            eligibleUserCount: totalEligibleUsers,
        };
    }

    const basePerUserAmount = roundCurrency(allocatedAmount / totalEligibleUsers);
    let distributedSoFar = 0;

    for (let index = 0; index < eligibleUsers.length; index += 1) {
        const user = eligibleUsers[index];
        const isLastUser = index === eligibleUsers.length - 1;
        const amountForUser = isLastUser
            ? roundCurrency(allocatedAmount - distributedSoFar)
            : basePerUserAmount;

        distributedSoFar = roundCurrency(distributedSoFar + amountForUser);

        if (amountForUser <= 0) {
            continue;
        }

        const referenceId = `pool:${incomeType}:${periodKey}:${user._id}`;
        const remark = `${incomeType.replace(/_/g, " ")} distributed for ${periodKey}`;

        await creditRepurchaseIncome({
            userId: user._id,
            incomeType,
            amount: amountForUser,
            referenceId,
            remark,
            meta: {
                periodKey,
                periodStart,
                periodEnd,
                allocationPercent: roundCurrency(allocationPercent),
                totalPoolAmount: roundCurrency(totalPoolAmount),
            },
            session,
        });
    }

    return {
        incomeType,
        allocationPercent: roundCurrency(allocationPercent),
        totalAllocated: allocatedAmount,
        perUserAmount: basePerUserAmount,
        eligibleUserCount: totalEligibleUsers,
    };
};

module.exports = {
    roundCurrency,
    calculateConfiguredAmount,
    creditRepurchaseIncome,
    distributeFundPool,
};
