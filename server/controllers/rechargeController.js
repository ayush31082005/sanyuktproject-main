const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const IncomeHistory = require('../models/IncomeHistory');
const axios = require('axios');
const fs = require('fs');
const querystring = require('querystring');
const { resolveOpCode } = require('../config/inspayOpcodes');
const {
    PLAN_API_URL,
    OPERATOR_FETCH_API_URL,
    CIRCLE_CODES,
    resolvePlanOpcode
} = require('../config/planProviderConfig');

const rechargeDebugEnabled = String(process.env.RECHARGE_DEBUG || '').toLowerCase() === 'true';
const rechargeCredentialLogEnabled = String(process.env.RECHARGE_LOG_CREDENTIALS || '').toLowerCase() === 'true';
const rechargeDebugLog = (...args) => {
    if (rechargeDebugEnabled) {
        console.log('[RECHARGE_DEBUG]', ...args);
    }
};

const maskSecret = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.length <= 8) return '***';
    return `${raw.slice(0, 4)}...${raw.slice(-4)}`;
};

const rechargeCredentialLog = (label, { username, token }) => {
    if (!rechargeCredentialLogEnabled) return;
    console.log(`[RECHARGE_CREDENTIALS] ${label}`, {
        username: String(username || ''),
        token: maskSecret(token)
    });
};

// Debug helper for Inspay
const logInspayDebug = (data) => {
    try {
        const logPath = path.join(__dirname, '../inspay_debug.log');
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] ${JSON.stringify(data, null, 2)}\n\n---\n\n`;
        fs.appendFileSync(logPath, entry);
    } catch (err) {
        console.error('Debug log error:', err);
    }
};

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

// FIXED: Generate proper 10-digit numeric order ID
const generateOrderId = () => {
    // Method 1: Use timestamp last 10 digits (ensures uniqueness)
    const timestamp = Date.now().toString();
    let orderId;

    if (timestamp.length >= 10) {
        orderId = timestamp.slice(-10);
    } else {
        // Generate random 10-digit number
        orderId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    }

    // Ensure it's exactly 10 digits and numeric
    orderId = orderId.replace(/\D/g, '');
    if (orderId.length < 10) {
        orderId = orderId.padStart(10, '0');
    } else if (orderId.length > 10) {
        orderId = orderId.slice(0, 10);
    }

    return orderId;
};

// FIXED: Perform Inspay Recharge with correct GET request
const performInspayRecharge = async (mobile, opId, amount, serviceType = 'mobile') => {
    if (!mobile || !opId || !amount || Number(amount) <= 0) {
        throw new Error("Missing required fields or invalid amount");
    }

    // Get credentials
    const username = process.env.INSPAY_USERNAME;
    const token = process.env.INSPAY_TOKEN;
    rechargeCredentialLog('performInspayRecharge', { username, token });

    if (!username || !token) {
        throw new Error("Inspay credentials not configured");
    }

    const exactUsername = String(username || '').trim();
    const tokenPreview = `${String(token).slice(0, 4)}...${String(token).slice(-4)}`;

    // Resolve opcode from operator list (as provided by Inspay panel)
    const opcode = resolveOpCode(opId);

    // Generate unique 10-digit order ID
    const orderid = generateOrderId();

    console.log('Inspay Recharge Request:', {
        mobile,
        operator: opId,
        opcode,
        amount,
        orderid,
        orderid_length: orderid.length,
        orderid_is_numeric: /^\d+$/.test(orderid)
    });
    rechargeDebugLog('Inspay credentials/meta', {
        username: exactUsername,
        tokenPreview,
        serviceType,
        apiUrl: "https://www.connect.inspay.in/v3/recharge/api"
    });

    // Prepare parameters for GET request (as per Inspay documentation)
    const apiUrl = "https://www.connect.inspay.in/v3/recharge/api";

    try {
        const params = {
            username: exactUsername,
            token: token,
            opcode: opcode,
            number: mobile.toString(),
            amount: amount.toString(),
            orderid: orderid,
            format: 'json'
        };
        rechargeDebugLog('Inspay attempt', {
            username: exactUsername,
            opcode,
            number: mobile.toString(),
            amount: amount.toString(),
            orderid
        });

        // Make GET request (NOT POST) as per Inspay documentation
        const response = await axios.get(apiUrl, {
            params,
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Sanyukt-Parivaar/1.0'
            }
        });
        const result = response.data;

        logInspayDebug({
            request: { ...params, token: 'REDACTED' },
            response: result,
            orderid_generated: orderid
        });

        console.log('Inspay Response:', result);

        // Check if successful
        const isSuccess = result.status === 'Success' || result.status === 'success';
        const isPending = result.status === 'Pending' || result.status === 'pending';

        return {
            success: isSuccess || isPending,
            response: result,
            orderid: orderid
        };

    } catch (error) {
        console.error('Inspay API Error:', error.message);

        logInspayDebug({
            error: {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status
            }
        });

        let errorMessage = error.message;
        if (error.response?.data) {
            errorMessage = error.response.data.message || error.response.data.opid || error.message;
        }

        return {
            success: false,
            response: {
                status: 'Failure',
                message: errorMessage
            },
            orderid: orderid
        };
    }
};

const creditRechargeReward = async (userId, amount, type, rechargeNumber) => {
    try {
        const rewardAmount = amount * 0.05; // 5% reward
        if (rewardAmount <= 0) return;

        const user = await User.findById(userId);
        if (user) {
            user.walletBalance = (user.walletBalance || 0) + rewardAmount;
            await user.save();

            await IncomeHistory.create({
                userId: user._id,
                amount: rewardAmount,
                type: 'RechargeReward',
                description: `5% reward for ${type} recharge of ₹${amount} for ${rechargeNumber}`
            });
            console.log(`Recharge reward of ₹${rewardAmount} credited to user ${userId}`);
        }
    } catch (error) {
        console.error("Error crediting recharge reward:", error);
    }
};

const fetchLivePlansFromProvider = async ({ mobile, operator, circle, orderid }) => {
    const rawUsername = process.env.INSPAY_FETCH_USERNAME;
    const token = process.env.INSPAY_FETCH_PLANS_TOKEN;
    const username = String(rawUsername || '').trim();
    rechargeCredentialLog('fetchLivePlansFromProvider', { username, token });

    if (!username || !token) {
        throw new Error('Plan provider credentials are not configured');
    }

    const opcode = resolvePlanOpcode(operator);
    const generatedOrderId = String(orderid || Date.now()).replace(/\D/g, '').slice(-10);

    const response = await axios.get(PLAN_API_URL, {
        params: {
            username,
            token,
            mobile,
            opcode,
            circle,
            orderid: generatedOrderId
        },
        timeout: 25000
    });

    return {
        opcode,
        generatedOrderId,
        providerResponse: response.data
    };
};

const fetchOperatorCircleFromProvider = async ({ mobile, orderid }) => {
    const rawUsername = process.env.INSPAY_FETCH_USERNAME;
    const token = process.env.INSPAY_FETCH_PLANS_TOKEN;
    const username = String(rawUsername || '').trim();
    rechargeCredentialLog('fetchOperatorCircleFromProvider', { username, token });

    if (!username || !token) {
        throw new Error('Operator fetch credentials are not configured');
    }

    const generatedOrderId = String(orderid || Date.now()).replace(/\D/g, '').slice(-10);

    const response = await axios.get(OPERATOR_FETCH_API_URL, {
        params: {
            username,
            token,
            mobile,
            orderid: generatedOrderId
        },
        timeout: 20000
    });

    return {
        generatedOrderId,
        providerResponse: response.data
    };
};

const hasPlansInProviderResponse = (providerResponse = {}) => {
    const planBuckets = providerResponse?.data;
    if (!planBuckets || typeof planBuckets !== 'object') return false;
    return Object.values(planBuckets).some(
        (plans) => Array.isArray(plans) && plans.length > 0
    );
};

const mapProviderCompanyToOperatorId = (providerPayload = {}) => {
    const normalized = [
        providerPayload?.company,
        providerPayload?.operator,
        providerPayload?.operator_name,
        providerPayload?.provider,
        providerPayload?.opcode,
        providerPayload?.op_code,
        providerPayload?.opid
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

    const tokens = new Set(normalized.split(/\s+/).filter(Boolean));

    if (tokens.has('airtel') || tokens.has('at')) return 'airtel';
    if (tokens.has('jio') || tokens.has('rj') || tokens.has('jo')) return 'jio';
    if (tokens.has('vi') || tokens.has('vf') || normalized.includes('voda') || normalized.includes('vodafone') || normalized.includes('idea')) return 'vi';
    if (tokens.has('bsnl') || tokens.has('bt') || tokens.has('bs')) return 'bsnl';
    return '';
};

const normalizeCircleCode = (value) => {
    if (value === undefined || value === null) return '';
    const digits = String(value).replace(/\D/g, '');
    return digits ? digits.padStart(2, '0') : '';
};

const resolveCircleCodeFromDetection = (payload = {}) => {
    const directCode = normalizeCircleCode(
        payload?.circle_code ?? payload?.circleCode ?? payload?.circlecode
    );
    if (directCode) return directCode;

    const providerCircle = String(payload?.circle || '').trim().toUpperCase();
    if (!providerCircle) return '';

    const normalized = providerCircle
        .replace(/&/g, 'AND')
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    const aliasMap = {
        KOLKATA: 'KOLKATTA',
        ODISHA: 'ORISSA',
        MIZORAM: 'MIZZORAM',
        HIMACHAL_PRADESH: 'HP',
        JAMMU_AND_KASHMIR: 'J_AND_K',
        JAMMU_KASHMIR: 'J_AND_K',
        UTTAR_PRADESH_EAST: 'UP_EAST',
        UTTAR_PRADESH_WEST: 'UP_WEST',
        NORTH_EAST: 'NESA',
        NORTH_EASTERN: 'NESA'
    };

    const mappedKey = CIRCLE_CODES[normalized] ? normalized : aliasMap[normalized];
    if (!mappedKey || !CIRCLE_CODES[mappedKey]) return '';
    return String(CIRCLE_CODES[mappedKey]).padStart(2, '0');
};

// @desc    Fetch operator plans from live provider (ekychub)
// @route   GET /api/recharge/plans
exports.getRechargePlans = async (req, res) => {
    try {
        const { mobile, operator, circle, orderid } = req.query;

        if (!mobile || !operator) {
            return res.status(400).json({
                success: false,
                message: 'mobile and operator are required'
            });
        }

        if (!circle) {
            return res.status(400).json({
                success: false,
                message: 'circle is required. Fetch /api/recharge/plan-circles and pass a circle code.'
            });
        }

        let effectiveOperator = String(operator);
        let effectiveCircle = String(circle);
        let fallbackApplied = false;

        let { opcode, generatedOrderId, providerResponse } = await fetchLivePlansFromProvider({
            mobile,
            operator: effectiveOperator,
            circle: effectiveCircle,
            orderid
        });

        // Fallback: if provider returns empty plan buckets, auto-detect operator/circle and retry once.
        if (!hasPlansInProviderResponse(providerResponse)) {
            try {
                const { providerResponse: detectedData } = await fetchOperatorCircleFromProvider({
                    mobile: String(mobile),
                    orderid
                });

                const detectedOperator = mapProviderCompanyToOperatorId(detectedData);
                const detectedCircle = resolveCircleCodeFromDetection(detectedData);

                const retryOperator = detectedOperator || effectiveOperator;
                const retryCircle = detectedCircle || effectiveCircle;

                if (
                    retryOperator &&
                    retryCircle &&
                    (retryOperator !== effectiveOperator || retryCircle !== effectiveCircle)
                ) {
                    const retryResult = await fetchLivePlansFromProvider({
                        mobile,
                        operator: retryOperator,
                        circle: retryCircle,
                        orderid
                    });

                    if (hasPlansInProviderResponse(retryResult.providerResponse)) {
                        fallbackApplied = true;
                        effectiveOperator = retryOperator;
                        effectiveCircle = retryCircle;
                        opcode = retryResult.opcode;
                        generatedOrderId = retryResult.generatedOrderId;
                        providerResponse = retryResult.providerResponse;
                    }
                }
            } catch (fallbackError) {
                rechargeDebugLog('plans fallback failed', {
                    message: fallbackError?.message,
                    data: fallbackError?.response?.data
                });
            }
        }

        if (providerResponse?.status !== 'Success' && providerResponse?.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: providerResponse?.message || 'Provider failed to fetch plans',
                ...providerResponse
            });
        }

        return res.status(200).json({
            success: true,
            source: 'live_provider',
            operator: effectiveOperator,
            opcode,
            circle: effectiveCircle,
            fallbackApplied,
            orderid: generatedOrderId,
            ...providerResponse
        });
    } catch (error) {
        console.error('Fetch plans error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || error.message || 'Unable to fetch plans'
        });
    }
};

// @desc    Fetch supported circle codes for plan fetch
// @route   GET /api/recharge/plan-circles
exports.getPlanCircles = async (req, res) => {
    try {
        const circles = Object.entries(CIRCLE_CODES).map(([name, code]) => ({
            name,
            code
        }));

        return res.status(200).json({
            success: true,
            circles
        });
    } catch (error) {
        console.error('Fetch circle list error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch circle list'
        });
    }
};

// @desc    Detect mobile operator and circle from provider
// @route   GET /api/recharge/operator-fetch
exports.getOperatorAndCircle = async (req, res) => {
    try {
        const { mobile, orderid } = req.query;
        if (!mobile || !/^\d{10}$/.test(String(mobile))) {
            return res.status(400).json({
                success: false,
                message: 'Valid 10-digit mobile is required'
            });
        }

        const { generatedOrderId, providerResponse } = await fetchOperatorCircleFromProvider({
            mobile: String(mobile),
            orderid
        });

        if (providerResponse?.status !== 'Success' && providerResponse?.status !== 'success') {
            return res.status(400).json({
                success: false,
                message: providerResponse?.message || 'Provider failed to detect operator/circle',
                ...providerResponse
            });
        }

        return res.status(200).json({
            success: true,
            source: 'live_provider',
            orderid: generatedOrderId,
            ...providerResponse
        });
    } catch (error) {
        console.error('Operator fetch error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || error.message || 'Unable to detect operator/circle'
        });
    }
};

exports.getLiveRechargePlans = exports.getRechargePlans;

// @desc    Create a new recharge order
// @route   POST /api/recharge/create-order
exports.createOrder = async (req, res) => {
    try {
        const { amount, type, operator, rechargeNumber } = req.body;
        rechargeDebugLog('createOrder request', {
            userId: req.user?._id?.toString?.() || req.user?._id,
            amount,
            type,
            operator,
            rechargeNumber
        });

        if (!razorpay) {
            return res.status(503).json({ message: "Payment service unavailable" });
        }

        if (!amount || !type || !operator || !rechargeNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        const transaction = await Transaction.create({
            userId: req.user._id,
            amount,
            type,
            operator,
            rechargeNumber,
            status: 'pending',
            razorpayOrderId: order.id
        });

        res.status(200).json({
            success: true,
            order,
            transactionId: transaction._id,
            key: process.env.RAZORPAY_KEY_ID
        });
        rechargeDebugLog('createOrder success', {
            transactionId: transaction._id?.toString(),
            razorpayOrderId: order.id,
            amount: order.amount
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/recharge/verify-payment
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            transactionId
        } = req.body;
        rechargeDebugLog('verifyPayment request', {
            transactionId,
            razorpay_order_id,
            razorpay_payment_id,
            signatureLength: String(razorpay_signature || '').length
        });

        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");
        rechargeDebugLog('verifyPayment signature check', {
            expectedPrefix: expectedSignature.slice(0, 10),
            actualPrefix: String(razorpay_signature || '').slice(0, 10),
            match: expectedSignature === razorpay_signature
        });

        if (expectedSignature === razorpay_signature) {
            const transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                rechargeDebugLog('verifyPayment transaction not found', { transactionId });
                return res.status(404).json({ message: "Transaction not found" });
            }
            if (String(transaction.userId) !== String(req.user?._id)) {
                rechargeDebugLog('verifyPayment unauthorized transaction access', {
                    transactionId,
                    transactionUserId: String(transaction.userId),
                    requestUserId: String(req.user?._id)
                });
                return res.status(403).json({
                    success: false,
                    message: "Not authorized for this transaction"
                });
            }

            let inspayData = null;

            // Only process Inspay recharge if not a donation
            if (transaction.type !== 'donation') {
                const { success, response, orderid } = await performInspayRecharge(
                    transaction.rechargeNumber,
                    transaction.operator,
                    transaction.amount,
                    transaction.type
                );

                if (!success) {
                    rechargeDebugLog('verifyPayment inspay failed', {
                        transactionId,
                        providerMessage: response?.message,
                        providerOpid: response?.opid,
                        providerStatus: response?.status
                    });
                    transaction.status = 'failed';
                    await transaction.save();
                    return res.status(400).json({
                        success: false,
                        message: response?.message || "Recharge failed",
                        error: response
                    });
                }

                inspayData = response;
                transaction.transactionId = response.txid || orderid;
                transaction.status = response.status?.toLowerCase() || 'success';
            } else {
                transaction.transactionId = `TXN${Date.now()}`;
                transaction.status = 'success';
            }

            transaction.razorpayPaymentId = razorpay_payment_id;
            await transaction.save();

            // Send email notification
            const user = await User.findById(transaction.userId);
            if (user && user.email) {
                const subject = `Recharge Successful - Sanyukt Parivaar`;
                const text = `Dear ${user.userName || user.name || 'Member'},\n\nYour ${transaction.type} recharge of Rs.${transaction.amount} for ${transaction.rechargeNumber} was successful.\n\nRegistered Phone: ${user.mobile || 'N/A'}\nTransaction ID: ${transaction.transactionId}\nDate: ${new Date().toLocaleString()}\n\nThank you for choosing Sanyukt Parivaar!`;
                sendEmail(user.email, subject, text).catch(err => console.error('Email error:', err));

                // Credit reward for successful recharges
                if (transaction.type !== 'donation') {
                    await creditRechargeReward(user._id, transaction.amount, transaction.type, transaction.rechargeNumber);
                }
            }

            res.status(200).json({
                success: true,
                message: "Payment verified and recharge processed",
                data: inspayData
            });
            rechargeDebugLog('verifyPayment success', {
                transactionId,
                finalTransactionId: transaction.transactionId,
                status: transaction.status
            });
        } else {
            await Transaction.findByIdAndUpdate(transactionId, { status: 'failed' });
            rechargeDebugLog('verifyPayment failed', { transactionId, reason: 'signature_mismatch' });
            res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Recharge using internal wallet balance
// @route   POST /api/recharge/wallet
exports.walletRecharge = async (req, res) => {
    try {
        const { amount, type, operator, rechargeNumber } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.walletBalance < amount) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        // Process recharge through Inspay
        const { success, response, orderid } = await performInspayRecharge(
            rechargeNumber,
            operator,
            amount,
            type
        );

        if (!success) {
            return res.status(400).json({
                success: false,
                message: response?.message || "Recharge failed",
                error: response
            });
        }

        // Deduct wallet balance
        user.walletBalance -= amount;
        await user.save();

        // Create transaction record
        const transaction = await Transaction.create({
            userId: req.user._id,
            amount,
            type,
            operator,
            rechargeNumber,
            status: response.status?.toLowerCase() || 'success',
            paymentMethod: 'wallet',
            transactionId: response.txid || orderid
        });

        // Send email notification
        if (user.email) {
            const subject = `Recharge Successful - Sanyukt Parivaar`;
            const text = `Dear ${user.userName || user.name || 'Member'},\n\nYour ${type} recharge of Rs.${amount} for ${rechargeNumber} was successful using wallet balance.\n\nRegistered Phone: ${user.mobile || 'N/A'}\nTransaction ID: ${transaction.transactionId}\nDate: ${new Date().toLocaleString()}\n\nThank you for choosing Sanyukt Parivaar!`;
            sendEmail(user.email, subject, text).catch(err => console.error('Email error:', err));
        }

        // Credit reward
        await creditRechargeReward(req.user._id, amount, type, rechargeNumber);

        res.status(200).json({
            success: true,
            message: "Recharge successful using wallet",
            transactionId: transaction._id,
            data: response
        });
    } catch (error) {
        console.error('Wallet recharge error:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Get logged in user transactions
// @route   GET /api/recharge/my-transactions
exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Fetch transactions error:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// @desc    Direct Inspay Recharge
// @route   POST /api/recharge
exports.inspayRecharge = async (req, res) => {
    try {
        const { mobile, operator, amount, type = 'mobile' } = req.body;

        // Validate input
        if (!mobile || !operator || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Process recharge
        const { success, response, orderid } = await performInspayRecharge(
            mobile,
            operator,
            amount,
            type
        );

        if (success) {
            // Save transaction
            await Transaction.create({
                userId: req.user?._id || null,
                amount: Number(amount),
                type: type,
                operator: operator,
                rechargeNumber: mobile,
                status: response.status?.toLowerCase() || 'pending',
                paymentMethod: 'inspay',
                transactionId: response.txid || orderid,
                orderId: orderid,
                operatorId: response.opid,
                message: response.message
            });

            // Credit reward for successful transactions
            if (req.user && (response.status === 'Success' || response.status === 'success')) {
                await creditRechargeReward(req.user._id, amount, type, mobile);
            }

            return res.status(200).json({
                success: true,
                data: response,
                message: response.message || "Recharge processed successfully"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: response?.message || response?.opid || "Recharge Failed",
                error: response
            });
        }
    } catch (error) {
        console.error('Inspay recharge error:', error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

// @desc    Check transaction status from Inspay
// @route   GET /api/recharge/status/:orderId
exports.checkStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        rechargeCredentialLog('checkStatus', {
            username: process.env.INSPAY_USERNAME,
            token: process.env.INSPAY_TOKEN
        });
        const params = {
            username: String(process.env.INSPAY_USERNAME || '').trim(),
            token: process.env.INSPAY_TOKEN,
            orderid: orderId,
            format: 'json'
        };

        const response = await axios.get("https://www.connect.inspay.in/v3/recharge/status", {
            params,
            timeout: 15000
        });

        await Transaction.findOneAndUpdate(
            { transactionId: orderId },
            {
                status: response.data.status?.toLowerCase() || 'pending',
                operatorId: response.data.opid,
                message: response.data.message
            }
        );

        res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            success: false,
            message: "Unable to check status"
        });
    }
};

// @desc    Get balance from Inspay
// @route   GET /api/recharge/balance
exports.getBalance = async (req, res) => {
    try {
        rechargeCredentialLog('getBalance', {
            username: process.env.INSPAY_USERNAME,
            token: process.env.INSPAY_TOKEN
        });
        const params = {
            username: String(process.env.INSPAY_USERNAME || '').trim(),
            token: process.env.INSPAY_TOKEN,
            format: 'json'
        };

        const response = await axios.get("https://www.connect.inspay.in/v3/recharge/balance", {
            params,
            timeout: 10000
        });

        res.status(200).json({
            success: true,
            balance: response.data.balance
        });
    } catch (error) {
        console.error('Balance check error:', error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch balance"
        });
    }
};

// @desc    Webhook endpoint for Inspay callbacks
// @route   POST/GET /api/recharge/callback
exports.handleCallback = async (req, res) => {
    try {
        const params = req.method === 'GET' ? req.query : req.body;
        const { txid, status, opid } = params;

        console.log('Received callback:', params);

        if (txid) {
            await Transaction.findOneAndUpdate(
                { transactionId: txid },
                {
                    status: status?.toLowerCase() || 'pending',
                    operatorId: opid,
                    callbackReceived: true,
                    callbackData: params,
                    callbackTime: new Date()
                }
            );
        }

        // Always respond with success to acknowledge receipt
        res.status(200).send('OK');
    } catch (error) {
        console.error('Callback error:', error);
        res.status(500).send('Error');
    }
};
