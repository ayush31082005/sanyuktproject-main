const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Deduction = require('../models/Deduction');
const IncomeHistory = require('../models/IncomeHistory');
const Transaction = require('../models/Transaction');

exports.getAllWithdrawals = async (req, res) => {
    try {
        const { status, method, search } = req.query;
        let query = {};

        if (status && status !== 'All') query.status = status;
        if (method && method !== 'All') query.method = method;

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
        const { period = 'thisMonth', type = 'All Types', search = '' } = req.query;

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
            userId,
            ...dateFilter,
            ...typeFilter,
            ...searchFilter
        };

        const deductions = await Deduction.find(query).sort({ createdAt: -1 });

        // Summary stats
        const allDeductions = await Deduction.find({ userId });
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
        const { status = '', method = '', period = '' } = req.query;

        let query = { userId };


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
        const allWithdrawals = await Withdrawal.find({ userId });
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
        const { amount, method, accountNumber, ifscCode, bankName, upiId } = req.body;

        if (!amount || isNaN(amount) || amount < 500) {
            return res.status(400).json({
                success: false,
                message: 'Minimum withdrawal amount is ₹500'
            });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.walletBalance < amount) {
            return res.status(400).json({
                success: false,
                message: `Insufficient wallet balance. You have ₹${user.walletBalance}`
            });
        }

        // TDS deduction (5%) + Processing fee (2%)
        const tdsAmount = Math.round(amount * 0.05);
        const processingFee = Math.round(amount * 0.02);
        const netAmount = amount - tdsAmount - processingFee;

        // Deduct from wallet
        user.walletBalance -= amount;
        await user.save();

        let withdrawal;
        try {
            // Create withdrawal record
            withdrawal = await Withdrawal.create({
                userId,
                amount: netAmount,
                method,
                accountNumber,
                ifscCode,
                bankName,
                upiId
            });

            // Create TDS deduction record
            await Deduction.create({
                userId,
                type: 'Tax',
                amount: tdsAmount,
                description: 'Tax Deducted at Source (TDS)',
                relatedWithdrawalId: withdrawal._id,
                status: 'Processed'
            });

            // Create processing fee record
            await Deduction.create({
                userId,
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
                deductions: { tds: tdsAmount, processingFee }
            });

        } catch (dbErr) {
            console.error('--- WITHDRAWAL DB FAILURE ---');
            console.error(dbErr);

            // ROLLBACK: Refund the user's balance
            user.walletBalance += amount;
            await user.save();

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
            Withdrawal.find({ userId }).sort({ createdAt: -1 }).limit(limit),
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

        // Income history (credits)
        const incomeQuery = { userId };
        if (search) {
            incomeQuery.$or = [
                { type: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const incomes = await IncomeHistory.find(incomeQuery)
            .populate('fromUserId', 'userName memberId')
            .sort({ createdAt: -1 });

        // Other Payments/Recharges & Withdrawals (debits)
        const [withdrawals, otherTransactions] = await Promise.all([
            Withdrawal.find({ userId }).sort({ createdAt: -1 }),
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
            const user = await User.findById(withdrawal.userId);
            if (user) {
                // The amount deducted initially was 'netAmount + tds + fee' = original 'amount'
                // But withdrawal.amount is 'netAmount'. We need the original amount.
                // Let's find associated deductions to get the full amount back.
                const deductions = await Deduction.find({ relatedWithdrawalId: withdrawal._id });
                const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
                const refundAmount = withdrawal.amount + totalDeductions;

                user.walletBalance += refundAmount;
                await user.save();

                // Create a refund transaction/history entry
                await IncomeHistory.create({
                    userId: user._id,
                    amount: refundAmount,
                    type: 'Refund',
                    description: `Refund for Rejected Withdrawal (${withdrawal.referenceNo})`,
                    status: 'Processed'
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

