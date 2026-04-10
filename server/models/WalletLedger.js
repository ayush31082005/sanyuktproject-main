const mongoose = require("mongoose");

const walletLedgerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        walletType: {
            type: String,
            enum: ["e-wallet", "product-wallet", "repurchase-wallet", "generation-wallet"],
            required: true,
            index: true,
        },
        txType: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        balanceBefore: {
            type: Number,
            default: 0,
        },
        balanceAfter: {
            type: Number,
            default: 0,
        },
        sourceType: {
            type: String,
            default: "manual",
            index: true,
        },
        sourceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        description: {
            type: String,
            default: "",
        },
        meta: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

walletLedgerSchema.index({ userId: 1, walletType: 1, createdAt: -1 });

module.exports = mongoose.model("WalletLedger", walletLedgerSchema);
