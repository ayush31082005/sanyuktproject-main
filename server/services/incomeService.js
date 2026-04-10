const IncomeHistory = require("../models/IncomeHistory");

const createIncomeEntry = async ({
    userId,
    type,
    amount,
    matchedPV = 0,
    sourceUserId = null,
    sourceOrderId = null,
    fromUserId = null,
    level = null,
    description = "",
    meta = {},
    session = null,
}) => {
    const numericAmount = Number(amount || 0);
    if (numericAmount <= 0) {
        return null;
    }

    const [incomeEntry] = await IncomeHistory.create(
        [
            {
                userId,
                type,
                amount: numericAmount,
                matchedPV: Number(matchedPV || 0),
                sourceUserId,
                sourceOrderId,
                fromUserId: fromUserId || sourceUserId || null,
                level,
                description,
                meta,
            },
        ],
        { session }
    );

    return incomeEntry;
};

module.exports = {
    createIncomeEntry,
};
