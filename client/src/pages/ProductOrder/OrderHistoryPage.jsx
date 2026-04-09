import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Package, Receipt, ShieldCheck } from 'lucide-react';
import api from '../../api';

const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const statusTone = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'paid' || normalized === 'delivered') {
        return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';
    }
    if (normalized === 'pending') {
        return 'border-amber-500/20 bg-amber-500/10 text-amber-300';
    }
    if (normalized === 'cancelled') {
        return 'border-rose-500/20 bg-rose-500/10 text-rose-300';
    }
    return 'border-slate-500/20 bg-slate-500/10 text-slate-300';
};

export default function OrderHistoryPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/myorders');
                setOrders(res.data || []);
            } catch (error) {
                console.error('Error fetching order history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const userName = (() => {
        try {
            const raw = localStorage.getItem('user');
            const parsed = raw ? JSON.parse(raw) : null;
            return parsed?.userName || 'Member';
        } catch {
            return 'Member';
        }
    })();

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-4 py-6 md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A]">
                            <Receipt size={20} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">Order Section</p>
                            <h1 className="text-[1.9rem] font-black tracking-tight text-white">Order History</h1>
                        </div>
                    </div>

                    <div className="text-left md:text-right">
                        <div className="text-[12px] font-black uppercase tracking-[0.16em] text-[#F5E6C8]/45">Welcome Back</div>
                        <div className="mt-1 text-lg font-black text-[#F5E6C8]">{userName}</div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-[#C8A96A]/12 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                    <div className="flex flex-col gap-3 border-b border-white/5 bg-[linear-gradient(135deg,#1f1f1f_0%,#191919_50%,#151515_100%)] px-5 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A]">
                                <ClipboardList size={18} />
                            </div>
                            <div>
                                <div className="text-[13px] font-black uppercase tracking-[0.14em] text-[#C8A96A]">Order History</div>
                                <div className="text-[11px] font-semibold text-[#F5E6C8]/45">Track all your placed orders in one place</div>
                            </div>
                        </div>

                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C8A96A]/15 bg-[#C8A96A]/8 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#F5E6C8]">
                            <ShieldCheck size={14} className="text-[#C8A96A]" />
                            {orders.length} Records
                        </div>
                    </div>

                    <div className="p-5 md:p-6">
                        {loading ? (
                            <div className="flex min-h-[220px] items-center justify-center">
                                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-[#C8A96A]"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[#C8A96A]/14 bg-[#121212] px-6 text-center">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#C8A96A]/10 text-[#C8A96A]">
                                    <Package size={24} />
                                </div>
                                <h3 className="text-xl font-black text-[#F5E6C8]">No orders found</h3>
                                <p className="mt-2 max-w-md text-sm text-[#F5E6C8]/50">
                                    Your placed orders will appear here after you complete a purchase.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-[1.5rem] border border-[#C8A96A]/12 bg-[#111111]">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[860px] border-collapse text-left text-sm text-[#F5E6C8]">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-[#171717] text-[11px] uppercase tracking-[0.12em] text-[#C8A96A]">
                                                <th className="px-4 py-3">Order ID</th>
                                                <th className="px-4 py-3">Product</th>
                                                <th className="px-4 py-3">Qty</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Payment</th>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr key={order._id} className="border-b border-white/5 last:border-b-0">
                                                    <td className="px-4 py-4 font-black text-white">
                                                        #{String(order._id).slice(-8).toUpperCase()}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="font-semibold text-[#F5E6C8]">{order.product?.name || 'Product'}</div>
                                                    </td>
                                                    <td className="px-4 py-4">{order.quantity || 0}</td>
                                                    <td className="px-4 py-4 font-semibold text-white">{formatCurrency(order.total)}</td>
                                                    <td className="px-4 py-4 uppercase">{order.paymentMethod || 'N/A'}</td>
                                                    <td className="px-4 py-4">{formatDate(order.createdAt)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${statusTone(order.status)}`}>
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => navigate(`/order-details/${order._id}`)}
                                                            className="rounded-xl bg-[#C8A96A] px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d]"
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
