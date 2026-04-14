const User = require("../models/User");
const WalletLedger = require("../models/WalletLedger");
const {
    resolveWalletField,
    resolveCurrentWalletBalance,
    getSharedWalletMirrorType,
} = require("../utils/walletLedgerUtils");

const buildLedgerPayload = ({
    userId,
    walletType,
    txType,
    amount,
    balanceBefore,
    balanceAfter,
    sourceType,
    entryType,
    sourceId,
    referenceId,
    description,
    meta,
}) => ({
    userId,
    walletType,
    txType,
    amount,
    balanceBefore,
    balanceAfter,
    sourceType,
    entryType: entryType || sourceType,
    sourceId,
    referenceId: referenceId || "",
    description,
    meta,
});

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

    const { balance } = await resolveCurrentWalletBalance(userId, normalizedWalletType, user, {
        session,
    });
    const balanceBefore = Number(balance || 0);
    const balanceAfter = balanceBefore + numericAmount;
    const mirroredWalletType = getSharedWalletMirrorType(normalizedWalletType);

    user[walletField] = balanceAfter;
    if (mirroredWalletType) {
        const { walletField: mirroredWalletField } = resolveWalletField(mirroredWalletType);
        user[mirroredWalletField] = balanceAfter;
    }
    await user.save({ session });

    const ledgerRows = [
        buildLedgerPayload({
            userId,
            walletType: normalizedWalletType,
            txType: "credit",
            amount: numericAmount,
            balanceBefore,
            balanceAfter,
            sourceType,
            entryType,
            sourceId,
            referenceId,
            description,
            meta,
        }),
    ];

    if (mirroredWalletType) {
        ledgerRows.push(
            buildLedgerPayload({
                userId,
                walletType: mirroredWalletType,
                txType: "credit",
                amount: numericAmount,
                balanceBefore,
                balanceAfter,
                sourceType,
                entryType,
                sourceId,
                referenceId,
                description,
                meta: {
                    ...meta,
                    mirroredFromWalletType: normalizedWalletType,
                },
            })
        );
    }

    const createdEntries = await WalletLedger.create(ledgerRows, { session });
    const ledgerEntry =
        createdEntries.find((entry) => entry.walletType === normalizedWalletType) ||
        createdEntries[0];

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

    const { balance } = await resolveCurrentWalletBalance(userId, normalizedWalletType, user, {
        session,
    });
    const balanceBefore = Number(balance || 0);
    if (balanceBefore < numericAmount) {
        const error = new Error(`Insufficient ${normalizedWalletType} balance`);
        error.statusCode = 400;
        throw error;
    }

    const balanceAfter = balanceBefore - numericAmount;
    const mirroredWalletType = getSharedWalletMirrorType(normalizedWalletType);

    user[walletField] = balanceAfter;
    if (mirroredWalletType) {
        const { walletField: mirroredWalletField } = resolveWalletField(mirroredWalletType);
        user[mirroredWalletField] = balanceAfter;
    }
    await user.save({ session });

    const ledgerRows = [
        buildLedgerPayload({
            userId,
            walletType: normalizedWalletType,
            txType: "debit",
            amount: numericAmount,
            balanceBefore,
            balanceAfter,
            sourceType,
            entryType,
            sourceId,
            referenceId,
            description,
            meta,
        }),
    ];

    if (mirroredWalletType) {
        ledgerRows.push(
            buildLedgerPayload({
                userId,
                walletType: mirroredWalletType,
                txType: "debit",
                amount: numericAmount,
                balanceBefore,
                balanceAfter,
                sourceType,
                entryType,
                sourceId,
                referenceId,
                description,
                meta: {
                    ...meta,
                    mirroredFromWalletType: normalizedWalletType,
                },
            })
        );
    }

    const createdEntries = await WalletLedger.create(ledgerRows, { session });
    const ledgerEntry =
        createdEntries.find((entry) => entry.walletType === normalizedWalletType) ||
        createdEntries[0];

    return ledgerEntry;
};

module.exports = {
    creditWallet,
    debitWallet,
};
