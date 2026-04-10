import React, { useEffect, useMemo, useState } from 'react';
import {
    CheckCircle2,
    Clock3,
    FileText,
    Filter,
    Loader2,
    RefreshCw,
    Search,
    Wallet,
    XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api, { API_URL } from '../../api';

const STATUS_OPTIONS = ['All', 'Pending', 'Approved', 'Rejected'];
const WALLET_OPTIONS = [
    { value: 'All', label: 'All Wallets' },
    { value: 'product-wallet', label: 'Product Wallet' },
    { value: 'repurchase-wallet', label: 'Repurchase Wallet' },
];

const formatCurrency = (value = 0) =>
    `Rs ${Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getWalletLabel = (walletType) =>
    walletType === 'repurchase-wallet' ? 'Repurchase Wallet' : 'Product Wallet';

const statusStyles = {
    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const AdminWalletRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('All');
    const [walletType, setWalletType] = useState('All');
    const [search, setSearch] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchRequests = async (nextSearch = search) => {
        try {
            setLoading(true);
            const response = await api.get('/wallet/admin/requests', {
                params: {
                    status,
                    walletType,
                    search: nextSearch,
                },
            });

            if (response.data.success) {
                setRequests(response.data.requests || []);
            }
        } catch (error) {
            toast.error(error.message || 'Wallet requests load nahi ho paayi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [status, walletType]);

    const stats = useMemo(() => {
        const totalAmount = requests.reduce((sum, item) => sum + Number(item.requestAmount || 0), 0);
        return {
            pending: requests.filter((item) => item.status === 'Pending').length,
            approved: requests.filter((item) => item.status === 'Approved').length,
            rejected: requests.filter((item) => item.status === 'Rejected').length,
            totalAmount,
        };
    }, [requests]);

    const handleUpdateStatus = async (nextStatus) => {
        if (!selectedRequest?._id) return;

        try {
            setProcessing(true);
            const response = await api.patch(`/wallet/admin/requests/${selectedRequest._id}/status`, {
                status: nextStatus,
                adminNote,
            });

            if (response.data.success) {
                toast.success(response.data.message || `Request ${nextStatus.toLowerCase()} ho gayi`);
                setSelectedRequest(null);
                setAdminNote('');
                fetchRequests();
            }
        } catch (error) {
            toast.error(error.message || 'Status update nahi ho paaya');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#F5E6C8]">Wallet Requests</h2>
                    <p className="mt-1 text-sm text-[#C8A96A]/60">
                        Product aur repurchase wallet requests ko yahin se approve ya reject karo.
                    </p>
                </div>
                <button
                    onClick={() => fetchRequests()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C8A96A]/30 bg-[#121212] px-4 py-3 text-sm font-bold text-[#C8A96A] transition hover:bg-[#C8A96A]/10"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                    { label: 'Pending', value: stats.pending, icon: Clock3, color: 'text-amber-400' },
                    { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-400' },
                    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-400' },
                    { label: 'Total Amount', value: formatCurrency(stats.totalAmount), icon: Wallet, color: 'text-[#C8A96A]' },
                ].map((card) => (
                    <div key={card.label} className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl border border-[#C8A96A]/15 bg-[#0D0D0D] p-3">
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#F5E6C8]/40">
                                    {card.label}
                                </p>
                                <p className="mt-1 text-2xl font-bold text-[#F5E6C8]">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_0.8fr_0.8fr_auto]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C8A96A]/40" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    fetchRequests(event.currentTarget.value);
                                }
                            }}
                            placeholder="Member ID, name, bank name ya remark search karo"
                            className="w-full rounded-xl border border-[#C8A96A]/20 bg-[#0D0D0D] py-3 pl-11 pr-4 text-sm text-[#F5E6C8] outline-none transition placeholder:text-[#C8A96A]/20 focus:border-[#C8A96A]"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="rounded-xl border border-[#C8A96A]/20 bg-[#0D0D0D] px-4 py-3 text-sm text-[#F5E6C8] outline-none focus:border-[#C8A96A]"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <select
                        value={walletType}
                        onChange={(event) => setWalletType(event.target.value)}
                        className="rounded-xl border border-[#C8A96A]/20 bg-[#0D0D0D] px-4 py-3 text-sm text-[#F5E6C8] outline-none focus:border-[#C8A96A]"
                    >
                        {WALLET_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => fetchRequests()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8A96A] px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-[#0D0D0D] transition hover:shadow-[0_0_24px_rgba(200,169,106,0.2)]"
                    >
                        <Filter className="h-4 w-4" />
                        Search
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#C8A96A]/10 bg-[#121212]">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-[#0D0D0D]">
                            <tr>
                                {['Member', 'Wallet', 'Amount', 'Bank / Mode', 'Status', 'Requested On', 'Action'].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.25em] text-[#C8A96A]/55"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#C8A96A]/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-14">
                                        <div className="flex items-center justify-center gap-3 text-[#C8A96A]">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span className="text-sm font-medium">Wallet requests load ho rahi hain...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-[#F5E6C8]/35">
                                            <FileText className="h-10 w-10 text-[#C8A96A]/40" />
                                            <p className="text-sm font-semibold">Abhi koi wallet request nahi mili.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request._id} className="hover:bg-[#C8A96A]/[0.03]">
                                        <td className="px-5 py-4 align-top">
                                            <p className="text-sm font-bold text-[#F5E6C8]">
                                                {request.userId?.userName || 'Unknown User'}
                                            </p>
                                            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.15em] text-[#C8A96A]/45">
                                                {request.userId?.memberId || 'N/A'}
                                            </p>
                                            <p className="mt-1 text-xs text-[#F5E6C8]/45">
                                                {request.userId?.mobile || request.userId?.email || 'No contact'}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 align-top">
                                            <span className="inline-flex rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5 px-3 py-1 text-xs font-bold text-[#C8A96A]">
                                                {getWalletLabel(request.walletType)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 align-top text-sm font-bold text-[#F5E6C8]">
                                            {formatCurrency(request.requestAmount)}
                                        </td>
                                        <td className="px-5 py-4 align-top">
                                            <p className="text-sm font-medium text-[#F5E6C8]">
                                                {request.bankName || 'Bank not provided'}
                                            </p>
                                            <p className="mt-1 text-xs text-[#C8A96A]/55">{request.paymentMode}</p>
                                        </td>
                                        <td className="px-5 py-4 align-top">
                                            <span
                                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.15em] ${
                                                    statusStyles[request.status] || statusStyles.Pending
                                                }`}
                                            >
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 align-top text-xs text-[#F5E6C8]/55">
                                            {formatDate(request.createdAt)}
                                        </td>
                                        <td className="px-5 py-4 align-top">
                                            <button
                                                onClick={() => {
                                                    setSelectedRequest(request);
                                                    setAdminNote(request.adminNote || '');
                                                }}
                                                className="rounded-lg border border-[#C8A96A]/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#C8A96A] transition hover:bg-[#C8A96A]/10"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#C8A96A]/20 bg-[#0D0D0D] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#C8A96A]/10 px-6 py-5">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-[#F5E6C8]">Wallet Request Detail</h3>
                                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#C8A96A]/45">
                                    {selectedRequest.userId?.memberId || 'N/A'} • {getWalletLabel(selectedRequest.walletType)}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedRequest(null);
                                    setAdminNote('');
                                }}
                                className="rounded-xl border border-[#C8A96A]/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#C8A96A]"
                            >
                                Close
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8A96A]/45">User</p>
                                    <p className="mt-3 text-lg font-bold text-[#F5E6C8]">{selectedRequest.userId?.userName || 'Unknown User'}</p>
                                    <p className="mt-1 text-sm text-[#F5E6C8]/60">{selectedRequest.userId?.memberId || 'N/A'}</p>
                                    <p className="mt-1 text-sm text-[#F5E6C8]/45">
                                        {selectedRequest.userId?.mobile || selectedRequest.userId?.email || 'No contact'}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8A96A]/45">Request Summary</p>
                                    <p className="mt-3 text-lg font-bold text-[#F5E6C8]">
                                        {formatCurrency(selectedRequest.requestAmount)}
                                    </p>
                                    <p className="mt-1 text-sm text-[#C8A96A]">{selectedRequest.paymentMode}</p>
                                    <p className="mt-1 text-sm text-[#F5E6C8]/45">
                                        Current Balance: {formatCurrency(selectedRequest.currentBalance)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8A96A]/45">Bank Name</p>
                                    <p className="mt-3 text-sm font-medium text-[#F5E6C8]">
                                        {selectedRequest.bankName || 'Not provided'}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8A96A]/45">Requested On</p>
                                    <p className="mt-3 text-sm font-medium text-[#F5E6C8]">
                                        {formatDate(selectedRequest.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8A96A]/45">Bank Details</p>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#F5E6C8]/75">
                                    {selectedRequest.bankDetails || 'Bank details nahi diye gaye.'}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8A96A]/45">Remark / Reference</p>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#F5E6C8]/75">
                                    {selectedRequest.remark || 'No remark'}
                                </p>
                            </div>

                            {selectedRequest.attachment && (
                                <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8A96A]/45">Attachment</p>
                                    <a
                                        href={`${API_URL}${selectedRequest.attachment}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#C8A96A]/20 px-4 py-3 text-sm font-semibold text-[#C8A96A] transition hover:bg-[#C8A96A]/10"
                                    >
                                        <FileText className="h-4 w-4" />
                                        View Attachment
                                    </a>
                                </div>
                            )}

                            <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#C8A96A]/45">Admin Note</p>
                                <textarea
                                    value={adminNote}
                                    onChange={(event) => setAdminNote(event.target.value)}
                                    placeholder="Approval ya rejection ka note yahan likho"
                                    className="mt-3 h-28 w-full resize-none rounded-2xl border border-[#C8A96A]/20 bg-[#0D0D0D] p-4 text-sm text-[#F5E6C8] outline-none transition placeholder:text-[#C8A96A]/20 focus:border-[#C8A96A]"
                                />
                            </div>

                            {selectedRequest.approvedBy && (
                                <div className="rounded-2xl border border-[#C8A96A]/10 bg-[#121212] p-5 text-sm text-[#F5E6C8]/70">
                                    <p>
                                        <span className="font-semibold text-[#F5E6C8]">Processed By:</span>{' '}
                                        {selectedRequest.approvedBy.userName || selectedRequest.approvedBy.memberId}
                                    </p>
                                    <p className="mt-2">
                                        <span className="font-semibold text-[#F5E6C8]">Processed At:</span>{' '}
                                        {formatDate(selectedRequest.approvedAt)}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                {selectedRequest.status === 'Pending' ? (
                                    <>
                                        <button
                                            disabled={processing}
                                            onClick={() => handleUpdateStatus('Rejected')}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
                                        >
                                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                                            Reject
                                        </button>
                                        <button
                                            disabled={processing}
                                            onClick={() => handleUpdateStatus('Approved')}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8A96A] px-5 py-3 text-sm font-black uppercase tracking-[0.15em] text-[#0D0D0D] transition hover:shadow-[0_0_24px_rgba(200,169,106,0.25)] disabled:opacity-60"
                                        >
                                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                            Approve
                                        </button>
                                    </>
                                ) : (
                                    <div className="rounded-xl border border-[#C8A96A]/15 bg-[#121212] px-4 py-3 text-sm text-[#F5E6C8]/70">
                                        Ye request already {selectedRequest.status.toLowerCase()} ho chuki hai.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWalletRequests;
