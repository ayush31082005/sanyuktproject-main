import React, { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone,
    Tv,
    Wifi,
    CheckCircle2,
    ChevronRight,
    Zap,
    CircleUser,
    Wallet,
    Heart,
    Shield,
    Clock,
    Users,
    Gift,
    Receipt,
    Search,
    Copy,
    Share2,
    Info,
    ExternalLink,
    ShieldCheck,
    Lock,
    IndianRupee,
    MapPin,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import PaymentMethodModal from "../components/PaymentMethodModal";
import BrowsePlansModal from "../components/BrowsePlansModal";
import RazorpayPaymentButton from "../components/RazorpayPaymentButton";
import {
    dthOperators,
    mobileOperators,
} from "../data/operators";

const Recharge = () => {
    const rechargeDebugEnabled = String(import.meta.env.VITE_RECHARGE_DEBUG || "")
        .toLowerCase()
        .trim() === "true";
    const rechargeDebugLog = (...args) => {
        if (rechargeDebugEnabled) {
            console.log("[RECHARGE_DEBUG]", ...args);
        }
    };

    const [activeTab, setActiveTab] = useState("mobile");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [successAmount, setSuccessAmount] = useState("");

    const triggerSuccessAlert = (msg, amount) => {
        setSuccessMessage(msg);
        setSuccessAmount(amount);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 4000);
    };

    // Form States
    const [mobileNumber, setMobileNumber] = useState("");
    const [mobileOperator, setMobileOperator] = useState("");
    const [mobileAmount, setMobileAmount] = useState("");

    const [dthNumber, setDthNumber] = useState("");
    const [dthOperator, setDthOperator] = useState("");
    const [dthAmount, setDthAmount] = useState("");

    const [planCircles, setPlanCircles] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState("10");
    const [mobilePlans, setMobilePlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [hasFetchedPlans, setHasFetchedPlans] = useState(false);
    const [mobilePlansPage, setMobilePlansPage] = useState(1);
    const MOBILE_PLANS_PER_PAGE = 8;
    const [isDetectingOperator, setIsDetectingOperator] = useState(false);
    const [detectedOperatorInfo, setDetectedOperatorInfo] = useState(null);
    const [hasTriedDetection, setHasTriedDetection] = useState(false);

    // Refs to track detection lifecycle
    const detectionInProgress = useRef(false);
    const lastDetectedMobileRef = useRef("");

    // Payment Modal States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [pendingRecharge, setPendingRecharge] = useState(null);

    // Browse Plans Modal States
    const [showPlansModal, setShowPlansModal] = useState(false);

    // User Data State
    const [userData, setUserData] = useState(null);

    // Detect Razorpay Payment Button redirect back to this page
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("razorpay_payment_link_status");
        const paymentId = params.get("razorpay_payment_id");
        if (status === "paid" || paymentId) {
            triggerSuccessAlert("Payment Successful!", "");
            toast.success("Donation payment received! Thank you.");
            // Clean up URL params so they don't persist on refresh
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }, []);

    // Fetch User Stats (Balance) and Profile
    useEffect(() => {
        const fetchAllData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                rechargeDebugLog("No token found, skipping authenticated data fetch");
                return;
            }

            try {
                const [statsRes, userRes] = await Promise.all([
                    api.get("mlm/get-stats"),
                    api.get("auth/profile"),
                ]);
                setWalletBalance(statsRes.data?.walletBalance || 0);
                setUserData(userRes.data?.user || null);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchAllData();
    }, []);

    const normalizePlans = (providerData) => {
        if (!providerData || typeof providerData !== "object") return [];

        const normalized = [];
        Object.entries(providerData).forEach(([bucket, plans]) => {
            if (!Array.isArray(plans)) return;
            plans.forEach((plan, index) => {
                const amount = Number(plan?.rs);
                if (!Number.isFinite(amount) || amount <= 0) return;
                normalized.push({
                    id: `${bucket}-${amount}-${index}`,
                    amount,
                    validity: plan?.validity || "NA",
                    data: "N/A",
                    description: plan?.desc || "Plan details unavailable",
                    category: plan?.Type || bucket,
                });
            });
        });

        return normalized.sort((a, b) => a.amount - b.amount);
    };

    useEffect(() => {
        const fetchPlanCircles = async () => {
            try {
                const { data } = await api.get("/recharge/plan-circles");
                if (data?.success && Array.isArray(data.circles)) {
                    setPlanCircles(data.circles);
                    if (
                        data.circles.length > 0 &&
                        !data.circles.find((c) => c.code === selectedCircle)
                    ) {
                        setSelectedCircle(data.circles[0].code);
                    }
                }
            } catch (error) {
                console.error("Circle fetch failed:", error);
            }
        };

        fetchPlanCircles();
    }, []);

    const mapProviderCompanyToOperatorId = (providerPayload) => {
        const normalized = [
            providerPayload?.company,
            providerPayload?.operator,
            providerPayload?.operator_name,
            providerPayload?.provider,
            providerPayload?.opcode,
            providerPayload?.op_code,
            providerPayload?.opid,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim();
        const tokens = new Set(normalized.split(/\s+/).filter(Boolean));

        if (tokens.has("airtel") || tokens.has("at")) return "airtel";
        if (tokens.has("jio") || tokens.has("rj") || tokens.has("jo")) return "jio";
        if (
            tokens.has("vi") ||
            tokens.has("vf") ||
            normalized.includes("vodafone") ||
            normalized.includes("idea")
        ) {
            return "vi";
        }
        if (tokens.has("bsnl") || tokens.has("bt") || tokens.has("bs")) return "bsnl";
        return "";
    };

    const normalizeCircleCode = (value) => {
        if (value === undefined || value === null) return "";
        const digits = String(value).replace(/\D/g, "");
        return digits ? digits.padStart(2, "0") : "";
    };

    const resolveCircleCodeFromDetection = (payload) => {
        const directCode = normalizeCircleCode(
            payload?.circle_code ?? payload?.circleCode ?? payload?.circlecode
        );
        if (directCode) return directCode;

        const providerCircle = String(payload?.circle || "").trim().toUpperCase();
        if (!providerCircle || !Array.isArray(planCircles) || planCircles.length === 0) {
            return "";
        }

        const normalizedProvider = providerCircle
            .replace(/&/g, "AND")
            .replace(/[^A-Z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");

        const aliasMap = {
            KOLKATA: "KOLKATTA",
            ODISHA: "ORISSA",
            MIZORAM: "MIZZORAM",
            HIMACHAL_PRADESH: "HP",
            JAMMU_AND_KASHMIR: "J_AND_K",
            JAMMU_KASHMIR: "J_AND_K",
            UTTAR_PRADESH_EAST: "UP_EAST",
            UTTAR_PRADESH_WEST: "UP_WEST",
            NORTH_EAST: "NESA",
            NORTH_EASTERN: "NESA",
        };
        const lookupName = aliasMap[normalizedProvider] || normalizedProvider;

        const matched = planCircles.find((c) => String(c.name || "").toUpperCase() === lookupName);

        return matched?.code || "";
    };

    // Improved detectOperatorAndCircle function
    const detectOperatorAndCircle = async (rawMobile, { showErrorToast = false, forceRedetect = false } = {}) => {
        const sanitizedMobile = String(rawMobile || "").replace(/\D/g, "").slice(0, 10);
        if (!/^\d{10}$/.test(sanitizedMobile)) {
            return { detected: false, operatorId: "", circleCode: "" };
        }

        // Prevent multiple simultaneous detections
        if (detectionInProgress.current && !forceRedetect) {
            rechargeDebugLog("Detection already in progress, skipping...");
            return { detected: false, operatorId: mobileOperator, circleCode: selectedCircle };
        }

        try {
            detectionInProgress.current = true;
            setIsDetectingOperator(true);
            setHasTriedDetection(true);

            const { data } = await api.get("/recharge/operator-fetch", {
                params: { mobile: sanitizedMobile },
            });

            const detectedOperatorId = mapProviderCompanyToOperatorId(data);
            const resolvedCircleCode = resolveCircleCodeFromDetection(data);
            const hasUsableDetectionData = Boolean(
                data?.success || detectedOperatorId || resolvedCircleCode || data?.company || data?.circle
            );

            if (hasUsableDetectionData) {
                const updates = {};
                if (detectedOperatorId) updates.operator = detectedOperatorId;
                if (resolvedCircleCode) updates.circle = resolvedCircleCode;

                // Only update if we have valid values
                if (detectedOperatorId) {
                    setMobileOperator(detectedOperatorId);
                }
                if (resolvedCircleCode) {
                    setSelectedCircle(resolvedCircleCode);
                }

                setDetectedOperatorInfo({
                    company: data.company,
                    circle: data.circle,
                    circleCode: resolvedCircleCode || data?.circle_code || "N/A",
                });

                return {
                    detected: true,
                    operatorId: detectedOperatorId || mobileOperator,
                    circleCode: resolvedCircleCode || selectedCircle,
                    updates
                };
            }

            setDetectedOperatorInfo(null);
            if (showErrorToast) {
                toast.error("Unable to auto-detect operator. Please select network manually.");
            }
            return { detected: false, operatorId: "", circleCode: "" };
        } catch (error) {
            console.error("Operator detect failed:", error);
            setDetectedOperatorInfo(null);
            if (showErrorToast) {
                toast.error("Operator detection failed. Please select network manually.");
            }
            return { detected: false, operatorId: "", circleCode: "" };
        } finally {
            setIsDetectingOperator(false);
            detectionInProgress.current = false;
        }
    };

    // Improved fetchPlansForCurrentSelection
    const fetchPlansForCurrentSelection = async ({ showToastOnEmpty = true, forceRedetect = false } = {}) => {
        const sanitizedMobile = String(mobileNumber || "").replace(/\D/g, "").slice(0, 10);
        if (!/^\d{10}$/.test(sanitizedMobile)) {
            toast.error("Enter valid 10-digit mobile number first.");
            return;
        }

        // Wait for any ongoing detection to complete
        if (detectionInProgress.current) {
            toast.loading("Detecting operator...", { duration: 2000 });
            await new Promise(resolve => {
                const checkInterval = setInterval(() => {
                    if (!detectionInProgress.current) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            });
        }

        let operatorForPlans = mobileOperator;
        let circleForPlans = selectedCircle;

        // Try to detect if operator is empty OR if forceRedetect is true
        if (forceRedetect || !operatorForPlans) {
            const detectionResult = await detectOperatorAndCircle(sanitizedMobile, {
                showErrorToast: !operatorForPlans,
                forceRedetect
            });

            // Use detection results if available
            if (detectionResult.operatorId) {
                operatorForPlans = detectionResult.operatorId;
            }
            if (detectionResult.circleCode) {
                circleForPlans = detectionResult.circleCode;
            }
        }

        if (!operatorForPlans) {
            toast.error("Please select a network operator.");
            return;
        }
        if (!circleForPlans) {
            toast.error("Please select a circle.");
            return;
        }

        try {
            setPlansLoading(true);
            const { data } = await api.get("/recharge/plans", {
                params: {
                    mobile: sanitizedMobile,
                    operator: operatorForPlans,
                    circle: circleForPlans,
                },
            });

            const normalized = data?.data ? normalizePlans(data.data) : [];
            setMobilePlans(normalized);
            setHasFetchedPlans(true);
            setMobilePlansPage(1);

            if (normalized.length === 0 && showToastOnEmpty) {
                toast("No plans found for selected operator/circle. You can enter amount manually.");
            }
        } catch (error) {
            console.error("Live plan fetch failed:", error);
            setMobilePlans([]);
            setHasFetchedPlans(true);
            toast.error(
                error?.response?.data?.message || "Unable to fetch plans right now."
            );
        } finally {
            setPlansLoading(false);
        }
    };

    // Auto-detect on every new valid mobile number
    useEffect(() => {
        const sanitizedMobile = String(mobileNumber || "").replace(/\D/g, "").slice(0, 10);

        if (!/^\d{10}$/.test(sanitizedMobile)) {
            setDetectedOperatorInfo(null);
            setHasTriedDetection(false);
            setMobileOperator("");
            lastDetectedMobileRef.current = "";
            return;
        }

        if (sanitizedMobile === lastDetectedMobileRef.current) {
            return;
        }
        lastDetectedMobileRef.current = sanitizedMobile;

        const timeoutId = setTimeout(async () => {
            await detectOperatorAndCircle(sanitizedMobile);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [mobileNumber, planCircles]);

    useEffect(() => {
        setMobilePlans([]);
        setHasFetchedPlans(false);
        setMobilePlansPage(1);
        setMobileAmount("");
    }, [mobileOperator, mobileNumber, selectedCircle]);

    useEffect(() => {
        setMobilePlansPage(1);
    }, [mobileOperator, mobileNumber, selectedCircle, plansLoading]);

    const mobileTotalPages = Math.max(
        1,
        Math.ceil(mobilePlans.length / MOBILE_PLANS_PER_PAGE)
    );
    const validMobilePlanAmounts = new Set(
        mobilePlans.map((plan) => Number(plan.amount)).filter((amt) => amt > 0)
    );
    const isMobileAmountFromFetchedPlans =
        Number(mobileAmount) > 0 && validMobilePlanAmounts.has(Number(mobileAmount));
    const safeMobilePlansPage = Math.min(mobilePlansPage, mobileTotalPages);
    const paginatedMobilePlans = mobilePlans.slice(
        (safeMobilePlansPage - 1) * MOBILE_PLANS_PER_PAGE,
        safeMobilePlansPage * MOBILE_PLANS_PER_PAGE
    );

    const handleRecharge = async (e, type) => {
        e.preventDefault();

        let operator, rechargeNumber, amount;
        if (type === "mobile") {
            operator = mobileOperator;
            rechargeNumber = mobileNumber;
            amount = mobileAmount;
        } else if (type === "dth") {
            operator = dthOperator;
            rechargeNumber = dthNumber;
            amount = dthAmount;
        }

        if (!operator || !rechargeNumber) {
            toast.error("Please fill in all details");
            return;
        }

        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (type === "mobile") {
            if (hasFetchedPlans && mobilePlans.length > 0 && !isMobileAmountFromFetchedPlans) {
                toast.error("Please select amount only from available plans.");
                return;
            }
        }

        // Set pending recharge and show payment modal
        setPendingRecharge({
            operator,
            rechargeNumber,
            amount,
            type,
        });
        setShowPaymentModal(true);
    };

    const handleSelectPayment = async (method) => {
        if (!pendingRecharge) return;
        const { operator, rechargeNumber, amount, type } = pendingRecharge;
        if (type === "mobile") {
            if (
                hasFetchedPlans &&
                mobilePlans.length > 0 &&
                !validMobilePlanAmounts.has(Number(amount))
            ) {
                toast.error("Selected amount is not in fetched plan list.");
                return;
            }
        }
        rechargeDebugLog("handleSelectPayment start", {
            method,
            operator,
            rechargeNumber,
            amount,
            type,
        });

        setIsProcessingPayment(true);
        const toastId = toast.loading(
            method === "wallet"
                ? "Processing wallet recharge..."
                : "Initiating payment..."
        );

        try {
            if (method === "wallet") {
                rechargeDebugLog("wallet request payload", {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber,
                });
                const { data } = await api.post("/recharge/wallet", {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber,
                });
                rechargeDebugLog("wallet response", data);

                if (data.success) {
                    triggerSuccessAlert("Recharge Successful!", amount);
                    toast.success("Recharge successful using wallet!", { id: toastId });
                    // Clear forms
                    if (type === "mobile") {
                        setMobileNumber("");
                        setMobileAmount("");
                        setMobileOperator("");
                        setDetectedOperatorInfo(null);
                        setHasTriedDetection(false);
                        setMobilePlans([]);
                        setHasFetchedPlans(false);
                    }
                    if (type === "dth") {
                        setDthNumber("");
                        setDthAmount("");
                        setDthOperator("");
                    }

                    setShowPaymentModal(false);
                    setPendingRecharge(null);

                    // Refresh wallet balance
                    try {
                        const statsRes = await api.get("mlm/get-stats");
                        setWalletBalance(statsRes.data?.walletBalance || 0);
                    } catch (err) {
                        console.error("Error refreshing balance:", err);
                    }
                } else {
                    toast.error(data.message || "Wallet recharge failed", {
                        id: toastId,
                    });
                }
            } else {
                // Online/Razorpay Payment
                rechargeDebugLog("create-order request payload", {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber,
                });
                const { data: orderData } = await api.post("/recharge/create-order", {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber,
                });
                rechargeDebugLog("create-order response", orderData);
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

                const options = {
                    key: razorpayKeyId,
                    amount: orderData.order.amount,
                    currency: "INR",
                    name: "Sanyukt Parivaar",
                    description: "Recharge Payment",
                    order_id: orderData.order.id,
                    handler: async function (response) {
                        if (!response || !response.razorpay_payment_id) {
                            console.error("Invalid Razorpay response", response);
                            alert("Payment failed. Try again.");
                            setIsProcessingPayment(false);
                            return;
                        }

                        let verifyToastId;
                        try {
                            rechargeDebugLog("razorpay handler response", response);
                            verifyToastId = toast.loading("Verifying payment...");
                            const verifyPayload = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                transactionId: orderData.transactionId,
                            };
                            rechargeDebugLog("verify-payment request payload", {
                                ...verifyPayload,
                                razorpay_signature: String(
                                    verifyPayload.razorpay_signature || ""
                                ).slice(0, 10) + "...",
                            });
                            const { data: verifyData } = await api.post(
                                "/recharge/verify-payment",
                                verifyPayload
                            );
                            rechargeDebugLog("verify-payment response", verifyData);
                            if (!verifyData || typeof verifyData !== "object") {
                                throw new Error("Invalid verification response from server");
                            }

                            if (verifyData.success) {
                                triggerSuccessAlert("Payment Successful!", amount);
                                toast.success("Recharge successful!", { id: verifyToastId });
                                if (type === "mobile") {
                                    setMobileNumber("");
                                    setMobileAmount("");
                                    setMobileOperator("");
                                    setDetectedOperatorInfo(null);
                                    setHasTriedDetection(false);
                                    setMobilePlans([]);
                                    setHasFetchedPlans(false);
                                }
                                if (type === "dth") {
                                    setDthNumber("");
                                    setDthAmount("");
                                    setDthOperator("");
                                }

                                setShowPaymentModal(false);
                                setPendingRecharge(null);
                            } else {
                                toast.error("Payment verification failed", { id: verifyToastId });
                            }
                        } catch (err) {
                            console.error(err);
                            rechargeDebugLog("verify-payment error", {
                                status: err?.response?.status,
                                data: err?.response?.data,
                                message: err?.message,
                            });
                            const errorMessage =
                                err.response?.data?.message ||
                                err.message ||
                                "Error verifying payment";
                            if (verifyToastId) {
                                toast.error(errorMessage, { id: verifyToastId });
                            } else {
                                toast.error(errorMessage);
                            }
                        }
                    },
                    prefill: {
                        name: "Sanyukt Member",
                        email: "richlifesanyuktprivaar@gamil.com",
                        contact: (rechargeNumber || "")
                            .toString()
                            .replace(/\D/g, "")
                            .slice(-10),
                    },
                    theme: {
                        color: "#C8A96A",
                    },
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on("payment.failed", function (response) {
                    rechargeDebugLog("razorpay payment.failed", response);
                    toast.error(`Payment Failed: ${response.error.description}`);
                });
                rzp1.open();
            }
        } catch (error) {
            console.error("Recharge Error:", error);
            rechargeDebugLog("handleSelectPayment catch", {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
            toast.error(
                error?.response?.data?.message ||
                "Something went wrong. Please try again.",
                { id: toastId }
            );
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleManualDetection = async () => {
        const sanitizedMobile = String(mobileNumber || "").replace(/\D/g, "").slice(0, 10);
        if (!/^\d{10}$/.test(sanitizedMobile)) {
            toast.error("Please enter a valid 10-digit mobile number first");
            return;
        }
        await detectOperatorAndCircle(sanitizedMobile, { forceRedetect: true, showErrorToast: true });
    };

    const tabs = [
        { id: "mobile", label: "Mobile Recharge", icon: Smartphone },
        { id: "dth", label: "DTH Recharge", icon: Tv },
    ];

    return (
        <div className='min-h-screen bg-[#0D0D0D] flex flex-col font-sans text-[#F5E6C8]'>
            {/* ── SUCCESS ALERT BANNER (Responsive) ── */}
            <AnimatePresence>
                {showSuccessAlert && (
                    <Motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className='fixed top-[70px] md:top-[90px] left-1/2 transform -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-[500px]'
                    >
                        <div className='bg-gradient-to-br from-[#1a1a1a] to-[#0D0D0D] border-2 border-[#C8A96A] rounded-2xl p-4 md:p-5 shadow-2xl flex items-center gap-3 md:gap-4'>
                            <div className='w-10 h-10 md:w-[46px] md:h-[46px] flex-shrink-0 bg-[rgba(200,169,106,0.12)] border-2 border-[#C8A96A] rounded-full flex items-center justify-center'>
                                <CheckCircle2 size={20} className='md:w-6 md:h-6' color='#C8A96A' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='font-extrabold text-xs md:text-sm text-[#C8A96A] uppercase tracking-wider'>
                                    {successMessage}
                                </p>
                                <p className='text-[11px] md:text-xs text-[rgba(245,230,200,0.65)] font-medium mt-0.5'>
                                    ₹{successAmount} recharged successfully. 🎉
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSuccessAlert(false)}
                                className='text-[rgba(200,169,106,0.5)] hover:text-[#C8A96A] text-xl leading-none p-1'
                            >
                                ✕
                            </button>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* 1. PAGE BANNER - Responsive */}
            <section className='relative min-h-[160px] md:min-h-[240px] flex items-center justify-center overflow-hidden bg-[#0D0D0D] py-8 md:py-12'>
                <div
                    className='absolute inset-0 bg-cover bg-center opacity-100'
                    style={{
                        backgroundImage: "url('/hero2.png')",
                    }}
                ></div>
                <div className='absolute inset-0 bg-[#0D0D0D]/40 bg-gradient-to-r from-[#0D0D0D]/90 via-[#0D0D0D]/60 to-transparent'></div>
                <div className='relative z-10 text-center px-4 w-full max-w-6xl mx-auto'>
                    <h1 className='text-3xl md:text-6xl font-serif font-bold mb-2 md:mb-4 tracking-tight drop-shadow-2xl text-[#C8A96A]'>
                        Premium Services
                    </h1>
                    <div className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-[#F5E6C8]/60 mb-3 md:mb-6 tracking-widest uppercase'>
                        <span className='hover:text-[#C8A96A] cursor-pointer transition-colors'>Home</span>
                        <ChevronRight className='w-3 h-3 md:w-4 md:h-4 text-[#C8A96A]' />
                        <span className='text-[#C8A96A] font-bold'>Recharge</span>
                    </div>
                    <p className='text-sm md:text-xl font-light text-[#F5E6C8]/80 max-w-2xl mx-auto drop-shadow-md leading-relaxed px-2'>
                        Fast, secure, and exclusive services for the{" "}
                        <span className='font-serif italic text-[#C8A96A]'>Sanyukt</span> community.
                    </p>
                </div>
            </section>

            <main className='flex-grow container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-7xl'>
                {/* 2. INTRODUCTION SECTION - Responsive */}
                <section className='text-center max-w-4xl mx-auto mb-6 md:mb-8'>
                    <h2 className='text-xl md:text-3xl font-serif font-bold text-[#C8A96A] mb-2 tracking-tight'>
                        Excellence in Every Transaction
                    </h2>
                    <p className='text-xs md:text-base text-[#F5E6C8]/70 leading-relaxed font-light px-2'>
                        Experience the pinnacle of convenience with our curated digital services.
                        From seamless recharges to impactful contributions.
                    </p>
                </section>

                {/* 3. RECHARGE SERVICES SECTION - Fully Responsive */}
                <section className='mb-4 max-w-6xl mx-auto'>
                    <div className='bg-[#1A1A1A] rounded-none border border-[#C8A96A]/20 overflow-hidden shadow-2xl'>
                        {/* Responsive Tabs */}
                        <div className='grid grid-cols-2 gap-1 bg-[#0D0D0D]/50 border-b border-[#C8A96A]/10 p-1'>
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-2 md:py-4 px-2 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 transition-all rounded-none ${isActive
                                            ? "bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] shadow-lg"
                                            : "text-[#F5E6C8]/40 hover:text-[#C8A96A]"
                                            }`}
                                    >
                                        <Icon className={`w-3.5 h-3.5 md:w-5 md:h-5 ${isActive ? "text-[#0D0D0D]" : ""}`} />
                                        <span className={`font-black text-[8px] md:text-[11px] uppercase tracking-wider ${isActive ? "text-[#0D0D0D]" : ""}`}>
                                            {tab.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content - Responsive Layout */}
                        <div className='p-2.5 md:p-5'>
                            <AnimatePresence mode='wait'>
                                {activeTab === "mobile" && (
                                    <Motion.div 
                                        key='mobile' 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        exit={{ opacity: 0 }} 
                                        className='flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center'
                                    >
                                        <div className='lg:max-w-lg flex-1 space-y-2.5'>
                                            <div className='bg-[#1A1A1A] p-3 md:p-5 rounded-none border border-[#C8A96A]/20'>
                                                <h3 className='text-lg md:text-2xl font-serif font-bold text-[#C8A96A] mb-2.5'>Mobile Recharge</h3>
                                                <form onSubmit={(e) => handleRecharge(e, "mobile")} className='space-y-2.5'>
                                                    <div>
                                                        <label className='text-[10px] md:text-sm font-black text-[#C8A96A] uppercase tracking-[0.3em] flex items-center gap-2 mb-1.5'>
                                                            <Smartphone className='w-3.5 h-3.5 md:w-5 md:h-5' /> Mobile Number
                                                        </label>
                                                        <input
                                                            type='tel'
                                                            value={mobileNumber}
                                                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                                            placeholder='Enter 10-digit number'
                                                            className='w-full px-4 py-2 bg-[#0D0D0D] border-2 border-[#C8A96A]/20 focus:border-[#C8A96A] rounded-none text-[#F5E6C8] outline-none text-base md:text-xl font-black transition-all placeholder:text-gray-700'
                                                            maxLength='10'
                                                            required
                                                        />
                                                        {isDetectingOperator && <p className='text-[10px] text-[#C8A96A]/70 mt-1'>Detecting operator and circle...</p>}
                                                        {!isDetectingOperator && detectedOperatorInfo && (
                                                            <div className='flex items-center justify-between mt-1'>
                                                                <p className='text-[10px] text-green-500'>
                                                                    Auto-detected: {detectedOperatorInfo.company || "Operator"} | {detectedOperatorInfo.circle || "Circle"} ({detectedOperatorInfo.circleCode || "N/A"})
                                                                </p>
                                                                <button
                                                                    type='button'
                                                                    onClick={handleManualDetection}
                                                                    className='text-[10px] text-[#C8A96A] hover:text-[#D4AF37] flex items-center gap-1'
                                                                >
                                                                    <RefreshCw className='w-3 h-3' /> Redetect
                                                                </button>
                                                            </div>
                                                        )}
                                                        {!isDetectingOperator && !detectedOperatorInfo && hasTriedDetection && mobileNumber.length === 10 && (
                                                            <div className='flex items-center justify-between mt-1 gap-2'>
                                                                <p className='text-[10px] text-[#F5E6C8]/40'>Auto-detection failed. Select circle manually.</p>
                                                                <button
                                                                    type='button'
                                                                    onClick={handleManualDetection}
                                                                    className='text-[10px] text-[#C8A96A] hover:text-[#D4AF37] flex items-center gap-1'
                                                                >
                                                                    <RefreshCw className='w-3 h-3' /> Retry
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className='text-[10px] md:text-sm font-black text-[#C8A96A] uppercase tracking-[0.3em] flex items-center gap-2 mb-1.5'>
                                                            <CircleUser className='w-3.5 h-3.5 md:w-5 md:h-5' /> Network
                                                        </label>
                                                        <div className='grid grid-cols-4 gap-1.5 md:gap-3'>
                                                            {mobileOperators.map((op) => (
                                                                <div key={op.id} className='flex flex-col items-center gap-2'>
                                                                    <button
                                                                        type='button'
                                                                        onClick={() => setMobileOperator(op.id)}
                                                                        className={`w-full h-16 md:h-20 flex items-center justify-center rounded-none border-2 transition-all group overflow-hidden ${
                                                                            mobileOperator === op.id ? 'border-[#C8A96A] bg-white' : 'border-white/5 bg-white/5 hover:bg-white/10'
                                                                        }`}
                                                                    >
                                                                        <img src={op.logo} alt={op.name} className={`w-6 h-6 md:w-10 md:h-10 object-contain transition-all duration-300 ${mobileOperator === op.id ? 'scale-110' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'}`} />
                                                                    </button>
                                                                    <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] text-center transition-colors ${
                                                                        mobileOperator === op.id ? 'text-[#C8A96A]' : 'text-white/40'
                                                                    }`}>
                                                                        {op.name}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Circle Selection */}
                                                    <div>
                                                        <label className='text-[10px] md:text-sm font-black text-[#C8A96A] uppercase tracking-[0.3em] flex items-center gap-2 mb-1.5'>
                                                            <MapPin className='w-3.5 h-3.5 md:w-5 md:h-5' /> Circle
                                                        </label>
                                                        <select
                                                            value={selectedCircle}
                                                            onChange={(e) => setSelectedCircle(e.target.value)}
                                                            className='w-full px-4 py-2 bg-[#0D0D0D] border-2 border-[#C8A96A]/20 rounded-none text-[#F5E6C8] outline-none text-sm md:text-base font-black transition-all'
                                                        >
                                                            {planCircles.length === 0 && <option value='10'>DELHI (10)</option>}
                                                            {planCircles.map((circle) => (
                                                                <option key={circle.code} value={circle.code}>
                                                                    {circle.name.replace(/_/g, " ")} ({circle.code})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <p className='mt-1 text-[10px] text-[#F5E6C8]/30'>Circle code will be sent with plan/recharge fetch.</p>
                                                    </div>

                                                    <div className='flex gap-2'>
                                                        <button
                                                            type='button'
                                                            onClick={() => fetchPlansForCurrentSelection({ forceRedetect: !mobileOperator })}
                                                            disabled={
                                                                plansLoading ||
                                                                !/^\d{10}$/.test(mobileNumber) ||
                                                                !selectedCircle
                                                            }
                                                            className='flex-1 py-2.5 bg-[#0D0D0D] border border-[#C8A96A]/40 text-[#C8A96A] font-black text-[11px] uppercase tracking-wider rounded-lg disabled:opacity-40 disabled:cursor-not-allowed'
                                                        >
                                                            {plansLoading ? "Fetching Plans..." : "Fetch Plans"}
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <div className='flex justify-between items-center mb-1.5'>
                                                            <label className='text-[10px] md:text-sm font-black text-[#C8A96A] uppercase tracking-[0.3em]'>Amount (₹)</label>
                                                            {mobileOperator && (
                                                                <button type='button' onClick={() => setShowPlansModal(true)} className='text-[11px] md:text-xs font-black text-[#C8A96A] flex items-center gap-1 uppercase tracking-wider'>
                                                                    <Search className='w-3.5 h-3.5' /> Browse Plans
                                                                </button>
                                                            )}
                                                        </div>
                                                        <input
                                                            type='tel'
                                                            value={mobileAmount}
                                                            onChange={(e) =>
                                                                setMobileAmount(
                                                                    e.target.value.replace(/\D/g, "").slice(0, 5)
                                                                )
                                                            }
                                                            placeholder={
                                                                hasFetchedPlans && mobilePlans.length > 0
                                                                    ? "Select from plans or type amount"
                                                                    : "Enter amount"
                                                            }
                                                            className='w-full px-4 py-2 bg-[#0D0D0D] border-2 border-[#C8A96A]/20 rounded-none text-[#C8A96A] font-black text-lg md:text-2xl text-center outline-none transition-all'
                                                        />
                                                    </div>

                                                    <button type='submit' disabled={isProcessingPayment} className='w-full py-2 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black text-xs md:text-sm uppercase tracking-wider rounded-none disabled:opacity-50'>
                                                        {isProcessingPayment ? "Processing..." : "Recharge Now"}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        {/* Right Plans Panel */}
                                        <div className='lg:w-96 flex-shrink-0'>
                                            <div className={`bg-[#1A1A1A] rounded-none border border-[#C8A96A]/20 flex flex-col transition-all duration-500 overflow-hidden ${mobileOperator ? 'h-[450px]' : 'h-[120px]'}`}>
                                                <div className='p-3 border-b border-[#C8A96A]/10'>
                                                    <h4 className='text-xs font-black text-[#C8A96A] uppercase tracking-wider'>
                                                        {mobileOperator ? `${mobileOperator.toUpperCase()} Plans` : "Select Operator"}
                                                    </h4>
                                                </div>
                                                <div className='flex-1 overflow-y-auto p-2 space-y-2'>
                                                    {!mobileOperator ? (
                                                        <p className='text-center text-[#F5E6C8]/40 text-xs py-8'>Choose a network above</p>
                                                    ) : !/^\d{10}$/.test(mobileNumber) ? (
                                                        <p className='text-center text-[#F5E6C8]/40 text-xs py-8'>Enter mobile number first</p>
                                                    ) : plansLoading ? (
                                                        <p className='text-center text-[#F5E6C8]/40 text-xs py-8'>Loading plans...</p>
                                                    ) : !hasFetchedPlans ? (
                                                        <p className='text-center text-[#F5E6C8]/40 text-xs py-8'>Tap "Fetch Plans" to load plans</p>
                                                    ) : mobilePlans.length === 0 ? (
                                                        <p className='text-center text-[#F5E6C8]/40 text-xs py-8'>No plans available for selected circle</p>
                                                    ) : (
                                                        paginatedMobilePlans.map((plan) => (
                                                            <button
                                                                key={plan.id}
                                                                onClick={() => setMobileAmount(plan.amount)}
                                                                className={`w-full p-3 rounded-none border text-left transition-all ${Number(mobileAmount) === plan.amount ? 'border-[#C8A96A] bg-[#C8A96A]/10' : 'border-[#C8A96A]/10 bg-[#0D0D0D]'}`}
                                                            >
                                                                <div className='flex justify-between items-center'>
                                                                    <span className='text-lg font-bold text-[#C8A96A]'>₹{plan.amount}</span>
                                                                    <span className='text-[10px] text-[#F5E6C8]/40'>{plan.validity}</span>
                                                                </div>
                                                                <p className='text-xs text-[#F5E6C8]/70 mt-1 truncate'>{plan.description}</p>
                                                                {plan.category && (
                                                                    <span className='inline-block mt-1 text-[8px] font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-2 py-0.5 rounded'>
                                                                        {plan.category}
                                                                    </span>
                                                                )}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                                {mobilePlans.length > MOBILE_PLANS_PER_PAGE && (
                                                    <div className='flex justify-between p-2 border-t border-[#C8A96A]/10'>
                                                        <button onClick={() => setMobilePlansPage(p => Math.max(1, p - 1))} disabled={safeMobilePlansPage === 1} className='px-3 py-1 text-xs text-[#C8A96A] disabled:opacity-30'>Prev</button>
                                                        <span className='text-xs'>{safeMobilePlansPage}/{mobileTotalPages}</span>
                                                        <button onClick={() => setMobilePlansPage(p => Math.min(mobileTotalPages, p + 1))} disabled={safeMobilePlansPage === mobileTotalPages} className='px-3 py-1 text-xs text-[#C8A96A] disabled:opacity-30'>Next</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Motion.div>
                                )}

                                {activeTab === "dth" && (
                                    <Motion.div key='dth' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='max-w-2xl mx-auto'>
                                        <div className='bg-[#1A1A1A] p-6 rounded-none border border-[#C8A96A]/20'>
                                            <h3 className='text-2xl font-serif font-bold text-[#C8A96A] mb-4'>DTH Recharge</h3>
                                            <form onSubmit={(e) => handleRecharge(e, "dth")} className='space-y-4'>
                                                <div>
                                                    <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider flex items-center gap-2 mb-2'>
                                                        <Tv className='w-4 h-4' /> Customer ID / Smart Card
                                                    </label>
                                                    <input
                                                        type='text'
                                                        value={dthNumber}
                                                        onChange={(e) => setDthNumber(e.target.value)}
                                                        placeholder='Enter your registered ID'
                                                        className='w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-none text-[#F5E6C8] outline-none'
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider flex items-center gap-2 mb-2'>
                                                        <CircleUser className='w-4 h-4' /> Select Provider
                                                    </label>
                                                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                                                        {dthOperators.map((op) => (
                                                            <button
                                                                key={op.id}
                                                                type='button'
                                                                onClick={() => setDthOperator(op.id)}
                                                                className={`p-3 rounded-none border-2 transition-all flex flex-col items-center ${dthOperator === op.id ? 'border-[#C8A96A] bg-[#C8A96A]/20' : 'border-[#C8A96A]/20 bg-[#0D0D0D]'}`}
                                                            >
                                                                <span className='font-bold text-sm'>{op.logo}</span>
                                                                <span className='text-[9px] mt-1 text-[#F5E6C8]/60'>{op.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider flex items-center gap-2 mb-2'>
                                                        <Wallet className='w-4 h-4' /> Recharge Amount (₹)
                                                    </label>
                                                    <input
                                                        type='number'
                                                        value={dthAmount}
                                                        onChange={(e) => setDthAmount(e.target.value)}
                                                        placeholder='Enter amount'
                                                        className='w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-none text-[#F5E6C8] outline-none'
                                                        required
                                                    />
                                                </div>
                                                <button type='submit' disabled={isProcessingPayment} className='w-full py-3 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black rounded-none text-sm uppercase tracking-wider'>
                                                    {isProcessingPayment ? "Processing..." : "Recharge Now"}
                                                </button>
                                            </form>
                                        </div>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* 4. DONATION SECTION - Fully Responsive */}
                <section className='mb-8 relative'>
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#121212] border border-[#C8A96A]/20 rounded-2xl shadow-2xl overflow-hidden'
                    >
                        <div className='p-4 md:p-6 lg:p-8'>
                            <div className='max-w-5xl mx-auto'>
                                {/* Header */}
                                <div className='text-center mb-6 md:mb-8'>
                                    <div className='inline-flex items-center gap-2 py-1 px-3 bg-[#C8A96A]/10 backdrop-blur-md border border-[#C8A96A]/20 rounded-full mb-3'>
                                        <Heart className='w-3 h-3 md:w-4 md:h-4 text-[#C8A96A]' />
                                        <span className='text-[#C8A96A] font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em]'>
                                            The Spirit of Giving
                                        </span>
                                    </div>
                                    <h2 className='text-2xl md:text-3xl font-serif font-bold text-[#F5E6C8] mb-2'>
                                        Empower <span className='text-[#C8A96A]'>Generations</span>
                                    </h2>
                                    <p className='text-xs md:text-sm text-[#F5E6C8]/60 max-w-2xl mx-auto font-light'>
                                        Your generosity fuels our mission of collective growth.
                                    </p>
                                </div>

                                {/* Features Grid - Responsive */}
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8'>
                                    {[
                                        { title: "Secure Vault", icon: Shield, subtitle: "ENCRYPTED" },
                                        { title: "Tax Benefits", icon: Receipt, subtitle: "CERTIFIED" },
                                        { title: "Community", icon: Users, subtitle: "GLOBAL" },
                                        { title: "Instant Impact", icon: Zap, subtitle: "VERIFIED" },
                                    ].map((feature, i) => (
                                        <div key={i} className='bg-[#1A1A1A]/50 backdrop-blur-xl p-3 border border-[#C8A96A]/10 rounded-xl'>
                                            <div className='w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] rounded-lg flex items-center justify-center mb-2'>
                                                <feature.icon className='w-4 h-4 md:w-5 md:h-5 text-[#0D0D0D]' />
                                            </div>
                                            <h4 className='text-[#F5E6C8] font-bold text-xs md:text-sm'>{feature.title}</h4>
                                            <p className='text-[#C8A96A]/40 text-[8px] md:text-[9px] mt-1 font-black tracking-widest uppercase'>
                                                {feature.subtitle}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Responsive Grid for Donation Content */}
                                <div className='grid lg:grid-cols-5 gap-4 md:gap-6'>
                                    <div className='lg:col-span-3 space-y-4'>
                                        <div className='bg-[#1A1A1A]/80 backdrop-blur-3xl rounded-2xl p-4 border border-[#C8A96A]/10'>
                                            <div className='mb-3'>
                                                <span className='inline-block px-3 py-1 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-md mb-2'>
                                                    Exclusive
                                                </span>
                                                <h3 className='text-lg md:text-xl font-serif font-bold text-[#F5E6C8]'>Direct Contributions</h3>
                                            </div>
                                            <div className='bg-[#0D0D0D] rounded-xl p-3 border border-[#C8A96A]/20 mb-3'>
                                                <p className='text-[#C8A96A] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mb-2'>DIGITAL UPI ADDRESS</p>
                                                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                                                    <span className='text-xs md:text-sm font-mono font-bold text-[#F5E6C8]/90 break-all'>
                                                        20260325575843-iservuqrsbrp@cbin
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText("20260325575843-iservuqrsbrp@cbin");
                                                            toast.success("UPI Copied!");
                                                        }}
                                                        className='px-4 py-2 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-bold text-[10px] uppercase tracking-widest rounded-lg'
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {userData && (
                                            <div className='bg-[#C8A96A]/5 backdrop-blur-3xl rounded-2xl p-4 border border-[#C8A96A]/10'>
                                                <h4 className='text-[#F5E6C8] font-bold text-xs uppercase tracking-widest mb-3'>Personal Referral Hub</h4>
                                                <div className='bg-[#0D0D0D]/50 rounded-xl p-3 border border-[#C8A96A]/10 flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                                                    <p className='flex-1 text-[#F5E6C8] font-mono text-[10px] md:text-[11px] truncate w-full'>
                                                        {window.location.origin + "/donate?for=" + (userData.memberId || userData._id)}
                                                    </p>
                                                    <div className='flex gap-2'>
                                                        <button onClick={() => {
                                                            navigator.clipboard.writeText(window.location.origin + "/donate?for=" + (userData.memberId || userData._id));
                                                            toast.success("Link Copied!");
                                                        }} className='p-2 bg-[#1A1A1A] rounded-lg text-[#C8A96A] border border-[#C8A96A]/10'>
                                                            <Copy className='w-4 h-4' />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className='lg:col-span-2 space-y-4'>
                                        <div className='bg-[#1A1A1A] p-4 rounded-2xl border border-[#C8A96A]/20 text-center'>
                                            <div className='bg-[#0D0D0D] p-3 rounded-xl border border-[#C8A96A]/40 inline-block mx-auto mb-3'>
                                                <img src='/qr.jpeg' alt='QR' className='w-24 h-24 md:w-32 md:h-32 object-contain' onError={(e) => e.target.src = "https://via.placeholder.com/150?text=SCAN"} />
                                            </div>
                                            <div className='flex justify-center scale-90 md:scale-100'>
                                                <RazorpayPaymentButton buttonId='pl_SROihejcCAh8Vm' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Motion.div>
                </section>
            </main>

            {/* Modals */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={handleSelectPayment}
                amount={pendingRecharge?.amount}
                walletBalance={walletBalance}
                isProcessing={isProcessingPayment}
            />
            <BrowsePlansModal
                isOpen={showPlansModal}
                onClose={() => setShowPlansModal(false)}
                onSelect={(amount) => setMobileAmount(amount)}
                operator={mobileOperator ? mobileOperators.find((op) => op.id === mobileOperator)?.name : ""}
                plans={mobilePlans}
            />
        </div>
    );
};

export default Recharge;
