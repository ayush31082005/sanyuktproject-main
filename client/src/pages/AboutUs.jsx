import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, Users, Target, Eye, TrendingUp, Shield, Star, Heart, Award, MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const AboutUsPage = () => {
    const navigate = useNavigate();
    // Sample image URLs (replace with actual images)
    const seminarImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const teamImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    // Core Values images
    const integrityImage = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80";
    const teamworkImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80";
    const customerImage = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const learningImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80";
    const ethicalImage = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const growthValueImage = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    const coreValues = [
        {
            title: "Integrity & Transparency",
            traits: ["Honesty", "Reliability", "Accountability", "Diligence"],
            image: integrityImage
        },
        {
            title: "Teamwork & Unity",
            traits: ["Collaboration", "Support", "Togetherness", "Cooperation"],
            image: teamworkImage
        },
        {
            title: "Customer Satisfaction",
            traits: ["Quality Service", "Responsiveness", "Value Creation", "Trust"],
            image: customerImage
        },
        {
            title: "Continuous Learning",
            traits: ["Skill Development", "Innovation", "Adaptability", "Growth"],
            image: learningImage
        },
        {
            title: "Ethical Direct Selling",
            traits: ["Fair Practices", "Transparency", "Compliance", "Respect"],
            image: ethicalImage
        },
        {
            title: "Long-Term Growth",
            traits: ["Sustainability", "Stability", "Future Focus", "Scaling"],
            image: growthValueImage
        }
    ];

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans text-[#F5E6C8] overflow-x-hidden">
            {/* Hero Banner Section */}
            <header className="relative w-full min-h-[180px] md:min-h-[220px] bg-cover bg-center flex items-center justify-center pb-4"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
                {/* Solid overlay to dim the image, just like Legal Policies page */}
                <div className="absolute inset-0 bg-black/70"></div>

                {/* Content Container */}
                <div className="relative flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#C8A96A] drop-shadow-lg animate-fade-in">
                        ABOUT US
                    </h1>
                </div>
            </header>

            {/* Intro Heading Section */}
            <section className="py-4 md:py-6 px-4 max-w-7xl mx-auto text-center relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-[#C8A96A] to-transparent opacity-30"></div>

                {/* <div className="inline-block mb-6 px-6 py-2 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C8A96A]">Architects of Abundance</span>
                </div> */}

                <h2 className="text-3xl md:text-6xl font-serif font-bold text-[#C8A96A] mb-3 leading-tight animate-slide-up px-4">
                    Welcome to the <span className="md:inline hidden"><br /></span>
                    <span className="text-[#F5E6C8]">Sanyukt Parivaar & Rich Life</span>
                </h2>

                <p className="text-lg md:text-2xl text-[#F5E6C8]/40 font-serif italic max-w-3xl mx-auto leading-relaxed mb-4 px-4">
                    "A People-Centric Multi-Level Marketing Organization."
                </p>

                <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C8A96A]/30"></div>
                    <div className="w-3 h-3 rotate-45 border border-[#C8A96A]/40"></div>
                    <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C8A96A]/30"></div>
                </div>
            </section>

            {/* ABOUT US - CONTENT + IMAGE */}
            <section className="py-4 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Content */}
                    <div className="space-y-4 animate-slide-right">
                        <div className="space-y-3">
                            <p className="text-[#F5E6C8]/80 leading-relaxed text-lg">
                                <span className="text-[#C8A96A] font-serif font-bold text-2xl italic mr-2"></span>Sanyukt Parivaar & Rich Life Pvt.Ltd. is a rapidly growing direct selling and multi-level marketing organization built on the foundation of trust, transparency, and teamwork.
                            </p>
                            <p className="text-[#F5E6C8]/60 leading-relaxed">
                                At Sanyukt Parivaar, we believe success is best achieved together. Our "Parivaar" culture encourages mutual support, ethical business practices, and long-term relationships. We offer high-quality lifestyle, wellness, personal care, and daily-use products that create real value for customers.
                            </p>
                            <p className="text-[#F5E6C8]/60 leading-relaxed">
                                Through structured training, leadership development, and a proven compensation plan, we help individuals from all walks of life build a stable and scalable business with absolute confidence.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-[#C8A96A]/10 flex flex-wrap gap-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-serif font-bold text-[#C8A96A]">5k+</span>
                                <span className="text-[10px] uppercase tracking-widest text-[#F5E6C8]/40 font-bold">Partners</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-serif font-bold text-[#C8A96A]">100+</span>
                                <span className="text-[10px] uppercase tracking-widest text-[#F5E6C8]/40 font-bold">Seminars</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-serif font-bold text-[#C8A96A]">10+</span>
                                <span className="text-[10px] uppercase tracking-widest text-[#F5E6C8]/40 font-bold">Regions</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative animate-slide-left">
                        <div className="absolute -inset-4 border border-[#C8A96A]/20 rounded-[2rem] -rotate-2"></div>
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-black">
                            <img
                                src={seminarImage}
                                alt="Company Seminar"
                                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-60"></div>
                        </div>

                        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#1A1A1A] rounded-3xl border border-[#C8A96A]/20 p-4 shadow-3xl hidden md:block">
                            <img
                                src={teamImage}
                                alt="Team"
                                className="w-full h-full object-cover rounded-2xl opacity-80"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION & VISION SECTION */}
            <section className="py-4 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mission Card */}
                    <article className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                        <div className="luxury-box p-6 h-full flex flex-col transition-all duration-500">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] aspect-square flex items-center justify-center shadow-xl shadow-gold-900/20 transform group-hover:rotate-6 transition-transform">
                                    <Target className="w-6 h-6 text-[#0D0D0D]" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#C8A96A]">Ambition</h3>
                            </div>
                            <p className="text-[#F5E6C8]/60 leading-relaxed text-lg font-medium">
                                Our mission is to architect a reliable platform for financial independence and personal development. We nurture our elite community through sophisticated training and leadership, maintaining absolute integrity in every transaction.
                            </p>
                        </div>
                    </article>

                    {/* Vision Card */}
                    <article className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                        <div className="luxury-box p-6 h-full flex flex-col transition-all duration-500">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] aspect-square flex items-center justify-center shadow-xl transform group-hover:-rotate-6 transition-transform">
                                    <Eye className="w-6 h-6 text-[#0D0D0D]" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#C8A96A]">Future</h3>
                            </div>
                            <p className="text-[#F5E6C8]/60 leading-relaxed text-lg font-medium">
                                To lead the global direct selling landscape by defining a sustainable lifestyle model. We inspire positive transformation and encourage high-performance entrepreneurship through innovation and responsible legacy-building.
                            </p>
                        </div>
                    </article>
                </div>
            </section>

            {/* CORE VALUES SECTION */}
            <section className="py-4 px-4 max-w-7xl mx-auto relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C8A96A]/5 rounded-full blur-[120px] -z-10"></div>

                <h2 className="text-2xl md:text-4xl font-serif font-bold text-center text-[#C8A96A] mb-4 animate-slide-up">
                    Our Core Principles
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
                    {coreValues.map((value, index) => (
                        <div
                            key={index}
                            className="group luxury-box p-4 md:p-5 min-h-[220px] md:min-h-[240px] transition-all duration-500 shadow-xl"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C8A96A]/5 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative mb-3">
                                <div className="w-10 h-10 md:w-11 md:h-11 bg-[#121212] border border-[#C8A96A]/30 rounded-md flex items-center justify-center mb-3 group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-all duration-500 shadow-lg">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg md:text-xl font-serif font-bold text-[#F5E6C8] leading-snug group-hover:text-[#C8A96A] transition-colors">{value.title}</h3>
                            </div>

                            <ul className="space-y-2 relative">
                                {value.traits.map((trait, traitIndex) => (
                                    <li key={traitIndex} className="flex items-center gap-3 text-[#F5E6C8]/60 group/trait">
                                        <div className="w-1.5 h-1.5 bg-[#C8A96A] rounded-full opacity-40 group-hover/trait:opacity-100 group-hover/trait:scale-150 transition-all"></div>
                                        <span className="text-sm md:text-base font-medium">{trait}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Sanyukt Parivaar Section */}
            <section className="py-4 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left Content */}
                        <div className="space-y-4 animate-slide-right">
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#C8A96A] leading-tight">
                                    Why Choose the <span className="md:inline hidden"><br /></span> Sanyukt Parivaar?
                                </h2>
                                <p className="text-[#F5E6C8]/60 leading-relaxed text-lg">
                                    We are more than a company - we are an ecosystem committed to high-performance empowerment. Our model focuses on stability, recurring prosperity, and leadership-driven legacy.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A] group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-all duration-500">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-serif font-bold text-[#F5E6C8] mb-2 uppercase tracking-wide">Certified Elite</h4>
                                        <p className="text-sm text-[#F5E6C8]/40 font-medium">Industry-leading training & mentorship.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A] group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-all duration-500">
                                        <Heart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-serif font-bold text-[#F5E6C8] mb-2 uppercase tracking-wide">Unified Bond</h4>
                                        <p className="text-sm text-[#F5E6C8]/40 font-medium">A family culture rooted in mutual respect.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Stats View */}
                        <div className="grid grid-cols-2 gap-2 animate-slide-left">
                            <div className="luxury-box p-3 text-center transition-all duration-500">
                                <Users className="w-7 h-7 text-[#C8A96A] mx-auto mb-2 opacity-60" />
                                <h4 className="font-serif font-bold text-[#F5E6C8] text-lg mb-0.5">Empowered</h4>
                                <p className="text-[9px] text-[#C8A96A] font-black uppercase tracking-widest">5,000+ Partners</p>
                            </div>
                            <div className="luxury-box p-3 text-center transition-all duration-500">
                                <Star className="w-7 h-7 text-[#C8A96A] mx-auto mb-2" />
                                <h4 className="font-serif font-bold text-[#F5E6C8] text-lg mb-0.5">Pure</h4>
                                <p className="text-[9px] text-[#C8A96A] font-black uppercase tracking-widest">Natural Line</p>
                            </div>
                            <div className="luxury-box p-3 text-center transition-all duration-500">
                                <TrendingUp className="w-7 h-7 text-[#C8A96A] mx-auto mb-2" />
                                <h4 className="font-serif font-bold text-[#F5E6C8] text-lg mb-0.5">Growth</h4>
                                <p className="text-[9px] text-[#C8A96A] font-black uppercase tracking-widest">Success Legacy</p>
                            </div>
                            <div className="luxury-box p-3 text-center transition-all duration-500">
                                <Shield className="w-7 h-7 text-[#C8A96A] mx-auto mb-2 opacity-60" />
                                <h4 className="font-serif font-bold text-[#F5E6C8] text-lg mb-0.5">Ethical</h4>
                                <p className="text-[9px] text-[#C8A96A] font-black uppercase tracking-widest">Transparent Vision</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-6 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#C8A96A] opacity-5"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C8A96A]/30 to-transparent"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
                    <div className="w-20 h-px bg-[#C8A96A]/40 mx-auto mb-4"></div>
                    <h2 className="text-3xl md:text-6xl font-serif font-bold text-[#F5E6C8] mb-6 leading-tight">
                        <span className="text-[#C8A96A]">Join a Growing Community That Believes in Shared Success</span>
                    </h2>

                    <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/register')}
                        className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-[#0D0D0D] transition-all duration-300 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] rounded-full hover:shadow-[0_0_40px_rgba(200,169,106,0.4)]"
                    >
                        <span className="relative z-10 uppercase tracking-[0.2em] text-sm">Join Sanyukt Parivaar Today</span>
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </Motion.button>
                </div>
            </section>
        </div >
    );
};

export default AboutUsPage;
