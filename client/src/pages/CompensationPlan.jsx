import React from 'react';
import { motion as Motion } from 'framer-motion';
import {
    ChevronRight, Award, Zap, Star, Shield, Gift,
    TrendingUp, Briefcase, Target, Rocket, CheckCircle2,
    DollarSign, Users, PieChart, Info, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CompensationPlan = () => {
    // We use the dark theme colors now.
    const packages = [
        { name: "Basic", price: "₹599", bv: "250", pv: "0.25", capping: "₹2,000/Day" },
        { name: "Standard", price: "₹1,299", bv: "500", pv: "0.5", capping: "₹4,000/Day" },
        { name: "Premium", price: "₹2,699", bv: "1,000", pv: "1", capping: "₹10,000/Day" }
    ];

    const levelIncome = [
        { level: "1", amount: "₹50" }, { level: "2", amount: "₹40" },
        { level: "3", amount: "₹30" }, { level: "4", amount: "₹20" },
        { level: "5-6", amount: "₹10" }, { level: "7-10", amount: "₹5" },
        { level: "11-12", amount: "₹4" }, { level: "13-18", amount: "₹3" },
        { level: "19-20", amount: "₹2" }
    ];

    const rewards = [
        { rank: "Bronze", target: "5PV : 5PV", reward: "Company Catalog" },
        { rank: "Silver", target: "25PV : 25PV", reward: "₹1,200 Cash" },
        { rank: "Gold", target: "50PV : 50PV", reward: "₹2,500 Cash" },
        { rank: "Platinum", target: "100PV : 100PV", reward: "₹5,000 + North Trip" },
        { rank: "Star", target: "200PV : 200PV", reward: "₹10,000 + North Trip" },
        { rank: "Ruby", target: "500PV : 500PV", reward: "₹50,000 Cash" },
        { rank: "Sapphire", target: "1000PV : 1000PV", reward: "₹1 Lakh + India Trip" },
        { rank: "Emerald", target: "6000PV : 6000PV", reward: "₹7 Lakh Cash" },
        { rank: "Diamond", target: "30,000PV", reward: "₹10 Lakh Cash" },
        { rank: "Blue Diamond", target: "125k PV", reward: "₹30 Lakh Cash" },
        { rank: "MD", target: "1500k PV", reward: "₹5 Crore House" }
    ];

    return (
        <div className="bg-[#0D0D0D] min-h-screen font-sans pb-24 text-[#F5E6C8]">
            {/* Professional Header Section */}
            <div className="bg-[#1A1A1A] py-24 px-4 text-white relative overflow-hidden border-b border-[#C8A96A]/20">
                {/* Subtle Grid Background Pattern */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C8A96A]/5 rounded-full blur-[100px] pointer-events-none -mt-40 -mr-40"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none -mb-40 -ml-40"></div>
                
                <Container className="max-w-6xl mx-auto text-center relative z-10">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block px-5 py-2 bg-[#C8A96A]/10 backdrop-blur-md rounded-lg text-sm font-bold uppercase tracking-widest mb-6 text-[#C8A96A] border border-[#C8A96A]/20">
                            Transparent & Profitable
                        </span>
                        <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 tracking-tight leading-[1.1] text-[#F5E6C8]">
                            Business <span className="text-[#C8A96A]">Compensation</span> Plan
                        </h1>
                        <p className="text-xl text-[#F5E6C8]/60 max-w-3xl mx-auto font-medium leading-relaxed">
                            A mathematically proven, career-oriented reward system designed for sustainable wealth and financial freedom.
                        </p>
                    </Motion.div>
                </Container>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-16 relative z-20">
                {/* 1. Joining Packages Card Section */}
                <section className="mb-24">
                    <div className="flex items-center justify-between mb-10 bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border-l-8 border-[#C8A96A]">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#F5E6C8] tracking-tight">Joining Packages</h2>
                            <p className="text-[#C8A96A]/60 font-medium">Choose your entry gateway to success</p>
                        </div>
                        <div className="w-14 h-14 bg-[#0D0D0D] rounded-xl flex items-center justify-center text-[#C8A96A] border border-[#C8A96A]/20">
                            <Briefcase className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {packages.map((pkg, i) => (
                            <Motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[#1A1A1A] rounded-3xl p-10 shadow-2xl border border-[#C8A96A]/10 flex flex-col relative group hover:border-[#C8A96A]/30 transition-colors"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A96A]/5 rounded-bl-[100px] -z-0"></div>
                                <h3 className="text-sm font-bold text-[#C8A96A] uppercase tracking-[0.2em] mb-2 relative z-10">{pkg.name}</h3>
                                <div className="text-5xl font-black text-[#F5E6C8] mb-8 tracking-tighter relative z-10">{pkg.price}</div>

                                <div className="space-y-3 mb-8 relative z-10">
                                    <div className="flex items-center justify-between py-3 border-b border-[#C8A96A]/10">
                                        <span className="text-sm font-semibold text-[#F5E6C8]/60">Business Volume (BV)</span>
                                        <span className="font-bold text-[#F5E6C8]">{pkg.bv}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-[#C8A96A]/10">
                                        <span className="text-sm font-semibold text-[#F5E6C8]/60">Point Value (PV)</span>
                                        <span className="font-bold text-[#F5E6C8]">{pkg.pv}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 bg-[#C8A96A]/10 px-4 rounded-xl mt-4">
                                        <span className="text-xs font-black text-[#C8A96A] uppercase tracking-wider">Capping Limits</span>
                                        <span className="font-black text-[#C8A96A]">{pkg.capping}</span>
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                </section>

                {/* 2. Direct & Level Income Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                    {/* Direct Referral Bonus */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] rounded-xl flex items-center justify-center text-[#0D0D0D]">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-[#F5E6C8] tracking-tight">Direct Bonus</h2>
                        </div>
                        <div className="bg-[#1A1A1A] rounded-3xl p-12 shadow-2xl border border-[#C8A96A]/10 text-center relative overflow-hidden h-full flex flex-col justify-center items-center group hover:border-[#C8A96A]/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <DollarSign size={120} className="text-[#C8A96A]" />
                            </div>
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#C8A96A]/10 rounded-full mb-6">
                                <DollarSign className="w-12 h-12 text-[#C8A96A]" />
                            </div>
                            <div className="text-6xl font-black text-[#F5E6C8] mb-2 tracking-tighter z-10">₹50 <span className="text-2xl text-[#C8A96A]/60">Fixed</span></div>
                            <p className="text-lg font-bold text-[#C8A96A] uppercase tracking-widest mb-8 z-10">Per Active Referral</p>
                            <div className="py-3 px-6 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-full inline-flex items-center gap-2 text-[#F5E6C8]/80 font-bold text-sm z-10">
                                <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
                                Valid for all package activations
                            </div>
                        </div>
                    </section>

                    {/* Team Level Income */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#1A1A1A] border border-[#C8A96A]/20 rounded-xl flex items-center justify-center text-[#C8A96A]">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-[#F5E6C8] tracking-tight">Team Level Income</h2>
                        </div>
                        <div className="bg-[#1A1A1A] rounded-3xl p-8 shadow-2xl border border-[#C8A96A]/10 h-full flex flex-col justify-center">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {levelIncome.map((li, i) => (
                                    <div key={i} className="p-5 bg-[#0D0D0D] border border-[#C8A96A]/10 rounded-2xl group hover:border-[#C8A96A]/40 transition-all">
                                        <div className="text-[10px] font-black text-[#C8A96A]/60 uppercase mb-1 tracking-widest">Level {li.level}</div>
                                        <div className="text-2xl font-black text-[#F5E6C8] group-hover:text-[#C8A96A] transition-colors">{li.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* 3. Matching Income Banner */}
                <section className="mb-24">
                    <div className="bg-[#1A1A1A] rounded-[3rem] p-12 text-[#F5E6C8] relative overflow-hidden border border-[#C8A96A]/20 shadow-2xl">
                        <div className="absolute left-0 top-0 w-32 h-full bg-[#C8A96A]/5 skew-x-[-15deg] -translate-x-12 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C8A96A]/5 blur-[80px] rounded-full pointer-events-none -mt-32 -mr-32"></div>
                        
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                            <div className="md:w-1/3">
                                <div className="text-[#C8A96A] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2 text-sm">
                                    <PieChart className="w-5 h-5" />
                                    Binary Power
                                </div>
                                <h2 className="text-4xl font-serif font-bold mb-4 leading-tight tracking-tight text-[#F5E6C8]">Binary Match Income</h2>
                                <p className="text-[#C8A96A]/60 font-medium">Earn significantly from team balancing and performance.</p>
                            </div>
                            
                            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                                {[
                                    { label: "Starter", ratio: "0.25 : 0.25", profit: "₹100" },
                                    { label: "Growth", ratio: "0.5 : 0.5", profit: "₹200" },
                                    { label: "Executive", ratio: "1 : 1", profit: "₹400" }
                                ].map((m, i) => (
                                    <div key={i} className="bg-[#0D0D0D] border border-[#C8A96A]/10 rounded-2xl p-6 text-center hover:border-[#C8A96A]/30 hover:bg-[#1A1A1A] transition-all cursor-default">
                                        <div className="text-xs font-bold text-[#C8A96A]/60 uppercase mb-3 tracking-widest">{m.label}</div>
                                        <div className="text-lg font-black mb-1 text-[#F5E6C8]/80">{m.ratio}</div>
                                        <div className="text-3xl font-black text-[#C8A96A]">{m.profit}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Lifestyle Rewards Table */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] rounded-2xl flex items-center justify-center text-[#0D0D0D] shadow-lg shadow-gold-900/20">
                            <Award className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-[#F5E6C8] tracking-tight">Lifestyle Rewards</h2>
                            <p className="text-[#C8A96A]/60 font-medium tracking-wide">Achieve Ranks & Earn Global Assets</p>
                        </div>
                    </div>
                    
                    <div className="bg-[#1A1A1A] rounded-3xl shadow-2xl border border-[#C8A96A]/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#0D0D0D] border-b border-[#C8A96A]/20">
                                        <th className="px-10 py-7 text-xs font-black text-[#C8A96A]/80 uppercase tracking-widest">Global Rank</th>
                                        <th className="px-10 py-7 text-xs font-black text-[#C8A96A]/80 uppercase tracking-widest text-center">Milestone Target</th>
                                        <th className="px-10 py-7 text-xs font-black text-[#C8A96A]/80 uppercase tracking-widest text-right">Lifestyle Reward</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#C8A96A]/10 text-white">
                                    {rewards.map((r, i) => (
                                        <tr key={i} className="hover:bg-[#C8A96A]/5 transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <span className="w-10 h-10 bg-[#0D0D0D] rounded-lg flex items-center justify-center text-[#C8A96A]/60 font-black text-xs border border-[#C8A96A]/20 group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-colors">
                                                        {(i + 1).toString().padStart(2, '0')}
                                                    </span>
                                                    <span className="font-bold text-[#F5E6C8] text-lg">{r.rank}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="px-4 py-1.5 bg-[#0D0D0D] border border-[#C8A96A]/10 rounded-lg text-xs font-bold text-[#F5E6C8]/80 uppercase tracking-wider">
                                                    {r.target}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right font-black text-[#C8A96A] text-lg">
                                                <div className="flex items-center justify-end gap-2 group-hover:translate-x-[-5px] transition-transform">
                                                    {r.reward}
                                                    <ArrowUpRight className="w-5 h-5 text-[#C8A96A] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Secure Call to Action */}
                <Motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="max-w-4xl mx-auto rounded-[3rem] p-1 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]"
                >
                    <div className="bg-[#1A1A1A] rounded-[2.9rem] p-12 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#C8A96A]/10 blur-[100px] rounded-full pointer-events-none"></div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#F5E6C8] mb-6 tracking-tight relative z-10">Ready to Start Your Journey?</h2>
                        <p className="text-lg text-[#F5E6C8]/60 mb-10 max-w-2xl mx-auto font-medium relative z-10">Join Sanyukt Parivaar today and take the first step towards a sustainable business future.</p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-gold-900/30 transition-all flex items-center justify-center gap-3 hover:scale-105"
                            >
                                Get Started Now
                                <Rocket className="w-6 h-6" />
                            </Link>
                            <Link
                                to="/contact"
                                className="w-full sm:w-auto px-10 py-5 border border-[#C8A96A]/30 text-[#F5E6C8] rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#C8A96A]/10 transition-all flex items-center justify-center gap-3 hover:scale-105"
                            >
                                Contact Support
                                <Info className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </Motion.div>
            </div>
        </div>
    );
};

// Helper Container for cleaner code
const Container = ({ children, className }) => (
    <div className={`max-w-7xl mx-auto ${className}`}>
        {children}
    </div>
);

export default CompensationPlan;
