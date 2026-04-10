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
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 overflow-hidden flex flex-col h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.15em] mb-1">{title}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Records: {filteredData.length}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">#</th>
                            {type === 'income' ? (
                                <>
                                    <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                                </>
                            ) : (
                                <>
                                    <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member ID</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                                    <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </>
                            )}
                            <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
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
                                <td colSpan="6" className="py-20 text-center text-slate-400 font-bold uppercase text-[12px] tracking-widest">
                                    No records found
                                </td>
                            </tr>
                        ) : (
                            currentData.map((item, idx) => (
                                <tr key={item.userId || idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-4 text-[12px] font-bold text-slate-500">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                                    {type === 'income' ? (
                                        <>
                                            <td className="py-4 px-4 text-[12px] font-bold text-slate-900">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                                            <td className="py-4 px-4">
                                                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-widest">{item.type}</span>
                                            </td>
                                            <td className="py-4 px-4 text-[12px] font-black text-slate-900">Rs {Number(item.amount || 0).toFixed(2)}</td>
                                            <td className="py-4 px-4 text-[12px] font-bold text-slate-500">{item.fromUserId?.userName || 'System'}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="py-4 px-4 text-[12px] font-black text-slate-900">{item.memberId}</td>
                                            <td className="py-4 px-4 text-[12px] font-bold text-slate-900">{item.userName}</td>
                                            <td className="py-4 px-4 text-[12px] font-bold text-slate-500">{item.rank}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.activeStatus ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.activeStatus ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        {item.activeStatus ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    <td className="py-4 px-4">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title={item.position ? `Position: ${item.position}` : 'View'}>
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            className="p-2 border border-slate-100 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            className="p-2 border border-slate-100 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all"
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
