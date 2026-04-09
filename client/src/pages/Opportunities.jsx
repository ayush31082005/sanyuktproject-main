import React from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight,
    Award,
    Users,
    Globe,
    Clock,
    TrendingUp,
    Shield,
    Star,
    Heart,
    Briefcase,
    Target,
    Zap,
    BarChart3,
    Gift,
    Crown,
    Rocket,
    CheckCircle,
    ExternalLink
} from 'lucide-react';

const OpportunitiesPage = () => {
    const benefits = [
        "Be your own Boss. You decide your effort & time to get business- 'Full time or Part time'.",
        "You choose people with whom you'd like to work.",
        "You can decide to expand your business in other State/City/Town.",
        "Own choice of lifestyle on own terms."
    ];

    const whySayuktParivar = [
        "Experienced, humble and reliable management",
        "World class products at affordable price",
        "Growth oriented marketing plan",
        "Effective services and customer support",
        "Top notch education and training support system",
        "Mentorship and Leadership support from company Founder Leadership and Top Leadership"
    ];

    const compensationBenefits = [
        {
            title: "Long-Term Visionary Growth Plan",
            description: "A strategic compensation system designed to support your financial growth for the long run, helping you build sustainable income and future wealth."
        },
        {
            title: "Lifetime & Legacy Benefits",
            description: "Our plan is structured to support you throughout your life while also creating financial advantages that can benefit your family in the future."
        },
        {
            title: "International Standard System",
            description: "Built according to global direct selling standards, ensuring transparency, reliability, and professional business practices."
        },
        {
            title: "Fast-Track Income Opportunity",
            description: "A dynamic earning model that allows members to start generating income quickly through active participation and network growth."
        },
        {
            title: "Industry-Leading Rewards & Commissions",
            description: "Enjoy competitive commissions, attractive bonuses, and a rewarding distribution structure designed to maximize your earning potential."
        },
        {
            title: "Performance-Based Growth System",
            description: "Your rewards increase as your performance grows, recognizing dedication, teamwork, and long-term contribution to the network."
        }
    ];

    return (
        <div className="bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 pb-1 relative overflow-hidden">
            {/* Elegant Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#C8A96A]/5 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            {/* Hero Banner */}
            <header className="relative h-[180px] md:h-[220px] bg-cover bg-center border-b border-[#C8A96A]/20"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/40"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
                    <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-serif font-black text-[#C8A96A] mb-4 animate-slide-up uppercase tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em] lg:tracking-[0.5em] leading-tight">
                        OPPORTUNITIES
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent"></div>
                </div>
            </header>

            {/* Main Content */}
            <section className="py-4 px-3 max-w-7xl mx-auto relative z-10">
                {/* Benefits of Direct Selling */}
                <div className="mb-4 animate-slide-up">
                    <div className="luxury-box">
                        <div className="bg-[#121212] p-3 text-[#C8A96A] border-b border-[#C8A96A]/30">
                            <h2 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
                                <Award className="w-6 h-6" />
                                BENEFITS OF DIRECT SELLING
                            </h2>
                        </div>
                        <div className="p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 p-3 bg-[#1A1A1A] border border-[#C8A96A]/10 hover:border-[#C8A96A]/40 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <CheckCircle className="w-5 h-5 text-[#C8A96A] flex-shrink-0 mt-0.5" />
                                        <p className="text-[#F5E6C8] text-xs font-bold leading-snug">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[9px] uppercase font-black tracking-widest text-[#C8A96A]/40 mt-3">*Terms and conditions apply</p>
                        </div>
                    </div>
                </div>

                {/* Why Sayukt Parivar Global Marketing? */}
                <div className="mb-4 animate-slide-up animation-delay-200">
                    <div className="luxury-box">
                        <div className="bg-[#121212] p-3 text-[#C8A96A] border-b border-[#C8A96A]/30">
                            <h2 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
                                <Heart className="w-6 h-6" />
                                WHY Sanyukt Parivaar & Rich Life Pvt.Ltd.?
                            </h2>
                        </div>
                        <div className="p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {whySayuktParivar.map((reason, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 p-3 bg-[#1A1A1A] border border-[#C8A96A]/10 hover:border-[#C8A96A]/40 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <Star className="w-5 h-5 text-[#C8A96A] flex-shrink-0 mt-0.5" />
                                        <p className="text-[#F5E6C8] text-xs font-bold leading-snug">{reason}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compensation Plan */}
                <div className="mb-4 animate-slide-up animation-delay-400">
                    <div className="luxury-box">
                        <div className="bg-[#121212] p-3 text-[#C8A96A] border-b border-[#C8A96A]/30">
                            <h2 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2 w-full">
                                <TrendingUp className="w-6 h-6 flex-shrink-0" />
                                BEST COMPENSATION PLAN
                            </h2>
                        </div>
                        <div className="p-3">
                            <h3 className="text-[9px] font-black tracking-widest uppercase text-[#C8A96A] mb-4 flex items-center gap-1.5">
                                <Gift className="w-5 h-5" />
                                6 Powerful Benefits of Our Compensation Plan
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {compensationBenefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#1A1A1A] border border-[#C8A96A]/10 p-4 hover:border-[#C8A96A]/40 transition-all duration-300 transform hover:-translate-y-2 animate-fade-in group"
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        <div className="w-10 h-10 bg-[#C8A96A]/10 border border-[#C8A96A]/30 rounded-none flex items-center justify-center mb-3 group-hover:bg-[#C8A96A]/20 transition-all">
                                            {index === 0 && <Crown className="w-6 h-6 text-[#C8A96A]" />}
                                            {index === 1 && <Heart className="w-6 h-6 text-[#C8A96A]" />}
                                            {index === 2 && <Globe className="w-6 h-6 text-[#C8A96A]" />}
                                            {index === 3 && <Zap className="w-6 h-6 text-[#C8A96A]" />}
                                            {index === 4 && <Award className="w-6 h-6 text-[#C8A96A]" />}
                                            {index === 5 && <BarChart3 className="w-6 h-6 text-[#C8A96A]" />}
                                        </div>
                                        <h4 className="font-extrabold text-[#C8A96A] tracking-wider mb-1.5 text-xs uppercase">{benefit.title}</h4>
                                        <p className="text-[11px] text-[#F5E6C8] font-bold leading-relaxed">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* View Compensation Plan Button */}
                            <div className="flex justify-center mt-6">
                                <Link to="/compensation-plan" className="luxury-button inline-flex items-center gap-2 group">
                                    VIEW COMPENSATION PLAN
                                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <div className="luxury-box p-3 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-12 h-12 bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center mb-3">
                            <Briefcase className="w-6 h-6 text-[#C8A96A]" />
                        </div>
                        <h3 className="font-extrabold text-[#C8A96A] text-xs uppercase tracking-wider mb-1">Flexible Hours</h3>
                        <p className="text-[11px] text-[#F5E6C8] font-bold">Work full-time or part-time based on your schedule. Complete freedom to manage your time and achieve work-life balance.</p>
                    </div>

                    <div className="luxury-box p-3 hover:-translate-y-2 transition-transform duration-300 animation-delay-200">
                        <div className="w-12 h-12 bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center mb-3">
                            <Globe className="w-6 h-6 text-[#C8A96A]" />
                        </div>
                        <h3 className="font-extrabold text-[#C8A96A] text-xs uppercase tracking-wider mb-1">Pan-India Expansion</h3>
                        <p className="text-[11px] text-[#F5E6C8] font-bold">Expand your business across different states, cities, and towns. Build a nationwide network with unlimited growth potential.</p>
                    </div>

                    <div className="luxury-box p-3 hover:-translate-y-2 transition-transform duration-300 animation-delay-400">
                        <div className="w-12 h-12 bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center mb-3">
                            <Rocket className="w-6 h-6 text-[#C8A96A]" />
                        </div>
                        <h3 className="font-extrabold text-[#C8A96A] text-xs uppercase tracking-wider mb-1">Rapid Growth</h3>
                        <p className="text-[11px] text-[#F5E6C8] font-bold">One of the fastest income plans in the industry with accelerated growth opportunities and quick returns on your efforts.</p>
                    </div>
                </div>

                {/* Success Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    <div className="luxury-box p-3 text-center hover:bg-[#1A1A1A] transition-all">
                        <div className="text-2xl font-serif font-bold text-[#C8A96A] mb-1">10K+</div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#F5E6C8]/50">Active Distributors</p>
                    </div>
                    <div className="luxury-box p-3 text-center hover:bg-[#1A1A1A] transition-all">
                        <div className="text-2xl font-serif font-bold text-[#C8A96A] mb-1">500+</div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#F5E6C8]/50">Cities Covered</p>
                    </div>
                    <div className="luxury-box p-3 text-center hover:bg-[#1A1A1A] transition-all">
                        <div className="text-2xl font-serif font-bold text-[#C8A96A] mb-1">₹50Cr+</div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#F5E6C8]/50">Commission Paid</p>
                    </div>
                    <div className="luxury-box p-3 text-center hover:bg-[#1A1A1A] transition-all">
                        <div className="text-2xl font-serif font-bold text-[#C8A96A] mb-1">15+</div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#F5E6C8]/50">Years of Excellence</p>
                    </div>
                </div>
            </section>

            {/* CTA Section - Dark Theme */}
            <section className="py-3 px-4 luxury-box mt-3 relative overflow-hidden text-center mx-auto max-w-7xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/10 blur-[50px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C8A96A]/10 blur-[50px] pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-xl md:text-2xl font-bold text-[#C8A96A] mb-1 font-serif">
                        Start Your Entrepreneurial Journey Today!
                    </h2>
                    <p className="text-[#F5E6C8] mb-3 max-w-2xl mx-auto font-black leading-relaxed text-xs">
                        Join Sanyukt Parivaar & Rich Life Pvt.Ltd. and unlock unlimited earning potential.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/register" className="luxury-button flex items-center justify-center">
                            Register Now
                        </Link>
                        <Link to="/contact" className="px-4 py-2 font-black text-[9px] tracking-[0.3em] uppercase text-[#F5E6C8] border border-[#F5E6C8]/20 hover:border-[#C8A96A] hover:text-[#C8A96A] transition-all flex items-center justify-center bg-transparent relative overflow-hidden group">
                            Contact Sales
                            <div className="absolute inset-0 bg-[#C8A96A]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OpportunitiesPage;