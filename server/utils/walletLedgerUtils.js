const User = require("../models/User");
const IncomeHistory = require("../models/IncomeHistory");
const WalletLedger = require("../models/WalletLedger");

const WALLET_FIELDS = {
    "e-wallet": "walletBalance",
    "product-wallet": "productWalletBalance",
    "repurchase-wallet": "repurchaseWalletBalance",
    "generation-wallet": "generationWalletBalance",
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

const deriveLegacyIncomeBalance = async (userId, walletType) => {
    const legacyIncomeTypeMap = {
        "generation-wallet": ["Generation"],
        "repurchase-wallet": ["Repurchase"],
    };

    const legacyTypes = legacyIncomeTypeMap[walletType] || [];
    if (!legacyTypes.length) {
        return 0;
    }

    const [latestLedgerEntry, incomeTotals] = await Promise.all([
        WalletLedger.findOne({ userId, walletType }).sort({ createdAt: -1 }),
        IncomeHistory.aggregate([
            {
                $match: {
                    userId,
                    type: { $in: legacyTypes },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                },
            },
        ]),
    ]);

    if (latestLedgerEntry) {
        return Number(latestLedgerEntry.balanceAfter || 0);
    }

    return Number(incomeTotals[0]?.total || 0);
};

const resolveCurrentWalletBalance = async (userId, walletType, user) => {
    const { walletField, normalizedWalletType } = resolveWalletField(walletType);
    const rawBalance = Number(user?.[walletField] || 0);

    if (
        rawBalance <= 0 &&
        (normalizedWalletType === "generation-wallet" ||
            normalizedWalletType === "repurchase-wallet")
    ) {
        const legacyBalance = await deriveLegacyIncomeBalance(
            userId,
            normalizedWalletType
        );

        if (legacyBalance > 0) {
            return {
                walletType: normalizedWalletType,
                walletField,
                balance: legacyBalance,
            };
        }
    }

    return {
        walletType: normalizedWalletType,
        walletField,
        balance: rawBalance,
    };
};

const getWalletBalance = async (userId, walletType) => {
    const { walletField } = resolveWalletField(walletType);
    const user = await User.findById(userId).select(walletField);

    if (!user) {
        throw new Error("User not found");
    }

    return resolveCurrentWalletBalance(userId, walletType, user);
};

const createWalletLedgerEntry = async ({
    userId,
    walletType,
    txType,
    amount,
    sourceType,
    sourceId = null,
    entryType = "",
    referenceId = "",
    description = "",
    meta = {},
    skipBalanceUpdate = false,
}) => {
    const numericAmount = Number(amount || 0);

    if (!numericAmount || numericAmount <= 0) {
        throw new Error("Ledger amount must be greater than zero");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const {
        walletField,
        walletType: normalizedWalletType,
        balance,
    } = await resolveCurrentWalletBalance(userId, walletType, user);

    const balanceBefore = Number(balance || 0);
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
        entryType,
        sourceId,
        referenceId,
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
