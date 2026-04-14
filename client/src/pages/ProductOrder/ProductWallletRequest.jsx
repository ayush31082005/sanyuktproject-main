import { useEffect, useMemo, useState } from 'react';
import { BadgeIndianRupee, FileUp, Landmark, Receipt, WalletCards } from 'lucide-react';
import api from '../../api';

const sectionTitleClass = 'text-[13px] font-black uppercase tracking-[0.14em] text-[#C8A96A]';
const fieldLabelClass = 'mb-2 block text-[11px] font-black uppercase tracking-[0.12em] text-[#F5E6C8]/70';
const fieldClass = 'w-full min-w-0 rounded-2xl border border-[#C8A96A]/15 bg-[#111111] px-4 py-3 text-sm text-[#F5E6C8] outline-none transition placeholder:text-[#F5E6C8]/30 focus:border-[#C8A96A]/50 focus:bg-[#141414]';

const SectionCard = ({ icon: Icon, title, children, rightSlot = null }) => (
    <div className="max-w-full overflow-hidden rounded-[1.5rem] border border-[#C8A96A]/12 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:rounded-[2rem]">
        <div className="flex flex-col gap-3 border-b border-white/5 bg-[linear-gradient(135deg,#1f1f1f_0%,#191919_50%,#151515_100%)] px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A]">
                    <Icon size={18} />
                </div>
                <div className={`${sectionTitleClass} min-w-0 break-words`}>{title}</div>
            </div>
            {rightSlot}
        </div>
        <div className="p-4 md:p-6">{children}</div>
    </div>
);

const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const formatCurrency = (value) => Number(value || 0).toFixed(2);

export default function ProductWalletRequest() {
    const storedUser = useMemo(() => getStoredUser(), []);
    const [formData, setFormData] = useState({
        bankName: '',
        bankDetails: '',
        paymentMode: 'UPI',
        currentBalance: '0.00',
        requestFund: '',
        remark: storedUser?.memberId || storedUser?.userName || '',
        password: '',
        attachment: null,
    });
    const [submittedData, setSubmittedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const loadWalletData = async () => {
        try {
            const [summaryRes, historyRes] = await Promise.all([
                api.get('/wallet/summary', { params: { walletType: 'product-wallet' } }),
                api.get('/wallet/product/request-history'),
            ]);

            setFormData((prev) => ({
                ...prev,
                currentBalance: formatCurrency(summaryRes.data?.balance),
            }));
            setSubmittedData(historyRes.data?.requests || []);
        } catch (error) {
            console.error('Wallet request load error:', error);
            setFeedback({ type: 'error', message: 'Wallet request data load nahi ho pa raha.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWalletData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'attachment') {
            setFormData((prev) => ({
                ...prev,
                attachment: files?.[0] || null,
            }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFeedback({ type: '', message: '' });

        try {
            const payload = new FormData();
            payload.append('bankName', formData.bankName);
            payload.append('bankDetails', formData.bankDetails);
            payload.append('paymentMode', formData.paymentMode);
            payload.append('requestFund', formData.requestFund);
            payload.append('remark', formData.remark);
            payload.append('password', formData.password);
            if (formData.attachment) {
                payload.append('attachment', formData.attachment);
            }

            const { data } = await api.post('/wallet/product/request', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setFeedback({
                type: 'success',
                message: data?.message || 'Wallet request submit ho gayi.',
            });

            setFormData((prev) => ({
                ...prev,
                bankName: '',
                bankDetails: '',
                paymentMode: 'UPI',
                requestFund: '',
                password: '',
                attachment: null,
            }));

            await loadWalletData();
        } catch (error) {
            console.error('Wallet request submit error:', error);
            setFeedback({
                type: 'error',
                message: error?.response?.data?.message || error?.message || 'Wallet request submit nahi ho paayi.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#0D0D0D] px-2 py-4 sm:px-4 sm:py-6 md:px-6">
            <style>{`
                .wallet-request-theme input:-webkit-autofill,
                .wallet-request-theme textarea:-webkit-autofill,
                .wallet-request-theme select:-webkit-autofill {
                    -webkit-text-fill-color: #F5E6C8;
                    box-shadow: 0 0 0 1000px #111111 inset;
                    transition: background-color 9999s ease-in-out 0s;
                }
            `}</style>

            <div className="wallet-request-theme mx-auto max-w-[1280px] space-y-4 sm:space-y-6">
                <SectionCard icon={WalletCards} title="Product Wallet Request">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={fieldLabelClass}>Bank Name</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    placeholder="Enter bank name"
                                    className={fieldClass}
                                />
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Payment Mode</label>
                                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className={fieldClass}>
                                    <option value="IMPS">IMPS</option>
                                    <option value="UPI">UPI</option>
                                    <option value="NEFT">NEFT</option>
                                    <option value="RTGS">RTGS</option>
                                    <option value="DD">DD</option>
                                    <option value="Cheque">Cheque</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className={fieldLabelClass}>Bank Details</label>
                                <textarea
                                    name="bankDetails"
                                    value={formData.bankDetails}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Enter bank details"
                                    className={`${fieldClass} min-h-[120px] resize-none`}
                                />
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Current Balance</label>
                                <input type="text" name="currentBalance" value={formData.currentBalance} readOnly className={`${fieldClass} bg-[#151515] text-white`} />
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Request Fund</label>
                                <div className="relative">
                                    <BadgeIndianRupee size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A96A]/60" />
                                    <input
                                        type="number"
                                        name="requestFund"
                                        value={formData.requestFund}
                                        onChange={handleChange}
                                        placeholder="Enter Amount"
                                        className={`${fieldClass} pl-11`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Remark / Reference No.</label>
                                <input type="text" name="remark" value={formData.remark} onChange={handleChange} className={`${fieldClass} bg-[#151515] text-white`} />
                            </div>

                            <div>
                                <label className={fieldLabelClass}>Transaction / Account Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className={fieldClass}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className={fieldLabelClass}>Attachment</label>
                                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[#C8A96A]/20 bg-[#111111] p-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex min-w-0 items-center gap-3 text-[#F5E6C8]/70">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A]">
                                            <FileUp size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-[#F5E6C8]">
                                                {formData.attachment ? formData.attachment.name : 'No file chosen'}
                                            </p>
                                            <p className="text-xs text-[#F5E6C8]/45">Upload receipt or bank proof</p>
                                        </div>
                                    </div>

                                    <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#C8A96A] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d] md:w-auto">
                                        <Landmark size={16} />
                                        Choose File
                                        <input type="file" name="attachment" onChange={handleChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {feedback.message && (
                            <div className={`rounded-2xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/20 bg-rose-500/10 text-rose-300'}`}>
                                {feedback.message}
                            </div>
                        )}

                        <div className="flex justify-start pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-2xl bg-[#C8A96A] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </SectionCard>

                <SectionCard
                    icon={Receipt}
                    title="Request Product Wallet History"
                    rightSlot={
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C8A96A]/15 bg-[#C8A96A]/8 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#F5E6C8]">
                            {submittedData.length} Records
                        </div>
                    }
                >
                    {loading ? (
                        <div className="flex min-h-[180px] items-center justify-center rounded-[1.5rem] border border-dashed border-[#C8A96A]/14 bg-[#121212] px-6 text-center">
                            <p className="text-sm text-[#F5E6C8]/50">Loading wallet requests...</p>
                        </div>
                    ) : submittedData.length === 0 ? (
                        <div className="flex min-h-[180px] items-center justify-center rounded-[1.5rem] border border-dashed border-[#C8A96A]/14 bg-[#121212] px-6 text-center">
                            <p className="text-sm text-[#F5E6C8]/50">No request history found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3 md:hidden">
                                {submittedData.map((item, index) => (
                                    <div
                                        key={item._id}
                                        className="rounded-[1.5rem] border border-[#C8A96A]/12 bg-[#111111] p-4 shadow-[0_14px_30px_rgba(0,0,0,0.22)]"
                                    >
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#C8A96A]/70">
                                                    Request {index + 1}
                                                </div>
                                                <div className="mt-1 text-sm font-black text-white">
                                                    {item.bankName || '-'}
                                                </div>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${item.status === 'Approved' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : item.status === 'Rejected' ? 'border border-rose-500/20 bg-rose-500/10 text-rose-300' : 'border border-amber-500/20 bg-amber-500/10 text-amber-300'}`}>
                                                {item.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2.5 text-sm">
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="text-[#F5E6C8]/55">Payment</span>
                                                <span className="text-right font-semibold uppercase text-[#F5E6C8]">{item.paymentMode}</span>
                                            </div>
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="text-[#F5E6C8]/55">Amount</span>
                                                <span className="text-right font-black text-white">Rs {formatCurrency(item.requestAmount)}</span>
                                            </div>
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="text-[#F5E6C8]/55">Remark</span>
                                                <span className="max-w-[62%] break-words text-right font-semibold text-[#F5E6C8]">{item.remark || '-'}</span>
                                            </div>
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="text-[#F5E6C8]/55">Attachment</span>
                                                <span className="text-right font-semibold text-[#F5E6C8]">
                                                    {item.attachment ? (
                                                        <a href={item.attachment} target="_blank" rel="noreferrer" className="text-[#C8A96A] underline">
                                                            View
                                                        </a>
                                                    ) : (
                                                        'No File'
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="hidden overflow-hidden rounded-[1.5rem] border border-[#C8A96A]/12 bg-[#111111] md:block">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[860px] border-collapse text-left text-sm text-[#F5E6C8]">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-[#171717] text-[11px] uppercase tracking-[0.12em] text-[#C8A96A]">
                                                <th className="px-4 py-3">Bank</th>
                                                <th className="px-4 py-3">Payment Mode</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Remark</th>
                                                <th className="px-4 py-3">Attachment</th>
                                                <th className="px-4 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submittedData.map((item) => (
                                                <tr key={item._id} className="border-b border-white/5 last:border-b-0">
                                                    <td className="px-4 py-4">{item.bankName || '-'}</td>
                                                    <td className="px-4 py-4">{item.paymentMode}</td>
                                                    <td className="px-4 py-4">Rs {formatCurrency(item.requestAmount)}</td>
                                                    <td className="px-4 py-4">{item.remark || '-'}</td>
                                                    <td className="px-4 py-4">
                                                        {item.attachment ? (
                                                            <a href={item.attachment} target="_blank" rel="noreferrer" className="text-[#C8A96A] underline">
                                                                View
                                                            </a>
                                                        ) : (
                                                            'No File'
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${item.status === 'Approved' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : item.status === 'Rejected' ? 'border border-rose-500/20 bg-rose-500/10 text-rose-300' : 'border border-amber-500/20 bg-amber-500/10 text-amber-300'}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </SectionCard>
            </div>
        </div>
    );
}
