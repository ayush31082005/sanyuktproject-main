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
    'rounded-[2px] border border-[#D7DCE2]/20 bg-[#111111] px-3 py-2 text-sm text-[#EEF2F6] outline-none focus:border-[#D7DCE2]';

export default function SilverMatching() {
    const [loading, setLoading] = useState(true);
    const [searchMode, setSearchMode] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searched, setSearched] = useState(false);
    const [totalEarned, setTotalEarned] = useState(0);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchSilverData = async () => {
            try {
                const res = await api.get('/mlm/matching-bonus/silver');
                const data = res.data?.data || {};
                setTotalEarned(data.totalEarned || 0);
                setHistory(Array.isArray(data.history) ? data.history : []);
            } catch (error) {
                console.error('Error fetching silver matching bonus:', error);
                setTotalEarned(0);
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSilverData();
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

    const filteredHistory = useMemo(() => {
        if (searchMode !== 'between' || !fromDate || !toDate) return history;

        const start = new Date(fromDate);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);

        return history.filter((item) => {
            const rowDate = new Date(item.date);
            return rowDate >= start && rowDate <= end;
        });
    }, [fromDate, history, searchMode, toDate]);

    const handleSearch = (event) => {
        event.preventDefault();
        setSearched(true);
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-3 py-6 text-white md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-6 flex items-start justify-end">
                    <div className="text-left md:text-right">
                        <h1 className="text-[1.9rem] font-black leading-none text-[#F5E6C8] md:text-[2.05rem]">
                            Silver Matching Bonus Report
                        </h1>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#D7DCE2]/55">
                            Welcome back {userName}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
                    <div className="overflow-hidden rounded-[2px] border border-[#D7DCE2]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                        <div className="bg-[#1C2428] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#D7DCE2]">
                            Search Criteria
                        </div>

                        <form onSubmit={handleSearch} className="p-6">
                            <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#EEF2F6]/75">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="silverSearchType"
                                        checked={searchMode === 'all'}
                                        onChange={() => setSearchMode('all')}
                                        accentColor="#D7DCE2"
                                    />
                                    All Record
                                </label>

                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="silverSearchType"
                                        checked={searchMode === 'between'}
                                        onChange={() => setSearchMode('between')}
                                        accentColor="#D7DCE2"
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
                                className="mt-4 rounded-[2px] bg-[#D7DCE2] px-4 py-2 text-[12px] font-black uppercase tracking-[0.12em] text-[#0D0D0D] transition hover:bg-[#e6ebf0]"
                            >
                                Search &gt;&gt;
                            </button>
                        </form>
                    </div>

                    <div className="flex min-h-[160px] items-center justify-center rounded-[2px] border border-[#D7DCE2]/35 bg-[linear-gradient(135deg,#23272d_0%,#8d97a3_45%,#d7dce2_100%)] px-6 py-8 text-center shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                        <div>
                            <div className="text-[3.4rem] font-light leading-none text-[#0D0D0D]">Rs</div>
                            <div className="mt-2 text-[3.25rem] font-light leading-none tracking-tight text-[#0D0D0D]">
                                {loading ? '0.00' : formatAmount(totalEarned)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 overflow-hidden rounded-[2px] border border-[#D7DCE2]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center justify-between bg-[#1C2428] px-4 py-3">
                        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D7DCE2]">
                            Silver Matching Bonus Report
                        </span>
                        <span className="rounded-[2px] bg-[#D7DCE2] px-2 py-1 text-[10px] font-bold text-[#0D0D0D]">
                            {filteredHistory.length} Records
                        </span>
                    </div>

                    <div className="p-4">
                        {loading ? (
                            <div className="py-10 text-center text-sm text-[#EEF2F6]/55">Loading report...</div>
                        ) : filteredHistory.length === 0 ? (
                            <div className="py-10 text-center text-sm text-[#EEF2F6]/55">
                                {searched ? 'No silver matching records found.' : 'No silver matching bonus records available.'}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                                    <thead>
                                        <tr className="bg-[#111111] text-[#D7DCE2]">
                                            <th className="border border-[#D7DCE2]/15 px-3 py-2">Transaction ID</th>
                                            <th className="border border-[#D7DCE2]/15 px-3 py-2">Date</th>
                                            <th className="border border-[#D7DCE2]/15 px-3 py-2">Matched PV</th>
                                            <th className="border border-[#D7DCE2]/15 px-3 py-2">Bonus Amount</th>
                                            <th className="border border-[#D7DCE2]/15 px-3 py-2">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredHistory.map((item) => (
                                            <tr key={item._id} className="bg-[#171717] text-[#EEF2F6]/90">
                                                <td className="border border-[#D7DCE2]/10 px-3 py-2">
                                                    #{String(item._id).slice(-8).toUpperCase()}
                                                </td>
                                                <td className="border border-[#D7DCE2]/10 px-3 py-2">{formatDate(item.date)}</td>
                                                <td className="border border-[#D7DCE2]/10 px-3 py-2">{item.matchedPV || 0}</td>
                                                <td className="border border-[#D7DCE2]/10 px-3 py-2 text-[#D7DCE2]">
                                                    Rs {formatAmount(item.bonusAmount)}
                                                </td>
                                                <td className="border border-[#D7DCE2]/10 px-3 py-2">
                                                    {item.description || 'Silver matching bonus credited'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
