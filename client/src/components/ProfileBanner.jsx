import React from 'react';
import { motion as Motion } from 'framer-motion';
import {
    Users, Calendar, Copy, Award, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileBanner = ({ userData }) => {
    if (!userData) return null;

    const copyToClipboard = async (text) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }
        toast.success(`Copied to clipboard!`, {
            style: {
                borderRadius: '12px',
                background: '#0f172a',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600'
            },
        });
    };

    const details = [
        { label: "Sponsor ID", value: userData.sponsorId || 'Not Set', icon: Users },
        { label: "Joining Date", value: userData.joinDate ? new Date(userData.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'), icon: Calendar },
        { label: "Current Rank", value: userData.rank || 'Member', icon: Award },
    ];

    const detailThemes = [
        { bg: '#eff6ff', border: '#bfdbfe', iconBg: '#dbeafe', iconColor: '#2563eb', labelColor: '#1d4ed8', valueColor: '#0f172a' },
        { bg: '#f0fdf4', border: '#bbf7d0', iconBg: '#dcfce7', iconColor: '#16a34a', labelColor: '#15803d', valueColor: '#0f172a' },
        { bg: '#fff7ed', border: '#fed7aa', iconBg: '#ffedd5', iconColor: '#ea580c', labelColor: '#c2410c', valueColor: '#0f172a' },
    ];

    return (
        <Motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-[#1A1A1A] rounded-none sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-y border-x-0 sm:border-x border-white/10 overflow-hidden relative"
        >
            {/* Minimalist Top Accent */}
            <div className="h-1 w-full bg-white/10"></div>

            <div className="p-6 lg:p-10 flex flex-col gap-8">
                {/* Tier 1: Identity Focus */}
                <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10">
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-xl border-4 border-[#1A1A1A] ring-1 ring-white/10 bg-slate-800">
                            <img
                                src={userData.profileImage || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&h=400&q=80"}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col text-center md:text-left gap-2 flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <h1 className="text-[2.1rem] lg:text-[3.1rem] font-black text-white tracking-tight uppercase">
                                {userData.userName}
                            </h1>
                        </div>
                        <div className="flex flex-col items-center md:items-start leading-tight space-y-1">
                            <span className="text-[14px] font-black text-[#C8A96A] uppercase tracking-[0.18em]">
                                Premium Membership
                            </span>
                            <span className="text-[13px] font-semibold text-gray-400 tracking-wide">
                                {userData.email}
                            </span>
                            <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <Award size={12} className="text-[#C8A96A]" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.14em] leading-none">
                                    {userData.position || 'Right Wing'} Position
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tier 2: Official Identification */}
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#C8A96A]/10 text-[#C8A96A] border border-[#C8A96A]/20 mb-1">
                            <Shield size={14} className="fill-[#C8A96A]/10" />
                            <span className="text-[10px] font-black uppercase tracking-[0.14em]">{userData.status || 'Verified Member'}</span>
                        </div>
                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.22em]">Member ID</span>
                        <div className="flex items-center gap-3">
                            <span className="text-[1.75rem] lg:text-[2.35rem] font-black text-white tracking-tight">
                                {userData.memberId}
                            </span>
                            <button
                                onClick={() => copyToClipboard(userData.memberId)}
                                className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-[#C8A96A] hover:bg-white/10 hover:shadow-lg transition-all border border-white/10 active:scale-95"
                                title="Copy Member ID"
                            >
                                <Copy size={22} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tier 3: Logistic Details (Clean Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-white/10">
                    {details.map((item, idx) => {
                        const theme = detailThemes[idx % detailThemes.length];

                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-3 rounded-2xl border px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                                style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                            >
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={{ backgroundColor: theme.iconBg, color: theme.iconColor }}
                                >
                                    <item.icon size={17} />
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <div
                                        className="text-[11px] font-black uppercase tracking-[0.12em]"
                                        style={{ color: theme.labelColor }}
                                    >
                                        {item.label}
                                    </div>
                                </div>
                                <div className="ml-auto min-w-0 shrink-0 text-right">
                                    <div
                                        className="truncate text-[17px] md:text-[18px] font-black tracking-tight"
                                        style={{ color: theme.valueColor }}
                                        title={item.value}
                                    >
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5"></div>
        </Motion.div>
    );
};

export default ProfileBanner;
