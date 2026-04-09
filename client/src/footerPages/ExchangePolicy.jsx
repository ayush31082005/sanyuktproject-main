import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Repeat, Calendar, Lock } from 'lucide-react';

const ExchangePolicy = () => {
    const lastUpdated = "March 15, 2024";

    return (
        <div className="bg-[#F8FAF5] font-sans min-h-screen">
            {/* Hero Banner */}
            <header className="relative h-[200px] bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
                <div className="absolute inset-0 bg-black/65"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in">
                        Exchange Policy
                    </h1>
                    <div className="flex items-center text-white/90 text-sm md:text-base flex-wrap justify-center">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link to="/company/legal" className="hover:text-white transition-colors">Legal</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-white">Exchange Policy</span>
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
                                <Repeat className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold">Exchange Policy</h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <p className="text-[#222222] mb-8 leading-relaxed text-lg border-l-4 border-[#0A7A2F] pl-4">
                            We allow product exchanges under specific conditions to ensure customer satisfaction.
                        </p>

                        {/* Exchange Conditions */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200">
                                Exchange Conditions
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Eligibility Requirements</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Product Condition</h5>
                                            <p className="text-[#222222] text-sm">Product must be unused, unwashed, and in original packaging with all tags and accessories intact.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Time Limit</h5>
                                            <p className="text-[#222222] text-sm">Exchange requests must be raised within 7 days of delivery.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Valid Reasons</h5>
                                            <p className="text-[#222222] text-sm">Exchange allowed only for manufacturing defects, wrong item delivered, or size issues (where applicable).</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Non-Eligible Items</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Final Sale Items</h5>
                                            <p className="text-[#222222] text-sm">Items marked as 'Final Sale' or 'Non-Exchangeable' cannot be exchanged.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Personal Care Products</h5>
                                            <p className="text-[#222222] text-sm">For hygiene reasons, certain personal care products cannot be exchanged once opened.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Exchange Process */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200">
                                Exchange Process
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Request Process</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Submit Request</h5>
                                            <p className="text-[#222222] text-sm">Customer must submit an exchange request through our portal with order details and photos of the product.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Review Process</h5>
                                            <p className="text-[#222222] text-sm">Our team reviews the request within 2-3 business days and communicates approval status.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Quality Check</h5>
                                            <p className="text-[#222222] text-sm">Approval is subject to quality check of returned product before exchange is processed.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Shipping for Exchange</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Return Shipping</h5>
                                            <p className="text-[#222222] text-sm">Customer is responsible for return shipping costs unless the exchange is due to our error.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">New Product Shipping</h5>
                                            <p className="text-[#222222] text-sm">Exchange product is shipped free of cost after we receive and approve the returned item.</p>
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

            {/* Activate Windows Message */}

        </div>
    );
};

export default ExchangePolicy;