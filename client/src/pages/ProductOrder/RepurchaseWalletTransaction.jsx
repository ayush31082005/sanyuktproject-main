import { useEffect, useState } from 'react';
import { CalendarDays, CircleDollarSign, Search, ShieldCheck } from 'lucide-react';
import api from '../../api';

const sectionTitleClass = 'text-[13px] font-black uppercase tracking-[0.14em] text-[#C8A96A]';
const fieldClass = 'w-full rounded-2xl border border-[#C8A96A]/15 bg-[#111111] px-4 py-3 text-sm text-[#F5E6C8] outline-none transition placeholder:text-[#F5E6C8]/30 focus:border-[#C8A96A]/50 focus:bg-[#141414]';

const SectionCard = ({ title, children, badge = null }) => (
    <div className="overflow-hidden rounded-[2rem] border border-[#C8A96A]/12 bg-[#1A1A1A] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-3 border-b border-white/5 bg-[linear-gradient(135deg,#1f1f1f_0%,#191919_50%,#151515_100%)] px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className={sectionTitleClass}>{title}</div>
            {badge}
        </div>
        <div className="p-5 md:p-6">{children}</div>
    </div>
);

const formatDate = (value) =>
    value
        ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'N/A';

const formatCurrency = (value) => Number(value || 0).toFixed(2);

const REPURCHASE_INCOME_TYPES = new Set([
    'repurchase',
    'self_repurchase',
    'repurchase_level',
    'sponsor_income',
    'royalty_bonus',
    'house_fund',
    'leadership_fund',
    'car_fund',
    'travel_fund',
    'bike_fund',
]);

const isRepurchaseIncomeTransaction = (item) => {
    const type = String(item?.type || '').toLowerCase();
    const details = String(item?.details || '').toLowerCase();
    return REPURCHASE_INCOME_TYPES.has(type) || details.includes('repurchase');
};

export default function RepurchaseWalletTransaction() {
    const [searchMode, setSearchMode] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searched, setSearched] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState('0.00');
    const [loading, setLoading] = useState(true);

    const loadReport = async (params = {}) => {
        try {
            setLoading(true);
            const res = await api.get('/wallet/all-transactions', {
                params: {
                    search: '',
                    walletType: 'generation-wallet',
                    ...params,
                },
            });

            const rows = Array.isArray(res.data?.transactions) ? res.data.transactions : [];
            const repurchaseRows = rows.filter(isRepurchaseIncomeTransaction).map((item) => ({
                _id: item._id,
                createdAt: item.date,
                txType: item.txType,
                sourceType: item.type,
                description: item.details || item.source || '-',
                amount: item.amount,
                balanceAfter: null,
            }));

            const total = repurchaseRows.reduce(
                (sum, item) => sum + (item.txType === 'credit' ? Number(item.amount || 0) : -Number(item.amount || 0)),
                0
            );

            setBalance(formatCurrency(total));
            setTransactions(repurchaseRows);
        } catch (error) {
            console.error('Repurchase wallet transaction error:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearched(true);

        const params =
            searchMode === 'between'
                ? { fromDate, toDate }
                : {};

        await loadReport(params);
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-4 py-6 md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">Transaction Section</p>
                        <h1 className="mt-1 text-[1.9rem] font-black tracking-tight text-white">Repurchase Wallet Transaction Report</h1>
                    </div>

                    <div className="text-left md:text-right">
                        <div className="text-[12px] font-black uppercase tracking-[0.16em] text-[#F5E6C8]/45">Welcome Back</div>
                        <div className="mt-1 text-lg font-black text-[#F5E6C8]">Repurchase Wallet Desk</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <SectionCard title="Search Criteria">
                        <form onSubmit={handleSearch} className="space-y-5">
                            <div className="flex flex-wrap items-center gap-5">
                                <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5E6C8]">
                                    <input type="radio" name="searchMode" checked={searchMode === 'all'} onChange={() => setSearchMode('all')} className="h-4 w-4 accent-[#C8A96A]" />
                                    All Record
                                </label>

                                <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5E6C8]">
                                    <input type="radio" name="searchMode" checked={searchMode === 'between'} onChange={() => setSearchMode('between')} className="h-4 w-4 accent-[#C8A96A]" />
                                    Between Dates
                                </label>
                            </div>

                            {searchMode === 'between' && (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="relative">
                                        <CalendarDays size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A96A]/60" />
                                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={`${fieldClass} pl-11`} />
                                    </div>

                                    <div className="relative">
                                        <CalendarDays size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A96A]/60" />
                                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={`${fieldClass} pl-11`} />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-[#C8A96A] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#111111] transition hover:bg-[#d5b87d]">
                                <Search size={16} />
                                Search
                            </button>
                        </form>
                    </SectionCard>

                    <div className="rounded-[2rem] border border-emerald-400/20 bg-[linear-gradient(135deg,#1f8f53_0%,#34c97a_48%,#5bd48f_100%)] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">Repurchase Income Total</p>
                                <div className="mt-6 text-5xl font-black tracking-tight text-white">{balance}</div>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                                <CircleDollarSign size={22} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <SectionCard
                        title="Repurchase Wallet Transaction Report"
                        badge={
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C8A96A]/15 bg-[#C8A96A]/8 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#F5E6C8]">
                                <ShieldCheck size={14} className="text-[#C8A96A]" />
                                {transactions.length} Records
                            </div>
                        }
                    >
                        {loading ? (
                            <div className="flex min-h-[180px] items-center justify-center rounded-[1.5rem] border border-dashed border-[#C8A96A]/14 bg-[#121212] px-6 text-center">
                                <p className="text-sm text-[#F5E6C8]/50">Loading repurchase wallet transactions...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex min-h-[180px] items-center justify-center rounded-[1.5rem] border border-dashed border-[#C8A96A]/14 bg-[#121212] px-6 text-center">
                                <p className="text-sm text-[#F5E6C8]/50">
                                    {searched ? 'No repurchase wallet transactions found for the selected criteria.' : 'Use search criteria to view transaction report.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-[1.5rem] border border-[#C8A96A]/12 bg-[#111111]">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[860px] border-collapse text-left text-sm text-[#F5E6C8]">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-[#171717] text-[11px] uppercase tracking-[0.12em] text-[#C8A96A]">
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Type</th>
                                                <th className="px-4 py-3">Source</th>
                                                <th className="px-4 py-3">Details</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Balance After</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((item) => (
                                                <tr key={item._id} className="border-b border-white/5 last:border-b-0">
                                                    <td className="px-4 py-4">{formatDate(item.createdAt)}</td>
                                                    <td className="px-4 py-4 uppercase">{item.txType}</td>
                                                    <td className="px-4 py-4">{item.sourceType}</td>
                                                    <td className="px-4 py-4">{item.description || '-'}</td>
                                                    <td className={`px-4 py-4 font-semibold ${item.txType === 'credit' ? 'text-emerald-300' : 'text-rose-300'}`}>
                                                        {item.txType === 'credit' ? '+' : '-'}Rs {formatCurrency(item.amount)}
                                                    </td>
                                                    <td className="px-4 py-4">{item.balanceAfter == null ? '-' : `Rs ${formatCurrency(item.balanceAfter)}`}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}
