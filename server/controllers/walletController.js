const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Deduction = require('../models/Deduction');
const IncomeHistory = require('../models/IncomeHistory');
const Transaction = require('../models/Transaction');
const WalletLedger = require('../models/WalletLedger');
const WalletRequest = require('../models/WalletRequest');
const bcrypt = require('bcryptjs');
const {
    getWalletBalance,
    createWalletLedgerEntry,
    normalizeWalletType,
} = require('../utils/walletLedgerUtils');

const GENERATION_INCOME_TYPES = [
    'Generation',
    'Repurchase',
    'self_repurchase',
    'repurchase_level',
    'sponsor_income',
    'royalty_bonus',
    'house_fund',
    'leadership_fund',
    'car_fund',
    'travel_fund',
    'bike_fund',
];

const WITHDRAWAL_WALLET_TYPES = ['e-wallet', 'generation-wallet'];

const buildWithdrawalQuery = (userId, walletType = 'e-wallet') => {
    const normalizedWalletType = normalizeWalletType(walletType || 'e-wallet');

    if (normalizedWalletType === 'e-wallet') {
        return {
            userId,
            $or: [
                { walletType: { $exists: false } },
                { walletType: '' },
                { walletType: 'e-wallet' },
            ],
        };
    }

    return {
        userId,
        walletType: normalizedWalletType,
    };
};

const getDeductionWalletQuery = async (userId, walletType = 'e-wallet') => {
    const normalizedWalletType = normalizeWalletType(walletType || 'e-wallet');
    const withdrawals = await Withdrawal.find(
        buildWithdrawalQuery(userId, normalizedWalletType)
    ).select('_id');
    const relatedWithdrawalIds = withdrawals.map((item) => item._id);

    const walletScopedConditions = [{ walletType: normalizedWalletType }];

    if (normalizedWalletType === 'e-wallet') {
        walletScopedConditions.push({ walletType: { $exists: false } });
        walletScopedConditions.push({ walletType: '' });
    }

    if (relatedWithdrawalIds.length > 0) {
        walletScopedConditions.push({
            $and: [
                { relatedWithdrawalId: { $in: relatedWithdrawalIds } },
                {
                    $or: [
                        { walletType: { $exists: false } },
                        { walletType: '' },
                    ],
                },
            ],
        });
    }

    return {
        userId,
        $or: walletScopedConditions,
    };
};

exports.getAllWithdrawals = async (req, res) => {
    try {
        const { status, method, search, walletType = 'All' } = req.query;
        let query = {};

        if (status && status !== 'All') query.status = status;
        if (method && method !== 'All') query.method = method;
        if (walletType && walletType !== 'All') query.walletType = normalizeWalletType(walletType);

        if (search) {
            const users = await User.find({
                $or: [
                    { userName: { $regex: search, $options: 'i' } },
                    { memberId: { $regex: search, $options: 'i' } },
                    { mobile: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            const userIds = users.map(u => u._id);
            query.$or = [
                { userId: { $in: userIds } },
                { referenceNo: { $regex: search, $options: 'i' } }
            ];
        }

        const withdrawals = await Withdrawal.find(query)
            .populate('userId', 'userName memberId mobile')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            withdrawals
        });
    } catch (err) {
        console.error('GetAllWithdrawals Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getDeductionReport = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = 'thisMonth', type = 'All Types', search = '', walletType = 'e-wallet' } = req.query;
        const normalizedWalletType = normalizeWalletType(walletType || 'e-wallet');

        // Date filter
        let dateFilter = {};
        const now = new Date();
        if (period === 'thisMonth') {
            dateFilter = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    $lte: now
                }
            };
        } else if (period === 'lastMonth') {
            dateFilter = {
                createdAt: {
                    $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                    $lte: new Date(now.getFullYear(), now.getMonth(), 0)
                }
            };
        } else if (period === 'last3Months') {
            dateFilter = {
                createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 3)) }
            };
        }

        // Type filter
        let typeFilter = {};
        if (type && type !== 'All Types') {
            typeFilter = { type };
        }

        // Search filter
        let searchFilter = {};
        if (search) {
            searchFilter = {
                referenceNo: { $regex: search, $options: 'i' }
            };
        }

        const query = {
            ...(await getDeductionWalletQuery(userId, normalizedWalletType)),
            ...dateFilter,
            ...typeFilter,
            ...searchFilter
        };

        const deductions = await Deduction.find(query).sort({ createdAt: -1 });

        // Summary stats
        const allDeductions = await Deduction.find(
            await getDeductionWalletQuery(userId, normalizedWalletType)
        );
        const totalDeductions = allDeductions.reduce((sum, d) => sum + d.amount, 0);
        const taxDeductions = allDeductions
            .filter(d => d.type === 'Tax')
            .reduce((sum, d) => sum + d.amount, 0);
        const feeDeductions = allDeductions
            .filter(d => d.type === 'Fee')
            .reduce((sum, d) => sum + d.amount, 0);
        const adminDeductions = allDeductions
            .filter(d => d.type === 'Admin')
            .reduce((sum, d) => sum + d.amount, 0);
        const pendingDeductions = allDeductions
            .filter(d => d.status === 'Pending')
            .reduce((sum, d) => sum + d.amount, 0);

        res.json({
            success: true,
            walletType: normalizedWalletType,
            summary: {
                totalDeductions,
                taxDeductions,
                feeDeductions,
                adminDeductions,
                pendingDeductions
            },
            deductions
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getWithdrawalHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status = '', method = '', period = '', walletType = 'e-wallet' } = req.query;
        const normalizedWalletType = normalizeWalletType(walletType || 'e-wallet');

        if (!WITHDRAWAL_WALLET_TYPES.includes(normalizedWalletType)) {
            return res.status(400).json({ success: false, message: 'Invalid withdrawal wallet type' });
        }

        let query = buildWithdrawalQuery(userId, normalizedWalletType);


        if (status && status !== 'All Status') query.status = status;
        if (method && method !== 'All Methods') query.method = method;

        if (period && period !== 'All Time') {
            const now = new Date();
            if (period === 'This Month') {
                query.createdAt = {
                    $gte: new Date(now.getFullYear(), now.getMonth(), 1)
                };
            } else if (period === 'Last Month') {
                query.createdAt = {
                    $gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                    $lte: new Date(now.getFullYear(), now.getMonth(), 0)
                };
            }
        }

        const withdrawals = await Withdrawal.find(query).sort({ createdAt: -1 });

        // Summary
        const allWithdrawals = await Withdrawal.find(buildWithdrawalQuery(userId, normalizedWalletType));
        const totalWithdrawn = allWithdrawals.reduce((s, w) => s + w.amount, 0);
        const successful = allWithdrawals
            .filter(w => w.status === 'Completed')
            .reduce((s, w) => s + w.amount, 0);
        const pending = allWithdrawals
            .filter(w => w.status === 'Pending')
            .reduce((s, w) => s + w.amount, 0);
        const count = allWithdrawals.length;
        const avgWithdrawal = count > 0 ? Math.round(totalWithdrawn / count) : 0;

        res.json({
            success: true,
            walletType: normalizedWalletType,
            summary: {
                totalWithdrawn,
                successful,
                pending,
                count,
                avgWithdrawal
            },
            withdrawals
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.requestWithdrawal = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            amount,
            method,
            accountNumber,
            ifscCode,
            bankName,
            upiId,
            walletType = 'e-wallet',
        } = req.body;
        const normalizedWalletType = normalizeWalletType(walletType || 'e-wallet');
        const requestedAmount = Number(amount || 0);

        if (!WITHDRAWAL_WALLET_TYPES.includes(normalizedWalletType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid withdrawal wallet type'
            });
        }

        if (!requestedAmount || isNaN(requestedAmount) || requestedAmount < 500) {
            return res.status(400).json({
                success: false,
                message: 'Minimum withdrawal amount is ₹500'
            });
        }

        const user = await User.findById(userId).select('userName memberId email');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const walletSummary = await getWalletBalance(userId, normalizedWalletType);
        user.walletBalance = walletSummary.balance;

        if (walletSummary.balance < requestedAmount) {
            return res.status(400).json({
                success: false,
                message: `Insufficient wallet balance. You have ₹${user.walletBalance}`
            });
        }

        // TDS deduction (5%) + Processing fee (2%)
        const tdsAmount = Math.round(requestedAmount * 0.05);
        const processingFee = Math.round(requestedAmount * 0.02);
        const netAmount = requestedAmount - tdsAmount - processingFee;

        let withdrawal;
        let walletDebit;
        try {
            // Create withdrawal record
            withdrawal = await Withdrawal.create({
                userId,
                walletType: normalizedWalletType,
                requestedAmount,
                amount: netAmount,
                tdsAmount,
                processingFee,
                method,
                accountNumber,
                ifscCode,
                bankName,
                upiId
            });

            walletDebit = await createWalletLedgerEntry({
                userId,
                walletType: normalizedWalletType,
                txType: 'debit',
                amount: requestedAmount,
                sourceType: 'withdrawal-request',
                entryType: 'withdrawal',
                sourceId: withdrawal._id,
                referenceId: withdrawal.referenceNo,
                description: `${normalizedWalletType} withdrawal request (${withdrawal.referenceNo})`,
                meta: {
                    method,
                    netAmount,
                    tdsAmount,
                    processingFee,
                },
            });

            // Create TDS deduction record
            await Deduction.create({
                userId,
                walletType: normalizedWalletType,
                type: 'Tax',
                amount: tdsAmount,
                description: 'Tax Deducted at Source (TDS)',
                relatedWithdrawalId: withdrawal._id,
                status: 'Processed'
            });

            // Create processing fee record
            await Deduction.create({
                userId,
                walletType: normalizedWalletType,
                type: 'Fee',
                amount: processingFee,
                description: 'Processing Fee - Withdrawal',
                relatedWithdrawalId: withdrawal._id,
                status: 'Processed'
            });

            return res.json({
                success: true,
                message: 'Withdrawal request submitted successfully',
                withdrawal,
                balanceAfter: walletDebit.balanceAfter,
                deductions: { tds: tdsAmount, processingFee }
            });

        } catch (dbErr) {
            console.error('--- WITHDRAWAL DB FAILURE ---');
            console.error(dbErr);

            if (walletDebit && withdrawal) {
                try {
                    await createWalletLedgerEntry({
                        userId,
                        walletType: normalizedWalletType,
                        txType: 'credit',
                        amount: requestedAmount,
                        sourceType: 'withdrawal-rollback',
                        entryType: 'withdrawal-refund',
                        sourceId: withdrawal._id,
                        referenceId: withdrawal.referenceNo,
                        description: `Rollback for failed withdrawal request (${withdrawal.referenceNo})`,
                    });
                } catch (rollbackErr) {
                    console.error('Withdrawal rollback failed:', rollbackErr);
                }
            }

            if (withdrawal) {
                await Deduction.deleteMany({ relatedWithdrawalId: withdrawal._id });
                await Withdrawal.findByIdAndDelete(withdrawal._id);
            }

            return res.status(500).json({
                success: false,
                message: 'Failed to record withdrawal. Your balance has been refunded.',
                error: dbErr.message
            });
        }
    } catch (err) {
        console.error('General Withdrawal Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error during withdrawal process' });
    }
};

exports.getRecentTransactions = async (req, res) => {
    try {
        const userId = req.user._id;
        const limit = parseInt(req.query.limit) || 5;

        // Fetch recent records from multiple sources
        const [incomes, withdrawals, deductions, otherTx] = await Promise.all([
            IncomeHistory.find({ userId }).sort({ createdAt: -1 }).limit(limit),
            Withdrawal.find(buildWithdrawalQuery(userId, 'e-wallet')).sort({ createdAt: -1 }).limit(limit),
            Deduction.find({ userId }).sort({ createdAt: -1 }).limit(limit),
            Transaction.find({ userId, status: 'success' }).sort({ createdAt: -1 }).limit(limit)
        ]);

        // Merge and format
        const merged = [
            ...incomes.map(i => ({
                id: i._id,
                date: i.createdAt,
                type: 'credit',
                description: i.description || i.type,
                amount: i.amount
            })),
            ...withdrawals.map(w => ({
                id: w._id,
                date: w.createdAt,
                type: 'debit',
                description: `Withdrawal (${w.method})`,
                amount: w.amount
            })),
            ...otherTx.map(t => ({
                id: t._id,
                date: t.createdAt,
                type: 'debit',
                description: `${t.type.toUpperCase()} Recharge`,
                amount: t.amount
            }))
        ]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);

        res.json({
            success: true,
            transactions: merged
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const userId = req.user._id;
        const { search = '' } = req.query;
        const walletTypeScope = normalizeWalletType(req.query.walletType || 'e-wallet');

        const incomeConditions = [{ userId }];

        if (walletTypeScope === 'generation-wallet') {
            incomeConditions.push({
                $or: [
                    { walletType: 'generation-wallet' },
                    { type: { $in: ['Generation', 'Repurchase'] } },
                ],
            });
        } else {
            incomeConditions.push({
                $and: [
                    {
                        $or: [
                            { walletType: { $exists: false } },
                            { walletType: '' },
                            { walletType: 'e-wallet' },
                        ],
                    },
                    { type: { $nin: GENERATION_INCOME_TYPES } },
                ],
            });
        }

        if (search) {
            incomeConditions.push({
                $or: [
                { type: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
                ],
            });
        }

        const incomeQuery =
            incomeConditions.length === 1 ? incomeConditions[0] : { $and: incomeConditions };

        const incomes = await IncomeHistory.find(incomeQuery)
            .populate('fromUserId', 'userName memberId')
            .sort({ createdAt: -1 });

        // Other Payments/Recharges & Withdrawals (debits)
        const [withdrawals, otherTransactions] =
            walletTypeScope === 'generation-wallet'
                ? [[], []]
                : await Promise.all([
                    Withdrawal.find(buildWithdrawalQuery(userId, 'e-wallet')).sort({ createdAt: -1 }),
                    Transaction.find({ userId, status: 'success' }).sort({ createdAt: -1 })
                ]);

        // Merge & sort by date
        const transactions = [
            ...incomes.map(i => ({
                _id: i._id,
                date: i.createdAt,
                type: i.type,
                amount: i.amount,
                source: i.fromUserId
                    ? `From: ${i.fromUserId.userName || i.fromUserId.memberId}`
                    : i.description || i.type,
                details: i.description || '',
                txType: 'credit'
            })),
            ...withdrawals.map(w => ({
                _id: w._id,
                date: w.createdAt,
                type: 'Withdrawal',
                amount: w.amount,
                source: w.method,
                details: w.referenceNo,
                txType: 'debit'
            })),
            ...otherTransactions.map(t => ({
                _id: t._id,
                date: t.createdAt,
                type: t.type.toUpperCase(),
                amount: t.amount,
                source: t.type === 'donation' ? 'Sanyukt Parivaar' : `${t.operator} - ${t.paymentMethod}`,
                details: t.type === 'donation' ? `Contribution (${t.paymentMethod})` : `${t.rechargeNumber} (${t.status})`,
                txType: 'debit'
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            success: true,
            walletType: walletTypeScope,
            totalRecords: transactions.length,
            transactions
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getDailyClosingReport = async (req, res) => {
    try {
        const userId = req.user._id;
        const { date } = req.query;

        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Previous day closing = today's opening
        const prevDay = new Date(startOfDay);
        prevDay.setDate(prevDay.getDate() - 1);
        const prevDayStart = new Date(prevDay);
        prevDayStart.setHours(0, 0, 0, 0);
        const prevDayEnd = new Date(prevDay);
        prevDayEnd.setHours(23, 59, 59, 999);

        // Credits for the day
        const dayIncomes = await IncomeHistory.find({
            userId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalCredits = dayIncomes.reduce((s, i) => s + i.amount, 0);

        // Debits for the day (withdrawals + deductions)
        const dayWithdrawals = await Withdrawal.find({
            userId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const dayDeductions = await Deduction.find({
            userId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalDebits =
            dayWithdrawals.reduce((s, w) => s + w.amount, 0) +
            dayDeductions.reduce((s, d) => s + d.amount, 0);

        // Current wallet balance
        const user = await User.findById(userId).select('walletBalance');
        const closingBalance = user.walletBalance;
        const openingBalance = closingBalance - totalCredits + totalDebits;

        res.json({
            success: true,
            date: targetDate,
            openingBalance: Math.max(0, openingBalance),
            closingBalance,
            totalCredits,
            totalDebits
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateWithdrawalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        if (!['Approved', 'Completed', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) return res.status(404).json({ success: false, message: 'Withdrawal not found' });

        // If status is changed to Rejected, REFUND the amount to user's wallet
        if (status === 'Rejected' && withdrawal.status !== 'Rejected') {
            const user = await User.findById(withdrawal.userId).select('userName memberId email');
            if (user) {
                const refundWalletType = normalizeWalletType(withdrawal.walletType || 'e-wallet');
                const deductions = await Deduction.find({ relatedWithdrawalId: withdrawal._id });
                const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
                const refundAmount = Number(withdrawal.requestedAmount || 0) || (withdrawal.amount + totalDeductions);

                await createWalletLedgerEntry({
                    userId: user._id,
                    walletType: refundWalletType,
                    txType: 'credit',
                    amount: refundAmount,
                    sourceType: 'withdrawal-rejected-refund',
                    entryType: 'withdrawal-refund',
                    sourceId: withdrawal._id,
                    referenceId: withdrawal.referenceNo,
                    description: `Refund for rejected withdrawal (${withdrawal.referenceNo})`,
                });

                await IncomeHistory.create({
                    userId: user._id,
                    amount: refundAmount,
                    type: 'Refund',
                    walletType: refundWalletType,
                    description: `Refund for Rejected Withdrawal (${withdrawal.referenceNo})`,
                    referenceId: withdrawal.referenceNo,
                    meta: {
                        walletType: refundWalletType,
                        totalDeductions,
                    },
                });
            }
        }

        withdrawal.status = status;
        if (adminNote) withdrawal.adminNote = adminNote;
        if (status === 'Completed') withdrawal.processedDate = new Date();

        await withdrawal.save();

        // ── SEND EMAIL NOTIFICATION ──────────────────────────────────────────
        try {
            const user = await User.findById(withdrawal.userId);
            if (user && user.email) {
                let subject = '';
                let html = '';

                if (status === 'Approved') {
                    subject = `Withdrawal Request Approved - ${withdrawal.referenceNo}`;
                    html = `
                        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #C8A96A;">Withdrawal Approved</h2>
                            <p>Dear ${user.userName || 'Member'},</p>
                            <p>Your withdrawal request <strong>${withdrawal.referenceNo}</strong> has been approved by the administrator.</p>
                            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="margin: 0;"><strong>Amount:</strong> ₹${withdrawal.amount.toLocaleString('en-IN')}</p>
                                <p style="margin: 5px 0 0;"><strong>Method:</strong> ${withdrawal.method}</p>
                            </div>
                            <p>Funds are being processed and will be settled shortly. ${adminNote ? `<br><br><strong>Admin Note:</strong> ${adminNote}` : ''}</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #999;">This is an automated notification from Sanyukt Parivaar.</p>
                        </div>
                    `;
                } else if (status === 'Completed') {
                    subject = `Withdrawal Successfully Settled - ${withdrawal.referenceNo}`;
                    html = `
                        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #28a745;">Withdrawal Completed</h2>
                            <p>Dear ${user.userName || 'Member'},</p>
                            <p>Great news! Your withdrawal request <strong>${withdrawal.referenceNo}</strong> has been successfully settled.</p>
                            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p style="margin: 0;"><strong>Settled Amount:</strong> ₹${withdrawal.amount.toLocaleString('en-IN')}</p>
                                <p style="margin: 5px 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                            </div>
                            <p>Please check your bank account or UPI for the funds. ${adminNote ? `<br><br><strong>Admin Note:</strong> ${adminNote}` : ''}</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #999;">Thank you for being a part of Sanyukt Parivaar.</p>
                        </div>
                    `;
                } else if (status === 'Rejected') {
                    subject = `Withdrawal Request Rejected - ${withdrawal.referenceNo}`;
                    html = `
                        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #dc3545;">Withdrawal Rejected</h2>
                            <p>Dear ${user.userName || 'Member'},</p>
                            <p>Your withdrawal request <strong>${withdrawal.referenceNo}</strong> has been rejected.</p>
                            <p><strong>Reason:</strong> ${adminNote || 'Insufficient details or administrative policy.'}</p>
                            <div style="background: #fff5f5; padding: 15px; border-radius: 5px; border: 1px solid #feb2b2; margin: 20px 0;">
                                <p style="margin: 0; color: #c53030;"><strong>Important:</strong> The full amount has been refunded to your wallet account.</p>
                            </div>
                            <p>Please review the reason and submit a new request if necessary.</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="font-size: 12px; color: #999;">Sanyukt Parivaar Support Team</p>
                        </div>
                    `;
                }

                if (html) {
                    const sendEmail = require('../utils/sendEmail');
                    await sendEmail(user.email, subject, `Your withdrawal status is now ${status}.`, html);
                }
            }
        } catch (emailErr) {
            console.error('Failed to send status update email:', emailErr);
            // We don't return error here because the status update itself succeeded
        }

        res.json({
            success: true,
            message: `Withdrawal status updated to ${status}`,
            withdrawal
        });
    } catch (err) {
        console.error('UpdateWithdrawalStatus Error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getWalletSummary = async (req, res) => {
    try {
        const walletType = normalizeWalletType(req.query.walletType || 'e-wallet');
        const { balance } = await getWalletBalance(req.user._id, walletType);

        const [summaryRows, records] = await Promise.all([
            WalletLedger.aggregate([
                { $match: { userId: req.user._id, walletType } },
                {
                    $group: {
                        _id: '$txType',
                        total: { $sum: '$amount' },
                    },
                },
            ]),
            WalletLedger.countDocuments({ userId: req.user._id, walletType }),
        ]);

        const totals = summaryRows.reduce(
            (acc, row) => {
                if (row._id === 'credit') acc.totalCredits = row.total;
                if (row._id === 'debit') acc.totalDebits = row.total;
                return acc;
            },
            { totalCredits: 0, totalDebits: 0 }
        );

        res.json({
            success: true,
            walletType,
            balance,
            totalCredits: totals.totalCredits,
            totalDebits: totals.totalDebits,
            totalRecords: records,
        });
    } catch (err) {
        console.error('GetWalletSummary Error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

exports.getWalletTransactions = async (req, res) => {
    try {
        const walletType = normalizeWalletType(req.params.walletType || req.query.walletType);
        const query = {
            userId: req.user._id,
            walletType,
        };

        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : null;
        const toDate = req.query.toDate ? new Date(req.query.toDate) : null;

        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate && !Number.isNaN(fromDate.getTime())) {
                fromDate.setHours(0, 0, 0, 0);
                query.createdAt.$gte = fromDate;
            }
            if (toDate && !Number.isNaN(toDate.getTime())) {
                toDate.setHours(23, 59, 59, 999);
                query.createdAt.$lte = toDate;
            }
        }

        const [transactions, summary] = await Promise.all([
            WalletLedger.find(query).sort({ createdAt: -1 }),
            getWalletBalance(req.user._id, walletType),
        ]);

        res.json({
            success: true,
            walletType,
            balance: summary.balance,
            totalRecords: transactions.length,
            transactions,
        });
    } catch (err) {
        console.error('GetWalletTransactions Error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

exports.createWalletRequest = async (req, res) => {
    try {
        const walletType = normalizeWalletType(req.params.walletType);
        if (!['product-wallet', 'repurchase-wallet'].includes(walletType)) {
            return res.status(400).json({ success: false, message: 'Invalid wallet type' });
        }

        const {
            bankName = '',
            bankDetails = '',
            paymentMode = 'UPI',
            requestFund,
            remark = '',
            password = '',
        } = req.body;

        const amount = Number(requestFund || 0);
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Valid request amount enter karo' });
        }

        const user = await User.findById(req.user._id).select('+password userName memberId email walletBalance productWalletBalance repurchaseWalletBalance');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.password) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ success: false, message: 'Transaction / account password galat hai' });
            }
        }

        const currentWallet = await getWalletBalance(user._id, walletType);

        const walletRequest = await WalletRequest.create({
            userId: user._id,
            walletType,
            bankName,
            bankDetails,
            paymentMode,
            currentBalance: currentWallet.balance,
            requestAmount: amount,
            remark,
            attachment: req.file ? `/uploads/${req.file.filename}` : '',
        });

        res.status(201).json({
            success: true,
            message: 'Wallet request submitted successfully',
            request: walletRequest,
        });
    } catch (err) {
        console.error('CreateWalletRequest Error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

exports.getWalletRequestHistory = async (req, res) => {
    try {
        const walletType = normalizeWalletType(req.params.walletType);
        const requests = await WalletRequest.find({
            userId: req.user._id,
            walletType,
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            walletType,
            totalRecords: requests.length,
            requests,
        });
    } catch (err) {
        console.error('GetWalletRequestHistory Error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

exports.getAllWalletRequests = async (req, res) => {
    try {
        const { status = 'All', walletType = 'All', search = '' } = req.query;
        const query = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        if (walletType && walletType !== 'All') {
            query.walletType = normalizeWalletType(walletType);
        }

        if (search) {
            const users = await User.find({
                $or: [
                    { userName: { $regex: search, $options: 'i' } },
                    { memberId: { $regex: search, $options: 'i' } },
                    { mobile: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
            }).select('_id');

            const userIds = users.map((user) => user._id);

            query.$or = [
                { userId: { $in: userIds } },
                { bankName: { $regex: search, $options: 'i' } },
                { remark: { $regex: search, $options: 'i' } },
                { paymentMode: { $regex: search, $options: 'i' } },
            ];
        }

        const requests = await WalletRequest.find(query)
            .populate('userId', 'userName memberId mobile email')
            .populate('approvedBy', 'userName memberId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            requests,
        });
    } catch (err) {
        console.error('GetAllWalletRequests Error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

exports.updateWalletRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote = '' } = req.body;

        if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid request status' });
        }

        const walletRequest = await WalletRequest.findById(id);
        if (!walletRequest) {
            return res.status(404).json({ success: false, message: 'Wallet request not found' });
        }

        if (walletRequest.status !== 'Pending' && status !== walletRequest.status) {
            return res.status(400).json({
                success: false,
                message: `Request already ${walletRequest.status.toLowerCase()} hai`,
            });
        }

        if (status === 'Approved' && walletRequest.status === 'Pending') {
            await createWalletLedgerEntry({
                userId: walletRequest.userId,
                walletType: walletRequest.walletType,
                txType: 'credit',
                amount: walletRequest.requestAmount,
                sourceType: 'wallet-request-approved',
                sourceId: walletRequest._id,
                description: `${walletRequest.walletType} request approved`,
                meta: {
                    paymentMode: walletRequest.paymentMode,
                    bankName: walletRequest.bankName,
                },
            });

            walletRequest.status = 'Approved';
            walletRequest.adminNote = adminNote;
            walletRequest.approvedBy = req.user._id;
            walletRequest.approvedAt = new Date();
        } else if (status === 'Rejected') {
            walletRequest.status = 'Rejected';
            walletRequest.adminNote = adminNote;
            walletRequest.approvedBy = req.user._id;
            walletRequest.approvedAt = new Date();
        } else {
            walletRequest.status = status;
            walletRequest.adminNote = adminNote;
        }

        await walletRequest.save();

        res.json({
            success: true,
            message: `Wallet request ${walletRequest.status.toLowerCase()} successfully`,
            request: walletRequest,
        });
    } catch (err) {
        console.error('UpdateWalletRequestStatus Error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};
