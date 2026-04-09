const Order = require("../models/Order");
const Product = require("../models/Product");
const Repurchase = require("../models/Repurchase");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { processOrderMLM } = require("../utils/mlmOrderUtils");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// ✅ Import repurchase income processor
const { processRepurchaseGenerationIncome } = require("./repurchaseController");

// Initialize Razorpay lazily to prevent server crash if keys are missing
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}
console.log("[DEBUG] RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("[DEBUG] RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing");

// ================= CREATE ORDER (OLD - Razorpay based) =================
exports.createOrder = async (req, res) => {
    try {
        const {
            product: productId,
            quantity,
            shippingInfo,
            paymentMethod,
            subtotal,
            shipping,
            tax,
            discount,
            total,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        const effectivePaymentMethod = paymentMethod || (razorpay_payment_id ? "online" : "cod");
        const validMethods = ["cod", "online", "upi", "card"];
        if (!validMethods.includes(effectivePaymentMethod)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        // Verify payment if online
        if (effectivePaymentMethod !== 'cod') {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest("hex");

            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({ message: "Invalid payment signature" });
            }

            try {
                const orderDetails = await razorpay.orders.fetch(razorpay_order_id);
                const actualPaid = orderDetails.amount / 100;
                if (Math.abs(actualPaid - Number(total)) > 0.01) {
                    return res.status(400).json({ message: "Payment amount mismatch. Fraudulent request detected." });
                }
            } catch (err) {
                console.error("Failed to fetch razorpay order:", err);
                return res.status(500).json({ message: "Failed to verify transaction amount." });
            }
        }

        const productData = await Product.findById(productId);
        if (!productData) {
            return res.status(404).json({ message: "Product not found" });
        }

        const orderBv = (productData.bv || 0) * (quantity || 1);
        const orderPv = orderBv / 1000;

        const order = new Order({
            user: req.user._id,
            product: productId,
            quantity,
            shippingInfo,
            paymentMethod: effectivePaymentMethod,
            subtotal,
            shipping,
            tax,
            discount,
            total,
            bv: orderBv,
            pv: orderPv,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            status: effectivePaymentMethod === 'cod' ? 'pending' : 'paid',
            orderType: 'first',
            tracking: [{
                status: effectivePaymentMethod === 'cod' ? 'pending' : 'paid',
                message: effectivePaymentMethod === 'cod' ? 'Order placed successfully' : 'Payment successful and order placed',
                timestamp: new Date()
            }]
        });

        await order.save();

        processOrderMLM(req.user._id, orderBv, orderPv);

        try {
            const newRepurchase = await Repurchase.create({
                userId: req.user._id,
                orderId: order._id,
                amount: total,
                bv: 300,
                status: 'completed',
            });

            processRepurchaseGenerationIncome(newRepurchase._id).catch(err =>
                console.error("❌ Repurchase income error:", err.message)
            );
        } catch (repurchaseErr) {
            console.error("❌ Repurchase create skipped:", repurchaseErr.message);
        }

        try {
            const userEmail = req.user.email;
            const orderIdShort = order._id.toString().slice(-8).toUpperCase();
            const subject = `Order Confirmed: #${orderIdShort} - Sanyukt Parivaar`;
            const text = `Dear ${req.user.name},\n\nThank you for your order!\n\nOrder ID: #${orderIdShort}\nProduct: ${productData.name}\nQuantity: ${quantity}\nTotal Amount: ₹${total}\nPayment Method: ${effectivePaymentMethod.toUpperCase()}\n\nThank you for choosing Sanyukt Parivaar!`;

            sendEmail(userEmail, subject, text).catch(err =>
                console.error("❌ Failed to send order success email:", err.message)
            );
        } catch (emailErr) {
            console.error("❌ Email data preparation error:", emailErr.message);
        }

        res.status(201).json(order);
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ message: "Failed to place order" });
    }
};

// ================= PLACE FIRST PURCHASE (NEW UI) =================
// POST /api/orders/first-purchase
// Body: { cart: [{_id, name, price, bv, quantity}], payFrom, orderTo, shippingAddress, accountPassword, directSellerId }
exports.placeFirstPurchase = async (req, res) => {
    try {
        const { cart, payFrom, orderTo, shippingAddress, accountPassword, directSellerId } = req.body;

        // Validations
        if (!cart || cart.length === 0)
            return res.status(400).json({ message: "Cart empty hai, koi product select karo" });
        if (!payFrom)
            return res.status(400).json({ message: "Pay From wallet select karo" });
        if (!shippingAddress || shippingAddress.trim() === '')
            return res.status(400).json({ message: "Shipping address enter karo" });
        if (!accountPassword)
            return res.status(400).json({ message: "Account password enter karo" });

        // Password verify
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(accountPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Account password galat hai" });

        // Total calculate karo
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalBV = cart.reduce((sum, item) => sum + ((item.bv || 0) * item.quantity), 0);
        const totalPV = totalBV / 1000;

        // Wallet balance check aur deduct
        if (payFrom === 'product-wallet') {
            if ((user.productWalletBalance || 0) < totalAmount)
                return res.status(400).json({ message: `Product wallet mein insufficient balance. Available: ₹${user.productWalletBalance || 0}, Required: ₹${totalAmount}` });
            user.productWalletBalance -= totalAmount;
        } else if (payFrom === 'e-wallet') {
            if ((user.walletBalance || 0) < totalAmount)
                return res.status(400).json({ message: `E-wallet mein insufficient balance. Available: ₹${user.walletBalance || 0}, Required: ₹${totalAmount}` });
            user.walletBalance -= totalAmount;
        } else {
            return res.status(400).json({ message: "Invalid wallet selected" });
        }

        await user.save();

        // Har product ke liye alag Order create karo
        const createdOrders = [];
        for (const item of cart) {
            // Product DB mein verify karo (agar _id available hai)
            let productId = item._id || item.id;
            let productBV = item.bv || 0;

            if (productId) {
                const productData = await Product.findById(productId);
                if (productData) productBV = productData.bv || 0;
            }

            const order = await Order.create({
                user: req.user._id,
                product: productId,
                quantity: item.quantity,
                shippingInfo: { address: shippingAddress },
                paymentMethod: payFrom === 'product-wallet' ? 'product-wallet' : 'e-wallet',
                total: item.price * item.quantity,
                subtotal: item.price * item.quantity,
                bv: productBV * item.quantity,
                pv: (productBV * item.quantity) / 1000,
                orderType: 'first',
                orderTo: orderTo || 'self',
                status: 'pending',
                tracking: [{ status: 'pending', message: 'First purchase order placed', timestamp: new Date() }]
            });

            createdOrders.push(order);
        }

        // MLM income trigger karo (non-blocking)
        try {
            processOrderMLM(req.user._id, totalBV, totalPV);
        } catch (mlmErr) {
            console.error("❌ MLM trigger error:", mlmErr.message);
        }

        // Repurchase record + generation income (non-blocking)
        try {
            const newRepurchase = await Repurchase.create({
                userId: req.user._id,
                orderId: createdOrders[0]._id,
                amount: totalAmount,
                bv: totalBV || 300,
                status: 'completed',
            });

            processRepurchaseGenerationIncome(newRepurchase._id).catch(err =>
                console.error("❌ Generation income error:", err.message)
            );
        } catch (repErr) {
            console.error("❌ Repurchase record skipped:", repErr.message);
        }

        // Confirmation email (non-blocking)
        try {
            const orderIdShort = createdOrders[0]._id.toString().slice(-8).toUpperCase();
            const productNames = cart.map(i => `${i.name} x${i.quantity}`).join(', ');
            const subject = `First Purchase Confirmed: #${orderIdShort} - Sanyukt Parivaar`;
            const text = `Dear ${user.userName || user.memberId},\n\nAapka first purchase order confirm ho gaya hai!\n\nOrder ID: #${orderIdShort}\nProducts: ${productNames}\nTotal Amount: ₹${totalAmount}\nPayment From: ${payFrom}\n\nThank you for choosing Sanyukt Parivaar!\nEmpowering Lives, Together.`;
            sendEmail(user.email, subject, text).catch(err =>
                console.error("❌ Email error:", err.message)
            );
        } catch (emailErr) {
            console.error("❌ Email prep error:", emailErr.message);
        }

        res.status(201).json({
            message: "First purchase order successfully placed!",
            orders: createdOrders,
            totalAmount,
            totalBV,
            walletUsed: payFrom
        });

    } catch (error) {
        console.error("First purchase error:", error);
        res.status(500).json({ message: "Order place karne mein error aaya" });
    }
};

// ================= CREATE RAZORPAY ORDER =================
exports.createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!razorpay) {
            return res.status(503).json({ message: "Payment service unavailable. Please configure Razorpay keys." });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_product_${Date.now()}`
        };

        const razorpayOrder = await razorpay.orders.create(options);
        res.status(200).json({
            ...razorpayOrder,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        res.status(500).json({ message: "Failed to create payment order" });
    }
};

// ================= GET LOGGED IN USER ORDERS =================
exports.myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("product", "name image price")
            .sort("-createdAt");

        res.json(orders);
    } catch (error) {
        console.error("Fetch orders error:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// ================= GET SINGLE ORDER =================
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("product", "name image price")
            .populate("user", "name email");

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ================= ADMIN: GET ALL ORDERS =================
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("product", "name image price")
            .populate("user", "name email")
            .sort("-createdAt");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ================= ADMIN: UPDATE STATUS =================
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = req.body.status;
        order.tracking.push({
            status: req.body.status,
            message: req.body.message || `Order status updated to ${req.body.status}`,
            timestamp: new Date()
        });

        await order.save();
        res.json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};