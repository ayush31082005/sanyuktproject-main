import React, { useEffect, useMemo, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import api from '../api';

const EmptySlot = ({ label }) => (
    <div className="flex min-w-[180px] flex-col items-center opacity-60">
        <div className="h-6 w-px bg-[#c8a96a]/50"></div>
        <div className="rounded-xl border border-dashed border-[#c8a96a]/28 bg-[#1a1a1a] px-4 py-3 text-center shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#c8a96a]/65">{label}</div>
            <div className="mt-1 text-[12px] font-bold text-[#f5e6c8]/78">Empty</div>
        </div>
    </div>
);

const TreeNode = ({ node, depth = 0 }) => {
    if (!node) return null;

    const hasChildren = Boolean(node.left || node.right);

    return (
        <div className="inline-flex flex-col items-center">
            <div
                className={`rounded-2xl border px-4 py-3 shadow-[0_14px_28px_rgba(0,0,0,0.28)] ${
                    depth === 0
                        ? 'border-[#7fb3d3] bg-[linear-gradient(180deg,#69a6c8_0%,#5e9fc4_100%)]'
                        : 'border-[#c8a96a]/18 bg-[#171717]'
                }`}
            >
                <div className="min-w-[180px] text-center">
                    <div
                        className={`text-[11px] font-black uppercase tracking-[0.16em] ${
                            depth === 0 ? 'text-[#eef7ff]' : 'text-[#c8a96a]'
                        }`}
                    >
                        {depth === 0 ? 'Root User' : 'Member'}
                    </div>
                    <div className={`mt-1 text-[14px] font-black ${depth === 0 ? 'text-white' : 'text-[#f5e6c8]'}`}>
                        {node.name || 'Unnamed User'}
                    </div>
                    <div className={`mt-1 text-[11px] font-bold ${depth === 0 ? 'text-[#e6f4ff]' : 'text-[#c8a96a]/82'}`}>
                        {node.memberId || node.userId}
                    </div>
                </div>
            </div>

            {hasChildren && (
                <>
                    <div className="h-8 w-px bg-[#c8a96a]/55"></div>
                    <div className="relative flex items-start justify-center gap-8 px-4">
                        <div className="absolute left-1/2 top-0 h-px w-[calc(100%-120px)] -translate-x-1/2 bg-[#c8a96a]/55"></div>

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
        <div className="flex min-h-[600px] flex-col overflow-hidden rounded-[2rem] border border-[#c8a96a]/16 bg-[#151515] p-8 shadow-[0_24px_50px_rgba(0,0,0,0.34)]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="mb-1 text-[14px] font-black uppercase tracking-[0.15em] text-[#f5e6c8]">Genealogy Tree</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#c8a96a]">Live binary tree from your MLM data</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))}
                        className="rounded-lg border border-[#c8a96a]/14 bg-[#1b1b1b] p-2 text-[#c8a96a] transition-colors hover:bg-[#222222]"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <button
                        onClick={() => setZoom((value) => Math.min(2, value + 0.1))}
                        className="rounded-lg border border-[#c8a96a]/14 bg-[#1b1b1b] p-2 text-[#c8a96a] transition-colors hover:bg-[#222222]"
                    >
                        <ZoomIn size={18} />
                    </button>
                    <button
                        onClick={() => setZoom(1)}
                        className="rounded-lg border border-[#c8a96a]/14 bg-[#1b1b1b] p-2 text-[#c8a96a] transition-colors hover:bg-[#222222]"
                    >
                        <Maximize size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl border border-[#c8a96a]/12 bg-[radial-gradient(circle_at_top,#5f5f5f_0%,#5a5a5a_45%,#565656_100%)] p-6">
                {loading ? (
                    <div className="flex min-h-[420px] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ffffff33] border-t-[#c8a96a]"></div>
                    </div>
                ) : error ? (
                    <div className="flex min-h-[420px] items-center justify-center">
                        <div className="rounded-2xl border border-[#f26164]/30 bg-[#2b1718] px-6 py-5 text-center">
                            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#f26164]">Tree Unavailable</div>
                            <div className="mt-2 text-sm font-bold text-[#ffd6d6]">{error}</div>
                        </div>
                    </div>
                ) : !tree ? (
                    <div className="flex min-h-[420px] items-center justify-center">
                        <div className="rounded-2xl border border-[#c8a96a]/22 bg-[#171717] px-6 py-5 text-center">
                            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[#c8a96a]">No Tree Data</div>
                            <div className="mt-2 text-sm font-bold text-[#f5e6c8]/80">No genealogy data found for this user.</div>
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
