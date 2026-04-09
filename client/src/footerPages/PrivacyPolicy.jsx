import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Calendar, Globe, Lock } from 'lucide-react';

const PrivacyPolicy = () => {
    const lastUpdated = "March 15, 2024";

    return (
        <div className="bg-[#F8FAF5] font-sans min-h-screen">
            {/* Hero Banner */}
            <header className="relative h-[200px] bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
                <div className="absolute inset-0 bg-black/65"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in">
                        Privacy Policy
                    </h1>
                    <div className="flex items-center text-white/90 text-sm md:text-base flex-wrap justify-center">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link to="/company/legal" className="hover:text-white transition-colors">Legal</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-white">Privacy Policy</span>
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
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold">Privacy Policy</h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <p className="text-[#222222] mb-8 leading-relaxed text-lg border-l-4 border-[#0A7A2F] pl-4">
                            Sanyukt Parivaar & Rich Life Pvt.Ltd. respects the privacy of its users, members, and customers.
                            This Privacy Policy explains how we collect, use, protect, and disclose personal information
                            provided on our website and digital platforms.
                        </p>

                        {/* Scope Section */}
                        <div className="mb-8 bg-[#F8FAF5] p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-3 flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Scope of the Privacy Policy
                            </h3>
                            <p className="text-[#222222] text-sm leading-relaxed">
                                This is Sanyukt Parivaar & Rich Life Pvt.Ltd.'s global Privacy Policy. We have highlighted below where a particular section applies to you based on where you live. For the purposes of the General Data Protection Regulation ('GDPR'), if you are a resident in the EEA, Switzerland, and the UK, Sanyukt Parivaar Europe Ltd. and Sanyukt Parivaar, Inc. are joint data controllers of your personal data. Sanyukt Parivaar Europe Ltd. is an Irish company with its registered office at Waterloo Exchange, 3rd Floor, Waterloo Road, Dublin 4, Ireland. Sanyukt Parivaar, Inc. is a US company with its registered office at 651 Brannan St., San Francisco, CA 94107, USA. Sanyukt Parivaar Europe Ltd is the responsible controller for fulfilling key obligations under the GDPR. If you have any questions about our data processing activities, please contact our Data Protection Officer.
                            </p>
                        </div>

                        {/* Information Collection Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200">
                                We collect information in a few different ways
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. When you give it to us or give us permission to obtain it</h4>
                                    <p className="text-[#222222] mb-4">When you use Sanyukt Parivaar websites, apps, services, technologies, APIs, widgets, or any other products, or features we offer ("Sanyukt Parivaar" or the "Services"), you voluntarily share certain information.</p>

                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Account Information</h5>
                                            <p className="text-[#222222] text-sm">When you join our Services, we collect information like your name, email address, birthday, gender, country of residence, your interests, and preferred language. If you have a business account, depending on where you live, you may also have the option to add race and ethnicity information to your profile.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Content</h5>
                                            <p className="text-[#222222] text-sm">We collect information when you save or upload content, photos, or other content, interact with content or other content (for example, commenting or adding a post), or where you send messages and interact with other users.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Precise location information</h5>
                                            <p className="text-[#222222] text-sm">Depending on where you live, you can choose to share your precise location using your device settings.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Your communications with us</h5>
                                            <p className="text-[#222222] text-sm">If you contact us for customer support or otherwise communicate with us, we collect the content of these communications.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Your contacts</h5>
                                            <p className="text-[#222222] text-sm">If you previously chose to sync your contacts with your account, we will continue to process certain information about your contacts who are Sanyukt Parivaar users to help you find one another on our Services.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. We also get technical information when you use our Services</h4>
                                    <p className="text-[#222222] mb-4">These days, whenever you use a website, app, or other internet service, there's certain information that's almost always created and recorded automatically. The same is true when you use our Services. Here are some of the types of information we collect when you use our Services:</p>

                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Log data</h5>
                                            <p className="text-[#222222] text-sm">When you use our Services, our servers record information, including information that your browser automatically sends whenever you visit a website or app, and information about how you use our Services. Log data includes your Internet Protocol address, the address of and activity on websites or apps you visit that incorporate our technology, the dates and times of your use, browser type and settings, device information and settings, operating system, and app version.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Usage information</h5>
                                            <p className="text-[#222222] text-sm">We collect information about your activity through our Services, including: your interactions with content, the content you save, search queries, the availability of content, and the accounts you interact with.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Device information</h5>
                                            <p className="text-[#222222] text-sm">We collect information from and about the devices you use to access our Services. This includes things like IP addresses, crash logs, and the system you use to access our Services.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Information from cookies and other technologies</h5>
                                            <p className="text-[#222222] text-sm">We use cookies and similar technologies to recognize you and/or your device(s) on, off, and across different Services and devices. We also allow others to use cookies as described in our Cookie Policy. You can manage cookies through your browser settings.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">3. Information we receive from other sources</h4>
                                    <p className="text-[#222222] mb-4">We receive information about you from other users, from business partners, from our affiliated companies, and from the websites and apps that integrate our technology.</p>

                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Other users</h5>
                                            <p className="text-[#222222] text-sm">Other users may provide information about you when they submit content through the Services. For example, they may mention or tag you in content, or upload information about you.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Business partners</h5>
                                            <p className="text-[#222222] text-sm">We receive information from business partners, including advertisers, app developers, and publishers. This information helps us to deliver more relevant content and advertising.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Affiliated companies</h5>
                                            <p className="text-[#222222] text-sm">We receive information from companies that are affiliated with Sanyukt Parivaar (such as our parent company, subsidiaries, and other companies that share common ownership).</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Information Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-[#0A7A2F] mb-4 pb-2 border-b border-gray-200">
                                How we use your information
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">1. To provide, improve, and personalize our Services</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Provide our Services</h5>
                                            <p className="text-[#222222] text-sm">We use your information to deliver our Services, including to create and maintain your account, process orders, and provide customer support.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Personalize your experience</h5>
                                            <p className="text-[#222222] text-sm">We use your information to personalize the content you see, including recommendations, search results, and ads.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Improve our Services</h5>
                                            <p className="text-[#222222] text-sm">We use your information to analyze how our Services are used, to develop new features, and to improve performance and reliability.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">2. To communicate with you</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Service communications</h5>
                                            <p className="text-[#222222] text-sm">We use your information to send you administrative messages, such as updates to our terms and policies, security alerts, and account notifications.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Marketing communications</h5>
                                            <p className="text-[#222222] text-sm">With your consent where required, we use your information to send you marketing messages about products, services, and promotions that may interest you.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-[#222222] mb-3">3. To ensure the security of our Services</h4>
                                    <div className="space-y-4 pl-4">
                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Security and integrity</h5>
                                            <p className="text-[#222222] text-sm">We use your information to detect, investigate, and prevent fraudulent transactions and other illegal activities, and to protect the rights and property of Sanyukt Parivaar and others.</p>
                                        </div>

                                        <div className="pl-4 border-l-2 border-[#F7931E]">
                                            <h5 className="font-bold text-[#0A7A2F] mb-1">Compliance with law</h5>
                                            <p className="text-[#222222] text-sm">We use your information to comply with applicable laws, regulations, and legal processes, and to respond to lawful requests from government authorities.</p>
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

export default PrivacyPolicy;