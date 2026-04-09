import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronDown, ChevronRight, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { API_URL } from '../../api';

const ProductsCarousel = ({
    products,
    loading = false,
    scroll,
    carouselRef,
    calculateDiscount,
    imageErrors,
    handleImageError,
    renderStars,
    addToCart,
    onProductClick,
    handleNavigation
}) => {
    return (
        <section className="py-2 md:py-5 bg-[#121212] relative overflow-hidden" >
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-4">
                    <div className="text-center md:text-left max-w-2xl">
                        <span className="text-[#C8A96A] font-bold text-[10px] tracking-widest uppercase mb-1 block">
                            Discover Quality
                        </span>
                        <h2 className="text-xl md:text-3xl font-serif font-bold text-[#F5E6C8] mb-1 uppercase tracking-widest">
                            Featured <span className="text-[#C8A96A]">Products</span>
                        </h2>
                        <div className="w-16 h-[1px] bg-[#C8A96A]/40 mb-2 md:mx-0 mx-auto"></div>
                        <p className="text-[#F5E6C8]/60 text-xs font-light tracking-tight">
                            Tested and trusted by our community.
                        </p>
                    </div>

                    {/* Custom Navigation - Right Corner */}
                    <div className="flex gap-2 flex-shrink-0">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] hover:bg-[#C8A96A]/10 transition-all"
                        >
                            <ChevronDown className="w-5 h-5 rotate-90" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 bg-[#C8A96A] flex items-center justify-center text-[#0D0D0D] hover:bg-[#D4AF37] transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Products Carousel */}
                <div
                    ref={carouselRef}
                    className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-hide no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading ? (
                        /* Skeleton Loading State */
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="min-w-[200px] sm:min-w-[220px] md:min-w-[240px] snap-center">
                                <div className="luxury-box h-72 animate-pulse flex flex-col">
                                    <div className="h-32 bg-[#1A1A1A] skeleton-box shimmer border-b border-[#C8A96A]/10"></div>
                                    <div className="p-3">
                                        <div className="h-2 w-16 bg-[#1A1A1A] skeleton-box shimmer mb-2"></div>
                                        <div className="h-4 w-full bg-[#1A1A1A] skeleton-box shimmer mb-3"></div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="h-6 w-20 bg-[#1A1A1A] skeleton-box shimmer"></div>
                                            <div className="h-4 w-12 bg-[#1A1A1A] skeleton-box shimmer"></div>
                                        </div>
                                        <div className="h-8 w-full bg-[#1A1A1A] skeleton-box shimmer mt-4"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : products && products.length > 0 ? (
                        products.map((product) => {
                            const productId = product._id || product.slug || product.name;
                            const price = product.price || product.dp || 0;
                            const oldPrice = product.oldPrice || product.mrp || 0;
                            const bv = product.bv || 0;
                            const rating = product.rating || 5;
                            const reviews = product.numReviews || product.reviews || 0;
                            const category = product.category || "General";
                            const discount = calculateDiscount(oldPrice, price);

                            // Image logic
                            const getImageUrl = (image) => {
                                if (!image) return null;
                                if (image.startsWith('http')) return image;
                                const path = image.startsWith('/uploads') ? image : `/uploads/${image}`;
                                return `${API_URL}${path}`;
                            };

                            const imageUrl = getImageUrl(product.image);

                            return (
                                <div
                                    key={productId}
                                    className="min-w-[200px] sm:min-w-[220px] md:min-w-[240px] snap-center"
                                >
                                    <Motion.div
                                        whileHover={{ y: -6 }}
                                        className="luxury-box overflow-hidden transition-all duration-500 group relative"
                                    >
                                        {/* Product Image Container */}
                                        <div
                                            className="relative h-32 overflow-hidden bg-[#0D0D0D] flex items-center justify-center cursor-pointer p-2"
                                            onClick={() => onProductClick(product)}
                                        >

                                            {imageUrl && !imageErrors[productId] ? (
                                                <Motion.img
                                                    whileHover={{ scale: 1.15 }}
                                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={() => handleImageError(productId)}
                                                />
                                            ) : (
                                                <div className="text-9xl grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110">
                                                    {product.fallbackIcon || "📦"}
                                                </div>
                                            )}

                                            {/* Top Utility Buttons */}
                                            <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-20">
                                                {parseInt(discount) > 0 && (
                                                    <span className="w-fit bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
                                                        -{discount}%
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Float Area */}
                                            <div className="absolute bottom-3 right-3 z-20 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToCart(product);
                                                    }}
                                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div
                                            className="p-3 cursor-pointer group/details"
                                            onClick={() => onProductClick(product)}
                                        >
                                            <div className="flex items-center gap-1 mb-1">
                                                {renderStars(rating)}
                                                <span className="text-[11px] font-black text-[#F5E6C8]/80 uppercase tracking-widest ml-1">
                                                    {reviews}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-0.5 mb-1.5">
                                                <h3 className="text-sm font-bold text-[#F5E6C8] truncate group-hover:text-[#C8A96A] group-hover/details:text-[#C8A96A] transition-colors">
                                                    {product.name}
                                                </h3>
                                                <span className="w-fit text-[11px] font-black bg-[#C8A96A]/10 text-[#C8A96A] px-1.5 py-0.5 rounded-md uppercase tracking-wider border border-[#C8A96A]/20">
                                                    {category === "Beauty and cosmetic home based products" ? "Beauty & Cosmetics" : category}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-bold text-[#C8A96A]">
                                                        ₹{price}
                                                    </span>
                                                    {oldPrice > price && (
                                                        <span className="text-[#F5E6C8]/60 text-[10px] line-through font-medium">
                                                            MRP ₹{oldPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="bg-orange-50 text-[#F7931E] px-2 py-0.5 rounded-lg text-[11px] font-black uppercase tracking-widest border border-orange-100">
                                                        BV {bv}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-2 flex flex-col gap-1.5">
                                                <button
                                                    onClick={() => handleNavigation('/checkout', { state: { product } })}
                                                    className="luxury-button w-full"
                                                >
                                                    Buy Now
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onProductClick(product);
                                                    }}
                                                    className="text-[#C8A96A]/60 text-[8px] font-bold uppercase tracking-widest text-center hover:text-[#C8A96A] transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </Motion.div>
                                </div>
                            );
                        })
                    ) : (
                        /* Empty State */
                        <div className="w-full flex flex-col items-center justify-center py-12 text-center flex-shrink-0 min-w-full">
                            <div className="w-16 h-16 rounded-full bg-[#C8A96A]/5 flex items-center justify-center mb-4 border border-[#C8A96A]/10">
                                <Star className="w-8 h-8 text-[#C8A96A]/20" />
                            </div>
                            <h3 className="text-[#F5E6C8] font-serif text-lg mb-1 uppercase tracking-widest">No Featured Products</h3>
                            <p className="text-[#F5E6C8]/40 text-xs font-light max-w-xs">Our latest collection is arriving soon. Check back later for updates.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-40 -right-20 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-50 z-0"></div>
            <div className="absolute bottom-40 -left-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-50 z-0"></div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default ProductsCarousel;
