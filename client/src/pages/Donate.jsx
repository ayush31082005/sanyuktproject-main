import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Shield, Zap, Users, Receipt, Smartphone,
    ArrowRight, CheckCircle2, Copy, Share2, Info, Clock,
    ChevronLeft, Download, Wallet
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const Donate = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const beneficiaryId = searchParams.get('for');

    const [beneficiary, setBeneficiary] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect(() => {
        const fetchBeneficiary = async () => {
            if (!beneficiaryId) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get(`/auth/public-profile/${beneficiaryId}`);
                if (data.success) {
                    setBeneficiary(data.user);
                }
            } catch (err) {
                console.error("Error fetching beneficiary:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBeneficiary();
    }, [beneficiaryId]);

    const handlePayment = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid donation amount");
            return;
        }

        setIsProcessing(true);
        const toastId = toast.loading("Initiating secure payment...");

        try {
            // Re-using the recharge endpoint logic but for donation
            const { data } = await api.post('/recharge/create-order', {
                amount: Number(amount),
                type: 'donation',
                operator: 'Razorpay',
                rechargeNumber: beneficiaryId || 'GENERAL'
            });

            if (!data.success) {
                toast.error("Failed to create donation order", { id: toastId });
                setIsProcessing(false);
                return;
            }
            if (!data?.order?.id || !data?.order?.amount) {
                throw new Error("Invalid payment order response from server");
            }
            const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKeyId) {
                console.error("Razorpay key is missing in frontend env");
                alert("Payment configuration error. Please contact support.");
                setIsProcessing(false);
                return;
            }

            toast.dismiss(toastId);

            const options = {
                key: razorpayKeyId,
                amount: data.order.amount,
                currency: "INR",
                name: "Sanyukt Parivaar",
                description: beneficiary ? `Donation for ${beneficiary.userName}` : "General Donation",
                order_id: data.order.id,
                handler: async function (response) {
                    if (!response || !response.razorpay_payment_id) {
                        console.error("Invalid Razorpay response", response);
                        alert("Payment failed. Try again.");
                        setIsProcessing(false);
                        return;
                    }

                    const verifyToast = toast.loading("Verifying your contribution...");
                    try {
                        const { data: verifyData } = await api.post('/recharge/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            transactionId: data.transactionId
                        });
                        if (!verifyData || typeof verifyData !== "object") {
                            throw new Error("Invalid verification response from server");
                        }

                        if (verifyData.success) {
                            toast.success("Payment Successful! Thank you for your kindness!", { id: verifyToast });
                            setTransactionDetails({
                                id: response.razorpay_payment_id,
                                amount: amount,
                                date: new Date().toLocaleString(),
                                beneficiary: beneficiary ? beneficiary.userName : "Sanyukt Parivaar Mission"
                            });
                            setShowSuccessAlert(true);
                            setTimeout(() => {
                                setShowSuccessAlert(false);
                                setPaymentSuccess(true);
                            }, 3000);
                        } else {
                            toast.error("Payment verification failed", { id: verifyToast });
                        }
                    } catch {
                        toast.error("Error verifying payment", { id: verifyToast });
                    }
                },
                prefill: {
                    name: "Kind Donor",
                    email: "donor@example.com",
                },
                theme: {
                    color: "#0A7A2F"
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            toast.error("Something went wrong", { id: toastId });
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9f8] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A7A2F]"></div>
            </div>
        );
    }

    // Styled success alert overlay
    const SuccessAlert = () => (
        <AnimatePresence>
            {showSuccessAlert && (
                <Motion.div
                    initial={{ opacity: 0, y: -80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -80 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{
                        position: 'fixed',
                        top: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        width: '90%',
                        maxWidth: '480px',
                    }}
                >
                    <div style={{
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #0D0D0D 100%)',
                        border: '1.5px solid #C8A96A',
                        borderRadius: '20px',
                        padding: '20px 28px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,169,106,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: '48px', height: '48px', flexShrink: 0,
                            background: 'rgba(200,169,106,0.15)',
                            border: '1.5px solid #C8A96A',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <CheckCircle2 size={26} color="#C8A96A" />
                        </div>
                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontFamily: '"Inter", sans-serif', fontWeight: 800, fontSize: '15px', color: '#C8A96A', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                Payment Successful
                            </p>
                            <p style={{ margin: '4px 0 0', fontFamily: '"Inter", sans-serif', fontSize: '12px', color: 'rgba(245,230,200,0.7)', fontWeight: 500 }}>
                                ₹{transactionDetails?.amount} donated successfully. Thank you! 🙏
                            </p>
                        </div>
                        {/* Close */}
                        <button
                            onClick={() => setShowSuccessAlert(false)}
                            style={{ background: 'none', border: 'none', color: 'rgba(200,169,106,0.5)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '4px' }}
                        >✕</button>
                    </div>
                </Motion.div>
            )}
        </AnimatePresence>
    );

    if (paymentSuccess) {
        return (
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
            >
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-[#0A7A2F]" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Contribution Successful!</h2>
                    <p className="text-gray-500 mb-8">Your kindness is making a real difference in the Sanyukt Parivaar community.</p>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-left">
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-400 text-sm font-medium">Receipt ID</span>
                            <span className="text-gray-900 text-sm font-bold">#{transactionDetails?.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-400 text-sm font-medium">Amount Paid</span>
                            <span className="text-[#0A7A2F] text-sm font-black">₹{transactionDetails?.amount}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                            <span className="text-gray-400 text-sm font-medium">Date</span>
                            <span className="text-gray-900 text-sm font-bold">{transactionDetails?.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm font-medium">Beneficiary</span>
                            <span className="text-gray-900 text-sm font-bold">{transactionDetails?.beneficiary}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="w-full py-4 bg-[#0A7A2F] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-green-900/20 transition-all mb-4 flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" /> Download Receipt
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 text-gray-500 font-bold hover:text-[#0A7A2F] transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </Motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-[#0A7A2F] selection:text-white">
            <SuccessAlert />
            {/* Navigation Placeholder */}
            <div className="h-16 border-b border-gray-100 flex items-center px-6 justify-between bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">Back</span>
                </div>
                <div className="text-[#0A7A2F] font-black text-xl tracking-tighter">
                    Sanyukt <span className="text-[#F7931E]">Parivaar</span>
                </div>
                <div className="w-10"></div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-12">
                {/* 1. DONATION SECTION - ADAPTED FROM RECHARGE UI */}
                <section className="relative">
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#F7931E]/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0A7A2F]/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <Motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(10,122,47,0.15)] border border-white/10"
                    >
                        {/* Premium Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0A7A2F] via-[#0A6326] to-[#085220]"></div>

                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

                        <div className="relative z-10 p-8 lg:p-16">
                            <div className="max-w-5xl mx-auto">
                                {/* Header Area */}
                                <div className="text-center mb-12">
                                    <Motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="inline-flex items-center gap-3 py-2 px-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8"
                                    >
                                        <Heart className="w-5 h-5 fill-[#F7931E] text-[#F7931E]" />
                                        <span className="text-white font-black text-xs uppercase tracking-[0.3em]">Support Our Mission</span>
                                    </Motion.div>

                                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                                        Empower Change <span className="text-[#F7931E]">- With Your Kindness</span>
                                    </h1>

                                    <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
                                        Your generosity fuels our commitment to building sustainable communities within the <span className="text-white font-black italic">Sanyukt Parivaar</span> network.
                                    </p>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                    {[
                                        { title: 'Secure Gateway', icon: Shield, subtitle: '100% Encrypted' },
                                        { title: 'Tax Benefits', icon: Receipt, subtitle: 'Donation Receipt' },
                                        { title: 'Community Led', icon: Users, subtitle: 'Collective Power' },
                                        { title: 'Direct Impact', icon: Zap, subtitle: 'Instant Transfer' }
                                    ].map((feature, i) => (
                                        <Motion.div
                                            key={i}
                                            whileHover={{ y: -5 }}
                                            className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 transition-all duration-300"
                                        >
                                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                                                <feature.icon className="w-6 h-6 text-[#F7931E]" />
                                            </div>
                                            <h4 className="text-white font-bold text-sm">{feature.title}</h4>
                                            <p className="text-white/40 text-[10px] mt-1 font-bold uppercase tracking-widest leading-none">{feature.subtitle}</p>
                                        </Motion.div>
                                    ))}
                                </div>

                                {/* Main Interaction Area */}
                                <div className="grid lg:grid-cols-2 gap-8 items-stretch">

                                    {/* Left Side: Beneficiary Info */}
                                    <div className="bg-black/20 backdrop-blur-3xl rounded-[2rem] p-8 border border-white/10 flex flex-col justify-center">
                                        <div className="mb-6">
                                            <span className="inline-block px-3 py-1 bg-[#F7931E] text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">Supporting Member</span>
                                            {beneficiary ? (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-[#0A7A2F] rounded-full flex items-center justify-center border-2 border-[#F7931E]">
                                                        <span className="text-2xl font-black text-white">{beneficiary.userName[0].toUpperCase()}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black text-white">{beneficiary.userName}</h3>
                                                        <p className="text-[#F7931E] text-xs font-black uppercase tracking-wider mt-1">Beneficiary: Sanyukt Parivaar & Rich Life</p>
                                                        <p className="text-white/50 text-[10px] font-medium italic">Verified Official Company Account</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h3 className="text-2xl font-black text-white">Sanyukt Parivaar Mission</h3>
                                                    <p className="text-[#F7931E] text-xs font-black uppercase tracking-wider mt-1">Beneficiary: Sanyukt Parivaar & Rich Life</p>
                                                    <p className="text-white/50 text-[10px] font-medium italic">Verified Official Company Account</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
                                                <Info className="w-5 h-5 text-[#F7931E] flex-shrink-0 mt-0.5" />
                                                <p className="text-white/70 text-sm leading-relaxed">
                                                    By donating, you agree that this contribution is voluntary and supports the mission of <span className="text-white font-bold">Sanyukt Parivaar</span>.
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 text-white/40">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-[#F7931E]" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Merchant</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-[#F7931E]" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Instant Settlement</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Payment Form */}
                                    <div className="bg-white rounded-[2rem] p-8 shadow-2xl flex flex-col">
                                        <div className="mb-8">
                                            <label className="text-gray-900 font-black text-xs uppercase tracking-widest mb-4 block">Contribution Amount (₹)</label>
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-[#0A7A2F]">₹</div>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0A7A2F] focus:bg-white rounded-2xl py-6 pl-12 pr-6 text-3xl font-black text-gray-900 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 mt-4">
                                                {[500, 1000, 2000].map(val => (
                                                    <button
                                                        key={val}
                                                        onClick={() => setAmount(val)}
                                                        className="py-2 bg-gray-100 hover:bg-[#0A7A2F]/10 text-gray-600 font-black text-xs rounded-xl transition-colors"
                                                    >
                                                        +₹{val}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                            className="w-full bg-[#0A7A2F] hover:bg-[#086326] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-green-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            {isProcessing ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    Donate Now
                                                </>
                                            )}
                                        </button>

                                        <div className="mt-6 flex flex-col items-center gap-4">
                                            <div className="flex flex-col items-center gap-2 py-2 px-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secured by</span>
                                                    <div className="h-4 flex items-center">
                                                        <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-full" />
                                                        <span className="text-[10px] font-bold text-gray-900 ml-1">Razorpay</span>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-[#0A7A2F] uppercase tracking-wider">Official Payment to Sanyukt Parivaar & Rich Life</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-medium text-center">
                                                Secure 256-bit SSL encrypted transaction.<br />
                                                No hidden fees or processing charges.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Note */}
                                <div className="mt-12 text-center">
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                                        <Heart className="w-3 h-3 text-[#F7931E]" />
                                        Your support builds a better tomorrow
                                        <Heart className="w-3 h-3 text-[#F7931E]" />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Motion.div>
                </section>

                {/* 2. SECONDARY TRUST SECTION */}
                <section className="mt-24 grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#0A7A2F]/10 rounded-2xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6 text-[#0A7A2F]" />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-3">Safe & Secure</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Every transaction is monitored and protected by world-class security protocols, ensuring your funds reach the intended mission safely.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#F7931E]/10 rounded-2xl flex items-center justify-center mb-6">
                            <Users className="w-6 h-6 text-[#F7931E]" />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-3">Community First</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            We are built on trust. Sanyukt Parivaar ensures that every rupee donated goes towards strengthening our collective ecosystem.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-[#0A7A2F]/10 rounded-2xl flex items-center justify-center mb-6">
                            <Receipt className="w-6 h-6 text-[#0A7A2F]" />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 mb-3">Instant Receipts</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Transparency is key. Receive an instant downloadable receipt for every contribution, maintaining a clear record of your impact.
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-100 mt-24 py-12 text-center">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-[#0A7A2F] font-black text-2xl tracking-tighter mb-4">
                        Sanyukt <span className="text-[#F7931E]">Parivaar</span>
                    </div>
                    <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
                        Empowering lives through collective action and sustainable growth since 2024. Together we grow, Together we prosper.
                    </p>
                    <div className="mt-8 flex justify-center gap-6 text-gray-300">
                        <Share2 className="w-5 h-5 hover:text-[#0A7A2F] cursor-pointer" />
                        <Copy className="w-5 h-5 hover:text-[#0A7A2F] cursor-pointer" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Donate;
