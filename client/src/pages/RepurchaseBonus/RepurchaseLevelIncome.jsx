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

const inputClassName =
    'rounded-[2px] border border-[#22C55E]/20 bg-[#111111] px-3 py-2 text-sm text-[#ECFDF5] outline-none focus:border-[#22C55E]';

const RepurchaseLevelIncome = () => {
    const [loading, setLoading] = useState(true);
    const [searchMode, setSearchMode] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searched, setSearched] = useState(false);
    const [totalIncome, setTotalIncome] = useState(0);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/repurchase/level-income');
                const data = res.data?.data || {};
                setTotalIncome(data.totalLevelIncome || 0);
                setTransactions(Array.isArray(data.recentTransactions) ? data.recentTransactions : []);
            } catch (error) {
                console.error('Error fetching repurchase level income:', error);
                setTotalIncome(0);
                setTransactions([]);
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

    const filteredTransactions = useMemo(() => {
        if (searchMode !== 'between' || !fromDate || !toDate) return transactions;

        const start = new Date(fromDate);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);

        return transactions.filter((item) => {
            const rowDate = new Date(item.createdAt || item.date);
            return rowDate >= start && rowDate <= end;
        });
    }, [fromDate, searchMode, toDate, transactions]);

    const handleSearch = (event) => {
        event.preventDefault();
        setSearched(true);
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#0D0D0D] px-2 py-4 text-white sm:px-3 sm:py-6 md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-5 hidden items-start justify-start md:mb-6 md:flex md:justify-end">
                    <div className="min-w-0 text-left md:text-right">
                        <h1 className="break-words text-[1.45rem] font-black leading-tight text-[#F5E6C8] sm:text-[1.7rem] md:text-[2.05rem]">
                            Repurchase Level Income Report
                        </h1>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#22C55E]/55">
                            Welcome back {userName}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[1fr_1fr] lg:gap-5">
                    <div className="overflow-hidden rounded-[2px] border border-[#22C55E]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                        <div className="bg-[#1A2320] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#22C55E]">
                            Search Criteria
                        </div>

                        <form onSubmit={handleSearch} className="p-3 sm:p-6">
                            <div className="flex flex-col gap-3 text-[12px] text-[#ECFDF5]/75 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="repurchaseLevelSearchType"
                                        checked={searchMode === 'all'}
                                        onChange={() => setSearchMode('all')}
                                        accentColor="#22C55E"
                                    />
                                    All Record
                                </label>

                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="repurchaseLevelSearchType"
                                        checked={searchMode === 'between'}
                                        onChange={() => setSearchMode('between')}
                                        accentColor="#22C55E"
                                    />
                                    Between Dates
                                </label>
                            </div>

                            {searchMode === 'between' && (
                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(event) => setFromDate(event.target.value)}
                                        className={inputClassName}
                                    />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(event) => setToDate(event.target.value)}
                                        className={inputClassName}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                className="mt-4 inline-flex w-full items-center justify-center rounded-[2px] bg-[#22C55E] px-4 py-3 text-[12px] font-black uppercase tracking-[0.12em] text-[#0D0D0D] transition hover:bg-[#4ade80] sm:w-auto"
                            >
                                Search &gt;&gt;
                            </button>
                        </form>
                    </div>

                    <div className="flex min-h-[110px] items-center justify-center rounded-[2px] border border-[#22C55E]/35 bg-[linear-gradient(135deg,#123126_0%,#15803d_45%,#4ade80_100%)] px-4 py-4 text-center shadow-[0_14px_40px_rgba(0,0,0,0.35)] sm:min-h-[160px] sm:px-6 sm:py-8">
                        <div>
                            <div className="text-[1.9rem] font-light leading-none text-white sm:text-[3.4rem]">Rs</div>
                            <div className="mt-1 break-all text-[1.9rem] font-light leading-none tracking-tight text-white sm:mt-2 sm:text-[3.25rem]">
                                {loading ? '0.00' : formatAmount(totalIncome)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-[2px] border border-[#22C55E]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)] md:mt-10">
                    <div className="flex flex-col gap-3 bg-[#1A2320] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="break-words text-[11px] font-black uppercase tracking-[0.18em] text-[#22C55E]">
                            Repurchase Level Income Report
                        </span>
                        <span className="w-fit rounded-[2px] bg-[#22C55E] px-2 py-1 text-[10px] font-bold text-[#0D0D0D]">
                            {filteredTransactions.length} Records
                        </span>
                    </div>

                    <div className="p-4">
                        {loading ? (
                            <div className="py-10 text-center text-sm text-[#ECFDF5]/55">Loading report...</div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="py-10 text-center text-sm text-[#ECFDF5]/55">
                                {searched ? 'No repurchase level records found.' : 'No repurchase level income records available.'}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 md:hidden">
                                    {filteredTransactions.map((item, index) => (
                                        <div key={item._id} className="rounded-[2px] border border-[#22C55E]/15 bg-[#111111] p-4">
                                            <div className="mb-3 flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#22C55E]/70">
                                                        Record {index + 1}
                                                    </div>
                                                    <div className="mt-1 break-words text-sm font-black text-[#ECFDF5]">
                                                        #{String(item._id).slice(-8).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="shrink-0 rounded-[2px] bg-[#22C55E]/12 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#22C55E]">
                                                    {item.generation ? `Gen ${item.generation}` : 'N/A'}
                                                </div>
                                            </div>

                                            <div className="space-y-2.5 text-sm text-[#ECFDF5]/90">
                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-[#ECFDF5]/55">Date</span>
                                                    <span className="text-right font-semibold">
                                                        {formatDate(item.createdAt || item.date)}
                                                    </span>
                                                </div>
                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-[#ECFDF5]/55">From Member</span>
                                                    <span className="max-w-[62%] break-words text-right font-semibold">
                                                        {item.fromUserId?.userName || item.fromUserId?.name || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-[#ECFDF5]/55">BV</span>
                                                    <span className="text-right font-semibold">{item.bv || 0}</span>
                                                </div>
                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-[#ECFDF5]/55">Commission</span>
                                                    <span className="text-right font-semibold">
                                                        {item.commissionPercent ? `${item.commissionPercent}%` : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex items-start justify-between gap-4">
                                                    <span className="text-[#ECFDF5]/55">Bonus Amount</span>
                                                    <span className="text-right font-black text-[#22C55E]">
                                                        Rs {formatAmount(item.commissionAmount)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="hidden overflow-x-auto overscroll-x-contain md:block" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
                                    <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                                        <thead>
                                            <tr className="bg-[#111111] text-[#22C55E]">
                                                <th className="border border-[#22C55E]/15 px-3 py-2">Transaction ID</th>
                                                <th className="border border-[#22C55E]/15 px-3 py-2">Date</th>
                                                <th className="border border-[#22C55E]/15 px-3 py-2">From Member</th>
                                                <th className="border border-[#22C55E]/15 px-3 py-2">Generation</th>
                                                <th className="border border-[#22C55E]/15 px-3 py-2">BV</th>
                                                <th className="border border-[#22C55E]/15 px-3 py-2">Commission</th>
                                                <th className="border border-[#22C55E]/15 px-3 py-2">Bonus Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTransactions.map((item) => (
                                                <tr key={item._id} className="bg-[#171717] text-[#ECFDF5]/90">
                                                    <td className="border border-[#22C55E]/10 px-3 py-2">
                                                        #{String(item._id).slice(-8).toUpperCase()}
                                                    </td>
                                                    <td className="border border-[#22C55E]/10 px-3 py-2">
                                                        {formatDate(item.createdAt || item.date)}
                                                    </td>
                                                    <td className="border border-[#22C55E]/10 px-3 py-2">
                                                        {item.fromUserId?.userName || item.fromUserId?.name || 'N/A'}
                                                    </td>
                                                    <td className="border border-[#22C55E]/10 px-3 py-2">
                                                        {item.generation ? `Gen ${item.generation}` : 'N/A'}
                                                    </td>
                                                    <td className="border border-[#22C55E]/10 px-3 py-2">{item.bv || 0}</td>
                                                    <td className="border border-[#22C55E]/10 px-3 py-2">
                                                        {item.commissionPercent ? `${item.commissionPercent}%` : 'N/A'}
                                                    </td>
                                                    <td className="border border-[#22C55E]/10 px-3 py-2 text-[#22C55E]">
                                                        Rs {formatAmount(item.commissionAmount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepurchaseLevelIncome;
