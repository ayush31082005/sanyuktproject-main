import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { devSharedFetch } from '../utils/devSharedFetch';
import { useCart } from '../context/CartContext';
import {
    ChevronRight, ChevronDown, Check, ArrowRight,
    Smartphone, Search, ShoppingCart, Mail, Phone,
    MapPin, Clock, Facebook, Instagram, Youtube, Twitter,
    Shield, Star, Package, TrendingUp, Users, Heart, Award, Play, X, Wallet
} from 'lucide-react';

// Lazy load section components
const HeroSection = React.lazy(() => import('./HomeComponents/HeroSection'));
// const RechargeSection = React.lazy(() => import('./HomeComponents/RechargeSection'));
const AboutSection = React.lazy(() => import('./HomeComponents/AboutSection'));
const WhyChooseSection = React.lazy(() => import('./HomeComponents/WhyChooseSection'));
const ProductsCarousel = React.lazy(() => import('./HomeComponents/ProductsCarousel'));
const BusinessOpportunity = React.lazy(() => import('./HomeComponents/BusinessOpportunity'));
const TrainingSection = React.lazy(() => import('./HomeComponents/TrainingSection'));
const NewsSection = React.lazy(() => import('./HomeComponents/NewsSection'));
const QuickServices = React.lazy(() => import('./HomeComponents/QuickServices'));

import ProductDetailsModal from '../components/ProductDetailsModal';
import PaymentMethodModal from '../components/PaymentMethodModal';
import BrowsePlansModal from '../components/BrowsePlansModal';

// Simple loading fallback
const SectionLoader = () => (
    <div className="w-full py-20 flex items-center justify-center bg-[#0D0D0D]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C8A96A]"></div>
    </div>
);

const HomePage = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageErrors, setImageErrors] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // Mobile recharge form state
    const [mobileNumber, setMobileNumber] = useState('');
    const [operator, setOperator] = useState('');
    const [amount, setAmount] = useState('');
    const [showPlansModal, setShowPlansModal] = useState(false);
    const [circle, setCircle] = useState('10');
    const [planCircles, setPlanCircles] = useState([]);
    const [mobilePlans, setMobilePlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [isDetectingOperator, setIsDetectingOperator] = useState(false);
    const [hasTriedDetection, setHasTriedDetection] = useState(false);

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // E-commerce state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const { addToCart: contextAddToCart, removeFromCart, isInCart } = useCart();
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [addedToCartProduct, setAddedToCartProduct] = useState('');


    // Hero slides data
    const heroSlides = [
        {
            image: "/hero1.png",
            title: "Welcome to Sanyukt Parivaar & Rich Life Pvt.Ltd.",
            subtitle: "Smart Solutions for a Smarter Future",
            description: "A people-driven direct selling organization committed to individual growth and financial independence through a high-quality lifestyle and wellness products."
        },
        {
            image: "/hero2.png",
            title: "Welcome to Sanyukt Parivaar & Rich Life Pvt.Ltd.",
            subtitle: "Smart Solutions for a Smarter Future",
            description: "A people-driven direct selling organization committed to individual growth and financial independence through a high-quality lifestyle and wellness products."
        },
        {
            image: "/hero3.png",
            title: "Welcome to Sanyukt Parivaar & Rich Life Pvt.Ltd.",
            subtitle: "Smart Solutions for a Smarter Future",
            description: "A people-driven direct selling organization committed to individual growth and financial independence through a high-quality lifestyle and wellness products."
        },
        {
            image: "/hero4.jpeg",
            title: "Welcome to Sanyukt Parivaar & Rich Life Pvt.Ltd.",
            subtitle: "Smart Solutions for a Smarter Future",
            description: "A people-driven direct selling organization committed to individual growth and financial independence through a high-quality lifestyle and wellness products."
        }
    ];

    // About section image
    const aboutImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";

    // Team images
    const teamImages = [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80"
    ];


    // Business opportunity image
    const businessImage = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";

    // Training image
    const trainingImage = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";

    // Mobile operators list with professional icon SVGs
    const AIRTEL_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%23ED1C24'/><text x='50' y='68' font-family='Arial,sans-serif' font-size='65' font-weight='900' fill='white' text-anchor='middle'>a</text></svg>`;
    const JIO_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%230066CC'/><text x='50' y='62' font-family='Arial,sans-serif' font-size='38' font-weight='900' fill='white' text-anchor='middle'>Jio</text></svg>`;
    const VI_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%23E11D48'/><text x='42' y='65' font-family='Arial,sans-serif' font-size='55' font-weight='900' fill='white' text-anchor='middle'>V</text><text x='72' y='65' font-family='Arial,sans-serif' font-size='35' font-weight='900' fill='%23FBBF24' text-anchor='middle'>!</text></svg>`;
    const BSNL_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%23005CAF'/><text x='50' y='62' font-family='Arial,sans-serif' font-size='32' font-weight='900' fill='white' text-anchor='middle'>BSNL</text></svg>`;

    const operators = [
        {
            id: 'airtel',
            name: 'Airtel',
            logo: AIRTEL_LOGO,
            tagline: '5G Ready',
            bgColor: 'bg-red-50'
        },
        {
            id: 'jio',
            name: 'Jio',
            logo: JIO_LOGO,
            tagline: 'True 5G',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'vi',
            name: 'Vi',
            logo: VI_LOGO,
            tagline: 'Best Value',
            bgColor: 'bg-purple-50'
        },
        {
            id: 'bsnl',
            name: 'BSNL',
            logo: BSNL_LOGO,
            tagline: 'Pan-India',
            bgColor: 'bg-yellow-50'
        }
    ];



    // E-commerce state
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const whyChoosePoints = [
        { icon: <Shield className="w-5 h-5" />, text: "Transparent & legal MLM business model" },
        { icon: <Package className="w-5 h-5" />, text: "High-quality, daily-use products" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Unlimited income potential" },
        { icon: <Users className="w-5 h-5" />, text: "Regular training & leadership programs" },
        { icon: <Heart className="w-5 h-5" />, text: "Strong support system" },
        { icon: <Award className="w-5 h-5" />, text: "Long-term vision with stable growth" }
    ];

    const businessHighlights = [
        "Low investment, high growth potential",
        "Work from anywhere",
        "Earn part-time or full-time",
        "Build a stable and scalable income"
    ];

    const supportItems = [
        "Product knowledge training",
        "Business & leadership development",
        "Online and offline seminars",
        "Marketing & growth strategies"
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await devSharedFetch(
                    'home:products',
                    async () => {
                        const response = await api.get('/products');
                        return response.data;
                    },
                    4000
                );
                // Only show featured products on the homepage carousel,
                // fallback to first 8 products if no featured products found
                const featured = data.filter(p => p.isFeatured);
                setProducts(featured.length > 0 ? featured : data.slice(0, 8));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    // Check authentication status
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                try {
                    const parsedUser = JSON.parse(user);
                    setIsLoggedIn(true);
                    setUserRole(parsedUser.role || 'user');
                } catch {
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [navigate]);

    const normalizePlans = (providerData) => {
        if (!providerData || typeof providerData !== 'object') return [];

        const normalized = [];
        Object.entries(providerData).forEach(([bucket, plans]) => {
            if (!Array.isArray(plans)) return;
            plans.forEach((plan, index) => {
                const parsedAmount = Number(plan?.rs);
                if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
                normalized.push({
                    id: `${bucket}-${parsedAmount}-${index}`,
                    amount: parsedAmount,
                    validity: plan?.validity || 'NA',
                    data: 'N/A',
                    description: plan?.desc || 'Plan details unavailable',
                    category: plan?.Type || bucket
                });
            });
        });

        return normalized.sort((a, b) => a.amount - b.amount);
    };

    const mapProviderCompanyToOperatorId = (providerPayload = {}) => {
        const normalized = [
            providerPayload?.company,
            providerPayload?.operator,
            providerPayload?.operator_name,
            providerPayload?.provider,
            providerPayload?.opcode,
            providerPayload?.op_code,
            providerPayload?.opid
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();

        const tokens = new Set(normalized.split(/\s+/).filter(Boolean));

        if (tokens.has('airtel') || tokens.has('at')) return 'airtel';
        if (tokens.has('jio') || tokens.has('rj') || tokens.has('jo')) return 'jio';
        if (tokens.has('vi') || tokens.has('vf') || normalized.includes('voda') || normalized.includes('vodafone') || normalized.includes('idea')) return 'vi';
        if (tokens.has('bsnl') || tokens.has('bt') || tokens.has('bs')) return 'bsnl';
        return '';
    };

    const normalizeCircleCode = (value) => {
        if (value === undefined || value === null) return '';
        const digits = String(value).replace(/\D/g, '');
        return digits ? digits.padStart(2, '0') : '';
    };

    const resolveCircleCodeFromDetection = (payload = {}) => {
        const directCode = normalizeCircleCode(
            payload?.circle_code ?? payload?.circleCode ?? payload?.circlecode
        );
        if (directCode) return directCode;

        const providerCircle = String(payload?.circle || '').trim().toUpperCase();
        if (!providerCircle || !Array.isArray(planCircles) || planCircles.length === 0) {
            return '';
        }

        const normalizedProvider = providerCircle
            .replace(/&/g, 'AND')
            .replace(/[^A-Z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');

        const aliasMap = {
            KOLKATA: 'KOLKATTA',
            ODISHA: 'ORISSA',
            MIZORAM: 'MIZZORAM',
            HIMACHAL_PRADESH: 'HP',
            JAMMU_AND_KASHMIR: 'J_AND_K',
            JAMMU_KASHMIR: 'J_AND_K',
            UTTAR_PRADESH_EAST: 'UP_EAST',
            UTTAR_PRADESH_WEST: 'UP_WEST',
            NORTH_EAST: 'NESA',
            NORTH_EASTERN: 'NESA'
        };

        const lookupName = aliasMap[normalizedProvider] || normalizedProvider;
        const matched = planCircles.find((c) => String(c.name || '').toUpperCase() === lookupName);
        return matched?.code || '';
    };

    useEffect(() => {
        const fetchPlanCircles = async () => {
            try {
                const data = await devSharedFetch(
                    'home:plan-circles',
                    async () => {
                        const response = await api.get('/recharge/plan-circles');
                        return response.data;
                    },
                    4000
                );
                if (data?.success && Array.isArray(data.circles)) {
                    setPlanCircles(data.circles);
                    const selectedExists = data.circles.some((c) => c.code === circle);
                    if (!selectedExists && data.circles.length > 0) {
                        setCircle(data.circles[0].code);
                    }
                }
            } catch (error) {
                console.error('Error fetching plan circles:', error);
            }
        };

        fetchPlanCircles();
    }, []);

    useEffect(() => {
        const shouldFetchPlans = operator && /^\d{10}$/.test(mobileNumber) && circle;
        if (!shouldFetchPlans) {
            setMobilePlans([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setPlansLoading(true);
                const { data } = await api.get('/recharge/plans', {
                    params: {
                        mobile: mobileNumber,
                        operator,
                        circle
                    }
                });

                if (data?.success && data?.data) {
                    setMobilePlans(normalizePlans(data.data));
                } else {
                    setMobilePlans([]);
                }
            } catch (error) {
                console.error('Error fetching mobile plans:', error);
                setMobilePlans([]);
            } finally {
                setPlansLoading(false);
            }
        }, 450);

        return () => clearTimeout(timeoutId);
    }, [operator, mobileNumber, circle]);

    useEffect(() => {
        const sanitizedMobile = String(mobileNumber || '').replace(/\D/g, '').slice(0, 10);

        if (!/^\d{10}$/.test(sanitizedMobile)) {
            setHasTriedDetection(false);
            setIsDetectingOperator(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setIsDetectingOperator(true);
                setHasTriedDetection(true);
                const { data } = await api.get('/recharge/operator-fetch', {
                    params: { mobile: sanitizedMobile }
                });

                const detectedOperator = mapProviderCompanyToOperatorId(data);
                const detectedCircle = resolveCircleCodeFromDetection(data);

                if (detectedOperator) {
                    setOperator(detectedOperator);
                }
                if (detectedCircle) {
                    setCircle(detectedCircle);
                }
            } catch (error) {
                console.error('Operator detection failed on home recharge:', error);
            } finally {
                setIsDetectingOperator(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [mobileNumber, planCircles]);



    const handleNavigation = (path, options = {}) => {
        navigate(path, options);
    };

    const fetchWalletBalance = async () => {
        try {
            const { data } = await api.get('mlm/get-stats');
            setWalletBalance(data.walletBalance || 0);
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
        }
    };

    const handleRecharge = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error('Please login to proceed with recharge');
            navigate('/login');
            return;
        }
        if (!mobileNumber || !operator || !amount) {
            toast.error('Please fill all fields');
            return;
        }
        if (!/^\d{10}$/.test(mobileNumber)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }
        if (Number(amount) <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        const validPlanAmounts = new Set(
            mobilePlans.map((plan) => Number(plan.amount)).filter((amt) => amt > 0)
        );

        // If plans are fetched, we validate. If not, we allow manual entry but show a warning
        if (mobilePlans.length > 0 && !validPlanAmounts.has(Number(amount))) {
            toast.error('Please select an amount from the available plans or check if the amount is valid.');
            return;
        }

        if (mobileNumber && operator && Number(amount) > 0) {
            await fetchWalletBalance();
            setShowPaymentModal(true);
        }
    };

    const handleFinalPayment = async (method) => {
        if (method === 'wallet') {
            try {
                setIsProcessingPayment(true);
                const toastId = toast.loading("Processing wallet payment...");

                const { data } = await api.post('/recharge/wallet', {
                    amount: Number(amount),
                    type: 'mobile',
                    operator,
                    rechargeNumber: mobileNumber
                });

                if (data.success) {
                    toast.success("Recharge successful!", { id: toastId });
                    setMobileNumber('');
                    setOperator('');
                    setAmount('');
                    setShowPaymentModal(false);
                } else {
                    toast.error(data.message || "Wallet payment failed", { id: toastId });
                }
            } catch (error) {
                console.error("Wallet Payment Error:", error);
                toast.error(error?.response?.data?.message || "Something went wrong with wallet payment");
            } finally {
                setIsProcessingPayment(false);
            }
        } else if (method === 'online') {
            // Razorpay logic
            try {
                setIsProcessingPayment(true);
                const toastId = toast.loading("Initiating secure payment...");

                // 1. Create Order on backend
                const { data: orderData } = await api.post('/recharge/create-order', {
                    amount: Number(amount),
                    type: 'mobile',
                    operator,
                    rechargeNumber: mobileNumber
                });

                if (!orderData.success) {
                    toast.error("Failed to initiate order", { id: toastId });
                    setIsProcessingPayment(false);
                    return;
                }
                if (!orderData?.order?.id || !orderData?.order?.amount) {
                    throw new Error("Invalid payment order response from server");
                }

                const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
                if (!razorpayKeyId) {
                    console.error("Razorpay key is missing in frontend env");
                    alert("Payment configuration error. Please contact support.");
                    setIsProcessingPayment(false);
                    return;
                }

                toast.dismiss(toastId);

                // 2. Open Razorpay Checkout Widget
                const options = {
                    key: razorpayKeyId,
                    amount: orderData.order.amount,
                    currency: "INR",
                    name: "Sanyukt Parivaar",
                    description: "Mobile Recharge",
                    order_id: orderData.order.id,
                    handler: async function (response) {
                        if (!response || !response.razorpay_payment_id) {
                            console.error("Invalid Razorpay response", response);
                            alert("Payment failed. Try again.");
                            setIsProcessingPayment(false);
                            return;
                        }

                        try {
                            const verifyToast = toast.loading("Verifying payment...");

                            // 3. Verify Payment
                            const { data: verifyData } = await api.post('/recharge/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                transactionId: orderData.transactionId
                            });
                            if (!verifyData || typeof verifyData !== "object") {
                                throw new Error("Invalid verification response from server");
                            }

                            if (verifyData.success) {
                                toast.success("Recharge successful!", { id: verifyToast });
                                setMobileNumber('');
                                setOperator('');
                                setAmount('');
                                setShowPaymentModal(false);
                            } else {
                                toast.error("Payment verification failed", { id: verifyToast });
                            }
                        } catch (err) {
                            console.error(err);
                            toast.error("Error verifying payment");
                        } finally {
                            setIsProcessingPayment(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessingPayment(false);
                        }
                    },
                    prefill: {
                        name: "Sanyukt Member",
                        email: "info@sanyuktparivaar.com",
                        contact: (mobileNumber || "").toString().replace(/\D/g, '').slice(-10)
                    },
                    theme: {
                        color: "#C9A84C"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    toast.error(`Payment Failed: ${response.error.description}`);
                    setIsProcessingPayment(false);
                });
                rzp1.open();

            } catch (error) {
                console.error("Recharge Error:", error);
                toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
                setIsProcessingPayment(false);
            }
        }
    };

    const openPlanPopup = () => {
        setShowPlansModal(true);
    };

    const handleImageError = (productName) => {
        setImageErrors(prev => ({ ...prev, [productName]: true }));
    };


    const addToCart = (product) => {
        contextAddToCart(product);
        setAddedToCartProduct(product.name);
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleBuyNow = (product) => {
        if (!isLoggedIn) {
            toast.error('Please login to proceed');
            navigate('/login');
            return;
        }
        setIsProductModalOpen(false);
        navigate('/checkout', { state: { product } });
    };


    const calculateDiscount = (mrp, dp) => {
        const mrpValue = typeof mrp === 'string' ? parseInt(mrp.replace('₹', '')) : mrp;
        const dpValue = typeof dp === 'string' ? parseInt(dp.replace('₹', '')) : dp;
        if (!mrpValue || !dpValue) return 0;
        const discount = ((mrpValue - dpValue) / mrpValue * 100).toFixed(0);
        return discount;
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} className="w-3 h-3 fill-current text-yellow-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className="relative">
                        <Star className="w-3 h-3 text-gray-300" />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star className="w-3 h-3 fill-current text-yellow-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
            }
        }
        return stars;
    };




    const carouselRef = React.useRef(null);
    const scroll = (direction) => {
        const container = carouselRef.current;
        if (container) {
            const scrollAmount = container.offsetWidth * 0.8;
            const targetScroll = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans">
            <React.Suspense fallback={<SectionLoader />}>
                <HeroSection
                    currentSlide={currentSlide}
                    setCurrentSlide={setCurrentSlide}
                    heroSlides={heroSlides}
                    isLoggedIn={isLoggedIn}
                    userRole={userRole}
                    handleNavigation={handleNavigation}
                />

                <div className="w-full flex items-center justify-center gap-2 sm:gap-5 mt-4 mb-4 px-4 sm:px-5">
                    <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-r from-transparent via-[#b88a44] to-transparent" />

                    <span
                        className="text-center text-xl sm:text-2xl md:text-[32px] italic font-medium text-[#d4a64a] leading-tight"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                        Create a Life You Love with Your Family!
                    </span>

                    <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-r from-transparent via-[#b88a44] to-transparent" />
                </div>

                <QuickServices />

                <AboutSection
                    aboutImage={aboutImage}
                    teamImages={teamImages}
                />

                <div className="luxury-divider"><span>WHY CHOOSE US</span></div>

                <WhyChooseSection
                    whyChoosePoints={whyChoosePoints}
                />

                {/* <RechargeSection
                    mobileNumber={mobileNumber}
                    setMobileNumber={setMobileNumber}
                    operator={operator}
                    setOperator={setOperator}
                    circle={circle}
                    setCircle={setCircle}
                    circles={planCircles}
                    amount={amount}
                    setAmount={setAmount}
                    operators={operators}
                    openPlanPopup={openPlanPopup}
                    handleRecharge={handleRecharge}
                    isLoggedIn={isLoggedIn}
                    plansLoading={plansLoading}
                    isDetectingOperator={isDetectingOperator}
                    hasTriedDetection={hasTriedDetection}
                /> */}

                <div className="w-full flex items-center justify-center gap-2 sm:gap-5 my-1 sm:my-2 px-4 sm:px-5">
                    <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-r from-transparent via-[#b88a44] to-transparent" />

                    <span
                        className="text-center text-xl sm:text-2xl md:text-[32px] italic font-medium text-[#d4a64a] leading-tight"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                        Join Our Community!
                    </span>

                    <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-r from-transparent via-[#b88a44] to-transparent" />
                </div>
                <div className="luxury-divider"><span>OUR PRODUCTS</span></div>

                <ProductsCarousel
                    products={products}
                    loading={loadingProducts}
                    scroll={scroll}
                    carouselRef={carouselRef}
                    calculateDiscount={calculateDiscount}
                    imageErrors={imageErrors}
                    handleImageError={handleImageError}
                    renderStars={renderStars}
                    addToCart={addToCart}
                    onProductClick={handleProductClick}
                    handleNavigation={handleNavigation}
                />

                <div className="luxury-divider"><span>OPPORTUNITY</span></div>

                <BusinessOpportunity
                    businessHighlights={businessHighlights}
                    businessImage={businessImage}
                    handleNavigation={handleNavigation}
                />

                <div className="luxury-divider"><span>SANYUKT PARIVAAR</span></div>

                {/* Mid CTA Strip */}
                <section className="py-4 px-4">
                    <div className="max-w-5xl mx-auto luxury-box p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <h3 className="text-sm md:text-lg font-serif font-bold text-[#F5E6C8] text-center md:text-left uppercase tracking-widest leading-tight">
                            One of India's Fastest Growing <br /> Direct Selling Companies
                        </h3>
                        <button
                            onClick={() => handleNavigation('/contact')}
                            className="luxury-button"
                        >
                            Contact Now
                        </button>
                    </div>
                </section>

                <div className="luxury-divider"><span>Sanyukt Parivaar TRAINING</span></div>

                <TrainingSection
                    supportItems={supportItems}
                    trainingImage={trainingImage}
                    handleNavigation={handleNavigation}
                />

                <NewsSection />

                <div className="luxury-divider"><span>OUR VISION</span></div>

                {/* Final Trust Section */}
                <section className="py-4 bg-[#0D0D0D] relative overflow-hidden" >
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-xl md:text-3xl font-serif font-bold mb-1 text-[#C8A96A] uppercase tracking-widest">
                            Together We Grow, <span className="text-[#F5E6C8]">Together We Prosper</span>
                        </h2>
                        <div className="w-20 h-[1px] bg-[#C8A96A]/40 mx-auto mb-3"></div>
                        <p className="text-[10px] md:text-xs font-light mb-4 max-w-2xl mx-auto text-[#F5E6C8]/60 uppercase tracking-tight">
                            We don't just build income - we build people, confidence, and a better future.
                        </p>
                        <button
                            onClick={() => handleNavigation('/registation')}
                            className="luxury-button px-10 py-3 text-sm"
                        >
                            Join Sanyukt Parivaar Today
                        </button>
                    </div>
                </section>
            </React.Suspense>

            {/* Payment Method Modal */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={handleFinalPayment}
                amount={Number(amount)}
                walletBalance={walletBalance}
                isProcessing={isProcessingPayment}
            />

            {/* Product Details Modal */}
            <ProductDetailsModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                product={selectedProduct}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onBuyNow={handleBuyNow}
                isInCart={selectedProduct ? isInCart(selectedProduct._id) : false}
            />

            {/* Cart Notification */}
            {showCartNotification && (
                <div className="fixed bottom-8 right-8 z-50 animate-fadeInUp">
                    <div className="bg-[#1A1A1A]/95 backdrop-blur-md text-[#F5E6C8] px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 border border-[#C8A96A]/30">
                        <div className="w-8 h-8 rounded-full bg-[#C8A96A] flex items-center justify-center text-[#0D0D0D]">
                            <Check className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{addedToCartProduct} added to cart!</span>
                    </div>
                </div>
            )}

            {/* Browse Plans Modal */}
            <BrowsePlansModal
                isOpen={showPlansModal}
                onClose={() => setShowPlansModal(false)}
                onSelect={(amount) => setAmount(amount)}
                operator={operator ? operators.find(op => op.id === operator)?.name : ''}
                plans={mobilePlans}
            />
        </div>
    );
};

export default HomePage;
