const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
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
    getWalletSummary,
    getWalletTransactions,
    createWalletRequest,
    getWalletRequestHistory,
    updateWalletRequestStatus,
    getAllWalletRequests,
} = require('../controllers/walletController');

const {
    createTopupOrder,
    verifyTopup,
    getWalletBalance,
} = require('../controllers/Wallettopupcontroller');

const walletRequestStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `wallet-request-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const walletRequestUpload = multer({
    storage: walletRequestStorage,
    fileFilter: function (req, file, cb) {
        const isAllowed =
            file.mimetype.startsWith('image/') ||
            file.mimetype === 'application/pdf';

        if (!isAllowed) {
            return cb(new Error('Only image or PDF attachments are allowed'));
        }

        cb(null, true);
    },
});

// User routes
router.get('/deduction-report', protect, getDeductionReport);
router.get('/withdrawal-history', protect, getWithdrawalHistory);
router.post('/withdraw', protect, requestWithdrawal);
router.get('/all-transactions', protect, getAllTransactions);
router.get('/daily-closing', protect, getDailyClosingReport);
router.get('/recent-transactions', protect, getRecentTransactions);
router.get('/summary', protect, getWalletSummary);
router.get('/product/transactions', protect, (req, res, next) => {
    req.params.walletType = 'product-wallet';
    next();
}, getWalletTransactions);
router.get('/repurchase/transactions', protect, (req, res, next) => {
    req.params.walletType = 'repurchase-wallet';
    next();
}, getWalletTransactions);
router.post('/product/request', protect, walletRequestUpload.single('attachment'), (req, res, next) => {
    req.params.walletType = 'product-wallet';
    next();
}, createWalletRequest);
router.get('/product/request-history', protect, (req, res, next) => {
    req.params.walletType = 'product-wallet';
    next();
}, getWalletRequestHistory);
router.post('/repurchase/request', protect, walletRequestUpload.single('attachment'), (req, res, next) => {
    req.params.walletType = 'repurchase-wallet';
    next();
}, createWalletRequest);
router.get('/repurchase/request-history', protect, (req, res, next) => {
    req.params.walletType = 'repurchase-wallet';
    next();
}, getWalletRequestHistory);
router.get('/transactions/:walletType', protect, getWalletTransactions);
router.post('/requests/:walletType', protect, walletRequestUpload.single('attachment'), createWalletRequest);
router.get('/requests/:walletType/history', protect, getWalletRequestHistory);

// Admin routes
router.get('/admin/all-withdrawals', protect, adminOnly, getAllWithdrawals);
router.get('/admin/requests', protect, adminOnly, getAllWalletRequests);
router.patch('/withdrawal/:id/status', protect, adminOnly, updateWithdrawalStatus);
router.patch('/admin/requests/:id/status', protect, adminOnly, updateWalletRequestStatus);

// ── NEW: Wallet Top-Up ────────────────────────────────────────────────────────
router.get('/topup/balance', protect, getWalletBalance);
router.post('/topup/create-order', protect, createTopupOrder);
router.post('/topup/verify', protect, verifyTopup);


module.exports = router;
