import React from 'react';
import { Check } from 'lucide-react';

const BusinessOpportunity = ({ businessHighlights, businessImage, handleNavigation }) => {
    return (
        <section className="py-3 md:py-6 bg-[#121212] relative overflow-hidden border-y border-[#C8A96A]/10" >
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-2 flex flex-col justify-center">
                        <h2 className="text-xl md:text-3xl font-serif font-bold text-[#F5E6C8] mb-1 leading-tight uppercase tracking-widest">
                            A Powerful <span className="text-[#C8A96A]">Business Opportunity</span>
                        </h2>
                        <div className="w-16 h-[1px] bg-[#C8A96A]/40 mb-2"></div>
                        <p className="text-[#F5E6C8]/70 text-xs font-light leading-relaxed mb-2">
                            Offers a proven MLM business plan that allows individuals to earn through product sales, team building, and leadership development.
                        </p>
                        <div className="space-y-1 mb-3">
                            {businessHighlights.map((highlight, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-2.5 h-2.5 text-[#C8A96A]" />
                                    </div>
                                    <span className="text-[11px] text-[#F5E6C8]/90 font-medium uppercase tracking-tight">{highlight}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => handleNavigation('/opportunities')}
                            className="luxury-button w-fit"
                        >
                            View Opportunities
                        </button>
                    </div>
                    <div className="relative luxury-box p-1 h-fit">
                        <img src={businessImage} alt="Business Opportunity" className="w-full h-auto max-h-[220px] object-cover" />
                        <div className="absolute -bottom-2 -right-2 bg-[#C8A96A] p-3 px-4 shadow-2xl">
                            <div className="text-sm font-bold text-[#0D0D0D] uppercase tracking-tighter">Unlimited</div>
                            <div className="text-[8px] font-bold text-[#0D0D0D]/70 uppercase tracking-widest leading-none">Income Potential</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessOpportunity;
