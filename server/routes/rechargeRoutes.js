const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    getUserTransactions,
    walletRecharge,
    inspayRecharge,
    getRechargePlans,
    getLiveRechargePlans,
    getPlanCircles,
    getOperatorAndCircle,
    getBalance,
    checkStatus,
    handleCallback
} = require('../controllers/rechargeController');
const { protect } = require('../middleware/authMiddleware');

// Existing routes
router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/wallet', protect, walletRecharge);
router.get('/my-transactions', protect, getUserTransactions);
router.get('/plans', getRechargePlans);
router.get('/plans/live', getLiveRechargePlans);
router.get('/plan-circles', getPlanCircles);
router.get('/operator-fetch', getOperatorAndCircle);

// Inspay recharge route (replaces the old one)
router.post('/', protect, inspayRecharge);

// New routes
router.get('/balance', protect, getBalance);
router.get('/status/:orderId', protect, checkStatus);
router.get('/callback', handleCallback); // Webhook endpoint (no auth)

module.exports = router;
