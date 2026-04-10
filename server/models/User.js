const mongoose = require("mongoose");

const normalizeTreePosition = (value) => {
    if (typeof value !== "string") return value;

    const normalized = value.trim().toLowerCase();
    return normalized === "left" || normalized === "right" ? normalized : value;
};

const userSchema = new mongoose.Schema(
    {
        sponsorId: {
            type: String,
            trim: true,
        },
        memberId: {
            type: String,
            unique: true,
            trim: true,
        },
        sponsorName: {
            type: String,
            trim: true,
        },
        userName: {
            type: String,
            trim: true,
        },
        fatherName: {
            type: String,
            trim: true,
        },
        position: {
            type: String,
            enum: ["Left", "Right", "left", "right"],
            set: normalizeTreePosition,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        mobile: {
            type: String,
            match: [/^\d{10}$/, "Invalid mobile number"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["user", "admin", "premium"],
            default: "user",
        },
        password: {
            type: String,
        },
        shippingAddress: {
            type: String,
        },
        state: {
            type: String,
        },
        district: {
            type: String,
        },
        assemblyArea: {
            type: String,
        },
        block: {
            type: String,
        },
        villageCouncil: {
            type: String,
        },
        village: {
            type: String,
        },
        joinDate: {
            type: Date,
            default: Date.now
        },
        activeStatus: {
            type: Boolean,
            default: false
        },
        packageType: {
            type: String,
            enum: ["none", "599", "1299", "2699"],
            default: "none"
        },
        pv: {
            type: Number,
            default: 0
        },
        bv: {
            type: Number,
            default: 0
        },
        walletBalance: {
            type: Number,
            default: 0
        },
        productWalletBalance: {
            type: Number,
            default: 0
        },
        repurchaseWalletBalance: {
            type: Number,
            default: 0
        },
        // Binary tree placement
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        leftColor: {
            pv: { type: Number, default: 0 },
            bv: { type: Number, default: 0 }
        },
        rightColor: {
            pv: { type: Number, default: 0 },
            bv: { type: Number, default: 0 }
        },
        left: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        leftChildId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        right: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        rightChildId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        otp: String,
        otpExpire: Date,
        grievances: [
            {
                ticket: String,
                subject: String,
                status: String,
                submittedDate: Date,
                category: String,
                message: String
            }
        ],
        profileImage: {
            type: String,
            default: null
        },
        kycStatus: {
            type: String,
            enum: ["Pending", "Submitted", "Verified", "Rejected"],
            default: "Pending"
        },
        aadharNumber: {
            type: String,
            trim: true
        },
        panNumber: {
            type: String,
            trim: true,
            uppercase: true
        },
        bankDetails: {
            accountNumber: String,
            ifscCode: String,
            bankName: String,
            upiId: String
        },
        kycDocuments: {
            aadharFront: String,
            aadharBack: String,
            panCard: String,
            passbook: String
        },
        kycMessage: {
            type: String
        },
        rank: {
            type: String,
            default: "Member"
        },
        leftTeamPV: {
            type: Number,
            default: 0
        },
        rightTeamPV: {
            type: Number,
            default: 0
        },
        totalLeftPV: {
            type: Number,
            default: 0
        },
        totalRightPV: {
            type: Number,
            default: 0
        },
        usedLeftPV: {
            type: Number,
            default: 0
        },
        usedRightPV: {
            type: Number,
            default: 0
        },
        totalMatchingBonus: {
            type: Number,
            default: 0
        },
        matchedPV: {
            type: Number,
            default: 0
        },
        firstPurchaseOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null
        },
        firstPurchaseProcessedAt: {
            type: Date,
            default: null
        },
        totalDirectIncome: {
            type: Number,
            default: 0
        },
        totalLevelIncome: {
            type: Number,
            default: 0
        },
        totalGenerationIncome: {
            type: Number,
            default: 0
        },
        dailyCapping: {
            type: Number,
            default: 0
        },
        dailyPV: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

// Add indexes for MLM relationship and performance optimization
userSchema.index({ sponsorId: 1 });
userSchema.index({ parentId: 1 });
userSchema.index({ parent: 1 });
userSchema.index({ leftChildId: 1 });
userSchema.index({ rightChildId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ activeStatus: 1 });

module.exports = mongoose.model("User", userSchema);
