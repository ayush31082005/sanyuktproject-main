import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, TrendingUp, Zap, Shield, Star, Activity,
    BarChart2, ArrowLeftRight, Clock, Info, CheckCircle, CheckCircle2, 
    AlertCircle, X, PackageSearch, Loader2
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

// ─── Config per package type ─────────────────────────────────────────────────
const CONFIG = {
    silver: {
        label: 'Silver Yield',
        packageKey: '599',
        price: '₹599',
        bv: '250 BV',
        pv: '0.25 PV',
        capping: '₹2,000',
        icon: Shield,
        color: 'from-[#1A1A1A] to-[#0D0D0D]',
        glow: 'shadow-gold-900/10',
        text: 'text-[#D7DCE2]',
        muted: 'text-[#C9D1D9]',
        bg: 'bg-[#0D0D0D]',
        accentBg: 'bg-[#D7DCE2]',
        emoji: '🥈',
    },
    gold: {
        label: 'Gold Yield',
        packageKey: '1299',
        price: '₹1,299',
        bv: '500 BV',
        pv: '0.5 PV',
        capping: '₹4,000',
        icon: Star,
        color: 'from-[#C8A96A]/20 to-[#0D0D0D]',
        glow: 'shadow-[#C8A96A]/20',
        text: 'text-[#D4AF37]',
        muted: 'text-[#E7CF84]',
        bg: 'bg-[#0D0D0D]',
        accentBg: 'bg-[#D4AF37]',
        emoji: '🥇',
    },
    diamond: {
        label: 'Diamond Yield',
        packageKey: '2699',
        price: '₹2,699',
        bv: '1000 BV',
        pv: '1 PV',
        capping: '₹10,000',
        icon: Zap,
        color: 'from-[#D4AF37]/30 to-[#0D0D0D]',
        glow: 'shadow-[#D4AF37]/30',
        text: 'text-[#7DD3FC]',
        muted: 'text-[#BAE6FD]',
        bg: 'bg-[#0D0D0D]',
        accentBg: 'bg-[#7DD3FC]',
        emoji: '💎',
    },
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon, badge, delay, cfg }) => {
    const IconComponent = icon;
    return (
    <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="luxury-box p-6 flex flex-col justify-between hover:scale-[1.02] transition-all group"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/30 flex items-center justify-center ${cfg?.text || 'text-[#C8A96A]'} group-hover:border-[#C8A96A]/70 transition-colors`}>
                {IconComponent && <IconComponent className="w-5 h-5" strokeWidth={1.5} />}
            </div>
            {badge && (
                <span className={`px-3 py-1 rounded-full bg-[#C8A96A]/8 text-[11px] font-black uppercase tracking-[0.14em] border border-[#C8A96A]/30 ${cfg?.text || 'text-[#C8A96A]'}`}>
                    {badge}
                </span>
            )}
        </div>
        <div>
            <p className="text-3xl font-serif font-bold text-[#F5E6C8] tracking-tight mb-1">{value}</p>
            <p className={`text-[13px] font-black uppercase tracking-[0.12em] ${cfg?.muted || 'text-[#C8A96A]'}`}>{label}</p>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#C8A96A]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </Motion.div>
    );
};

const TransactionDetailModal = ({ isOpen, onClose, transaction, cfg }) => {
    if (!transaction) return null;

    const details = [
        { label: 'Transaction Hash', value: `#MB-${transaction._id.slice(-8)}`, icon: Shield },
        { label: 'Timestamp', value: new Date(transaction.date).toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }), icon: Clock },
        { label: 'Matched Yield', value: `${transaction.matchedPV} PV`, icon: ArrowLeftRight },
        { label: 'Bonus Accrued', value: `₹${transaction.bonusAmount.toLocaleString()}`, icon: TrendingUp },
        { label: 'Manifest', value: transaction.description || 'Matching bonus for binary lattice volume.', icon: Info },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0"
                    />
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-md luxury-box shadow-2xl overflow-hidden"
                    >
                        <div className={`h-32 bg-gradient-to-br ${cfg.color} p-8 flex items-end justify-between relative`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/10 blur-2xl rounded-full -mr-12 -mt-12" />
                            <div className="relative z-10">
                                <p className="text-[#F5E6C8]/70 text-[11px] font-black uppercase tracking-[0.3em] mb-1">Settlement Verified</p>
                                <h2 className="text-5xl font-serif font-bold text-[#F5E6C8] tracking-tighter leading-none">₹{transaction.bonusAmount.toLocaleString()}</h2>
                            </div>
                            <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 border border-[#C8A96A]/20 flex items-center justify-center rounded-full hover:bg-[#C8A96A]/10 transition">
                                <X className="w-4 h-4 text-[#C8A96A]" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                {details.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-5 group">
                                        <div className="w-10 h-10 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A]/40 group-hover:text-[#C8A96A] group-hover:border-[#C8A96A]/40 transition-all shrink-0">
                                            <item.icon className="w-4 h-4" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-[#C8A96A]/50 uppercase tracking-[0.2em] mb-0.5">{item.label}</p>
                                            <p className="text-sm font-bold text-[#F5E6C8] leading-relaxed italic">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="pt-6 flex items-center gap-3">
                                <div className="flex-1 flex items-center gap-3 px-5 py-3 bg-[#C8A96A]/5 border border-[#C8A96A]/20 rounded-2px">
                                    <CheckCircle className="w-4 h-4 text-[#C8A96A]" strokeWidth={2.5} />
                                    <span className="text-[11px] font-black text-[#C8A96A] uppercase tracking-[0.2em]">Credited to Vault</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="luxury-button h-12 px-8 text-xs"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const MatchingBonusPage = ({ type }) => {
    const navigate = useNavigate();
    const cfg = CONFIG[type] || CONFIG.silver;
    const Icon = cfg.icon;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTx, setSelectedTx] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/mlm/matching-bonus/${type}`);
                setData(res.data.data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load data');
                toast.error('Failed to sync bonus data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [type]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-[#C8A96A] animate-spin mx-auto mb-4" />
                <p className="text-[#C8A96A] text-[13px] font-black uppercase tracking-[0.12em]">Synchronizing Records...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0D0D0D]">
            <Motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="luxury-box p-12 text-center max-w-md w-full shadow-gold-900/20 shadow-2xl"
            >
                <div className="w-20 h-20 bg-[#C8A96A]/5 border border-[#C8A96A]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#C8A96A]">
                    <AlertCircle className="w-10 h-10" strokeWidth={1} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#F5E6C8] mb-4 uppercase tracking-widest leading-tight">Access Denied</h2>
                <p className="text-[#F5E6C8] font-bold mb-10 leading-relaxed italic text-[15px]">{error}</p>
                <button onClick={() => navigate(-1)} className="luxury-button w-full h-14">Return to Sanctuary</button>
            </Motion.div>
        </div>
    );

    const {
        totalEarned = 0,
        thisMonth = 0,
        todayEarned = 0,
        cappingUsed = 0,
        cappingLimit = 0,
        carryForwardBV = 0,
        leftBV = 0,
        rightBV = 0,
        personalPV = 0,
        matchedPV = 0,
        userHasPackage = false,
        history = [],
    } = data || {};

    const cappingPct = cappingLimit > 0 ? Math.min((cappingUsed / cappingLimit) * 100, 100) : 0;

    return (
        <div className="min-h-screen bg-[#0D0D0D] pb-24 font-sans selection:bg-[#C8A96A]/30">
            {/* ── Detail Modal ── */}
            <TransactionDetailModal 
                isOpen={!!selectedTx} 
                onClose={() => setSelectedTx(null)} 
                transaction={selectedTx} 
                cfg={cfg}
            />

            {/* ── Header Decoration ── */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#C8A96A]/5 to-transparent pointer-events-none" />

            <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <Motion.button 
                            whileHover={{ x: -4 }}
                            onClick={() => navigate(-1)}
                            className="w-12 h-12 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5 flex items-center justify-center text-[#C8A96A] hover:bg-[#C8A96A]/10 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Motion.button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-3xl">{cfg.emoji}</span>
                                <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#F5E6C8] uppercase tracking-tight leading-none">{cfg.label}</h1>
                            </div>
                            <p className={`text-[13px] md:text-lg font-black uppercase tracking-[0.16em] ${cfg.text}`}>{cfg.price} Package · Daily Cap {cfg.capping}</p>
                        </div>
                    </div>
                    <div className="luxury-box px-6 py-4 flex items-center gap-4 shadow-gold-900/20">
                        <div className={`p-3 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl text-[#C8A96A]`}>
                            <Icon className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className={`text-[12px] font-black uppercase tracking-[0.16em] leading-tight mb-1 ${cfg.muted}`}>Elevation Status</p>
                            <p className={`text-sm font-bold ${userHasPackage ? 'text-[#C8A96A]' : 'text-white/20'} uppercase tracking-widest`}>
                                {userHasPackage ? 'Fully Manifested' : 'Pending Activation'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Main Stats Dashboard ── */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 text-[#F5E6C8]">
                    {/* Primary Large Card */}
                    <Motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`md:col-span-2 relative luxury-box p-8 overflow-hidden shadow-gold-900/20 shadow-2xl transition-all duration-700 hover:shadow-gold-900/40`}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A96A]/5 blur-[80px] rounded-full -mr-16 -mt-16 -z-10" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-[11px] font-black text-[#C8A96A]/50 uppercase tracking-[0.3em] mb-1">Internal Merit Balance</p>
                                    <h4 className="text-6xl font-serif font-bold tracking-tighter text-[#F5E6C8]">{personalPV.toLocaleString()} <span className="text-xl text-[#C8A96A]/60 font-sans">PV</span></h4>
                                </div>
                                <div className="p-4 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl shadow-2xl">
                                    <Icon className="w-8 h-8 text-[#C8A96A]" strokeWidth={1} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0D0D0D] border border-[#C8A96A]/10 rounded-xl p-5 hover:border-[#C8A96A]/30 transition-colors">
                                    <p className="text-[11px] text-[#C8A96A]/50 uppercase tracking-widest font-black mb-1">Carry Yield</p>
                                    <p className="text-2xl font-bold text-[#F5E6C8]">{carryForwardBV.toLocaleString()} <span className="text-sm opacity-40 font-medium">BV</span></p>
                                </div>
                                <div className="bg-[#0D0D0D] border border-[#C8A96A]/10 rounded-xl p-5 hover:border-[#C8A96A]/30 transition-colors">
                                    <p className="text-[11px] text-[#C8A96A]/50 uppercase tracking-widest font-black mb-1">Matched Accumulation</p>
                                    <p className="text-2xl font-bold text-[#F5E6C8]">{matchedPV.toLocaleString()} <span className="text-sm opacity-40 font-medium">PV</span></p>
                                </div>
                            </div>
                        </div>
                    </Motion.div>

                    {/* Secondary Stat Cards */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard delay={0.1} label="Cumulative Yield" value={`₹${totalEarned.toLocaleString()}`} icon={TrendingUp} badge="Manifested" cfg={cfg} />
                        <StatCard delay={0.2} label="Diurnal Output" value={`₹${todayEarned.toLocaleString()}`} icon={Activity} badge="Live" cfg={cfg} />
                        <StatCard delay={0.3} label="Lunar Cycle Total" value={`₹${thisMonth.toLocaleString()}`} icon={BarChart2} badge="Active" cfg={cfg} />
                        <StatCard delay={0.4} label="Binary Lattice Match" value={`${matchedPV} PV`} icon={ArrowLeftRight} badge="Lattice" cfg={cfg} />
                    </div>
                </div>

                {/* ── Operational Insights ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    
                    {/* Capping Progress */}
                    <Motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="luxury-box p-8 flex flex-col shadow-gold-900/20 shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl flex items-center justify-center text-[#C8A96A]">
                                <Zap className="w-5 h-5" strokeWidth={1} />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-[#F5E6C8] uppercase tracking-widest">Earning Ceiling</h3>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="relative w-40 h-40 mx-auto mb-10">
                                <svg className="w-full h-full rotate-[-90deg]">
                                    <circle cx="80" cy="80" r="72" fill="none" stroke="#C8A96A" strokeOpacity="0.05" strokeWidth="6" />
                                    <Motion.circle 
                                        cx="80" cy="80" r="72" fill="none" stroke="#C8A96A" strokeWidth="6" 
                                        strokeDasharray="452"
                                        initial={{ strokeDashoffset: 452 }}
                                        whileInView={{ strokeDashoffset: 452 - (452 * cappingPct) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-serif font-bold text-[#F5E6C8] tracking-tighter">{cappingPct.toFixed(0)}%</span>
                                    <span className="text-[11px] font-black text-[#C8A96A]/50 uppercase tracking-[0.3em] mt-1">Utilized</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#C8A96A]/50 font-black uppercase tracking-[0.2em] text-[10px]">Manifested Today</span>
                                    <span className="text-[#F5E6C8] font-bold">₹{cappingUsed.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#C8A96A]/50 font-black uppercase tracking-[0.2em] text-[10px]">Diurnal Limit</span>
                                    <span className="text-[#F5E6C8] font-bold">₹{cappingLimit.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-[#C8A96A]/10 flex justify-between items-center">
                                    <span className="text-[#C8A96A]/50 font-black uppercase tracking-[0.2em] text-[10px]">Available Ceiling</span>
                                    <span className="text-[#C8A96A] font-bold text-sm">₹{Math.max(0, cappingLimit - todayEarned).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </Motion.div>

                    {/* Binary Comparison */}
                    <Motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 luxury-box p-8 shadow-gold-900/20 shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl flex items-center justify-center text-[#C8A96A]">
                                <ArrowLeftRight className="w-5 h-5" strokeWidth={1} />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-[#F5E6C8] uppercase tracking-widest">Lattice Symmetry</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            {/* Left Leg */}
                            <div className="relative">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[11px] text-[#C8A96A]/50 font-black uppercase tracking-[0.2em] mb-1">Lateral Node (L)</p>
                                <h4 className="text-4xl font-bold text-[#F5E6C8] tracking-tight">{leftBV.toLocaleString()} <span className={`text-base ${cfg.muted} font-bold`}>BV</span></h4>
                                    </div>
                                    <span className="text-[11px] font-black text-[#C8A96A]/40 tracking-widest">{(leftBV / Math.max(leftBV + rightBV, 1) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#C8A96A]/5 rounded-full overflow-hidden border border-[#C8A96A]/10">
                                    <Motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(leftBV / Math.max(leftBV + rightBV, 1)) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full bg-gradient-to-r from-[#C8A96A]/20 to-[#C8A96A] rounded-full`}
                                    />
                                </div>
                                <div className="mt-6 p-5 bg-[#0D0D0D] rounded-xl border border-[#C8A96A]/10">
                                    <p className="text-[10px] font-black text-[#C8A96A]/50 uppercase tracking-[0.2em] mb-1">Strategic Insight</p>
                                    <p className="text-xs font-medium text-[#F5E6C8]/70 italic leading-relaxed">
                                        {leftBV < rightBV ? "Cultivate lateral node (L) to maximize binary manifest." : "Lateral performance is optimal. Sustain node integrity."}
                                    </p>
                                </div>
                            </div>
                            {/* Right Leg */}
                            <div className="relative">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[11px] text-[#C8A96A]/50 font-black uppercase tracking-[0.2em] mb-1">Lateral Node (R)</p>
                                <h4 className="text-4xl font-bold text-[#F5E6C8] tracking-tight">{rightBV.toLocaleString()} <span className={`text-base ${cfg.muted} font-bold`}>BV</span></h4>
                                    </div>
                                    <span className="text-[11px] font-black text-[#C8A96A]/40 tracking-widest">{(rightBV / Math.max(leftBV + rightBV, 1) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#C8A96A]/5 rounded-full overflow-hidden border border-[#C8A96A]/10">
                                    <Motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(rightBV / Math.max(leftBV + rightBV, 1)) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full bg-gradient-to-r from-[#C8A96A]/20 to-[#C8A96A] rounded-full`}
                                    />
                                </div>
                                <div className="mt-6 p-5 bg-[#0D0D0D] rounded-xl border border-[#C8A96A]/10">
                                    <p className="text-[10px] font-black text-[#C8A96A]/50 uppercase tracking-[0.2em] mb-1">Strategic Insight</p>
                                    <p className="text-xs font-medium text-[#F5E6C8]/70 italic leading-relaxed">
                                        {rightBV < leftBV ? "Cultivate lateral node (R) to maximize binary manifest." : "Lateral performance is optimal. Sustain node integrity."}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 pt-8 border-t border-[#C8A96A]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A]/40">
                                    <Info className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <p className="text-xs text-[#C8A96A]/40 font-bold uppercase tracking-widest italic leading-relaxed">Network lattice updates in real-time correlation.</p>
                            </div>
                             <div className="text-center sm:text-right">
                                <p className="text-[11px] font-black text-[#C8A96A]/50 uppercase tracking-[0.3em] mb-1">Carry Manifest</p>
                                <p className="text-2xl font-serif font-bold text-[#F5E6C8]">{carryForwardBV.toLocaleString()} <span className="text-sm font-sans font-medium text-[#C8A96A]/60 tracking-tight">BV</span></p>
                            </div>
                        </div>
                    </Motion.div>
                </div>

                {/* ── Transaction History ── */}
                <Motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="luxury-box shadow-gold-900/20 shadow-2xl overflow-hidden"
                >
                    <div className="px-8 py-6 border-b border-[#C8A96A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-[#121212]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl flex items-center justify-center text-[#C8A96A]">
                                <Clock className="w-6 h-6" strokeWidth={1} />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-[#F5E6C8] uppercase tracking-widest">Yield Chronicles</h3>
                                <p className={`text-[12px] font-black uppercase tracking-[0.1em] mt-0.5 ${cfg.muted}`}>{history.length} Manifested Cycles</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-1.5 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5">
                            <Activity className="w-3.5 h-3.5 text-[#C8A96A] animate-pulse" />
                            <span className="text-[7px] font-black text-[#C8A96A] uppercase tracking-[0.3em]">Quantum Sync Active</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse">
                            <thead className="bg-[#121212] border-b border-[#C8A96A]/10">
                                <tr>
                                    {['Identifier', 'Timestamp', 'Matched Volume', 'Bonus Accrued', 'Manifest Status', 'Details'].map(h => (
                                        <th key={h} className={`px-8 py-5 text-left text-[13px] font-black uppercase tracking-[0.12em] ${cfg.muted}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#C8A96A]/5">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-24 text-center">
                                            <div className="w-16 h-16 bg-[#C8A96A]/5 border border-[#C8A96A]/10 rounded-full flex items-center justify-center mx-auto mb-5 text-[#C8A96A]/20">
                                                <Clock className="w-8 h-8" strokeWidth={1} />
                                            </div>
                                            <p className="text-xs font-serif font-bold text-[#F5E6C8] uppercase tracking-widest mb-1">Chronicles Empty</p>
                                            <p className="text-[9px] text-[#C8A96A]/40 font-black uppercase tracking-[0.2em]">Initiate network expansion to manifest yields.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((row) => (
                                        <tr 
                                            key={row._id} 
                                            onClick={() => setSelectedTx(row)}
                                            className="hover:bg-[#C8A96A]/5 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-8 py-6">
                                                <span className="text-[13px] font-black text-[#F5E6C8] tracking-[0.08em]">#MB-{row._id.slice(-8).toUpperCase()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#F5E6C8]">{new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                    <span className={`text-[12px] font-black uppercase tracking-[0.08em] mt-0.5 ${cfg.muted}`}>{new Date(row.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${cfg.accentBg}`} />
                                                    <span className="text-sm font-bold text-[#F5E6C8]">{row.matchedPV} PV</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-base font-serif font-bold text-[#C8A96A] tracking-tighter">₹{row.bonusAmount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-[#C8A96A]/10 text-[#C8A96A] rounded-full border border-[#C8A96A]/30 w-fit">
                                                    <CheckCircle className="w-3 h-3" />
                                                    <span className="text-[11px] font-black uppercase tracking-[0.08em]">Credited</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className={`flex items-center gap-2.5 text-[12px] font-black uppercase tracking-[0.1em] ${cfg.muted} group-hover:text-[#F5E6C8] transition-all`}>
                                                    Inspect
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Motion.div>
            </div>
        </div>
    );
};

export default MatchingBonusPage;
