import React, { useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { API_URL } from '../api';

const NewsDetailsModal = ({ isOpen, onClose, news }) => {
    if (!news) return null;

    // Build the image URL - handle both absolute and relative paths
    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/600x400";
        if (url.startsWith('http')) return url;
        // Handle path consistency
        const path = url.startsWith('/uploads') ? url : `/uploads/${url}`;
        return API_URL + path;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Today";
        const d = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return "Today";
        } else if (d.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    // Prevent background scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-6 pt-32 md:pt-40">
                    {/* Backdrop */}
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-[680px] max-h-[76vh] bg-[#171717] rounded-[22px] shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col border border-[#C8A96A]/12"
                    >
                        {/* Close Button - More Premium */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-[110] p-2 bg-black/55 backdrop-blur-md hover:bg-[#C8A96A] hover:text-[#111111] rounded-full text-white shadow-xl transition-all duration-300 group hover:scale-110 active:scale-95 border border-white/10"
                        >
                            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        {/* Modal Header (Integrated Layout) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#171717]">
                            <div className="relative">
                                {/* Featured Image */}
                                <div className="relative h-[130px] md:h-[150px] w-full bg-[#0f0f0f]">
                                    <img
                                        src={getImageUrl(news.image)}
                                        alt={news.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/35 to-transparent" />
                                </div>

                                {/* Header Content Overlaying slightly */}
                                <div className="max-w-4xl mx-auto px-3 md:px-4 -mt-5 relative z-10">
                                    <div className="bg-[#1E1E1E] rounded-[20px] p-3.5 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.24)] border border-[#C8A96A]/12">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3.5 py-1.5 bg-[#C8A96A]/14 text-[#E8C87A] text-[10px] font-black tracking-widest uppercase rounded-xl border border-[#C8A96A]/10">
                                                    {news.category}
                                                </span>
                                            </div>

                                            <h2 className="text-lg md:text-[1.7rem] lg:text-[1.8rem] font-black text-white leading-[1.15]">
                                                {news.title}
                                            </h2>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/8">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-2xl bg-[#C8A96A] text-[#111111] flex items-center justify-center font-black text-sm shadow-lg shrink-0">
                                                        {news.authorAvatar || (news.author ? news.author[0] : 'A')}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-black text-white truncate">{news.author || 'Admin'}</p>
                                                        <p className="text-[10px] text-white/45 font-bold uppercase tracking-wider">Publication Author</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="p-2 bg-black/30 rounded-2xl border border-white/6 shrink-0">
                                                        <Calendar className="w-4 h-4 text-[#C8A96A]" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-black text-white">{formatDate(news.createdAt)}</p>
                                                        <p className="text-[10px] text-white/45 font-bold uppercase tracking-wider">Date Published</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="p-2 bg-black/30 rounded-2xl border border-white/6 shrink-0">
                                                        <Clock className="w-4 h-4 text-[#C8A96A]" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-black text-white">{news.readTime || '5 min read'}</p>
                                                        <p className="text-[10px] text-white/45 font-bold uppercase tracking-wider">Time to Read</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Reading Flow */}
                            <div className="max-w-4xl mx-auto px-4 md:px-5 py-4 md:py-5">
                                <div className="max-w-none">
                                    {news.content ? (
                                        news.content.split('\n').map((para, i) => (
                                            para.trim() && (
                                                <p key={i} className="mb-4 text-white/88 text-[14px] md:text-[15px] leading-7 font-medium">
                                                    {para}
                                                </p>
                                            )
                                        ))
                                    ) : (
                                        <p className="text-white/45 italic">No detailed description available.</p>
                                    )}
                                </div>

                                <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-[#C8A96A]" />
                                        <span className="text-[10px] font-black uppercase tracking-[2px] text-white/45">Section: <span className="text-[#E8C87A] underline decoration-2">{news.category}</span></span>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="group flex items-center gap-2 text-[#E8C87A] font-black text-[11px] uppercase tracking-widest hover:gap-3 transition-all shrink-0"
                                    >
                                        Finish Reading
                                        <div className="w-6 h-6 rounded-full bg-black/35 border border-white/8 flex items-center justify-center group-hover:bg-[#C8A96A] group-hover:text-[#111111] transition-colors">
                                            <X className="w-3 h-3" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewsDetailsModal;
