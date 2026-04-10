const User = require("../models/User");
const WalletLedger = require("../models/WalletLedger");

const WALLET_FIELDS = {
    "e-wallet": "walletBalance",
    "product-wallet": "productWalletBalance",
    "repurchase-wallet": "repurchaseWalletBalance",
    "generation-wallet": "walletBalance",
};

const normalizeWalletType = (walletType) => {
    if (!walletType) {
        return "e-wallet";
    }

    const map = {
        ewallet: "e-wallet",
        "e-wallet": "e-wallet",
        product: "product-wallet",
        "product-wallet": "product-wallet",
        repurchase: "repurchase-wallet",
        "repurchase-wallet": "repurchase-wallet",
        generation: "generation-wallet",
        "generation-wallet": "generation-wallet",
    };

    return map[String(walletType).toLowerCase()] || walletType;
};

const resolveWalletField = (walletType) => {
    const normalized = normalizeWalletType(walletType);
    const walletField = WALLET_FIELDS[normalized];

    if (!walletField) {
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }

    return { normalizedWalletType: normalized, walletField };
};

const getWalletBalance = async (userId, walletType) => {
    const { walletField, normalizedWalletType } = resolveWalletField(walletType);
    const user = await User.findById(userId).select(walletField);

    if (!user) {
        throw new Error("User not found");
    }

    return {
        walletType: normalizedWalletType,
        balance: Number(user[walletField] || 0),
    };
};

const createWalletLedgerEntry = async ({
    userId,
    walletType,
    txType,
    amount,
    sourceType,
    sourceId = null,
    description = "",
    meta = {},
    skipBalanceUpdate = false,
}) => {
    const numericAmount = Number(amount || 0);

    if (!numericAmount || numericAmount <= 0) {
        throw new Error("Ledger amount must be greater than zero");
    }

    const { walletField, normalizedWalletType } = resolveWalletField(walletType);
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const balanceBefore = Number(user[walletField] || 0);
    let balanceAfter = balanceBefore;

    if (!skipBalanceUpdate) {
        if (txType === "debit") {
            if (balanceBefore < numericAmount) {
                throw new Error(`Insufficient ${normalizedWalletType} balance`);
            }

            balanceAfter = balanceBefore - numericAmount;
        } else if (txType === "credit") {
            balanceAfter = balanceBefore + numericAmount;
        } else {
            throw new Error("Invalid ledger transaction type");
        }

        user[walletField] = balanceAfter;
        await user.save();
    }

    const ledgerEntry = await WalletLedger.create({
        userId,
        walletType: normalizedWalletType,
        txType,
        amount: numericAmount,
        balanceBefore,
        balanceAfter,
        sourceType,
        sourceId,
        description,
        meta,
    });

    return {
        ledgerEntry,
        balanceBefore,
        balanceAfter,
        walletType: normalizedWalletType,
    };
};

module.exports = {
    WALLET_FIELDS,
    normalizeWalletType,
    resolveWalletField,
    getWalletBalance,
    createWalletLedgerEntry,
};
