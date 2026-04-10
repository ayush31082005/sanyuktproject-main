const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    shippingInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        landmark: String
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online", "upi", "card", "product-wallet", "e-wallet", "repurchase-wallet"],
        default: "cod"
    },
    orderType: {
        type: String,
        enum: ["standard", "first", "repurchase"],
        default: "standard",
        index: true,
    },
    orderTo: {
        type: String,
        enum: ["admin", "franchise", "self"],
        default: "self",
    },
    directSellerId: {
        type: String,
        trim: true,
        default: "",
    },
    subtotal: Number,
    shipping: Number,
    tax: Number,
    discount: Number,
    total: Number,
    bv: {
        type: Number,
        default: 0
    },
    pv: {
        type: Number,
        default: 0
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
        type: String,
        enum: ["pending", "paid", "processing", "shipped", "reached_store", "out_for_delivery", "delivered", "cancelled", "backorder"],
        default: "pending"
    },
    tracking: [{
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now }
    }],
    binaryProcessStatus: {
        type: String,
        enum: ["pending", "processed", "skipped", "failed"],
        default: "pending"
    },
    binaryProcessedAt: {
        type: Date,
        default: null
    },
    binaryProcessNote: {
        type: String,
        default: ""
    },
    mlmPackageType: {
        type: String,
        enum: ["", "599", "1299", "2699"],
        default: ""
    },
    mlmPV: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
