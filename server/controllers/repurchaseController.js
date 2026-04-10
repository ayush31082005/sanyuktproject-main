const Repurchase = require("../models/Repurchase");
const RepurchaseLevelIncome = require("../models/RepurchaseLevelIncome");
const BinaryTree = require("../models/BinaryTree");
const User = require("../models/User");
const IncomeHistory = require("../models/IncomeHistory");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const { createWalletLedgerEntry, getWalletBalance, normalizeWalletType } = require("../utils/walletLedgerUtils");

// ✅ FIX 3: Plan ke hisaab se sahi commission rates
// Gen 1: 15%, Gen 2: 10%, Gen 3: 5%, Gen 4-7: 2.5%, Gen 8-12: 1.25%, Gen 13-20: 0.75%
const REPURCHASE_GENERATION_CONFIG = [
    { gen: 1, percent: 15.00 },
    { gen: 2, percent: 10.00 },
    { gen: 3, percent: 5.00 },
    { gen: 4, percent: 2.50 },
    { gen: 5, percent: 2.50 },
    { gen: 6, percent: 2.50 },
    { gen: 7, percent: 2.50 },
    { gen: 8, percent: 1.25 },
    { gen: 9, percent: 1.25 },
    { gen: 10, percent: 1.25 },
    { gen: 11, percent: 1.25 },
    { gen: 12, percent: 1.25 },
    { gen: 13, percent: 0.75 },
    { gen: 14, percent: 0.75 },
    { gen: 15, percent: 0.75 },
    { gen: 16, percent: 0.75 },
    { gen: 17, percent: 0.75 },
    { gen: 18, percent: 0.75 },
    { gen: 19, percent: 0.75 },
    { gen: 20, percent: 0.75 },
];

const BV_PER_REPURCHASE = 300; // Plan ke hisaab se fixed

// ============================================================
// MAIN FUNCTION - Order hone par call hoga orderController se
// ============================================================
exports.processRepurchaseGenerationIncome = async (repurchaseId) => {
    try {
        const repurchase = await Repurchase.findById(repurchaseId);
        if (!repurchase) throw new Error("Repurchase not found");

        const buyerUser = await User.findById(repurchase.userId);
        if (!buyerUser) throw new Error("Buyer user not found");

        let currentParentId = buyerUser.parent;
        let generation = 1;

        while (currentParentId && generation <= 20) {
            const parentUser = await User.findById(currentParentId);
            if (!parentUser) break;

            // Sirf active users ko income milegi
            if (parentUser.activeStatus) {
                const config = REPURCHASE_GENERATION_CONFIG[generation - 1];
                const commissionAmount = (BV_PER_REPURCHASE * config.percent) / 100;

                // Duplicate check - same repurchase + same generation + same user
                const alreadyProcessed = await RepurchaseLevelIncome.findOne({
                    repurchaseId: repurchase._id,
                    userId: parentUser._id,
                    generation: generation,
                });

                if (!alreadyProcessed) {
                    await RepurchaseLevelIncome.create({
                        userId: parentUser._id,
                        fromUserId: repurchase.userId,
                        repurchaseId: repurchase._id,
                        generation: generation,
                        bv: BV_PER_REPURCHASE,
                        commissionPercent: config.percent,
                        commissionAmount: commissionAmount,
                        status: "credited",
                    });

                    await createWalletLedgerEntry({
                        userId: parentUser._id,
                        walletType: "e-wallet",
                        txType: "credit",
                        amount: commissionAmount,
                        sourceType: "repurchase-generation-income",
                        sourceId: repurchase._id,
                        description: `Generation ${generation} repurchase income`,
                        meta: {
                            generation,
                            fromUserId: repurchase.userId,
                            repurchaseId: repurchase._id,
                            commissionPercent: config.percent,
                        },
                    });

                    await User.findByIdAndUpdate(parentUser._id, {
                        $inc: {
                            totalGenerationIncome: commissionAmount,
                        },
                    });

                    await IncomeHistory.create({
                        userId: parentUser._id,
                        fromUserId: repurchase.userId,
                        amount: commissionAmount,
                        type: "Repurchase",
                        level: generation,
                        description: `Generation ${generation} repurchase income (${config.percent}%) from ${buyerUser.memberId || buyerUser._id}`,
                    });

                    console.log(`✅ Gen ${generation} | ₹${commissionAmount} → ${parentUser.memberId || parentUser._id}`);
                }
            }

            currentParentId = parentUser.parent;
            generation++;
        }

        console.log(`🎉 Repurchase Generation Income complete for repurchaseId: ${repurchaseId}`);
    } catch (error) {
        console.error("❌ processRepurchaseGenerationIncome Error:", error.message);
        throw error;
    }
};

// ============================================================
// PLACE REPURCHASE ORDER (NEW UI)
// POST /api/repurchase/place
// Body: { cart, payFrom, orderTo, shippingAddress, accountPassword, directSellerId }
// ============================================================
exports.placeRepurchaseOrder = async (req, res) => {
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

        const normalizedWalletType = normalizeWalletType(payFrom);
        if (!["product-wallet", "repurchase-wallet", "e-wallet"].includes(normalizedWalletType)) {
            return res.status(400).json({ message: "Invalid wallet selected" });
        }

        // Total calculate karo
        const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0);
        const totalBV = cart.reduce((sum, item) => sum + ((Number(item.bv || 0)) * Number(item.quantity || 0)), 0);

        const currentWallet = await getWalletBalance(req.user._id, normalizedWalletType);
        if (currentWallet.balance < totalAmount) {
            const walletLabel =
                normalizedWalletType === "product-wallet"
                    ? "Product wallet"
                    : normalizedWalletType === "repurchase-wallet"
                        ? "Repurchase wallet"
                        : "E-wallet";

            return res.status(400).json({
                message: `${walletLabel} mein insufficient balance. Available: Rs ${currentWallet.balance}, Required: Rs ${totalAmount}`,
            });
        }

        // Har product ke liye Repurchase + Order record banao
        const createdRepurchases = [];
        const createdOrders = [];
        for (const item of cart) {
            const productId = item._id || item.id;
            const itemBV = item.bv || BV_PER_REPURCHASE;
            const itemTotal = item.price * item.quantity;

            // Order record
            const order = await Order.create({
                user: req.user._id,
                product: productId,
                quantity: item.quantity,
                shippingInfo: { address: shippingAddress },
                paymentMethod: normalizedWalletType,
                total: itemTotal,
                subtotal: itemTotal,
                bv: itemBV * item.quantity,
                pv: (itemBV * item.quantity) / 1000,
                orderType: 'repurchase',
                orderTo: orderTo || 'self',
                directSellerId: directSellerId || "",
                status: 'pending',
                tracking: [{ status: 'pending', message: 'Repurchase order placed', timestamp: new Date() }]
            });

            createdOrders.push(order);

            // Repurchase record
            const repurchase = await Repurchase.create({
                userId: req.user._id,
                orderId: order._id,
                amount: itemTotal,
                bv: itemBV * item.quantity || BV_PER_REPURCHASE,
                status: 'completed',
            });

            createdRepurchases.push(repurchase);

            // Generation income trigger (non-blocking)
            exports.processRepurchaseGenerationIncome(repurchase._id).catch(err =>
                console.error("❌ Generation income error:", err.message)
            );
        }

        const walletLedger = await createWalletLedgerEntry({
            userId: req.user._id,
            walletType: normalizedWalletType,
            txType: "debit",
            amount: totalAmount,
            sourceType: "repurchase-order",
            sourceId: createdOrders[0]?._id || null,
            description: `Repurchase order payment (${createdOrders.length} item(s))`,
            meta: {
                orderIds: createdOrders.map((order) => order._id),
                orderTo: orderTo || "self",
                directSellerId: directSellerId || "",
            },
        });

        // Confirmation email (non-blocking)
        try {
            const orderIdShort = createdRepurchases[0]._id.toString().slice(-8).toUpperCase();
            const productNames = cart.map(i => `${i.name} x${i.quantity}`).join(', ');
            const subject = `Repurchase Confirmed: #${orderIdShort} - Sanyukt Parivaar`;
            const text = `Dear ${user.userName || user.memberId},\n\nAapka repurchase order confirm ho gaya hai!\n\nOrder ID: #${orderIdShort}\nProducts: ${productNames}\nTotal Amount: ₹${totalAmount}\nPayment From: ${payFrom}\n\nThank you for choosing Sanyukt Parivaar!\nEmpowering Lives, Together.`;
            sendEmail(user.email, subject, text).catch(err =>
                console.error("❌ Email error:", err.message)
            );
        } catch (emailErr) {
            console.error("❌ Email prep error:", emailErr.message);
        }

        res.status(201).json({
            message: "Repurchase order successfully placed!",
            repurchases: createdRepurchases,
            totalAmount,
            totalBV,
            walletUsed: normalizedWalletType,
            balanceAfter: walletLedger.balanceAfter,
        });

    } catch (error) {
        console.error("❌ Repurchase order error:", error);
        res.status(500).json({ message: "Repurchase order place karne mein error aaya" });
    }
};

// ============================================================
// GET - Frontend ke liye: User ka self repurchase report
// ============================================================
exports.getSelfRepurchaseIncome = async (req, res) => {
    try {
        const userId = req.user._id;

        const repurchaseOrders = await Order.find({ user: userId, orderType: "repurchase" })
            .select("_id total bv createdAt status")
            .sort({ createdAt: -1 })
            .lean();

        const repurchaseOrderIds = repurchaseOrders.map((order) => order._id);

        const repurchases = await Repurchase.find({
            userId,
            orderId: { $in: repurchaseOrderIds },
        })
            .populate("orderId", "_id total bv status createdAt orderType")
            .sort({ createdAt: -1 })
            .limit(50);

        const summary = repurchases.reduce(
            (acc, item) => {
                acc.totalAmount += Number(item.amount || 0);
                acc.totalBV += Number(item.bv || 0);
                acc.totalRecords += 1;
                return acc;
            },
            { totalAmount: 0, totalBV: 0, totalRecords: 0 }
        );

        res.status(200).json({
            success: true,
            data: {
                totalSelfRepurchase: summary.totalAmount,
                totalBV: summary.totalBV,
                totalRecords: summary.totalRecords,
                recentRepurchases: repurchases,
            },
        });
    } catch (error) {
        console.error("GetSelfRepurchaseIncome Error:", error);
        res.status(500).json({ success: false, message: error.message || "Server error" });
    }
};

// ============================================================
// GET - Frontend ke liye: User ki generation income summary
// ============================================================
exports.getRepurchaseLevelIncome = async (req, res) => {
    try {
        const userId = req.user._id;

        // Total income
        const totalResult = await RepurchaseLevelIncome.aggregate([
            { $match: { userId: userId, status: "credited" } },
            { $group: { _id: null, total: { $sum: "$commissionAmount" } } },
        ]);

        // Active downline (unique members jinse income aayi)
        const activeDownline = await RepurchaseLevelIncome.distinct("fromUserId", {
            userId: userId,
        });

        // Generation-wise breakdown (frontend cards ke liye)
        const generationBreakdown = await RepurchaseLevelIncome.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: "$generation",
                    totalIncome: { $sum: "$commissionAmount" },
                    totalBV: { $sum: "$bv" },
                    memberCount: { $addToSet: "$fromUserId" },
                    commissionPercent: { $first: "$commissionPercent" },
                },
            },
            {
                $project: {
                    generation: "$_id",
                    totalIncome: 1,
                    totalBV: 1,
                    downlineMembers: { $size: "$memberCount" },
                    commissionPercent: 1,
                    _id: 0,
                },
            },
            { $sort: { generation: 1 } },
        ]);

        // Recent transactions (table ke liye)
        const recentTransactions = await RepurchaseLevelIncome.find({ userId })
            .populate("fromUserId", "name userName mobile memberId")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            data: {
                totalLevelIncome: totalResult[0]?.total || 0,
                activeDownline: activeDownline.length,
                activeLevels: generationBreakdown.length,
                generationBreakdown,
                recentTransactions,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
