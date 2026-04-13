const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Repurchase = require("../../models/Repurchase");
const User = require("../../models/User");
const { debitWallet } = require("../walletService");
const { normalizeWalletType } = require("../../utils/walletLedgerUtils");
const { processSelfRepurchaseBonus } = require("./selfRepurchaseService");
const { processSponsorIncome } = require("./sponsorIncomeService");
const { processRepurchaseLevelIncome } = require("./repurchaseLevelIncomeService");

const ALLOWED_REPURCHASE_WALLETS = ["product-wallet", "repurchase-wallet", "e-wallet"];
const createHttpError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const normalizeCartItems = async (cart = [], { session = null } = {}) => {
    const productIds = cart.map((item) => item?._id || item?.id).filter(Boolean);

    if (!productIds.length) {
        throw createHttpError(400, "Cart empty hai, koi product select karo");
    }

    const products = await Product.find({ _id: { $in: productIds } }).session(session).lean();
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    return cart.map((item) => {
        const productId = String(item?._id || item?.id || "");
        const product = productMap.get(productId);

        if (!product) {
            throw createHttpError(404, `Product not found for cart item ${productId}`);
        }

        const quantity = Math.max(1, Number(item.quantity || 1));
        const price = Number(product.price || 0);
        const bvPerUnit = Number(product.bv || 0);

        return {
            product,
            productId: product._id,
            quantity,
            itemTotal: Number((price * quantity).toFixed(2)),
            itemBV: Number((bvPerUnit * quantity).toFixed(2)),
        };
    });
};

const placeRepurchaseOrder = async ({
    userId,
    cart,
    payFrom,
    orderTo,
    shippingAddress,
    accountPassword,
    directSellerId,
}) => {
    if (!Array.isArray(cart) || cart.length === 0) {
        throw createHttpError(400, "Cart empty hai, koi product select karo");
    }

    if (!payFrom) {
        throw createHttpError(400, "Pay From wallet select karo");
    }

    if (!shippingAddress || !String(shippingAddress).trim()) {
        throw createHttpError(400, "Shipping address enter karo");
    }

    if (!accountPassword) {
        throw createHttpError(400, "Account password enter karo");
    }

    const normalizedWalletType = normalizeWalletType(payFrom);
    if (!ALLOWED_REPURCHASE_WALLETS.includes(normalizedWalletType)) {
        throw createHttpError(400, "Invalid wallet selected");
    }

    const session = await mongoose.startSession();

    try {
        let result;

        await session.withTransaction(async () => {
            const user = await User.findById(userId)
                .select(
                    "password sponsorId parent parentId userName memberId email mobile shippingAddress state district walletBalance productWalletBalance repurchaseWalletBalance generationWalletBalance selfRepurchaseBV selfRepurchaseAmount"
                )
                .session(session);

            if (!user) {
                throw createHttpError(404, "User not found");
            }

            const isMatch = await bcrypt.compare(accountPassword, user.password || "");
            if (!isMatch) {
                throw createHttpError(401, "Account password galat hai");
            }

            const normalizedItems = await normalizeCartItems(cart, { session });
            const totalAmount = Number(
                normalizedItems.reduce((sum, item) => sum + item.itemTotal, 0).toFixed(2)
            );
            const totalBV = Number(
                normalizedItems.reduce((sum, item) => sum + item.itemBV, 0).toFixed(2)
            );

            const walletLedger = await debitWallet({
                userId: user._id,
                amount: totalAmount,
                walletType: normalizedWalletType,
                sourceType: "repurchase_order_payment",
                entryType: "repurchase_order_payment",
                referenceId: `repurchase-order-batch:${Date.now()}:${user._id}`,
                description: `Repurchase order payment (${normalizedItems.length} item(s))`,
                meta: {
                    orderTo: orderTo || "self",
                    directSellerId: directSellerId || "",
                },
                session,
            });

            const createdOrders = [];
            const createdRepurchases = [];
            const payoutSummary = [];

            for (const item of normalizedItems) {
                const order = new Order({
                    user: user._id,
                    product: item.productId,
                    quantity: item.quantity,
                    shippingInfo: {
                        fullName: user.userName || "",
                        email: user.email || "",
                        phone: user.mobile || "",
                        address: String(shippingAddress).trim(),
                        city: user.district || "",
                        state: user.state || "",
                    },
                    paymentMethod: normalizedWalletType,
                    orderType: "repurchase",
                    orderTo: orderTo || "self",
                    directSellerId: directSellerId || "",
                    subtotal: item.itemTotal,
                    shipping: 0,
                    tax: 0,
                    discount: 0,
                    total: item.itemTotal,
                    bv: item.itemBV,
                    pv: Number((item.itemBV / 1000).toFixed(2)),
                    status: "paid",
                    tracking: [
                        {
                            status: "paid",
                            message: "Repurchase order placed and paid from wallet",
                            timestamp: new Date(),
                        },
                    ],
                });

                await order.save({ session });
                createdOrders.push(order);

                const repurchaseRows = await Repurchase.create(
                    [
                        {
                            userId: user._id,
                            orderId: order._id,
                            amount: item.itemTotal,
                            walletType: normalizedWalletType,
                            bv: item.itemBV,
                            referenceId: `repurchase:${order._id}`,
                            status: "completed",
                        },
                    ],
                    { session }
                );

                const repurchaseDoc = repurchaseRows[0];
                createdRepurchases.push(repurchaseDoc);

                const selfIncome = await processSelfRepurchaseBonus({
                    buyer: user,
                    order,
                    repurchase: repurchaseDoc,
                    session,
                });

                const sponsorIncome = await processSponsorIncome({
                    buyer: user,
                    order,
                    repurchase: repurchaseDoc,
                    session,
                });

                const levelIncome = await processRepurchaseLevelIncome({
                    buyer: user,
                    order,
                    repurchase: repurchaseDoc,
                    session,
                });

                payoutSummary.push({
                    orderId: order._id,
                    repurchaseId: repurchaseDoc._id,
                    selfIncome,
                    sponsorIncome,
                    levelIncome,
                });
            }

            user.selfRepurchaseBV = Number(user.selfRepurchaseBV || 0) + totalBV;
            user.selfRepurchaseAmount = Number(user.selfRepurchaseAmount || 0) + totalAmount;
            await user.save({ session });

            result = {
                message: "Repurchase order successfully placed!",
                orders: createdOrders,
                repurchases: createdRepurchases,
                totalAmount,
                totalBV,
                walletUsed: normalizedWalletType,
                balanceAfter: walletLedger?.balanceAfter || 0,
                payoutSummary,
            };
        });

        return result;
    } finally {
        await session.endSession();
    }
};

module.exports = {
    placeRepurchaseOrder,
};
