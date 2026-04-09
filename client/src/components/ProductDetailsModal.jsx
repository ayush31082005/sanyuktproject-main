import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Button,
    Chip,
    Fade,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { 
    X as CloseIcon, 
    ShoppingCart, 
    Trash2, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    Info, 
    Tag, 
    Package,
    Star,
    Banknote,
    QrCode,
    CreditCard as CardIcon
} from 'lucide-react';
import { API_URL } from '../api';

const ProductDetailsModal = ({
    isOpen,
    onClose,
    product,
    onAddToCart,
    onRemoveFromCart,
    onBuyNow,
    isInCart
}) => {
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (!product) return null;

    // Helpers
    const calculateDiscount = (price, oldPrice) => {
        if (!oldPrice || oldPrice <= price) return null;
        const discount = ((oldPrice - price) / oldPrice) * 100;
        return Math.round(discount);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const productImage = product.image 
        ? (product.image.startsWith('http') ? product.image : `${API_URL}${product.image.startsWith('/uploads') ? product.image : '/uploads/' + product.image}`)
        : null;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullScreen={isMobile}
            maxWidth="lg"
            fullWidth
            TransitionComponent={Fade}
            PaperProps={{
                sx: {
                    borderRadius: { xs: 0, md: '0px' },
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    maxHeight: '95vh',
                    border: '1px solid rgba(200,169,106,0.2)'
                }
            }}
        >
            <Box sx={{ position: 'relative', bgcolor: '#0D0D0D', color: '#F5E6C8' }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        zIndex: 10,
                        bgcolor: 'rgba(13,13,13,0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(200,169,106,0.2)',
                        color: '#C8A96A',
                        '&:hover': { bgcolor: '#C8A96A', color: '#0D0D0D' }
                    }}
                >
                    <CloseIcon size={20} />
                </IconButton>

                <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: { md: '500px' } }}>
                        {/* Left Column */}
                        <Box sx={{
                            flex: { xs: 'none', md: 0.95 },
                            bgcolor: '#1A1A1A',
                            p: { xs: 2, md: 3 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            position: 'relative',
                            borderRight: { md: '1px solid rgba(200,169,106,0.1)' }
                        }}>
                            <Box sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: { xs: '100%', md: '460px' },
                                minHeight: { xs: '260px', md: '360px' },
                                bgcolor: '#111111',
                                border: '1px solid rgba(200,169,106,0.12)',
                                borderRadius: '18px',
                                p: { xs: 2, md: 2.5 },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2.5,
                                overflow: 'hidden'
                            }}>
                                {productImage ? (
                                    <img
                                        src={productImage}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            maxWidth: '100%',
                                            maxHeight: '320px',
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))'
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#C8A96A]/10 min-h-[240px]">
                                        <Package className="w-24 h-24 mb-4" strokeWidth={1} />
                                        <span className="text-[10px] uppercase font-black tracking-[0.3em]">Institutional Collection</span>
                                    </div>
                                )}

                                {calculateDiscount(product.price, product.oldPrice) && (
                                    <div className="absolute top-0 left-0 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] px-5 py-2.5 rounded-2xl font-bold text-sm shadow-2xl border border-white/20">
                                        {calculateDiscount(product.price, product.oldPrice)}% OFF
                                    </div>
                                )}
                            </Box>

                            <Box sx={{ mt: 1, display: 'flex', gap: { xs: 2, md: 3 }, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-[#C8A96A]" />
                                    <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em' }}>Secure</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Truck className="w-5 h-5 mx-auto mb-1 text-[#C8A96A]" />
                                    <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em' }}>Delivery</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <RotateCcw className="w-5 h-5 mx-auto mb-1 text-[#C8A96A]" />
                                    <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em' }}>Returns</Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Right Column */}
                        <Box sx={{
                            flex: { xs: 'none', md: 1.05 },
                            p: { xs: 3, md: 5 },
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" sx={{ fontFamily: 'serif', fontWeight: 700, color: '#F5E6C8', lineHeight: 1.2, mb: 1, letterSpacing: '-0.01em' }}>
                                    {product.name}
                                </Typography>
                                <Chip
                                    label={product.category === "Beauty and cosmetic home based products" ? "Cosmetics" : (product.category || "General")}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(200,169,106,0.05)',
                                        color: '#C8A96A',
                                        fontWeight: 900,
                                        fontSize: '11px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        mb: 1.5,
                                        borderRadius: '0px',
                                        border: '1px solid rgba(200,169,106,0.1)'
                                    }}
                                />

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-3 h-3 ${star <= Math.round(product.rating || 5)
                                                    ? "fill-[#C8A96A] text-[#C8A96A]"
                                                    : "text-gray-800"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <Typography variant="caption" sx={{ color: 'rgba(245,230,200,0.8)', fontWeight: 950, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {product.numReviews || 0} REVIEWS
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 4, p: 2.5, bgcolor: '#0D0D0D', border: '1px solid rgba(200,169,106,0.1)' }}>
                                 <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 0.5 }}>
                                    <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#C8A96A', letterSpacing: '-0.02em', fontFamily: 'serif' }}>
                                        ₹{formatCurrency(product.price)}
                                    </Typography>
                                    {product.oldPrice && (
                                        <Typography sx={{ textDecoration: 'line-through', color: 'rgba(245,230,200,0.6)', fontSize: '1rem', fontWeight: 600 }}>
                                            ₹{formatCurrency(product.oldPrice)}
                                        </Typography>
                                    )}
                                </Box>
                                {product.oldPrice && (
                                    <Typography variant="caption" sx={{ color: '#C8A96A', opacity: 0.9, fontWeight: 950, fontSize: '11px', textTransform: 'uppercase', tracking: '0.1em' }}>
                                        Benefit: ₹{formatCurrency(product.oldPrice - product.price)} ({calculateDiscount(product.price, product.oldPrice)}% Off)
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mb: 6 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#F5E6C8', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Info className="w-4 h-4 text-[#C8A96A]" /> Description
                                </Typography>
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(245,230,200,0.9)',
                                            lineHeight: 1.8,
                                            fontSize: '15px',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: isDescExpanded ? 'none' : 5,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {product.description || "Indulge in our premium quality product, crafted with the finest ingredients and rigorous quality checks."}
                                    </Typography>
                                    {product.description && product.description.length > 300 && (
                                        <Button
                                            size="small"
                                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                                            sx={{
                                                mt: 1,
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                color: '#f7931e',
                                                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                                                p: 0,
                                                minWidth: 'auto'
                                            }}
                                        >
                                            {isDescExpanded ? 'View Less' : 'View More'}
                                        </Button>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 4 }}>
                                 <Box sx={{ p: 2, bgcolor: '#0D0D0D', border: '1px solid rgba(200,169,106,0.1)' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(245,230,200,0.8)', fontWeight: 950, fontSize: '11px', display: 'block', mb: 0.5, textTransform: 'uppercase', tracking: '0.2em' }}>BV Value</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#F5E6C8', display: 'flex', alignItems: 'center', gap: 1, fontSize: '11px' }}>
                                        <Tag className="w-3.5 h-3.5 text-[#C8A96A]/60" /> BV: {product.bv || '0'}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 2, bgcolor: '#0D0D0D', border: '1px solid rgba(200,169,106,0.1)' }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(245,230,200,0.8)', fontWeight: 950, fontSize: '11px', display: 'block', mb: 0.5, textTransform: 'uppercase', tracking: '0.2em' }}>Status</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: product.stock > 0 ? '#C8A96A' : '#f59e0b', display: 'flex', alignItems: 'center', gap: 1, fontSize: '11px', textTransform: 'uppercase' }}>
                                        <Package className="w-3.5 h-3.5" /> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 950, fontSize: '11px', textTransform: 'uppercase', tracking: '0.2em', color: 'rgba(245,230,200,0.8)', mb: 1.5, display: 'center', alignItems: 'center', gap: 1 }}>
                                    <Banknote className="w-3.5 h-3.5 text-[#C8A96A]/40" /> Payment Methods
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {(product.paymentMethods || ['cod', 'upi', 'card']).includes('cod') && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.75, bgcolor: 'rgba(200,169,106,0.05)', border: '1px solid rgba(200,169,106,0.1)' }}>
                                            <Banknote size={12} className="text-[#C8A96A]/60" />
                                            <Typography variant="caption" sx={{ fontWeight: '950', fontSize: '11px', color: '#C8A96A', textTransform: 'uppercase' }}>COD</Typography>
                                        </Box>
                                    )}
                                    {(product.paymentMethods || ['cod', 'upi', 'card']).includes('upi') && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.75, bgcolor: 'rgba(200,169,106,0.05)', border: '1px solid rgba(200,169,106,0.1)' }}>
                                            <QrCode size={12} className="text-[#C8A96A]/60" />
                                            <Typography variant="caption" sx={{ fontWeight: '950', fontSize: '11px', color: '#C8A96A', textTransform: 'uppercase' }}>UPI</Typography>
                                        </Box>
                                    )}
                                    {(product.paymentMethods || ['cod', 'upi', 'card']).includes('card') && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.75, bgcolor: 'rgba(200,169,106,0.05)', border: '1px solid rgba(200,169,106,0.1)' }}>
                                            <CardIcon size={12} className="text-[#C8A96A]/60" />
                                            <Typography variant="caption" sx={{ fontWeight: '950', fontSize: '11px', color: '#C8A96A', textTransform: 'uppercase' }}>CARD</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ mt: 'auto', display: 'flex', gap: 1.5 }}>
                                {isInCart ? (
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        size="large"
                                        startIcon={<Trash2 className="w-4 h-4" />}
                                        onClick={() => onRemoveFromCart(product._id, product.name)}
                                        sx={{
                                             borderRadius: '0px',
                                            py: 1.5,
                                            borderColor: 'rgba(255,0,0,0.2)',
                                            color: '#ef4444',
                                            fontWeight: 900,
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.2em',
                                            '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(255,0,0,0.05)' }
                                        }}
                                    >
                                        Remove From Cart
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        size="large"
                                        startIcon={<ShoppingCart className="w-4 h-4" />}
                                        onClick={() => onAddToCart(product)}
                                        disabled={product.stock === 0}
                                        sx={{
                                             borderRadius: '0px',
                                            py: 1.5,
                                            borderColor: 'rgba(200,169,106,0.3)',
                                            color: '#C8A96A',
                                            fontWeight: 900,
                                            fontSize: '11px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.2em',
                                            '&:hover': { borderColor: '#C8A96A', bgcolor: 'rgba(200,169,106,0.05)' }
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={() => onBuyNow(product)}
                                    disabled={product.stock === 0}
                                    sx={{
                                         borderRadius: '0px',
                                        py: 1.5,
                                        bgcolor: '#C8A96A',
                                        color: '#0D0D0D',
                                        fontWeight: 900,
                                        fontSize: '11px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        boxShadow: '0 10px 20px -3px rgba(200, 169, 106, 0.2)',
                                        '&:hover': { bgcolor: '#D4AF37' }
                                    }}
                                >
                                    Buy Now
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default ProductDetailsModal;
