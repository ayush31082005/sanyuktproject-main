import React, { useEffect, useMemo, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import api from '../api';

const EmptySlot = ({ label }) => (
    <div className="flex min-w-[180px] flex-col items-center opacity-60">
        <div className="h-6 w-px bg-slate-200"></div>
        <div className="rounded-xl border border-dashed border-slate-200 bg-white/80 px-4 py-3 text-center shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</div>
            <div className="mt-1 text-[12px] font-bold text-slate-500">Empty</div>
        </div>
    </div>
);

const TreeNode = ({ node, depth = 0 }) => {
    if (!node) return null;

    const hasChildren = Boolean(node.left || node.right);

    return (
        <div className="inline-flex flex-col items-center">
            <div className={`rounded-2xl border px-4 py-3 shadow-sm ${depth === 0 ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-white'}`}>
                <div className="min-w-[180px] text-center">
                    <div className={`text-[11px] font-black uppercase tracking-[0.16em] ${depth === 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                        {depth === 0 ? 'Root User' : 'Member'}
                    </div>
                    <div className="mt-1 text-[14px] font-black text-slate-900">{node.name || 'Unnamed User'}</div>
                    <div className="mt-1 text-[11px] font-bold text-slate-500">{node.memberId || node.userId}</div>
                </div>
            </div>

            {hasChildren && (
                <>
                    <div className="h-8 w-px bg-slate-300"></div>
                    <div className="relative flex items-start justify-center gap-8 px-4">
                        <div className="absolute left-1/2 top-0 h-px w-[calc(100%-120px)] -translate-x-1/2 bg-slate-300"></div>

                        <div className="flex flex-col items-center">
                            {node.left ? <TreeNode node={node.left} depth={depth + 1} /> : <EmptySlot label="Left" />}
                        </div>

                        <div className="flex flex-col items-center">
                            {node.right ? <TreeNode node={node.right} depth={depth + 1} /> : <EmptySlot label="Right" />}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const BinaryTreeView = () => {
    const [zoom, setZoom] = useState(1);
    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userId = useMemo(() => {
        try {
            const rawUser = localStorage.getItem('user');
            const parsedUser = rawUser ? JSON.parse(rawUser) : null;
            return parsedUser?._id || null;
        } catch (parseError) {
            console.error('Error parsing user for binary tree:', parseError);
            return null;
        }
    }, []);

    useEffect(() => {
        const fetchTree = async () => {
            if (!userId) {
                setError('User session not found. Please login again.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                const res = await api.get(`/mlm/tree/${userId}`);
                setTree(res.data || null);
            } catch (fetchError) {
                console.error('Error fetching binary tree:', fetchError);
                setError(fetchError?.response?.data?.message || 'Failed to load tree data.');
                setTree(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTree();
    }, [userId]);

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50 overflow-hidden min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.15em] mb-1">Genealogy Tree</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live binary tree from your MLM data</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                        <ZoomOut size={18} />
                    </button>
                    <button onClick={() => setZoom((value) => Math.min(2, value + 0.1))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                        <ZoomIn size={18} />
                    </button>
                    <button onClick={() => setZoom(1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                        <Maximize size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-50/30 rounded-2xl border border-slate-50">
                {loading ? (
                    <div className="flex min-h-[420px] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex min-h-[420px] items-center justify-center">
                        <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-5 text-center">
                            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-red-500">Tree Unavailable</div>
                            <div className="mt-2 text-sm font-bold text-red-700">{error}</div>
                        </div>
                    </div>
                ) : !tree ? (
                    <div className="flex min-h-[420px] items-center justify-center">
                        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center">
                            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">No Tree Data</div>
                            <div className="mt-2 text-sm font-bold text-slate-600">No genealogy data found for this user.</div>
                        </div>
                    </div>
                ) : (
                    <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-200 flex justify-center min-w-max pb-6">
                        <TreeNode node={tree} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BinaryTreeView;
