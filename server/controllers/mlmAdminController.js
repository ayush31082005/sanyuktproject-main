const User = require("../models/User");
const BinaryTree = require("../models/BinaryTree");
const IncomeHistory = require("../models/IncomeHistory");
const { getBinaryTree, getDirectReferrals, getTeamMembersByType } = require("../services/mlmService");

/**
 * Get All Users for Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password -otp");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get Binary Tree for Admin / User
 */
exports.getBinaryTree = async (req, res) => {
    try {
        const { userId } = req.params;
        const tree = await getBinaryTree(userId);
        res.json(tree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Manage User Status
 */
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId, activeStatus } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.activeStatus = activeStatus;
        await user.save();
        res.json({ message: `User status updated to ${activeStatus ? "Active" : "Inactive"}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get MLM Stats for a specific user
 */
exports.getMLMStats = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const tree = await BinaryTree.findOne({ userId });

        const directCount = await User.countDocuments({ sponsorId: user.memberId });

        const stats = {
            walletBalance: user.walletBalance,
            pv: user.pv,
            bv: user.bv,
            rank: user.rank,
            activeStatus: user.activeStatus,
            directCount,
            leftPV: tree ? tree.leftPV : 0,
            rightPV: tree ? tree.rightPV : 0,
            leftBV: tree ? tree.leftBV : 0,
            rightBV: tree ? tree.rightBV : 0,
            totalLeft: tree ? tree.totalLeft : 0,
            totalRight: tree ? tree.totalRight : 0,
            totalDownline: (tree ? tree.totalLeft : 0) + (tree ? tree.totalRight : 0)
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get Direct Referrals for a user
 */
exports.getDirects = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        const directs = await getDirectReferrals(userId);
        res.json(directs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get Income Reports
 */
exports.getIncomeReports = async (req, res) => {
    try {
        const reports = await IncomeHistory.find({})
            .populate("userId", "userName memberId")
            .populate("fromUserId", "userName memberId")
            .sort({ date: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get Team List (Left, Right, or All)
 */
exports.getTeamList = async (req, res) => {
    try {
        const { type } = req.params;
        const userId = req.params.userId || req.user._id;
        const team = await getTeamMembersByType(userId, type);
        res.json(team);
    } catch (error) {
        console.error("getTeamList error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get overall system-wide MLM statistics for Admin
 */
exports.getSystemMLMStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const activeUsersCount = await User.countDocuments({ activeStatus: true });

        const pvTotals = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalPV: { $sum: { $toDouble: "$pv" } },
                    totalBV: { $sum: { $toDouble: "$bv" } },
                    totalMatchedPV: { $sum: { $toDouble: "$matchedPV" } }
                }
            }
        ]);

        const treeTotals = await BinaryTree.aggregate([
            {
                $group: {
                    _id: null,
                    totalLeftPV: { $sum: "$leftPV" },
                    totalRightPV: { $sum: "$rightPV" },
                    totalLeftBV: { $sum: "$leftBV" },
                    totalRightBV: { $sum: "$rightBV" }
                }
            }
        ]);

        const incomeTotals = await IncomeHistory.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const rankDistribution = await User.aggregate([
            { $group: { _id: "$rank", count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers,
            activeUsers: activeUsersCount,
            pvStats: pvTotals[0] || { totalPV: 0, totalBV: 0, totalMatchedPV: 0 },
            treeStats: treeTotals[0] || { totalLeftPV: 0, totalRightPV: 0, totalLeftBV: 0, totalRightBV: 0 },
            incomeStats: incomeTotals.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.total }), {}),
            rankDistribution: rankDistribution.reduce((acc, curr) => ({ ...acc, [curr._id || "Member"]: curr.count }), {})
        });
    } catch (error) {
        console.error("getSystemMLMStats error:", error);
        res.status(500).json({ message: error.message });
    }
};
