import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const BinaryTreeView = () => {
    const [zoom, setZoom] = useState(1);

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50 overflow-hidden min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.15em] mb-1">Genealogy Tree</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual representation of your network</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                        <ZoomOut size={18} />
                    </button>
                    <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                        <ZoomIn size={18} />
                    </button>
                    <button onClick={() => setZoom(1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                        <Maximize size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-50/30 rounded-2xl border border-slate-50">
                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-200 flex justify-center">
                    <img
                        src="/tree.png?v=20260409a"
                        alt="Genealogy Tree"
                        className="max-w-full h-auto rounded-2xl border border-slate-200 shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default BinaryTreeView;
