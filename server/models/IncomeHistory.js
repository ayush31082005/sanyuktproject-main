const mongoose = require('mongoose');

const incomeHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    // ✅ FIX 2: 'Repurchase' type add kiya enum mein
    type: {
        type: String,
        enum: [
            'Direct',
            'Level',
            'Matching',
            'ProfitSharing',
            'Generation',
            'Repurchase',
            'Refund',
            'silver_matching',
            'gold_matching',
            'diamond_matching',
            'self_repurchase',
            'repurchase_level',
            'sponsor_income',
            'royalty_bonus',
            'house_fund',
            'leadership_fund',
            'car_fund',
            'travel_fund',
            'bike_fund',
        ],
        required: true
    },
    walletType: {
        type: String,
        enum: ['e-wallet', 'product-wallet', 'repurchase-wallet', 'generation-wallet', ''],
        default: '',
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sourceUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    sourceOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: null
    },
    level: {
        type: Number
    },
    matchedPV: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    remark: {
        type: String,
        default: '',
    },
    referenceId: {
        type: String,
        trim: true,
        default: '',
    },
    meta: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

incomeHistorySchema.index({ userId: 1 });
incomeHistorySchema.index({ type: 1 });
incomeHistorySchema.index({ createdAt: -1 });
incomeHistorySchema.index({ sourceUserId: 1 });
incomeHistorySchema.index({ sourceOrderId: 1 });
incomeHistorySchema.index({ referenceId: 1 });
incomeHistorySchema.index(
    { userId: 1, type: 1, referenceId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            referenceId: { $type: 'string', $gt: '' },
        },
    }
);

module.exports = mongoose.model('IncomeHistory', incomeHistorySchema);
