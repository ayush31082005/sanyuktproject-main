import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Trophy, Target, TrendingUp, Award, 
    CheckCircle2, Lock, Star, Shield, Zap, Activity, Info 
} from 'lucide-react';
import api from '../api';

const RANKS = [
    { name: "Bronze", matchPV: 5, reward: "Company Catalog", color: "#B87333", accent: "orange" },
    { name: "Silver", matchPV: 25, reward: "₹1,200", color: "#C0C0C0", accent: "slate" },
    { name: "Gold", matchPV: 50, reward: "₹2,500", color: "#D4AF37", accent: "amber" },
    { name: "Platinum", matchPV: 100, reward: "₹5,000 + NT", color: "#E5E4E2", accent: "slate" },
    { name: "Star", matchPV: 200, reward: "₹10,000 + NT", color: "#7C3AED", accent: "violet" },
    { name: "Ruby", matchPV: 500, reward: "₹50,000", color: "#DC2626", accent: "red" },
    { name: "Sapphire", matchPV: 1000, reward: "₹1 Lakh + India Trip", color: "#2563EB", accent: "blue" },
    { name: "Star Sapphire", matchPV: 2500, reward: "₹5 Lakh + India Trip (Couple)", color: "#0EA5E9", accent: "sky" },
    { name: "Emerald", matchPV: 6000, reward: "₹7 Lakh", color: "#059669", accent: "emerald" },
    { name: "Diamond", matchPV: 30000, reward: "₹10 Lakh", color: "#F8FAFC", accent: "slate" },
    { name: "Double Diamond", matchPV: 70000, reward: "₹15 Lakh", color: "#E2E8F0", accent: "slate" },
    { name: "Blue Diamond", matchPV: 125000, reward: "₹30 Lakh", color: "#93C5FD", accent: "blue" },
    { name: "Ambassador", matchPV: 300000, reward: "₹1 Crore", color: "#A78BFA", accent: "purple" },
    { name: "Crown", matchPV: 700000, reward: "₹2.5 Crore", color: "#FCD34D", accent: "amber" },
    { name: "MD", matchPV: 1500000, reward: "₹5 Crore", color: "#EF4444", accent: "red" },
];

const StatCard = ({ label, value, icon, isPoints }) => {
    const IconComponent = icon;
    return (
        <div className="bg-[#1A1A1A] border border-[#C8A96A]/20 rounded-[2rem] p-5 shadow-sm flex flex-col justify-between hover:border-[#C8A96A] hover:bg-[#1A1A1A]/80 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-[#C8A96A]/10 text-[#C8A96A] border border-[#C8A96A]/20 shadow-sm`}>
                    {IconComponent && <IconComponent className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
            </div>
            <div>
                <p className="text-xl md:text-2xl font-black text-[#F5E6C8] tracking-tighter leading-none mb-1 uppercase">
                    {value}{isPoints && <span className="text-[10px] ml-1 text-[#C8A96A]/60 uppercase">PV</span>}
                </p>
                <p className="text-[9px] md:text-[10px] font-bold text-[#C8A96A]/80 uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
};

const MyRank = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/mlm/get-stats')
            .then(res => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const matchedPV = Number(stats?.matchedPV || 0);
    const personalPV = Number(stats?.pv || 0);
    const currentRankName = stats?.rank || 'Member';
    const currentRankIdx = RANKS.findIndex(r => r.name === currentRankName);
    const nextRank = RANKS[currentRankIdx + 1] || null;
    const progressPct = nextRank ? Math.min((matchedPV / nextRank.matchPV) * 100, 100) : 100;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
            <div className="text-center">
                <div className="w-14 h-14 border-4 border-[#1A1A1A] border-t-[#C8A96A] rounded-full mb-6 mx-auto animate-spin" />
                <p className="text-[#C8A96A]/60 font-bold uppercase text-[10px] tracking-[0.2em]">Analyzing Achievements...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0D0D0D] pb-20 relative overflow-x-hidden overflow-y-visible">
            {/* ── Background Blobs ── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#C8A96A]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-[#C8A96A]/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 p-4 md:p-8 max-w-5xl mx-auto">
                {/* ── Header ── */}
                <div className="flex items-center gap-6 mb-8 md:mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center border border-[#C8A96A]/20 shadow-lg text-[#C8A96A] hover:bg-[#1A1A1A]/80 hover:border-[#C8A96A]/40 transition-all font-bold"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-[#F5E6C8] uppercase tracking-tighter leading-none mb-1">My Rank</h1>
                        <p className="text-[10px] text-[#C8A96A]/60 font-black uppercase tracking-[0.2em]">Lifetime Achievement Journey</p>
                    </div>
                </div>

                {/* ── Current Rank Hero Card ── */}
                <div
                    className="bg-[#1A1A1A] border border-[#C8A96A]/30 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl shadow-[#C8A96A]/5 mb-10 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] opacity-50 z-0"></div>
                    <div className="relative z-10">
                        {/* Rank Identification */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-10 border-b border-[#C8A96A]/20 pb-6 md:pb-10">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0D0D0D] shadow-xl rounded-[1.5rem] md:rounded-[2rem] flex items-center border border-[#C8A96A]/30 justify-center shrink-0 group-hover:border-[#C8A96A] transition-all">
                                    <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[#C8A96A]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] md:text-[11px] font-black text-[#C8A96A]/80 uppercase tracking-widest mb-1">Current Achievement</p>
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase truncate leading-none text-[#F5E6C8]">{currentRankName}</h2>
                                </div>
                            </div>
                            <div className="bg-[#0D0D0D] px-6 py-4 rounded-2xl md:rounded-3xl border border-[#C8A96A]/20">
                                <p className="text-[10px] md:text-[11px] font-black text-[#C8A96A]/70 uppercase tracking-widest mb-1">Total Matched PV</p>
                                <p className="text-3xl md:text-4xl font-black tracking-tighter text-[#C8A96A] tabular-nums leading-none">{matchedPV.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        {/* Progress Bar Area */}
                        {nextRank ? (
                            <div className="bg-[#0D0D0D] p-5 md:p-6 rounded-[1.75rem] md:rounded-[2rem] border border-[#C8A96A]/20">
                                <div className="flex justify-between items-end mb-4">
                                    <div className="min-w-0">
                                        <p className="text-[10px] md:text-[11px] font-black text-[#C8A96A]/80 uppercase tracking-widest mb-2">Next Target: <span style={{color: nextRank.color}}>{nextRank.name}</span></p>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-[#C8A96A]" />
                                            <p className="text-sm font-bold truncate text-[#F5E6C8]">
                                                <span className="font-black">{(nextRank.matchPV - matchedPV).toLocaleString('en-IN')} PV</span> more to go
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <p className="text-2xl font-black text-[#C8A96A] tabular-nums leading-none">{(progressPct || 0).toFixed(1)}%</p>
                                        <p className="text-[10px] font-black text-[#C8A96A]/60 uppercase tracking-widest mt-1">Progress</p>
                                    </div>
                                </div>
                                <div className="h-3 md:h-4 w-full bg-[#1A1A1A] rounded-full overflow-hidden border border-[#C8A96A]/10">
                                    <div
                                        style={{ width: `${progressPct}%` }}
                                        className="h-full bg-gradient-to-r from-[#8A7342] to-[#C8A96A] rounded-full transition-all duration-1000"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 bg-[#0D0D0D] rounded-[2rem] border border-[#C8A96A]/20 text-center">
                                <Star className="w-8 h-8 text-[#C8A96A] mx-auto mb-2 animate-bounce" />
                                <h3 className="text-xl font-black uppercase text-[#C8A96A] tracking-widest">Ultimate Rank Achieved: MD</h3>
                            </div>
                        )}

                        <div className="mt-6 flex items-center gap-2.5 px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/10 rounded-xl w-fit">
                            <Info className="w-4 h-4 text-[#C8A96A] shrink-0" />
                            <p className="text-[9px] font-black uppercase tracking-[0.05em] leading-tight text-[#F5E6C8]/80">Equal matching PV required on Left & Right legs</p>
                        </div>
                    </div>
                </div>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                    <StatCard
                        label="Personal PV" isPoints
                        value={personalPV.toLocaleString('en-IN')}
                        icon={Shield} 
                    />
                    <StatCard
                        label="Matching Bonus"
                        value={`₹${Number(stats?.totalMatchingBonus || 0).toLocaleString('en-IN')}`}
                        icon={TrendingUp} 
                    />
                    <StatCard
                        label="Direct Income"
                        value={`₹${Number(stats?.totalDirectIncome || 0).toLocaleString('en-IN')}`}
                        icon={Zap} 
                    />
                    <StatCard
                        label="Level Income"
                        value={`₹${Number(stats?.totalLevelIncome || 0).toLocaleString('en-IN')}`}
                        icon={Award} 
                    />
                </div>

                {/* ── Rank Journey Timeline ── */}
                <div className="bg-[#1A1A1A] rounded-[2rem] md:rounded-[2.5rem] border border-[#C8A96A]/20 shadow-xl overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-[#C8A96A]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#0D0D0D] rounded-2xl border border-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] shrink-0">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#F5E6C8] uppercase tracking-tight">The Rank Journey</h3>
                                <p className="text-[10px] text-[#C8A96A]/60 font-bold uppercase tracking-widest">Achieve milestones, unlock rewards</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#0D0D0D] rounded-xl border border-[#C8A96A]/10 self-start md:self-auto">
                            <Activity className="w-3.5 h-3.5 text-[#C8A96A]" />
                            <span className="text-[9px] font-black text-[#C8A96A] uppercase tracking-widest">Unlock Status</span>
                        </div>
                    </div>

                    <div className="p-4 md:p-8 overflow-x-auto">
                        <div className="space-y-4 min-w-[680px] md:min-w-0">
                            {RANKS.filter(rank => matchedPV < rank.matchPV).map((rank) => {
                                const isNext = nextRank?.name === rank.name;

                                return (
                                    <div
                                        key={rank.name}
                                        className={`flex items-center gap-4 p-5 rounded-[1.75rem] border transition-all duration-300 ${isNext ? 'bg-[#0D0D0D] border-[#C8A96A] shadow-xl' : 'bg-[#1A1A1A] border-[#C8A96A]/10 hover:border-[#C8A96A]/30 hover:bg-[#151515]'}`}
                                    >
                                        <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center border ${isNext ? 'bg-[#C8A96A]/10 border-[#C8A96A]/30 text-[#C8A96A]' : 'bg-[#0D0D0D] border-[#C8A96A]/10 text-[#C8A96A]/40'}`}>
                                            <Lock className="w-4 h-4 md:w-5 md:h-5 " />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="text-lg md:text-xl font-black tracking-tight uppercase text-[#C8A96A]">
                                                    {rank.name}
                                                </h4>
                                                {isNext && (
                                                    <span className="px-3 py-1 bg-[#C8A96A] text-[#0D0D0D] text-[8px] font-black uppercase tracking-widest rounded-full">
                                                        Target
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Target className="w-3.5 h-3.5 text-[#C8A96A]/60" />
                                                <p className="text-[10px] md:text-[11px] font-black text-[#C8A96A]/80 uppercase tracking-widest leading-none">Req: {rank.matchPV.toLocaleString()} PV</p>
                                            </div>
                                        </div>

                                        <div className="text-right flex flex-col items-end gap-1">
                                            <p className="text-[8px] font-black text-[#C8A96A]/60 uppercase tracking-[0.2em]">Benefit</p>
                                            <div className="px-5 py-2 rounded-xl text-xs font-black tracking-tight uppercase bg-[#0D0D0D] text-[#C8A96A] border border-[#C8A96A]/20">
                                                {rank.reward}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRank;
