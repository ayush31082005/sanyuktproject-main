import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronRight, Search, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const TreeNode = ({ node }) => {
    if (!node) return null;

    return (
        <div className="flex flex-col items-center">
            <div className={`p-3 rounded-xl border-2 shadow-sm text-center min-w-[120px] bg-white ${node.rank === 'Member' ? 'border-slate-200' : 'border-emerald-500'
                }`}>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {node.memberId}
                </div>
                <div className="text-[12px] font-bold text-slate-800 truncate">
                    {node.name}
                </div>
                <div className="text-[10px] font-black text-emerald-600 mt-1 uppercase">
                    {node.rank}
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase text-slate-400">L: {node.leftPV}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase text-slate-400">R: {node.rightPV}</span>
                    </div>
                </div>
            </div>

            {node.children && node.children.length > 0 && (
                <div className="flex flex-col items-center w-full">
                    {/* Vertical line from parent to bridge */}
                    <div className="h-4 w-px bg-slate-200"></div>

                    {/* Horizontal bridge line between children */}
                    {node.children.length > 1 && (
                        <div className="w-[50%] h-px bg-slate-200"></div>
                    )}

                    <div className="flex justify-center gap-8 w-full">
                        {node.children.map((child) => (
                            <div key={child.id} className="flex flex-col items-center">
                                {/* Vertical line from bridge to child */}
                                <div className="h-4 w-px bg-slate-200"></div>
                                <TreeNode node={child} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const BinaryTreeView = () => {
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                if (!user) return;

                const res = await api.get(`/mlm/binary-tree/${user._id}`);
                setTreeData(res.data);
            } catch (err) {
                console.error("Error fetching tree data:", err);
                toast.error("Failed to load binary tree");
            } finally {
                setLoading(false);
            }
        };

        fetchTree();
    }, []);

    if (loading) return (
        <div className="p-10 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50 overflow-hidden min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.15em] mb-1">Genealogy Tree</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual representation of your network</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ZoomOut size={18} /></button>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ZoomIn size={18} /></button>
                    <button onClick={() => setZoom(1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><Maximize size={18} /></button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-10 bg-slate-50/30 rounded-2xl border border-slate-50">
                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-200">
                    {treeData ? <TreeNode node={treeData} /> : <div className="text-center text-slate-400">No tree data available</div>}
                </div>
            </div>
        </div>
    );
};

export default BinaryTreeView;
