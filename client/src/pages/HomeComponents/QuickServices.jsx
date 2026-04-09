import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
import {
    Store,
    ShoppingCart,
    Package,
    Zap,
    TrendingUp,
    ChevronRight,
    MoreHorizontal
} from 'lucide-react';

const productPreviewImage = `${API_URL}/uploads/1774819816815.webp`;

const QuickServices = () => {
    const navigate = useNavigate();

    const services = [
        {
            id: 'recharge',
            title: 'Recharge',
            subtitle: 'STAY CONNECTED',
            icon: <Zap className="w-6 h-6" />,
            path: '/recharge',
            bgImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            color: 'from-[#C8A96A] to-[#D4AF37]'
        },
        {
            id: 'products',
            title: 'View Products',
            subtitle: 'PREMIUM RANGE',
            icon: <Package className="w-6 h-6" />,
            path: '/products',
            bgImage: productPreviewImage,
            color: 'from-[#F5E6C8] to-[#C8A96A]'
        },
        {
            id: 'franchise',
            title: 'Our Franchise',
            subtitle: 'JOIN THE NETWORK',
            icon: <Store className="w-6 h-6" />,
            path: '/franchise/list',
            bgImage: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            color: 'from-[#C8A96A] to-[#D4AF37]'
        },
        {
            id: 'opportunities',
            title: 'Opportunities',
            subtitle: 'GROW TOGETHER',
            icon: <TrendingUp className="w-6 h-6" />,
            path: '/opportunities',
            bgImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            color: 'from-[#F5E6C8] to-[#C8A96A]'
        }
    ];

    return (
        <section className="relative py-6 overflow-hidden bg-[#0D0D0D]">
            <div className="container mx-auto px-6">
                {/* Single row on desktop, 2-col on mobile */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 max-w-5xl mx-auto">
                    {services.map((service, index) => (
                        <Motion.div
                            key={service.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            onClick={() => navigate(service.path)}
                            className="relative h-32 md:h-36 rounded-xl overflow-hidden border border-[#C8A96A]/20 cursor-pointer group shadow-2xl"
                        >
                            {/* Background Image */}
                            <img
                                src={service.bgImage}
                                alt={service.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Dark Overlay for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 group-hover:via-black/40 transition-all duration-300" />

                            {/* Content */}
                            <div className="absolute inset-0 p-2 flex flex-col items-center justify-center text-center z-10">
                                <div className="mb-1.5">
                                    <div className={`p-1.5 rounded-full bg-gradient-to-br ${service.color} text-[#0D0D0D] shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                        {React.cloneElement(service.icon, { className: "w-3 h-3" })}
                                    </div>
                                </div>

                                <h3 className="text-[#F5E6C8] font-serif font-bold text-xs leading-tight group-hover:text-[#C8A96A] transition-colors mb-0.5">
                                    {service.title}
                                </h3>
                                <p className="text-[#C8A96A]/80 text-[6px] uppercase tracking-[0.12em] font-black italic">
                                    {service.subtitle}
                                </p>
                            </div>

                            {/* Border Glow Effect on Hover */}
                            <div className="absolute inset-0 border-2 border-[#C8A96A]/0 group-hover:border-[#C8A96A]/30 rounded-xl transition-all duration-500 pointer-events-none" />

                            {/* Animated line at bottom */}
                            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C8A96A] group-hover:w-full transition-all duration-500" />
                        </Motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickServices;
