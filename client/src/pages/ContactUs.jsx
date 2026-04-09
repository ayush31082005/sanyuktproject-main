import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import api from '../api';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: '',
        email: ''  // Email field add kiya
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');

    // Fetch User Profile to pre-fill form
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                if (data?.user) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.user.name || '',
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Strict Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (formData.name.trim().length < 3) {
            setError('Legal name must be at least 3 characters');
            return;
        }
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            setError('Access number must be exactly 10 digits');
            return;
        }
        if (formData.message.trim().length < 10) {
            setError('Message details should be at least 10 characters');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            console.log('Submitting contact form:', formData);

            // Send data to backend
            const response = await api.post('/contact', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message
            });

            console.log('Contact form response:', response.data);

            // Show success message
            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',  // Email bhi clear karo
                phone: '',
                message: ''
            });

            // Hide success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);

        } catch (error) {
            console.error('Contact form error:', error);

            if (error.response) {
                setError(error.response.data.message || 'Failed to send message. Please try again.');
            } else if (error.request) {
                setError('No response from server. Please check your internet connection.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Embed Google Map URL for Chandrapur location
    const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.116773634476!2d79.296244!3d19.979614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd2d8f9b8b8b8b9%3A0x123456789abcdef!2sTukum%2C%20Chandrapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin";

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30">
            {/* Elegant Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#C8A96A]/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 px-4 py-6 md:py-10">
                {/* Main Heading */}
                <div className="text-center mb-6 animate-slide-down">
                    <div className="inline-block mb-2 px-6 py-1 rounded-full border border-[#C8A96A]/20 bg-[#C8A96A]/5">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#C8A96A]">Seamless Connection</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#F5E6C8] mb-3 tracking-tight drop-shadow-2xl uppercase">
                        Contact <span className="text-[#C8A96A]">US</span>
                    </h1>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent mx-auto"></div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    {/* Left Column - Contact Form */}
                    {/* Left Column - Contact Form */}
                    <div className="animate-slide-left">
                        <div className="luxury-box flex flex-col h-full group transition-all duration-700">
                            {/* Form Header */}
                            <div className="bg-[#121212] p-5 md:p-6 border-b border-[#C8A96A]/30">
                                <h2 className="text-2xl font-serif font-bold text-[#F5E6C8]">
                                    Get in Touch
                                </h2>
                                <p className="text-[#C8A96A] mt-1 text-[10px] font-black uppercase tracking-widest italic">
                                    Your message, our priority.
                                </p>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} className="p-10 flex-1 flex flex-col gap-8">
                                {submitSuccess && (
                                    <div className="p-5 bg-[#C8A96A]/10 border border-[#C8A96A]/30 text-[#C8A96A] rounded-2xl animate-slide-down flex items-center space-x-3 text-sm font-bold">
                                        <Send className="h-5 w-5" />
                                        <span>Message sent successfully! We'll get back to you soon.</span>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-5 bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl animate-slide-down text-sm font-bold">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4 flex-1">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Name */}
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#C8A96A]">Legal Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter Full Name"
                                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl p-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-black text-xs"
                                                required
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#C8A96A]">Access Number</label>
                                            <div className="relative group/input">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#C8A96A]/40 group-hover/input:text-[#C8A96A] transition-colors" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 10) {
                                                            setFormData({...formData, phone: val});
                                                            setError('');
                                                        }
                                                    }}
                                                    placeholder="Enter 10-digit number"
                                                    className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl pl-10 pr-3 py-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-black text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#C8A96A]">Email ID</label>
                                        <div className="relative group/input">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#C8A96A]/40 group-hover/input:text-[#C8A96A] transition-colors" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter Email Address"
                                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl pl-10 pr-3 py-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-black text-xs"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#C8A96A]">Inquiry Details</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Compose your message here..."
                                            rows="3"
                                            className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl p-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-black text-xs resize-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Send Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="luxury-button w-full relative z-10 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Transmitting...' : (
                                        <>
                                            Relay Message
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Contact Information */}
                    <div className="animate-slide-right">
                        <div className="luxury-box flex flex-col h-full group transition-all duration-700">
                            {/* Info Header */}
                            <div className="bg-[#121212] p-5 md:p-6 border-b border-[#C8A96A]/30">
                                <h2 className="text-2xl font-serif font-bold text-[#F5E6C8]">
                                    Contact Information
                                </h2>
                                <p className="text-[#C8A96A] mt-1 text-[10px] font-black uppercase tracking-widest italic">
                                    Our doors are open to your vision.
                                </p>
                            </div>

                            <div className="p-5 md:p-6 space-y-6">
                                {[
                                    { icon: MapPin, title: 'Head Office', content: 'Sanyukt Parivaar & Rich Life \nBhatiniya, Gopinathpur, Harraiya,\nBasti - 272130, UP', link: null },
                                    { icon: Phone, title: 'Phone', content: '+91 78803 70057', link: 'tel:+917880370057' },
                                    { icon: Mail, title: 'Email', content: 'info@sanyuktparivaar.com', link: 'mailto:info@sanyuktparivaar.com' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 group/item">
                                            <div className="w-10 h-10 bg-[#121212] border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] transition-all duration-500 rounded-sm">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                        <div>
                                            <h4 className="text-lg font-serif font-bold text-[#F5E6C8] mb-2 uppercase tracking-wide group-hover/item:text-[#C8A96A] transition-colors">{item.title}</h4>
                                            {item.link ? (
                                                <a href={item.link} className="text-[#F5E6C8]/60 text-sm font-medium hover:text-[#C8A96A] transition-colors whitespace-pre-line ring-0 outline-none">
                                                    {item.content}
                                                </a>
                                            ) : (
                                                <p className="text-[#F5E6C8]/60 text-sm font-medium whitespace-pre-line leading-relaxed">
                                                    {item.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Map Integration */}
                                <div className="pt-2">
                                    <div className="relative h-44 overflow-hidden luxury-box group/map">
                                        <iframe
                                            src={mapUrl}
                                            className="absolute inset-0 w-full h-full grayscale opacity-40 group-hover/map:grayscale-0 group-hover/map:opacity-80 transition-all duration-1000"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            title="Location"
                                        ></iframe>
                                        <a
                                            href="https://maps.google.com/?q=Tukum+Chandrapur+Maharashtra"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-[#121212] border border-[#C8A96A]/20 absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto hover:bg-[#C8A96A]/10 transition-all"
                                        >
                                            View Domain Map
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContactUs;