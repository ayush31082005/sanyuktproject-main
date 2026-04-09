import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { loginUser } from '../services/api/auth';

const UserLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState(null); // { email, role }
    const [countdown, setCountdown] = useState(3);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
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
        setError('');

        try {
            console.log('Login attempt:', formData);

            const data = await loginUser({
                email: formData.email,
                password: formData.password
            });

            console.log('Login response:', data);

            if (data?.token) {
                localStorage.setItem('loginTimestamp', Date.now().toString());

                const userRole = data.user?.role || 'user';
                setSuccessData({ email: formData.email, role: userRole });

                // Countdown then navigate
                let count = 3;
                const timer = setInterval(() => {
                    count -= 1;
                    setCountdown(count);
                    if (count === 0) {
                        clearInterval(timer);
                        navigate(userRole === 'admin' ? '/admin/dashboard' : '/my-account');
                    }
                }, 1000);
            }

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-88px)] md:min-h-[calc(100vh-115px)] bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 relative overflow-hidden flex items-center justify-center py-4 md:py-5">

            {/* ===== SUCCESS POPUP MODAL ===== */}
            {successData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                    <div
                        className="luxury-box w-full max-w-sm mx-4"
                        style={{ animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                        {/*  Sanyukt Parivaar top gold accent */}
                        <div className="h-1 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent w-full" />

                        <div className="p-10 text-center">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-[#0D0D0D] border border-[#C8A96A]/30 flex items-center justify-center shadow-gold-900/20 shadow-2xl animate-pulse">
                                    <CheckCircle className="w-10 h-10 text-[#C8A96A]" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-serif font-bold text-[#F5E6C8] mb-2 tracking-tight">Access Granted</h2>
                            <p className="text-[#C8A96A]/60 text-xs font-bold uppercase tracking-widest italic mb-8">Welcome to the inner circle</p>

                            {/* Account info card */}
                            <div className="bg-[#0D0D0D] rounded-2xl border border-[#C8A96A]/10 p-5 flex items-center justify-between mb-8 text-left group">
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-[#C8A96A]/40 uppercase tracking-[0.2em] font-black mb-1">Identity Confirmed</p>
                                    <p className="text-[#F5E6C8] font-bold text-sm truncate">{successData.email}</p>
                                </div>
                                <span className={`ml-3 flex-shrink-0 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${successData.role === 'admin'
                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
                                    : 'bg-[#C8A96A]/10 text-[#C8A96A] border-[#C8A96A]/30'
                                    }`}>
                                    {successData.role === 'admin' ? 'Architect' : ' Sanyukt Parivaar Member'}
                                </span>
                            </div>

                            {/* Redirect info + progress */}
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/40 mb-3">
                                <span>Establishing Uplink...</span>
                                <span className="text-[#C8A96A] tabular-nums">{countdown}s</span>
                            </div>
                            <div className="h-1 bg-[#0D0D0D] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] rounded-full shadow-gold"
                                    style={{ width: `${((3 - countdown) / 3) * 100}%`, transition: 'width 1s linear' }}
                                />
                            </div>
                        </div>
                    </div>

                    <style>{`
                        @keyframes slideUp {
                            from { opacity: 0; transform: translateY(40px) scale(0.95); }
                            to   { opacity: 1; transform: translateY(0)    scale(1);    }
                        }
                    `}</style>
                </div>
            )}


            {/* Elegant Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#C8A96A]/5 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-6xl mx-auto relative z-10 px-4">
                {/* Main Content Grid */}
                <div className="flex items-center justify-center py-1 md:py-2">
                    {/* Right Side - Login Form */}
                    <div className="w-full flex justify-center animate-slide-left">
                        <div className="luxury-box w-full max-w-[460px] group transition-all duration-700">
                            {/* Header -  Sanyukt Parivaar Gold */}
                            <div className="bg-[#121212] p-5 md:p-6 border-b border-[#C8A96A]/30 relative overflow-hidden text-center">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-full blur-3xl"></div>

                                <h2 className="text-3xl font-serif font-black text-[#F5E6C8] mb-1 tracking-tight">
                                    User <span className="text-[#C8A96A]">Login</span>
                                </h2>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
                                <div className="space-y-4">
                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl animate-slide-down text-xs font-black w-full">
                                            {error}
                                        </div>
                                    )}

                                    {/* Email Input */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] md:text-xs font-black uppercase tracking-widest text-[#C8A96A]">Email / Sponser ID</label>
                                        <div className="relative group/input">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C8A96A]/40 group-hover/input:text-[#C8A96A] transition-colors" />
                                            <input
                                                type="text"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email / Sponsor ID"
                                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl pl-12 pr-4 py-4 text-[#F5E6C8] placeholder:text-[#F5E6C8]/35 focus:border-[#C8A96A] outline-none transition-all font-bold text-[15px]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] md:text-xs font-black uppercase tracking-widest text-[#C8A96A]">Password</label>
                                        <div className="relative group/input">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C8A96A]/40 group-hover/input:text-[#C8A96A] transition-colors" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter Secured Key"
                                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl pl-12 pr-14 py-4 text-[#F5E6C8] placeholder:text-[#F5E6C8]/35 focus:border-[#C8A96A] outline-none transition-all font-bold text-[15px]"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C8A96A]/40 hover:text-[#C8A96A] transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="flex items-center justify-between text-[11px] md:text-xs font-black uppercase tracking-widest">
                                        <label className="flex items-center space-x-3 cursor-pointer group/check">
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
                                            <span className="text-[#F5E6C8]/70 group-hover/check:text-[#C8A96A] transition-colors font-black">Remember</span>
                                        </label>

                                        <Link
                                            to="/forgot-password"
                                            className="text-[#C8A96A]/75 hover:text-[#C8A96A] transition-colors italic font-black"
                                        >
                                            Forget Password
                                        </Link>
                                    </div>

                                    {/* Sign In Button */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="luxury-button w-full relative z-10 flex items-center justify-center gap-3 p-4 disabled:opacity-50"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                {isLoading ? 'Verifying...' : 'LOGIN'}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Register Link */}
                                    <div className="text-center pt-2">
                                        <p className="text-[11px] md:text-xs font-black uppercase tracking-widest text-[#F5E6C8]/55">
                                            No membership?{' '}
                                            <Link
                                                to="/register"
                                                className="text-[#C8A96A] hover:underline transition-all font-black"
                                            >
                                                Sign up
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Demo Credentials */}
                                    <div className="mt-1 p-4 bg-[#0D0D0D] rounded-2xl border border-[#C8A96A]/10">
                                        <p className="text-[11px] md:text-xs text-[#F5E6C8]/45 text-center leading-relaxed font-bold">
                                            <span className="font-black text-[#C8A96A] block mb-2 tracking-widest uppercase text-[11px] md:text-xs">System Defaults</span>
                                            <span className="font-bold">Architect:</span> admin@example.com / admin123<br />
                                            <span className="font-bold">Member:</span> user@example.com / password123
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserLogin;
