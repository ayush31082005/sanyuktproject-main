import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Search, Zap, Clock, Database, ChevronRight } from 'lucide-react';

const BrowsePlansModal = ({
    isOpen,
    onClose,
    onSelect,
    operator,
    plans = []
}) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const categories = ['All', ...new Set(plans.map(p => p.category))];

    const filteredPlans = plans.filter(plan => {
        const matchesCategory = activeCategory === 'All' || plan.category === activeCategory;
        const matchesSearch = plan.amount.toString().includes(searchQuery) ||
            plan.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <Motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[#1A1A1A] rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#C8A96A]/20"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-[#C8A96A]/10 flex justify-between items-center bg-[#0D0D0D]">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-[#F5E6C8] uppercase tracking-wider">
                                {operator ? `${operator} Plans` : 'Recharge Plans'}
                            </h3>
                            <p className="text-[10px] text-[#C8A96A] font-bold uppercase tracking-widest mt-1 italic">
                                Select a plan to continue
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#0D0D0D] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search & Categories */}
                    <div className="p-6 space-y-4 bg-[#1A1A1A] sticky top-0 z-10 border-b border-[#C8A96A]/10">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A96A]/50" />
                            <input
                                type="text"
                                placeholder="Search by amount or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl text-sm focus:border-[#C8A96A] outline-none transition-all placeholder:text-[#F5E6C8]/20 text-[#F5E6C8] font-medium"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat
                                            ? 'bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] border-[#C8A96A] shadow-lg shadow-gold-900/20'
                                            : 'bg-[#0D0D0D] text-[#C8A96A] border-[#C8A96A]/20 hover:bg-[#C8A96A]/10'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Plans List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan) => (
                                <Motion.button
                                    key={plan.id}
                                    whileHover={{ x: 5 }}
                                    onClick={() => {
                                        onSelect(plan.amount);
                                        onClose();
                                    }}
                                    className="w-full text-left bg-[#1A1A1A] border border-[#C8A96A]/10 rounded-2xl p-5 hover:border-[#C8A96A] transition-all group flex items-center gap-6"
                                >
                                    <div className="flex flex-col items-center justify-center bg-[#C8A96A]/10 rounded-2xl p-3 min-w-[80px] border border-[#C8A96A]/20">
                                        <span className="text-2xl font-bold text-[#C8A96A]">₹{plan.amount}</span>
                                        <span className="text-[9px] font-bold text-[#C8A96A] uppercase tracking-tighter">View Detail</span>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F5E6C8]/40 uppercase tracking-widest">
                                                <Clock className="w-3 h-3 text-[#C8A96A]" />
                                                {plan.validity}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#C8A96A] uppercase tracking-widest">
                                                <Database className="w-3 h-3" />
                                                {plan.data}
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-[#F5E6C8]/70 line-clamp-2 leading-snug">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <ChevronRight className="w-5 h-5 text-[#C8A96A]/30 group-hover:text-[#C8A96A] transition-colors" />
                                </Motion.button>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Search className="w-12 h-12 text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No plans found</p>
                            </div>
                        )}
                    </div>
                </Motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BrowsePlansModal;
