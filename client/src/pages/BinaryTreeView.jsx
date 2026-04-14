import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import api from '../api';

const getMobileTreeZoom = () => {
    if (typeof window === 'undefined') return 1;
    return window.innerWidth < 640 ? 0.52 : 1;
};

const EmptySlot = ({ label }) => (
    <div className="flex min-w-[96px] flex-col items-center opacity-60 sm:min-w-[180px]">
        <div className="h-6 w-px bg-[#c8a96a]/50"></div>
        <div className="rounded-xl border border-dashed border-[#c8a96a]/28 bg-[#1a1a1a] px-2 py-2 text-center shadow-[0_10px_24px_rgba(0,0,0,0.25)] sm:px-4 sm:py-3">
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#c8a96a]/65">{label}</div>
            <div className="mt-1 text-[11px] font-bold text-[#f5e6c8]/78 sm:text-[12px]">Empty</div>
        </div>
    </div>
);

const TreeNode = ({ node, depth = 0 }) => {
    if (!node) return null;

    const hasChildren = Boolean(node.left || node.right);

    return (
        <div className="inline-flex flex-col items-center">
            <div
                className={`rounded-2xl border px-2 py-2 shadow-[0_14px_28px_rgba(0,0,0,0.28)] sm:px-4 sm:py-3 ${
                    depth === 0
                        ? 'border-[#7fb3d3] bg-[linear-gradient(180deg,#69a6c8_0%,#5e9fc4_100%)]'
                        : 'border-[#c8a96a]/18 bg-[#171717]'
                }`}
            >
                <div className="min-w-[96px] text-center sm:min-w-[180px]">
                    <div
                        className={`text-[9px] font-black uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.16em] ${
                            depth === 0 ? 'text-[#eef7ff]' : 'text-[#c8a96a]'
                        }`}
                    >
                        {depth === 0 ? 'Root User' : 'Member'}
                    </div>
                    <div className={`mt-1 text-[10px] font-black sm:text-[14px] ${depth === 0 ? 'text-white' : 'text-[#f5e6c8]'}`}>
                        {node.name || 'Unnamed User'}
                    </div>
                    <div className={`mt-1 text-[9px] font-bold sm:text-[11px] ${depth === 0 ? 'text-[#e6f4ff]' : 'text-[#c8a96a]/82'}`}>
                        {node.memberId || node.userId}
                    </div>
                </div>
            </div>

            {hasChildren && (
                <>
                    <div className="h-8 w-px bg-[#c8a96a]/55"></div>
                    <div className="relative flex items-start justify-center gap-2 px-1 sm:gap-8 sm:px-4">
                        <div className="absolute left-1/2 top-0 h-px w-[calc(100%-48px)] -translate-x-1/2 bg-[#c8a96a]/55 sm:w-[calc(100%-120px)]"></div>

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
    const [zoom, setZoom] = useState(getMobileTreeZoom);
    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : false));
    const viewportRef = useRef(null);
    const contentRef = useRef(null);
    const treeRef = useRef(null);

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
        const handleResize = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!tree || loading) return;

        const fitTreeToViewport = () => {
            if (!viewportRef.current || !treeRef.current) return;

            if (!isMobile) {
                setZoom(1);
                return;
            }

            const viewportWidth = viewportRef.current.clientWidth;
            const contentWidth = treeRef.current.scrollWidth;

            if (!viewportWidth || !contentWidth) return;

            const nextZoom = Math.min(1, Math.max(0.28, (viewportWidth - 12) / contentWidth));
            setZoom(nextZoom);
        };

        const frame = window.requestAnimationFrame(fitTreeToViewport);
        window.addEventListener('resize', fitTreeToViewport);

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener('resize', fitTreeToViewport);
        };
    }, [isMobile, loading, tree]);

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
        <div className="flex min-h-[560px] flex-col overflow-hidden rounded-[2rem] border border-[#c8a96a]/16 bg-[#151515] p-4 shadow-[0_24px_50px_rgba(0,0,0,0.34)] sm:min-h-[600px] sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="mb-1 text-[14px] font-black uppercase tracking-[0.15em] text-[#f5e6c8]">Genealogy Tree</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#c8a96a]">Live binary tree from your MLM data</p>
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                    <button
                        onClick={() => setZoom((value) => Math.max(0.4, value - 0.08))}
                        className="rounded-lg border border-[#c8a96a]/14 bg-[#1b1b1b] p-2 text-[#c8a96a] transition-colors hover:bg-[#222222]"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <button
                        onClick={() => setZoom((value) => Math.min(2, value + 0.08))}
                        className="rounded-lg border border-[#c8a96a]/14 bg-[#1b1b1b] p-2 text-[#c8a96a] transition-colors hover:bg-[#222222]"
                    >
                        <ZoomIn size={18} />
                    </button>
                    <button
                        onClick={() => {
                            if (!isMobile || !viewportRef.current || !treeRef.current) {
                                setZoom(1);
                                return;
                            }

                            const viewportWidth = viewportRef.current.clientWidth;
                            const contentWidth = treeRef.current.scrollWidth;
                            const fitZoom = Math.min(1, Math.max(0.28, (viewportWidth - 12) / contentWidth));
                            setZoom(fitZoom);
                        }}
                        className="rounded-lg border border-[#c8a96a]/14 bg-[#1b1b1b] p-2 text-[#c8a96a] transition-colors hover:bg-[#222222]"
                    >
                        <Maximize size={18} />
                    </button>
                </div>
            </div>

            <div ref={viewportRef} className="flex-1 overflow-auto rounded-2xl border border-[#c8a96a]/12 bg-[radial-gradient(circle_at_top,#5f5f5f_0%,#5a5a5a_45%,#565656_100%)] p-3 sm:p-6">
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
                    <div ref={contentRef} className={`min-w-max pb-6 ${isMobile ? 'inline-block' : 'flex justify-center'}`}>
                        <div
                            ref={treeRef}
                            style={{ transform: `scale(${zoom})`, transformOrigin: isMobile ? 'top left' : 'top center' }}
                            className="transition-transform duration-200"
                        >
                            <TreeNode node={tree} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BinaryTreeView;
