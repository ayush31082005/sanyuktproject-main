
import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const TrainingSection = ({ supportItems, trainingImage, handleNavigation }) => {
    return (
        <section className="py-3 md:py-6 bg-[#0D0D0D] relative overflow-hidden" >
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-5 items-center">
                    <div className="space-y-2 order-2 md:order-1 flex flex-col justify-center">
                        <h2 className="text-xl md:text-3xl font-serif font-bold text-[#C8A96A] relative inline-block pb-1 mb-1 tracking-widest uppercase">
                            Training & <span className="text-[#F5E6C8]">Support</span> System
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C8A96A]/40"></span>
                        </h2>
                        <p className="text-[#F5E6C8]/70 text-xs font-light leading-relaxed mb-2">
                            Knowledge and guidance for your success. We provide structured training programs, online resources, and continuous mentorship to help every partner grow confidently.
                        </p>
                        <h3 className="text-[10px] font-bold text-[#C8A96A] uppercase tracking-[3px] mt-2 mb-2">Support Includes</h3>
                        <div className="grid grid-cols-1 gap-1 mb-3">
                            {supportItems.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="w-1 h-1 bg-[#C8A96A] rounded-full"></div>
                                    <span className="text-[11px] text-[#F5E6C8]/70 font-medium uppercase tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => handleNavigation('#')}
                            className="luxury-button w-fit"
                        >
                            Learn More
                        </button>
                    </div>
                    <div className="relative order-1 md:order-2 luxury-box p-1 h-fit">
                        <img src={trainingImage} alt="Training" className="w-full h-auto max-h-[220px] object-cover" />
                        <div className="absolute top-2 left-2 bg-[#0D0D0D]/80 border border-[#C8A96A]/40 p-2 px-3 flex items-center gap-2">
                            <Play className="w-4 h-4 text-[#C8A96A]" fill="currentColor" />
                            <div className="text-[10px] font-bold text-[#F5E6C8] uppercase tracking-widest">Leadership</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrainingSection;
