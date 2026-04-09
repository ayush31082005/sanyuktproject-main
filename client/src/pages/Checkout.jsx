import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, Shield, MapPin, Phone, Mail, User, Package, IndianRupee } from 'lucide-react';
import api, { API_URL } from '../api';
import { Snackbar, Alert, Fade } from '@mui/material';
import { addressData } from '../data/addressData';
import { ChevronDown, Search } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // State for dropdowns
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const [stateSearch, setStateSearch] = useState('');
    const stateDropdownRef = useRef(null);

    const states = Object.keys(addressData).sort();
    const filteredStates = states.filter(s =>
        s.toLowerCase().includes(stateSearch.toLowerCase())
    );

    // Form states
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [discount, setDiscount] = useState(0);

    const availableMethods = Array.isArray(product?.paymentMethods) && product.paymentMethods.length > 0
        ? product.paymentMethods
        : ['cod', 'upi', 'card'];

    // Set initial payment method
    useEffect(() => {
        if (availableMethods.length > 0 && !paymentMethod) {
            setPaymentMethod(availableMethods[0]);
        }
    }, [availableMethods, paymentMethod]);

    // Handle click outside for dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
                setIsStateDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Agar product नहीं है तो redirect
    useEffect(() => {
        if (!product) {
            navigate('/products');
        }
    }, [product, navigate]);

    // Fetch User Profile to pre-fill form
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('auth/profile');
                if (data?.user) {
                    setShippingInfo(prev => ({
                        ...prev,
                        fullName: data.user.name || '',
                        email: data.user.email || '',
                        phone: data.user.phone || ''
                    }));
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };
        fetchProfile();
    }, []);

    if (!product) return null;

    // Calculate totals
    const subtotal = product.price || 0;
    const shipping = subtotal > 500 ? 0 : 40;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax - discount;

    const handleInputChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const formatCurrency = (amount) => {
        return typeof amount === 'number' ? amount.toFixed(2) : '0.00';
    };

    const handleApplyCoupon = () => {
        // Demo coupons
        if (couponCode === 'WELCOME10') {
            setDiscount(subtotal * 0.1);
            setCouponApplied(true);
            setSnackbar({ open: true, message: 'Coupon applied successfully! 10% discount', severity: 'success' });
        } else if (couponCode === 'SAVE20') {
            setDiscount(subtotal * 0.2);
            setCouponApplied(true);
            setSnackbar({ open: true, message: 'Coupon applied successfully! 20% discount', severity: 'success' });
        } else {
            setSnackbar({ open: true, message: 'Invalid coupon code', severity: 'error' });
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(true), { once: true });
                existingScript.addEventListener('error', () => resolve(false), { once: true });
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        // Validate form fields with regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const pincodeRegex = /^[0-9]{6}$/;

        if (!shippingInfo.fullName.trim()) {
            setSnackbar({ open: true, message: 'Full name is required', severity: 'warning' });
            return;
        }
        if (!emailRegex.test(shippingInfo.email)) {
            setSnackbar({ open: true, message: 'Please enter a valid email address', severity: 'warning' });
            return;
        }
        if (!phoneRegex.test(shippingInfo.phone)) {
            setSnackbar({ open: true, message: 'Phone number must be exactly 10 digits', severity: 'warning' });
            return;
        }
        if (shippingInfo.address.length < 10) {
            setSnackbar({ open: true, message: 'Please provide a complete address (min 10 chars)', severity: 'warning' });
            return;
        }
        if (!shippingInfo.city.trim()) {
            setSnackbar({ open: true, message: 'City is required', severity: 'warning' });
            return;
        }
        if (!shippingInfo.state) {
            setSnackbar({ open: true, message: 'Please select a state', severity: 'warning' });
            return;
        }
        if (!pincodeRegex.test(shippingInfo.pincode)) {
            setSnackbar({ open: true, message: 'Pincode must be exactly 6 digits', severity: 'warning' });
            return;
        }
        if (!paymentMethod) {
            setSnackbar({ open: true, message: 'Please select a payment method', severity: 'warning' });
            return;
        }

        if (paymentMethod === 'cod') {
            await createOrder();
        } else {
            await handleRazorpayPayment();
        }
    };

    const handleRazorpayPayment = async () => {
        setLoading(true);
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                setSnackbar({ open: true, message: 'Razorpay SDK failed to load. Are you online?', severity: 'error' });
                setLoading(false);
                return;
            }

            // 1. Create order on server
            const { data: rpOrder } = await api.post('/orders/razorpay-order', { amount: total });
            if (!rpOrder || !rpOrder.id || !rpOrder.amount || !rpOrder.currency) {
                throw new Error('Invalid payment order response from server');
            }
            const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!razorpayKeyId) {
                console.error("Razorpay key is missing in frontend env");
                alert("Payment configuration error. Please contact support.");
                setLoading(false);
                return;
            }

            const options = {
                key: razorpayKeyId,
                amount: rpOrder.amount,
                currency: rpOrder.currency,
                name: "Sanyukt Parivaar",
                description: `Order for ${product.name}`,
                image: `${API_URL}/logo.png?v=20260403`,
                order_id: rpOrder.id,
                handler: async (response) => {
                    if (!response || !response.razorpay_payment_id) {
                        console.error("Invalid Razorpay response", response);
                        alert("Payment failed. Try again.");
                        setLoading(false);
                        return;
                    }

                    try {
                        // 2. Verification and Order Finalization
                        await createOrder({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                    } catch (err) {
                        console.error('Order finalization failed:', err);
                        setSnackbar({ open: true, message: 'Payment captured but order finalization failed. Please contact support.', severity: 'error' });
                        setLoading(false);
                    }
                },
                prefill: {
                    name: shippingInfo.fullName,
                    email: shippingInfo.email,
                    contact: shippingInfo.phone,
                },
                theme: {
                    color: "#C8A96A",
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                const reason =
                    response?.error?.description ||
                    response?.error?.reason ||
                    response?.error?.code ||
                    'Payment failed. Please try again.';
                setSnackbar({ open: true, message: `Payment Failed: ${reason}`, severity: 'error' });
                setLoading(false);
            });
            rzp.open();
        } catch (error) {
            console.error('Razorpay payment error:', error);
            setSnackbar({ open: true, message: 'Error initiating payment. Please try again.', severity: 'error' });
            setLoading(false);
        }
    };

    const createOrder = async (paymentDetails = {}) => {
        setLoading(true);
        try {
            const productId = product?._id || product?.id;
            if (!productId) {
                throw new Error('Product identifier missing');
            }
            const normalizedPaymentMethod = paymentMethod || (paymentDetails?.razorpay_payment_id ? 'online' : 'cod');
            const orderData = {
                product: productId,
                quantity: 1,
                shippingInfo,
                paymentMethod: normalizedPaymentMethod,
                subtotal,
                shipping,
                tax,
                discount,
                total,
                orderDate: new Date(),
                ...paymentDetails
            };

            // API call to place order
            const response = await api.post('/orders', orderData);

            setOrderDetails(response.data);
            setOrderPlaced(true);
            setCurrentStep(3);
        } catch (error) {
            console.error('Error placing order:', error?.response || error);
            const message = error?.response?.data?.message;
            setSnackbar({
                open: true,
                message: message || 'Error placing order. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Order Success Page
    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-600 mb-6">Thank you for your purchase</p>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                            <h3 className="font-semibold text-gray-800 mb-4">Order Details</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Order Number:</span>
                                    <span className="font-medium text-gray-800">#{orderDetails?._id?.slice(-8)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Product:</span>
                                    <span className="font-medium text-gray-800">{product.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Quantity:</span>
                                    <span className="font-medium text-gray-800">1</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="font-medium text-[#0A7A2F]">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium text-gray-800 uppercase">
                                        {paymentMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Estimated Delivery:</span>
                                    <span className="font-medium text-gray-800">
                                        {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/products')}
                                className="flex-1 px-6 py-3 bg-[#0A7A2F] text-white rounded-xl font-semibold hover:bg-[#2F7A32] transition-all"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigate(`/order-details/${orderDetails?._id}`)}
                                className="flex-1 px-6 py-3 border border-[#0A7A2F] text-[#0A7A2F] rounded-xl font-semibold hover:bg-[#0A7A2F] hover:text-white transition-all"
                            >
                                Track Order Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#F5E6C8] pb-12">
            <div className="max-w-7xl mx-auto px-4 pt-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[#C8A96A] hover:text-[#D4AF37] mb-6 transition-colors font-black uppercase tracking-widest text-xs"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Products
                </button>

                {/* Checkout Steps */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center relative">
                        {/* Connecting Lines (Background) */}
                        <div className="absolute top-5 left-0 w-full h-0.5 bg-[#C8A96A]/10 -z-0"></div>
                        
                        <div className="flex items-center gap-16 md:gap-24 relative z-10">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${currentStep >= 1 ? 'bg-[#C8A96A] text-[#0D0D0D]' : 'bg-[#1A1A1A] border border-[#C8A96A]/20 text-[#C8A96A]/60'
                                    }`}>1</div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${currentStep >= 1 ? 'text-[#C8A96A]' : 'text-[#C8A96A]/50'}`}>Details</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${currentStep >= 2 ? 'bg-[#C8A96A] text-[#0D0D0D]' : 'bg-[#1A1A1A] border border-[#C8A96A]/20 text-[#C8A96A]/60'
                                    }`}>2</div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${currentStep >= 2 ? 'text-[#C8A96A]' : 'text-[#C8A96A]/50'}`}>Payment</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${currentStep >= 3 ? 'bg-[#C8A96A] text-[#0D0D0D]' : 'bg-[#1A1A1A] border border-[#C8A96A]/20 text-[#C8A96A]/60'
                                    }`}>3</div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${currentStep >= 3 ? 'text-[#C8A96A]' : 'text-[#C8A96A]/50'}`}>Verify</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Information */}
                        <div className="bg-[#1A1A1A] border border-[#C8A96A]/10 rounded-none p-6 md:p-8 shadow-2xl">
                            <h2 className="text-lg font-serif font-bold text-[#C8A96A] mb-6 flex items-center gap-3 uppercase tracking-wider">
                                <Truck className="w-5 h-5" />
                                Shipping Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-[#C8A96A] uppercase tracking-widest mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingInfo.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-base focus:border-[#C8A96A] focus:outline-none transition-all placeholder:text-[#F5E6C8]/40"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#C8A96A] uppercase tracking-widest mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingInfo.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-base focus:border-[#C8A96A] focus:outline-none transition-all placeholder:text-[#F5E6C8]/40"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#C8A96A] uppercase tracking-widest mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 10) {
                                                setShippingInfo({ ...shippingInfo, phone: val });
                                            }
                                        }}
                                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-base focus:border-[#C8A96A] focus:outline-none transition-all placeholder:text-[#F5E6C8]/40 font-mono"
                                        placeholder="0000000000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#C8A96A] uppercase tracking-widest mb-2">
                                        Landmark (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={shippingInfo.landmark}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-base focus:border-[#C8A96A] focus:outline-none transition-all placeholder:text-[#F5E6C8]/40"
                                        placeholder="Nearby landmark"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black text-[#C8A96A] uppercase tracking-widest mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-base focus:border-[#C8A96A] focus:outline-none transition-all placeholder:text-[#F5E6C8]/40"
                                        placeholder="Enter your complete address"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#C8A96A] uppercase tracking-widest mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-base focus:border-[#C8A96A] focus:outline-none transition-all placeholder:text-[#F5E6C8]/40"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#C8A96A] uppercase tracking-widest mb-2">
                                        State *
                                    </label>
                                    <div className="relative" ref={stateDropdownRef}>
                                        <div
                                            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                                            className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 flex items-center justify-between cursor-pointer focus:border-[#C8A96A] transition-all"
                                        >
                                            <span className={shippingInfo.state ? 'text-[#F5E6C8]' : 'text-[#F5E6C8]/40 text-base'}>
                                                {shippingInfo.state || 'Select State'}
                                            </span>
                                            <ChevronDown className={`h-4 w-4 text-[#C8A96A] transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        <AnimatePresence>
                                            {isStateDropdownOpen && (
                                                <Motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute z-50 w-full mt-1 bg-[#1A1A1A] border border-[#C8A96A]/20 shadow-2xl overflow-hidden"
                                                >
                                                    <div className="p-2 bg-[#0D0D0D] border-b border-[#C8A96A]/10">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C8A96A]/60" />
                                                            <input
                                                                type="text"
                                                                placeholder="Search state..."
                                                                value={stateSearch}
                                                                onChange={(e) => setStateSearch(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="w-full pl-9 pr-3 py-2 text-sm bg-[#1A1A1A] border border-[#C8A96A]/10 text-[#F5E6C8] focus:border-[#C8A96A] focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                        {filteredStates.length > 0 ? (
                                                            filteredStates.map((st) => (
                                                                <div
                                                                    key={st}
                                                                    onClick={() => {
                                                                        setShippingInfo({ ...shippingInfo, state: st });
                                                                        setIsStateDropdownOpen(false);
                                                                        setStateSearch('');
                                                                    }}
                                                                    className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest cursor-pointer transition-colors hover:bg-[#C8A96A]/10 hover:text-[#C8A96A] ${shippingInfo.state === st ? 'bg-[#C8A96A] text-[#0D0D0D]' : 'text-[#F5E6C8]/60'}`}
                                                                >
                                                                    {st}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-4 text-xs text-[#F5E6C8]/40 text-center italic uppercase tracking-widest">
                                                                No states found
                                                            </div>
                                                        )}
                                                    </div>
                                                </Motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-[#C8A96A] uppercase tracking-widest mb-2">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={shippingInfo.pincode}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 6) {
                                                setShippingInfo({ ...shippingInfo, pincode: val });
                                            }
                                        }}
                                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-base focus:border-[#C8A96A] focus:outline-none transition-all placeholder:text-[#F5E6C8]/40 font-mono"
                                        placeholder="000000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-[#1A1A1A] border border-[#C8A96A]/10 rounded-none p-6 md:p-8 shadow-2xl">
                            <h2 className="text-lg font-serif font-bold text-[#C8A96A] mb-6 flex items-center gap-3 uppercase tracking-wider">
                                <CreditCard className="w-5 h-5" />
                                Payment Method
                            </h2>

                            <div className="space-y-4">
                                {availableMethods.includes('cod') && (
                                    <label className={`flex items-center p-5 border transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-[#C8A96A] bg-[#C8A96A]/5' : 'border-[#C8A96A]/10 bg-[#0D0D0D]'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 accent-[#C8A96A]"
                                        />
                                        <span className="ml-4 flex items-center gap-3">
                                            <IndianRupee className="w-5 h-5 text-[#C8A96A]" />
                                            <span className="font-bold text-[#F5E6C8] uppercase tracking-widest text-xs">Cash on Delivery</span>
                                        </span>
                                    </label>
                                )}

                                {availableMethods.includes('upi') && (
                                    <label className={`flex items-center p-5 border transition-all cursor-pointer ${paymentMethod === 'upi' ? 'border-[#C8A96A] bg-[#C8A96A]/5' : 'border-[#C8A96A]/10 bg-[#0D0D0D]'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="upi"
                                            checked={paymentMethod === 'upi'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 accent-[#C8A96A]"
                                        />
                                        <span className="ml-4 flex items-center gap-3">
                                            <div className="w-5 h-5 bg-[#C8A96A] rounded flex items-center justify-center text-[10px] text-[#0D0D0D] font-black">UPI</div>
                                            <span className="font-bold text-[#F5E6C8] uppercase tracking-widest text-xs">UPI (GPay/PhonePe/Paytm)</span>
                                        </span>
                                    </label>
                                )}

                                {availableMethods.includes('card') && (
                                    <label className={`flex items-center p-5 border transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-[#C8A96A] bg-[#C8A96A]/5' : 'border-[#C8A96A]/10 bg-[#0D0D0D]'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4 accent-[#C8A96A]"
                                        />
                                        <span className="ml-4 flex items-center gap-3">
                                            <CreditCard className="w-5 h-5 text-[#C8A96A]" />
                                            <span className="font-bold text-[#F5E6C8] uppercase tracking-widest text-xs">Debit / Credit Card</span>
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1A1A1A] border border-[#C8A96A]/10 rounded-none p-6 sticky top-24 shadow-2xl">
                            <h2 className="text-lg font-serif font-bold text-[#C8A96A] mb-6 uppercase tracking-wider">Order Summary</h2>

                            {/* Product Details */}
                            <div className="flex gap-3 mb-6 pb-6 border-b border-[#C8A96A]/10">
                                <div className="w-16 h-16 bg-[#0D0D0D] border border-[#C8A96A]/20 overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image.startsWith('/uploads') ? product.image : '/uploads/' + product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                            📦
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-serif font-bold text-[#F5E6C8] text-xs line-clamp-2 leading-tight uppercase tracking-tight">
                                        {product.name}
                                    </h3>
                                    <p className="text-[#C8A96A] font-black mt-1 text-sm">
                                        ₹{formatCurrency(product.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                                    <span className="text-[#C8A96A]">Subtotal</span>
                                    <span className="text-[#F5E6C8]">₹{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                                    <span className="text-[#C8A96A]">Shipping</span>
                                    <span className="text-[#F5E6C8]">
                                        {shipping === 0 ? 'Free' : `₹${formatCurrency(shipping)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                                    <span className="text-[#C8A96A]">GST (18%)</span>
                                    <span className="text-[#F5E6C8]">₹{formatCurrency(tax)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-[#C8A96A]">
                                        <span>Discount</span>
                                        <span>-₹{formatCurrency(discount)}</span>
                                    </div>
                                )}
                                <div className="border-t border-[#C8A96A]/10 pt-4 mt-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C8A96A]">Total Amount</span>
                                        <span className="text-[#C8A96A] text-2xl font-serif font-bold">₹{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="COUPON CODE"
                                        className="flex-1 px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-xs font-black tracking-widest focus:border-[#C8A96A] focus:outline-none transition-all placeholder:text-[#F5E6C8]/40"
                                        disabled={couponApplied}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={couponApplied}
                                        className={`px-4 py-2 bg-[#C8A96A] text-[#0D0D0D] text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all ${couponApplied ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className={`w-full py-4 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-4 h-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    'Place Order'
                                )}
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-[#C8A96A]/10">
                                <div className="grid grid-cols-3 gap-2 text-[10px] font-black text-[#C8A96A]/70 uppercase tracking-widest text-center">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5" />
                                        Secure
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 border-x border-[#C8A96A]/10">
                                        <Truck className="w-3.5 h-3.5" />
                                        Fast
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <Package className="w-3.5 h-3.5" />
                                        Genuine
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Global Notifications Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Fade}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '0',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '10px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        bgcolor: '#1A1A1A',
                        color: '#C8A96A',
                        border: '1px solid rgba(200,169,106,0.2)',
                        '& .MuiAlert-icon': { color: '#C8A96A' }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CheckoutPage;
