import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Star, ChevronUp, Trash2, ShieldCheck, Truck, RotateCcw, Info, Tag, Package, Plus } from 'lucide-react';
import api, { API_URL } from '../api';
import { useCart } from '../context/CartContext';
import {
    Snackbar,
    Alert,
} from '@mui/material';
import { X as CloseIcon } from 'lucide-react';
import ProductDetailsModal from '../components/ProductDetailsModal';

const ProductsPage = () => {
    const navigate = useNavigate();

    const { cartItems, addToCart, isInCart, removeFromCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All",
        "Pharmacy and household",
        "Fashion",
        "Mobile",
        "Electronics",
        "Beauty & Cosmetics",
        "Toys and baby toys",
        "Food & health",
        "Auto & accessories",
        "Sports & games",
        "Books & education",
        "Furniture",
        "Footwear",
        "Jwellery & accessories",
        "Appliances",
        "Everyday needs",
        "Grocery"
    ];

    // Notifications State
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch products from API
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products');
            console.log('Products fetched:', response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const location = useLocation();
    useEffect(() => {
        if (products.length > 0 && location.state?.productId) {
            const product = products.find(p => p._id === location.state.productId);
            if (product) {
                setSelectedProduct(product);
                setIsModalOpen(true);
                // Clear state to prevent modal reappearing on back/refresh
                window.history.replaceState({}, document.title);
            }
        }
    }, [products, location.state]);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesCategory = selectedCategory === "All";
        if (!matchesCategory) {
            if (selectedCategory === "Beauty & Cosmetics") {
                matchesCategory = product.category === "Beauty & Cosmetics" || product.category === "Beauty and cosmetic home based products";
            } else {
                matchesCategory = product.category === selectedCategory;
            }
        }

        return matchesSearch && matchesCategory;
    });

    // Helper: check if user is logged in
    const isLoggedIn = () => {
        try {
            const user = localStorage.getItem('user');
            return user && JSON.parse(user);
        } catch {
            return false;
        }
    };

    // Buy Now function
    const buyNow = (product) => {
        if (!isLoggedIn()) {
            setSnackbar({ open: true, message: 'Please login first to buy products!', severity: 'error' });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        if (product.stock > 0) {
            navigate('/checkout', {
                state: { product }
            });
        } else {
            setSnackbar({ open: true, message: `${product.name} is out of stock!`, severity: 'error' });
        }
    };

    // Toggle product details
    const openProductModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAddToCart = (product) => {
        if (!isLoggedIn()) {
            setSnackbar({ open: true, message: 'Please login first to add items to cart!', severity: 'error' });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        if (isInCart(product._id)) {
            setSnackbar({ open: true, message: `${product.name} is already in your cart!`, severity: 'warning' });
            return;
        }
        addToCart(product);
        setSnackbar({ open: true, message: `${product.name} added to cart!`, severity: 'success' });
    };

    const handleRemoveFromCart = (productId, productName) => {
        removeFromCart(productId);
        setSnackbar({ open: true, message: `${productName} removed from cart!`, severity: 'info' });
    };

    // Calculate discount percentage
    const calculateDiscount = (price, oldPrice) => {
        if (!oldPrice || oldPrice <= price) return null;
        const discount = ((oldPrice - price) / oldPrice) * 100;
        return Math.round(discount);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };


    const handleImageError = (productId) => {
        setImageErrors(prev => ({ ...prev, [productId]: true }));
        console.log(`Image load failed for product: ${productId}`);
    };

    // इमेज URL बनाने के लिए फंक्शन
    const getImageUrl = (imageName) => {
        if (!imageName) return null;
        if (imageName.startsWith('http')) return imageName;
        const path = imageName.startsWith('/uploads') ? imageName : `/uploads/${imageName}`;
        return `${API_URL}${path}`;
    };

    return (
        <div className="bg-[#0D0D0D] text-[#F5E6C8]">
            {/* Header with Cart */}
            {/* Premium Header Container */}
            <div className="bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-[#C8A96A]/20 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-2 md:py-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex w-10 h-10 bg-[#1A1A1A] border border-[#C8A96A]/30 items-center justify-center shadow-lg">
                                <ShoppingCart className="w-5 h-5 text-[#C8A96A]" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-serif font-bold text-[#C8A96A] tracking-tight">
                                    Our Products
                                </h1>
                                <p className="text-[9px] md:text-[10px] text-[#F5E6C8]/80 font-black uppercase tracking-[0.25em] mt-0.5">
                                    Trusted Quality • Premium Lifestyle
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {/* Modern Search Bar */}
                            <div className="relative flex-1 md:w-64 group">
                                <input
                                    type="text"
                                    placeholder="Search for items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-[#1A1A1A] border border-[#C8A96A]/40 rounded-none text-xs text-[#F5E6C8] focus:outline-none focus:ring-1 focus:ring-[#C8A96A]/60 focus:border-[#C8A96A] transition-all placeholder:text-[#F5E6C8]/60"
                                />
                                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#C8A96A]/60 group-focus-within:text-[#C8A96A] transition-colors" />
                            </div>

                            {/* Premium Cart Button */}
                            <button
                                className="relative p-2 bg-[#1A1A1A] hover:bg-[#C8A96A]/10 border border-[#C8A96A]/20 hover:border-[#C8A96A]/50 transition-all duration-300 group"
                                onClick={() => navigate('/my-account/cart')}
                            >
                                <ShoppingCart className="w-5 h-5 text-[#C8A96A] group-hover:scale-110 transition-transform" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-[#0D0D0D]">
                                        {cartItems.reduce((acc, item) => acc + (item.cartQuantity || 1), 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Navigation */}
            <div className="bg-[#0D0D0D] border-b border-[#C8A96A]/10 sticky top-[60px] md:top-[80px] z-10 overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto px-4 py-1.5 flex gap-1.5 whitespace-nowrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1.5 rounded-none text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 border ${selectedCategory === cat
                                ? "bg-[#C8A96A] text-[#0D0D0D] border-[#C8A96A] shadow-[0_0_10px_rgba(200,169,106,0.2)]"
                                : "bg-[#1A1A1A] text-[#F5E6C8]/70 hover:text-[#C8A96A] hover:bg-[#1A1A1A]/80 border-[#C8A96A]/20 hover:border-[#C8A96A]/40"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                {loading ? (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin w-12 h-12 border-4 border-[#C8A96A] border-t-transparent shadow-[0_0_15px_rgba(200,169,106,0.3)]"></div>
                        <p className="mt-4 text-[#C8A96A] font-medium tracking-widest uppercase text-xs">Loading Excellence...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-10 luxury-box bg-[#1A1A1A]">
                        <div className="text-6xl mb-4">✨</div>
                        <h3 className="text-xl font-serif font-bold text-[#C8A96A] mb-2">No items discovered</h3>
                        <p className="text-[#F5E6C8]/60">Try exploring our other premium categories</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 font-bold">
                        {filteredProducts.map((product, index) => {
                            const discount = calculateDiscount(product.price, product.oldPrice);
                            const hasImageError = imageErrors[product._id];
                            const imageUrl = getImageUrl(product.image);

                            return (
                                <div
                                    key={product._id}
                                    className="luxury-box bg-[#1A1A1A] hover:border-[#C8A96A]/60 transition-all duration-500 group animate-slide-up overflow-hidden relative flex flex-col"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Product Image */}
                                    <div className="relative h-32 md:h-44 bg-[#0D0D0D] overflow-hidden">
                                        {product.image && !hasImageError ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                                                onError={() => handleImageError(product._id)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-[#C8A96A]/20 bg-[#1A1A1A]">
                                                <Package className="w-10 h-10 mb-2" strokeWidth={1} />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-center">Premium Collection</span>
                                            </div>
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                                        {/* Offer Badge */}
                                        {discount && (
                                            <div className="absolute top-2 left-2 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] text-[9px] font-black px-2 py-0.5 shadow-xl">
                                                {discount}% OFF
                                            </div>
                                        )}

                                        {/* Out of Stock Overlay */}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-[#0D0D0D]/90 flex items-center justify-center backdrop-blur-[2px]">
                                                <span className="bg-[#1A1A1A] text-[#C8A96A] border border-[#C8A96A]/20 px-4 py-1.5 text-[10px] font-black shadow-2xl tracking-[0.2em] uppercase">
                                                    Reserved
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-3 md:p-4 flex flex-col flex-1">
                                        {/* Rating & BV */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-2.5 h-2.5 ${star <= Math.round(product.rating || 5)
                                                            ? "fill-[#C8A96A] text-[#C8A96A]"
                                                            : "text-[#C8A96A]/10"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            {product.bv && (
                                                <span className="text-[8px] font-black text-[#C8A96A] uppercase px-1.5 py-0.5 border border-[#C8A96A]/30 bg-[#C8A96A]/10 tracking-widest">
                                                    BV: {product.bv}
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Name & Category */}
                                        <div className="mb-2.5">
                                            <span className="text-[9px] md:text-[10px] font-black text-[#C8A96A]/70 uppercase tracking-[0.22em] mb-1.5 block">
                                                {product.category === "Beauty and cosmetic home based products" ? "Cosmetics" : (product.category?.split(' ')[0] || "General")}
                                            </span>
                                            <h3 className="font-serif font-bold text-[#F5E6C8] text-[15px] md:text-[17px] group-hover:text-[#C8A96A] transition-colors duration-300 leading-snug line-clamp-2 min-h-[2.8rem]">
                                                {product.name}
                                            </h3>
                                        </div>

                                        <p className="text-[#F5E6C8]/85 text-[11px] md:text-xs leading-relaxed line-clamp-2 min-h-[2rem] mb-3">
                                            {product.description || "Premium wellness and lifestyle product from our curated collection."}
                                        </p>

                                        {/* Price Section */}
                                        <div className="flex items-baseline gap-1.5 md:gap-2 mb-3 md:mb-4">
                                            <span className="text-lg md:text-xl font-black text-[#C8A96A]">
                                                ₹{formatCurrency(product.price)}
                                            </span>
                                            {product.oldPrice && (
                                                <span className="text-[11px] text-[#F5E6C8]/60 line-through">
                                                    ₹{formatCurrency(product.oldPrice)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-2 font-bold mt-auto">
                                            {isInCart(product._id) ? (
                                                <button
                                                    onClick={() => handleRemoveFromCart(product._id, product.name)}
                                                    className="py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-1.5 bg-[#2A1A1A] border border-red-900/20 text-red-500 hover:bg-red-950/20"
                                                >
                                                    <Trash2 className="w-3 h-3" /> Drop
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={product.stock === 0}
                                                    className={`py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-1.5 border border-[#C8A96A]/20 ${product.stock === 0
                                                        ? 'opacity-20 cursor-not-allowed'
                                                        : 'text-[#C8A96A] hover:bg-[#C8A96A]/10 hover:border-[#C8A96A]'
                                                        }`}
                                                >
                                                    <Plus className="w-3 h-3" /> Add
                                                </button>
                                            )}
                                            <button
                                                onClick={() => buyNow(product)}
                                                disabled={product.stock === 0}
                                                className={`py-2.5 text-[10px] font-black uppercase tracking-[0.16em] transition-all shadow-xl ${product.stock > 0
                                                    ? 'bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] hover:shadow-[#C8A96A]/20'
                                                    : 'bg-[#1A1A1A] text-[#C8A96A]/20 cursor-not-allowed border border-[#C8A96A]/5'
                                                    }`}
                                            >
                                                Buy Now
                                            </button>
                                            <button
                                                onClick={() => openProductModal(product)}
                                                className="col-span-2 py-2 text-[10px] font-black text-[#F5E6C8]/80 hover:text-[#0D0D0D] bg-[#0D0D0D] hover:bg-[#C8A96A] border border-[#C8A96A]/20 hover:border-[#C8A96A] transition-all mt-0.5 uppercase tracking-[0.18em]"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Product Details Modal */}
            <ProductDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={(id, name) => handleRemoveFromCart(id, name)}
                onBuyNow={buyNow}
                isInCart={selectedProduct ? isInCart(selectedProduct._id) : false}
            />

            {/* Global Notifications Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '16px',
                        fontWeight: 700,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                        bgcolor: '#1A1A1A',
                        color: '#C8A96A',
                        border: '1px solid #C8A96A/20',
                        '& .MuiAlert-icon': { color: '#C8A96A' }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProductsPage;
