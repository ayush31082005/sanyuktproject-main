const { createIncomeEntry } = require("./incomeService");

const createIncomeLedgerEntry = async ({
    userId,
    incomeType,
    amount,
    walletType = "",
    matchedPV = 0,
    sourceUserId = null,
    sourceOrderId = null,
    fromUserId = null,
    levelNo = null,
    description = "",
    remark = "",
    referenceId = "",
    meta = {},
    session = null,
}) =>
    createIncomeEntry({
        userId,
        type: incomeType,
        amount,
        walletType,
        matchedPV,
        sourceUserId,
        sourceOrderId,
        fromUserId,
        level: levelNo,
        description,
        remark,
        referenceId,
        meta,
        session,
    });

module.exports = {
    createIncomeLedgerEntry,
};
