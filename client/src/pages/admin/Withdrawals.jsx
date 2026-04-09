import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, CheckCircle, XCircle, Clock, 
    FileText, User, IndianRupee, ArrowUpRight, 
    MoreVertical, Download, AlertCircle, Loader2,
    Building2, Smartphone, Shield, Calendar, RefreshCw
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const AdminWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState(null);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [adminNote, setAdminNote] = useState('');

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const res = await api.get('/wallet/admin/all-withdrawals', {
                params: {
                    status: filterStatus,
                    search: searchTerm
                }
            });
            if (res.data.success) {
                setWithdrawals(res.data.withdrawals);
            }
        } catch (err) {
            toast.error('Failed to fetch withdrawal requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [filterStatus]);

    const handleStatusUpdate = async (id, status) => {
        try {
            setProcessingId(id);
            const res = await api.patch(`/wallet/withdrawal/${id}/status`, {
                status,
                adminNote
            });

            if (res.data.success) {
                toast.success(`Withdrawal ${status.toLowerCase()} successfully`);
                setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status } : w));
                setShowDetailModal(false);
                setAdminNote('');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-500/10 text-green-500 border-green-500/30';
            case 'Rejected':
                return 'bg-red-500/10 text-red-500 border-red-500/30';
            case 'Pending':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            case 'Approved':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#F5E6C8] tracking-tight">Withdrawal Management</h2>
                    <p className="text-sm text-[#C8A96A]/60 mt-1 font-medium italic">Process and oversee liquidity exits across the platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchWithdrawals}
                        className="p-3 bg-[#1A1A1A] border border-[#C8A96A]/20 text-[#C8A96A] rounded-xl hover:bg-[#C8A96A]/10 transition-all shadow-lg"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-[#C8A96A] text-[#0D0D0D] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(200,169,106,0.3)] transition-all">
                        <Download className="w-4 h-4" />
                        <span>Export Ledger</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Pending Requests', value: withdrawals.filter(w => w.status === 'Pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                    { label: 'Completed Today', value: withdrawals.filter(w => w.status === 'Completed' && new Date(w.createdAt).toDateString() === new Date().toDateString()).length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/5' },
                    { label: 'Total Volume', value: `₹${withdrawals.reduce((acc, w) => acc + w.amount, 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-[#C8A96A]', bg: 'bg-[#C8A96A]/5' },
                    { label: 'Rejected', value: withdrawals.filter(w => w.status === 'Rejected').length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/5' },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border border-[#C8A96A]/10 bg-[#121212] flex items-center gap-5 transition-all hover:border-[#C8A96A]/30 group`}>
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                            <stat.icon className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F5E6C8]/40 mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-[#F5E6C8]">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="p-6 bg-[#121212] border border-[#C8A96A]/10 rounded-2xl shadow-xl">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A96A]/40 group-focus-within:text-[#C8A96A] transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by Member ID, Name, Reference No..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchWithdrawals()}
                            className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl py-3.5 pl-12 pr-4 text-sm text-[#F5E6C8] placeholder:text-[#C8A96A]/20 focus:border-[#C8A96A] outline-none transition-all shadow-inner"
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl">
                        {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-[#C8A96A] text-[#0D0D0D] shadow-lg' : 'text-[#C8A96A]/40 hover:text-[#C8A96A] hover:bg-[#C8A96A]/5'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#121212] border border-[#C8A96A]/10 rounded-2xl overflow-hidden shadow-2xl relative">
                {loading && (
                    <div className="absolute inset-0 bg-[#0D0D0D]/60 backdrop-blur-sm z-20 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-[#C8A96A] animate-spin" />
                            <p className="text-xs font-black uppercase tracking-widest text-[#C8A96A]/60">Syncing Vault...</p>
                        </div>
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0D0D0D] border-b border-[#C8A96A]/20">
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/60">User Details</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/60">Request Context</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/60">Settlement Amount</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/60">Current Status</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/60">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#C8A96A]/5">
                            {withdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                                            <FileText className="w-12 h-12 text-[#C8A96A]" strokeWidth={1} />
                                            <p className="text-xs font-black uppercase tracking-widest text-[#F5E6C8]">No withdrawals cataloged</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                withdrawals.map((w) => (
                                    <tr key={w._id} className="hover:bg-[#C8A96A]/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#C8A96A]/20 flex items-center justify-center shadow-lg group-hover:border-[#C8A96A]/40 transition-colors">
                                                    <User className="w-5 h-5 text-[#C8A96A]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#F5E6C8]">{w.userId?.userName || 'Undefined User'}</p>
                                                    <p className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-widest mt-1">ID: {w.userId?.memberId || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    {w.method === 'Bank Transfer' ? <Building2 className="w-3.5 h-3.5 text-[#C8A96A]/40" /> : <Smartphone className="w-3.5 h-3.5 text-[#C8A96A]/40" />}
                                                    <span className="text-xs font-bold text-[#F5E6C8]/80">{w.method}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-[9px] font-medium text-[#C8A96A]/30 italic">{w.referenceNo}</p>
                                                    <p className="text-[10px] text-[#F5E6C8]/40 font-medium">{formatDate(w.createdAt)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-serif font-bold text-[#C8A96A]">₹{w.amount.toLocaleString('en-IN')}</span>
                                                <span className="text-[10px] font-black text-[#C8A96A]/20 uppercase tracking-widest">INR</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(w.status)}`}>
                                                {w.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedWithdrawal(w);
                                                        setShowDetailModal(true);
                                                    }}
                                                    className="p-2.5 bg-[#1A1A1A] border border-[#C8A96A]/20 text-[#C8A96A] rounded-xl hover:bg-[#C8A96A] hover:text-[#0D0D0D] transition-all shadow-md group/btn"
                                                >
                                                    <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                                {w.status === 'Pending' && (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(w._id, 'Completed')}
                                                        className="p-2.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-md"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail & Action Modal */}
            <AnimatePresence>
                {showDetailModal && selectedWithdrawal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <Motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetailModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <Motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 bg-[#121212] border-b border-[#C8A96A]/20 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#C8A96A]/10 rounded-2xl">
                                        <Shield className="w-6 h-6 text-[#C8A96A]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif font-bold text-[#F5E6C8] uppercase tracking-wider">Settlement Request</h3>
                                        <p className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em] mt-1">{selectedWithdrawal.referenceNo}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-[#C8A96A]/10 rounded-xl text-[#C8A96A]/40 transition-colors">
                                    <MoreVertical className="rotate-90 w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {/* Grid container for details */}
                                <div className="grid grid-cols-2 gap-8">
                                    {/* User Block */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/40 border-l-2 border-[#C8A96A] pl-3">Beneficiary Account</h4>
                                        <div className="p-5 bg-[#121212] border border-[#C8A96A]/10 rounded-2xl space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-black text-[#F5E6C8]/30 uppercase tracking-widest">Name</span>
                                                <span className="text-sm font-bold text-[#F5E6C8]">{selectedWithdrawal.userId?.userName}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-black text-[#F5E6C8]/30 uppercase tracking-widest">Member ID</span>
                                                <span className="text-sm font-mono text-[#C8A96A] font-bold">{selectedWithdrawal.userId?.memberId}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-black text-[#F5E6C8]/30 uppercase tracking-widest">Contact</span>
                                                <span className="text-sm font-bold text-[#F5E6C8]">{selectedWithdrawal.userId?.mobile}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank/UPI Block */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/40 border-l-2 border-[#C8A96A] pl-3">Destination Details</h4>
                                        <div className="p-5 bg-[#121212] border border-[#C8A96A]/10 rounded-2xl space-y-3">
                                            {selectedWithdrawal.method === 'Bank Transfer' ? (
                                                <>
                                                    <div className="flex justify-between items-center gap-4">
                                                        <span className="text-xs font-black text-[#F5E6C8]/30 uppercase tracking-widest shrink-0">Bank</span>
                                                        <span className="text-sm font-bold text-[#F5E6C8] text-right">{selectedWithdrawal.bankName}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-black text-[#F5E6C8]/30 uppercase tracking-widest">Account</span>
                                                        <span className="text-sm font-mono text-[#C8A96A] font-bold tracking-widest">{selectedWithdrawal.accountNumber}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-black text-[#F5E6C8]/30 uppercase tracking-widest">IFSC</span>
                                                        <span className="text-sm font-mono font-bold text-[#F5E6C8]">{selectedWithdrawal.ifscCode}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-xs font-black text-[#F5E6C8]/30 uppercase tracking-widest">UPI ID</span>
                                                    <span className="text-sm font-mono font-bold text-[#C8A96A] tracking-wider">{selectedWithdrawal.upiId}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Amount Summary */}
                                <div className="p-6 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl relative overflow-hidden group">
                                    <IndianRupee className="absolute -right-4 -bottom-4 w-32 h-32 text-[#C8A96A]/5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div>
                                            <p className="text-[10px] font-black text-[#C8A96A]/60 uppercase tracking-[0.3em] mb-1">Total Net Liquidity</p>
                                            <p className="text-4xl font-serif font-bold text-[#F5E6C8] tracking-tighter">₹{selectedWithdrawal.amount.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <p className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em] mb-1">Audit Status</p>
                                            <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border ${getStatusStyles(selectedWithdrawal.status)}`}>
                                                {selectedWithdrawal.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Action Section */}
                                {selectedWithdrawal.status === 'Pending' && (
                                    <div className="space-y-4 pt-4 border-t border-[#C8A96A]/10">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/40 mb-3 block">Internal Review Note (Shared with User)</label>
                                            <textarea 
                                                value={adminNote}
                                                onChange={(e) => setAdminNote(e.target.value)}
                                                placeholder="Provide reason for approval/rejection or transaction reference..."
                                                className="w-full bg-[#121212] border border-[#C8A96A]/20 rounded-2xl p-4 text-sm text-[#F5E6C8] placeholder:text-[#C8A96A]/20 focus:border-[#C8A96A] outline-none transition-all h-24 resize-none shadow-inner"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button 
                                                onClick={() => handleStatusUpdate(selectedWithdrawal._id, 'Rejected')}
                                                disabled={processingId}
                                                className="py-4 rounded-2xl border border-red-500/20 text-red-500 font-bold uppercase tracking-[0.2em] text-xs hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {processingId === selectedWithdrawal._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                Manifest Rejection
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(selectedWithdrawal._id, 'Completed')}
                                                disabled={processingId}
                                                className="py-4 rounded-2xl bg-[#C8A96A] text-[#0D0D0D] font-black uppercase tracking-[0.2em] text-xs hover:shadow-[0_0_30px_rgba(200,169,106,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {processingId === selectedWithdrawal._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Complete Settlement
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(200, 169, 106, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(200, 169, 106, 0.4);
                }
            `}</style>
        </div>
    );
};

export default AdminWithdrawals;
