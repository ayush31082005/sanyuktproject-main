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
    'rounded-[2px] border border-[#C8A96A]/20 bg-[#111111] px-3 py-2 text-sm text-[#F5E6C8] outline-none focus:border-[#C8A96A]';

const DeductionReport = () => {
    const [loading, setLoading] = useState(true);
    const [searchMode, setSearchMode] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [searched, setSearched] = useState(false);
    const [deductions, setDeductions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/wallet/deduction-report', {
                    params: {
                        walletType: 'e-wallet',
                        period: 'last3Months',
                        type: 'All Types',
                        search: '',
                    },
                });
                setDeductions(Array.isArray(res.data?.deductions) ? res.data.deductions : []);
            } catch (error) {
                console.error('Error fetching deduction report:', error);
                setDeductions([]);
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

    const filteredDeductions = useMemo(() => {
        if (searchMode !== 'between' || !fromDate || !toDate) return deductions;
        const start = new Date(fromDate);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        return deductions.filter((item) => {
            const rowDate = new Date(item.createdAt);
            return rowDate >= start && rowDate <= end;
        });
    }, [deductions, fromDate, searchMode, toDate]);

    const totalAmount = filteredDeductions.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#0D0D0D] px-2 py-4 text-white sm:px-3 sm:py-6 md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-5 hidden items-start justify-start md:mb-6 md:flex md:justify-end">
                    <div className="min-w-0 text-left md:text-right">
                        <h1 className="break-words text-[1.45rem] font-black leading-tight text-[#F5E6C8] sm:text-[1.7rem] md:text-[2.05rem]">Deduction Report</h1>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#C8A96A]/55">Welcome back {userName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[1fr_1fr] lg:gap-5">
                    <div className="overflow-hidden rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                        <div className="bg-[#1F1F1F] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">Search Criteria</div>
                        <form onSubmit={(event) => { event.preventDefault(); setSearched(true); }} className="p-3 sm:p-6">
                            <div className="flex flex-col gap-3 text-[12px] text-[#F5E6C8]/75 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                                <label className="inline-flex items-center gap-2"><input type="radio" name="deductionSearch" checked={searchMode === 'all'} onChange={() => setSearchMode('all')} accentColor="#C8A96A" />All Record</label>
                                <label className="inline-flex items-center gap-2"><input type="radio" name="deductionSearch" checked={searchMode === 'between'} onChange={() => setSearchMode('between')} accentColor="#C8A96A" />Between Dates</label>
                            </div>
                            {searchMode === 'between' && (
                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className={inputClassName} />
                                    <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className={inputClassName} />
                                </div>
                            )}
                            <button type="submit" className="mt-4 inline-flex w-full items-center justify-center rounded-[2px] bg-[#C8A96A] px-4 py-3 text-[12px] font-black uppercase tracking-[0.12em] text-[#0D0D0D] sm:w-auto">Search &gt;&gt;</button>
                        </form>
                    </div>

                    <div className="flex min-h-[110px] items-center justify-center rounded-[2px] border border-[#C8A96A]/35 bg-[linear-gradient(135deg,#2d2416_0%,#c8a96a_55%,#f0dfb2_100%)] px-4 py-4 text-center shadow-[0_14px_40px_rgba(0,0,0,0.35)] sm:min-h-[160px] sm:px-6 sm:py-8">
                        <div><div className="text-[1.9rem] font-light leading-none text-[#0D0D0D] sm:text-[3.4rem]">Rs</div><div className="mt-1 break-all text-[1.9rem] font-light leading-none tracking-tight text-[#0D0D0D] sm:mt-2 sm:text-[3.25rem]">{loading ? '0.00' : formatAmount(totalAmount)}</div></div>
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)] md:mt-10">
                    <div className="flex flex-col gap-3 bg-[#1F1F1F] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="break-words text-[11px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">Deduction Report</span>
                        <span className="w-fit rounded-[2px] bg-[#C8A96A] px-2 py-1 text-[10px] font-bold text-[#0D0D0D]">{filteredDeductions.length} Records</span>
                    </div>
                    <div className="p-4">
                        {loading ? <div className="py-10 text-center text-sm text-[#F5E6C8]/55">Loading report...</div> : filteredDeductions.length === 0 ? <div className="py-10 text-center text-sm text-[#F5E6C8]/55">{searched ? 'No deduction records found for selected dates.' : 'No deduction records available.'}</div> : (
                            <>
                                <div className="space-y-3 md:hidden">
                                    {filteredDeductions.map((item, index) => (
                                        <div key={item._id} className="rounded-[2px] border border-[#C8A96A]/15 bg-[#111111] p-4">
                                            <div className="mb-3 flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#C8A96A]/70">Record {index + 1}</div>
                                                    <div className="mt-1 break-words text-sm font-black text-[#F5E6C8]">{item.referenceNo || 'Deduction Entry'}</div>
                                                </div>
                                                <div className="shrink-0 rounded-[2px] bg-[#C8A96A]/12 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#C8A96A]">{item.status || '-'}</div>
                                            </div>
                                            <div className="space-y-2.5 text-sm text-[#F5E6C8]/90">
                                                <div className="flex items-start justify-between gap-4"><span className="text-[#F5E6C8]/55">Date</span><span className="text-right font-semibold">{formatDate(item.createdAt)}</span></div>
                                                <div className="flex items-start justify-between gap-4"><span className="text-[#F5E6C8]/55">Description</span><span className="max-w-[62%] break-words text-right font-semibold">{item.description || 'Deduction entry'}</span></div>
                                                <div className="flex items-start justify-between gap-4"><span className="text-[#F5E6C8]/55">Type</span><span className="text-right font-semibold">{item.type || '-'}</span></div>
                                                <div className="flex items-start justify-between gap-4"><span className="text-[#F5E6C8]/55">Amount</span><span className="text-right font-black text-[#C8A96A]">Rs {formatAmount(item.amount)}</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="hidden overflow-x-auto overscroll-x-contain md:block" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
                                    <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                                        <thead><tr className="bg-[#111111] text-[#C8A96A]">
                                            <th className="border border-[#C8A96A]/15 px-3 py-2">Date</th>
                                            <th className="border border-[#C8A96A]/15 px-3 py-2">Description</th>
                                            <th className="border border-[#C8A96A]/15 px-3 py-2">Reference</th>
                                            <th className="border border-[#C8A96A]/15 px-3 py-2">Type</th>
                                            <th className="border border-[#C8A96A]/15 px-3 py-2">Amount</th>
                                            <th className="border border-[#C8A96A]/15 px-3 py-2">Status</th>
                                        </tr></thead>
                                        <tbody>{filteredDeductions.map((item) => (
                                            <tr key={item._id} className="bg-[#171717] text-[#F5E6C8]/90">
                                                <td className="border border-[#C8A96A]/10 px-3 py-2">{formatDate(item.createdAt)}</td>
                                                <td className="border border-[#C8A96A]/10 px-3 py-2">{item.description || 'Deduction entry'}</td>
                                                <td className="border border-[#C8A96A]/10 px-3 py-2">{item.referenceNo || '-'}</td>
                                                <td className="border border-[#C8A96A]/10 px-3 py-2">{item.type || '-'}</td>
                                                <td className="border border-[#C8A96A]/10 px-3 py-2 text-[#C8A96A]">Rs {formatAmount(item.amount)}</td>
                                                <td className="border border-[#C8A96A]/10 px-3 py-2">{item.status || '-'}</td>
                                            </tr>
                                        ))}</tbody>
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

export default DeductionReport;
