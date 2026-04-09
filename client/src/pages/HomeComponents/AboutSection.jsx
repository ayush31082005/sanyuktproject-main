import React from 'react';

const AboutSection = ({ aboutImage }) => {
    return (
        <section className="py-10 md:py-14 bg-[#0D0D0D] relative border-y border-[#C8A96A]/10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-2">
                    <h2 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold text-[#C8A96A] inline-block relative pb-2 tracking-widest uppercase">
                        Who We Are
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C8A96A]/40"></span>
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-center max-w-5xl mx-auto">
                    <div className="space-y-2 text-gray-700 order-2 md:order-1 flex flex-col justify-center">
                        <h3 className="text-lg md:text-2xl lg:text-3xl font-serif font-bold text-[#F5E6C8] mb-2 leading-tight uppercase tracking-tight">
                            Sanyukt Parivaar & <br />
                            <span className="text-[#C8A96A]">Rich Life Pvt.Ltd.</span>
                        </h3>
                        <p className="text-base md:text-lg text-[#F5E6C8]/70 font-light leading-relaxed">
                            Founded with a vision to create financial independence through ethical direct selling. We believe in growing together as one family, where every member gets equal opportunity, proper training, and long-term support.
                        </p>
                        <p className="text-base md:text-lg text-[#F5E6C8]/70 font-light leading-relaxed">
                            Our company focuses on personal development, leadership growth, and community success while promoting reliable lifestyle, wellness, and personal care products.
                        </p>
                    </div>
                    <div className="relative order-1 md:order-2 luxury-box p-1">
                        <img src={aboutImage} alt="About Us" className="w-full h-auto max-h-[400px] object-cover" />
                        <div className="absolute top-2 right-2 bg-[#0D0D0D]/80 border border-[#C8A96A]/40 p-2 px-3 flex flex-col items-center">
                            <span className="text-lg font-bold text-[#C8A96A] leading-none">100%</span>
                            <span className="text-[8px] font-bold text-[#F5E6C8]/60 uppercase tracking-widest">Certified</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
