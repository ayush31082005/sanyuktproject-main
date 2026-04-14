import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Trophy, Target, TrendingUp, Award,
    Lock, Star, Shield, Zap, Activity, Info
} from 'lucide-react';
import api from '../api';

const RANKS = [
    { name: 'Bronze', matchPV: 5, reward: 'Company Catalog', color: '#B87333' },
    { name: 'Silver', matchPV: 25, reward: 'Rs 1,200', color: '#C0C0C0' },
    { name: 'Gold', matchPV: 50, reward: 'Rs 2,500', color: '#D4AF37' },
    { name: 'Platinum', matchPV: 100, reward: 'Rs 5,000 + NT', color: '#E5E4E2' },
    { name: 'Star', matchPV: 200, reward: 'Rs 10,000 + NT', color: '#7C3AED' },
    { name: 'Ruby', matchPV: 500, reward: 'Rs 50,000', color: '#DC2626' },
    { name: 'Sapphire', matchPV: 1000, reward: 'Rs 1 Lakh + India Trip', color: '#2563EB' },
    { name: 'Star Sapphire', matchPV: 2500, reward: 'Rs 5 Lakh + India Trip (Couple)', color: '#0EA5E9' },
    { name: 'Emerald', matchPV: 6000, reward: 'Rs 7 Lakh', color: '#059669' },
    { name: 'Diamond', matchPV: 30000, reward: 'Rs 10 Lakh', color: '#F8FAFC' },
    { name: 'Double Diamond', matchPV: 70000, reward: 'Rs 15 Lakh', color: '#E2E8F0' },
    { name: 'Blue Diamond', matchPV: 125000, reward: 'Rs 30 Lakh', color: '#93C5FD' },
    { name: 'Ambassador', matchPV: 300000, reward: 'Rs 1 Crore', color: '#A78BFA' },
    { name: 'Crown', matchPV: 700000, reward: 'Rs 2.5 Crore', color: '#FCD34D' },
    { name: 'MD', matchPV: 1500000, reward: 'Rs 5 Crore', color: '#EF4444' },
];

const StatCard = ({ label, value, icon, isPoints }) => {
    const IconComponent = icon;
    return (
        <div className="rounded-[1.5rem] border border-[#C8A96A]/20 bg-[#1A1A1A] p-4 shadow-sm transition-all hover:border-[#C8A96A] hover:bg-[#1A1A1A]/80 sm:rounded-[2rem] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl border border-[#C8A96A]/20 bg-[#C8A96A]/10 p-2.5 text-[#C8A96A] shadow-sm">
                    {IconComponent && <IconComponent className="h-5 w-5 md:h-6 md:w-6" />}
                </div>
            </div>
            <div>
                <p className="break-all text-lg font-black uppercase leading-none tracking-tighter text-[#F5E6C8] sm:text-2xl">
                    {value}{isPoints && <span className="ml-1 text-[10px] uppercase text-[#C8A96A]/60">PV</span>}
                </p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#C8A96A]/80 md:text-[10px]">{label}</p>
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
            .then((res) => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const matchedPV = Number(stats?.matchedPV || 0);
    const personalPV = Number(stats?.pv || 0);
    const currentRankName = stats?.rank || 'Member';
    const currentRankIdx = RANKS.findIndex((r) => r.name === currentRankName);
    const nextRank = RANKS[currentRankIdx + 1] || null;
    const progressPct = nextRank ? Math.min((matchedPV / nextRank.matchPV) * 100, 100) : 100;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
                <div className="text-center">
                    <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-[#1A1A1A] border-t-[#C8A96A]" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A96A]/60">Analyzing Achievements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden overflow-y-visible bg-[#0D0D0D] pb-14 sm:pb-20">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute right-[-18%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#C8A96A]/5 blur-[120px] sm:h-[600px] sm:w-[600px]" />
                <div className="absolute bottom-[10%] left-[-8%] h-[360px] w-[360px] rounded-full bg-[#C8A96A]/5 blur-[120px] sm:h-[500px] sm:w-[500px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl px-3 py-4 sm:px-4 md:px-8">
                <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 md:mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] border border-[#C8A96A]/20 bg-[#1A1A1A] font-bold text-[#C8A96A] shadow-lg transition-all hover:border-[#C8A96A]/40 hover:bg-[#1A1A1A]/80 sm:h-12 sm:w-12 sm:rounded-2xl"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="break-words text-[1.8rem] font-black uppercase leading-none tracking-tighter text-[#F5E6C8] sm:text-3xl">
                            My Rank
                        </h1>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#C8A96A]/60">
                            Lifetime Achievement Journey
                        </p>
                    </div>
                </div>

                <div className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-[#C8A96A]/30 bg-[#1A1A1A] p-4 shadow-xl shadow-[#C8A96A]/5 sm:mb-8 sm:rounded-[2rem] sm:p-6 md:mb-10 md:rounded-[2.5rem] md:p-10">
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] opacity-50" />
                    <div className="relative z-10">
                        <div className="mb-5 flex flex-col gap-4 border-b border-[#C8A96A]/20 pb-5 sm:gap-5 sm:pb-6 md:mb-6 md:flex-row md:items-center md:justify-between md:pb-10">
                            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] border border-[#C8A96A]/30 bg-[#0D0D0D] text-[#C8A96A] shadow-xl transition-all group-hover:border-[#C8A96A] sm:h-16 sm:w-16 sm:rounded-[1.5rem] md:h-20 md:w-20 md:rounded-[2rem]">
                                    <Trophy className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                                </div>
                                <div className="min-w-0">
                                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/80 md:text-[11px]">Current Achievement</p>
                                    <h2 className="break-words text-[2rem] font-black uppercase leading-none tracking-tighter text-[#F5E6C8] sm:text-[2.5rem] md:text-5xl">
                                        {currentRankName}
                                    </h2>
                                </div>
                            </div>
                            <div className="w-full rounded-[1.25rem] border border-[#C8A96A]/20 bg-[#0D0D0D] px-5 py-4 sm:w-auto sm:rounded-2xl md:rounded-3xl">
                                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/70 md:text-[11px]">Total Matched PV</p>
                                <p className="break-all text-3xl font-black leading-none tracking-tighter text-[#C8A96A] md:text-4xl">
                                    {matchedPV.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>

                        {nextRank ? (
                            <div className="rounded-[1.5rem] border border-[#C8A96A]/20 bg-[#0D0D0D] p-4 sm:rounded-[1.75rem] sm:p-5 md:rounded-[2rem] md:p-6">
                                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="min-w-0">
                                        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/80 md:text-[11px]">
                                            Next Target: <span style={{ color: nextRank.color }}>{nextRank.name}</span>
                                        </p>
                                        <div className="flex items-start gap-2">
                                            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A96A]" />
                                            <p className="break-words text-sm font-bold text-[#F5E6C8]">
                                                <span className="font-black">{(nextRank.matchPV - matchedPV).toLocaleString('en-IN')} PV</span> more to go
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:ml-4 sm:text-right">
                                        <p className="text-2xl font-black leading-none text-[#C8A96A] md:text-3xl">{(progressPct || 0).toFixed(1)}%</p>
                                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/60">Progress</p>
                                    </div>
                                </div>
                                <div className="h-3 w-full overflow-hidden rounded-full border border-[#C8A96A]/10 bg-[#1A1A1A] md:h-4">
                                    <div
                                        style={{ width: `${progressPct}%` }}
                                        className="h-full rounded-full bg-gradient-to-r from-[#8A7342] to-[#C8A96A] transition-all duration-1000"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[1.5rem] border border-[#C8A96A]/20 bg-[#0D0D0D] py-6 text-center sm:rounded-[2rem]">
                                <Star className="mx-auto mb-2 h-8 w-8 animate-bounce text-[#C8A96A]" />
                                <h3 className="text-lg font-black uppercase tracking-widest text-[#C8A96A] sm:text-xl">Ultimate Rank Achieved: MD</h3>
                            </div>
                        )}

                        <div className="mt-5 flex w-full items-start gap-2.5 rounded-xl border border-[#C8A96A]/10 bg-[#0D0D0D] px-4 py-3 sm:mt-6 sm:w-fit">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A96A]" />
                            <p className="text-[9px] font-black uppercase leading-tight tracking-[0.05em] text-[#F5E6C8]/80">
                                Equal matching PV required on Left & Right legs
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 md:mb-12 md:gap-6">
                    <StatCard
                        label="Personal PV"
                        isPoints
                        value={personalPV.toLocaleString('en-IN')}
                        icon={Shield}
                    />
                    <StatCard
                        label="Matching Bonus"
                        value={`Rs ${Number(stats?.totalMatchingBonus || 0).toLocaleString('en-IN')}`}
                        icon={TrendingUp}
                    />
                    <StatCard
                        label="Direct Income"
                        value={`Rs ${Number(stats?.totalDirectIncome || 0).toLocaleString('en-IN')}`}
                        icon={Zap}
                    />
                    <StatCard
                        label="Level Income"
                        value={`Rs ${Number(stats?.totalLevelIncome || 0).toLocaleString('en-IN')}`}
                        icon={Award}
                    />
                </div>

                <div className="overflow-hidden rounded-[1.75rem] border border-[#C8A96A]/20 bg-[#1A1A1A] shadow-xl sm:rounded-[2rem] md:rounded-[2.5rem]">
                    <div className="flex flex-col gap-4 border-b border-[#C8A96A]/10 p-4 sm:p-6 md:flex-row md:items-center md:justify-between md:p-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.25rem] border border-[#C8A96A]/20 bg-[#0D0D0D] text-[#C8A96A] sm:h-12 sm:w-12 sm:rounded-2xl">
                                <Award className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="break-words text-lg font-black uppercase tracking-tight text-[#F5E6C8]">The Rank Journey</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]/60">Achieve milestones, unlock rewards</p>
                            </div>
                        </div>
                        <div className="self-start rounded-xl border border-[#C8A96A]/10 bg-[#0D0D0D] px-4 py-2 md:self-auto">
                            <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#C8A96A]">
                                <Activity className="h-3.5 w-3.5" />
                                Unlock Status
                            </span>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        <div className="space-y-4">
                            {RANKS.filter((rank) => matchedPV < rank.matchPV).map((rank) => {
                                const isNext = nextRank?.name === rank.name;

                                return (
                                    <div
                                        key={rank.name}
                                        className={`flex flex-col gap-4 rounded-[1.5rem] border p-4 transition-all duration-300 sm:flex-row sm:items-center sm:p-5 ${
                                            isNext
                                                ? 'border-[#C8A96A] bg-[#0D0D0D] shadow-xl'
                                                : 'border-[#C8A96A]/10 bg-[#1A1A1A] hover:border-[#C8A96A]/30 hover:bg-[#151515]'
                                        }`}
                                    >
                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border md:h-14 md:w-14 md:rounded-2xl ${
                                            isNext
                                                ? 'border-[#C8A96A]/30 bg-[#C8A96A]/10 text-[#C8A96A]'
                                                : 'border-[#C8A96A]/10 bg-[#0D0D0D] text-[#C8A96A]/40'
                                        }`}>
                                            <Lock className="h-4 w-4 md:h-5 md:w-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                                <h4 className="text-lg font-black uppercase tracking-tight text-[#C8A96A] md:text-xl">
                                                    {rank.name}
                                                </h4>
                                                {isNext && (
                                                    <span className="rounded-full bg-[#C8A96A] px-3 py-1 text-[8px] font-black uppercase tracking-widest text-[#0D0D0D]">
                                                        Target
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Target className="h-3.5 w-3.5 text-[#C8A96A]/60" />
                                                <p className="text-[10px] font-black uppercase leading-none tracking-widest text-[#C8A96A]/80 md:text-[11px]">
                                                    Req: {rank.matchPV.toLocaleString()} PV
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-left sm:text-right">
                                            <p className="mb-1 text-[8px] font-black uppercase tracking-[0.2em] text-[#C8A96A]/60">Benefit</p>
                                            <div className="inline-flex rounded-xl border border-[#C8A96A]/20 bg-[#0D0D0D] px-4 py-2 text-xs font-black uppercase tracking-tight text-[#C8A96A] sm:px-5">
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
