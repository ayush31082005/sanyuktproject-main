import React, { useState } from 'react';
import {
    Download, Building2, Landmark, QrCode, ClipboardCheck,
    Copy, Info, CheckCircle2, CreditCard, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const OurBanker = () => {
    const [copied, setCopied] = useState(false);

    const bankDetails = {
        accountName: "SAYUKT PARIVAR AND RICH LIFE PVT. LTD.",
        accountNumber: "5935938755",
        ifsc: "CBIN0282390",
        bankName: "CENTRAL BANK OF INDIA",
        branch: "LALPUR",
        upiId: "20260325575843-iservuqrsbrp@cbin"
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const downloadedOn = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sanyukt Parivaar Banker Details</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f6f1e7;
            color: #1a1a1a;
        }
        .page {
            max-width: 860px;
            margin: 40px auto;
            background: #ffffff;
            border: 1px solid #d8c39a;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
        }
        .header {
            background: linear-gradient(135deg, #111111 0%, #2a2418 100%);
            color: #f5e6c8;
            padding: 32px;
        }
        .eyebrow {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #c8a96a;
            margin: 0 0 10px;
        }
        h1 {
            margin: 0 0 10px;
            font-size: 34px;
            line-height: 1.1;
        }
        .sub {
            margin: 0;
            color: rgba(245, 230, 200, 0.76);
            font-size: 15px;
            line-height: 1.7;
        }
        .section {
            padding: 28px 32px;
            border-top: 1px solid #eee4cf;
        }
        .section h2 {
            margin: 0 0 18px;
            font-size: 18px;
            color: #9a7732;
            text-transform: uppercase;
            letter-spacing: 0.14em;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }
        .card {
            background: #faf6ee;
            border: 1px solid #eadbbd;
            border-radius: 14px;
            padding: 16px 18px;
        }
        .label {
            font-size: 12px;
            font-weight: 700;
            color: #8a7a5a;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            margin-bottom: 8px;
        }
        .value {
            font-size: 20px;
            font-weight: 700;
            color: #1a1a1a;
            word-break: break-word;
        }
        .value.mono {
            font-family: "Courier New", monospace;
        }
        .full {
            grid-column: 1 / -1;
        }
        .footer {
            padding: 24px 32px 32px;
            font-size: 13px;
            color: #6b6254;
            line-height: 1.8;
        }
        .footer strong {
            color: #1a1a1a;
        }
        @media (max-width: 700px) {
            .page {
                margin: 16px;
            }
            .header, .section, .footer {
                padding: 22px;
            }
            .grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <p class="eyebrow">Official Banker Details</p>
            <h1>Sanyukt Parivaar & Rich Life Pvt. Ltd.</h1>
            <p class="sub">This file contains the official account details for company settlement, transfer, and member payment verification.</p>
        </div>

        <div class="section">
            <h2>Bank Account Information</h2>
            <div class="grid">
                <div class="card full">
                    <div class="label">Account Holder Name</div>
                    <div class="value">${bankDetails.accountName}</div>
                </div>
                <div class="card">
                    <div class="label">Account Number</div>
                    <div class="value mono">${bankDetails.accountNumber}</div>
                </div>
                <div class="card">
                    <div class="label">IFSC Code</div>
                    <div class="value mono">${bankDetails.ifsc}</div>
                </div>
                <div class="card">
                    <div class="label">Bank Name</div>
                    <div class="value">${bankDetails.bankName}</div>
                </div>
                <div class="card">
                    <div class="label">Branch</div>
                    <div class="value">${bankDetails.branch}</div>
                </div>
                <div class="card full">
                    <div class="label">UPI ID</div>
                    <div class="value mono">${bankDetails.upiId}</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <strong>Downloaded On:</strong> ${downloadedOn}<br />
            <strong>Issued By:</strong> Sanyukt Parivaar & Rich Life Pvt. Ltd.<br />
            This is an informational banking reference document for official company use.
        </div>
    </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sanyukt-parivaar-account-details.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Account details downloaded');
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] p-4 md:p-8 font-sans selection:bg-[#C8A96A]/20 selection:text-[#C8A96A] print:bg-white">
            {/* Hide scrollbars on sliders */}
            <style>{`
                .slide-scroll::-webkit-scrollbar { display: none; }
                .slide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
                @media print {
                    * {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .slide-scroll {
                        overflow: visible !important;
                    }
                }
            `}</style>

            {/* Header Section */}
            <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="h-px w-8 bg-[#C8A96A]"></span>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#C8A96A]">Company Portfolio</p>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F5E6C8] tracking-tight">
                        Our <span className="text-[#C8A96A]">Banker</span>
                    </h1>
                    <p className="mt-3 text-[#F5E6C8]/60 font-medium max-w-md text-base">Official banking and settlement details for Sanyukt Parivaar & Rich Life Pvt Ltd.</p>
                </div>

                <button
                    onClick={handleDownload}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-[#1A1A1A] px-8 py-4 text-sm font-black text-[#C8A96A] shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 border border-[#C8A96A]/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#C8A96A]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <Download size={18} className="relative z-10 text-[#C8A96A]" />
                    <span className="relative z-10 uppercase tracking-widest">Download Details</span>
                </button>
            </div>

            {/* ── MAIN CONTENT: Slides on mobile, grid on desktop ── */}
            <div className="max-w-6xl mx-auto">
                <div className="slide-scroll flex lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-start overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">

                    {/* ── Slide 1: UPI & QR Code (shown first) ── */}
                    <div className="min-w-[85vw] sm:min-w-[70vw] lg:min-w-0 snap-center flex-shrink-0 bg-[#1A1A1A] rounded-[2rem] border border-[#C8A96A]/15 shadow-2xl p-6 sm:p-8 md:p-12">
                        <div className="text-center mb-8 sm:mb-10">
                            <div className="inline-flex items-center gap-3 py-2 px-6 bg-[#0D0D0D] rounded-full border border-[#C8A96A]/15 mb-6">
                                <QrCode className="w-4 h-4 text-[#C8A96A]" />
                                <span className="text-[#C8A96A] font-black text-xs uppercase tracking-[0.15em]">Instant UPI Payment</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-[#F5E6C8] tracking-tight mb-2">Scan & Pay</h3>
                            <p className="text-[#F5E6C8]/50 text-sm font-medium">Fastest way to settle your account balance</p>
                        </div>

                        <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 mb-8 sm:mb-10 group">
                            <div className="absolute -inset-4 border border-[#C8A96A]/10 rounded-[2rem]"></div>
                            <div className="relative bg-white rounded-2xl p-4 shadow-sm h-full w-full flex items-center justify-center">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${bankDetails.upiId}&pn=${encodeURIComponent(bankDetails.accountName)}&cu=INR`}
                                    alt="Payment QR Code"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div
                                className="bg-[#0D0D0D] rounded-2xl p-4 border border-[#C8A96A]/10 hover:border-[#C8A96A]/30 transition-all flex items-center justify-between group cursor-pointer"
                                onClick={() => handleCopy(bankDetails.upiId)}
                            >
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="w-10 h-10 bg-[#C8A96A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Landmark className="w-5 h-5 text-[#C8A96A]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-[#C8A96A]/50 uppercase tracking-widest mb-0.5">VPA / UPI ID</p>
                                        <p className="text-sm font-bold text-[#F5E6C8] truncate">{bankDetails.upiId}</p>
                                    </div>
                                </div>
                                <div className="p-2 rounded-lg bg-[#C8A96A]/10 border border-[#C8A96A]/15 group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-all text-[#C8A96A] flex-shrink-0 ml-2">
                                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <ClipboardCheck className="w-5 h-5" />}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Slide 2: Bank Card ── */}
                    <div className="min-w-[85vw] sm:min-w-[70vw] lg:min-w-0 snap-center space-y-6 flex-shrink-0">
                        <div className="relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#C8A96A]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#C8A96A]/10 transition-colors"></div>

                            <div className="relative bg-[#1A1A1A] rounded-[2rem] border border-[#C8A96A]/15 shadow-2xl p-6 sm:p-8 md:p-12 overflow-hidden">
                                <div className="flex items-center justify-between mb-8 sm:mb-10">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#C8A96A]/10 rounded-2xl flex items-center justify-center border border-[#C8A96A]/20">
                                        <Building2 className="text-[#C8A96A] w-7 h-7 sm:w-8 sm:h-8" />
                                    </div>
                                    <div className="text-right">
                                        <ShieldCheck className="text-[#C8A96A] w-5 h-5 sm:w-6 sm:h-6 ml-auto mb-1 opacity-50" />
                                        <span className="text-xs font-black text-[#C8A96A]/60 uppercase tracking-widest">Verified Multi-City Account</span>
                                    </div>
                                </div>

                                <div className="space-y-6 sm:space-y-8">
                                    <div className="group/item cursor-pointer" onClick={() => handleCopy(bankDetails.accountName)}>
                                        <p className="text-xs font-black text-[#C8A96A]/50 uppercase tracking-widest mb-2 flex justify-between items-center">
                                            Account Holder Name
                                            <Copy className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-[#C8A96A]" />
                                        </p>
                                        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#F5E6C8] group-hover/item:text-[#C8A96A] transition-colors uppercase leading-tight">
                                            {bankDetails.accountName}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                        <div className="group/item cursor-pointer" onClick={() => handleCopy(bankDetails.accountNumber)}>
                                            <p className="text-xs font-black text-[#C8A96A]/50 uppercase tracking-widest mb-2">A/C Number</p>
                                            <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#C8A96A] group-hover/item:text-[#F5E6C8] transition-colors">
                                                {bankDetails.accountNumber}
                                            </p>
                                        </div>
                                        <div className="group/item cursor-pointer" onClick={() => handleCopy(bankDetails.ifsc)}>
                                            <p className="text-xs font-black text-[#C8A96A]/50 uppercase tracking-widest mb-2">IFSC Code</p>
                                            <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#C8A96A] group-hover/item:text-[#F5E6C8] transition-colors">
                                                {bankDetails.ifsc}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 sm:pt-8 border-t border-[#C8A96A]/10 flex items-center justify-between flex-wrap gap-3">
                                        <div>
                                            <p className="text-xs font-black text-[#C8A96A]/50 uppercase tracking-widest mb-1">{bankDetails.bankName}</p>
                                            <p className="text-sm font-bold text-[#F5E6C8] flex items-center gap-2">
                                                <Landmark className="w-4 h-4 text-[#C8A96A]" />
                                                {bankDetails.branch}
                                            </p>
                                        </div>
                                        <div className="bg-[#C8A96A]/10 px-4 py-2 rounded-xl border border-[#C8A96A]/15">
                                            <span className="text-xs font-black text-[#C8A96A] uppercase tracking-widest leading-none">Status: <span className="text-green-400">Active</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-[#C8A96A] rounded-[2rem] p-6 text-[#0D0D0D] shadow-lg flex items-center gap-5 overflow-hidden relative">
                            <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/10 -skew-x-12 transform translate-x-8"></div>
                            <div className="w-12 h-12 bg-[#0D0D0D]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-widest mb-1">Corporate Settlement</h4>
                                <p className="text-[#0D0D0D]/70 text-sm font-medium leading-relaxed">Payments made to this account are directly linked to Sanyukt Parivaar corporate clearing.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide indicators — mobile only */}
                <div className="flex lg:hidden justify-center gap-2 mt-4">
                    <div className="w-8 h-1.5 rounded-full bg-[#C8A96A]"></div>
                    <div className="w-8 h-1.5 rounded-full bg-[#C8A96A]/20"></div>
                </div>
            </div>

            {/* ── STEP-BY-STEP DEPOSIT GUIDE (slides on mobile) ── */}
            <div className="max-w-6xl mx-auto mt-12">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#F5E6C8] tracking-tight">How to <span className="text-[#C8A96A]">Deposit</span></h2>
                    <p className="text-[#F5E6C8]/50 mt-2 font-medium text-base">Follow these simple steps for a hassle-free settlement</p>
                </div>

                <div className="slide-scroll flex lg:grid lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                    {[
                        { step: "01", title: "Scan or Copy", desc: "Scan the QR code or copy the bank details/UPI ID provided above.", icon: Copy },
                        { step: "02", title: "Complete Payment", desc: "Use any UPI app or Net Banking to transfer the desired amount.", icon: CreditCard },
                        { step: "03", title: "Share Screenshot", desc: "Upload the payment proof or share it with your manager for instant update.", icon: ClipboardCheck }
                    ].map((item, i) => (
                        <div key={i} className="min-w-[75vw] sm:min-w-[45vw] lg:min-w-0 snap-center flex-shrink-0 group relative bg-[#1A1A1A] p-6 sm:p-8 rounded-2xl border border-[#C8A96A]/10 hover:border-[#C8A96A]/30 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                            <div className="absolute top-4 right-6 text-5xl font-black text-[#C8A96A]/5 group-hover:text-[#C8A96A]/10 transition-colors">{item.step}</div>
                            <div className="w-14 h-14 bg-[#C8A96A]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform border border-[#C8A96A]/15">
                                <item.icon className="w-7 h-7 text-[#C8A96A]" />
                            </div>
                            <h4 className="text-lg font-black text-[#F5E6C8] mb-2">{item.title}</h4>
                            <p className="text-[#F5E6C8]/50 text-sm leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FAQ SECTION ── */}
            <div className="max-w-6xl mx-auto mt-12 grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24">
                        <span className="text-xs font-black text-[#C8A96A] uppercase tracking-[0.3em] mb-4 block">Help Center</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#F5E6C8] tracking-tight mb-4">Frequently Asked <span className="text-[#C8A96A]">Questions</span></h2>
                        <p className="text-[#F5E6C8]/50 font-medium leading-relaxed mb-6 text-base">Can't find what you're looking for? Contact our 24/7 support team for immediate assistance.</p>

                        <div className="p-5 sm:p-6 bg-[#1A1A1A] rounded-2xl border border-[#C8A96A]/15">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-[#C8A96A] rounded-xl flex items-center justify-center text-[#0D0D0D] shadow-lg">
                                    <ShieldCheck className="w-6 h-6 mx-auto" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[#C8A96A]/60 uppercase tracking-widest">Support Priority</p>
                                    <p className="text-base font-black text-[#F5E6C8]">Member Protection</p>
                                </div>
                            </div>
                            <p className="text-sm text-[#F5E6C8]/50 font-medium leading-relaxed">We ensure 100% safety of your funds. Every transaction is legally verified and acknowledged.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-3">
                    {[
                        { q: "How much time does it take for wallet update?", a: "Most UPI transactions are updated within 30 minutes. Bank transfers (NEFT/IMPS) may take up to 2-4 working hours." },
                        { q: "What should I write in the payment remark?", a: "Please always mention your unique Member ID in the remark to help us identify your payment quickly." },
                        { q: "Is there any limit on the deposit amount?", a: "There is no limit from our side, but your bank or UPI app may have daily limits for transactions." },
                        { q: "What if my payment is deducted but not updated?", a: "Don't worry! Contact support with your UTR/Transaction ID, and we will verify it manually within an hour." }
                    ].map((faq, i) => (
                        <div key={i} className="bg-[#1A1A1A] p-5 sm:p-6 rounded-2xl border border-[#C8A96A]/10 hover:border-[#C8A96A]/25 transition-all group">
                            <h4 className="text-base font-black text-[#F5E6C8] mb-2 flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-[#C8A96A]/10 flex items-center justify-center text-xs text-[#C8A96A] font-black group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-colors flex-shrink-0">?</span>
                                {faq.q}
                            </h4>
                            <p className="text-sm text-[#F5E6C8]/50 leading-relaxed font-medium pl-10">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FINAL TRUST BANNER ── */}
            <div className="max-w-6xl mx-auto mt-12 mb-8">
                <div className="bg-gradient-to-r from-[#C8A96A] to-[#A08550] rounded-2xl p-6 sm:p-8 md:p-12 text-[#0D0D0D] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldCheck className="w-48 h-48 sm:w-64 sm:h-64" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative z-10">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0D0D0D]/20 backdrop-blur-xl rounded-2xl flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#0D0D0D]" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl sm:text-2xl font-black mb-2">Transact with Total Confidence</h4>
                            <p className="text-[#0D0D0D]/70 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
                                Your association with <span className="text-[#0D0D0D] font-black italic underline decoration-[#0D0D0D]/30">Sanyukt Parivaar</span> is protected by state-of-the-art security and legal compliance. We maintain 100% transparency in all financial dealings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Only Section */}
            <div className="hidden print:block p-8 border-2 border-slate-900 mt-20">
                <h1 className="text-3xl font-bold mb-8 text-center underline uppercase text-black">Official Banking Details</h1>
                <div className="space-y-4 text-black text-[17px] leading-8">
                    <p><strong>Company Name:</strong> {bankDetails.accountName}</p>
                    <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
                    <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
                    <p><strong>IFSC Code:</strong> {bankDetails.ifsc}</p>
                    <p><strong>Branch:</strong> {bankDetails.branch}</p>
                    <p><strong>UPI ID:</strong> {bankDetails.upiId}</p>
                </div>
                <div className="mt-12 text-center text-sm text-slate-500">
                    Sanyukt Parivaar & Rich Life Pvt Ltd - Official Document
                </div>
            </div>
        </div>
    );
};

export default OurBanker;
