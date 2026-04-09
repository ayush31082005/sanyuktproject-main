import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Wallet, Banknote, Smartphone, ChevronRight,
    AlertCircle, CheckCircle, Loader2, Info, X, IndianRupee,
    Shield, Clock, Receipt, TrendingDown, Building2,
    CreditCard, HelpCircle, FileText, Lock, Download,
    Calendar, Copy, ExternalLink, Plus, Zap, Award,
    Sparkles, RefreshCw, Users, Gift, TrendingUp
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

// Custom Crown icon
const CrownIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 4l3 12h14l3-12-6 4-4-4-4 4-6-4z" />
    </svg>
);

// ── Constants ─────────────────────────────────────────────────────────────
const TDS_RATE = 0.05;
const PROCESSING_RATE = 0.02;
const QUICK_TOPUP_AMOUNTS = [
    { value: 599, label: 'Silver', icon: Award, color: '#C8A96A' },
    { value: 1299, label: 'Gold', icon: Award, color: '#C8A96A' },
    { value: 2699, label: 'Diamond', icon: Award, color: '#C8A96A' },
    { value: 500, label: 'Quick', icon: Zap, color: '#C8A96A' },
    { value: 1000, label: 'Value', icon: TrendingUp, color: '#C8A96A' },
    { value: 2000, label: 'Premium', icon: Sparkles, color: '#C8A96A' },
    { value: 5000, label: 'Elite', icon: CrownIcon, color: '#C8A96A' },
];

// ── Tooltip Component ─────────────────────────────────────────────────────
const Tooltip = ({ text, children }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}>
            {children}
            <AnimatePresence>
                {show && (
                    <Motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#C8A96A]/20 text-[#F5E6C8] text-xs rounded-lg whitespace-nowrap z-50 shadow-2xl"
                    >
                        {text}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]"></div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Load Razorpay script ─────────────────────────────────────────────────
const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

// ── Withdrawal Calculation ───────────────────────────────────────────────
const calcWithdrawal = (amount) => {
    const tds = Math.round(amount * TDS_RATE);
    const fee = Math.round(amount * PROCESSING_RATE);
    const net = amount - tds - fee;
    return { tds, fee, net };
};

// ── Confirm Withdrawal Modal ─────────────────────────────────────────────
const ConfirmWithdrawalModal = ({ data, onConfirm, onCancel, loading }) => {
    const { amount, method, tds, fee, net, bankName, accountNumber, upiId } = data;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <Motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative luxury-box w-full max-w-md overflow-hidden bg-[#0D0D0D] shadow-2xl"
            >
                <div className="px-6 py-4 bg-[#1A1A1A] border-b border-[#C8A96A]/20 text-[#C8A96A]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#C8A96A]/10 rounded-xl">
                                <Receipt className="w-5 h-5 text-[#C8A96A]" />
                            </div>
                            <h2 className="text-lg font-serif font-bold uppercase tracking-widest">Confirm Withdrawal</h2>
                        </div>
                        <button onClick={onCancel} className="p-1.5 hover:bg-[#C8A96A]/10 rounded-lg transition text-[#C8A96A]/60">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-5 bg-[#0D0D0D]">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-[#1A1A1A] rounded-xl border border-[#C8A96A]/10">
                        <div className={`p-2.5 rounded-xl bg-[#C8A96A]/5 border border-[#C8A96A]/20`}>
                            {method === 'Bank Transfer'
                                ? <Building2 className="w-5 h-5 text-[#C8A96A]" />
                                : <Smartphone className="w-5 h-5 text-[#C8A96A]" />
                            }
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-black text-[#C8A96A]/60 uppercase tracking-widest leading-none mb-1">Method</p>
                            <p className="font-bold text-[#F5E6C8]">{method}</p>
                        </div>
                        {method === 'Bank Transfer' && (
                            <div className="text-right">
                                <p className="text-xs text-[#C8A96A]/60 font-black uppercase tracking-widest mb-1">{bankName}</p>
                                <p className="text-sm font-mono font-bold text-[#C8A96A]">
                                    ****{accountNumber?.slice(-4)}
                                </p>
                            </div>
                        )}
                        {method === 'UPI' && (
                            <div className="text-right">
                                <p className="text-xs text-[#C8A96A]/60 font-black uppercase tracking-widest mb-1">UPI ID</p>
                                <p className="text-sm font-mono font-bold text-[#C8A96A]">{upiId}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#1A1A1A] rounded-xl p-5 mb-4 border border-[#C8A96A]/10">
                        <h3 className="text-xs font-black text-[#C8A96A]/60 uppercase tracking-[0.2em] mb-4">Amount Breakdown</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[#F5E6C8]/60 font-medium">Withdrawal Amount</span>
                                <span className="font-bold text-[#F5E6C8]">₹{amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-[#C8A96A]/60">TDS (5%)</span>
                                </div>
                                <span className="font-bold text-[#C8A96A]">- ₹{tds.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-[#C8A96A]/60">Processing Fee (2%)</span>
                                </div>
                                <span className="font-bold text-[#C8A96A]">- ₹{fee.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="border-t border-[#C8A96A]/10 pt-3 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-[#C8A96A]/70 uppercase tracking-widest">Net Payable</span>
                                    <span className="text-2xl font-serif font-bold text-[#C8A96A]">₹{net.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#C8A96A]/5 border border-[#C8A96A]/20 rounded-xl p-3.5 mb-4">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-[#C8A96A] shrink-0" />
                            <div>
                                <p className="text-xs font-black text-[#C8A96A] uppercase tracking-widest mb-1">Important Information</p>
                                <ul className="text-[11px] text-[#F5E6C8]/60 space-y-1 font-medium italic">
                                    <li className="flex items-start gap-1.5">• Amount will be deducted from wallet immediately</li>
                                    <li className="flex items-start gap-1.5">• Processing takes 24-48 hours after admin approval</li>
                                    <li className="flex items-start gap-1.5">• You'll receive SMS/email confirmation</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onCancel} disabled={loading}
                            className="flex-1 py-3.5 rounded-xl border border-[#C8A96A]/20 text-[#C8A96A]/60 font-bold text-xs uppercase tracking-widest hover:bg-[#C8A96A]/5 transition disabled:opacity-50">
                            Cancel
                        </button>
                        <button onClick={onConfirm} disabled={loading}
                            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black text-xs uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-[#C8A96A]/20 transition flex items-center justify-center gap-2 disabled:opacity-60">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Confirm Withdrawal
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Motion.div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────
const WalletManagement = ({ defaultTab = 'topup' }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(defaultTab); // 'topup' or 'withdraw'

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    // Common State
    const [walletBalance, setWalletBalance] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalWithdrawals, setTotalWithdrawals] = useState(0);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    // Topup State
    const [topupAmount, setTopupAmount] = useState('');
    const [processingTopup, setProcessingTopup] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');

    // Withdrawal State
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccount, setConfirmAccount] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [upiId, setUpiId] = useState('');
    const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
    const [processingWithdraw, setProcessingWithdraw] = useState(false);
    const [withdrawalHistory, setWithdrawalHistory] = useState([]);
    const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);

    // Payment methods for topup
    const paymentMethods = [
        { id: 'all', label: 'All', icon: CreditCard },
        { id: 'upi', label: 'UPI', icon: Smartphone },
        { id: 'card', label: 'Card', icon: CreditCard },
        { id: 'netbanking', label: 'NetBanking', icon: Lock },
    ];

    // ── Data Fetching ─────────────────────────────────────────────────────
    const fetchWalletData = async () => {
        try {
            setLoadingBalance(true);
            setLoadingTransactions(true);
            setLoadingWithdrawals(true);

            const balanceRes = await api.get('/wallet/topup/balance');
            if (balanceRes.data.success) {
                setWalletBalance(balanceRes.data.walletBalance || 0);
                setTotalDeposits(balanceRes.data.totalDeposits || 0);
                setTotalWithdrawals(balanceRes.data.totalWithdrawals || 0);
            }

            // Fetch recent transactions
            try {
                const txRes = await api.get('/wallet/recent-transactions?limit=5');
                if (txRes.data.success) setRecentTransactions(txRes.data.transactions || []);
            } catch (txErr) {
                console.warn('Transactions 404/Error:', txErr);
                setRecentTransactions([]);
            }

            // Fetch withdrawal history
            try {
                const withdrawRes = await api.get('/wallet/withdrawal-history?limit=6');
                if (withdrawRes.data.success) setWithdrawalHistory(withdrawRes.data.withdrawals || []);
            } catch (wErr) {
                console.warn('Withdrawals 404/Error:', wErr);
                setWithdrawalHistory([]);
            }

        } catch (err) {
            console.error('Error fetching wallet data:', err);
        } finally {
            setLoadingBalance(false);
            setLoadingTransactions(false);
            setLoadingWithdrawals(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    // ── Topup Logic ───────────────────────────────────────────────────────
    const parsedTopupAmount = parseInt(topupAmount, 10);
    const isTopupValid = !isNaN(parsedTopupAmount) && parsedTopupAmount >= 100 && parsedTopupAmount <= 50000;

    const handleTopup = async () => {
        if (!isTopupValid) return;
        setProcessingTopup(true);

        try {
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast.error('Unable to load payment gateway. Please check your internet connection.');
                setProcessingTopup(false);
                return;
            }

            const { data: orderData } = await api.post('/wallet/topup/create-order', {
                amount: parsedTopupAmount,
            });

            if (!orderData.success) {
                toast.error(orderData.message || 'Failed to create order.');
                setProcessingTopup(false);
                return;
            }
            if (!orderData?.order?.id || !orderData?.order?.amount) {
                throw new Error('Invalid payment order response from server.');
            }

            // Mock mode check
            if (orderData.order.id.startsWith('order_mock_')) {
                const { data: verifyData } = await api.post('/wallet/topup/verify', {
                    razorpay_order_id: orderData.order.id,
                    razorpay_payment_id: `pay_mock_${Date.now()}`,
                    razorpay_signature: 'mock_signature',
                    amount: parsedTopupAmount,
                });

                if (verifyData.success) {
                    setWalletBalance(verifyData.walletBalance);
                    setTopupAmount('');
                    toast.success(
                        <div>
                            <div className="font-bold">₹{parsedTopupAmount.toLocaleString('en-IN')} added successfully!</div>
                            <div className="text-xs opacity-90">(Test Mode)</div>
                        </div>
                    );
                    fetchWalletData();
                }
                setProcessingTopup(false);
                return;
            }

            const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKeyId) {
                console.error("Razorpay key is missing in frontend env");
                alert("Payment configuration error. Please contact support.");
                setProcessingTopup(false);
                return;
            }

            const options = {
                key: razorpayKeyId,
                amount: orderData.order.amount,
                currency: 'INR',
                name: 'Sanyukt Parivar',
                description: `Wallet Top-Up - ₹${parsedTopupAmount}`,
                order_id: orderData.order.id,
                prefill: {
                    name: orderData.user.name,
                    email: orderData.user.email,
                    contact: orderData.user.mobile,
                },
                theme: { color: '#0A7A2F' },

                handler: async (response) => {
                    if (!response || !response.razorpay_payment_id) {
                        console.error("Invalid Razorpay response", response);
                        alert("Payment failed. Try again.");
                        setProcessingTopup(false);
                        return;
                    }

                    try {
                        const { data: verifyData } = await api.post('/wallet/topup/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: parsedTopupAmount,
                        });
                        if (!verifyData || typeof verifyData !== 'object') {
                            throw new Error('Invalid verification response from server.');
                        }

                        if (verifyData.success) {
                            setWalletBalance(verifyData.walletBalance);
                            setTopupAmount('');
                            toast.success(
                                <div>
                                    <div className="font-bold">₹{parsedTopupAmount.toLocaleString('en-IN')} added successfully!</div>
                                    <div className="text-xs opacity-90">Your wallet has been credited</div>
                                </div>
                            );
                            fetchWalletData();
                        } else {
                            toast.error(verifyData.message || 'Payment verification failed.');
                        }
                    } catch {
                        toast.error('Verification failed. Please contact support.');
                    } finally {
                        setProcessingTopup(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        toast('Payment cancelled', { icon: 'ℹ️' });
                        setProcessingTopup(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error('Topup error:', err);
            toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
            setProcessingTopup(false);
        }
    };

    // ── Withdrawal Logic ──────────────────────────────────────────────────
    const parsedWithdrawAmount = parseInt(withdrawAmount, 10);
    const isWithdrawValid = !isNaN(parsedWithdrawAmount) && parsedWithdrawAmount >= 500 && parsedWithdrawAmount <= walletBalance;
    const { tds, fee, net } = isWithdrawValid ? calcWithdrawal(parsedWithdrawAmount) : { tds: 0, fee: 0, net: 0 };

    const isBankValid = withdrawMethod === 'Bank Transfer' &&
        bankName.trim().length >= 3 &&
        accountNumber.trim().length >= 9 &&
        accountNumber === confirmAccount &&
        ifscCode.trim().length >= 11;

    const isUpiValid = withdrawMethod === 'UPI' &&
        /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim());

    const canWithdraw = isWithdrawValid && (isBankValid || isUpiValid);

    const handleWithdraw = async () => {
        setProcessingWithdraw(true);
        try {
            const payload = {
                amount: parsedWithdrawAmount,
                method: withdrawMethod,
                ...(withdrawMethod === 'Bank Transfer' ? { bankName, accountNumber, ifscCode } : {}),
                ...(withdrawMethod === 'UPI' ? { upiId } : {}),
            };
            const res = await api.post('/wallet/withdraw', payload);
            if (res.data.success) {
                setWalletBalance(prev => prev - parsedWithdrawAmount);
                setShowWithdrawConfirm(false);
                toast.success(
                    <div>
                        <div className="font-bold">Withdrawal Request Submitted!</div>
                        <div className="text-xs opacity-90">Reference: {res.data.withdrawal?.referenceNo}</div>
                    </div>
                );
                // Reset form
                setWithdrawAmount('');
                setWithdrawMethod('');
                setBankName('');
                setAccountNumber('');
                setConfirmAccount('');
                setIfscCode('');
                setUpiId('');

                fetchWalletData();
            }
        } catch (err) {
            console.error('Withdraw error:', err);
            const errMsg = err?.response?.data?.message || 'Withdrawal failed. Please try again.';
            const dbErr = err?.response?.data?.error;
            toast.error(dbErr ? `${errMsg} Reason: ${dbErr}` : errMsg);
        } finally {
            setProcessingWithdraw(false);
        }
    };

    // ── Helper Functions ──────────────────────────────────────────────────
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-100/10 text-green-500 border-green-500/20';
            case 'pending': return 'bg-orange-100/10 text-orange-500 border-orange-500/20';
            case 'rejected': return 'bg-red-100/10 text-red-500 border-red-500/20';
            case 'processing': return 'bg-blue-100/10 text-blue-500 border-blue-500/20';
            case 'success': return 'bg-green-100/10 text-green-500 border-green-500/20';
            default: return 'bg-gray-100/10 text-gray-500 border-gray-500/20';
        }
    };

    // ── Render Functions ──────────────────────────────────────────────────
    const renderTopupTab = () => (
        <div className="space-y-6 font-bold">
            {/* Quick Topup Amounts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {QUICK_TOPUP_AMOUNTS.map(({ value, label, icon: Icon }) => (
                    <button
                        key={value}
                        onClick={() => setTopupAmount(String(value))}
                        className={`relative p-3 luxury-box transition-all group ${parsedTopupAmount === value
                            ? 'border-[#C8A96A] bg-[#C8A96A]/10 shadow-[0_0_15px_rgba(200,169,106,0.1)]'
                            : 'hover:border-[#C8A96A]/40 hover:bg-[#C8A96A]/5'
                            }`}
                    >
                        <div className="flex flex-col items-center">
                            {React.createElement(Icon, {
                                className: `w-4 h-4 mb-1.5 ${parsedTopupAmount === value ? 'text-[#C8A96A]' : 'text-[#C8A96A] group-hover:text-[#F5E6C8]'}`
                            })}
                            <span className="text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.1em] group-hover:text-[#F5E6C8]">{label}</span>
                            <span className="text-xl font-bold text-[#F5E6C8]">₹{value}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Amount Input */}
            <div>
                <label className="block text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.12em] mb-3 ml-1 text-center">Enter Capital Amount</label>
                <div className={`flex items-center luxury-box bg-[#0D0D0D] transition-all ${topupAmount && !isTopupValid
                    ? 'border-red-900/50 bg-red-950/20'
                    : 'border-[#C8A96A]/20 hover:border-[#C8A96A]/60'
                    }`}>
                    <span className={`pl-4 md:pl-6 font-serif font-bold text-2xl md:text-3xl ${topupAmount ? 'text-[#C8A96A]' : 'text-[#C8A96A]/70'}`}>₹</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MIN ₹100"
                        value={topupAmount}
                        onChange={(e) => setTopupAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-4 md:p-6 bg-transparent outline-none text-2xl md:text-4xl font-serif font-bold text-[#F5E6C8] placeholder:text-[#C8A96A]/80 placeholder:font-sans placeholder:text-[13px] placeholder:tracking-[0.12em]"
                    />
                    {topupAmount && (
                        <button onClick={() => setTopupAmount('')} className="pr-6 text-[#C8A96A] hover:text-[#F5E6C8]">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {topupAmount && !isNaN(parsedTopupAmount) && parsedTopupAmount < 100 && (
                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Minimum amount is ₹100
                    </p>
                )}
                {topupAmount && !isNaN(parsedTopupAmount) && parsedTopupAmount > 50000 && (
                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Maximum amount is ₹50,000
                    </p>
                )}
            </div>

            {/* Payment Methods */}
            <div>
                <p className="text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.12em] mb-4 ml-1 text-center">Proprietary Gateway</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {paymentMethods.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setSelectedPaymentMethod(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 transition-all border ${selectedPaymentMethod === id
                                ? 'bg-[#C8A96A]/10 border-[#C8A96A] text-[#C8A96A]'
                                : 'bg-[#0D0D0D] border-[#C8A96A]/30 text-[#C8A96A] hover:border-[#C8A96A]'
                                }`}
                        >
                            {React.createElement(Icon, { className: 'w-3.5 h-3.5', strokeWidth: 1.5 })}
                            <span className="text-[13px] font-black uppercase tracking-[0.08em]">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {isTopupValid && (
                <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 border border-[#C8A96A]/20 bg-gradient-to-r from-[#C8A96A]/5 to-[#D4AF37]/5"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.12em]">Available Wallet Balance</span>
                        <span className="text-2xl font-serif font-bold text-[#C8A96A]">
                            ₹{(walletBalance + parsedTopupAmount).toLocaleString('en-IN')}
                        </span>
                    </div>
                </Motion.div>
            )}

            {/* Pay Button */}
            <button
                onClick={handleTopup}
                disabled={!isTopupValid || processingTopup}
                className={`w-full h-16 transition-all flex items-center justify-center gap-4 ${isTopupValid && !processingTopup
                    ? 'bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black uppercase tracking-[0.18em] text-[13px] hover:shadow-gold-900/40 hover:-translate-y-1'
                    : 'bg-[#0D0D0D] border border-[#C8A96A]/30 text-[#C8A96A]/70 cursor-not-allowed font-black uppercase tracking-[0.18em] text-[13px]'
                    }`}
            >
                {processingTopup ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Initiating Secure Transfer...
                    </>
                ) : (
                    <>
                        <Zap className="w-5 h-5" />
                        Execute ₹{isTopupValid ? parsedTopupAmount.toLocaleString('en-IN') : 'Deposit'}
                    </>
                )}
            </button>
        </div>
    );

    const renderWithdrawTab = () => (
        <div className="space-y-6 font-bold">
            {/* Quick Withdraw Amounts */}
            <div className="flex flex-wrap justify-center gap-3">
                {[500, 1000, 2000, 5000].map(a => (
                    <button
                        key={a}
                        onClick={() => setWithdrawAmount(String(Math.min(a, walletBalance)))}
                        className={`px-5 py-2 transition-all border ${parsedWithdrawAmount === a
                            ? 'bg-[#C8A96A]/10 border-[#C8A96A] text-[#C8A96A]'
                            : 'bg-[#0D0D0D] border-[#C8A96A]/30 text-[#C8A96A] hover:border-[#C8A96A]'
                            }`}
                    >
                        <span className="text-[13px] font-black tracking-[0.1em] uppercase">₹{a.toLocaleString('en-IN')}</span>
                    </button>
                ))}
                <button
                    onClick={() => setWithdrawAmount(String(walletBalance))}
                    className="px-5 py-2 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] hover:shadow-gold-900/40 transition-all font-black text-[13px] uppercase tracking-[0.1em]"
                >
                    Withdraw All
                </button>
            </div>

            {/* Amount Input */}
            <div>
                <label className="block text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.12em] mb-3 ml-1 text-center">Enter Withdrawal Amount</label>
                <div className={`flex items-center luxury-box bg-[#0D0D0D] transition-all ${withdrawAmount && !isWithdrawValid
                    ? 'border-red-900/50 bg-red-950/20'
                    : 'border-[#C8A96A]/20 hover:border-[#C8A96A]/60'
                    }`}>
                    <span className={`pl-4 md:pl-6 font-serif font-bold text-2xl md:text-3xl ${withdrawAmount ? 'text-[#C8A96A]' : 'text-[#C8A96A]/70'}`}>₹</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MIN ₹500"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-4 md:p-6 bg-transparent outline-none text-2xl md:text-4xl font-serif font-bold text-[#F5E6C8] placeholder:text-[#C8A96A]/80 placeholder:font-sans placeholder:text-[13px] placeholder:tracking-[0.12em]"
                    />
                    {withdrawAmount && (
                        <button onClick={() => setWithdrawAmount('')} className="pr-6 text-[#C8A96A] hover:text-[#F5E6C8]">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {withdrawAmount && !isNaN(parsedWithdrawAmount) && parsedWithdrawAmount < 500 && (
                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Minimum withdrawal is ₹500
                    </p>
                )}
                {withdrawAmount && !isNaN(parsedWithdrawAmount) && parsedWithdrawAmount > walletBalance && (
                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Insufficient balance
                    </p>
                )}
            </div>

            {/* Withdrawal Breakdown */}
            {isWithdrawValid && (
                <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 border border-[#C8A96A]/10 bg-[#1A1A1A]"
                >
                    <h3 className="text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.12em] mb-4 text-center">Settlement Structure</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-[13px]">
                            <span className="text-[#F5E6C8] font-black">Withdrawal Total</span>
                            <span className="font-bold text-[#F5E6C8]">₹{parsedWithdrawAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-[13px] font-bold">
                            <span className="text-[#C8A96A] italic">TDS Withheld (5%)</span>
                            <span className="font-bold text-[#C8A96A]">- ₹{tds.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-[13px] font-bold">
                            <span className="text-[#C8A96A] italic">Management Fee (2%)</span>
                            <span className="font-bold text-[#C8A96A]">- ₹{fee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="border-t border-[#C8A96A]/10 pt-4 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.1em]">Net Settlement</span>
                                <span className="text-3xl font-serif font-bold text-[#C8A96A]">₹{net.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </Motion.div>
            )}

            {/* Withdrawal Method Selection */}
            <div>
                <p className="text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.12em] mb-4 ml-1 text-center">Settlement Channel</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { id: 'Bank Transfer', icon: Building2, label: 'Standard Bank', sub: 'NEFT/IMPS' },
                        { id: 'UPI', icon: Smartphone, label: 'Instant UPI', sub: 'Lattice Verify' },
                    ].map(({ id, icon: Icon, label, sub }) => (
                        <button
                            key={id}
                            onClick={() => setWithdrawMethod(id)}
                            className={`p-5 transition-all border relative overflow-hidden group ${withdrawMethod === id
                                ? 'bg-[#C8A96A]/5 border-[#C8A96A]'
                                : 'bg-[#0D0D0D] border-[#C8A96A]/30 hover:border-[#C8A96A]'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${withdrawMethod === id ? 'bg-[#C8A96A] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-[#C8A96A]'}`}>
                                {React.createElement(Icon, { className: 'w-5 h-5', strokeWidth: 1.5 })}
                            </div>
                            <p className={`text-[13px] font-black uppercase tracking-[0.1em] mb-1 ${withdrawMethod === id ? 'text-[#C8A96A]' : 'text-[#F5E6C8]'}`}>
                                {label}
                            </p>
                            <p className="text-[12px] font-black text-[#C8A96A] italic">{sub}</p>
                            {withdrawMethod === id && (
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="w-2 h-2 rounded-full bg-[#C8A96A] shadow-[0_0_8px_#C8A96A]" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {withdrawMethod === 'Bank Transfer' && (
                    <Motion.div
                        key="bank"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                    >
                        <div>
                            <label className="block text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.08em] mb-1.5 ml-1">Bank Institution</label>
                            <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="E.G. RESERVE BANK OF INDIA"
                                className="w-full p-4 bg-[#0D0D0D] border-b-2 border-[#C8A96A]/40 focus:border-[#C8A96A] outline-none transition text-[#F5E6C8] text-[13px] uppercase tracking-[0.08em] font-bold"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.08em] mb-1.5 ml-1">Vault Number</label>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="0000 0000 0000"
                                    className="w-full p-4 bg-[#0D0D0D] border-b-2 border-[#C8A96A]/40 focus:border-[#C8A96A] outline-none transition text-[#F5E6C8] text-[13px] font-mono font-bold tracking-[0.16em]"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.08em] mb-1.5 ml-1">Routing Code</label>
                                <input
                                    type="text"
                                    value={ifscCode}
                                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                    placeholder="IFSC0000000"
                                    className="w-full p-4 bg-[#0D0D0D] border-b-2 border-[#C8A96A]/40 focus:border-[#C8A96A] outline-none transition text-[#F5E6C8] text-[13px] font-mono font-bold uppercase tracking-[0.16em]"
                                />
                            </div>
                        </div>
                    </Motion.div>
                )}

                {withdrawMethod === 'UPI' && (
                    <Motion.div
                        key="upi"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <label className="block text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.08em] mb-1.5 ml-1">UPI Identifier</label>
                        <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="IDENTIFIER@UPI"
                            className={`w-full p-4 bg-[#0D0D0D] border-b-2 outline-none transition font-mono text-[13px] font-bold tracking-[0.08em] ${upiId && !isUpiValid
                                ? 'border-red-900 text-red-400'
                                : 'border-[#C8A96A]/40 focus:border-[#C8A96A] text-[#F5E6C8]'
                                }`}
                        />
                        {upiId && !isUpiValid && (
                            <p className="text-[10px] text-red-500 mt-2 flex items-center gap-1 font-bold italic">
                                <AlertCircle className="w-3 h-3" /> Input hash mismatch. Verify UPI ID.
                            </p>
                        )}
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Submit Withdrawal Button */}
            <button
                onClick={() => setShowWithdrawConfirm(true)}
                disabled={!canWithdraw}
                className={`w-full h-16 transition-all flex items-center justify-center gap-4 ${canWithdraw
                    ? 'bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black uppercase tracking-[0.16em] text-[13px] hover:shadow-gold-900/40 hover:-translate-y-1'
                    : 'bg-[#0D0D0D] border border-[#C8A96A]/30 text-[#C8A96A]/70 cursor-not-allowed font-black uppercase tracking-[0.16em] text-[13px]'
                    }`}
            >
                <Receipt className="w-5 h-5" />
                Submit Withdrawal Request
            </button>

            {/* Withdrawal History Section */}
            <div className="mt-12 pt-12 border-t border-[#C8A96A]/10">
                <div className="flex flex-col items-center justify-center text-center mb-10">
                    <h3 className="text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.12em]">Recent Settlement Activity</h3>
                    <p className="text-[12px] text-[#C8A96A] font-black uppercase tracking-[0.08em] mt-1 italic">Track your withdrawals</p>
                    {loadingWithdrawals && <Loader2 className="w-4 h-4 animate-spin text-[#C8A96A] mt-4" />}
                </div>

                {withdrawalHistory.length > 0 ? (
                    <div className="space-y-4">
                        {withdrawalHistory.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="p-4 bg-[#0D0D0D] border border-[#C8A96A]/5 rounded-sm hover:border-[#C8A96A]/20 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getStatusColor(item.status)}`}>
                                            {item.status === 'Completed' ? <CheckCircle className="w-5 h-5" /> : 
                                             item.status === 'Rejected' ? <X className="w-5 h-5" /> : 
                                             <Clock className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[13px] font-bold text-[#F5E6C8] uppercase tracking-[0.08em]">₹{item.amount.toLocaleString('en-IN')}</p>
                                                <span className={`text-[11px] font-black uppercase tracking-[0.08em] px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-[12px] font-black text-[#C8A96A] mt-1 uppercase tracking-[0.06em]">REF: {item.referenceNo}</p>
                                            <p className="text-[11px] text-[#C8A96A] font-bold italic">{formatDate(item.createdAt)} • {item.method}</p>
                                        </div>
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-[#C8A96A]/5 pt-3 sm:pt-0">
                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-[#C8A96A] uppercase tracking-[0.08em] leading-none mb-1">Net Settlement</p>
                                            <p className="text-[13px] font-bold text-[#C8A96A]">₹{item.amount.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {item.adminNote && (
                                    <div className="mt-4 p-3 bg-[#C8A96A]/5 border-l-2 border-[#C8A96A] flex gap-3">
                                        <Info className="w-4 h-4 text-[#C8A96A] shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[11px] font-black text-[#C8A96A] uppercase tracking-[0.08em] mb-1">Administrative Feedback</p>
                                            <p className="text-[12px] text-[#F5E6C8] italic font-bold leading-relaxed">{item.adminNote}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {withdrawalHistory.length > 5 && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => navigate('/my-account/transactions')}
                                    className="px-8 py-3 luxury-box border-[#C8A96A]/30 transition-all hover:bg-[#C8A96A]/10 text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.12em]"
                                >
                                    Read Full History
                                </button>
                            </div>
                        )}
                    </div>
                ) : !loadingWithdrawals && (
                    <div className="text-center py-10">
                        <Clock className="w-10 h-10 mx-auto mb-3" strokeWidth={1} />
                        <p className="text-[13px] font-black uppercase tracking-[0.1em] text-[#C8A96A]">No Recent Withdrawals</p>
                    </div>
                )}
            </div>
        </div>
    );

    // ── Main Render ────────────────────────────────────────────────────────
    return (
        <>
            <AnimatePresence>
                {showWithdrawConfirm && (
                    <ConfirmWithdrawalModal
                        data={{
                            amount: parsedWithdrawAmount,
                            method: withdrawMethod,
                            tds,
                            fee,
                            net,
                            bankName,
                            accountNumber,
                            ifscCode,
                            upiId
                        }}
                        onConfirm={handleWithdraw}
                        onCancel={() => setShowWithdrawConfirm(false)}
                        loading={processingWithdraw}
                    />
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-[#0D0D0D] pb-12 font-sans selection:bg-[#C8A96A]/30">
                {/* Header */}
                <div className="bg-[#0D0D0D] border-b border-[#C8A96A]/20 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#C8A96A]/10 rounded-xl transition text-[#C8A96A]">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-serif font-bold text-[#F5E6C8] tracking-widest uppercase">Vault Management</h1>
                        </div>
                        <button
                            onClick={fetchWalletData}
                            className="flex items-center gap-2 px-3 py-1.5 luxury-box border-[#C8A96A]/20 transition-all hover:bg-[#C8A96A]/5"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-[#C8A96A] ${loadingBalance ? 'animate-spin' : ''}`} />
                            <span className="text-xs font-black text-[#C8A96A] uppercase tracking-widest">Update</span>
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 mt-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] mb-8">
                        <button onClick={() => navigate('/my-account')} className="text-[#C8A96A]/40 hover:text-[#C8A96A]">Account</button>
                        <span className="text-[#C8A96A]/20">/</span>
                        <span className="text-[#C8A96A]">Vault</span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Balance Card */}
                            <Motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="luxury-box p-5 md:p-8 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Shield className="w-32 h-32 text-[#C8A96A]" strokeWidth={1} />
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A]">
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black text-[#C8A96A]/80 uppercase tracking-[0.3em]">Your Wallet</span>
                                    </div>
                                    
                                    <div className="flex items-baseline gap-4 mb-8">
                                        <span className="text-4xl md:text-6xl font-serif font-bold text-[#F5E6C8] tracking-tighter">
                                            ₹{walletBalance.toLocaleString('en-IN')}
                                        </span>
                                        <div className="p-1 px-2 border border-[#C8A96A]/20 bg-[#C8A96A]/5 text-xs font-black text-[#C8A96A] uppercase tracking-widest">
                                            Live Balance
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-[#C8A96A]/10 pt-8">
                                        <div>
                                            <p className="text-[10px] md:text-[11px] font-black text-[#C8A96A]/60 uppercase tracking-[0.2em] mb-1">Total Added</p>
                                            <p className="text-xl font-bold text-[#F5E6C8]">₹{totalDeposits.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-[#C8A96A]/60 uppercase tracking-[0.2em] mb-1">Total Withdrawn</p>
                                            <p className="text-xl font-bold text-[#F5E6C8]">₹{totalWithdrawals.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-[#C8A96A]/60 uppercase tracking-[0.2em] mb-1">Total Earnings</p>
                                            <p className="text-xl font-bold text-[#C8A96A]">₹{(totalDeposits + totalWithdrawals).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>

                            {/* Navigation Tabs */}
                            <div className="luxury-box p-1.5 flex gap-2">
                                <button
                                    onClick={() => setActiveTab('topup')}
                                    className={`flex-1 py-4 px-6 font-black text-[13px] uppercase tracking-[0.14em] transition-all relative ${activeTab === 'topup' ? 'text-[#0D0D0D]' : 'text-[#F5E6C8] hover:text-[#C8A96A]'}`}
                                >
                                    {activeTab === 'topup' && (
                                        <Motion.div layoutId="activeTabMain" className="absolute inset-0 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]" />
                                    )}
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                                        Add Money
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('withdraw')}
                                    className={`flex-1 py-4 px-6 font-black text-[13px] uppercase tracking-[0.14em] transition-all relative ${activeTab === 'withdraw' ? 'text-[#0D0D0D]' : 'text-[#F5E6C8] hover:text-[#C8A96A]'}`}
                                >
                                    {activeTab === 'withdraw' && (
                                        <Motion.div layoutId="activeTabMain" className="absolute inset-0 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]" />
                                    )}
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <TrendingDown className="w-3.5 h-3.5" strokeWidth={3} />
                                        Withdraw
                                    </span>
                                </button>
                            </div>

                            <Motion.div 
                                layout
                                className="luxury-box p-5 md:p-8 min-h-[400px]"
                            >
                                {activeTab === 'topup' ? renderTopupTab() : renderWithdrawTab()}
                            </Motion.div>

                            {/* Recent Transactions */}
                            <div className="luxury-box p-5 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                                    <div>
                                        <h3 className="text-lg font-serif font-bold text-[#F5E6C8] uppercase tracking-widest">Transaction Ledger</h3>
                                        <p className="text-xs font-black text-[#C8A96A]/70 uppercase tracking-[0.2em] mt-1">Institutional Audit Trail</p>
                                    </div>
                                    <button onClick={() => navigate('/my-account/transactions')} className="text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 group">
                                        Full Ledger
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {loadingTransactions ? (
                                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                                        <RefreshCw className="w-8 h-8 animate-spin text-[#C8A96A] mb-4" />
                                        <span className="text-xs font-black text-[#C8A96A] uppercase tracking-widest">Syncing Data...</span>
                                    </div>
                                ) : recentTransactions.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentTransactions.map((tx, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#C8A96A]/5 hover:border-[#C8A96A]/20 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-950/30 text-green-500' : 'bg-red-950/30 text-red-500'}`}>
                                                        {tx.type === 'credit' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-[#F5E6C8] uppercase tracking-wider">{tx.description}</p>
                                                        <p className="text-[11px] font-medium text-[#C8A96A]/60 mt-0.5">{formatDate(tx.date)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-black ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                                        {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                                                    </p>
                                                    <span className={`text-[11px] font-black uppercase tracking-widest mt-1 inline-block px-1.5 py-0.5 ${getStatusColor(tx.status)}`}>
                                                        {tx.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 border-2 border-dashed border-[#C8A96A]/10">
                                        <Receipt className="w-12 h-12 text-[#C8A96A]/10 mx-auto mb-4" strokeWidth={1} />
                                        <p className="text-xs font-black text-[#C8A96A]/70 uppercase tracking-widest">No Activity Records Found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Settlement Insight */}
                            <div className="luxury-box p-6 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
                                <h3 className="text-xs font-black text-[#C8A96A] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Shield className="w-3 h-3 text-[#D4AF37]" />
                                    Wallet Info
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end border-b border-[#C8A96A]/5 pb-3">
                                        <span className="text-[11px] font-black text-[#C8A96A]/70 uppercase tracking-widest">Min. Withdrawal</span>
                                        <span className="text-sm font-bold text-[#F5E6C8]">₹500</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-[#C8A96A]/5 pb-3">
                                        <span className="text-[11px] font-black text-[#C8A96A]/70 uppercase tracking-widest">Max. Withdrawal</span>
                                        <span className="text-sm font-bold text-[#F5E6C8]">₹50,000</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[11px] font-black text-[#C8A96A]/70 uppercase tracking-widest">Processing Time</span>
                                        <span className="text-sm font-bold text-[#C8A96A]">12-24 Hours</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Footer */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Shield, label: 'RBI COMPLIANT' },
                                    { icon: Lock, label: 'AES-256 SECURE' },
                                    { icon: Clock, label: '24/7 PRIORITY' },
                                    { icon: CheckCircle, label: 'VERIFIED' }
                                ].map((item, idx) => (
                                    <div key={idx} className="luxury-box p-4 text-center group hover:border-[#C8A96A] transition-colors">
                                        <item.icon className="w-5 h-5 text-[#C8A96A] mx-auto mb-2 transition-colors" />
                                        <p className="text-[13px] font-black text-[#C8A96A] uppercase tracking-[0.08em]">{item.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Help Call */}
                            <div className="p-1 luxury-box bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]">
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="w-full py-4 bg-[#0D0D0D] text-[#C8A96A] hover:bg-transparent hover:text-[#0D0D0D] transition-all font-black text-[14px] uppercase tracking-[0.16em]"
                                >
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[12px] font-black text-[#C8A96A]/85 uppercase tracking-[0.16em] mt-12 pb-8">
                        Lattice Protocol • Secure • Encrypted • Private
                    </p>
                </div>
            </div>
        </>
    );
};

export default WalletManagement;
