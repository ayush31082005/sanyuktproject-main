const mongoose = require("mongoose");
const User = require("../models/User");
const IncomeHistory = require("../models/IncomeHistory");
const Rank = require("../models/Rank");
const Repurchase = require("../models/Repurchase");
const BinaryTree = require("../models/BinaryTree");
const Order = require("../models/Order");
const Withdrawal = require("../models/Withdrawal");
const { processPendingMatchingForAllUsers } = require("../services/matchingService");
const {
    REPURCHASE_INCOME_TYPES,
    REPURCHASE_WALLET_TYPE,
} = require("../config/repurchaseBonusConfig");
const { getWalletBalance, createWalletLedgerEntry } = require("../utils/walletLedgerUtils");

exports.calculateDailyMatchingBonus = async () => {
    try {
        const results = await processPendingMatchingForAllUsers();

        for (const result of results) {
            if (!result?.matched || !result?.userId) {
                continue;
            }

            const user = await User.findById(result.userId);
            if (user) {
                await exports.checkAndUpgradeRank(user);
            }
        }

        return results;
    } catch (error) {
        console.error("calculateDailyMatchingBonus error:", error);
        throw error;
    }
};

exports.updateAllRanks = async () => {
    try {
        const users = await User.find({ activeStatus: true, packageType: { $ne: "none" } });
        for (const user of users) {
            await exports.checkAndUpgradeRank(user);
        }
        for (const user of users) {
            await exports.checkAndUpgradeRank(user);
        }
    } catch (error) {
        throw error;
    }
};

const RANKS = [
    { name: "Bronze", pv: 5, reward: "Bronze Badge + Company Catalog" },
    { name: "Silver", pv: 25, reward: "Rs1200" },
    { name: "Gold", pv: 50, reward: "Rs2500" },
    { name: "Platinum", pv: 100, reward: "Rs5000 + NT" },
    { name: "Star", pv: 200, reward: "Rs10000 + NT" },
    { name: "Ruby", pv: 500, reward: "Rs50000" },
    { name: "Sapphire", pv: 1000, reward: "Rs100000 + India Trip" },
    { name: "Star Sapphire", pv: 2500, reward: "Rs500000 + India Trip Couple" },
    { name: "Emerald", pv: 6000, reward: "Rs700000" },
    { name: "Diamond", pv: 30000, reward: "Rs1000000" },
    { name: "Double Diamond", pv: 70000, reward: "Rs1500000" },
    { name: "Blue Diamond", pv: 125000, reward: "Rs30 Lakh" },
    { name: "Ambassador", pv: 300000, reward: "Rs1cr" },
    { name: "Crown", pv: 700000, reward: "Rs2.5cr" },
    { name: "MD", pv: 1500000, reward: "Rs5cr" },
];

exports.checkAndUpgradeRank = async (user) => {
    try {
        const eligibleRanks = RANKS.filter((rank) => user.matchedPV >= rank.pv);

        for (const rank of eligibleRanks) {
            const existingRank = await Rank.findOne({ userId: user._id, rankName: rank.name });
            if (!existingRank) {
                await Rank.create({
                    userId: user._id,
                    rankName: rank.name,
                    reward: rank.reward,
                });

                user.rank = rank.name;
                await user.save();
            }
        }
    } catch (error) {
    }
};

exports.distributeProfitSharing = async (totalTurnover) => {
    try {
        const bonusPool = totalTurnover * 0.04;
        const activeUsers = await User.find({ activeStatus: true, packageType: { $ne: "none" } });
        const totalSystemPV = activeUsers.reduce((sum, user) => sum + (user.pv || 0), 0);

        if (totalSystemPV === 0) {
            return;
        }

        for (const user of activeUsers) {
            const userShare = (user.pv / totalSystemPV) * bonusPool;
            if (userShare > 0) {
                user.walletBalance += userShare;
                await user.save();

                await IncomeHistory.create({
                    userId: user._id,
                    amount: userShare,
                    type: "ProfitSharing",
                    description: "Profit sharing bonus from turnover pool",
                });
            }
        }
    } catch (error) {
    }
};

exports.getMLMStats = async (req, res) => {
    try {
        const targetUserId =
            req.user.role === "admin" && req.params.userId ? req.params.userId : req.user._id;
        console.log("Fetching MLM stats for user:", targetUserId);
        const user = await User.findById(targetUserId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let tree = await BinaryTree.findOne({ userId: user._id });

        if (!tree) {
            const totalLeft = await exports.countDownline(user.left);
            const totalRight = await exports.countDownline(user.right);

            const sponsorObj = await User.findOne({
                memberId: (user.sponsorId || "").toUpperCase(),
            });

            tree = await BinaryTree.create({
                userId: user._id,
                parentId: user.parentId,
                sponsorId: sponsorObj?._id,
                position: user.position || "Left",
                totalLeft,
                totalRight,
                leftPV: user.leftTeamPV || 0,
                rightPV: user.rightTeamPV || 0,
            }).catch(() => null);
        }
        console.log("BinaryTree record available:", tree ? "Yes" : "No");

        const userId = new mongoose.Types.ObjectId(user._id);
        const purchaseAggregate = await Order.aggregate([
            { $match: { user: userId, status: { $ne: "cancelled" } } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$total" },
                    orderCount: { $sum: 1 },
                },
            },
        ]);
        const productPurchases = purchaseAggregate[0]?.totalSales || 0;
        const totalOrders = purchaseAggregate[0]?.orderCount || 0;

        const withdrawalAggregate = await Withdrawal.aggregate([
            {
                $match: {
                    userId: user._id,
                    status: "Completed",
                },
            },
            {
                $group: {
                    _id: null,
                    totalPaidWithdrawals: { $sum: "$amount" },
                },
            },
        ]);
        const paidWithdrawals = Number(
            withdrawalAggregate[0]?.totalPaidWithdrawals || 0
        );

        const generationWalletIncomeTypes = Array.from(
            new Set([
                "Generation",
                ...(REPURCHASE_WALLET_TYPE === "generation-wallet"
                    ? ["Repurchase", ...REPURCHASE_INCOME_TYPES]
                    : []),
            ])
        );

        const legacyIncomeBreakdown = await IncomeHistory.aggregate([
            {
                $match: {
                    userId: user._id,
                    type: { $in: generationWalletIncomeTypes },
                },
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        const legacyGenerationIncome = Number(
            legacyIncomeBreakdown.find((row) => row._id === "Generation")?.totalAmount || 0
        );
        const legacyGenerationWalletIncome = Number(
            legacyIncomeBreakdown.reduce(
                (sum, row) =>
                    generationWalletIncomeTypes.includes(row._id)
                        ? sum + Number(row.totalAmount || 0)
                        : sum,
                0
            ) || 0
        );
        const legacyRepurchaseIncome = Number(
            legacyIncomeBreakdown.find((row) => row._id === "Repurchase")?.totalAmount || 0
        );

        const totalGenerationIncome = Number(user.totalGenerationIncome || 0);
        const [generationWalletSummary, repurchaseWalletSummary] = await Promise.all([
            getWalletBalance(user._id, "generation-wallet"),
            getWalletBalance(user._id, "repurchase-wallet"),
        ]);
        const derivedGenerationWalletBalance = Number(
            generationWalletSummary.balance ||
                legacyGenerationWalletIncome ||
                totalGenerationIncome ||
                0
        );
        const derivedRepurchaseWalletBalance = Number(
            repurchaseWalletSummary.balance || 0
        );

        const stats = {
            walletBalance: Number(user.walletBalance || 0),
            repurchaseWalletBalance: derivedRepurchaseWalletBalance,
            generationWalletBalance: derivedGenerationWalletBalance,
            pv: Number(user.pv || 0),
            bv: Number(user.bv || 0),
            totalGenerationIncome,
            legacyGenerationIncome,
            legacyRepurchaseIncome,
            matchedPV: Number(user.matchedPV || 0),
            rank: user.rank || "Member",
            productPurchases: Number(productPurchases || 0),
            totalOrders: Number(totalOrders || 0),
            paidWithdrawals,
            dailyPV: {
                current: Number(user.dailyPV || 0),
                target: 320,
            },
            lifetimePV: {
                current: Number(user.pv || 0),
                target: 10200,
            },
        };

        return res.json(stats);
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.countDownline = async (rootId) => {
    if (!rootId) return 0;
    let count = 0;
    const queue = [rootId];
    while (queue.length > 0) {
        const currentId = queue.shift();
        const current = await User.findById(currentId);
        if (current) {
            count += 1;
            if (current.left) queue.push(current.left);
            if (current.right) queue.push(current.right);
        }
    }
    return count;
};

exports.handleRepurchase = async (userId, amount, bv) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        await Repurchase.create({
            userId,
            amount,
            bv,
        });

        let currentParentId = user.parent;
        let generation = 1;

        const genRates = {
            1: 0.1,
            2: 0.08,
            3: 0.05,
            4: 0.03,
            5: 0.02,
            6: 0.01,
            7: 0.01,
            8: 0.01,
            9: 0.01,
            10: 0.01,
            11: 0.005,
            12: 0.005,
            13: 0.005,
            14: 0.005,
            15: 0.005,
            16: 0.005,
            17: 0.005,
            18: 0.005,
            19: 0.005,
            20: 0.005,
        };

        while (currentParentId && generation <= 20) {
            const parent = await User.findById(currentParentId);
            if (!parent) break;

            const incomeAmount = bv * (genRates[generation] || 0.005);

            if (incomeAmount > 0) {
                await User.findByIdAndUpdate(parent._id, {
                    $inc: { totalGenerationIncome: incomeAmount },
                });

                await createWalletLedgerEntry({
                    userId: parent._id,
                    walletType: "generation-wallet",
                    txType: "credit",
                    amount: incomeAmount,
                    sourceType: "Generation",
                    sourceId: user._id,
                    entryType: "Generation",
                    referenceId: `generation:repurchase:${user._id}:L${generation}:${parent._id}`,
                    description: `Generation ${generation} income from ${user.memberId} repurchase`,
                    meta: {
                        sourceUserId: user._id,
                        sourceMemberId: user.memberId || "",
                        level: generation,
                        bv: Number(bv || 0),
                    },
                });

                await IncomeHistory.create({
                    userId: parent._id,
                    amount: incomeAmount,
                    type: "Generation",
                    walletType: "generation-wallet",
                    fromUserId: user._id,
                    level: generation,
                    description: `Generation ${generation} income from ${user.memberId} repurchase`,
                });
            }
            currentParentId = parent.parent;
            generation += 1;
        }
    } catch (error) {
    }
};
