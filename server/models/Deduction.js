const mongoose = require('mongoose');

const deductionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    walletType: {
        type: String,
        enum: ['e-wallet', 'product-wallet', 'repurchase-wallet', 'generation-wallet', ''],
        default: '',
    },
    referenceNo: {
        type: String,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Tax', 'Fee', 'Admin'],
        required: true
    },
    // Tax = TDS/Service Tax, Fee = Processing Fee, Admin = Admin Charges
    description: { type: String },
    relatedWithdrawalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Withdrawal'
    },
    status: {
        type: String,
        enum: ['Processed', 'Pending'],
        default: 'Processed'
    }
}, { timestamps: true });

// Auto-generate referenceNo before save
deductionSchema.pre('save', async function () {
    if (!this.referenceNo) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.referenceNo = `${this.type.toUpperCase().slice(0, 3)}-${timestamp}-${random}`;
    }
});

deductionSchema.index({ userId: 1 });
deductionSchema.index({ userId: 1, walletType: 1 });
deductionSchema.index({ type: 1 });
deductionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Deduction', deductionSchema);
