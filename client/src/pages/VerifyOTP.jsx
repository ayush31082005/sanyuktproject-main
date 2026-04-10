import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, ArrowLeft, ArrowRight, Clock, RefreshCw } from 'lucide-react';
import api from '../api';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const { email, mobile } = location.state || {};

    useEffect(() => {
        if (!email && !mobile) {
            navigate('/register');
        }
    }, [email, mobile, navigate]);

    // Timer for resend OTP
    useEffect(() => {
        let interval;
        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, canResend]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto focus next input
        if (element.value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const pastedOtp = pastedData.split('');
            const newOtp = [...otp];
            pastedOtp.forEach((value, index) => {
                if (index < 6) newOtp[index] = value;
            });
            setOtp(newOtp);

            // Focus last filled input
            const lastIndex = Math.min(pastedOtp.length, 5);
            document.getElementById(`otp-${lastIndex}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter complete 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/verify-otp', {
                email,
                otp: otpString
            });

            setSuccess('OTP verified successfully! Redirecting to login...');

            // Clear OTP from storage
            localStorage.removeItem('registrationEmail');
            localStorage.removeItem('registrationMobile');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
            // Clear OTP inputs
            setOtp(['', '', '', '', '', '']);
            document.getElementById('otp-0').focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setResendLoading(true);
        setError('');

        try {
            await api.post('/resend-otp', { email });
            setSuccess('New OTP sent successfully!');
            setTimer(60);
            setCanResend(false);
            // Clear OTP inputs
            setOtp(['', '', '', '', '', '']);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    if (!email && !mobile) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Elegant Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-[#C8A96A]/5 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            <div className="max-w-md w-full relative z-10 animate-fade-in">
                {/* Back Button - Deluxe Edition */}
                <button
                    onClick={() => navigate('/register')}
                    className="flex items-center text-[#C8A96A]/60 hover:text-[#C8A96A] transition-all mb-8 group/back"
                >
                    <div className="p-2 bg-[#1A1A1A] border border-[#C8A96A]/10 rounded-lg group-hover/back:border-[#C8A96A]/30 transition-colors mr-3">
                        <ArrowLeft className="h-4 w-4 transform group-hover/back:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Origins</span>
                </button>

                {/* Main OTP Card */}
                <div className="bg-[#1A1A1A] rounded-[2.5rem] shadow-4xl overflow-hidden border border-[#C8A96A]/10 group hover:border-[#C8A96A]/20 transition-all duration-700">
                    {/* Header - Elite Gold */}
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] px-8 py-10 text-center relative overflow-hidden border-b border-[#C8A96A]/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-full blur-3xl"></div>
                        
                        <div className="w-20 h-20 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(200,169,106,0.3)] group-hover:shadow-[0_0_50px_rgba(200,169,106,0.5)] transition-shadow duration-700">
                            <Mail className="h-10 w-10 text-[#0D0D0D]" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-[#F5E6C8] tracking-tight mb-3">
                            Identity <span className="text-[#C8A96A]">Verification</span>
                        </h2>
                        <p className="text-[#C8A96A]/60 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Verification mandate dispatched to</p>
                        <div className="inline-block px-4 py-1.5 bg-[#C8A96A]/5 border border-[#C8A96A]/20 rounded-full">
                            <p className="text-[#C8A96A] font-serif italic text-sm">
                                {email || mobile}
                            </p>
                        </div>
                    </div>

                    {/* OTP Form */}
                    <div className="p-8 md:p-10">
                        {/* Success Message */}
                        {success && (
                            <div className="mb-8 p-5 bg-[#C8A96A]/10 border border-[#C8A96A]/30 text-[#C8A96A] rounded-2xl animate-slide-down text-sm font-bold flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[#C8A96A] animate-pulse"></div>
                                {success}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-8 p-5 bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl animate-slide-down text-sm font-bold flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* OTP Input Fields */}
                            <div className="mb-10">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#C8A96A] mb-6 text-center">
                                    Authorization Mandate (6-Digits)
                                </label>
                                <div className="flex gap-3 justify-center">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength="1"
                                            value={data}
                                            onChange={(e) => handleChange(e.target, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            className="w-12 h-16 text-center text-2xl font-serif font-bold bg-[#0D0D0D] border-2 border-[#C8A96A]/20 rounded-2xl text-[#C8A96A] focus:border-[#C8A96A] focus:ring-4 focus:ring-[#C8A96A]/10 outline-none transition-all duration-300 shadow-2xl"
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Timer and Resend */}
                            <div className="flex items-center justify-between mb-10 px-2">
                                <div className="flex items-center text-[#F5E6C8]/40">
                                    <Clock className="h-4 w-4 mr-2 text-[#C8A96A]/60" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {canResend ? 'Mandate Revivable' : `Window: ${timer}s`}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={!canResend || resendLoading}
                                    className={`flex items-center text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${canResend && !resendLoading
                                        ? 'text-[#C8A96A] hover:text-[#D4AF37] hover:underline'
                                        : 'text-[#F5E6C8]/20 cursor-not-allowed'
                                        }`}
                                >
                                    <RefreshCw className={`h-3 w-3 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
                                    {resendLoading ? 'Re-Dispatching...' : 'Request New Mandate'}
                                </button>
                            </div>

                            {/* Verify Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full relative group/btn overflow-hidden py-5 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black text-sm tracking-[0.2em] uppercase rounded-2xl transition-all duration-500 shadow-2xl shadow-[#C8A96A]/20 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[#C8A96A]/40 hover:-translate-y-1 active:scale-[0.98]'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-bounce delay-100"></div>
                                            <div className="w-1.5 h-1.5 bg-[#0D0D0D] rounded-full animate-bounce delay-200"></div>
                                        </span>
                                    ) : (
                                        <>Authorize Identity <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></>
                                    )}
                                </span>
                            </button>

                            {/* Help Text */}
                            <p className="text-center text-[10px] text-[#F5E6C8]/40 mt-8 font-black uppercase tracking-widest">
                                Communication silence? Check junk archives or{' '}
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={!canResend || resendLoading}
                                    className="text-[#C8A96A] hover:text-[#D4AF37] transition-colors font-black border-b border-[#C8A96A]/0 hover:border-[#C8A96A]/100 ml-1"
                                >
                                    Request Mandate
                                </button>
                            </p>

                            {/* Contact Support */}
                            <div className="mt-10 pt-8 border-t border-[#C8A96A]/10">
                                <p className="text-center text-[10px] text-[#F5E6C8]/40 font-black uppercase tracking-widest">
                                    Encountering Friction?{' '}
                                    <Link to="/contact" className="text-[#C8A96A] hover:text-[#D4AF37] font-black ml-2 underline underline-offset-4">
                                        Summon Support
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Security Note */}
            </div>
        </div>
    );
};

export default VerifyOTP;
