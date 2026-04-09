import React, { useState } from 'react';

const DirectorBonus = () => {
    const [searchMode, setSearchMode] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const userName = (() => {
        try {
            const raw = localStorage.getItem('user');
            const parsed = raw ? JSON.parse(raw) : null;
            return parsed?.userName || 'DEV PATEL';
        } catch {
            return 'DEV PATEL';
        }
    })();

    const inputClassName =
        'rounded-[2px] border border-[#F59E0B]/20 bg-[#111111] px-3 py-2 text-sm text-[#F5E6C8] outline-none focus:border-[#F59E0B]';

    return (
        <div className="min-h-screen bg-[#0D0D0D] px-3 py-6 text-white md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-6 flex items-start justify-end">
                    <div className="text-left md:text-right">
                        <h1 className="text-[1.9rem] font-black leading-none text-[#F5E6C8] md:text-[2.05rem]">Director Bonus Report</h1>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#F59E0B]/55">Welcome back {userName}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
                    <div className="overflow-hidden rounded-[2px] border border-[#F59E0B]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                        <div className="bg-[#241c11] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#F59E0B]">Search Criteria</div>
                        <form className="p-6 text-[12px] text-[#F5E6C8]/75">
                            <div className="flex items-center gap-4">
                                <label className="inline-flex items-center gap-2"><input type="radio" checked={searchMode === 'all'} onChange={() => setSearchMode('all')} accentColor="#F59E0B" />All Record</label>
                                <label className="inline-flex items-center gap-2"><input type="radio" checked={searchMode === 'between'} onChange={() => setSearchMode('between')} accentColor="#F59E0B" />Between Dates</label>
                            </div>
                            {searchMode === 'between' && (
                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className={inputClassName} />
                                    <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className={inputClassName} />
                                </div>
                            )}
                            <button className="mt-4 rounded-[2px] bg-[#F59E0B] px-4 py-2 text-[12px] font-black uppercase tracking-[0.12em] text-[#0D0D0D]">Search &gt;&gt;</button>
                        </form>
                    </div>
                    <div className="flex min-h-[160px] items-center justify-center rounded-[2px] border border-[#F59E0B]/35 bg-[linear-gradient(135deg,#3a240c_0%,#f59e0b_55%,#fcd34d_100%)] px-6 py-8 text-center shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                        <div><div className="text-[3.4rem] font-light leading-none text-[#0D0D0D]">Rs</div><div className="mt-2 text-[3.25rem] font-light leading-none tracking-tight text-[#0D0D0D]">0.00</div></div>
                    </div>
                </div>
                <div className="mt-10 overflow-hidden rounded-[2px] border border-[#F59E0B]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center justify-between bg-[#241c11] px-4 py-3">
                        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F59E0B]">Director Bonus Report</span>
                        <span className="rounded-[2px] bg-[#F59E0B] px-2 py-1 text-[10px] font-bold text-[#0D0D0D]">0 Records</span>
                    </div>
                    <div className="p-10 text-center text-sm text-[#F5E6C8]/55">No director bonus records available.</div>
                </div>
            </div>
        </div>
    );
};

export default DirectorBonus;
