import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, FileText, RefreshCw, Repeat, CreditCard, Truck, Megaphone, Calendar, Lock, ChevronDown, ChevronUp, Globe, MapPin, Mail, Phone, Award, Users, Target, Eye } from 'lucide-react';

const LegalPage = () => {
    const [expandedSections, setExpandedSections] = useState({});
    const [expandedPolicy, setExpandedPolicy] = useState('privacy');
    const [showAllPolicies, setShowAllPolicies] = useState(false);
    const lastUpdated = "March 15, 2024";

    const togglePolicy = (policyId) => {
        setExpandedPolicy(expandedPolicy === policyId ? null : policyId);
    };

    const toggleSection = (policyId, sectionIndex) => {
        setExpandedSections(prev => ({
            ...prev,
            [`${policyId}-${sectionIndex}`]: !prev[`${policyId}-${sectionIndex}`]
        }));
    };

    const policies = [
        {
            id: 'privacy',
            title: 'Privacy Policy',
            icon: <Shield className="w-6 h-6 text-current" />,
            path: '/privacy-policy',
            content: {
                intro: "Sanyukt Parivaar & Rich Life Pvt.Ltd. respects the privacy of its users, members, and customers. This Privacy Policy explains how we collect, use, protect, and disclose personal information provided on our website and digital platforms.",
                scope: {
                    title: "Scope of the Privacy Policy",
                    content: "This is Sanyukt Parivaar & Rich Life Pvt.Ltd.'s global Privacy Policy. We have highlighted below where a particular section applies to you based on where you live. For the purposes of the General Data Protection Regulation ('GDPR'), if you are a resident in the EEA, Switzerland, and the UK, Sanyukt Parivaar Europe Ltd. and Sanyukt Parivaar, Inc. are joint data controllers of your personal data. Sanyukt Parivaar Europe Ltd. is an Irish company with its registered office at Waterloo Exchange, 3rd Floor, Waterloo Road, Dublin 4, Ireland. Sanyukt Parivaar, Inc. is a US company with its registered office at 651 Brannan St., San Francisco, CA 94107, USA. Sanyukt Parivaar Europe Ltd is the responsible controller for fulfilling key obligations under the GDPR. If you have any questions about our data processing activities, please contact our Data Protection Officer."
                },
                sections: [
                    {
                        heading: "We collect information in a few different ways",
                        subSections: [
                            {
                                title: "1. When you give it to us or give us permission to obtain it",
                                content: "When you use Sanyukt Parivaar websites, apps, services, technologies, APIs, widgets, or any other products, or features we offer (\"Sanyukt Parivaar\" or the \"Services\"), you voluntarily share certain information.",
                                items: [
                                    {
                                        subheading: "Account Information",
                                        text: "When you join our Services, we collect information like your name, email address, birthday, gender, country of residence, your interests, and preferred language. If you have a business account, depending on where you live, you may also have the option to add race and ethnicity information to your profile."
                                    },
                                    {
                                        subheading: "Content",
                                        text: "We collect information when you save or upload content, photos, or other content, interact with content or other content (for example, commenting or adding a post), or where you send messages and interact with other users."
                                    },
                                    {
                                        subheading: "Precise location information",
                                        text: "Depending on where you live, you can choose to share your precise location using your device settings."
                                    },
                                    {
                                        subheading: "Your communications with us",
                                        text: "If you contact us for customer support or otherwise communicate with us, we collect the content of these communications."
                                    },
                                    {
                                        subheading: "Your contacts",
                                        text: "If you previously chose to sync your contacts with your account, we will continue to process certain information about your contacts who are Sanyukt Parivaar users to help you find one another on our Services."
                                    }
                                ]
                            },
                            {
                                title: "2. We also get technical information when you use our Services",
                                content: "These days, whenever you use a website, app, or other internet service, there's certain information that's almost always created and recorded automatically. The same is true when you use our Services. Here are some of the types of information we collect when you use our Services:",
                                items: [
                                    {
                                        subheading: "Log data",
                                        text: "When you use our Services, our servers record information, including information that your browser automatically sends whenever you visit a website or app, and information about how you use our Services. Log data includes your Internet Protocol address, the address of and activity on websites or apps you visit that incorporate our technology, the dates and times of your use, browser type and settings, device information and settings, operating system, and app version."
                                    },
                                    {
                                        subheading: "Usage information",
                                        text: "We collect information about your activity through our Services, including: your interactions with content, the content you save, search queries, the availability of content, and the accounts you interact with."
                                    },
                                    {
                                        subheading: "Device information",
                                        text: "We collect information from and about the devices you use to access our Services. This includes things like IP addresses, crash logs, and the system you use to access our Services."
                                    },
                                    {
                                        subheading: "Information from cookies and other technologies",
                                        text: "We use cookies and similar technologies to recognize you and/or your device(s) on, off, and across different Services and devices. We also allow others to use cookies as described in our Cookie Policy. You can manage cookies through your browser settings."
                                    }
                                ]
                            },
                            {
                                title: "3. Information we receive from other sources",
                                content: "We receive information about you from other users, from business partners, from our affiliated companies, and from the websites and apps that integrate our technology.",
                                items: [
                                    {
                                        subheading: "Other users",
                                        text: "Other users may provide information about you when they submit content through the Services. For example, they may mention or tag you in content, or upload information about you."
                                    },
                                    {
                                        subheading: "Business partners",
                                        text: "We receive information from business partners, including advertisers, app developers, and publishers. This information helps us to deliver more relevant content and advertising."
                                    },
                                    {
                                        subheading: "Affiliated companies",
                                        text: "We receive information from companies that are affiliated with Sanyukt Parivaar (such as our parent company, subsidiaries, and other companies that share common ownership)."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "How we use your information",
                        subSections: [
                            {
                                title: "1. To provide, improve, and personalize our Services",
                                items: [
                                    {
                                        subheading: "Provide our Services",
                                        text: "We use your information to deliver our Services, including to create and maintain your account, process orders, and provide customer support."
                                    },
                                    {
                                        subheading: "Personalize your experience",
                                        text: "We use your information to personalize the content you see, including recommendations, search results, and ads."
                                    },
                                    {
                                        subheading: "Improve our Services",
                                        text: "We use your information to analyze how our Services are used, to develop new features, and to improve performance and reliability."
                                    }
                                ]
                            },
                            {
                                title: "2. To communicate with you",
                                items: [
                                    {
                                        subheading: "Service communications",
                                        text: "We use your information to send you administrative messages, such as updates to our terms and policies, security alerts, and account notifications."
                                    },
                                    {
                                        subheading: "Marketing communications",
                                        text: "With your consent where required, we use your information to send you marketing messages about products, services, and promotions that may interest you."
                                    }
                                ]
                            },
                            {
                                title: "3. To ensure the security of our Services",
                                items: [
                                    {
                                        subheading: "Security and integrity",
                                        text: "We use your information to detect, investigate, and prevent fraudulent transactions and other illegal activities, and to protect the rights and property of Sanyukt Parivaar and others."
                                    },
                                    {
                                        subheading: "Compliance with law",
                                        text: "We use your information to comply with applicable laws, regulations, and legal processes, and to respond to lawful requests from government authorities."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'terms',
            title: 'Terms & Conditions',
            icon: <FileText className="w-6 h-6 text-current" />,
            path: '/terms-conditions',
            content: {
                intro: "By accessing or using the services of Sanyukt Parivaar & Rich Life Pvt.Ltd., you agree to comply with the following terms and conditions.",
                sections: [
                    {
                        heading: "User Eligibility and Account Terms",
                        subSections: [
                            {
                                title: "1. Eligibility Requirements",
                                items: [
                                    {
                                        subheading: "Age Requirement",
                                        text: "Users must be 18 years or older to register for an account. By registering, you represent and warrant that you are at least 18 years of age."
                                    },
                                    {
                                        subheading: "Accurate Information",
                                        text: "You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete."
                                    },
                                    {
                                        subheading: "Legal Capacity",
                                        text: "You represent that you have the full power and authority to enter into and perform these terms and conditions."
                                    }
                                ]
                            },
                            {
                                title: "2. Account Responsibilities",
                                items: [
                                    {
                                        subheading: "Account Security",
                                        text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
                                    },
                                    {
                                        subheading: "Unauthorized Access",
                                        text: "You agree to notify us immediately of any unauthorized use of your account or any other breach of security."
                                    },
                                    {
                                        subheading: "Account Misuse",
                                        text: "You are solely responsible for any misuse of your account, whether by you or by any third party."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Business Terms and Disclaimers",
                        subSections: [
                            {
                                title: "1. Income and Earnings Disclaimer",
                                items: [
                                    {
                                        subheading: "No Guaranteed Income",
                                        text: "Income is based on individual effort and performance. There is no guaranteed income or fixed returns associated with participation in our programs."
                                    },
                                    {
                                        subheading: "Performance-Based",
                                        text: "Your success depends on your skills, effort, and dedication. Results may vary significantly from person to person."
                                    },
                                    {
                                        subheading: "Not Employment",
                                        text: "Participation in our programs does not constitute employment. You are an independent distributor, not an employee of the company."
                                    }
                                ]
                            },
                            {
                                title: "2. Product and Service Terms",
                                items: [
                                    {
                                        subheading: "Product Claims",
                                        text: "We strive to provide accurate product information, but we do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free."
                                    },
                                    {
                                        subheading: "Availability",
                                        text: "Products and services are subject to availability and may be discontinued or modified at any time without notice."
                                    },
                                    {
                                        subheading: "Pricing",
                                        text: "Prices are subject to change without notice. In the event a product is listed at an incorrect price, we reserve the right to refuse or cancel any orders placed for that product."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Modification and Termination",
                        subSections: [
                            {
                                title: "1. Right to Modify",
                                items: [
                                    {
                                        subheading: "Policy Changes",
                                        text: "The company reserves the right to modify policies, plans, or terms at any time without prior notice. Continued use of our services constitutes acceptance of modified terms."
                                    },
                                    {
                                        subheading: "Service Changes",
                                        text: "We may modify, suspend, or discontinue any aspect of our services at any time without notice or liability."
                                    }
                                ]
                            },
                            {
                                title: "2. Termination",
                                items: [
                                    {
                                        subheading: "By Company",
                                        text: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these terms."
                                    },
                                    {
                                        subheading: "By User",
                                        text: "You may terminate your account at any time by contacting customer support. Termination will not relieve you of any obligations incurred prior to termination."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'refund',
            title: 'Refund & Cancellation Policy',
            icon: <RefreshCw className="w-6 h-6 text-current" />,
            path: '/cancellation-policy',
            content: {
                intro: "Sanyukt Parivaar & Rich Life Pvt.Ltd. follows a transparent refund and cancellation policy in accordance with applicable laws.",
                sections: [
                    {
                        heading: "Cancellation Policy",
                        subSections: [
                            {
                                title: "1. Order Cancellation",
                                items: [
                                    {
                                        subheading: "Cancellation Window",
                                        text: "Orders can be canceled within 24 hours of placement or before dispatch, whichever is earlier."
                                    },
                                    {
                                        subheading: "Cancellation Process",
                                        text: "Cancellation requests must be submitted through our official support channels, including email, customer portal, or phone support."
                                    },
                                    {
                                        subheading: "Confirmation",
                                        text: "Cancellation is confirmed only after you receive a confirmation email from our support team."
                                    }
                                ]
                            },
                            {
                                title: "2. Cancellation Fees",
                                items: [
                                    {
                                        subheading: "No Fee Period",
                                        text: "No cancellation fees apply if canceled within the specified cancellation window."
                                    },
                                    {
                                        subheading: "Late Cancellation",
                                        text: "Cancellations after dispatch may be subject to restocking fees and return shipping costs."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Refund Policy",
                        subSections: [
                            {
                                title: "1. Refund Eligibility",
                                items: [
                                    {
                                        subheading: "Inspection Required",
                                        text: "Refunds are processed after product inspection and approval by our quality assurance team."
                                    },
                                    {
                                        subheading: "Time Frame",
                                        text: "Refund requests must be submitted within 7 days of delivery for eligible products."
                                    },
                                    {
                                        subheading: "Condition Requirements",
                                        text: "Products must be unused, unopened, and in original packaging with all tags attached."
                                    }
                                ]
                            },
                            {
                                title: "2. Refund Processing",
                                items: [
                                    {
                                        subheading: "Payment Method",
                                        text: "Refund amount will be credited to the original payment method used at the time of purchase."
                                    },
                                    {
                                        subheading: "Processing Time",
                                        text: "Processing time may vary based on banks/payment gateways, typically 5-10 business days."
                                    },
                                    {
                                        subheading: "Partial Refunds",
                                        text: "Partial refunds may be issued for products that show signs of use or damage not reported at delivery."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Non-Refundable Items",
                        subSections: [
                            {
                                title: "1. Non-Refundable Categories",
                                items: [
                                    {
                                        subheading: "Used Products",
                                        text: "Products that have been used, damaged, or altered are non-refundable."
                                    },
                                    {
                                        subheading: "Promotional Items",
                                        text: "Promotional or discounted items are non-refundable unless defective."
                                    },
                                    {
                                        subheading: "Digital Products",
                                        text: "Digital downloads, e-books, and online courses are non-refundable once accessed."
                                    }
                                ]
                            },
                            {
                                title: "2. Exceptions",
                                items: [
                                    {
                                        subheading: "Defective Products",
                                        text: "Defective products may be eligible for refund or replacement regardless of the above conditions."
                                    },
                                    {
                                        subheading: "Wrong Delivery",
                                        text: "Products delivered incorrectly due to our error are eligible for full refund including shipping."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'exchange',
            title: 'Exchange Policy',
            icon: <Repeat className="w-6 h-6 text-current" />,
            path: '/exchange-policy',
            content: {
                intro: "We allow product exchanges under specific conditions to ensure customer satisfaction.",
                sections: [
                    {
                        heading: "Exchange Conditions",
                        subSections: [
                            {
                                title: "1. Eligibility Requirements",
                                items: [
                                    {
                                        subheading: "Product Condition",
                                        text: "Product must be unused, unwashed, and in original packaging with all tags and accessories intact."
                                    },
                                    {
                                        subheading: "Time Limit",
                                        text: "Exchange requests must be raised within 7 days of delivery."
                                    },
                                    {
                                        subheading: "Valid Reasons",
                                        text: "Exchange allowed only for manufacturing defects, wrong item delivered, or size issues (where applicable)."
                                    }
                                ]
                            },
                            {
                                title: "2. Non-Eligible Items",
                                items: [
                                    {
                                        subheading: "Final Sale Items",
                                        text: "Items marked as 'Final Sale' or 'Non-Exchangeable' cannot be exchanged."
                                    },
                                    {
                                        subheading: "Personal Care Products",
                                        text: "For hygiene reasons, certain personal care products cannot be exchanged once opened."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Exchange Process",
                        subSections: [
                            {
                                title: "1. Request Process",
                                items: [
                                    {
                                        subheading: "Submit Request",
                                        text: "Customer must submit an exchange request through our portal with order details and photos of the product."
                                    },
                                    {
                                        subheading: "Review Process",
                                        text: "Our team reviews the request within 2-3 business days and communicates approval status."
                                    },
                                    {
                                        subheading: "Quality Check",
                                        text: "Approval is subject to quality check of returned product before exchange is processed."
                                    }
                                ]
                            },
                            {
                                title: "2. Shipping for Exchange",
                                items: [
                                    {
                                        subheading: "Return Shipping",
                                        text: "Customer is responsible for return shipping costs unless the exchange is due to our error."
                                    },
                                    {
                                        subheading: "New Product Shipping",
                                        text: "Exchange product is shipped free of cost after we receive and approve the returned item."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'payment',
            title: 'Payment Policy',
            icon: <CreditCard className="w-6 h-6 text-current" />,
            path: '/payment-policy',
            content: {
                intro: "All payments on the Sanyukt Parivaar & Rich Life Pvt.Ltd. platform are processed securely through authorized payment gateways.",
                sections: [
                    {
                        heading: "Payment Methods",
                        subSections: [
                            {
                                title: "1. Accepted Payment Modes",
                                items: [
                                    {
                                        subheading: "Cards",
                                        text: "We accept all major debit and credit cards including Visa, MasterCard, RuPay, and American Express."
                                    },
                                    {
                                        subheading: "UPI",
                                        text: "UPI payments are accepted through Google Pay, PhonePe, Paytm, and other UPI apps."
                                    },
                                    {
                                        subheading: "Net Banking",
                                        text: "Net banking is available for major Indian banks including SBI, HDFC, ICICI, Axis, and more."
                                    },
                                    {
                                        subheading: "Digital Wallets",
                                        text: "We accept payments through popular digital wallets including Paytm, Amazon Pay, and Mobikwik."
                                    }
                                ]
                            },
                            {
                                title: "2. Payment Processing",
                                items: [
                                    {
                                        subheading: "Real-time Processing",
                                        text: "Most payments are processed in real-time and order confirmation is sent immediately."
                                    },
                                    {
                                        subheading: "Authorization Hold",
                                        text: "Some payment methods may place an authorization hold on funds until order is processed."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Payment Security",
                        subSections: [
                            {
                                title: "1. Security Measures",
                                items: [
                                    {
                                        subheading: "Encryption",
                                        text: "All transactions are encrypted using industry-standard SSL/TLS protocols."
                                    },
                                    {
                                        subheading: "Data Storage",
                                        text: "Company does not store card or banking details on our servers. All payment data is handled by our PCI-DSS compliant payment partners."
                                    },
                                    {
                                        subheading: "Authentication",
                                        text: "We support 3D Secure authentication for added security on card payments."
                                    }
                                ]
                            },
                            {
                                title: "2. Fraud Prevention",
                                items: [
                                    {
                                        subheading: "Monitoring",
                                        text: "We monitor all transactions for suspicious activity and may flag unusual orders for review."
                                    },
                                    {
                                        subheading: "Verification",
                                        text: "We may request additional verification for high-value transactions to prevent fraud."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Failed Transactions",
                        subSections: [
                            {
                                title: "1. Handling Failed Payments",
                                items: [
                                    {
                                        subheading: "Auto-Reversal",
                                        text: "In case of payment failure, the amount will be auto-reversed as per bank or gateway timelines, typically 3-7 business days."
                                    },
                                    {
                                        subheading: "Notification",
                                        text: "You will receive immediate notification of payment failure via email and SMS."
                                    },
                                    {
                                        subheading: "Retry",
                                        text: "You can retry the payment immediately or choose an alternative payment method."
                                    }
                                ]
                            },
                            {
                                title: "2. Double Charges",
                                items: [
                                    {
                                        subheading: "Duplicate Transactions",
                                        text: "If you are charged twice for the same order, please contact support with transaction details for immediate resolution."
                                    },
                                    {
                                        subheading: "Resolution Time",
                                        text: "Duplicate charges are typically resolved within 5-7 business days through our payment partners."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'shipping',
            title: 'Shipping & Delivery Policy',
            icon: <Truck className="w-6 h-6 text-current" />,
            path: '/shipping-delivery',
            content: {
                intro: "We aim to deliver products in a timely and safe manner across serviceable locations.",
                sections: [
                    {
                        heading: "Delivery Timeline",
                        subSections: [
                            {
                                title: "1. Processing Time",
                                items: [
                                    {
                                        subheading: "Order Processing",
                                        text: "Orders are usually processed within 2-5 working days after order confirmation and payment verification."
                                    },
                                    {
                                        subheading: "Peak Periods",
                                        text: "During peak seasons or sales events, processing may take 5-7 working days."
                                    }
                                ]
                            },
                            {
                                title: "2. Shipping Time",
                                items: [
                                    {
                                        subheading: "Metro Cities",
                                        text: "Delivery to metro cities typically takes 3-5 business days after processing."
                                    },
                                    {
                                        subheading: "Tier 2 & 3 Cities",
                                        text: "Delivery to smaller cities and towns may take 5-8 business days."
                                    },
                                    {
                                        subheading: "Remote Areas",
                                        text: "Remote locations may require additional 2-3 days for delivery."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Shipping Charges",
                        subSections: [
                            {
                                title: "1. Fee Structure",
                                items: [
                                    {
                                        subheading: "Standard Shipping",
                                        text: "Shipping charges (if any) are mentioned at checkout based on order value and delivery location."
                                    },
                                    {
                                        subheading: "Free Shipping",
                                        text: "Free shipping is available on orders above a certain value, as specified in ongoing promotions."
                                    },
                                    {
                                        subheading: "Express Shipping",
                                        text: "Express shipping options may be available at additional cost for select locations."
                                    }
                                ]
                            },
                            {
                                title: "2. International Shipping",
                                items: [
                                    {
                                        subheading: "Currently Unavailable",
                                        text: "International shipping is currently not available. We only ship within India at this time."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Delivery Issues",
                        subSections: [
                            {
                                title: "1. Delays and Exceptions",
                                items: [
                                    {
                                        subheading: "Force Majeure",
                                        text: "The company is not responsible for delays caused by natural calamities, strikes, pandemics, or courier partner issues."
                                    },
                                    {
                                        subheading: "Address Issues",
                                        text: "Incorrect or incomplete addresses may cause delivery delays. Please verify your shipping address."
                                    },
                                    {
                                        subheading: "Failed Delivery Attempts",
                                        text: "After 3 failed delivery attempts, the order may be returned to sender and restocking fees may apply."
                                    }
                                ]
                            },
                            {
                                title: "2. Lost or Damaged Shipments",
                                items: [
                                    {
                                        subheading: "Lost Packages",
                                        text: "If your package is lost in transit, please contact us within 7 days of expected delivery for investigation."
                                    },
                                    {
                                        subheading: "Damaged Items",
                                        text: "Report damaged items within 48 hours of delivery with photos for replacement or refund."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            id: 'marketing',
            title: 'Marketing & Sales Policy',
            icon: <Megaphone className="w-6 h-6 text-current" />,
            path: '/marketing-sales-policy',
            content: {
                intro: "Sanyukt Parivaar & Rich Life Pvt.Ltd. follows ethical and legal direct selling practices.",
                sections: [
                    {
                        heading: "Code of Conduct",
                        subSections: [
                            {
                                title: "1. Ethical Marketing Standards",
                                items: [
                                    {
                                        subheading: "No False Promises",
                                        text: "No false income promises or exaggerated earnings claims. All representations must be truthful and verifiable."
                                    },
                                    {
                                        subheading: "Product Claims",
                                        text: "No misleading product claims. All product benefits must be substantiated and approved."
                                    },
                                    {
                                        subheading: "No Coercion",
                                        text: "No forced purchasing or recruitment. Participation must be voluntary and based on informed consent."
                                    }
                                ]
                            },
                            {
                                title: "2. Advertising Guidelines",
                                items: [
                                    {
                                        subheading: "Social Media",
                                        text: "Social media posts must clearly disclose your affiliation with the company and comply with platform guidelines."
                                    },
                                    {
                                        subheading: "Testimonials",
                                        text: "Testimonials must reflect genuine experiences and disclose any material connections to the company."
                                    },
                                    {
                                        subheading: "Comparisons",
                                        text: "Comparisons with competitors must be fair, accurate, and not disparaging."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Distributor Responsibilities",
                        subSections: [
                            {
                                title: "1. Sales Practices",
                                items: [
                                    {
                                        subheading: "Honest Promotion",
                                        text: "Promote products honestly and accurately without exaggeration or misrepresentation."
                                    },
                                    {
                                        subheading: "Guidelines Compliance",
                                        text: "Follow company marketing guidelines and use only approved marketing materials."
                                    },
                                    {
                                        subheading: "Customer Service",
                                        text: "Provide excellent customer service and address customer concerns promptly."
                                    }
                                ]
                            },
                            {
                                title: "2. Training Requirements",
                                items: [
                                    {
                                        subheading: "Initial Training",
                                        text: "Complete initial training program before actively recruiting or selling."
                                    },
                                    {
                                        subheading: "Continuing Education",
                                        text: "Participate in ongoing training to stay updated on policies and best practices."
                                    },
                                    {
                                        subheading: "Team Development",
                                        text: "Properly train and mentor downline members on ethical sales practices."
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        heading: "Prohibited Activities",
                        subSections: [
                            {
                                title: "1. Unacceptable Practices",
                                items: [
                                    {
                                        subheading: "Pyramid Schemes",
                                        text: "No representation or operation as a pyramid scheme. Compensation must be based on product sales, not recruitment."
                                    },
                                    {
                                        subheading: "Spamming",
                                        text: "No spamming or harassment through unsolicited messages, emails, or calls."
                                    },
                                    {
                                        subheading: "Brand Misuse",
                                        text: "No misuse of brand name, logo, or intellectual property without authorization."
                                    }
                                ]
                            },
                            {
                                title: "2. Consequences of Violations",
                                items: [
                                    {
                                        subheading: "Disciplinary Action",
                                        text: "Violation of marketing policies may result in warning, suspension, or termination of membership."
                                    },
                                    {
                                        subheading: "Commission Forfeiture",
                                        text: "Serious violations may result in forfeiture of commissions and benefits."
                                    },
                                    {
                                        subheading: "Legal Action",
                                        text: "The company reserves the right to pursue legal action for serious violations."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    ];

    return (
        <div className="bg-[#0D0D0D] font-sans min-h-screen">
            {/* Hero Banner Section */}
            <header className="relative h-[100px] md:h-[140px] bg-cover bg-center border-b border-[#C8A96A]/20"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
                <div className="absolute inset-0 bg-[#0D0D0D]/80 backdrop-blur-sm"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#C8A96A] mb-1 animate-fade-in drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        Legal Policies
                    </h1>
                </div>
            </header>

            {/* Intro Section */}
            <section className="py-1 px-4 max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F5E6C8] mb-1 animate-slide-up">
                    Sanyukt Parivaar & Rich Life
                </h2>
                <p className="text-xs md:text-sm text-[#C8A96A] font-bold tracking-[0.2em] uppercase mb-2">
                    Legal Information and Policies
                </p>
                <div className="luxury-divider !my-0.5 opacity-30"></div>
            </section>

            {/* Legal Disclaimer */}
            <section className="py-1 px-4 max-w-4xl mx-auto">
                <div className="luxury-box p-6 border-l-4 border-l-[#C8A96A] animate-slide-right bg-[#1A1A1A]">
                    <div className="flex items-start gap-4">
                        <Lock className="w-6 h-6 text-[#C8A96A] flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-[#C8A96A] mb-1 tracking-widest uppercase text-[10px] md:text-xs">Legal Disclaimer</h3>
                            <p className="text-[#F5E6C8]/80 text-sm leading-relaxed">
                                Sanyukt Parivaar & Rich Life Pvt.Ltd. follows applicable Direct Selling Guidelines.
                                Income depends on individual effort and performance. No guaranteed earnings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Policies Navigation Cards */}
            <section className="py-4 px-4 max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {(showAllPolicies ? policies : policies.slice(0, 4)).map((policy, index) => (
                        <button
                            key={policy.id}
                            onClick={() => togglePolicy(policy.id)}
                            className={`w-36 p-3 rounded-none transition-all duration-300 transform hover:-translate-y-1 animate-fade-in text-center group border ${expandedPolicy === policy.id
                                ? 'bg-[#C8A96A] text-[#0D0D0D] border-[#C8A96A] shadow-[0_0_15px_rgba(200,169,106,0.3)]'
                                : 'bg-[#1A1A1A] hover:bg-[#252525] border-[#C8A96A]/20 text-[#C8A96A]'
                                }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`flex justify-center mb-1 transition-colors ${expandedPolicy === policy.id ? 'text-[#0D0D0D]' : 'text-[#C8A96A]'
                                }`}>
                                {React.cloneElement(policy.icon, { className: "w-5 h-5" })}
                            </div>
                            <span className={`text-xs sm:text-sm font-bold uppercase tracking-widest ${expandedPolicy === policy.id ? 'text-[#0D0D0D]' : 'text-[#F5E6C8]'
                                }`}>
                                {policy.title}
                            </span>
                        </button>
                    ))}

                    {/* View More / View Less Toggle Button */}
                    {policies.length > 4 && (
                        <button
                            onClick={() => setShowAllPolicies(!showAllPolicies)}
                            className="w-36 p-3 rounded-none border border-[#C8A96A]/20 hover:border-[#C8A96A]/50 bg-[#1A1A1A] hover:bg-[#252525] transition-all duration-300 transform hover:-translate-y-1 text-center flex flex-col items-center justify-center animate-fade-in group"
                        >
                            <div className="flex justify-center mb-2 text-[#C8A96A] group-hover:scale-110 transition-transform">
                                {showAllPolicies ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold text-[#C8A96A] uppercase tracking-widest">
                                {showAllPolicies ? "View Less" : "View More"}
                            </span>
                        </button>
                    )}
                </div>
            </section>

            {/* Active Policy Content */}
            {expandedPolicy && (
                <section className="py-4 px-4 max-w-4xl mx-auto">
                    {policies.filter(p => p.id === expandedPolicy).map((policy) => (
                        <article
                            key={policy.id}
                            className="luxury-box overflow-hidden animate-slide-up bg-[#1A1A1A]"
                        >
                            {/* Policy Header */}
                            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#252525] p-3 md:p-4 border-b border-[#C8A96A]/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-[#0D0D0D] border border-[#C8A96A]/30 flex items-center justify-center shadow-lg">
                                        {React.cloneElement(policy.icon, { className: "w-5 h-5 text-[#C8A96A]" })}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-serif font-bold text-[#C8A96A] tracking-wide">{policy.title}</h2>
                                </div>
                            </div>

                            {/* Policy Content */}
                            <div className="p-3 md:p-5">
                                <p className="text-[#F5E6C8]/80 mb-4 leading-relaxed text-xs md:text-sm border-l-2 border-[#C8A96A] pl-3">
                                    {policy.content.intro}
                                </p>

                                {/* Scope Section (for Privacy Policy) */}
                                {policy.id === 'privacy' && policy.content.scope && (
                                    <div className="mb-4 bg-[#0D0D0D] border border-[#C8A96A]/10 p-3 shadow-inner">
                                        <h3 className="text-sm font-bold text-[#C8A96A] mb-2 flex items-center gap-2 uppercase tracking-widest">
                                            <Globe className="w-4 h-4" />
                                            {policy.content.scope.title}
                                        </h3>
                                        <p className="text-[#F5E6C8]/70 text-[11px] leading-relaxed">
                                            {policy.content.scope.content}
                                        </p>
                                    </div>
                                )}

                                {/* Main Sections with Dropdowns */}
                                {policy.content.sections.map((section, sectionIdx) => (
                                    <div key={sectionIdx} className="mb-8 last:mb-0">
                                        <h3 className="text-lg font-serif font-bold text-[#C8A96A] mb-4 pb-2 border-b border-[#C8A96A]/10 uppercase tracking-widest">
                                            {section.heading}
                                        </h3>

                                        <div className="space-y-2">
                                            {section.subSections.map((subSection, subIdx) => {
                                                const sectionKey = `${policy.id}-${sectionIdx}-${subIdx}`;
                                                const isExpanded = expandedSections[sectionKey];

                                                return (
                                                    <div key={subIdx} className="border border-[#C8A96A]/20 rounded-lg overflow-hidden mb-3">
                                                        {/* Dropdown Header */}
                                                        <button
                                                            onClick={() => toggleSection(policy.id, `${sectionIdx}-${subIdx}`)}
                                                            className="w-full flex items-center justify-between p-3 bg-[#1A1A1A] hover:bg-[#252525] transition-colors text-left"
                                                        >
                                                            <span className="font-semibold text-[#F5E6C8]">
                                                                {subSection.title}
                                                            </span>
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-5 h-5 text-[#C8A96A] flex-shrink-0" />
                                                            ) : (
                                                                <ChevronDown className="w-5 h-5 text-[#C8A96A] flex-shrink-0" />
                                                            )}
                                                        </button>

                                                        {/* Dropdown Content */}
                                                        {isExpanded && (
                                                            <div className="p-4 bg-[#0D0D0D] border-t border-[#C8A96A]/20">
                                                                {subSection.content && (
                                                                    <p className="text-[#F5E6C8]/80 mb-4 leading-relaxed">{subSection.content}</p>
                                                                )}

                                                                {subSection.items && (
                                                                    <div className="space-y-2">
                                                                        {subSection.items.map((item, itemIdx) => (
                                                                            <div key={itemIdx} className="pl-4 border-l-2 border-[#C8A96A]">
                                                                                <h5 className="font-bold text-[#C8A96A] mb-1">
                                                                                    {item.subheading}
                                                                                </h5>
                                                                                <p className="text-[#F5E6C8]/60 text-sm leading-relaxed">
                                                                                    {item.text}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Link to full policy page */}
                                <div className="mt-8 pt-6 border-t border-[#C8A96A]/10 flex justify-end">
                                    <Link
                                        to={policy.path}
                                        className="luxury-button inline-flex items-center gap-2 px-6 py-3"
                                    >
                                        <span className="font-bold text-[10px] tracking-[0.2em] uppercase">Read Full {policy.title}</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {/* Official Certifications Section */}
            <section className="py-2 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-serif font-bold text-[#C8A96A] inline-block relative pb-3">
                        Official Certifications & Documents
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-[2px] bg-[#C8A96A]/60"></span>
                    </h2>
                    <p className="text-[#F5E6C8]/60 mt-2 max-w-2xl mx-auto">
                        View and download our official company registration and compliance documents.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Certificate 1  */}
                    <a href="/certifications/certificate_1.pdf" target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 bg-[#1A1A1A] rounded-[1rem] shadow-xl hover:shadow-[0_0_20px_rgba(200,169,106,0.15)] transition-all duration-300 border border-[#C8A96A]/10 hover:border-[#C8A96A] group">
                        <div className="w-12 h-12 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#C8A96A] transition-colors duration-500">
                            <FileText className="w-6 h-6 text-[#C8A96A] group-hover:text-[#0D0D0D] transition-colors duration-500" />
                        </div>
                        <h3 className="font-serif font-bold text-[#F5E6C8] text-center mb-2 group-hover:text-[#C8A96A] transition-colors duration-500 leading-snug text-sm">Certificate of<br />Incorporation</h3>
                        <span className="text-xs uppercase tracking-widest font-black text-[#C8A96A]/60 mt-auto flex items-center gap-1 group-hover:text-[#C8A96A] transition-colors duration-300">
                            View PDF <ChevronRight className="w-3 h-3" />
                        </span>
                    </a>

                    {/* Certificate 2 */}
                    <a href="/certifications/certificate_2.pdf" target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 bg-[#1A1A1A] rounded-[1rem] shadow-xl hover:shadow-[0_0_20px_rgba(200,169,106,0.15)] transition-all duration-300 border border-[#C8A96A]/10 hover:border-[#C8A96A] group">
                        <div className="w-12 h-12 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#C8A96A] transition-colors duration-500">
                            <FileText className="w-6 h-6 text-[#C8A96A] group-hover:text-[#0D0D0D] transition-colors duration-500" />
                        </div>
                        <h3 className="font-serif font-bold text-[#F5E6C8] text-center mb-2 group-hover:text-[#C8A96A] transition-colors duration-500 leading-snug text-sm">Memorandum of<br />Association</h3>
                        <span className="text-xs uppercase tracking-widest font-black text-[#C8A96A]/60 mt-auto flex items-center gap-1 group-hover:text-[#C8A96A] transition-colors duration-300">
                            View PDF <ChevronRight className="w-3 h-3" />
                        </span>
                    </a>

                    {/* Certificate 3 */}
                    <a href="/certifications/certificate_3.pdf" target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 bg-[#1A1A1A] rounded-[1rem] shadow-xl hover:shadow-[0_0_20px_rgba(200,169,106,0.15)] transition-all duration-300 border border-[#C8A96A]/10 hover:border-[#C8A96A] group">
                        <div className="w-12 h-12 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#C8A96A] transition-colors duration-500">
                            <FileText className="w-6 h-6 text-[#C8A96A] group-hover:text-[#0D0D0D] transition-colors duration-500" />
                        </div>
                        <h3 className="font-serif font-bold text-[#F5E6C8] text-center mb-2 group-hover:text-[#C8A96A] transition-colors duration-500 leading-snug text-sm">Articles of<br />Association</h3>
                        <span className="text-xs uppercase tracking-widest font-black text-[#C8A96A]/60 mt-auto flex items-center gap-1 group-hover:text-[#C8A96A] transition-colors duration-300">
                            View PDF <ChevronRight className="w-3 h-3" />
                        </span>
                    </a>

                    {/* Udyam */}
                    <a href="/certifications/udyam_registration.pdf" target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 bg-[#1A1A1A] rounded-[1rem] shadow-xl hover:shadow-[0_0_20px_rgba(200,169,106,0.15)] transition-all duration-300 border border-[#C8A96A]/10 hover:border-[#C8A96A] group">
                        <div className="w-12 h-12 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#C8A96A] transition-colors duration-500">
                            <Award className="w-6 h-6 text-[#C8A96A] group-hover:text-[#0D0D0D] transition-colors duration-500" />
                        </div>
                        <h3 className="font-serif font-bold text-[#F5E6C8] text-center mb-2 group-hover:text-[#C8A96A] transition-colors duration-500 leading-snug text-sm">Udyam Registration<br />Certificate</h3>
                        <span className="text-xs uppercase tracking-widest font-black text-[#C8A96A]/60 mt-auto flex items-center gap-1 group-hover:text-[#C8A96A] transition-colors duration-300">
                            View PDF <ChevronRight className="w-3 h-3" />
                        </span>
                    </a>

                    {/* TAN */}
                    <a href="/certifications/tan_certificate.pdf" target="_blank" rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 bg-[#1A1A1A] rounded-[1rem] shadow-xl hover:shadow-[0_0_20px_rgba(200,169,106,0.15)] transition-all duration-300 border border-[#C8A96A]/10 hover:border-[#C8A96A] group">
                        <div className="w-12 h-12 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#C8A96A] transition-colors duration-500">
                            <Shield className="w-6 h-6 text-[#C8A96A] group-hover:text-[#0D0D0D] transition-colors duration-500" />
                        </div>
                        <h3 className="font-serif font-bold text-[#F5E6C8] text-center mb-2 group-hover:text-[#C8A96A] transition-colors duration-500 leading-snug text-sm">TAN<br />Certificate</h3>
                        <span className="text-xs uppercase tracking-widest font-black text-[#C8A96A]/60 mt-auto flex items-center gap-1 group-hover:text-[#C8A96A] transition-colors duration-300">
                            View PDF <ChevronRight className="w-3 h-3" />
                        </span>
                    </a>
                </div>
            </section>

            {/* Last Updated */}
            <section className="py-2 px-4 max-w-4xl mx-auto text-center border-t border-[#C8A96A]/10 mt-2">
                <div className="flex items-center justify-center gap-2 text-[#C8A96A]/40 text-sm font-black tracking-widest uppercase">
                    <Calendar className="w-4 h-4" />
                    <span>Last Updated: {lastUpdated}</span>
                </div>
            </section>

            <hr />


        </div>
    );
};

export default LegalPage;
