import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Smartphone, Zap, Search, MapPin, Globe, Shield } from 'lucide-react';

const RechargeSection = ({
    mobileNumber, setMobileNumber,
    operator, setOperator,
    circle, setCircle,
    circles = [],
    amount, setAmount,
    operators,
    openPlanPopup,
    handleRecharge,
    plansLoading = false,
    isDetectingOperator = false,
    hasTriedDetection = false
}) => {
    return (
        <section className="py-8 md:py-16 bg-[#0D0D0D] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(200,169,106,0.05),transparent_50%)]"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-center">
                    
                    {/* LEFT: Premium Informational Content */}
                    <div className="lg:col-span-2 space-y-5 order-2 lg:order-1 text-center lg:text-left">
                        <Motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-[#C8A96A]/10 border border-[#C8A96A]/20 rounded-full mb-2">
                                <Zap className="w-3.5 h-3.5 text-[#C8A96A]" />
                                <span className="text-[#C8A96A] font-bold text-[10px] uppercase tracking-[0.3em]">Sanyukt Digital</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-[#F5E6C8] leading-[1.1]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                Digital Freedom, <br />
                                <span className="text-[#C8A96A] italic">Reimagined</span>
                            </h2>
                            
                            <p className="text-[#F5E6C8]/60 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Experience the pinnacle of transaction speed. Our premium recharge suite is integrated seamlessly into the Sanyukt ecosystem, providing absolute transparency and vault-grade security for your digital life.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-4">
                                {[
                                    { icon: Zap, title: "Instant Fulfillment", desc: "Transactions verified in milliseconds." },
                                    { icon: Shield, title: "Vault Security", desc: "Bank-level encryption for every payment." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-none bg-[#1A1A1A]/40 border border-[#C8A96A]/10 hover:border-[#C8A96A]/30 transition-all group">
                                        <div className="w-10 h-10 rounded-none bg-[#C8A96A]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C8A96A]/20 transition-colors">
                                            <item.icon className="w-5 h-5 text-[#C8A96A]" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="text-[#F5E6C8] font-bold text-sm tracking-wide uppercase">{item.title}</h4>
                                            <p className="text-[#F5E6C8]/40 text-[11px] mt-1 leading-snug">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Motion.div>
                    </div>

                    {/* RIGHT: Recharge Form */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#111111] p-4 sm:p-6 md:p-10 rounded-none border border-[#C8A96A]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        >
                            {/* Form Header */}
                            <div className="mb-3.5 text-center lg:text-left">
                                <h3 className="text-xl md:text-3xl font-serif font-bold text-[#C8A96A]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                    Mobile <span className="text-[#F5E6C8]">Recharge</span>
                                </h3>
                                <p className="text-[10px] md:text-sm text-[#F5E6C8]/60 font-bold uppercase tracking-[0.3em] mt-1">Enter details to initiate fast recharge</p>
                            </div>

                            <form onSubmit={handleRecharge} className="space-y-3.5 md:space-y-6">
                                {/* Mobile Number */}
                                <div className="space-y-1.5 md:space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] md:text-sm font-black text-[#C8A96A] uppercase tracking-[0.3em]">
                                        <Smartphone className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        maxLength="10"
                                        placeholder="Enter 10-digit number"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-6 py-2.5 md:py-4 bg-[#0D0D0D] border-2 border-[#C8A96A]/20 rounded-none text-[#F5E6C8] text-lg md:text-2xl font-black focus:border-[#C8A96A] outline-none transition-all shadow-inner placeholder:text-gray-700"
                                        required
                                    />
                                </div>

                                {/* Network & Circle Grid */}
                                <div className="grid md:grid-cols-2 gap-3.5 md:gap-6">
                                    <div className="space-y-1.5 md:space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] md:text-sm font-black text-[#C8A96A] uppercase tracking-[0.3em]">
                                            <Globe className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                            Network
                                        </label>
                                        <div className="grid grid-cols-4 gap-1.5 md:gap-3">
                                            {operators.map((op) => (
                                                <div key={op.id} className="flex flex-col items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOperator(op.id)}
                                                        className={`w-full aspect-square flex items-center justify-center rounded-none border-2 transition-all group overflow-hidden ${
                                                            operator === op.id
                                                                ? 'border-[#C8A96A] bg-white'
                                                                : 'border-white/5 bg-white/5 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        <img 
                                                            src={op.logo} 
                                                            alt={op.name} 
                                                            className={`w-7 h-7 md:w-12 md:h-12 object-contain transition-all duration-300 ${
                                                                operator === op.id 
                                                                    ? 'scale-110' 
                                                                    : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'
                                                            }`} 
                                                        />
                                                    </button>
                                                    <span className={`text-[8px] md:text-[11px] font-black uppercase tracking-[0.1em] text-center transition-colors ${
                                                        operator === op.id ? 'text-[#C8A96A]' : 'text-white/40'
                                                    }`}>
                                                        {op.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 md:space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] md:text-sm font-black text-[#C8A96A] uppercase tracking-[0.3em]">
                                            <MapPin className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                            Circle
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={circle}
                                                onChange={(e) => setCircle(e.target.value)}
                                                className="w-full px-6 py-2.5 md:py-3.5 bg-[#0D0D0D] border-2 border-[#C8A96A]/20 rounded-none text-[#F5E6C8] font-black focus:border-[#C8A96A] outline-none appearance-none transition-all text-sm md:text-lg"
                                            >
                                                {circles.map((c) => (
                                                    <option key={c.code} value={c.code} className="bg-[#111111]">
                                                        {c.name.replace(/_/g, ' ')} ({c.code})
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#C8A96A]">
                                                <Search className="w-4 h-4 opacity-40" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="space-y-1.5 md:space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center gap-2 text-[10px] md:text-sm font-black text-[#C8A96A] uppercase tracking-[0.3em]">
                                            <Zap className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                            Amount (₹)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={openPlanPopup}
                                            className="text-[11px] md:text-xs font-black text-[#C8A96A] hover:text-[#F5E6C8] transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
                                        >
                                            <Search className="w-3 h-3" /> Catalog
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full px-6 py-3 md:py-4 bg-[#0D0D0D] border-2 border-[#C8A96A]/20 rounded-none text-[#C8A96A] text-2xl md:text-5xl font-black text-center focus:border-[#C8A96A] outline-none transition-all placeholder:text-gray-800"
                                            required
                                        />
                                    </div>
                                    {plansLoading && (
                                        <p className="text-[10px] text-[#C8A96A] font-bold uppercase tracking-[0.2em] animate-pulse text-center">
                                            Syncing live catalogs...
                                        </p>
                                    )}
                                    {isDetectingOperator && (
                                        <p className="text-[10px] text-[#C8A96A]/80 font-bold uppercase tracking-[0.2em] animate-pulse text-center">
                                            Detecting network and circle...
                                        </p>
                                    )}
                                    {hasTriedDetection && !isDetectingOperator && !operator && (
                                        <p className="text-[10px] text-[#F5E6C8]/55 font-bold uppercase tracking-[0.2em] text-center">
                                            Auto-detect unavailable. Please select network manually.
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full py-3 md:py-5 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#000000] rounded-none font-black uppercase tracking-[0.4em] text-xs md:text-sm hover:shadow-[0_15px_40px_rgba(200,169,106,0.2)] transition-all active:scale-[0.98] shadow-xl"
                                >
                                    Recharge Now
                                </button>
                            </form>
                        </Motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RechargeSection;
