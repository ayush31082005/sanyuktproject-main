import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../api"
import {
    Home,
    ChevronDown,
    User,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    Store,
    Shield,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Users,
    Star
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const FranchiseLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        franchiseId: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [franchiseName, setFranchiseName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Password must contain at least one letter, one number, and one special character (@$!%*?&)");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError("");

        try {

            const res = await api.post("/franchises/login", {
                franchiseId: formData.franchiseId,
                password: formData.password
            });

            if (res.data.success) {

                const franchise = res.data.franchise;

                setFranchiseName(franchise.name);
                setShowSuccess(true);

                // LocalStorage save
                localStorage.setItem(
                    "franchiseData",
                    JSON.stringify(franchise)
                );

                // Redirect
                setTimeout(() => {
                    navigate("/franchise/dashboard");
                }, 2000);

            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Invalid Franchise ID or Password"
            );

        } finally {

            setIsLoading(false);

        }
    };

    return (
        <div className="bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 p-4 md:p-6 lg:py-4 lg:px-8 relative overflow-hidden">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <Motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-[#C8A96A]/10 rounded-full mix-blend-screen filter blur-3xl opacity-30"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <Motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D4AF37]/10 rounded-full mix-blend-screen filter blur-3xl opacity-25"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <Motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#C8A96A]/5 rounded-full mix-blend-screen filter blur-3xl opacity-20"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Floating Elements */}
            <Motion.div
                className="absolute top-20 left-20 hidden lg:block"
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="luxury-box glass-morphism p-3 shadow-2xl">
                    <Store className="h-6 w-6 text-[#C8A96A]" />
                </div>
            </Motion.div>

            <Motion.div
                className="absolute bottom-20 right-20 hidden lg:block"
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="luxury-box glass-morphism p-3 shadow-2xl">
                    <TrendingUp className="h-6 w-6 text-[#C8A96A]" />
                </div>
            </Motion.div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
                    >
                        <Motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="luxury-box shadow-3xl max-w-md w-full"
                        >
                            {/* Top Success Bar */}
                            <div className="h-1 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent w-full" />

                            <div className="p-8 text-center">
                                {/* Success Icon with Animation */}
                                <Motion.div
                                    className="flex justify-center mb-6"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                >
                                    <div className="w-20 h-20 rounded-full bg-[#0D0D0D] border border-[#C8A96A]/30 flex items-center justify-center shadow-gold-900/20 shadow-2xl animate-pulse">
                                        <CheckCircle className="h-10 w-10 text-[#C8A96A]" />
                                    </div>
                                </Motion.div>

                                {/* Success Message */}
                                <Motion.h3
                                    className="text-2xl font-serif font-bold text-[#F5E6C8] mb-2 tracking-tight"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Welcome Back!
                                </Motion.h3>

                                <Motion.p
                                    className="text-[#C8A96A]/60 mb-6 text-xs font-bold uppercase tracking-widest italic"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <span className="text-[#F5E6C8] normal-case tracking-normal not-italic font-bold">{franchiseName}</span> — Franchise Partner
                                </Motion.p>

                                {/* Franchise Info Card */}
                                <Motion.div
                                    className="bg-[#0D0D0D] rounded-2xl p-5 mb-6 border border-[#C8A96A]/10 text-left"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[#1A1A1A] p-2 rounded-xl border border-[#C8A96A]/10">
                                                <Store className="h-5 w-5 text-[#C8A96A]" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] text-[#C8A96A]/40 uppercase tracking-[0.2em] font-black mb-1">Franchise ID</p>
                                                <p className="text-sm font-bold text-[#F5E6C8]">{formData.franchiseId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Shield className="h-4 w-4 text-[#C8A96A]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-[#C8A96A]/10 text-[#C8A96A] border-[#C8A96A]/30">
                                                Verified
                                            </span>
                                        </div>
                                    </div>
                                </Motion.div>

                                {/* Redirect Message */}
                                <Motion.div
                                    className="flex items-center justify-between text-[11px] text-[#F5E6C8]/40 mb-3 font-black uppercase tracking-widest"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <span>Redirecting to Dashboard</span>
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="h-4 w-4 text-[#C8A96A]" />
                                        <span className="text-[#C8A96A]">2s</span>
                                    </div>
                                </Motion.div>

                                {/* Progress Bar */}
                                <Motion.div
                                    className="h-1.5 bg-[#0D0D0D] rounded-full overflow-hidden border border-[#C8A96A]/10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <Motion.div
                                        className="h-full rounded-full bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "linear" }}
                                    />
                                </Motion.div>
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto relative z-10 pt-4">

                {/* Main Grid */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Hero Section (hidden on mobile) */}
                    <Motion.div
                        className="hidden lg:block text-center lg:text-left"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Motion.div
                            className="inline-flex items-center gap-2 bg-[#C8A96A]/10 border border-[#C8A96A]/20 px-4 py-1.5 rounded-full mb-3"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Store className="h-4 w-4 text-[#C8A96A]" />
                            <span className="text-sm font-bold text-[#C8A96A]">Franchise Partner Portal</span>
                        </Motion.div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#F5E6C8] mb-3 tracking-tight uppercase">
                            <span className="text-[#C8A96A]">Welcome Back,</span>
                            <br />
                            Partner!
                        </h1>

                        <p className="text-[#F5E6C8]/60 text-base max-w-md mx-auto lg:mx-0 mb-4 font-bold leading-relaxed italic">
                            Access your franchise dashboard to manage orders, track performance, and grow your business.
                        </p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-3 max-w-[280px] mx-auto lg:mx-0 mb-6">
                            <Motion.div
                                className="luxury-box glass-morphism p-3 shadow-2xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <Users className="h-5 w-5 text-[#C8A96A] mb-1" />
                                <p className="text-xl font-black text-[#F5E6C8] tracking-tight">500+</p>
                                <p className="text-[10px] text-[#F5E6C8] font-black uppercase tracking-widest">Active Franchises</p>
                            </Motion.div>
                            <Motion.div
                                className="luxury-box glass-morphism p-3 shadow-2xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <TrendingUp className="h-5 w-5 text-[#C8A96A] mb-1" />
                                <p className="text-xl font-black text-[#F5E6C8] tracking-tight">₹50K+</p>
                                <p className="text-[10px] text-[#F5E6C8] font-black uppercase tracking-widest">Avg. Monthly</p>
                            </Motion.div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 max-w-md mx-auto lg:mx-0">
                            {[
                                "Real-time order management",
                                "Inventory tracking system",
                                "Performance analytics",
                                "24/7 support assistance"
                            ].map((feature, index) => (
                                <Motion.div
                                    key={index}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <div className="h-4 w-4 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/20 flex items-center justify-center">
                                        <CheckCircle className="h-2.5 w-2.5 text-[#C8A96A]" />
                                    </div>
                                    <span className="text-[#F5E6C8] font-black text-[11px] uppercase tracking-wide">{feature}</span>
                                </Motion.div>
                            ))}
                        </div>
                    </Motion.div>

                    {/* Right Side - Login Form */}
                    <Motion.div
                        className="w-full max-w-sm mx-auto lg:mx-0 shadow-2xl"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="luxury-box w-full group transition-all duration-700">
                            <div className="bg-[#121212] p-5 md:p-6 border-b border-[#C8A96A]/30 relative overflow-hidden text-center">
                                <Motion.div
                                    className="absolute inset-0 bg-[#C8A96A]/5"
                                    animate={{
                                        x: ['-100%', '100%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-full blur-3xl"></div>
                                <Store className="h-10 w-10 text-[#C8A96A] mx-auto mb-2 relative" />
                                <h2 className="text-2xl font-serif font-bold text-[#F5E6C8] mb-1 tracking-tight relative">
                                    Franchise <span className="text-[#C8A96A]">Login</span>
                                </h2>
                                <p className="text-[#F5E6C8]/40 text-xs font-bold uppercase tracking-widest relative">
                                    Enter your credentials to continue
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-4">
                                <div className="space-y-6">
                                    {/* Error Message */}
                                    <AnimatePresence>
                                        {error && (
                                            <Motion.div
                                                className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl text-[11px] font-bold"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                {error}
                                            </Motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Franchise ID */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A] block">
                                            Franchise ID <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Store className="h-5 w-5 text-[#C8A96A]/40 group-hover:text-[#C8A96A] transition-colors duration-300" />
                                            </div>
                                            <input
                                                type="text"
                                                name="franchiseId"
                                                value={formData.franchiseId}
                                                onChange={handleChange}
                                                placeholder="Enter Franchise ID"
                                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl pl-10 pr-4 py-3.5 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-black text-xs"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A] block">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Lock className="h-5 w-5 text-[#C8A96A]/40 group-hover:text-[#C8A96A] transition-colors duration-300" />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter password"
                                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl pl-10 pr-12 py-3.5 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-black text-xs"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C8A96A]/40 hover:text-[#C8A96A] transition-colors duration-300"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center space-x-3 cursor-pointer group/check text-[10px] font-black uppercase tracking-widest">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 rounded-md border border-[#C8A96A]/30 transition-all ${rememberMe ? 'bg-[#C8A96A] border-[#C8A96A]' : 'bg-transparent'}`}>
                                                    {rememberMe && <CheckCircle className="w-full h-full text-[#0D0D0D] p-0.5" />}
                                                </div>
                                            </div>
                                            <span className="text-[#F5E6C8]/40 group-hover/check:text-[#C8A96A] transition-colors">
                                                Remember me
                                            </span>
                                        </label>

                                    </div>

                                    {/* Login Button */}
                                    <Motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        className="luxury-button w-full relative z-10 flex items-center justify-center p-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center space-x-2">
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>VERIFYING...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>LOGIN TO DASHBOARD</span>
                                                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </span>
                                    </Motion.button>

                                    {/* Register Link */}
                                    <div className="text-center pt-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/30">
                                            New franchise partner?{' '}
                                            <Link
                                                to="/franchise/list"
                                                className="text-[#C8A96A] hover:underline transition-all"
                                            >
                                                Apply for Franchise
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Demo Credentials */}
                                    <Motion.div
                                        className="mt-4 p-5 bg-[#0D0D0D] rounded-2xl border border-[#C8A96A]/10"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="h-4 w-4 text-[#C8A96A]" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/60">Demo Credentials</p>
                                        </div>
                                        <div className="space-y-1 text-[10px] text-[#F5E6C8]/40 leading-relaxed">
                                            <p><span className="font-black text-[#C8A96A]">Franchise ID:</span> FRANCHISE123</p>
                                            <p><span className="font-black text-[#C8A96A]">Password:</span> franchise123</p>
                                        </div>
                                    </Motion.div>
                                </div>
                            </form>
                        </div>
                    </Motion.div>
                </div>
            </div>

            {/* Animation Styles */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default FranchiseLogin;
