const User = require("../models/User");
const WalletLedger = require("../models/WalletLedger");
const { resolveWalletField } = require("../utils/walletLedgerUtils");

const creditWallet = async ({
    userId,
    amount,
    walletType = "e-wallet",
    sourceType = "manual",
    entryType = "",
    sourceId = null,
    referenceId = "",
    description = "",
    meta = {},
    session = null,
}) => {
    const numericAmount = Number(Number(amount || 0).toFixed(2));
    if (numericAmount <= 0) {
        return null;
    }

    const { walletField, normalizedWalletType } = resolveWalletField(walletType);
    const user = await User.findById(userId).session(session);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const balanceBefore = Number(user[walletField] || 0);
    const balanceAfter = balanceBefore + numericAmount;

    user[walletField] = balanceAfter;
    await user.save({ session });

    const [ledgerEntry] = await WalletLedger.create(
        [
            {
                userId,
                walletType: normalizedWalletType,
                txType: "credit",
                amount: numericAmount,
                balanceBefore,
                balanceAfter,
                sourceType,
                entryType: entryType || sourceType,
                sourceId,
                referenceId: referenceId || "",
                description,
                meta,
            },
        ],
        { session }
    );

    return ledgerEntry;
};

const debitWallet = async ({
    userId,
    amount,
    walletType = "e-wallet",
    sourceType = "manual",
    entryType = "",
    sourceId = null,
    referenceId = "",
    description = "",
    meta = {},
    session = null,
}) => {
    const numericAmount = Number(Number(amount || 0).toFixed(2));
    if (numericAmount <= 0) {
        return null;
    }

    const { walletField, normalizedWalletType } = resolveWalletField(walletType);
    const user = await User.findById(userId).session(session);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const balanceBefore = Number(user[walletField] || 0);
    if (balanceBefore < numericAmount) {
        const error = new Error(`Insufficient ${normalizedWalletType} balance`);
        error.statusCode = 400;
        throw error;
    }

    const balanceAfter = balanceBefore - numericAmount;

    user[walletField] = balanceAfter;
    await user.save({ session });

    const [ledgerEntry] = await WalletLedger.create(
        [
            {
                userId,
                walletType: normalizedWalletType,
                txType: "debit",
                amount: numericAmount,
                balanceBefore,
                balanceAfter,
                sourceType,
                entryType: entryType || sourceType,
                sourceId,
                referenceId: referenceId || "",
                description,
                meta,
            },
        ],
        { session }
    );

    return ledgerEntry;
};

module.exports = {
    creditWallet,
    debitWallet,
};
