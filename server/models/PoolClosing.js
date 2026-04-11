const mongoose = require("mongoose");

const poolClosingSchema = new mongoose.Schema(
    {
        periodType: {
            type: String,
            enum: ["weekly", "monthly"],
            required: true,
        },
        periodKey: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        periodStart: {
            type: Date,
            required: true,
        },
        periodEnd: {
            type: Date,
            required: true,
        },
        totalRepurchaseTurnover: {
            type: Number,
            default: 0,
        },
        poolPercent: {
            type: Number,
            default: 4,
        },
        totalPoolAmount: {
            type: Number,
            default: 0,
        },
        totalDiamondUsers: {
            type: Number,
            default: 0,
        },
        distributions: [
            {
                incomeType: {
                    type: String,
                    required: true,
                },
                allocationPercent: {
                    type: Number,
                    default: 0,
                },
                totalAllocated: {
                    type: Number,
                    default: 0,
                },
                perUserAmount: {
                    type: Number,
                    default: 0,
                },
                eligibleUserCount: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "completed",
        },
        processedAt: {
            type: Date,
            default: Date.now,
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        notes: {
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

poolClosingSchema.index({ periodStart: 1, periodEnd: 1 });
poolClosingSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("PoolClosing", poolClosingSchema);
