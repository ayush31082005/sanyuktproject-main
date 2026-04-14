import React, { useEffect, useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

const resolveDataArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.directs)) return payload.directs;
    if (Array.isArray(payload?.team)) return payload.team;
    if (Array.isArray(payload?.users)) return payload.users;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

const normalizeItem = (item) => ({
    ...item,
    userId: item?.userId || item?._id || null,
    memberId: item?.memberId || '-',
    userName: item?.userName || item?.name || '-',
    rank: item?.rank || 'Member',
    activeStatus: Boolean(item?.activeStatus),
    position: item?.position || null,
    sponsorId: item?.sponsorId || null,
});

const UserTable = ({ title, type, endpoint }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                let sourceEndpoint = endpoint || 'mlm/get-stats';

                if (sourceEndpoint.startsWith('/')) {
                    sourceEndpoint = sourceEndpoint.substring(1);
                }

                const res = await api.get(sourceEndpoint);
                const nextData = resolveDataArray(res.data).map(normalizeItem);
                setData(nextData);
            } catch (err) {
                console.error(`Error fetching ${title}:`, err);
                toast.error(`Failed to load ${title}`);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, title, type]);

    useEffect(() => {
        setPage(1);
    }, [search, data.length]);

    const filteredData = useMemo(() => {
        const needle = search.trim().toLowerCase();
        if (!needle) return data;

        return data.filter((item) =>
            Object.values(item).some((value) =>
                String(value ?? '').toLowerCase().includes(needle)
            )
        );
    }, [data, search]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const currentData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="rounded-[2rem] border border-[#c8a96a]/14 bg-[#1a1a1a] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)] overflow-hidden flex flex-col h-full sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-[14px] font-black text-[#f5e6c8] uppercase tracking-[0.15em] mb-1">{title}</h2>
                    <p className="text-[10px] font-bold text-[#c8a96a]/65 uppercase tracking-widest">Total Records: {filteredData.length}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c8a96a]/55" size={16} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-[#c8a96a]/14 bg-[#111111] pl-10 pr-4 py-2 text-sm text-[#f5e6c8] placeholder:text-[#f5e6c8]/30 focus:outline-none focus:ring-2 focus:ring-[#c8a96a]/20 md:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3 md:hidden">
                {loading ? (
                    <div className="flex min-h-[220px] items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c8a96a]"></div>
                    </div>
                ) : currentData.length === 0 ? (
                    <div className="min-h-[220px] rounded-2xl border border-dashed border-[#c8a96a]/14 px-4 py-12 text-center text-[#f5e6c8]/55 font-bold uppercase text-[12px] tracking-widest">
                        No records found
                    </div>
                ) : (
                    currentData.map((item, idx) => (
                        <div key={item.userId || idx} className="rounded-2xl border border-[#c8a96a]/12 bg-[#151515] p-4 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div className="text-[11px] font-black uppercase tracking-widest text-[#c8a96a]/65">
                                    Record {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                </div>
                                <button className="rounded-lg p-2 text-[#c8a96a]/60 transition-colors hover:bg-[#1d1d1d]" title={item.position ? `Position: ${item.position}` : 'View'}>
                                    <FileText size={16} />
                                </button>
                            </div>
                            {type === 'income' ? (
                                <div className="space-y-2 text-[12px]">
                                    <div className="flex justify-between gap-3"><span className="font-bold text-[#f5e6c8]/60">Date</span><span className="text-right font-bold text-[#f5e6c8]">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</span></div>
                                    <div className="flex justify-between gap-3"><span className="font-bold text-[#f5e6c8]/60">Type</span><span className="rounded bg-[#c8a96a]/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#c8a96a]">{item.type}</span></div>
                                    <div className="flex justify-between gap-3"><span className="font-bold text-[#f5e6c8]/60">Amount</span><span className="text-right font-black text-[#f5e6c8]">Rs {Number(item.amount || 0).toFixed(2)}</span></div>
                                    <div className="flex justify-between gap-3"><span className="font-bold text-[#f5e6c8]/60">Source</span><span className="text-right font-bold text-[#f5e6c8]">{item.fromUserId?.userName || 'System'}</span></div>
                                </div>
                            ) : (
                                <div className="space-y-2 text-[12px]">
                                    <div className="flex justify-between gap-3"><span className="font-bold text-[#f5e6c8]/60">Member ID</span><span className="text-right font-black text-[#f5e6c8]">{item.memberId}</span></div>
                                    <div className="flex justify-between gap-3"><span className="font-bold text-[#f5e6c8]/60">Name</span><span className="text-right font-bold text-[#f5e6c8]">{item.userName}</span></div>
                                    <div className="flex justify-between gap-3"><span className="font-bold text-[#f5e6c8]/60">Rank</span><span className="text-right font-bold text-[#f5e6c8]">{item.rank}</span></div>
                                    <div className="flex justify-between gap-3"><span className="font-bold text-[#f5e6c8]/60">Status</span><span className={`text-right text-[10px] font-black uppercase tracking-widest ${item.activeStatus ? 'text-[#c8a96a]' : 'text-[#f5e6c8]/45'}`}>{item.activeStatus ? 'Active' : 'Inactive'}</span></div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="hidden md:block flex-1 overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#c8a96a]/10">
                            <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">#</th>
                            {type === 'income' ? (
                                <>
                                    <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">Date</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">Type</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">Amount</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">Source</th>
                                </>
                            ) : (
                                <>
                                    <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">Member ID</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">Name</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">Rank</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">Status</th>
                                </>
                            )}
                            <th className="pb-4 px-4 text-[10px] font-black text-[#c8a96a]/65 uppercase tracking-widest">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-20 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                                </td>
                            </tr>
                        ) : currentData.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-20 text-center text-[#f5e6c8]/55 font-bold uppercase text-[12px] tracking-widest">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, idx) => (
                                <tr key={item.userId || idx} className="border-b border-[#c8a96a]/8 transition-colors hover:bg-[#161616]">
                                    <td className="py-4 px-4 text-[12px] font-bold text-[#f5e6c8]/55">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                                    {type === 'income' ? (
                                        <>
                                            <td className="py-4 px-4 text-[12px] font-bold text-[#f5e6c8]">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                                            <td className="py-4 px-4">
                                                <span className="rounded bg-[#c8a96a]/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#c8a96a]">{item.type}</span>
                                            </td>
                                            <td className="py-4 px-4 text-[12px] font-black text-[#f5e6c8]">Rs {Number(item.amount || 0).toFixed(2)}</td>
                                            <td className="py-4 px-4 text-[12px] font-bold text-[#f5e6c8]/65">{item.fromUserId?.userName || 'System'}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-4 px-4 text-[12px] font-black text-[#f5e6c8]">{item.memberId}</td>
                                            <td className="py-4 px-4 text-[12px] font-bold text-[#f5e6c8]">{item.userName}</td>
                                            <td className="py-4 px-4 text-[12px] font-bold text-[#f5e6c8]/65">{item.rank}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${item.activeStatus ? 'bg-[#c8a96a]' : 'bg-[#f5e6c8]/30'}`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.activeStatus ? 'text-[#c8a96a]' : 'text-[#f5e6c8]/45'}`}>
                                                        {item.activeStatus ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    <td className="py-4 px-4">
                                        <button className="rounded-lg p-2 text-[#c8a96a]/60 transition-colors hover:bg-[#1d1d1d]" title={item.position ? `Position: ${item.position}` : 'View'}>
                                            <FileText size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-[#c8a96a]/65 uppercase tracking-widest">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            className="rounded-lg border border-[#c8a96a]/14 p-2 text-[#f5e6c8] transition-all hover:bg-[#161616] disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            className="rounded-lg border border-[#c8a96a]/14 p-2 text-[#f5e6c8] transition-all hover:bg-[#161616] disabled:opacity-50"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
