const User = require("../models/User");
const IncomeHistory = require("../models/IncomeHistory");
const WalletLedger = require("../models/WalletLedger");
const {
    REPURCHASE_INCOME_TYPES,
    REPURCHASE_WALLET_TYPE,
} = require("../config/repurchaseBonusConfig");

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

const SHARED_WALLET_TYPES = ["generation-wallet", "repurchase-wallet"];
const roundCurrency = (value) => Number(Number(value || 0).toFixed(2));

const isSharedWalletType = (walletType) =>
    REPURCHASE_WALLET_TYPE === "generation-wallet" &&
    SHARED_WALLET_TYPES.includes(normalizeWalletType(walletType));

const getSharedWalletMirrorType = (walletType) => {
    const normalizedWalletType = normalizeWalletType(walletType);

    if (!isSharedWalletType(normalizedWalletType)) {
        return null;
    }

    return normalizedWalletType === "generation-wallet"
        ? "repurchase-wallet"
        : "generation-wallet";
};

const resolveWalletField = (walletType) => {
    const normalized = normalizeWalletType(walletType);
    const walletField = WALLET_FIELDS[normalized];

    if (!walletField) {
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }

    return { normalizedWalletType: normalized, walletField };
};

const deriveLegacyIncomeBalance = async (userId, walletType, { session = null } = {}) => {
    const legacyIncomeTypeMap = {
        "generation-wallet": Array.from(
            new Set([
                "Generation",
                ...(REPURCHASE_WALLET_TYPE === "generation-wallet"
                    ? ["Repurchase", ...REPURCHASE_INCOME_TYPES]
                    : []),
            ])
        ),
    };

    const legacyTypes = legacyIncomeTypeMap[walletType] || [];
    if (!legacyTypes.length) {
        return 0;
    }

    const latestLedgerQuery = WalletLedger.findOne({ userId, walletType }).sort({
        createdAt: -1,
    });
    if (session) {
        latestLedgerQuery.session(session);
    }

    const incomeAggregate = IncomeHistory.aggregate([
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
    ]);
    if (session) {
        incomeAggregate.session(session);
    }

    const [latestLedgerEntry, incomeTotals] = await Promise.all([
        latestLedgerQuery,
        incomeAggregate,
    ]);

    if (latestLedgerEntry) {
        return Number(latestLedgerEntry.balanceAfter || 0);
    }

    return Number(incomeTotals[0]?.total || 0);
};

const resolveSharedWalletBalance = async (
    userId,
    user,
    { session = null, persistSharedBalance = false } = {}
) => {
    let targetUser = user;

    if (
        !targetUser ||
        targetUser.generationWalletBalance === undefined ||
        targetUser.repurchaseWalletBalance === undefined
    ) {
        const sharedUserQuery = User.findById(userId).select(
            "generationWalletBalance repurchaseWalletBalance"
        );
        if (session) {
            sharedUserQuery.session(session);
        }
        targetUser = await sharedUserQuery;
    }

    if (!targetUser) {
        throw new Error("User not found");
    }

    const rawGenerationBalance = roundCurrency(targetUser.generationWalletBalance || 0);
    const rawRepurchaseBalance = roundCurrency(targetUser.repurchaseWalletBalance || 0);

    const [legacyGenerationBalance, latestRepurchaseLedgerEntry] = await Promise.all([
        rawGenerationBalance > 0
            ? 0
            : deriveLegacyIncomeBalance(userId, "generation-wallet", { session }),
        rawRepurchaseBalance > 0
            ? null
            : (() => {
                  const latestRepurchaseQuery = WalletLedger.findOne({
                      userId,
                      walletType: "repurchase-wallet",
                  }).sort({ createdAt: -1 });
                  if (session) {
                      latestRepurchaseQuery.session(session);
                  }
                  return latestRepurchaseQuery;
              })(),
    ]);

    const effectiveGenerationBalance =
        rawGenerationBalance > 0
            ? rawGenerationBalance
            : roundCurrency(legacyGenerationBalance);
    const effectiveRepurchaseBalance =
        rawRepurchaseBalance > 0
            ? rawRepurchaseBalance
            : roundCurrency(latestRepurchaseLedgerEntry?.balanceAfter || 0);
    const sharedBalance = roundCurrency(
        Math.max(effectiveGenerationBalance, effectiveRepurchaseBalance)
    );

    if (
        persistSharedBalance &&
        (rawGenerationBalance !== sharedBalance ||
            rawRepurchaseBalance !== sharedBalance)
    ) {
        targetUser.generationWalletBalance = sharedBalance;
        targetUser.repurchaseWalletBalance = sharedBalance;
        await targetUser.save(session ? { session } : undefined);
    }

    return {
        user: targetUser,
        balance: sharedBalance,
        generationBalance: effectiveGenerationBalance,
        repurchaseBalance: effectiveRepurchaseBalance,
    };
};

const resolveCurrentWalletBalance = async (
    userId,
    walletType,
    user,
    { session = null, persistSharedBalance = true } = {}
) => {
    const { walletField, normalizedWalletType } = resolveWalletField(walletType);
    const rawBalance = Number(user?.[walletField] || 0);

    if (isSharedWalletType(normalizedWalletType)) {
        const sharedWalletSummary = await resolveSharedWalletBalance(userId, user, {
            session,
            persistSharedBalance,
        });

        return {
            walletType: normalizedWalletType,
            walletField,
            balance: sharedWalletSummary.balance,
        };
    }

    if (rawBalance <= 0 && normalizedWalletType === "generation-wallet") {
        const legacyBalance = await deriveLegacyIncomeBalance(
            userId,
            normalizedWalletType,
            { session }
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

const getWalletBalance = async (userId, walletType, options = {}) => {
    const { walletField } = resolveWalletField(walletType);
    const userQuery = User.findById(userId).select(
        isSharedWalletType(walletType)
            ? "generationWalletBalance repurchaseWalletBalance"
            : walletField
    );

    if (options.session) {
        userQuery.session(options.session);
    }

    const user = await userQuery;

    if (!user) {
        throw new Error("User not found");
    }

    return resolveCurrentWalletBalance(userId, walletType, user, options);
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

        const mirroredWalletType = getSharedWalletMirrorType(normalizedWalletType);
        if (mirroredWalletType) {
            const { walletField: mirroredWalletField } =
                resolveWalletField(mirroredWalletType);
            user[mirroredWalletField] = balanceAfter;
        }

        await user.save();

        if (mirroredWalletType) {
            await WalletLedger.create({
                userId,
                walletType: mirroredWalletType,
                txType,
                amount: numericAmount,
                balanceBefore,
                balanceAfter,
                sourceType,
                entryType: entryType || sourceType,
                sourceId,
                referenceId,
                description,
                meta: {
                    ...meta,
                    mirroredFromWalletType: normalizedWalletType,
                },
            });
        }
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
    resolveCurrentWalletBalance,
    getWalletBalance,
    createWalletLedgerEntry,
    isSharedWalletType,
    getSharedWalletMirrorType,
};
