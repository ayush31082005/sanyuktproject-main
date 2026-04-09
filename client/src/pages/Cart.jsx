import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_URL } from '../api';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Info, Award } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = (item) => {
        navigate('/checkout', { state: { product: item } });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] bg-[#0D0D0D] py-12 flex flex-col items-center justify-center p-4 rounded-[2rem] md:rounded-[3rem] border border-[#C8A96A]/10 my-4 md:my-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8A96A]/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="bg-[#1A1A1A] p-12 rounded-3xl shadow-2xl border border-[#C8A96A]/20 flex flex-col items-center max-w-md text-center relative z-10">
                    <div className="w-24 h-24 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(200,169,106,0.15)]">
                        <ShoppingBag className="w-10 h-10 text-[#C8A96A]" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-[#F5E6C8] mb-4">Your Cart is Empty</h2>
                    <p className="text-[#F5E6C8]/60 mb-8 font-medium leading-relaxed">Discover our premium range of wellness products and start your healthy journey today!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="w-full py-4 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(200,169,106,0.4)] transition-all active:scale-95"
                    >
                        Explore Collection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#0D0D0D] py-6 md:py-12 text-[#F5E6C8] font-sans">
            <div className="w-full px-3 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 md:mb-10 border-b border-[#C8A96A]/10 pb-4 md:pb-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#C8A96A] tracking-tight mb-1">My Cart</h1>
                        <p className="text-[#F5E6C8]/50 text-xs font-medium uppercase tracking-[0.15em]">Review your items before checkout</p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#1A1A1A] px-4 py-2 rounded-xl border border-[#C8A96A]/20 shadow-lg w-fit">
                        <ShoppingBag className="w-4 h-4 text-[#C8A96A]" />
                        <span className="text-[#F5E6C8]/80 font-medium text-sm">
                            <strong className="text-base text-[#F5E6C8] mr-1">{cartItems.length}</strong>{cartItems.length === 1 ? 'Item' : 'Items'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-[#1A1A1A] rounded-2xl border border-[#C8A96A]/10 p-4 transition-all duration-300 hover:border-[#C8A96A]/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C8A96A]/5 rounded-bl-[80px] pointer-events-none -mr-8 -mt-8"></div>

                                {/* Mobile: Side-by-side image + info */}
                                <div className="flex flex-row gap-4 relative z-10">
                                    {/* Item Image - fixed small size on mobile */}
                                    <div className="w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0 bg-[#0D0D0D] rounded-xl overflow-hidden border border-[#C8A96A]/20 flex items-center justify-center">
                                        {item.image ? (
                                            <img
                                                src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image.startsWith('/uploads') ? item.image : '/uploads/' + item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-[#C8A96A]/40">
                                                <ShoppingBag className="w-8 h-8 mb-1" />
                                                <span className="text-[9px] uppercase font-bold tracking-wider">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Item Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-serif font-bold text-base sm:text-xl text-[#F5E6C8] line-clamp-2 leading-tight group-hover:text-[#C8A96A] transition-colors">
                                                {item.name}
                                            </h3>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-1.5 text-[#F5E6C8]/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <p className="text-[#F5E6C8]/50 text-xs line-clamp-2 leading-relaxed font-medium hidden sm:block">
                                            {item.description || "Premium quality health and wellness product."}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            {item.bv && (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-[#C8A96A]/10 text-[#C8A96A] rounded-lg text-[10px] font-bold border border-[#C8A96A]/20 uppercase tracking-wider">
                                                    <Award size={11} />
                                                    BV: {item.bv}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 px-2 py-1 bg-[#0D0D0D] text-[#F5E6C8]/80 rounded-lg text-[10px] font-bold border border-[#C8A96A]/10">
                                                <Info size={11} className="text-[#C8A96A]" />
                                                {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom: Qty + Price + Buy */}
                                <div className="mt-4 pt-4 border-t border-[#C8A96A]/10 flex flex-row items-center justify-between gap-2 relative z-10">
                                    {/* Quantity Stepper */}
                                    <div className="flex items-center bg-[#0D0D0D] p-1 rounded-xl border border-[#C8A96A]/20 h-[40px] flex-shrink-0">
                                        <button
                                            onClick={() => updateQuantity(item._id, (item.cartQuantity || 1) - 1)}
                                            className="w-8 h-full flex items-center justify-center rounded-lg text-[#F5E6C8]/60 hover:text-[#0D0D0D] hover:bg-[#C8A96A] transition-all disabled:opacity-30"
                                            disabled={item.cartQuantity <= 1}
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-black text-[#F5E6C8]">{item.cartQuantity || 1}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, (item.cartQuantity || 1) + 1)}
                                            className="w-8 h-full flex items-center justify-center rounded-lg text-[#F5E6C8]/60 hover:text-[#0D0D0D] hover:bg-[#C8A96A] transition-all"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center flex-1">
                                        <p className="text-[9px] text-[#C8A96A] font-black uppercase tracking-widest mb-0.5">Total</p>
                                        <p className="text-base font-black text-[#F5E6C8] tracking-tight">{formatCurrency((Number(item.price) || 0) * (Number(item.cartQuantity) || 1))}</p>
                                    </div>

                                    {/* Buy Button */}
                                    <button
                                        onClick={() => handleCheckout(item)}
                                        className="flex-shrink-0 px-4 py-2.5 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] rounded-xl font-black uppercase tracking-[0.08em] text-xs flex items-center gap-1 hover:shadow-[0_0_20px_rgba(200,169,106,0.3)] transition-all active:scale-95"
                                    >
                                        Buy
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1A1A1A] rounded-3xl shadow-2xl border border-[#C8A96A]/20 p-8 lg:p-10 sticky top-32 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-bl-[100px] pointer-events-none"></div>
                            
                            <h2 className="text-2xl font-serif font-bold text-[#F5E6C8] mb-8 flex items-center gap-3 relative z-10">
                                <ShoppingBag className="text-[#C8A96A]" size={24} />
                                Order Summary
                            </h2>

                            <div className="space-y-5 mb-8 relative z-10">
                                <div className="flex justify-between items-center text-[#F5E6C8]/70 font-medium">
                                    <span className="tracking-wide text-sm">Total Items</span>
                                    <span className="text-[#F5E6C8] font-bold text-base bg-[#0D0D0D] px-4 py-1.5 rounded-lg border border-[#C8A96A]/10">{cartItems.reduce((acc, item) => acc + (item.cartQuantity || 1), 0)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[#F5E6C8]/70 font-medium">
                                    <span className="tracking-wide text-sm">Shipping</span>
                                    <span className="text-[#0D0D0D] bg-[#C8A96A] font-black text-xs tracking-widest uppercase px-4 py-1.5 rounded-lg shadow-sm">Free</span>
                                </div>
                                <div className="h-px bg-gradient-to-r from-transparent via-[#C8A96A]/20 to-transparent my-6"></div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-[#C8A96A] font-bold uppercase tracking-[0.2em]">Estimated Total</p>
                                    <p className="text-4xl font-black text-[#F5E6C8] leading-none tracking-tighter">{formatCurrency(getCartTotal())}</p>
                                </div>
                            </div>

                            <p className="text-[11px] text-[#F5E6C8]/40 text-center leading-relaxed bg-[#0D0D0D] p-5 rounded-2xl border border-[#C8A96A]/10 mt-6 relative z-10 shadow-inner">
                                <span className="block text-[#C8A96A] font-bold mb-1.5 uppercase tracking-widest">Pricing Notice</span>
                                You are currently purchasing each item individually to ensure optimal shipping and processing protocols.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
