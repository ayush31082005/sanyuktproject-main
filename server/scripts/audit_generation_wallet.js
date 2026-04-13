const dns = require("node:dns");
const path = require("node:path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Repurchase = require("../models/Repurchase");
const IncomeHistory = require("../models/IncomeHistory");
const WalletLedger = require("../models/WalletLedger");
const { placeRepurchaseOrder } = require("../services/repurchase/repurchaseOrderService");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const RUN_ID = `GW_AUDIT_${Date.now()}`;
const PASSWORD = "Audit@123";

const createAuditUser = async ({
    roleSuffix,
    sponsorMemberId = "",
    parentId = null,
    walletBalance = 0,
    repurchaseWalletBalance = 0,
}) => {
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    const memberId = `${RUN_ID}_${roleSuffix}`;

    return User.create({
        sponsorId: sponsorMemberId,
        sponsorName: sponsorMemberId,
        memberId,
        userName: memberId,
        email: `${memberId.toLowerCase()}@audit.local`,
        mobile: String(7000000000 + Math.floor(Math.random() * 999999)).slice(0, 10),
        password: hashedPassword,
        activeStatus: true,
        packageType: "1299",
        rank: "Member",
        parent: parentId,
        parentId,
        walletBalance,
        repurchaseWalletBalance,
        generationWalletBalance: 0,
        productWalletBalance: 0,
        shippingAddress: "Audit Address",
        state: "UP",
        district: "Audit",
    });
};

const getUserSnapshot = async (userId) => {
    const user = await User.findById(userId).lean();
    return {
        userId: String(user._id),
        memberId: user.memberId,
        walletBalance: Number(user.walletBalance || 0),
        repurchaseWalletBalance: Number(user.repurchaseWalletBalance || 0),
        generationWalletBalance: Number(user.generationWalletBalance || 0),
        totalGenerationIncome: Number(user.totalGenerationIncome || 0),
        totalSelfRepurchaseIncome: Number(user.totalSelfRepurchaseIncome || 0),
        totalSponsorIncome: Number(user.totalSponsorIncome || 0),
        totalRepurchaseLevelIncome: Number(user.totalRepurchaseLevelIncome || 0),
    };
};

const pickWalletLedger = async ({ userId, sourceType, sourceOrderId }) => {
    return WalletLedger.findOne({
        userId,
        sourceType,
        sourceId: sourceOrderId,
        txType: "credit",
    })
        .sort({ createdAt: -1 })
        .lean();
};

const pickIncomeLedger = async ({ userId, type, sourceOrderId, level = null }) => {
    const query = {
        userId,
        type,
        sourceOrderId,
    };

    if (level !== null) {
        query.level = level;
    }

    return IncomeHistory.findOne(query).sort({ createdAt: -1 }).lean();
};

const toResult = ({ name, pass, details, errors = [] }) => ({
    name,
    status: pass ? "PASS" : "FAIL",
    errors,
    details,
});

const assertIncomeToGenerationWallet = ({ incomeEntry, walletEntry, expectedAmount, sourceLabel }) => {
    const errors = [];

    if (!incomeEntry) {
        errors.push(`${sourceLabel}: income ledger entry missing`);
    } else {
        if (incomeEntry.walletType !== "generation-wallet") {
            errors.push(`${sourceLabel}: income ledger walletType is ${incomeEntry.walletType || "<empty>"}`);
        }
        if (Number(incomeEntry.amount || 0) !== Number(expectedAmount || 0)) {
            errors.push(`${sourceLabel}: income ledger amount mismatch`);
        }
    }

    if (!walletEntry) {
        errors.push(`${sourceLabel}: wallet ledger entry missing`);
    } else {
        if (walletEntry.walletType !== "generation-wallet") {
            errors.push(`${sourceLabel}: wallet ledger walletType is ${walletEntry.walletType}`);
        }
        if (walletEntry.txType !== "credit") {
            errors.push(`${sourceLabel}: wallet ledger txType is ${walletEntry.txType}`);
        }
        if (Number(walletEntry.amount || 0) !== Number(expectedAmount || 0)) {
            errors.push(`${sourceLabel}: wallet ledger amount mismatch`);
        }
    }

    return errors;
};

const cleanupAuditData = async ({ userIds, productId, orderIds }) => {
    if (orderIds.length) {
        await WalletLedger.deleteMany({
            $or: [{ sourceId: { $in: orderIds } }, { userId: { $in: userIds } }],
        });
        await IncomeHistory.deleteMany({
            $or: [{ sourceOrderId: { $in: orderIds } }, { userId: { $in: userIds } }],
        });
        await Repurchase.deleteMany({ orderId: { $in: orderIds } });
        await Order.deleteMany({ _id: { $in: orderIds } });
    } else {
        await WalletLedger.deleteMany({ userId: { $in: userIds } });
        await IncomeHistory.deleteMany({ userId: { $in: userIds } });
    }

    if (productId) {
        await Product.deleteOne({ _id: productId });
    }

    if (userIds.length) {
        await User.deleteMany({ _id: { $in: userIds } });
    }
};

const main = async () => {
    const created = {
        userIds: [],
        productId: null,
        orderIds: [],
    };

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 15000,
        });

        const level3 = await createAuditUser({ roleSuffix: "L3" });
        created.userIds.push(level3._id);

        const level2 = await createAuditUser({
            roleSuffix: "L2",
            sponsorMemberId: level3.memberId,
            parentId: level3._id,
        });
        created.userIds.push(level2._id);

        const sponsor = await createAuditUser({
            roleSuffix: "SPONSOR",
            sponsorMemberId: level2.memberId,
            parentId: level2._id,
        });
        created.userIds.push(sponsor._id);

        const buyer = await createAuditUser({
            roleSuffix: "BUYER",
            sponsorMemberId: sponsor.memberId,
            parentId: sponsor._id,
            repurchaseWalletBalance: 5000,
        });
        created.userIds.push(buyer._id);

        const product = await Product.create({
            name: `${RUN_ID}_PRODUCT`,
            price: 1000,
            oldPrice: 1100,
            bv: 200,
            stock: 100,
            image: "",
            description: "Generation wallet audit product",
            category: "Everyday needs",
            paymentMethods: ["cod", "upi", "card"],
        });
        created.productId = product._id;

        const before = {
            buyer: await getUserSnapshot(buyer._id),
            sponsor: await getUserSnapshot(sponsor._id),
            level2: await getUserSnapshot(level2._id),
            level3: await getUserSnapshot(level3._id),
        };

        const result = await placeRepurchaseOrder({
            userId: buyer._id,
            cart: [{ _id: product._id, quantity: 1 }],
            payFrom: "repurchase-wallet",
            orderTo: "self",
            shippingAddress: "Audit shipping address",
            accountPassword: PASSWORD,
            directSellerId: "",
        });

        const order = result.orders[0];
        created.orderIds.push(order._id);

        const after = {
            buyer: await getUserSnapshot(buyer._id),
            sponsor: await getUserSnapshot(sponsor._id),
            level2: await getUserSnapshot(level2._id),
            level3: await getUserSnapshot(level3._id),
        };

        const selfExpected = 10;
        const sponsorExpected = 20;
        const level1Expected = 30;
        const level2Expected = 20;
        const level3Expected = 10;

        const selfIncomeEntry = await pickIncomeLedger({
            userId: buyer._id,
            type: "self_repurchase",
            sourceOrderId: order._id,
        });
        const selfWalletEntry = await pickWalletLedger({
            userId: buyer._id,
            sourceType: "self_repurchase",
            sourceOrderId: order._id,
        });

        const sponsorIncomeEntry = await pickIncomeLedger({
            userId: sponsor._id,
            type: "sponsor_income",
            sourceOrderId: order._id,
        });
        const sponsorWalletEntry = await pickWalletLedger({
            userId: sponsor._id,
            sourceType: "sponsor_income",
            sourceOrderId: order._id,
        });

        const level1IncomeEntry = await pickIncomeLedger({
            userId: sponsor._id,
            type: "repurchase_level",
            sourceOrderId: order._id,
            level: 1,
        });
        const level1WalletEntry = await pickWalletLedger({
            userId: sponsor._id,
            sourceType: "repurchase_level",
            sourceOrderId: order._id,
        });

        const level2IncomeEntry = await pickIncomeLedger({
            userId: level2._id,
            type: "repurchase_level",
            sourceOrderId: order._id,
            level: 2,
        });
        const level2WalletEntry = await pickWalletLedger({
            userId: level2._id,
            sourceType: "repurchase_level",
            sourceOrderId: order._id,
        });

        const level3IncomeEntry = await pickIncomeLedger({
            userId: level3._id,
            type: "repurchase_level",
            sourceOrderId: order._id,
            level: 3,
        });
        const level3WalletEntry = await pickWalletLedger({
            userId: level3._id,
            sourceType: "repurchase_level",
            sourceOrderId: order._id,
        });

        const eWalletIncomeCount = await IncomeHistory.countDocuments({
            sourceOrderId: order._id,
            type: { $in: ["self_repurchase", "sponsor_income", "repurchase_level"] },
            walletType: "e-wallet",
        });

        const eWalletLedgerCount = await WalletLedger.countDocuments({
            sourceId: order._id,
            sourceType: { $in: ["self_repurchase", "sponsor_income", "repurchase_level"] },
            walletType: "e-wallet",
            txType: "credit",
        });

        const tests = [];

        {
            const errors = assertIncomeToGenerationWallet({
                incomeEntry: selfIncomeEntry,
                walletEntry: selfWalletEntry,
                expectedAmount: selfExpected,
                sourceLabel: "self_repurchase",
            });

            tests.push(
                toResult({
                    name: "Test 1 - self_repurchase income",
                    pass:
                        errors.length === 0 &&
                        after.buyer.generationWalletBalance - before.buyer.generationWalletBalance === selfExpected,
                    errors,
                    details: {
                        walletBefore: before.buyer,
                        walletAfter: after.buyer,
                        creditedWallet: selfWalletEntry?.walletType || null,
                        incomeLedgerEntry: selfIncomeEntry,
                        walletLedgerEntry: selfWalletEntry,
                    },
                })
            );
        }

        {
            const errors = assertIncomeToGenerationWallet({
                incomeEntry: sponsorIncomeEntry,
                walletEntry: sponsorWalletEntry,
                expectedAmount: sponsorExpected,
                sourceLabel: "sponsor_income",
            });

            tests.push(
                toResult({
                    name: "Test 2 - sponsor_income to sponsor",
                    pass:
                        errors.length === 0 &&
                        after.sponsor.generationWalletBalance - before.sponsor.generationWalletBalance ===
                            sponsorExpected + level1Expected,
                    errors,
                    details: {
                        walletBefore: before.sponsor,
                        walletAfter: after.sponsor,
                        creditedWallet: sponsorWalletEntry?.walletType || null,
                        incomeLedgerEntry: sponsorIncomeEntry,
                        walletLedgerEntry: sponsorWalletEntry,
                    },
                })
            );
        }

        {
            const levelErrors = [
                ...assertIncomeToGenerationWallet({
                    incomeEntry: level1IncomeEntry,
                    walletEntry: level1WalletEntry,
                    expectedAmount: level1Expected,
                    sourceLabel: "repurchase_level:L1",
                }),
                ...assertIncomeToGenerationWallet({
                    incomeEntry: level2IncomeEntry,
                    walletEntry: level2WalletEntry,
                    expectedAmount: level2Expected,
                    sourceLabel: "repurchase_level:L2",
                }),
                ...assertIncomeToGenerationWallet({
                    incomeEntry: level3IncomeEntry,
                    walletEntry: level3WalletEntry,
                    expectedAmount: level3Expected,
                    sourceLabel: "repurchase_level:L3",
                }),
            ];

            tests.push(
                toResult({
                    name: "Test 3 - repurchase_level income L1-L3",
                    pass:
                        levelErrors.length === 0 &&
                        after.level2.generationWalletBalance - before.level2.generationWalletBalance === level2Expected &&
                        after.level3.generationWalletBalance - before.level3.generationWalletBalance === level3Expected,
                    errors: levelErrors,
                    details: {
                        sponsorLevel1: {
                            walletBefore: before.sponsor,
                            walletAfter: after.sponsor,
                            creditedWallet: level1WalletEntry?.walletType || null,
                            incomeLedgerEntry: level1IncomeEntry,
                            walletLedgerEntry: level1WalletEntry,
                        },
                        sponsorLevel2: {
                            walletBefore: before.level2,
                            walletAfter: after.level2,
                            creditedWallet: level2WalletEntry?.walletType || null,
                            incomeLedgerEntry: level2IncomeEntry,
                            walletLedgerEntry: level2WalletEntry,
                        },
                        sponsorLevel3: {
                            walletBefore: before.level3,
                            walletAfter: after.level3,
                            creditedWallet: level3WalletEntry?.walletType || null,
                            incomeLedgerEntry: level3IncomeEntry,
                            walletLedgerEntry: level3WalletEntry,
                        },
                    },
                })
            );
        }

        {
            const errors = [];

            if (after.buyer.repurchaseWalletBalance !== before.buyer.repurchaseWalletBalance - 1000) {
                errors.push("buyer repurchase wallet debit mismatch");
            }
            if (after.buyer.walletBalance !== before.buyer.walletBalance) {
                errors.push("buyer e-wallet changed unexpectedly");
            }
            if (eWalletIncomeCount > 0) {
                errors.push(`income ledger has ${eWalletIncomeCount} e-wallet repurchase income entries`);
            }
            if (eWalletLedgerCount > 0) {
                errors.push(`wallet ledger has ${eWalletLedgerCount} e-wallet repurchase income credits`);
            }

            tests.push(
                toResult({
                    name: "Test 4 - wallet before/after validation",
                    pass: errors.length === 0,
                    errors,
                    details: {
                        buyerBefore: before.buyer,
                        buyerAfter: after.buyer,
                        sponsorBefore: before.sponsor,
                        sponsorAfter: after.sponsor,
                        level2Before: before.level2,
                        level2After: after.level2,
                        level3Before: before.level3,
                        level3After: after.level3,
                        order: {
                            orderId: String(order._id),
                            totalAmount: result.totalAmount,
                            totalBV: result.totalBV,
                            walletUsed: result.walletUsed,
                            balanceAfter: result.balanceAfter,
                        },
                    },
                })
            );
        }

        const issues = [];

        if (eWalletIncomeCount > 0 || eWalletLedgerCount > 0) {
            issues.push("Repurchase income touched e-wallet, which is incorrect.");
        }

        console.log(
            JSON.stringify(
                {
                    runId: RUN_ID,
                    summary: {
                        passCount: tests.filter((test) => test.status === "PASS").length,
                        failCount: tests.filter((test) => test.status === "FAIL").length,
                    },
                    calculatedExpectations: {
                        orderTotal: 1000,
                        orderBV: 200,
                        self_repurchase: selfExpected,
                        sponsor_income: sponsorExpected,
                        repurchase_level_l1: level1Expected,
                        repurchase_level_l2: level2Expected,
                        repurchase_level_l3: level3Expected,
                    },
                    issues,
                    tests,
                },
                null,
                2
            )
        );
    } finally {
        await cleanupAuditData(created);
        await mongoose.connection.close();
    }
};

main().catch(async (error) => {
    console.error(error);
    try {
        await mongoose.connection.close();
    } catch (_) {
        // ignore close errors during failure path
    }
    process.exit(1);
});
