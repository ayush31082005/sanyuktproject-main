const User = require("../models/User");
const WalletLedger = require("../models/WalletLedger");
const { resolveWalletField } = require("../utils/walletLedgerUtils");

const creditWallet = async ({
    userId,
    amount,
    walletType = "e-wallet",
    sourceType = "manual",
    sourceId = null,
    description = "",
    meta = {},
    session = null,
}) => {
    const numericAmount = Number(amount || 0);
    if (numericAmount <= 0) {
        return null;
    }

    const { walletField, normalizedWalletType } = resolveWalletField(walletType);
    const user = await User.findById(userId).session(session);

    if (!user) {
        throw new Error("User not found");
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
                sourceId,
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
};
