import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, Calendar, Lock } from 'lucide-react';

const PaymentPolicy = () => {
    const lastUpdated = "March 15, 2024";

    return (
        <div className="bg-[#F8FAF5] font-sans min-h-screen">
            {/* Hero Banner */}
            <header className="relative h-[200px] bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
                <div className="absolute inset-0 bg-black/65"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in">
                        Payment Policy
                    </h1>
                    <div className="flex items-center text-white/90 text-sm md:text-base flex-wrap justify-center">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link to="/company/legal" className="hover:text-white transition-colors">Legal</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-white">Payment Policy</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <section className="py-12 px-4 max-w-4xl mx-auto">
                <article className="bg-white rounded-[14px] shadow-lg overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-[#0A7A2F] p-6 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold">Payment Policy</h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <p className="text-[#222222] mb-8 leading-relaxed text-lg border-l-4 border-[#0A7A2F] pl-4">
                            All payments on the Sanyukt Parivaar & Rich Life Pvt.Ltd. platform are processed securely
                            through authorized payment gateways.
                        </p>

                        {/* Payment Methods */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200">
                                Payment Methods
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Accepted Payment Modes</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Cards</h5>
                                            <p className="text-[#222222] text-sm">We accept all major debit and credit cards including Visa, MasterCard, RuPay, and American Express.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">UPI</h5>
                                            <p className="text-[#222222] text-sm">UPI payments are accepted through Google Pay, PhonePe, Paytm, and other UPI apps.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Net Banking</h5>
                                            <p className="text-[#222222] text-sm">Net banking is available for major Indian banks including SBI, HDFC, ICICI, Axis, and more.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Digital Wallets</h5>
                                            <p className="text-[#222222] text-sm">We accept payments through popular digital wallets including Paytm, Amazon Pay, and Mobikwik.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Payment Processing</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Real-time Processing</h5>
                                            <p className="text-[#222222] text-sm">Most payments are processed in real-time and order confirmation is sent immediately.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Authorization Hold</h5>
                                            <p className="text-[#222222] text-sm">Some payment methods may place an authorization hold on funds until order is processed.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Security */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200">
                                Payment Security
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Security Measures</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Encryption</h5>
                                            <p className="text-[#222222] text-sm">All transactions are encrypted using industry-standard SSL/TLS protocols.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Data Storage</h5>
                                            <p className="text-[#222222] text-sm">Company does not store card or banking details on our servers. All payment data is handled by our PCI-DSS compliant payment partners.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Authentication</h5>
                                            <p className="text-[#222222] text-sm">We support 3D Secure authentication for added security on card payments.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Fraud Prevention</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Monitoring</h5>
                                            <p className="text-[#222222] text-sm">We monitor all transactions for suspicious activity and may flag unusual orders for review.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Verification</h5>
                                            <p className="text-[#222222] text-sm">We may request additional verification for high-value transactions to prevent fraud.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Failed Transactions */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200">
                                Failed Transactions
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Handling Failed Payments</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Auto-Reversal</h5>
                                            <p className="text-[#222222] text-sm">In case of payment failure, the amount will be auto-reversed as per bank or gateway timelines, typically 3-7 business days.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Notification</h5>
                                            <p className="text-[#222222] text-sm">You will receive immediate notification of payment failure via email and SMS.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Retry</h5>
                                            <p className="text-[#222222] text-sm">You can retry the payment immediately or choose an alternative payment method.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Double Charges</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Duplicate Transactions</h5>
                                            <p className="text-[#222222] text-sm">If you are charged twice for the same order, please contact support with transaction details for immediate resolution.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Resolution Time</h5>
                                            <p className="text-[#222222] text-sm">Duplicate charges are typically resolved within 5-7 business days through our payment partners.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Legal Disclaimer */}
                        <div className="mt-8 bg-[#0A7A2F]/10 border-l-4 border-[#0A7A2F] p-6 rounded-r-lg">
                            <div className="flex items-start gap-4">
                                <Lock className="w-6 h-6 text-[#0A7A2F] flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-[#0A7A2F] mb-2">Legal Disclaimer</h3>
                                    <p className="text-[#222222] text-sm">
                                        Sanyukt Parivaar & Rich Life Pvt.Ltd. follows applicable Direct Selling Guidelines.
                                        Income depends on individual effort and performance. No guaranteed earnings.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Last Updated */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Last Updated: {lastUpdated}</span>
                        </div>
                    </div>
                </article>
            </section>


        </div>
    );
};

export default PaymentPolicy;