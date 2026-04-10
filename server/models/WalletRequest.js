const mongoose = require("mongoose");

const walletRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        walletType: {
            type: String,
            enum: ["product-wallet", "repurchase-wallet"],
            required: true,
            index: true,
        },
        bankName: {
            type: String,
            trim: true,
            default: "",
        },
        bankDetails: {
            type: String,
            trim: true,
            default: "",
        },
        paymentMode: {
            type: String,
            enum: ["IMPS", "UPI", "NEFT", "RTGS", "DD", "Cheque"],
            default: "UPI",
        },
        currentBalance: {
            type: Number,
            default: 0,
        },
        requestAmount: {
            type: Number,
            required: true,
            min: 1,
        },
        remark: {
            type: String,
            trim: true,
            default: "",
        },
        attachment: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
            index: true,
        },
        adminNote: {
            type: String,
            trim: true,
            default: "",
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        approvedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

walletRequestSchema.index({ userId: 1, walletType: 1, createdAt: -1 });

module.exports = mongoose.model("WalletRequest", walletRequestSchema);
