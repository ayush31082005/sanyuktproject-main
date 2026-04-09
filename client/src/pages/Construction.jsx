import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Construction as ConstructionIcon, 
    ArrowLeft, 
    Clock, 
    Hammer, 
    HardHat
} from 'lucide-react';

const Construction = ({ 
    title = "Feature Under Construction", 
    message = "We're currently building this section to provide you with a premium experience. Check back soon!",
    estimatedDate = "Q2 2024"
}) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 font-['Inter',sans-serif]">
            <Motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.04)] border border-slate-50 text-center relative overflow-hidden"
            >
                {/* Background Decorations */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-50 rounded-full opacity-50 blur-3xl"></div>

                <div className="relative z-10">
                    <Motion.div 
                        animate={{ 
                            rotate: [0, -10, 10, -10, 0],
                        }}
                        transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-sm"
                    >
                        <ConstructionIcon size={48} strokeWidth={1.5} />
                    </Motion.div>

                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">
                        {title}
                    </h1>
                    
                    <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
                        {message}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2.5">
                            <Clock size={16} className="text-[#F7931E]" />
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
                                Status: Building
                            </span>
                        </div>
                        <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2.5">
                            <ConstructionIcon size={16} className="text-[#0A7A2F]" />
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest text-[#0A7A2F]">
                                Est: {estimatedDate}
                            </span>
                        </div>
                    </div>

                    <Motion.button
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(-1)}
                        className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#0A7A2F] text-white rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-2xl shadow-emerald-900/20 hover:bg-[#086326] transition-all"
                    >
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        Go Back
                    </Motion.button>
                </div>

                {/* Corner Icons */}
                <div className="absolute top-10 left-10 text-slate-100 rotate-12">
                    <Hammer size={40} />
                </div>
                <div className="absolute bottom-10 right-10 text-slate-100 -rotate-12">
                    <HardHat size={40} />
                </div>
            </Motion.div>
        </div>
    );
};

export default Construction;
