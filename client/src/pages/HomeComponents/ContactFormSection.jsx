import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter, Check } from 'lucide-react';

const ContactFormSection = ({
    contactForm,
    setContactForm,
    handleContactSubmit,
    contactSubmitting,
    contactSuccess
}) => {
    return (
        <section className="py-24 bg-[#0D0D0D] relative overflow-hidden" >
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-[#C8A96A] font-bold text-sm tracking-widest uppercase mb-3 block">Get In Touch</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#F5E6C8] mb-4">Contact <span className="text-[#C8A96A]">Us</span></h2>
                    <p className="text-[#F5E6C8]/60 max-w-xl mx-auto text-lg font-light">Have questions about joining our family or our products? We're here to help you every step of the way.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-start">
                    {/* LEFT - Contact info cards */}
                    <div className="space-y-5">
                        {/* Info cards */}
                        {[
                            {
                                icon: Phone,
                                title: 'Call Us',
                                lines: ['+91  7880370057'],
                                sub: 'Mon-Sat, 9 AM - 7 PM',
                                color: 'bg-[#C8A96A]/10 text-[#C8A96A]',
                            },
                            {
                                icon: Mail,
                                title: 'Email Us',
                                lines: ['info@sanyuktparivaar.com'],
                                sub: 'We reply within 24 hours',
                                color: 'bg-[#C8A96A]/10 text-[#C8A96A]',
                            },
                            {
                                icon: MapPin,
                                title: 'Visit Us',
                                lines: ['Sanyukt Parivaar & Rich Life Pvt.Ltd., Bhatiniya, Gopinathpur, Harraiya, Basti - 272130, Uttar Pradesh'],
                                sub: 'Head Office',
                                color: 'bg-[#C8A96A]/10 text-[#C8A96A]',
                            },
                            {
                                icon: Clock,
                                title: 'Business Hours',
                                lines: ['Monday - Saturday: 9:00 AM - 7:00 PM', 'Sunday: 10:00 AM - 4:00 PM'],
                                sub: 'IST (Indian Standard Time)',
                                color: 'bg-[#C8A96A]/10 text-[#C8A96A]',
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-6 bg-[#1A1A1A] rounded-2xl border border-[#C8A96A]/10 hover:border-[#C8A96A]/30 transition-all duration-300">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-[#F5E6C8] mb-1">{item.title}</div>
                                    {item.lines.map((line, j) => <div key={j} className="text-sm text-[#F5E6C8]/70">{line}</div>)}
                                    <div className="text-xs text-[#C8A96A]/50 mt-1">{item.sub}</div>
                                </div>
                            </div>
                        ))}

                        {/* Social links */}
                        <div className="p-6 bg-[#1A1A1A] rounded-2xl border border-[#C8A96A]/20">
                            <div className="text-[#C8A96A] font-bold mb-4 uppercase tracking-widest text-xs">Follow Us</div>
                            <div className="flex gap-3">
                                {[
                                    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/share/1CLin8tmY3/' },
                                    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/sanyukt_parivaar_rich_life_57?igsh=dDJlMDd0d241amRx' },
                                    { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@Sanyuktparivaarrichlife' },
                                    { icon: Twitter, label: 'X', href: 'https://x.com/sprichlife_57' },
                                ].map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-12 h-12 bg-[#0D0D0D] hover:bg-[#C8A96A] border border-[#C8A96A]/20 rounded-xl flex items-center justify-center text-[#C8A96A] hover:text-[#0D0D0D] transition-all duration-300"
                                        title={item.label}
                                    >
                                        <item.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - Quick Contact Form */}
                    <div className="bg-[#1A1A1A]/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-[#C8A96A]/20 shadow-2xl glass-morphism">
                        <h3 className="text-2xl font-bold text-[#F5E6C8] mb-2 font-serif">Send a Message</h3>
                        <p className="text-[#F5E6C8]/40 text-sm mb-8">Fill in your details and we'll get back to you.</p>

                        <form className="space-y-4" onSubmit={handleContactSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-[#C8A96A] mb-1.5 block uppercase tracking-wider">First Name</label>
                                    <input type="text" placeholder="Ravi" value={contactForm.firstName} onChange={e => setContactForm(p => ({ ...p, firstName: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-sm focus:border-[#C8A96A] outline-none transition" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#C8A96A] mb-1.5 block uppercase tracking-wider">Last Name</label>
                                    <input type="text" placeholder="Sharma" value={contactForm.lastName} onChange={e => setContactForm(p => ({ ...p, lastName: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-sm focus:border-[#C8A96A] outline-none transition" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#C8A96A] mb-1.5 block uppercase tracking-wider">Email Address</label>
                                <input type="email" placeholder="ravi@example.com" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-sm focus:border-[#C8A96A] outline-none transition" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#C8A96A] mb-1.5 block uppercase tracking-wider">Phone Number</label>
                                <input type="tel" placeholder="+91 78803 70057" value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-sm focus:border-[#C8A96A] outline-none transition" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#C8A96A] mb-1.5 block uppercase tracking-wider">Enquiry Type</label>
                                <select value={contactForm.enquiryType} onChange={e => setContactForm(p => ({ ...p, enquiryType: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-sm focus:border-[#C8A96A] outline-none transition">
                                    <option>Product Enquiry</option>
                                    <option>Business Opportunity</option>
                                    <option>Recharge Support</option>
                                    <option>Franchise / Distributor</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#C8A96A] mb-1.5 block uppercase tracking-wider">Message</label>
                                <textarea rows={4} placeholder="Write your message here..." value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-sm focus:border-[#C8A96A] outline-none transition resize-none" />
                            </div>
                            {contactSuccess && (
                                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span>Your message has been sent successfully! We will get back to you soon.</span>
                                </div>
                            )}
                            <Motion.button
                                type="submit"
                                disabled={contactSubmitting}
                                whileHover={{ scale: contactSubmitting ? 1 : 1.02 }}
                                whileTap={{ scale: contactSubmitting ? 1 : 0.98 }}
                                className="w-full bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-bold py-5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-gold-900/20"
                            >
                                <Mail className="w-4 h-4" />
                                {contactSubmitting ? 'Sending...' : 'Send Message'}
                            </Motion.button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactFormSection;
