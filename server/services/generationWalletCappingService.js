const mongoose = require("mongoose");
const User = require("../models/User");
const IncomeHistory = require("../models/IncomeHistory");

const roundCurrency = (value) => Number(Number(value || 0).toFixed(2));

const getStartOfDay = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return start;
};

const resolveGenerationWalletCreditAmount = async ({
    userId,
    amount,
    session = null,
}) => {
    const requestedAmount = roundCurrency(amount);

    if (!userId || requestedAmount <= 0) {
        return {
            requestedAmount,
            amount: 0,
            cappedAmount: 0,
            cappingLimit: 0,
            cappingUsed: 0,
            remainingCapBeforeCredit: 0,
            remainingCapAfterCredit: 0,
            capApplied: false,
            skipped: true,
            reason: "invalid_amount",
        };
    }

    const user = await User.findById(userId)
        .select("dailyCapping")
        .session(session);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const cappingLimit = roundCurrency(user.dailyCapping || 0);

    // If no package cap is configured, keep the legacy unlimited behavior.
    if (cappingLimit <= 0) {
        return {
            requestedAmount,
            amount: requestedAmount,
            cappedAmount: 0,
            cappingLimit: 0,
            cappingUsed: 0,
            remainingCapBeforeCredit: requestedAmount,
            remainingCapAfterCredit: requestedAmount,
            capApplied: false,
            skipped: false,
            reason: "no_capping_configured",
        };
    }

    const normalizedUserId =
        typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

    const todayIncomeQuery = IncomeHistory.aggregate([
        {
            $match: {
                userId: normalizedUserId,
                walletType: "generation-wallet",
                createdAt: { $gte: getStartOfDay() },
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
            },
        },
    ]);

    if (session) {
        todayIncomeQuery.session(session);
    }

    const todayIncomeRows = await todayIncomeQuery;
    const cappingUsed = roundCurrency(todayIncomeRows[0]?.totalAmount || 0);
    const remainingCapBeforeCredit = roundCurrency(
        Math.max(0, cappingLimit - cappingUsed)
    );

    if (remainingCapBeforeCredit <= 0) {
        return {
            requestedAmount,
            amount: 0,
            cappedAmount: requestedAmount,
            cappingLimit,
            cappingUsed,
            remainingCapBeforeCredit: 0,
            remainingCapAfterCredit: 0,
            capApplied: true,
            skipped: true,
            reason: "daily_capping_reached",
        };
    }

    const payableAmount = roundCurrency(
        Math.min(requestedAmount, remainingCapBeforeCredit)
    );
    const cappedAmount = roundCurrency(requestedAmount - payableAmount);

    return {
        requestedAmount,
        amount: payableAmount,
        cappedAmount,
        cappingLimit,
        cappingUsed,
        remainingCapBeforeCredit,
        remainingCapAfterCredit: roundCurrency(
            Math.max(0, remainingCapBeforeCredit - payableAmount)
        ),
        capApplied: cappedAmount > 0,
        skipped: payableAmount <= 0,
        reason: cappedAmount > 0 ? "partially_capped" : "within_capping",
    };
};

module.exports = {
    resolveGenerationWalletCreditAmount,
};
