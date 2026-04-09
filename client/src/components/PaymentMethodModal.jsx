import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';

const PaymentMethodModal = ({ 
    isOpen, 
    onClose, 
    onSelect, 
    amount, 
    walletBalance, 
    isProcessing 
}) => {
    if (!isOpen) return null;

    const canPayWithWallet = walletBalance >= amount;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <Motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[#1A1A1A] rounded-[32px] w-full max-w-md overflow-hidden flex flex-col shadow-2xl border border-[#C8A96A]/20"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-[#C8A96A]/10 flex justify-between items-center bg-[#0D0D0D]">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-[#F5E6C8] uppercase tracking-wider">Payment Method</h3>
                            <p className="text-[10px] text-[#C8A96A] font-bold uppercase tracking-widest mt-1 italic">Choose how you want to pay</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            disabled={isProcessing}
                            className="w-10 h-10 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#0D0D0D] transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Summary */}
                        <div className="bg-[#C8A96A]/5 rounded-2xl p-6 border border-[#C8A96A]/20 flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#C8A96A] uppercase tracking-widest">Total Payable</span>
                            <span className="text-3xl font-serif font-bold text-[#C8A96A]">₹{amount}</span>
                        </div>

                        {/* Wallet Option */}
                        <Motion.button
                            whileHover={canPayWithWallet && !isProcessing ? { x: 5 } : {}}
                            whileTap={canPayWithWallet && !isProcessing ? { scale: 0.98 } : {}}
                            onClick={() => canPayWithWallet && onSelect('wallet')}
                            disabled={!canPayWithWallet || isProcessing}
                            className={`w-full p-5 rounded-[24px] border border-[#C8A96A]/10 transition-all flex items-center justify-between relative group ${
                                canPayWithWallet 
                                    ? 'bg-[#0D0D0D] hover:border-[#C8A96A] cursor-pointer' 
                                    : 'bg-[#1A1A1A]/50 cursor-not-allowed opacity-40'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                                    canPayWithWallet ? 'bg-[#C8A96A]/10 text-[#C8A96A]' : 'bg-[#1A1A1A] text-[#F5E6C8]/20'
                                }`}>
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-[#F5E6C8] uppercase text-xs tracking-wider">Sanyukt Wallet</div>
                                    <div className={`text-[10px] font-bold ${canPayWithWallet ? 'text-[#C8A96A]' : 'text-red-400'}`}>
                                        Balance: ₹{walletBalance?.toFixed(2)}
                                        {!canPayWithWallet && " (Insufficient)"}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className={`w-5 h-5 transition-colors ${canPayWithWallet ? 'text-[#C8A96A]/30 group-hover:text-[#C8A96A]' : 'text-[#F5E6C8]/10'}`} />
                            
                            {canPayWithWallet && (
                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] text-[8px] font-bold px-2 py-1 rounded-lg shadow-lg uppercase">Fastest</div>
                            )}
                        </Motion.button>

                        {/* Razorpay Option */}
                        <Motion.button
                            whileHover={!isProcessing ? { x: 5 } : {}}
                            whileTap={!isProcessing ? { scale: 0.98 } : {}}
                            onClick={() => onSelect('online')}
                            disabled={isProcessing}
                            className={`w-full p-5 rounded-[24px] border border-[#C8A96A]/10 hover:border-[#C8A96A] bg-[#0D0D0D] cursor-pointer transition-all flex items-center justify-between group ${
                                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#C8A96A]/10 text-[#C8A96A] flex items-center justify-center shadow-sm">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-[#F5E6C8] uppercase text-xs tracking-wider">Online Payment</div>
                                    <div className="text-[10px] font-bold text-[#F5E6C8]/40 uppercase tracking-tighter">UPI, Cards, Net Banking</div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-[#C8A96A]/30 group-hover:text-[#C8A96A] transition-colors" />
                        </Motion.button>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-[#0D0D0D]/50 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#F5E6C8]/30 uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
                            100% Secure & Encrypted Payment
                        </div>
                        {isProcessing && (
                            <div className="flex items-center gap-2 text-[10px] font-bold text-[#C8A96A] uppercase animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-[#C8A96A]"></div>
                                Processing transaction...
                            </div>
                        )}
                    </div>
                </Motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentMethodModal;
