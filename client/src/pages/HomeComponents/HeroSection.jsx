import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HeroSection = ({ currentSlide, setCurrentSlide, heroSlides, isLoggedIn, userRole, handleNavigation }) => {
    // Background Image Mode, Text on Left Vacant Side

    return (
        <section className="relative min-h-[410px] max-h-[500px] sm:min-h-[calc(100vh-88px)] sm:max-h-none md:min-h-[calc(100vh-115px)] overflow-hidden bg-[#0D0D0D] flex items-start sm:items-center pt-6 pb-2 sm:py-4 md:py-6 lg:py-8">
            <AnimatePresence mode="wait">
                <Motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={heroSlides[currentSlide].image}
                        alt="Hero Background"
                        className="w-full h-full object-cover object-[center_30%] brightness-[0.75]"
                    />
                    {/* Gradient Overlay for Text Readability: Darker center for centered text */}
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                </Motion.div>
            </AnimatePresence>

            <div className="container mx-auto px-4 sm:px-6 relative z-40 pt-8 sm:pt-0">
                <div className="max-w-4xl mx-auto">
                    {/* Content Side - Centered */}
                    <Motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="space-y-1.5 sm:space-y-3 md:space-y-4 text-center"
                    >
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-[1.08] text-[#F5E6C8] tracking-tight drop-shadow-2xl">
                            {heroSlides[currentSlide].title}
                        </h1>
                        <h2 className="text-sm sm:text-lg md:text-xl lg:text-[1.35rem] xl:text-2xl text-[#C8A96A] font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.26em] drop-shadow-lg">
                            {heroSlides[currentSlide].subtitle}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-[1.1rem] text-white/90 leading-relaxed font-normal max-w-3xl mx-auto drop-shadow-lg">
                            {heroSlides[currentSlide].description}
                        </p>

                        <div className="flex flex-wrap gap-3 md:gap-4 pt-4 sm:pt-4 md:pt-5 pb-0 sm:pb-8 md:pb-10 justify-center">
                            <Motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (isLoggedIn) {
                                        handleNavigation(userRole === 'admin' ? '/admin/dashboard' : '/my-account');
                                    } else {
                                        handleNavigation('/login');
                                    }
                                }}
                                className="px-8 md:px-10 py-3.5 md:py-4 bg-[#C8A96A] text-[#0D0D0D] font-bold rounded-sm hover:bg-[#F5E6C8] transition-all duration-300 shadow-[0_10px_30px_rgba(200,169,106,0.3)] flex items-center space-x-3 text-sm uppercase tracking-widest group"
                            >
                                <span className="font-black text-[14px]">
                                    {isLoggedIn ? 'User Dashboard' : 'Join Us'}
                                </span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Motion.button>

                            <Motion.button
                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: '#F5E6C8' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleNavigation('/contact')}
                                className="px-8 md:px-10 py-3.5 md:py-4 border border-white/50 text-white font-bold rounded-sm backdrop-blur-sm transition-all duration-300 text-[14px] uppercase tracking-widest hover:text-[#F5E6C8]"
                            >
                                Contact Us
                            </Motion.button>
                        </div>
                    </Motion.div>
                </div>
            </div>

            {/* Bottom edge fade */}
            <div className="absolute bottom-0 left-0 right-0 h-2 sm:h-12 bg-gradient-to-t from-[#0D0D0D] to-transparent z-20 pointer-events-none"></div>
        </section>
    );
};

export default HeroSection;
