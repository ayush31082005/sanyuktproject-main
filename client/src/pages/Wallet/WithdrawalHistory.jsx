import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api';

const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const formatAmount = (value) =>
    Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const WithdrawalHistory = () => {
    const [loading, setLoading] = useState(true);
    const [searchMode, setSearchMode] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searched, setSearched] = useState(false);
    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/wallet/withdrawal-history', {
                    params: { status: 'All Status', method: 'All Methods', period: 'All Time' },
                });
                setWithdrawals(Array.isArray(res.data?.withdrawals) ? res.data.withdrawals : []);
            } catch (error) {
                console.error('Error fetching withdrawal history:', error);
                setWithdrawals([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const userName = (() => {
        try {
            const raw = localStorage.getItem('user');
            const parsed = raw ? JSON.parse(raw) : null;
            return parsed?.userName || 'DEV PATEL';
        } catch {
            return 'DEV PATEL';
        }
    })();

    const filteredWithdrawals = useMemo(() => {
        if (searchMode !== 'between' || !fromDate || !toDate) return withdrawals;
        const start = new Date(fromDate);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        return withdrawals.filter((item) => {
            const rowDate = new Date(item.createdAt);
            return rowDate >= start && rowDate <= end;
        });
    }, [withdrawals, fromDate, searchMode, toDate]);

    const totalAmount = filteredWithdrawals.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-3 py-6 text-white md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-6 flex items-start justify-end">
                    <div className="text-left md:text-right">
                        <h1 className="text-[1.9rem] font-black leading-none text-[#F5E6C8] md:text-[2.05rem]">Withdrawal History</h1>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#C8A96A]/55">Welcome back {userName}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
                    <div className="overflow-hidden rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                        <div className="bg-[#1F1F1F] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">Search Criteria</div>
                        <form onSubmit={(event) => { event.preventDefault(); setSearched(true); }} className="p-6">
                            <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#F5E6C8]/75">
                                <label className="inline-flex items-center gap-2"><input type="radio" name="withdrawSearch" checked={searchMode === 'all'} onChange={() => setSearchMode('all')} accentColor="#C8A96A" />All Record</label>
                                <label className="inline-flex items-center gap-2"><input type="radio" name="withdrawSearch" checked={searchMode === 'between'} onChange={() => setSearchMode('between')} accentColor="#C8A96A" />Between Dates</label>
                            </div>
                            {searchMode === 'between' && (
                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="rounded-[2px] border border-[#C8A96A]/20 bg-[#111111] px-3 py-2 text-sm text-[#F5E6C8] outline-none focus:border-[#C8A96A]" />
                                    <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="rounded-[2px] border border-[#C8A96A]/20 bg-[#111111] px-3 py-2 text-sm text-[#F5E6C8] outline-none focus:border-[#C8A96A]" />
                                </div>
                            )}
                            <button type="submit" className="mt-4 rounded-[2px] bg-[#C8A96A] px-4 py-2 text-[12px] font-black uppercase tracking-[0.12em] text-[#0D0D0D]">Search &gt;&gt;</button>
                        </form>
                    </div>
                    <div className="flex min-h-[160px] items-center justify-center rounded-[2px] border border-[#C8A96A]/35 bg-[linear-gradient(135deg,#2d2416_0%,#c8a96a_55%,#f0dfb2_100%)] px-6 py-8 text-center shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                        <div><div className="text-[3.4rem] font-light leading-none text-[#0D0D0D]">Rs</div><div className="mt-2 text-[3.25rem] font-light leading-none tracking-tight text-[#0D0D0D]">{loading ? '0.00' : formatAmount(totalAmount)}</div></div>
                    </div>
                </div>
                <div className="mt-10 overflow-hidden rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center justify-between bg-[#1F1F1F] px-4 py-3">
                        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">Withdrawal History</span>
                        <span className="rounded-[2px] bg-[#C8A96A] px-2 py-1 text-[10px] font-bold text-[#0D0D0D]">{filteredWithdrawals.length} Records</span>
                    </div>
                    <div className="p-4">
                        {loading ? <div className="py-10 text-center text-sm text-[#F5E6C8]/55">Loading report...</div> : filteredWithdrawals.length === 0 ? <div className="py-10 text-center text-sm text-[#F5E6C8]/55">{searched ? 'No withdrawal records found for selected dates.' : 'No withdrawal records available.'}</div> : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[840px] border-collapse text-left text-sm">
                                    <thead><tr className="bg-[#111111] text-[#C8A96A]">
                                        <th className="border border-[#C8A96A]/15 px-3 py-2">Date</th>
                                        <th className="border border-[#C8A96A]/15 px-3 py-2">Reference</th>
                                        <th className="border border-[#C8A96A]/15 px-3 py-2">Method</th>
                                        <th className="border border-[#C8A96A]/15 px-3 py-2">Destination</th>
                                        <th className="border border-[#C8A96A]/15 px-3 py-2">Amount</th>
                                        <th className="border border-[#C8A96A]/15 px-3 py-2">Status</th>
                                    </tr></thead>
                                    <tbody>{filteredWithdrawals.map((item) => (
                                        <tr key={item._id} className="bg-[#171717] text-[#F5E6C8]/90">
                                            <td className="border border-[#C8A96A]/10 px-3 py-2">{formatDate(item.createdAt)}</td>
                                            <td className="border border-[#C8A96A]/10 px-3 py-2">{item.referenceNo || '-'}</td>
                                            <td className="border border-[#C8A96A]/10 px-3 py-2">{item.method || '-'}</td>
                                            <td className="border border-[#C8A96A]/10 px-3 py-2">{item.upiId || item.bankName || '-'}</td>
                                            <td className="border border-[#C8A96A]/10 px-3 py-2 text-[#C8A96A]">Rs {formatAmount(item.amount)}</td>
                                            <td className="border border-[#C8A96A]/10 px-3 py-2">{item.status || '-'}</td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalHistory;
