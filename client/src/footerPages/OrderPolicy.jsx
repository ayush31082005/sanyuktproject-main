import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag, Calendar, Lock, Package, Clock, Truck, Shield, AlertCircle } from 'lucide-react';

const OrderPolicy = () => {
    const lastUpdated = "March 15, 2024";

    return (
        <div className="bg-[#F8FAF5] font-sans min-h-screen">
            {/* Hero Banner */}
            <header className="relative h-[200px] bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
                <div className="absolute inset-0 bg-black/65"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in">
                        Order Policy
                    </h1>
                    <div className="flex items-center text-white/90 text-sm md:text-base flex-wrap justify-center">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link to="/company/legal" className="hover:text-white transition-colors">Legal</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-white">Order Policy</span>
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
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold">Order Policy</h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <p className="text-[#222222] mb-8 leading-relaxed text-lg border-l-4 border-[#0A7A2F] pl-4">
                            Sanyukt Parivaar & Rich Life Pvt.Ltd. ensures a smooth and transparent ordering process for all our customers and distributors. This policy outlines how orders are placed, processed, and managed.
                        </p>

                        {/* Order Placement */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order Placement
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. How to Place an Order</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Online Ordering</h5>
                                            <p className="text-[#222222] text-sm">Orders can be placed through our official website by adding products to cart and completing the checkout process. You must be logged into your account to place an order.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Distributor Orders</h5>
                                            <p className="text-[#222222] text-sm">Registered distributors can place orders through their distributor dashboard, mobile app, or by contacting their upline support.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Customer Support Orders</h5>
                                            <p className="text-[#222222] text-sm">For assistance with ordering, customers can contact our support team via phone, email, or live chat during business hours.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Order Requirements</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Minimum Order Value</h5>
                                            <p className="text-[#222222] text-sm">A minimum order value may apply for certain products or membership levels. This will be clearly displayed at checkout.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Product Availability</h5>
                                            <p className="text-[#222222] text-sm">All orders are subject to product availability. In case of unavailability, we will notify you and provide alternatives or process a refund.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Accurate Information</h5>
                                            <p className="text-[#222222] text-sm">Customers must provide accurate shipping and contact information. We are not responsible for failed delivery due to incorrect information.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Processing */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Order Processing
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Processing Timeline</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Order Confirmation</h5>
                                            <p className="text-[#222222] text-sm">Once an order is placed, you will receive an order confirmation email with order details and order number within 30 minutes.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Processing Time</h5>
                                            <p className="text-[#222222] text-sm">Orders are typically processed within 24-48 hours after payment confirmation. Processing includes order verification, picking, and packing.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Weekend & Holiday Processing</h5>
                                            <p className="text-[#222222] text-sm">Orders placed on weekends or public holidays will be processed on the next business day.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Order Verification</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Payment Verification</h5>
                                            <p className="text-[#222222] text-sm">Orders are processed only after successful payment verification. For high-value orders, additional verification may be required.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Fraud Checks</h5>
                                            <p className="text-[#222222] text-sm">We may perform standard fraud checks on orders. If suspicious activity is detected, we may contact you for verification before processing.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Status & Tracking */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Order Status & Tracking
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Order Status Updates</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Status Notifications</h5>
                                            <p className="text-[#222222] text-sm">You will receive email and SMS notifications at each stage: order confirmed, order processed, order shipped, and out for delivery.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Check Order Status</h5>
                                            <p className="text-[#222222] text-sm">You can check your order status anytime by logging into your account and visiting the Order History section.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Order Timeline</h5>
                                            <p className="text-[#222222] text-sm">A complete timeline of your order from placement to delivery is available in your account dashboard.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Order Tracking</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Tracking Number</h5>
                                            <p className="text-[#222222] text-sm">Once your order is shipped, a tracking number will be provided via email and SMS. You can use this to track your package.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Courier Partner Portal</h5>
                                            <p className="text-[#222222] text-sm">Track your order directly on our courier partner's website using the provided tracking number and PIN code.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Delivery Attempts</h5>
                                            <p className="text-[#222222] text-sm">The courier partner will make up to 3 delivery attempts. After that, the order may be returned to sender.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Modifications */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200">
                                Order Modifications
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Changing Order Details</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Address Changes</h5>
                                            <p className="text-[#222222] text-sm">Shipping address can be changed within 2 hours of placing the order by contacting customer support. After that, the order may already be processed.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Product Modifications</h5>
                                            <p className="text-[#222222] text-sm">To add or remove items from an order, please contact support immediately. Changes are possible only before order processing begins.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Order Cancellation</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Cancellation Window</h5>
                                            <p className="text-[#222222] text-sm">Orders can be canceled within 2 hours of placement or before processing begins, whichever is earlier.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">How to Cancel</h5>
                                            <p className="text-[#222222] text-sm">Submit cancellation requests through your account dashboard or contact customer support with your order number.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Issues */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Order Issues
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Common Issues</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Missing Items</h5>
                                            <p className="text-[#222222] text-sm">If items are missing from your order, report within 48 hours of delivery with photos of the package and invoice.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Wrong Items Delivered</h5>
                                            <p className="text-[#222222] text-sm">If you receive incorrect products, contact us within 48 hours with order details and photos for replacement or refund.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Damaged Products</h5>
                                            <p className="text-[#222222] text-sm">Report damaged items within 48 hours of delivery with clear photos showing the damage and packaging.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Resolution Process</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Investigation</h5>
                                            <p className="text-[#222222] text-sm">Our team investigates reported issues within 2-3 business days and communicates findings via email.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Resolution Options</h5>
                                            <p className="text-[#222222] text-sm">Based on the issue, we may offer replacement, refund, store credit, or send missing items at no additional cost.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Timeline</h5>
                                            <p className="text-[#222222] text-sm">Most issues are resolved within 5-7 business days of reporting. Complex cases may take longer.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Order Types */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200">
                                Special Order Types
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. Bulk Orders</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Bulk Order Process</h5>
                                            <p className="text-[#222222] text-sm">For orders above certain quantities, special bulk order processing applies. Contact our B2B team for assistance.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Bulk Discounts</h5>
                                            <p className="text-[#222222] text-sm">Volume-based discounts may apply to bulk orders. Contact our sales team for a customized quote.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. Pre-Orders</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Pre-Order Policy</h5>
                                            <p className="text-[#222222] text-sm">For upcoming products, pre-orders may be accepted. Estimated delivery dates will be provided at checkout.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Pre-Order Payment</h5>
                                            <p className="text-[#222222] text-sm">Full or partial payment may be required for pre-orders. Cancellation terms for pre-orders may differ from regular orders.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Policy Summary */}
                        <div className="mb-8 bg-[#F8FAF5] p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-[#0A7A2F] mb-3 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Order Policy Summary
                            </h3>
                            <ul className="space-y-2 text-sm text-[#222222]">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#F7931E] rounded-full mt-1.5"></span>
                                    <span>Orders are processed within 24-48 hours of confirmation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#F7931E] rounded-full mt-1.5"></span>
                                    <span>Order modifications accepted within 2 hours of placement</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#F7931E] rounded-full mt-1.5"></span>
                                    <span>Track orders through your account dashboard</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#F7931E] rounded-full mt-1.5"></span>
                                    <span>Report issues within 48 hours of delivery</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#F7931E] rounded-full mt-1.5"></span>
                                    <span>Bulk and pre-orders have special terms</span>
                                </li>
                            </ul>
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
                                        Order policies are subject to change without prior notice.
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

export default OrderPolicy;