import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion as Motion } from 'framer-motion';
import {
    Wallet, CreditCard, PieChart, ShoppingBag,
    TrendingUp, Users, UserCheck, Activity,
    Target, CheckCircle2, Zap,
    TrendingDown, Gem, Award, Trophy
} from 'lucide-react';
import api from '../api';

import ProfileBanner from '../components/ProfileBanner';

const cardThemes = {
    amber: { bg: '#fff7ed', border: '#fed7aa', iconBg: '#ffedd5', icon: '#ea580c', label: '#9a3412', value: '#0f172a', progressBg: '#ffedd5' },
    blue: { bg: '#eff6ff', border: '#bfdbfe', iconBg: '#dbeafe', icon: '#2563eb', label: '#1d4ed8', value: '#0f172a', progressBg: '#dbeafe' },
    emerald: { bg: '#f0fdf4', border: '#bbf7d0', iconBg: '#dcfce7', icon: '#16a34a', label: '#15803d', value: '#0f172a', progressBg: '#dcfce7' },
    rose: { bg: '#fff1f2', border: '#fecdd3', iconBg: '#ffe4e6', icon: '#e11d48', label: '#be123c', value: '#0f172a', progressBg: '#ffe4e6' },
    violet: { bg: '#f5f3ff', border: '#ddd6fe', iconBg: '#ede9fe', icon: '#7c3aed', label: '#6d28d9', value: '#0f172a', progressBg: '#ede9fe' },
    cyan: { bg: '#ecfeff', border: '#a5f3fc', iconBg: '#cffafe', icon: '#0891b2', label: '#0e7490', value: '#0f172a', progressBg: '#cffafe' },
    lime: { bg: '#f7fee7', border: '#d9f99d', iconBg: '#ecfccb', icon: '#65a30d', label: '#4d7c0f', value: '#0f172a', progressBg: '#ecfccb' },
    slate: { bg: '#f8fafc', border: '#cbd5e1', iconBg: '#e2e8f0', icon: '#475569', label: '#334155', value: '#0f172a', progressBg: '#e2e8f0' }
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const SectionHeader = ({ title, subtitle, icon: Icon }) => (
    <div className="mb-6 mt-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
            {Icon && (
                <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Icon size={18} />
                </div>
            )}
            <div>
                <h2 className="mb-2 text-[16px] font-black uppercase leading-none tracking-[0.2em] text-[#C8A96A]">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F5E6C8]/60">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
        <div className="mx-6 hidden h-px flex-1 bg-slate-100 md:block"></div>
    </div>
);

const ModernWalletCard = ({
    title,
    value,
    icon: Icon,
    progress,
    showCurrency = true,
    theme = cardThemes.amber,
    titleClassName = '',
    valueBlockClassName = ''
}) => (
    <Motion.div
        variants={cardVariants}
        className="rounded-2xl border px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1"
        style={{ backgroundColor: theme.bg, borderColor: theme.border }}
    >
        <div className="flex items-center gap-3">
            <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: theme.iconBg, color: theme.icon }}
            >
                {Icon && <Icon size={18} />}
            </div>

            <div className="min-w-0 flex-1 pr-2 text-left">
                <h3
                    className={`max-w-[120px] text-[12px] font-black uppercase leading-[1.15] tracking-[0.12em] ${titleClassName}`}
                    style={{ color: theme.label }}
                >
                    {title}
                </h3>
            </div>

            <div
                className={`ml-auto min-w-[58px] shrink-0 border-l pl-3 text-right ${valueBlockClassName}`}
                style={{ borderColor: theme.border }}
            >
                <div className="flex items-baseline justify-end gap-1.5">
                    {showCurrency && <span className="text-[1.45rem] font-black" style={{ color: theme.icon }}>Rs</span>}
                    <span className="text-[2.15rem] font-black leading-none tracking-tight" style={{ color: theme.value }}>
                        {value !== undefined ? value : '0'}
                    </span>
                </div>
            </div>
        </div>

        {progress !== undefined && (
            <div className="relative mt-2.5 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: theme.progressBg }}>
                <Motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{ backgroundColor: theme.icon }}
                ></Motion.div>
            </div>
        )}
    </Motion.div>
);

const BusinessMatrixCard = ({ title, lValue, rValue, icon: Icon, theme = cardThemes.slate }) => (
    <Motion.div
        variants={cardVariants}
        className="rounded-2xl border p-4 shadow-[0_10px_28px_rgba(0,0,0,0.16)]"
        style={{ backgroundColor: theme.bg, borderColor: theme.border }}
    >
        <div className="mb-4 flex items-start gap-3">
            <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: theme.iconBg, color: theme.icon }}
            >
                {Icon && <Icon size={20} />}
            </div>
            <div className="flex-1 text-left">
                <h3 className="text-[12px] font-black uppercase leading-tight tracking-[0.12em]" style={{ color: theme.label }}>
                    {title}
                </h3>
            </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3">
            <div className="rounded-xl border p-3 text-left" style={{ backgroundColor: theme.iconBg, borderColor: theme.border }}>
                <span className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ color: theme.label }}>Left</span>
                <span className="mt-1 block text-[1.75rem] font-black leading-none tracking-tight" style={{ color: theme.value }}>
                    {lValue !== undefined ? lValue : 0}
                </span>
            </div>
            <div className="rounded-xl border p-3 text-right" style={{ backgroundColor: '#ffffffaa', borderColor: theme.border }}>
                <span className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ color: theme.label }}>Right</span>
                <span className="mt-1 block text-[1.75rem] font-black leading-none tracking-tight" style={{ color: theme.value }}>
                    {rValue !== undefined ? rValue : 0}
                </span>
            </div>
        </div>
    </Motion.div>
);

const recentActivities = [
    { id: 1, user: 'Saurabh Mehra', action: 'achieved Silver Rank', time: '10:24 AM', date: 'Today', icon: Award, color: 'bg-[#C8A96A]/10 text-[#C8A96A]' },
    { id: 2, user: 'Priya Sharma', action: 'joined the network', time: '09:12 AM', date: 'Today', icon: UserCheck, color: 'bg-orange-500/10 text-orange-500' },
    { id: 3, user: 'John Doe', action: 'purchased Household Pack', time: 'Yesterday', date: 'Yesterday', icon: ShoppingBag, color: 'bg-blue-500/10 text-blue-500' },
    { id: 4, user: 'Amit Kumar', action: 'earned Matching Bonus', time: 'Yesterday', date: 'Yesterday', icon: Zap, color: 'bg-[#C8A96A]/20 text-[#C8A96A]' }
];

const DashboardOverview = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        let user;
        try {
            const userStr = localStorage.getItem('user');
            user = userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            console.error('Error parsing user data from localStorage:', e);
            user = null;
        }
        setUserData(user);

        const fetchStats = async () => {
            try {
                const res = await api.get('mlm/get-stats');
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching MLM stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#C8A96A]"></div>
            </div>
        );
    }

    if (!userData) return null;

    return (
        <div className="mx-auto min-h-screen max-w-[1600px] overflow-hidden bg-[#0D0D0D] px-4 pb-12 pt-0 font-['Inter',sans-serif] text-white sm:mx-0 sm:overflow-visible md:px-8">
            <div className="mb-8">
                <ProfileBanner userData={userData} />
            </div>

            <Motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-10 px-4 sm:px-0"
            >
                <div>
                    <SectionHeader title="Financial Overview" subtitle="Real-time Wallets & Earnings" icon={Wallet} />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <ModernWalletCard
                            title="Wallet Balance"
                            value={Number(stats?.walletBalance || 0).toFixed(2)}
                            icon={Wallet}
                            theme={cardThemes.amber}
                        />
                        <ModernWalletCard
                            title="Total PV"
                            value={Number(stats?.pv || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })}
                            icon={CreditCard}
                            showCurrency={false}
                            theme={cardThemes.blue}
                        />
                        <ModernWalletCard
                            title="Total BV"
                            value={Number(stats?.bv || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })}
                            icon={PieChart}
                            showCurrency={false}
                            theme={cardThemes.emerald}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="flex flex-col gap-6 lg:col-span-8">
                        <SectionHeader title="Network Growth" subtitle="Team Performance & Directs" icon={Users} />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <ModernWalletCard
                                title="Right Count"
                                value={Number(stats?.totalRight || 0).toString()}
                                icon={Users}
                                showCurrency={false}
                                theme={cardThemes.rose}
                            />
                            <ModernWalletCard
                                title="Active Directs"
                                value={Number(stats?.directCount || 0).toString()}
                                icon={UserCheck}
                                showCurrency={false}
                                theme={cardThemes.violet}
                            />
                            <ModernWalletCard
                                title="Total Downline"
                                value={Number(stats?.totalDownline || 0).toString()}
                                icon={TrendingUp}
                                showCurrency={false}
                                theme={cardThemes.cyan}
                                titleClassName="max-w-[90px] text-[10px]"
                                valueBlockClassName="min-w-[64px] pl-4"
                            />
                            <ModernWalletCard
                                title="Left Count"
                                value={Number(stats?.totalLeft || 0).toString()}
                                icon={TrendingDown}
                                showCurrency={false}
                                theme={cardThemes.lime}
                            />
                        </div>

                        <div className="mt-4 flex flex-col gap-5 rounded-[2rem] border border-[#fed7aa] bg-[#fff7ed] p-5 text-slate-900 shadow-[0_12px_32px_rgba(0,0,0,0.18)] md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                <div className="rounded-2xl border border-[#fed7aa] bg-[#ffedd5] p-3">
                                    <ShoppingBag size={24} className="text-[#ea580c]" />
                                </div>
                                <div className="flex min-w-0 flex-col">
                                    <span className="mb-1 text-[12px] font-black uppercase tracking-[0.2em] text-[#9a3412]">Total Product Purchases</span>
                                    <h4 className="flex flex-wrap items-baseline gap-2 break-all text-3xl font-black tracking-tighter md:text-4xl">
                                        <span className="text-[#c2410c]">Rs</span>
                                        <span className="text-slate-900">
                                            {Number(stats?.productPurchases || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })}
                                        </span>
                                    </h4>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/my-account/orders')}
                                className="w-full shrink-0 rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#c2410c] md:w-auto"
                            >
                                View Details
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <SectionHeader title="PV Goals" subtitle="Daily & Lifetime Status" icon={Target} />
                        <div className="flex h-full flex-col gap-4">
                            <ModernWalletCard
                                title="Today PV Points"
                                value={`${Number(stats?.dailyPV?.current || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })} / ${Number(stats?.dailyPV?.target || 320)}`}
                                icon={Zap}
                                showCurrency={false}
                                progress={(Number(stats?.dailyPV?.current || 0) / Number(stats?.dailyPV?.target || 320)) * 100}
                                theme={cardThemes.amber}
                            />
                            <ModernWalletCard
                                title="Total PV Points"
                                value={`${Number(stats?.lifetimePV?.current || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })} / ${Number(stats?.lifetimePV?.target || 10200)}`}
                                icon={Trophy}
                                showCurrency={false}
                                progress={(Number(stats?.lifetimePV?.current || 0) / Number(stats?.lifetimePV?.target || 10200)) * 100}
                                theme={cardThemes.blue}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <SectionHeader title="Business Matrix" subtitle="Team Volume & Rank Status" icon={Gem} />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <BusinessMatrixCard
                            title="PV Left / Right"
                            lValue={Number(stats?.pvLeft || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })}
                            rValue={Number(stats?.pvRight || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })}
                            icon={Target}
                            theme={cardThemes.amber}
                        />
                        <BusinessMatrixCard
                            title="Total PV L / R"
                            lValue={Number(stats?.totalPvLeft || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })}
                            rValue={Number(stats?.totalPvRight || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })}
                            icon={Activity}
                            theme={cardThemes.blue}
                        />
                        <BusinessMatrixCard
                            title="Silver L / R"
                            lValue={Number(stats?.currentSilverLeft || 0).toString()}
                            rValue={Number(stats?.currentSilverRight || 0).toString()}
                            icon={CheckCircle2}
                            theme={cardThemes.slate}
                        />
                        <BusinessMatrixCard
                            title="Total Silver L / R"
                            lValue={Number(stats?.totalSilverLeft || 0).toString()}
                            rValue={Number(stats?.totalSilverRight || 0).toString()}
                            icon={CheckCircle2}
                            theme={cardThemes.cyan}
                        />
                        <BusinessMatrixCard
                            title="Gold L / R"
                            lValue={Number(stats?.currentGoldLeft || 0).toString()}
                            rValue={Number(stats?.currentGoldRight || 0).toString()}
                            icon={Award}
                            theme={cardThemes.lime}
                        />
                        <BusinessMatrixCard
                            title="Total Gold L / R"
                            lValue={Number(stats?.totalGoldLeft || 0).toString()}
                            rValue={Number(stats?.totalGoldRight || 0).toString()}
                            icon={Award}
                            theme={cardThemes.rose}
                        />
                        <BusinessMatrixCard
                            title="Diamond L / R"
                            lValue={Number(stats?.currentDiamondLeft || 0).toString()}
                            rValue={Number(stats?.currentDiamondRight || 0).toString()}
                            icon={Gem}
                            theme={cardThemes.violet}
                        />
                        <BusinessMatrixCard
                            title="Total Diamond L / R"
                            lValue={Number(stats?.totalDiamondLeft || 0).toString()}
                            rValue={Number(stats?.totalDiamondRight || 0).toString()}
                            icon={Gem}
                            theme={cardThemes.emerald}
                        />
                    </div>
                </div>

                <div>
                    <SectionHeader title="Recent Activity" subtitle="Network Live Updates" icon={Activity} />
                    <Motion.div
                        variants={cardVariants}
                        className="relative h-[380px] overflow-hidden rounded-[2rem] border border-white/5 bg-[#1A1A1A] p-4 shadow-[0_20px_60px_rgb(0,0,0,0.5)]"
                    >
                        <div className="absolute left-0 top-0 z-10 h-12 w-full bg-gradient-to-b from-[#1A1A1A] to-transparent"></div>
                        <div className="absolute bottom-0 left-0 z-10 h-12 w-full bg-gradient-to-t from-[#1A1A1A] to-transparent"></div>

                        <Motion.div
                            animate={{ y: [0, -400] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="flex flex-col"
                        >
                            {[...recentActivities, ...recentActivities].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={`${item.id}-${index}`}
                                        className="group flex cursor-pointer items-center justify-between border-b border-white/5 px-6 py-5 transition-all hover:bg-white/5"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-105 ${item.color}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-[14px] font-black leading-tight text-white">
                                                    {item.user} <span className="font-semibold text-slate-400">{item.action}</span>
                                                </div>
                                                <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors group-hover:text-[#0A7A2F]">
                                                    Activity Log ID: #REF-{item.id}024
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <div className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                                                {item.time}
                                            </div>
                                            <div className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                                                {item.date}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Motion.div>
                    </Motion.div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-10 md:flex-row">
                    <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <div>System Log: <span className="text-[#C8A96A]">Online</span></div>
                        <div className="hidden h-1.5 w-1.5 rounded-full bg-slate-800 md:block"></div>
                        <div className="hidden md:block">Update Frequency: <span className="text-white">Real-time</span></div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-600">Powered by</span>
                        <span className="rounded-lg border border-[#C8A96A]/10 bg-[#C8A96A]/5 px-3 py-1.5 text-[#C8A96A]">Sanyukt Executive</span>
                    </div>
                </div>
            </Motion.div>
        </div>
    );
};

export default DashboardOverview;
