import React, { useEffect, useState } from "react";
import api from "../api";
import { motion as Motion } from 'framer-motion';
import { Building2, MapPin, Phone, User, ChevronRight, Store, Users, Award } from "lucide-react";

const PublicFranchise = () => {
    const [franchises, setFranchises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFranchise, setSelectedFranchise] = useState(null);

    // =====================
    // LOAD PUBLIC FRANCHISES
    // =====================
    const loadFranchises = async () => {
        try {
            setLoading(true);
            // Public endpoint - बिना पासवर्ड के
            const response = await api.get("/franchises/list");
            setFranchises(response.data);
        } catch (err) {
            console.error("Error loading franchises:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFranchises();
    }, []);

    // Stats
    const totalFranchises = franchises.length;
    const cities = [...new Set(franchises.map(f => f.address?.split(',').pop()?.trim() || 'Unknown'))];

    return (
        <div className="bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 pb-4 relative overflow-hidden">
            {/* Elegant Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#C8A96A]/5 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            {/* Hero Section */}
            <div className="bg-[#121212] border-b border-[#C8A96A]/30 text-[#C8A96A] py-6 md:py-8 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[#C8A96A]/5 pointer-events-none"></div>

                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto text-center relative z-10"
                >
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-[#C8A96A] uppercase tracking-tight">Our Franchise Network</h1>
                    <p className="text-[10px] md:text-xs tracking-[0.2em] font-black uppercase text-[#F5E6C8]/60 max-w-3xl mx-auto">
                        Find an Sanyukt Parivaar franchise partner near you
                    </p>
                </Motion.div>
            </div>

            {/* Stats Section */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="luxury-box p-3 flex items-center gap-3">
                        <div className="p-2 bg-[#C8A96A]/10 border border-[#C8A96A]/30">
                            <Store className="w-5 h-5 text-[#C8A96A]" />
                        </div>
                        <div>
                            <p className="text-xl font-serif font-bold text-[#C8A96A] leading-tight">{totalFranchises}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#F5E6C8]">Total Franchises</p>
                        </div>
                    </div>

                    <div className="luxury-box p-3 flex items-center gap-3">
                        <div className="p-2 bg-[#C8A96A]/10 border border-[#C8A96A]/30">
                            <MapPin className="w-5 h-5 text-[#C8A96A]" />
                        </div>
                        <div>
                            <p className="text-xl font-serif font-bold text-[#C8A96A] leading-tight">{cities.length}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#F5E6C8]">Cities Covered</p>
                        </div>
                    </div>

                    <div className="luxury-box p-3 flex items-center gap-3">
                        <div className="p-2 bg-[#C8A96A]/10 border border-[#C8A96A]/30">
                            <Users className="w-5 h-5 text-[#C8A96A]" />
                        </div>
                        <div>
                            <p className="text-xl font-serif font-bold text-[#C8A96A] leading-tight">24/7</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-[#F5E6C8]">Support Available</p>
                        </div>
                    </div>
                </Motion.div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-10">
                {/* Search and Filter */}
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-2"
                >
                    <h2 className="text-xl font-serif font-bold text-[#C8A96A] mb-3 flex items-center gap-2">
                        <span className="w-8 h-px bg-[#C8A96A]/50 hidden sm:block"></span>
                        <Building2 className="w-6 h-6 text-[#C8A96A]" />
                        Our Franchise Partners
                        <span className="w-8 h-px bg-[#C8A96A]/50 hidden sm:block"></span>
                    </h2>
                </Motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A96A]"></div>
                    </div>
                ) : (
                    <>
                        {/* Franchise Grid */}
                        {franchises.length === 0 ? (
                            <div className="max-w-2xl mx-auto text-center py-6 luxury-box flex flex-col items-center justify-center">
                                <Store className="w-12 h-12 text-[#C8A96A]/40 mx-auto mb-2" />
                                <h3 className="text-lg font-serif font-bold text-[#C8A96A] mb-1">No Franchises Yet</h3>
                                <p className="text-[9px] uppercase font-black tracking-widest text-[#F5E6C8]/50">Check back later for Sanyukt Parivaar opportunities</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {franchises.map((franchise, index) => (
                                    <Motion.div
                                        key={franchise._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -5 }}
                                        className="luxury-box flex flex-col"
                                    >
                                        <div className="p-4 flex-1 flex flex-col">
                                            {/* Header with Icon */}
                                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#C8A96A]/10">
                                                <div className="p-3 bg-[#C8A96A]/10 border border-[#C8A96A]/20">
                                                    <Building2 className="w-6 h-6 text-[#C8A96A]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-[#C8A96A] font-serif">
                                                        {franchise.name}
                                                    </h3>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/40 mt-1">
                                                        ID: {franchise.franchiseId}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-4 h-4 text-[#C8A96A] flex-shrink-0 mt-1" />
                                                    <span className="text-sm text-[#F5E6C8]/80 leading-relaxed font-medium">{franchise.address}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-[#C8A96A] flex-shrink-0" />
                                                    <span className="text-sm text-[#F5E6C8]/80 font-medium">{franchise.mobile}</span>
                                                </div>
                                            </div>

                                            {/* View Details Button */}
                                            <button
                                                onClick={() => setSelectedFranchise(franchise)}
                                                className="mt-6 luxury-button w-full flex items-center justify-center gap-2 group"
                                            >
                                                View Details
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                                            </button>
                                        </div>
                                    </Motion.div>
                                ))}
                            </div>
                        )}

                        {/* Features Section */}
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-4 luxury-box p-4 md:p-6 max-w-5xl mx-auto"
                        >
                            <h3 className="text-xl font-serif font-bold text-[#C8A96A] mb-4 text-center uppercase">
                                Why Choose Our Franchise?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center group">
                                    <div className="w-12 h-12 bg-[#1A1A1A] border border-[#C8A96A]/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C8A96A]/10 transition-colors">
                                        <Award className="w-6 h-6 text-[#C8A96A]" />
                                    </div>
                                    <h4 className="font-bold text-[11px] tracking-widest uppercase text-[#C8A96A] mb-3">Trusted Network</h4>
                                    <p className="text-[#F5E6C8]/60 text-sm leading-relaxed">
                                        Join our Sanyukt Parivaar family of successful luxury franchise partners.
                                    </p>
                                </div>
                                <div className="text-center group">
                                    <div className="w-12 h-12 bg-[#1A1A1A] border border-[#C8A96A]/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C8A96A]/10 transition-colors">
                                        <Users className="w-6 h-6 text-[#C8A96A]" />
                                    </div>
                                    <h4 className="font-bold text-[11px] tracking-widest uppercase text-[#C8A96A] mb-3">Expert Support</h4>
                                    <p className="text-[#F5E6C8]/60 text-sm leading-relaxed">
                                        24/7 dedicated Sanyukt Parivaar support for all our certified partners.
                                    </p>
                                </div>
                                <div className="text-center group">
                                    <div className="w-12 h-12 bg-[#1A1A1A] border border-[#C8A96A]/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C8A96A]/10 transition-colors">
                                        <Building2 className="w-6 h-6 text-[#C8A96A]" />
                                    </div>
                                    <h4 className="font-bold text-[11px] tracking-widest uppercase text-[#C8A96A] mb-3">Pan India Presence</h4>
                                    <p className="text-[#F5E6C8]/60 text-sm leading-relaxed">
                                        A powerful distribution network establishing dominance across India.
                                    </p>
                                </div>
                            </div>
                        </Motion.div>
                    </>
                )}
            </div>

            {/* Details Modal */}
            {selectedFranchise && (
                <div className="fixed inset-0 bg-[#0D0D0D]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#121212] border border-[#C8A96A]/30 rounded-none max-w-md w-full p-8 shadow-[0_0_40px_rgba(200,169,106,0.15)] relative"
                    >
                        {/* Decorative modal corners */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#C8A96A]"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#C8A96A]"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#C8A96A]"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#C8A96A]"></div>

                        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[#C8A96A]/10">
                            <div className="p-3 bg-[#1A1A1A] border border-[#C8A96A]/20">
                                <Building2 className="w-6 h-6 text-[#C8A96A]" />
                            </div>
                            <h3 className="text-xl font-bold font-serif text-[#C8A96A]">{selectedFranchise.name}</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#1A1A1A] border border-[#C8A96A]/10 p-4 hover:border-[#C8A96A]/30 transition-colors">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#C8A96A] mb-1">Franchise ID</p>
                                <p className="font-mono text-xs text-[#F5E6C8]">{selectedFranchise.franchiseId}</p>
                            </div>

                            <div className="bg-[#1A1A1A] border border-[#C8A96A]/10 p-4 hover:border-[#C8A96A]/30 transition-colors">
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#C8A96A] mb-1">Address</p>
                                <p className="text-xs text-[#F5E6C8] leading-relaxed font-bold">{selectedFranchise.address}</p>
                            </div>

                            <div className="bg-[#1A1A1A] border border-[#C8A96A]/10 p-5 hover:border-[#C8A96A]/30 transition-colors">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/60 mb-1">Contact Number</p>
                                <p className="text-sm font-medium text-[#F5E6C8]">{selectedFranchise.mobile}</p>
                            </div>

                            <div className="bg-[#1A1A1A] border border-[#C8A96A]/10 p-5 hover:border-[#C8A96A]/30 transition-colors">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/60 mb-1">Partner Since</p>
                                <p className="text-sm text-[#F5E6C8]">
                                    {new Date(selectedFranchise.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <a
                                href={`tel:${selectedFranchise.mobile}`}
                                className="flex-1 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] py-4 font-black uppercase tracking-widest text-[11px] text-center hover:shadow-[0_0_20px_rgba(200,169,106,0.3)] transition-all active:scale-[0.98]"
                            >
                                Call Now
                            </a>
                            <button
                                onClick={() => setSelectedFranchise(null)}
                                className="px-8 bg-transparent text-[#C8A96A] border border-[#C8A96A]/30 py-4 font-black uppercase tracking-widest text-[11px] hover:bg-[#C8A96A]/10 transition-all active:scale-[0.98]"
                            >
                                Close
                            </button>
                        </div>
                    </Motion.div>
                </div>
            )}
        </div>
    );
};

export default PublicFranchise;