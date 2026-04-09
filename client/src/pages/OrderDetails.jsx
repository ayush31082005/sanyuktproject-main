import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Package, Truck, CheckCircle, Clock, MapPin, 
    CreditCard, ArrowRight, Download, FileText, ShoppingBag, 
    ShieldCheck, Calendar, Info, Navigation, Boxes
} from 'lucide-react';

import api, { API_URL } from '../api';
import { 
    Box, Typography, Button, Paper, Divider, 
    Chip, Snackbar, Alert, CircularProgress 
} from '@mui/material';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setSnackbar({
                    open: true,
                    message: 'Error fetching order details. Please try again.',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    const getPaymentLabel = (method) => {
        const labels = {
            cod: 'Cash on Delivery',
            upi: 'UPI Payment',
            card: 'Card Payment',
            online: 'Online Payment'
        };
        return labels[method] || method?.toUpperCase() || 'N/A';
    };

    const handleDownloadInvoice = () => {
        if (!order) return;
        setDownloadLoading(true);

        try {
            const invoiceContent = document.createElement('div');
            invoiceContent.innerHTML = generateInvoiceHTML();

            const options = {
                margin: [0.3, 0.3, 0.3, 0.3],
                filename: `Invoice_${order._id.slice(-8).toUpperCase()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    letterRendering: true, 
                    useCORS: true,
                    logging: false,
                    allowTaint: true
                },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(options).from(invoiceContent).save();

            setSnackbar({
                open: true,
                message: 'Invoice generated successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error generating invoice:', error);
            setSnackbar({
                open: true,
                message: 'Error generating invoice. Please try again.',
                severity: 'error'
            });
        } finally {
            setDownloadLoading(false);
        }
    };

    const generateInvoiceHTML = () => {
        const orderData = order;
        const product = order.product || {};
        const shipping = order.shippingInfo || {};
        const date = new Date(orderData.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        return `
            <div style="font-family: 'Times New Roman', Times, serif; padding: 40px; color: #000; background: #fff; line-height: 1.4; border: 1px solid #000;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px;">
                    <div style="flex: 1;">
                        <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">Tax Invoice</h1>
                        <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">Original for Recipient</p>
                        <div style="margin-top: 20px; font-size: 12px;">
                            <p style="margin: 0; font-weight: bold; text-decoration: underline;">Sold By:</p>
                            <p style="margin: 2px 0; font-size: 14px; font-weight: bold;">Sanyukt Parivaar & Rich Life Pvt Ltd</p>
                            <p style="margin: 0;">Regd. Office: Corporate Node, India</p>
                            <p style="margin: 0;">Email: support@sanyuktparivaar.com</p>
                            <p style="margin: 0;">Phone: +91 6746237467</p>
                        </div>
                    </div>
                    <div style="text-align: right; flex: 1;">
                        <h2 style="margin: 0; font-size: 16px; color: #0A7A2F;">SANYUKT PARIVAAR & RICH LIFE PVT LTD</h2>
                        <p style="margin: 2px 0; font-size: 10px; font-style: italic;">Empowering Lives, Together</p>
                        <div style="margin-top: 15px; border: 1px solid #000; padding: 5px; display: inline-block;">
                            <img src="${API_URL}/uploads/${product.image}" style="width: 100px; height: 100px; object-fit: contain;" />
                        </div>
                    </div>
                </div>

                <!-- Info Grid -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; font-size: 12px;">
                    <div>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="font-weight: bold; width: 40%; vertical-align: top;">Invoice No:</td>
                                <td style="text-transform: uppercase;">#SPINV-${orderData._id?.slice(-8)}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">Invoice Date:</td>
                                <td>${date}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">Order ID:</td>
                                <td style="text-transform: uppercase;">#${orderData._id?.slice(-8)}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">Payment Mode:</td>
                                <td style="text-transform: uppercase;">${orderData.paymentMethod || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;">Payment Status:</td>
                                <td style="text-transform: uppercase; color: ${orderData.paymentStatus === 'paid' ? '#0A7A2F' : '#000'};">${orderData.paymentStatus || 'Pending'}</td>
                            </tr>
                        </table>
                    </div>
                    <div>
                        <p style="margin: 0 0 5px 0; font-weight: bold; text-decoration: underline;">Shipping Address:</p>
                        <p style="margin: 0; font-size: 14px; font-weight: bold;">${shipping.fullName || 'N/A'}</p>
                        <p style="margin: 2px 0;">${shipping.address || 'N/A'}</p>
                        <p style="margin: 0;">${shipping.city || ''}, ${shipping.state || ''} - ${shipping.pincode || ''}</p>
                        <p style="margin: 5px 0 0 0; font-weight: bold;">Contact No: ${shipping.phone || 'N/A'}</p>
                    </div>
                </div>

                <!-- Product Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; border: 1px solid #000;">
                    <thead>
                        <tr style="background: #f2f2f2; border-bottom: 1px solid #000;">
                            <th style="padding: 10px; text-align: left; border-right: 1px solid #000;">SI. No</th>
                            <th style="padding: 10px; text-align: left; border-right: 1px solid #000; width: 50%;">Description of Goods</th>
                            <th style="padding: 10px; text-align: center; border-right: 1px solid #000;">Qty</th>
                            <th style="padding: 10px; text-align: right; border-right: 1px solid #000;">Unit Price</th>
                            <th style="padding: 10px; text-align: right;">Amount (INR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #000;">
                            <td style="padding: 15px 10px; border-right: 1px solid #000; vertical-align: top;">1</td>
                            <td style="padding: 15px 10px; border-right: 1px solid #000;">
                                <p style="margin: 0; font-weight: bold;">${product.name || 'Product'}</p>
                                <p style="margin: 5px 0 0 0; font-size: 10px; color: #444;">ID/SKU: SP-${product._id?.slice(-6).toUpperCase()}</p>
                            </td>
                            <td style="padding: 15px 10px; text-align: center; border-right: 1px solid #000; vertical-align: top;">${orderData.quantity || 1}</td>
                            <td style="padding: 15px 10px; text-align: right; border-right: 1px solid #000; vertical-align: top;">₹${product.price?.toLocaleString()}</td>
                            <td style="padding: 15px 10px; text-align: right; font-weight: bold; vertical-align: top;">₹${orderData.subtotal?.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="border-right: 1px solid #000;"></td>
                            <td style="padding: 8px 10px; text-align: right; border-right: 1px solid #000; font-weight: bold;">Subtotal</td>
                            <td style="padding: 8px 10px; text-align: right; font-weight: bold;">₹${orderData.subtotal?.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="border-right: 1px solid #000;"></td>
                            <td style="padding: 8px 10px; text-align: right; border-right: 1px solid #000; font-weight: bold;">Shipping</td>
                            <td style="padding: 8px 10px; text-align: right; font-weight: bold;">${orderData.shipping === 0 ? '0.00' : '₹' + orderData.shipping?.toLocaleString()}</td>
                        </tr>
                        <tr style="background: #f2f2f2; border-top: 1px solid #000;">
                            <td colspan="3" style="border-right: 1px solid #000;"></td>
                            <td style="padding: 10px; text-align: right; border-right: 1px solid #000; font-weight: bold; font-size: 14px;">Total</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px;">₹${orderData.total?.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Bottom Sections -->
                <div style="display: flex; justify-content: space-between; gap: 40px; font-size: 11px;">
                    <div style="flex: 1.5;">
                        <p style="margin: 0 0 5px 0; font-weight: bold; text-decoration: underline;">Declaration:</p>
                        <p style="margin: 0;">This is a computer-generated tax invoice and does not require a physical signature. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                        
                        <div style="margin-top: 15px;">
                            <p style="margin: 0 0 5px 0; font-weight: bold; text-decoration: underline;">Terms & Conditions:</p>
                            <ul style="margin: 0; padding-left: 15px;">
                                <li>All disputes are subject to local jurisdiction only.</li>
                                <li>No returns accepted on opened pharmaceutical/hygiene products.</li>
                                <li>Payment is inclusive of all applicable service charges.</li>
                            </ul>
                        </div>
                    </div>
                    <div style="flex: 1; text-align: right; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end;">
                        <div style="border: 1px solid #000; padding: 20px; text-align: center; width: 100%;">
                            <p style="margin: 0 0 40px 0; font-weight: bold; font-size: 10px;">For Sanyukt Parivaar & Rich Life PVT LTD</p>
                            <div style="border-top: 1px dashed #000; margin-bottom: 2px;"></div>
                            <p style="margin: 0; font-weight: bold; text-transform: uppercase;">Authorized Signatory</p>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 40px; padding-top: 10px; border-top: 1px solid #eee; text-align: center; font-size: 10px; color: #666;">
                    Corporate Office: Node A, Business Hub, India | CIN: SP-RL-2024-IN
                </div>
            </div>
        `;
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white rounded-3xl animate-pulse">
                <CircularProgress sx={{ color: '#0A7A2F' }} size={60} thickness={4} />
                <p className="mt-4 font-black uppercase tracking-[0.3em] text-slate-300 text-sm">Loading Data</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-2xl mx-auto p-10 text-center bg-white rounded-3xl shadow-xl mt-10">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="text-red-400" size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Order Not Found</h3>
                <p className="text-slate-500 mb-8">The requested order coordinates could not be found in our encrypted records.</p>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/my-account/orders')}
                    sx={{ bgcolor: '#0A7A2F', px: 4, py: 1.5, borderRadius: '15px', fontWeight: 'bold' }}
                >
                    Back to Orders
                </Button>
            </div>
        );
    }

    // Comprehensive tracking steps - aligned with admin capabilities
    const allPossibleSteps = [
        { status: 'pending', label: 'Order Confirmed', description: 'System verified and order locked', icon: Package },
        { status: 'paid', label: 'Payment Success', description: 'Financial clearance received', icon: ShieldCheck },
        { status: 'processing', label: 'In Processing', description: 'Quality checks and packaging', icon: Clock },
        { status: 'shipped', label: 'Dispatched', description: 'Handed over to carrier network', icon: Boxes },
        { status: 'reached_store', label: 'Reached Store', description: 'Order arrived at local distribution node', icon: MapPin },
        { status: 'out_for_delivery', label: 'Out for Delivery', description: 'Courier is en-route to your location', icon: Truck },
        { status: 'delivered', label: 'Delivered', description: 'Order successfully delivered', icon: CheckCircle }
    ];

    const trackingSteps = order.tracking || [];
    
    // Find the highest index reached
    const officialStatusIndex = allPossibleSteps.findIndex(s => s.status === order.status?.toLowerCase());
    const logIndices = trackingSteps.map(ts => allPossibleSteps.findIndex(s => s.status === ts.status?.toLowerCase())).filter(i => i !== -1);
    const maxReachedIndex = Math.max(officialStatusIndex, ...logIndices, 0);
    const isOrderFinalized = ['delivered', 'cancelled'].includes(order.status?.toLowerCase());


    return (
        <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto p-4 md:p-8"
        >
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={() => navigate('/my-account/orders')}
                    className="group flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                    <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black text-xs uppercase tracking-widest text-slate-600">Back</span>
                </button>

                <div className="flex gap-4">
                    <Button
                        onClick={handleDownloadInvoice}
                        disabled={downloadLoading}
                        startIcon={downloadLoading ? <CircularProgress size={16} color="inherit" /> : <Download size={18} />}
                        sx={{ 
                            borderRadius: '15px', px: 3, py: 1.5,
                            bgcolor: '#f1f5f9', color: '#475569',
                            textTransform: 'none', fontWeight: 'bold',
                            '&:hover': { bgcolor: '#e2e8f0' }
                        }}
                    >
                        {downloadLoading ? 'Encrypting...' : 'Invoice'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* --- LEFT: TRACKING TIMELINE (7 COLS) --- */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/30 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">Order Details</h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Order ID:</span>
                                        <span className="text-xs font-black text-[#0A7A2F] tracking-wider">#{order._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Chip 
                                        label={order.status?.toUpperCase() || 'UNKNOWN'} 
                                        sx={{ 
                                            bgcolor: order.status === 'delivered' ? '#0A7A2F' : order.status === 'cancelled' ? '#ef4444' : '#eab308',
                                            color: 'white', fontWeight: 'bold', borderRadius: '10px', height: '32px'
                                        }} 
                                    />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <Divider className="mb-12 opacity-50" />

                            <div className="flex flex-col space-y-0 relative">
                                {/* Vertical Line Base (Background) */}
                                <div className="absolute left-[23.5px] top-6 bottom-6 w-0.5 bg-slate-50"></div>

                                {allPossibleSteps.map((step, idx) => {
                                    const isCompleted = idx < maxReachedIndex;
                                    const isActive = idx === maxReachedIndex && order.status !== 'cancelled';
                                    const isFuture = idx > maxReachedIndex;
                                    const logEntry = trackingSteps.find(ts => ts.status?.toLowerCase() === step.status);


                                    return (
                                        <div key={idx} className={`flex items-start gap-8 py-6 relative group transition-all`}>
                                            {/* Node */}
                                            <div className={`
                                                relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500
                                                ${isCompleted || isActive ? 'bg-[#0A7A2F] text-white shadow-lg shadow-green-200' : 'bg-slate-50 text-slate-300 border border-slate-100'}
                                                ${isActive ? 'scale-110 ring-4 ring-green-50' : 'scale-100'}
                                            `}>
                                                {React.createElement(step.icon, { 
                                                    size: 22, 
                                                    className: isActive && !isOrderFinalized ? 'animate-pulse' : '' 
                                                })}

                                                
                                                {/* Line segment to next step */}
                                                {idx < allPossibleSteps.length - 1 && (
                                                    <div className={`
                                                        absolute left-[23.5px] top-12 w-0.5 h-12 transition-colors duration-500
                                                        ${idx < maxReachedIndex ? 'bg-[#0A7A2F]' : 'bg-slate-100'}
                                                    `} />
                                                )}

                                                
                                                {/* Animated Progress indicator on the line after active node */}
                                                {isActive && idx < allPossibleSteps.length - 1 && (
                                                    <Motion.div 
                                                        className="absolute left-[23.5px] top-12 w-0.5 bg-[#0A7A2F] origin-top z-20"
                                                        initial={{ height: 0 }}
                                                        animate={{ height: ['0%', '100%'] }}
                                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                                    />
                                                )}
                                            </div>

                                            {/* Label & Description */}
                                            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex flex-col">
                                                    <h3 className={`text-base font-black uppercase tracking-tight leading-none mb-1.5 
                                                        ${isFuture ? 'text-slate-300' : 'text-slate-900'}`}>
                                                        {step.label}
                                                    </h3>
                                                    <p className={`text-[11px] font-bold ${isFuture ? 'text-slate-200' : 'text-slate-500'}`}>
                                                        {logEntry?.message || (isActive ? 'Current Phase' : step.description)}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-start md:items-end">
                                                    <span className={`text-[11px] font-black uppercase tracking-widest ${isFuture ? 'text-slate-200' : 'text-slate-900'}`}>
                                                        {logEntry ? new Date(logEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${isFuture ? 'text-slate-100' : 'text-slate-400'}`}>
                                                        {logEntry ? (new Date(logEntry.timestamp).toDateString() === new Date().toDateString() ? 'Today' : 'Past') : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: ORDER DETAILS (5 COLS) --- */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Item Card */}
                    <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Order Item</span>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-3xl bg-white shadow-lg overflow-hidden border-4 border-white group-hover:scale-105 transition-transform">
                                {order.product?.image ? (
                                    <img 
                                        src={`${API_URL}/uploads/${order.product.image}`} 
                                        className="w-full h-full object-cover" 
                                        alt="Product"
                                    />
                                ) : <div className="w-full h-full flex items-center justify-center bg-green-50 text-[#0A7A2F] font-black">SP</div>}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-1">{order.product?.name || 'Product'}</h2>
                                <p className="text-sm font-bold text-slate-500 mb-2">Quantity: {order.quantity || 1}</p>
                                <div className="text-2xl font-black text-[#0A7A2F] tracking-tighter">
                                    ₹{order.total?.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Specs */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                <CreditCard size={18} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Payment Details</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Method</span>
                                <span className="font-black text-slate-700">{getPaymentLabel(order.paymentMethod)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 mb-3">
                                <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Payment</span>
                                <span className={`font-black uppercase tracking-widest text-xs ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                                    {order.paymentStatus || 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Stage</span>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : order.status === 'cancelled' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                                    <span className={`font-black uppercase tracking-widest text-xs ${order.status === 'delivered' ? 'text-green-600' : order.status === 'cancelled' ? 'text-red-500' : 'text-orange-500'}`}>
                                        {order.status || 'Processing'}
                                    </span>
                                </div>
                            </div>


                            {order.upiTransactionId && (
                                <div className="pt-4 border-t border-slate-50 flex flex-col gap-1">
                                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Ref ID</span>
                                    <span className="font-mono text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">{order.upiTransactionId}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Coordinate Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                                <MapPin size={18} />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Delivery Address</h3>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-black text-slate-800 uppercase tracking-tight">{order.shippingInfo?.fullName}</h4>
                            <p className="text-sm text-slate-500 font-bold leading-relaxed">{order.shippingInfo?.address}</p>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">
                                {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pincode}
                            </p>
                            <div className="pt-4 mt-4 border-t border-slate-50">
                                <p className="text-xs font-bold text-slate-600">Contact Number:</p>
                                <p className="text-sm font-black text-slate-900 tracking-widest">{order.shippingInfo?.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="flex gap-4">
                        <Button 
                            fullWidth
                            onClick={() => navigate('/products')}
                            sx={{ 
                                bgcolor: '#0A7A2F', color: 'white', py: 2, 
                                borderRadius: '20px', fontWeight: '900',
                                textTransform: 'uppercase', letterSpacing: '0.1em',
                                boxShadow: '0 10px 30px rgba(10, 122, 47, 0.2)',
                                '&:hover': { bgcolor: '#075f24', transform: 'translateY(-2px)' },
                                transition: 'all 0.3s'
                            }}
                        >
                            Shop More
                        </Button>
                    </div>
                </div>
            </div>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: '15px', fontWeight: 'bold' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Motion.div>
    );
};

export default OrderDetails;
