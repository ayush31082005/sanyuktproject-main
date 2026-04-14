import React, { useState } from 'react';

const LeadershipFund = () => {
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
        'rounded-[2px] border border-[#8B5CF6]/20 bg-[#111111] px-3 py-2 text-sm text-[#F5E6C8] outline-none focus:border-[#8B5CF6]';

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#0D0D0D] px-2 py-4 text-white sm:px-3 sm:py-6 md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-5 hidden items-start justify-start md:mb-6 md:flex md:justify-end">
                    <div className="min-w-0 text-left md:text-right">
                        <h1 className="break-words text-[1.45rem] font-black leading-tight text-[#F5E6C8] sm:text-[1.7rem] md:text-[2.05rem]">
                            Leadership Fund Report
                        </h1>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#8B5CF6]/55">
                            Welcome back {userName}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-[1fr_1fr] lg:gap-5">
                    <div className="overflow-hidden rounded-[2px] border border-[#8B5CF6]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                        <div className="bg-[#1f182a] px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#8B5CF6]">Search Criteria</div>
                        <form className="p-3 text-[12px] text-[#F5E6C8]/75 sm:p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                                <label className="inline-flex items-center gap-2"><input type="radio" checked={searchMode === 'all'} onChange={() => setSearchMode('all')} accentColor="#8B5CF6" />All Record</label>
                                <label className="inline-flex items-center gap-2"><input type="radio" checked={searchMode === 'between'} onChange={() => setSearchMode('between')} accentColor="#8B5CF6" />Between Dates</label>
                            </div>
                            {searchMode === 'between' && (
                                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className={inputClassName} />
                                    <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className={inputClassName} />
                                </div>
                            )}
                            <button className="mt-4 inline-flex w-full items-center justify-center rounded-[2px] bg-[#8B5CF6] px-4 py-3 text-[12px] font-black uppercase tracking-[0.12em] text-white sm:w-auto">Search &gt;&gt;</button>
                        </form>
                    </div>
                    <div className="flex min-h-[110px] items-center justify-center rounded-[2px] border border-[#8B5CF6]/35 bg-[linear-gradient(135deg,#211339_0%,#8b5cf6_55%,#c4b5fd_100%)] px-4 py-4 text-center shadow-[0_14px_40px_rgba(0,0,0,0.35)] sm:min-h-[160px] sm:px-6 sm:py-8">
                        <div><div className="text-[1.9rem] font-light leading-none text-white sm:text-[3.4rem]">Rs</div><div className="mt-1 break-all text-[1.9rem] font-light leading-none tracking-tight text-white sm:mt-2 sm:text-[3.25rem]">0.00</div></div>
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-[2px] border border-[#8B5CF6]/20 bg-[#171717] shadow-[0_14px_40px_rgba(0,0,0,0.35)] md:mt-10">
                    <div className="flex flex-col gap-3 bg-[#1f182a] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="break-words text-[11px] font-black uppercase tracking-[0.18em] text-[#8B5CF6]">Leadership Fund Report</span>
                        <span className="w-fit rounded-[2px] bg-[#8B5CF6] px-2 py-1 text-[10px] font-bold text-white">0 Records</span>
                    </div>
                    <div className="p-6 text-center text-sm text-[#F5E6C8]/55 sm:p-10">No leadership fund records available.</div>
                </div>
            </div>
        </div>
    );
};

export default LeadershipFund;
