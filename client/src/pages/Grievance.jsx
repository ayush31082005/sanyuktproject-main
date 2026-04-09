import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from "../api"; // path check kar lena
import { Snackbar, Alert, Fade } from '@mui/material';

import { ChevronRight, Phone, Mail, User, MessageSquare, Send, AlertCircle, CheckCircle, ExternalLink, UserCircle, FileText, X, Ticket } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

const GrievancePage = () => {
    const [formData, setFormData] = useState({
        directSellerId: '',
        name: '',
        mobileNo: '',
        emailId: '',
        category: '',
        subject: '',
        message: ''
    });

    const [statusFormData, setStatusFormData] = useState({
        directSellerId: '',
        name: '',
        ticketNumber: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusResult, setStatusResult] = useState(null);
    const [statusError, setStatusError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const location = useLocation();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                setFormData(prev => ({
                    ...prev,
                    name: parsedUser.userName || '',
                    emailId: parsedUser.email || '',
                    mobileNo: parsedUser.mobile || ''
                }));
            } catch (error) {
                console.error("Error parsing user for grievance form:", error);
            }
        }
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const ticket = queryParams.get('ticket');
        if (ticket) {
            setStatusFormData(prev => ({ ...prev, ticketNumber: ticket }));
            setShowStatusModal(true);

            // Auto-trigger check if ticket is provided
            const fetchStatus = async () => {
                try {
                    const res = await api.post("/grievance/track", { ticket });
                    setStatusResult({
                        ticketNumber: res.data.ticketNumber,
                        status: res.data.status,
                        submittedDate: new Date(res.data.submittedDate).toLocaleDateString(),
                        lastUpdated: new Date(res.data.submittedDate).toLocaleDateString(),
                        department: "Support Team",
                        description: "Your grievance is being processed"
                    });
                } catch {
                    setStatusError("❌ Ticket not found");
                }
            };
            fetchStatus();
        }
    }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = (e) => {
        const { name, value } = e.target;
        setStatusFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.mobileNo || !formData.emailId || !formData.category || !formData.subject || !formData.message) {
            setError('Please fill in all required fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.emailId)) {
            setError('Please enter a valid email address');
            return;
        }

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(formData.mobileNo)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            setError("");

            const res = await api.post("/grievance/create", {
                sellerId: formData.directSellerId,
                name: formData.name,
                mobile: formData.mobileNo,
                email: formData.emailId,
                category: formData.category,
                subject: formData.subject,
                message: formData.message
            });

            // 🎟️ Ticket show
            setSnackbar({
                open: true,
                message: "🎟️ Your grievance has been submitted! Ticket Number: " + res.data.ticket,
                severity: 'success'
            });

            setIsSubmitted(true);

            // reset form
            setFormData({
                directSellerId: '',
                name: '',
                mobileNo: '',
                emailId: '',
                category: '',
                subject: '',
                message: ''
            });

        } catch {
            setError("❌ Server error, try again");
        }
    };
    const handleStatusCheck = async (e) => {
        e.preventDefault();

        if (!statusFormData.ticketNumber) {
            setStatusError('Please enter your ticket number');
            return;
        }

        try {
            setStatusError("");

            const res = await api.post("/grievance/track", {
                ticket: statusFormData.ticketNumber
            });

            setStatusResult({
                ticketNumber: res.data.ticketNumber,
                status: res.data.status,
                submittedDate: new Date(res.data.submittedDate).toLocaleDateString(),
                lastUpdated: new Date(res.data.submittedDate).toLocaleDateString(),
                department: "Support Team",
                description: "Your grievance is being processed"
            });

        } catch {
            setStatusError("âŒ Ticket not found");
            setStatusResult(null);
        }
    };
    const closeModal = () => {
        setShowStatusModal(false);
        setStatusResult(null);
        setStatusError('');
        setStatusFormData({
            directSellerId: '',
            name: '',
            ticketNumber: ''
        });
    };

    return (
        <div className="bg-[#0D0D0D] font-sans min-h-screen">
            {/* 1. PAGE BANNER - Premium Design */}
            <section className='relative min-h-[160px] md:min-h-[240px] flex items-center justify-center overflow-hidden bg-[#0D0D0D] py-8 md:py-12 border-b border-[#C8A96A]/20'>
                <div
                    className='absolute inset-0 bg-cover bg-center opacity-100'
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')",
                    }}
                ></div>
                <div className='absolute inset-0 bg-[#0D0D0D]/40 bg-gradient-to-r from-[#0D0D0D]/90 via-[#0D0D0D]/60 to-transparent'></div>
                <div className='relative z-10 text-center px-4 w-full max-w-6xl mx-auto'>
                    <h1 className='text-3xl md:text-6xl font-serif font-bold mb-2 md:mb-4 tracking-tight drop-shadow-2xl text-[#C8A96A] animate-fade-in'>
                        Grievance
                    </h1>
                    <div className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-[#F5E6C8]/60 tracking-widest uppercase'>
                        <Link to="/" className='hover:text-[#C8A96A] cursor-pointer transition-colors'>Home</Link>
                        <ChevronRight className='w-3 h-3 md:w-4 md:h-4 text-[#C8A96A]' />
                        <span className='text-[#C8A96A] font-bold'>Grievance</span>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Guidelines and Nodal Office */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Guidelines Card */}
                        <div className="luxury-box bg-[#1A1A1A] overflow-hidden animate-slide-right">
                            <div className="bg-[#252525] border-b border-[#C8A96A]/20 p-4">
                                <h2 className="text-base font-serif font-bold text-[#C8A96A] flex items-center gap-2 uppercase tracking-widest">
                                    <FileText className="w-5 h-5" />
                                    Guidelines
                                </h2>
                            </div>
                            <div className="p-6">
                                <ol className="space-y-4 list-decimal list-inside text-[#F5E6C8]/70 text-sm">
                                    <li className="leading-relaxed animate-fade-in">
                                        Customer / Distributor can make Grievances in either of the mentioned modes - Calls / Written Application / Email / Walk-in / Online Grievance Cell, etc.
                                    </li>
                                    <li className="leading-relaxed animate-fade-in animation-delay-200">
                                        Grievances received will be feded into the internal Grievance software. A unique track ID will be generated against all the Grievances and is intimated to the customer / distributor on his / her registered Email id and Mobile Number.
                                    </li>
                                    <li className="leading-relaxed animate-fade-in animation-delay-400">
                                        Customers / distributors need to keep the unique track Id secure with them in order to take follow-up against the Grievance.
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* Nodal Office Contact Details */}
                        <div className="luxury-box bg-[#1A1A1A] overflow-hidden animate-slide-right animation-delay-200">
                            <div className="bg-[#252525] border-b border-[#C8A96A]/20 p-4">
                                <h2 className="text-base font-serif font-bold text-[#C8A96A] flex items-center gap-2 uppercase tracking-widest">
                                    <UserCircle className="w-5 h-5" />
                                    Nodal Office Contact
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-[#0D0D0D] border border-[#C8A96A]/10">
                                    <User className="w-5 h-5 text-[#C8A96A] mt-0.5" />
                                    <div>
                                        <span className="font-bold text-[#C8A96A] text-xs uppercase tracking-widest">Name:</span>
                                        <span className="text-[#F5E6C8]/80 ml-2 text-sm">Mr. Prabhat Kumar Verma</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-[#0D0D0D] border border-[#C8A96A]/10">
                                    <Phone className="w-5 h-5 text-[#C8A96A] mt-0.5" />
                                    <div>
                                        <span className="font-bold text-[#C8A96A] text-xs uppercase tracking-widest">Mobile:</span>
                                        <span className="text-[#F5E6C8]/80 ml-2 text-sm">+91 78803 70057</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-[#0D0D0D] border border-[#C8A96A]/10">
                                    <Mail className="w-5 h-5 text-[#C8A96A] mt-0.5" />
                                    <div>
                                        <span className="font-bold text-[#C8A96A] text-xs uppercase tracking-widest">Email:</span>
                                        <span className="text-[#F5E6C8]/80 ml-2 text-sm">support@sanyuktparivaar.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Grievance Form */}
                    <div className="lg:col-span-2">
                        <div className="luxury-box bg-[#1A1A1A] overflow-hidden animate-slide-left">
                            <div className="bg-[#252525] border-b border-[#C8A96A]/20 p-4">
                                <h2 className="text-base font-serif font-bold text-[#C8A96A] flex items-center gap-2 uppercase tracking-widest">
                                    <MessageSquare className="w-5 h-5" />
                                    Submit Grievance
                                </h2>
                            </div>

                            <div className="p-6 md:p-8">
                                {isSubmitted && (
                                    <div className="mb-6 bg-[#0D0D0D] border-l-4 border-l-[#C8A96A] p-4 animate-slide-up">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-[#C8A96A]" />
                                            <p className="text-[#F5E6C8]/80 text-sm">
                                                Your grievance has been submitted successfully! A unique track ID will be sent to your email and mobile.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-6 bg-[#3B2F2F] border-l-4 border-l-red-500 p-4 animate-slide-up">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                            <p className="text-red-400 text-sm">{error}</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Direct Seller ID */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-[#C8A96A] uppercase tracking-widest">
                                            Direct Seller ID
                                        </label>
                                        <input
                                            type="text"
                                            name="directSellerId"
                                            value={formData.directSellerId}
                                            onChange={handleChange}
                                            placeholder="Enter Direct Seller ID"
                                            className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] focus:outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]/30 transition-all placeholder:text-[#F5E6C8]/20"
                                        />
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-[#C8A96A] uppercase tracking-widest">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] focus:outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]/30 transition-all placeholder:text-[#F5E6C8]/20"
                                        />
                                    </div>

                                    {/* Mobile No. * */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-[#C8A96A] uppercase tracking-widest">
                                            Mobile No. <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobileNo"
                                            value={formData.mobileNo}
                                            onChange={handleChange}
                                            placeholder="Enter 10-digit mobile number"
                                            required
                                            className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] focus:outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]/30 transition-all placeholder:text-[#F5E6C8]/20"
                                        />
                                    </div>

                                    {/* Email Id * */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-[#C8A96A] uppercase tracking-widest">
                                            Email Id <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="emailId"
                                            value={formData.emailId}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                            required
                                            className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] focus:outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]/30 transition-all placeholder:text-[#F5E6C8]/20"
                                        />
                                    </div>

                                    {/* Category * */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-[#C8A96A] uppercase tracking-widest">
                                            Category <span className="text-red-400">*</span>
                                        </label>
                                        <CustomSelect
                                            name="category"
                                            value={formData.category}
                                            onChange={(val) => handleChange({ target: { name: 'category', value: val } })}
                                            placeholder="Select Category"
                                            required
                                            options={[
                                                { value: 'Billing', label: 'Billing' },
                                                { value: 'Product', label: 'Product' },
                                                { value: 'Delivery', label: 'Delivery' },
                                                { value: 'Payment', label: 'Payment' },
                                                { value: 'Technical', label: 'Technical' },
                                                { value: 'Other', label: 'Other' }
                                            ]}
                                        />
                                    </div>

                                    {/* Subject * */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-[#C8A96A] uppercase tracking-widest">
                                            Subject <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Enter subject"
                                            required
                                            className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] focus:outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]/30 transition-all placeholder:text-[#F5E6C8]/20"
                                        />
                                    </div>

                                    {/* Message * */}
                                    <div className="space-y-1">
                                        <label className="block text-xs font-bold text-[#C8A96A] uppercase tracking-widest">
                                            Message <span className="text-red-400">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Type your message here..."
                                            required
                                            rows="4"
                                            className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] focus:outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]/30 transition-all resize-none placeholder:text-[#F5E6C8]/20"
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="luxury-button w-full py-3 flex items-center justify-center gap-2 group"
                                    >
                                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        <span className="font-bold text-xs tracking-[0.2em] uppercase">Submit Grievance</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Check Grievance Status Section */}
                <div className="mt-8">
                    <div className="luxury-box bg-[#1A1A1A] overflow-hidden animate-slide-up">
                        <div className="bg-[#252525] border-b border-[#C8A96A]/20 p-4">
                            <h2 className="text-base font-serif font-bold text-[#C8A96A] flex items-center gap-2 uppercase tracking-widest">
                                <ExternalLink className="w-5 h-5" />
                                Check Grievance Status
                            </h2>
                        </div>
                        <div className="p-6 md:p-8">
                            <p className="text-[#F5E6C8]/70 mb-4 text-sm leading-relaxed">
                                Dear Customer / Distributor, You can check Grievance Status online at anytime. Please use following link to check current status.
                            </p>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="luxury-button inline-flex items-center gap-2 px-8 py-3 group"
                                >
                                    <span className="font-bold text-xs tracking-[0.2em] uppercase">Check Grievance Status</span>
                                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grievance Status Check Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
                    <div className="luxury-box bg-[#1A1A1A] max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                        {/* Modal Header */}
                        <div className="bg-[#252525] border-b border-[#C8A96A]/20 p-4 flex justify-between items-center sticky top-0">
                            <h3 className="text-base font-serif font-bold text-[#C8A96A] flex items-center gap-2 uppercase tracking-widest">
                                <Ticket className="w-5 h-5" />
                                Check Grievance Status
                            </h3>
                            <button
                                onClick={closeModal}
                                className="hover:bg-[#C8A96A]/10 p-1 border border-transparent hover:border-[#C8A96A]/20 transition-colors"
                            >
                                <X className="w-6 h-6 text-[#C8A96A]" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {statusResult ? (
                                // Status Result Display
                                <div className="space-y-4">
                                    <div className="bg-[#0D0D0D] border-l-4 border-l-[#C8A96A] p-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-[#C8A96A]" />
                                            <h4 className="font-bold text-[#C8A96A] text-xs uppercase tracking-widest">Grievance Status Found</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {[
                                            { label: 'Ticket Number', value: statusResult.ticketNumber },
                                            { label: 'Current Status', value: statusResult.status, highlight: true },
                                            { label: 'Submitted Date', value: statusResult.submittedDate },
                                            { label: 'Last Updated', value: statusResult.lastUpdated },
                                            { label: 'Department', value: statusResult.department },
                                        ].map((row) => (
                                            <div key={row.label} className="flex justify-between p-3 bg-[#0D0D0D] border border-[#C8A96A]/10">
                                                <span className="font-bold text-[#C8A96A] text-xs uppercase tracking-widest">{row.label}:</span>
                                                <span className={`text-sm font-bold ${row.highlight ? 'text-[#C8A96A]' : 'text-[#F5E6C8]/80'}`}>{row.value}</span>
                                            </div>
                                        ))}
                                        <div className="p-3 bg-[#0D0D0D] border border-[#C8A96A]/10">
                                            <span className="font-bold text-[#C8A96A] text-xs uppercase tracking-widest block mb-1">Description:</span>
                                            <p className="text-[#F5E6C8]/70 text-sm">{statusResult.description}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={closeModal}
                                        className="luxury-button w-full py-3 mt-4 font-bold text-xs tracking-[0.2em] uppercase"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                // Status Check Form
                                <form onSubmit={handleStatusCheck} className="space-y-4">
                                    {statusError && (
                                        <div className="bg-[#3B2F2F] border-l-4 border-l-red-500 p-3">
                                            <p className="text-red-400 text-sm flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                {statusError}
                                            </p>
                                        </div>
                                    )}

                                    {[
                                        { label: 'Direct Seller ID', name: 'directSellerId', type: 'text', placeholder: 'Enter Direct Seller ID', required: false },
                                        { label: 'Name', name: 'name', type: 'text', placeholder: 'Your Name', required: false },
                                        { label: 'Ticket Number *', name: 'ticketNumber', type: 'text', placeholder: 'Enter Your Ticket Number', required: true },
                                    ].map((field) => (
                                        <div key={field.name} className="space-y-1">
                                            <label className="block text-xs font-bold text-[#C8A96A] uppercase tracking-widest">
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={statusFormData[field.name]}
                                                onChange={handleStatusChange}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] focus:outline-none focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]/30 transition-all placeholder:text-[#F5E6C8]/20"
                                            />
                                        </div>
                                    ))}

                                    <button
                                        type="submit"
                                        className="luxury-button w-full py-3 mt-4 font-bold text-xs tracking-[0.2em] uppercase"
                                    >
                                        Check Status
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="w-full py-3 bg-[#252525] hover:bg-[#333] border border-[#C8A96A]/10 hover:border-[#C8A96A]/30 text-[#F5E6C8]/60 font-bold text-xs uppercase tracking-widest transition-all mt-2"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Global Notifications Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={8000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Fade}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '0px',
                        fontWeight: 800,
                        boxShadow: '0 8px 30px rgba(200,169,106,0.2)',
                        bgcolor: '#1A1A1A',
                        color: '#C8A96A',
                        border: '1px solid rgba(200,169,106,0.3)',
                        '& .MuiAlert-icon': { color: '#C8A96A' }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default GrievancePage;
