const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    walletType: {
        type: String,
        enum: ['e-wallet', 'product-wallet', 'repurchase-wallet', 'generation-wallet'],
        default: 'e-wallet'
    },
    referenceNo: {
        type: String,
        unique: true
    },
    requestedAmount: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        required: true
    },
    tdsAmount: {
        type: Number,
        default: 0
    },
    processingFee: {
        type: Number,
        default: 0
    },
    method: {
        type: String,
        enum: ['Bank Transfer', 'UPI'],
        required: true
    },
    // Bank Transfer details
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
    // UPI details
    upiId: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Rejected'],
        default: 'Pending'
    },
    processedDate: { type: Date },
    adminNote: { type: String }
}, { timestamps: true });

// Auto-generate referenceNo before save
withdrawalSchema.pre('save', async function () {
    if (!this.referenceNo) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.referenceNo = `WDL-${timestamp}-${random}`;
    }
});

withdrawalSchema.index({ userId: 1 });
withdrawalSchema.index({ userId: 1, walletType: 1 });
withdrawalSchema.index({ status: 1 });
withdrawalSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
