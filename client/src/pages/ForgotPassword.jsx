import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import api from '../api';

const ForgotPassword = () => {
    const navigate = useNavigate();

    // Steps: 1 = Email, 2 = Verify OTP, 3 = New Password
    const [step, setStep] = useState(1);

    // Form States
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ================= STEP 1: SEND OTP =================
    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/forgot-password', { email });
            setSuccess(response.data.message || 'OTP sent to your email');
            setStep(2); // Move to OTP input step
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
        } finally {
            setIsLoading(false);
        }
    };

    // ================= RESEND OTP =================
    const handleResendOTP = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await api.post('/resend-otp', { email });
            setSuccess(response.data.message || 'New OTP sent successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // ================= STEP 2: VERIFY OTP AND RESET =================
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (step === 2) {
            if (!otp || otp.length < 4) {
                setError('Please enter a valid OTP');
                return;
            }
            setStep(3); // Move to new password step
            return;
        }

        if (step === 3) {
            if (newPassword !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                setError("Password must contain at least one letter, one number, and one special character (@$!%*?&)");
                return;
            }

            setIsLoading(true);

            try {
                const response = await api.post('/reset-password', {
                    email,
                    otp,
                    newPassword
                });

                setSuccess(response.data.message || 'Password reset successful!');

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to reset password. OTP might be invalid or expired.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Elite Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#C8A96A]/5 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[130px] animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-md w-full relative z-10 animate-fade-in">
                <div className="bg-[#1A1A1A] rounded-[2.5rem] shadow-4xl overflow-hidden border border-[#C8A96A]/10 group hover:border-[#C8A96A]/20 transition-all duration-700">

                    {/* Top Aesthetic Bar */}
                    <div className="h-1.5 bg-gradient-to-r from-[#C8A96A] via-[#D4AF37] to-[#C8A96A] w-full" />

                    <div className="p-10">
                        {/* Header Architecture */}
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-[#0D0D0D] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C8A96A]/20 shadow-[0_0_30px_rgba(200,169,106,0.1)] group-hover:shadow-[0_0_50px_rgba(200,169,106,0.2)] transition-shadow duration-700">
                                {step === 1 && <Mail className="w-10 h-10 text-[#C8A96A]" />}
                                {step === 2 && <ShieldCheck className="w-10 h-10 text-[#C8A96A]" />}
                                {step === 3 && <Lock className="w-10 h-10 text-[#C8A96A]" />}
                            </div>

                            <h2 className="text-3xl font-serif font-bold text-[#F5E6C8] mb-3 tracking-tight">
                                {step === 1 ? (
                                    <>Credential <span className="text-[#C8A96A]">Recovery</span></>
                                ) : step === 2 ? (
                                    <>Security <span className="text-[#C8A96A]">Mandate</span></>
                                ) : (
                                    <>Access <span className="text-[#C8A96A]">Restoration</span></>
                                )}
                            </h2>
                            <p className="text-[#C8A96A]/60 text-[10px] font-black uppercase tracking-[0.2em]">
                                {step === 1 && "Initiate identity reclamation via digital mail."}
                                {step === 2 && `Authorize mandate dispatched to ${email}`}
                                {step === 3 && "Establish a superior security commitment."}
                            </p>
                        </div>

                        {/* Error & Success Proclamations */}
                        {error && (
                            <div className="mb-6 p-5 bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-slide-up flex items-center justify-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-5 bg-[#C8A96A]/10 border border-[#C8A96A]/30 text-[#C8A96A] rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-slide-up flex items-center justify-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-pulse"></div>
                                {success}
                            </div>
                        )}

                        {/* FORM START */}
                        <form onSubmit={step === 1 ? handleSendOTP : handleResetPassword}>

                            {/* STEP 1: EMAIL INPUT */}
                            {step === 1 && (
                                <div className="space-y-3 mb-8 animate-slide-left group/input">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]">Establish Identity</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#C8A96A]/40 group-focus-within/input:text-[#C8A96A] transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="Vault Address (Email)"
                                            className="w-full pl-14 pr-6 py-4 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl text-[#F5E6C8] font-medium placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] focus:ring-4 focus:ring-[#C8A96A]/10 outline-none transition-all shadow-2xl"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: OTP MANDATE INPUT */}
                            {step === 2 && (
                                <div className="space-y-4 mb-8 animate-slide-left">
                                    <div className="space-y-3 group/input">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]">Authorization Mandate (6-Digits)</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#C8A96A]/40 group-focus-within/input:text-[#C8A96A] transition-colors" />
                                            <input
                                                type="text"
                                                maxLength="6"
                                                value={otp}
                                                onChange={(e) => {
                                                    setOtp(e.target.value.replace(/[^0-9]/g, ''));
                                                    setError('');
                                                }}
                                                placeholder="000 000"
                                                className="w-full pl-14 pr-6 py-4 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl text-[#F5E6C8] text-xl tracking-[0.5em] font-serif font-bold placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] focus:ring-4 focus:ring-[#C8A96A]/10 outline-none transition-all shadow-2xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center px-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/40 hover:text-[#C8A96A] transition-colors"
                                        >
                                            Modify Identity
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={isLoading}
                                            className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A] hover:text-[#D4AF37] hover:underline underline-offset-4"
                                        >
                                            Re-Dispatch Mandate
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: NEW SECURITY COMMITMENT */}
                            {step === 3 && (
                                <div className="space-y-6 mb-8 animate-slide-left">
                                    <div className="space-y-3 group/input">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]">Superior Security Mandate</label>
                                        <div className="relative">
                                            <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#C8A96A]/40 group-focus-within/input:text-[#C8A96A] transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => {
                                                    setNewPassword(e.target.value);
                                                    setError('');
                                                }}
                                                placeholder="••••••••"
                                                className="w-full pl-14 pr-14 py-4 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl text-[#F5E6C8] font-medium placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] focus:ring-4 focus:ring-[#C8A96A]/10 outline-none transition-all shadow-2xl"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[#C8A96A]/40 hover:text-[#C8A96A] transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 group/input">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#C8A96A]">Confirm Mandate</label>
                                        <div className="relative">
                                            <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#C8A96A]/40 group-focus-within/input:text-[#C8A96A] transition-colors" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value);
                                                    setError('');
                                                }}
                                                placeholder="••••••••"
                                                className="w-full pl-14 pr-14 py-4 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl text-[#F5E6C8] font-medium placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] focus:ring-4 focus:ring-[#C8A96A]/10 outline-none transition-all shadow-2xl"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SUBMIT SECTION - ELITE EDITION */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full relative group/btn overflow-hidden py-5 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black text-sm tracking-[0.2em] uppercase rounded-2xl transition-all duration-500 shadow-2xl shadow-[#C8A96A]/20 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[#C8A96A]/40 hover:-translate-y-1 active:scale-[0.98]'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-bounce delay-200"></div>
                                        </span>
                                    ) : (
                                        <>
                                            {step === 1 ? 'Dispatch Mandate' : step === 2 ? 'Authorize Mandate' : 'Establish Access'}
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Return to Login */}
                        <div className="mt-10 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#F5E6C8]/40 hover:text-[#C8A96A] transition-all group/return"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover/return:-translate-x-1 transition-transform" />
                                Return to Authenticate
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slide-left {
                    from { opacity: 0; transform: translateX(10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-left {
                    animation: slide-left 0.3s ease-out forwards;
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
