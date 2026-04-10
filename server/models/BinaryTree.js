const mongoose = require("mongoose");

const normalizeTreePosition = (value) => {
    if (typeof value !== "string") return value;

    const normalized = value.trim().toLowerCase();
    return normalized === "left" || normalized === "right" ? normalized : value;
};

const binaryTreeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true
        },
        sponsorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        leftId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        rightId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        position: {
            type: String,
            enum: ["Left", "Right", "left", "right"],
            default: null,
            set: normalizeTreePosition
        },
        leftPV: { type: Number, default: 0 },
        rightPV: { type: Number, default: 0 },
        matchedPV: { type: Number, default: 0 },
        leftCarryForward: { type: Number, default: 0 },
        rightCarryForward: { type: Number, default: 0 },
        leftBV: { type: Number, default: 0 },
        rightBV: { type: Number, default: 0 },
        totalLeft: { type: Number, default: 0 },
        totalRight: { type: Number, default: 0 }
    },
    { timestamps: true }
);

binaryTreeSchema.index({ parentId: 1 });
binaryTreeSchema.index({ leftId: 1 });
binaryTreeSchema.index({ rightId: 1 });
binaryTreeSchema.index({ sponsorId: 1 });

module.exports = mongoose.model("BinaryTree", binaryTreeSchema);
