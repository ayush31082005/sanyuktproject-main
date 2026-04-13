import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock3,
    IndianRupee,
    Landmark,
    Loader2,
    Smartphone,
    Wallet,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';

const TDS_RATE = 0.05;
const PROCESSING_RATE = 0.02;
const MIN_WITHDRAWAL = 500;

const formatAmount = (value) =>
    Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const calcWithdrawal = (amount) => {
    const numericAmount = Number(amount || 0);
    const tds = Math.round(numericAmount * TDS_RATE);
    const fee = Math.round(numericAmount * PROCESSING_RATE);
    const net = numericAmount - tds - fee;

    return { tds, fee, net };
};

const WalletWithdrawalPage = ({
    walletType = 'e-wallet',
    title = 'Wallet Withdrawal',
    intro = 'Request a secure payout from your wallet balance.',
    historyTitle = 'Withdrawal History',
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [balance, setBalance] = useState(0);
    const [totalDebits, setTotalDebits] = useState(0);
    const [history, setHistory] = useState([]);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('UPI');
    const [upiId, setUpiId] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');

    const isGenerationWallet = walletType === 'generation-wallet';
    const walletLabel = isGenerationWallet ? 'Generation Wallet' : 'E-Wallet';
    const parsedAmount = Number(amount || 0);
    const { tds, fee, net } = useMemo(() => calcWithdrawal(parsedAmount), [parsedAmount]);

    const isAmountValid =
        Number.isFinite(parsedAmount) &&
        parsedAmount >= MIN_WITHDRAWAL &&
        parsedAmount <= balance;

    const isBankValid =
        method === 'Bank Transfer' &&
        bankName.trim() &&
        accountNumber.trim() &&
        confirmAccountNumber.trim() &&
        accountNumber.trim() === confirmAccountNumber.trim() &&
        ifscCode.trim();

    const isUpiValid = method === 'UPI' && upiId.trim();
    const canSubmit = isAmountValid && (isBankValid || isUpiValid);

    const loadData = async () => {
        try {
            setLoading(true);
            const [summaryRes, historyRes] = await Promise.all([
                api.get('/wallet/summary', {
                    params: { walletType },
                }),
                api.get('/wallet/withdrawal-history', {
                    params: {
                        walletType,
                        status: 'All Status',
                        method: 'All Methods',
                        period: 'All Time',
                    },
                }),
            ]);

            setBalance(Number(summaryRes.data?.balance || 0));
            setTotalDebits(
                Number(
                    historyRes.data?.summary?.totalWithdrawn ??
                    summaryRes.data?.totalDebits ??
                    0
                )
            );
            setHistory(Array.isArray(historyRes.data?.withdrawals) ? historyRes.data.withdrawals : []);
        } catch (error) {
            console.error(`Error fetching ${walletType} withdrawal data:`, error);
            toast.error('Withdrawal data load nahi ho paya.');
            setHistory([]);
            setBalance(0);
            setTotalDebits(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [walletType]);

    const resetForm = () => {
        setAmount('');
        setMethod('UPI');
        setUpiId('');
        setBankName('');
        setAccountNumber('');
        setConfirmAccountNumber('');
        setIfscCode('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!canSubmit) {
            toast.error('Please enter valid withdrawal details.');
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                walletType,
                amount: parsedAmount,
                method,
                ...(method === 'UPI' ? { upiId } : { bankName, accountNumber, ifscCode }),
            };

            const res = await api.post('/wallet/withdraw', payload);
            if (res.data?.success) {
                toast.success(`Withdrawal request submitted. Ref: ${res.data?.withdrawal?.referenceNo || '-'}`);
                resetForm();
                await loadData();
            }
        } catch (error) {
            console.error(`Error requesting ${walletType} withdrawal:`, error);
            toast.error(error?.response?.data?.message || 'Withdrawal request submit nahi ho paya.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-3 py-6 text-white md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => navigate(isGenerationWallet ? '/my-account/generation' : '/my-account')}
                        className="rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] p-2 text-[#C8A96A] transition hover:bg-[#1F1F1F]"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-[1.9rem] font-black leading-none text-[#F5E6C8] md:text-[2.05rem]">{title}</h1>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#C8A96A]/55">{intro}</p>
                    </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                            <div className="border-b border-[#C8A96A]/12 bg-[#1F1F1F] px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <Wallet className="h-5 w-5 text-[#C8A96A]" />
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">{walletLabel}</p>
                                        <p className="text-xs text-[#F5E6C8]/55">Minimum request amount ₹500</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 px-5 py-5 md:grid-cols-3">
                                <div className="rounded-[2px] border border-[#C8A96A]/12 bg-[#111111] p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/55">Available Balance</p>
                                    <p className="mt-3 text-3xl font-black text-[#F5E6C8]">
                                        ₹{loading ? '0.00' : formatAmount(balance)}
                                    </p>
                                </div>
                                <div className="rounded-[2px] border border-[#C8A96A]/12 bg-[#111111] p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/55">Wallet Debits</p>
                                    <p className="mt-3 text-3xl font-black text-[#F5E6C8]">
                                        ₹{loading ? '0.00' : formatAmount(totalDebits)}
                                    </p>
                                </div>
                                <div className="rounded-[2px] border border-[#C8A96A]/12 bg-[#111111] p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/55">Requests</p>
                                    <p className="mt-3 text-3xl font-black text-[#F5E6C8]">{history.length}</p>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="overflow-hidden rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
                        >
                            <div className="bg-[#1F1F1F] px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">
                                Withdraw Funds
                            </div>

                            <div className="space-y-6 p-5">
                                <div>
                                    <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/70">
                                        Withdrawal Amount
                                    </label>
                                    <div className="flex items-center rounded-[2px] border border-[#C8A96A]/20 bg-[#111111] px-4">
                                        <IndianRupee className="h-5 w-5 text-[#C8A96A]" />
                                        <input
                                            type="number"
                                            min={MIN_WITHDRAWAL}
                                            step="1"
                                            value={amount}
                                            onChange={(event) => setAmount(event.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full bg-transparent px-3 py-4 text-lg font-bold text-[#F5E6C8] outline-none"
                                        />
                                    </div>
                                    {amount && parsedAmount < MIN_WITHDRAWAL && (
                                        <p className="mt-2 flex items-center gap-2 text-xs text-red-400">
                                            <AlertCircle className="h-4 w-4" />
                                            Minimum withdrawal is ₹500.
                                        </p>
                                    )}
                                    {amount && parsedAmount > balance && (
                                        <p className="mt-2 flex items-center gap-2 text-xs text-red-400">
                                            <AlertCircle className="h-4 w-4" />
                                            Available balance se zyada amount request nahi kar sakte.
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => setMethod('UPI')}
                                        className={`rounded-[2px] border p-4 text-left transition ${
                                            method === 'UPI'
                                                ? 'border-[#C8A96A] bg-[#C8A96A]/10'
                                                : 'border-[#C8A96A]/15 bg-[#111111] hover:border-[#C8A96A]/35'
                                        }`}
                                    >
                                        <Smartphone className="mb-3 h-5 w-5 text-[#C8A96A]" />
                                        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#F5E6C8]">UPI Transfer</p>
                                        <p className="mt-1 text-xs text-[#F5E6C8]/55">Fast payout via UPI ID</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMethod('Bank Transfer')}
                                        className={`rounded-[2px] border p-4 text-left transition ${
                                            method === 'Bank Transfer'
                                                ? 'border-[#C8A96A] bg-[#C8A96A]/10'
                                                : 'border-[#C8A96A]/15 bg-[#111111] hover:border-[#C8A96A]/35'
                                        }`}
                                    >
                                        <Landmark className="mb-3 h-5 w-5 text-[#C8A96A]" />
                                        <p className="text-sm font-black uppercase tracking-[0.14em] text-[#F5E6C8]">Bank Transfer</p>
                                        <p className="mt-1 text-xs text-[#F5E6C8]/55">Settle directly into bank account</p>
                                    </button>
                                </div>

                                {method === 'UPI' ? (
                                    <div>
                                        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/70">
                                            UPI ID
                                        </label>
                                        <div className="flex items-center rounded-[2px] border border-[#C8A96A]/20 bg-[#111111] px-4">
                                            <Smartphone className="h-4 w-4 text-[#C8A96A]" />
                                            <input
                                                type="text"
                                                value={upiId}
                                                onChange={(event) => setUpiId(event.target.value)}
                                                placeholder="example@upi"
                                                className="w-full bg-transparent px-3 py-4 text-sm font-semibold text-[#F5E6C8] outline-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/70">
                                                Bank Name
                                            </label>
                                            <div className="flex items-center rounded-[2px] border border-[#C8A96A]/20 bg-[#111111] px-4">
                                                <Building2 className="h-4 w-4 text-[#C8A96A]" />
                                                <input
                                                    type="text"
                                                    value={bankName}
                                                    onChange={(event) => setBankName(event.target.value)}
                                                    placeholder="Enter bank name"
                                                    className="w-full bg-transparent px-3 py-4 text-sm font-semibold text-[#F5E6C8] outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/70">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                value={accountNumber}
                                                onChange={(event) => setAccountNumber(event.target.value)}
                                                placeholder="Account number"
                                                className="w-full rounded-[2px] border border-[#C8A96A]/20 bg-[#111111] px-4 py-4 text-sm font-semibold text-[#F5E6C8] outline-none focus:border-[#C8A96A]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/70">
                                                Confirm Account Number
                                            </label>
                                            <input
                                                type="text"
                                                value={confirmAccountNumber}
                                                onChange={(event) => setConfirmAccountNumber(event.target.value)}
                                                placeholder="Re-enter account number"
                                                className="w-full rounded-[2px] border border-[#C8A96A]/20 bg-[#111111] px-4 py-4 text-sm font-semibold text-[#F5E6C8] outline-none focus:border-[#C8A96A]"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/70">
                                                IFSC Code
                                            </label>
                                            <input
                                                type="text"
                                                value={ifscCode}
                                                onChange={(event) => setIfscCode(event.target.value.toUpperCase())}
                                                placeholder="IFSC code"
                                                className="w-full rounded-[2px] border border-[#C8A96A]/20 bg-[#111111] px-4 py-4 text-sm font-semibold uppercase text-[#F5E6C8] outline-none focus:border-[#C8A96A]"
                                            />
                                        </div>
                                        {confirmAccountNumber && accountNumber !== confirmAccountNumber && (
                                            <p className="md:col-span-2 flex items-center gap-2 text-xs text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                Account number match nahi kar raha.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="grid gap-4 rounded-[2px] border border-[#C8A96A]/15 bg-[#111111] p-4 md:grid-cols-3">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/55">Requested</p>
                                        <p className="mt-2 text-xl font-black text-[#F5E6C8]">₹{formatAmount(parsedAmount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/55">TDS + Fee</p>
                                        <p className="mt-2 text-xl font-black text-[#F5E6C8]">₹{formatAmount(tds + fee)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/55">Net Payout</p>
                                        <p className="mt-2 text-xl font-black text-[#C8A96A]">₹{formatAmount(Math.max(net, 0))}</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!canSubmit || submitting}
                                    className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-[#C8A96A] px-6 py-3 text-[12px] font-black uppercase tracking-[0.18em] text-[#0D0D0D] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                    Submit Withdrawal
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-5">
                        <div className="overflow-hidden rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                            <div className="bg-[#1F1F1F] px-5 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">
                                Settlement Notes
                            </div>
                            <div className="space-y-4 p-5 text-sm text-[#F5E6C8]/75">
                                <div className="flex items-start gap-3">
                                    <Clock3 className="mt-0.5 h-4 w-4 text-[#C8A96A]" />
                                    <p>Withdrawal request ke baad balance turant hold ho jayega.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="mt-0.5 h-4 w-4 text-[#C8A96A]" />
                                    <p>TDS 5% aur processing fee 2% automatically deduct hota hai.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Wallet className="mt-0.5 h-4 w-4 text-[#C8A96A]" />
                                    <p>Ye page sirf {walletLabel.toLowerCase()} ke balance se withdrawal request karta hai.</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                            <div className="flex items-center justify-between bg-[#1F1F1F] px-5 py-4">
                                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">
                                    {historyTitle}
                                </span>
                                <button
                                    onClick={() =>
                                        navigate(
                                            isGenerationWallet
                                                ? '/my-account/generation/withdrawal-history'
                                                : '/my-account/wallet/withdrawal-history'
                                        )
                                    }
                                    className="text-[10px] font-black uppercase tracking-[0.14em] text-[#F5E6C8]/65 transition hover:text-[#C8A96A]"
                                >
                                    View Full History
                                </button>
                            </div>

                            <div className="p-5">
                                {loading ? (
                                    <div className="py-10 text-center text-sm text-[#F5E6C8]/55">Loading report...</div>
                                ) : history.length === 0 ? (
                                    <div className="py-10 text-center text-sm text-[#F5E6C8]/55">No withdrawal records available.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {history.slice(0, 6).map((item) => (
                                            <div
                                                key={item._id}
                                                className="rounded-[2px] border border-[#C8A96A]/12 bg-[#111111] p-4"
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm font-black text-[#F5E6C8]">
                                                            ₹{formatAmount(item.amount)}
                                                        </p>
                                                        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#C8A96A]/55">
                                                            {item.referenceNo || '-'}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`rounded-[2px] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                                                            item.status === 'Completed'
                                                                ? 'bg-green-500/12 text-green-400'
                                                                : item.status === 'Rejected'
                                                                    ? 'bg-red-500/12 text-red-400'
                                                                    : 'bg-amber-500/12 text-amber-300'
                                                        }`}
                                                    >
                                                        {item.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#F5E6C8]/55">
                                                    <span>{formatDate(item.createdAt)}</span>
                                                    <span>{item.method || '-'}</span>
                                                    <span>{item.upiId || item.bankName || '-'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletWithdrawalPage;
