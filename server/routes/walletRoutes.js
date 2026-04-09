const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getDeductionReport,
    getWithdrawalHistory,
    requestWithdrawal,
    getAllTransactions,
    getDailyClosingReport,
    getRecentTransactions,
    updateWithdrawalStatus,
    getAllWithdrawals,
} = require('../controllers/walletController');

const {
    createTopupOrder,
    verifyTopup,
    getWalletBalance,
} = require('../controllers/Wallettopupcontroller');

// User routes
router.get('/deduction-report', protect, getDeductionReport);
router.get('/withdrawal-history', protect, getWithdrawalHistory);
router.post('/withdraw', protect, requestWithdrawal);
router.get('/all-transactions', protect, getAllTransactions);
router.get('/daily-closing', protect, getDailyClosingReport);
router.get('/recent-transactions', protect, getRecentTransactions);

// Admin routes
router.get('/admin/all-withdrawals', protect, adminOnly, getAllWithdrawals);
router.patch('/withdrawal/:id/status', protect, adminOnly, updateWithdrawalStatus);

// ── NEW: Wallet Top-Up ────────────────────────────────────────────────────────
router.get('/topup/balance', protect, getWalletBalance);
router.post('/topup/create-order', protect, createTopupOrder);
router.post('/topup/verify', protect, verifyTopup);


module.exports = router;

