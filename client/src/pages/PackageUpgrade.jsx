import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Package, Shield, Zap, Star, CheckCircle2,
    Wallet, AlertCircle, X, Loader2, CheckCircle, Info
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

// ── Package definitions ───────────────────────────────────────────────────────
const PACKAGES = [
    {
        id: '599',
        name: 'Silver',
        price: 599,
        bv: '250 BV',
        pv: '0.25 PV',
        capping: '₹2,000 / day',
        color: 'from-[#1A1A1A] to-[#0D0D0D]', // Darker base
        borderActive: 'ring-[#C8A96A]',
        badge: 'bg-[#C8A96A]/10 text-[#C8A96A]',
        btnColor: 'luxury-button', // Using global class
        icon: Shield,
        features: [
            '250 Business Volume',
            '0.25 Point Value',
            'Daily Capping ₹2,000',
            'Elite Support',
        ],
    },
    {
        id: '1299',
        name: 'Gold',
        price: 1299,
        bv: '500 BV',
        pv: '0.5 PV',
        capping: '₹4,000 / day',
        color: 'from-[#C8A96A]/20 to-[#0D0D0D]',
        borderActive: 'ring-[#D4AF37]',
        badge: 'bg-[#D4AF37]/10 text-[#D4AF37]',
        btnColor: 'luxury-button',
        icon: Star,
        features: [
            '500 Business Volume',
            '0.5 Point Value',
            'Daily Capping ₹4,000',
            'Priority Concierge',
            'Executive Training',
        ],
    },
    {
        id: '2699',
        name: 'Diamond',
        price: 2699,
        bv: '1000 BV',
        pv: '1 PV',
        capping: '₹10,000 / day',
        color: 'from-[#D4AF37]/30 to-[#0D0D0D]',
        borderActive: 'ring-[#C8A96A]',
        badge: 'bg-[#C8A96A]/20 text-[#C8A96A]',
        btnColor: 'luxury-button',
        icon: Zap,
        features: [
            '1000 Business Volume',
            '1 Point Value',
            'Daily Capping ₹10,000',
            '24/7 Global Support',
            'Masterclass Access',
            'Elite Networking',
        ],
    },
];

// ── Components ───────────────────────────────────────────────────────────────

const FeatureRow = ({ label, silver, gold, diamond, isIcon = false }) => (
    <div className="grid grid-cols-4 py-4 border-b border-[#C8A96A]/10 items-center">
        <div className="text-[11px] sm:text-xs font-black text-[#C8A96A]/60 uppercase tracking-wider">{label}</div>
        <div className="text-center font-bold text-[#F5E6C8] text-sm">
            {isIcon ? (silver ? <CheckCircle2 className="w-5 h-5 text-[#C8A96A] mx-auto" strokeWidth={2.5} /> : <X className="w-5 h-5 text-white/10 mx-auto" />) : silver}
        </div>
        <div className="text-center font-bold text-[#F5E6C8] text-sm">
            {isIcon ? (gold ? <CheckCircle2 className="w-5 h-5 text-[#C8A96A] mx-auto" strokeWidth={2.5} /> : <X className="w-5 h-5 text-white/10 mx-auto" />) : gold}
        </div>
        <div className="text-center font-bold text-[#F5E6C8] text-sm">
            {isIcon ? (diamond ? <CheckCircle2 className="w-5 h-5 text-[#C8A96A] mx-auto" strokeWidth={2.5} /> : <X className="w-5 h-5 text-white/10 mx-auto" />) : diamond}
        </div>
    </div>
);

const ComparisonTable = () => (
    <div className="mt-12 sm:mt-20 mb-12 sm:mb-20 luxury-box p-4 sm:p-10 shadow-3xl">
        <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5E6C8] uppercase tracking-tight mb-3">Elite Comparison</h2>
            <p className="text-[#C8A96A]/60 font-black uppercase text-xs tracking-[0.3em]">Select the plan that fits your ambition</p>
        </div>
        <div className="grid grid-cols-4 pb-4 sm:pb-6 border-b border-[#C8A96A]/30">
            <div className="text-[11px] sm:text-xs font-black text-[#C8A96A] uppercase tracking-wider">Feature</div>
            <div className="text-center text-[11px] sm:text-xs font-black text-[#C8A96A] uppercase tracking-wider">Silver</div>
            <div className="text-center text-[11px] sm:text-xs font-black text-[#C8A96A] uppercase tracking-wider">Gold</div>
            <div className="text-center text-[11px] sm:text-xs font-black text-[#C8A96A] uppercase tracking-wider">Diamond</div>
        </div>
        <FeatureRow label="Price" silver="₹599" gold="₹1299" diamond="₹2699" />
        <FeatureRow label="Team BV" silver="250" gold="500" diamond="1000" />
        <FeatureRow label="Team PV" silver="0.25" gold="0.5" diamond="1" />
        <FeatureRow label="Daily Capping" silver="₹2,000" gold="₹4,000" diamond="₹10,000" />
        <FeatureRow label="Direct Income" silver="₹0" gold="₹50" diamond="₹50" />
        <FeatureRow label="Binary Matching" silver="10%" gold="10%" diamond="10%" />
        <FeatureRow label="Support" silver="Elite" gold="Concierge" diamond="24/7 Global" />
        <FeatureRow label="Training" silver={true} gold={true} diamond={true} isIcon={true} />
        <FeatureRow label="Events" silver={false} gold={true} diamond={true} isIcon={true} />
        <FeatureRow label="Legacy Mentor" silver={false} gold={false} diamond={true} isIcon={true} />
    </div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-[#C8A96A]/10">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 sm:py-6 flex items-center justify-between text-left group gap-4"
            >
                <span className="text-base sm:text-lg font-serif font-bold text-[#F5E6C8] group-hover:text-[#C8A96A] transition-colors uppercase tracking-tight">{question}</span>
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${isOpen ? 'bg-[#C8A96A] text-[#0D0D0D] rotate-180' : 'bg-[#0D0D0D] border border-[#C8A96A]/30 text-[#C8A96A]'}`}>
                    <Star className="w-4 h-4 fill-current" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <Motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 sm:pb-8 text-sm sm:text-base text-[#F5E6C8]/60 font-medium leading-relaxed italic">{answer}</p>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = () => (
    <div className="max-w-4xl mx-auto mb-12 sm:mb-20 px-0 sm:px-4">
        <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#F5E6C8] uppercase tracking-tight mb-4 text-center">Inquiries & Clarity</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent mx-auto rounded-full" />
        </div>
        <div className="space-y-1 sm:space-y-2">
            <FAQItem 
                question="How soon is my package activated?" 
                answer="After a successful payment (Wallet or Razorpay), your package is activated instantly. You will see your updated BV, PV, and Daily Capping limit on your dashboard immediately." 
            />
            <FAQItem 
                question="Can I upgrade my package later?" 
                answer="Yes! You can upgrade from Silver to Gold or Diamond at any time. Simply choose the higher package and complete the payment. Your team volume will remain intact." 
            />
            <FAQItem 
                question="What happens to my team volume if I upgrade?" 
                answer="All your previous team volume (BV/PV) is preserved. The upgrade only increases your future earnings potential and daily capping limit." 
            />
            <FAQItem 
                question="How is matching bonus calculated?" 
                answer="The system matches the PV from your Left and Right legs. For every matched PV, you receive a bonus according to your current package's rate, up to your daily capping limit." 
            />
        </div>
    </div>
);

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ pkg, walletBalance, onConfirm, onRazorpay, onCancel, loading }) => {
    const canAfford = walletBalance >= pkg.price;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/90 backdrop-blur-md px-4 pt-28 overflow-y-auto">
            <Motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="luxury-box w-full max-w-md p-8 shadow-gold-900/20 shadow-2xl"
            >
                {/* Gold top accent */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent w-full absolute top-0 left-0" />

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-[#F5E6C8] leading-none mb-1">Confirm Activation</h2>
                        <p className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em]">Review order details</p>
                    </div>
                    <button onClick={onCancel} className="w-10 h-10 border border-[#C8A96A]/20 flex items-center justify-center rounded-full hover:bg-[#C8A96A]/10 transition">
                        <X className="w-5 h-5 text-[#C8A96A]" />
                    </button>
                </div>

                {/* Package summary */}
                <div className={`bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-3xl p-6 mb-8 relative group overflow-hidden`}>
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 bg-[#C8A96A]/10 border border-[#C8A96A]/20 rounded-2xl flex items-center justify-center">
                            <pkg.icon className="w-8 h-8 text-[#C8A96A]" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[#C8A96A]/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{pkg.name} Tier</p>
                            <p className="text-3xl font-serif font-bold text-[#F5E6C8]">₹{pkg.price.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-6 relative z-10 pt-6 border-t border-[#C8A96A]/10">
                        <div className="text-center">
                            <p className="text-[8px] text-[#C8A96A]/40 uppercase font-black tracking-widest mb-1">BV</p>
                            <p className="text-xs font-bold text-[#F5E6C8]">{pkg.bv}</p>
                        </div>
                        <div className="text-center border-x border-[#C8A96A]/10">
                            <p className="text-[8px] text-[#C8A96A]/40 uppercase font-black tracking-widest mb-1">PV</p>
                            <p className="text-xs font-bold text-[#F5E6C8]">{pkg.pv}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[8px] text-[#C8A96A]/40 uppercase font-black tracking-widest mb-1">Cap</p>
                            <p className="text-xs font-bold text-[#F5E6C8]">{pkg.capping.split(' ')[0]}</p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-full blur-3xl" />
                </div>

                {/* Wallet info */}
                <div className={`rounded-3xl p-5 mb-8 flex items-center gap-4 border ${canAfford ? 'bg-[#0D0D0D] border-[#C8A96A]/30' : 'bg-red-950/20 border-red-500/30'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${canAfford ? 'bg-[#C8A96A]/10 text-[#C8A96A]' : 'bg-red-500/10 text-red-500'}`}>
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-widest">Available Credit</p>
                        <p className={`text-xl font-bold ${canAfford ? 'text-[#F5E6C8]' : 'text-red-400'}`}>
                            ₹{walletBalance.toLocaleString('en-IN')}
                        </p>
                    </div>
                    {canAfford ? (
                        <div className="w-6 h-6 bg-[#C8A96A]/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-[#C8A96A]" />
                        </div>
                    ) : (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                </div>

                {!canAfford && (
                    <div className="p-4 border-l-2 border-red-500 bg-red-500/5 mb-8">
                        <p className="text-[10px] text-red-400 font-bold leading-relaxed uppercase tracking-widest">
                            Deficit of ₹{(pkg.price - walletBalance).toLocaleString('en-IN')}<br/>
                            Top up or use alternative billing method.
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={onConfirm}
                        disabled={!canAfford || loading}
                        className="luxury-button w-full h-14 relative group overflow-hidden disabled:opacity-30"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Settle via Wallet'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                    
                    {!loading && (
                        <button
                            onClick={onRazorpay}
                            className="w-full h-14 border border-[#C8A96A]/20 rounded-2px text-[10px] font-black uppercase tracking-[0.3em] text-[#C8A96A] hover:bg-[#C8A96A]/10 transition flex items-center justify-center gap-3"
                        >
                            <Shield className="w-4 h-4" />
                            Global Merchant Gateway
                        </button>
                    )}

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="w-full text-[10px] font-black text-[#F5E6C8]/40 uppercase tracking-widest hover:text-[#F5E6C8] transition py-2"
                    >
                        Cancel Selection
                    </button>
                </div>
            </Motion.div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const PackageUpgrade = () => {
    const [status, setStatus] = useState(null);   // current package status from API
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [selectedPkg, setSelectedPkg] = useState(null);  // pkg object for confirm modal
    const [activating, setActivating] = useState(false);
    const [success, setSuccess] = useState(null);   // activated pkg name

    // ── Fetch current status ──────────────────────────────────────────────────
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await api.get('/package/status');
                setStatus(res.data.data);
            } catch (err) {
                console.error('Package status fetch error:', err);
            } finally {
                setLoadingStatus(false);
            }
        };
        fetchStatus();
    }, []);

    // ── Activate handler ──────────────────────────────────────────────────────
    const handleActivate = async () => {
        if (!selectedPkg) return;
        setActivating(true);
        try {
            const res = await api.post('/package/activate', {
                packageType: selectedPkg.id,
                paymentMethod: 'wallet',
            });

            if (res.data.success) {
                setStatus(prev => ({
                    ...prev,
                    packageType: selectedPkg.id,
                    packageName: selectedPkg.name,
                    activeStatus: true,
                    walletBalance: res.data.data.walletBalance,
                    bv: res.data.data.bv,
                    pv: res.data.data.pv,
                    dailyCapping: res.data.data.dailyCapping,
                }));
                setSuccess(selectedPkg.name);
                setSelectedPkg(null);
                toast.success(`${selectedPkg.name} package activated successfully!`);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || 'Activation failed. Please try again.';
            toast.error(msg);
        } finally {
            setActivating(false);
        }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const isCurrentPkg = (id) => status?.packageType === id && status?.activeStatus;
    const isLowerPkg = (id) => {
        const prices = { '599': 599, '1299': 1299, '2699': 2699 };
        const currentPrice = prices[status?.packageType] || 0;
        return status?.activeStatus && prices[id] <= currentPrice;
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loadingStatus) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-[#C8A96A] animate-spin mx-auto mb-4" />
                <p className="text-[#C8A96A]/40 text-[10px] font-black uppercase tracking-[0.2em]">Loading Packages...</p>
            </div>
        </div>
    );

    // ── Razorpay Integration ───────────────────────────────────────────────
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async () => {
        if (!selectedPkg) return;
        setActivating(true);

        const resScript = await loadRazorpay();
        if (!resScript) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            setActivating(false);
            return;
        }

        try {
            // 1. Create order on backend
            // Note: Reusing /orders/razorpay-order if exists, or adding direct support
            const { data: orderData } = await api.post('/orders/razorpay-order', {
                amount: selectedPkg.price,
                isPackage: true,
                packageType: selectedPkg.id
            });
            if (!orderData || !orderData.id || !orderData.amount) {
                throw new Error('Invalid payment order response from server');
            }
            const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKeyId) {
                console.error("Razorpay key is missing in frontend env");
                alert("Payment configuration error. Please contact support.");
                setActivating(false);
                return;
            }

            const options = {
                key: razorpayKeyId,
                amount: orderData.amount,
                currency: "INR",
                name: "Sanyukt Parivaar",
                description: `Activate ${selectedPkg.name} Package`,
                order_id: orderData.id,
                handler: async (response) => {
                    if (!response || !response.razorpay_payment_id) {
                        console.error("Invalid Razorpay response", response);
                        alert("Payment failed. Try again.");
                        setActivating(false);
                        return;
                    }

                    try {
                        const verifyRes = await api.post('/package/activate', {
                            packageType: selectedPkg.id,
                            paymentMethod: 'razorpay',
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        if (!verifyRes?.data || typeof verifyRes.data !== 'object') {
                            throw new Error('Invalid activation response from server');
                        }

                        if (verifyRes.data.success) {
                            setStatus(prev => ({
                                ...prev,
                                packageType: selectedPkg.id,
                                packageName: selectedPkg.name,
                                activeStatus: true,
                                walletBalance: verifyRes.data.data.walletBalance,
                                bv: verifyRes.data.data.bv,
                                pv: verifyRes.data.data.pv,
                                dailyCapping: verifyRes.data.data.dailyCapping,
                            }));
                            setSuccess(selectedPkg.name);
                            setSelectedPkg(null);
                            toast.success(`${selectedPkg.name} package activated!`);
                        }
                    } catch (err) {
                        toast.error(err.response?.data?.message || 'Verification failed');
                    }
                },
                prefill: {
                    name: status?.userName || '',
                    email: status?.email || '',
                },
                theme: { color: "#0A7A2F" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error('Razorpay Error:', err);
            toast.error('Failed to initiate Razorpay payment.');
        } finally {
            setActivating(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── Confirm Modal ── */}
            <AnimatePresence>
                {selectedPkg && (
                    <ConfirmModal
                        pkg={selectedPkg}
                        walletBalance={status?.walletBalance || 0}
                        onConfirm={handleActivate}
                        onRazorpay={handleRazorpayPayment}
                        onCancel={() => setSelectedPkg(null)}
                        loading={activating}
                    />
                )}
            </AnimatePresence>

            <div className="pb-12 px-3 sm:px-4 max-w-7xl mx-auto min-h-screen bg-[#0D0D0D] font-sans selection:bg-[#C8A96A]/30">

                {/* ── Success Banner ── */}
                <AnimatePresence>
                    {success && (
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-8 luxury-box p-5 flex items-center gap-4 shadow-gold-900/20 shadow-2xl relative"
                        >
                            <div className="w-14 h-14 bg-[#C8A96A]/10 border border-[#C8A96A]/30 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle className="w-7 h-7 text-[#C8A96A]" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#C8A96A]/60 font-black uppercase tracking-widest mb-1">Upgrade Successful</p>
                                <p className="text-xl sm:text-2xl font-serif font-bold text-[#F5E6C8] capitalize">{success} Tier Unlocked</p>
                                <p className="text-sm text-[#C8A96A]/60 font-medium italic">Your legacy in the binary ecosystem has been established.</p>
                            </div>
                            <button onClick={() => setSuccess(null)} className="luxury-button !p-2 shrink-0">
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-[#C8A96A] to-transparent" />
                        </Motion.div>
                    )}
                </AnimatePresence>

                {/* ── Header ── */}
                <div className="relative mb-8 sm:mb-12 py-6 sm:py-10 text-center overflow-hidden">
                    {/* Background Accents */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C8A96A]/5 blur-[120px] rounded-full -z-10" />
                    
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10"
                    >
                        <div className="inline-block mb-4 px-5 py-1.5 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#C8A96A]">Package Tiers</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-[#F5E6C8] uppercase tracking-tight mb-4 sm:mb-6">
                            Upgrade Your <span className="text-[#C8A96A]">Package</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-[#F5E6C8]/50 font-semibold text-sm sm:text-base leading-relaxed italic">
                            Ascend to a premium tier and manifest the full potential of your high-performance business ecosystem.
                        </p>
                    </Motion.div>
                </div>

                {/* ── Wallet Balance Strip ── */}
                <div className="mb-8 sm:mb-10 luxury-box p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 group shadow-2xl">
                    <div className="flex items-center gap-4 sm:gap-5">
                        <div className="w-14 h-14 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl flex items-center justify-center text-[#C8A96A] group-hover:border-[#C8A96A]/50 transition-colors shrink-0">
                            <Wallet className="w-7 h-7" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-xs text-[#C8A96A]/60 font-black uppercase tracking-widest mb-1">Capital Reserves</p>
                            <p className="text-2xl sm:text-3xl font-serif font-bold text-[#F5E6C8]">
                                ₹{(status?.walletBalance || 0).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                    {status?.activeStatus && (
                        <div className={`flex items-center gap-3 px-5 sm:px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border border-[#C8A96A]/30 bg-[#C8A96A]/5 text-[#C8A96A]`}>
                            <div className="w-2 h-2 rounded-full bg-[#C8A96A]" />
                            Current: {status.packageName} Tier Active
                        </div>
                    )}
                </div>

                {/* ── Package Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
                    {PACKAGES.map((pkg, index) => {
                        const isCurrent = isCurrentPkg(pkg.id);
                        const isLower = isLowerPkg(pkg.id);
                        const Icon = pkg.icon;

                        return (
                            <Motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`luxury-box flex flex-col h-full transform transition-all duration-700 hover:scale-[1.02] hover:shadow-gold-900/30
                                    ${isCurrent ? `!border-[#C8A96A]/60 shadow-gold-900/20` : ''}`}
                            >
                                {/* Header */}
                                <div className={`bg-gradient-to-br ${pkg.color} p-5 sm:p-6 relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#C8A96A]/5 rounded-full blur-2xl opacity-50" />
                                    <div className="relative z-10 text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="p-4 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl text-[#C8A96A] shadow-2xl">
                                                <Icon className="w-8 h-8" strokeWidth={1} />
                                            </div>
                                        </div>
                                        {isCurrent && (
                                            <span className="inline-block px-4 py-1.5 bg-[#C8A96A] text-[#0D0D0D] rounded-full text-[11px] font-black uppercase tracking-widest mb-4">
                                                Active Standing
                                            </span>
                                        )}
                                        <h3 className="text-2xl font-serif font-bold text-[#F5E6C8] uppercase tracking-widest mb-2">{pkg.name}</h3>
                                        <div className="text-4xl sm:text-5xl font-serif font-bold text-[#C8A96A] tracking-tighter">₹{pkg.price.toLocaleString('en-IN')}</div>
                                    </div>
                                    {/* Gold line bottom */}
                                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A96A]/40 to-transparent" />
                                </div>

                                {/* Stats Strip */}
                                <div className="bg-[#121212] px-5 sm:px-6 py-4 border-b border-[#C8A96A]/10 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[11px] text-[#C8A96A]/60 font-black uppercase tracking-wider mb-1">Volume Yield</p>
                                        <p className="text-xl font-bold text-[#F5E6C8] tracking-tight">{pkg.bv}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] text-[#C8A96A]/60 font-black uppercase tracking-wider mb-1">Point Merit</p>
                                        <p className="text-xl font-bold text-[#F5E6C8] tracking-tight">{pkg.pv}</p>
                                    </div>
                                </div>

                                {/* Daily Capping */}
                                <div className="px-5 sm:px-6 py-4 border-b border-[#C8A96A]/5 flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-[#C8A96A]/10 border border-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] shrink-0">
                                        <Zap className="w-5 h-5" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-[#C8A96A]/60 font-black uppercase tracking-wider mb-1">Earning Capping</p>
                                        <p className="text-xl sm:text-2xl font-serif font-bold text-[#F5E6C8]">{pkg.capping}</p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="px-5 sm:px-6 py-5 sm:py-6 flex-1">
                                    <ul className="space-y-3">
                                        {pkg.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] shrink-0" />
                                                <span className="text-[13px] font-bold text-[#F5E6C8]/70 uppercase tracking-wide leading-tight">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action */}
                                <div className="p-6 pt-0">
                                    {isCurrent ? (
                                        <div className="w-full py-4 rounded-xl border border-[#C8A96A]/40 bg-[#C8A96A]/5 text-[#C8A96A] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" /> Currently Active
                                        </div>
                                    ) : isLower ? (
                                        <div className="w-full py-4 rounded-xl border border-white/5 bg-white/5 text-white/30 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed">
                                            Legacy Tier Established
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedPkg(pkg)}
                                            className="luxury-button w-full h-14 group relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                <Package className="w-4 h-4" />
                                                Upgrade Now
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        </button>
                                    )}
                                </div>
                            </Motion.div>
                        );
                    })}
                </div>

                {/* ── Trust Section ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20">
                    <div className="luxury-box p-5 sm:p-6 flex items-center gap-4 sm:gap-5 group hover:border-[#C8A96A]/60 transition-colors">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl flex items-center justify-center text-[#C8A96A] group-hover:scale-110 transition-transform shrink-0">
                            <Shield className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1} />
                        </div>
                        <div>
                            <p className="font-serif font-black text-[#F5E6C8] uppercase text-sm tracking-wider mb-0.5">Fortified Settle</p>
                            <p className="text-xs text-[#C8A96A]/50 font-bold uppercase tracking-wider">Verified Merchant Tunnels</p>
                        </div>
                    </div>
                    <div className="luxury-box p-5 sm:p-6 flex items-center gap-4 sm:gap-5 group hover:border-[#C8A96A]/60 transition-colors">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl flex items-center justify-center text-[#C8A96A] group-hover:scale-110 transition-transform shrink-0">
                            <Zap className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1} />
                        </div>
                        <div>
                            <p className="font-serif font-black text-[#F5E6C8] uppercase text-sm tracking-wider mb-0.5">Instant Upgrade</p>
                            <p className="text-xs text-[#C8A96A]/50 font-bold uppercase tracking-wider">Zero Latency Activation</p>
                        </div>
                    </div>
                    <div className="luxury-box p-5 sm:p-6 flex items-center gap-4 sm:gap-5 group hover:border-[#C8A96A]/60 transition-colors">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl flex items-center justify-center text-[#C8A96A] group-hover:scale-110 transition-transform shrink-0">
                            <Star className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1} />
                        </div>
                        <div>
                            <p className="font-serif font-black text-[#F5E6C8] uppercase text-sm tracking-wider mb-0.5">Concierge Elite</p>
                            <p className="text-xs text-[#C8A96A]/50 font-bold uppercase tracking-wider">Dedicated Master Support</p>
                        </div>
                    </div>
                </div>

                {/* ── Comparison Table ── */}
                <ComparisonTable />

                {/* ── FAQ Section ── */}
                <FAQSection />

                {/* ── Info Note ── */}
                <div className="mt-8 luxury-box p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0D0D0D] border border-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] shrink-0">
                        <Info className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1} />
                    </div>
                    <div>
                        <h4 className="font-serif font-bold text-[#F5E6C8] uppercase tracking-wider mb-2 text-base">Package Details</h4>
                        <p className="text-sm text-[#F5E6C8]/50 font-medium leading-relaxed italic">
                            Upon upgrade, Business Volume and Merit Points are integrated into the system.<br/>
                            Royalties are distributed to sponsors. The central engine calculates matched yields nocturnally, 
                            synchronizing your growth with the highest efficiency benchmarks.
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
};

export default PackageUpgrade;
