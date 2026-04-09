import React, { useState } from 'react';
import { Download } from 'lucide-react';

const formatDate = (value) => {
    const date = value ? new Date(value) : new Date();
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const WelcomeLetter = () => {
    const [userData] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    });

    const handlePrint = () => window.print();

    return (
        <div className="mx-auto max-w-5xl bg-[#0D0D0D] px-4 py-6 md:px-6 min-h-screen print:bg-white print:max-w-none print:px-0 print:py-0">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between print:hidden">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#C8A96A]/60">My Folder</p>
                    <h1 className="mt-2 text-3xl font-black text-[#F5E6C8] uppercase tracking-tighter">Welcome Letter</h1>
                </div>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#C8A96A]/30 bg-[#1A1A1A] px-5 py-2.5 text-sm font-bold text-[#C8A96A] transition hover:bg-[#C8A96A]/10 hover:border-[#C8A96A]/60"
                >
                    <Download size={18} />
                    Download / Print
                </button>
            </div>

            <div className="mx-auto max-w-4xl border border-[#C8A96A]/20 bg-[#1A1A1A] px-8 py-10 shadow-2xl shadow-[#C8A96A]/5 print:border-none print:shadow-none print:bg-white md:px-14 md:py-14 rounded-2xl print:rounded-none print:max-w-none">
                <div className="border-b border-[#C8A96A]/20 print:border-black/20 pb-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-serif font-bold uppercase tracking-[0.08em] text-[#C8A96A] print:text-black md:text-3xl drop-shadow-sm">
                            Sanyukt Parivaar & Rich Life Pvt.Ltd.
                        </h2>
                        <p className="mt-2 text-sm text-[#C8A96A]/80 font-bold uppercase tracking-widest print:text-black">Welcome Letter</p>
                    </div>
                </div>

                <div className="pt-8 text-[16px] leading-8 text-[#F5E6C8] print:text-black print:text-[17px] print:leading-[1.7]">
                    <div className="mb-8 flex flex-col gap-4 text-sm md:flex-row md:items-start md:justify-between">
                        <div className="bg-[#0D0D0D] print:bg-transparent p-4 rounded-xl border border-[#C8A96A]/10 print:border-none print:p-0">
                            <p><span className="font-bold text-[#C8A96A] print:text-black uppercase text-[11px] tracking-widest mr-2">Name:</span> 
                               <span className="font-semibold text-[15px]">{userData?.userName || 'Member'}</span></p>
                            <p className="mt-1"><span className="font-bold text-[#C8A96A] print:text-black uppercase text-[11px] tracking-widest mr-2">Member ID:</span> 
                               <span className="bg-[#C8A96A]/10 print:bg-transparent px-2 py-0.5 rounded text-[#C8A96A] print:text-black font-bold border border-[#C8A96A]/20 print:border-none">{userData?.memberId || 'SPRL0000'}</span></p>
                        </div>
                        <div className="text-left md:text-right bg-[#0D0D0D] print:bg-transparent p-4 rounded-xl border border-[#C8A96A]/10 print:border-none print:p-0">
                            <p><span className="font-bold text-[#C8A96A] print:text-black uppercase text-[11px] tracking-widest mr-2">Date:</span> 
                               <span className="font-semibold">{formatDate(userData?.joinDate || userData?.createdAt)}</span></p>
                        </div>
                    </div>

                    <div className="px-2 md:px-4">
                        <p className="mb-6 font-bold text-[#C8A96A] print:text-black text-lg border-l-4 border-[#C8A96A] pl-4 bg-[#0D0D0D] print:bg-transparent print:border-none print:pl-0 p-3 rounded-r-xl">Subject: Welcome to Sanyukt Parivaar & Rich Life Pvt.Ltd.</p>
                        <p className="mb-6 font-semibold">Dear {userData?.userName || 'Member'},</p>

                        <p className="mb-5 text-[#F5E6C8]/90 print:text-black leading-relaxed">
                            We are pleased to welcome you to Sanyukt Parivaar & Rich Life Pvt.Ltd..
                            Your registration has been successfully completed, and your membership profile has been created in our system.
                        </p>

                        <p className="mb-5 text-[#F5E6C8]/90 print:text-black leading-relaxed">
                            Your official Member ID is <span className="font-black text-[#C8A96A] print:text-black">{userData?.memberId || 'SPRL0000'}</span>.
                            Please keep this Member ID safe, as it will be required for login, account verification,
                            support requests, and future communication related to your account.
                        </p>

                        <p className="mb-5 text-[#F5E6C8]/90 print:text-black leading-relaxed">
                            We are confident that your association with our organization will be productive and rewarding.
                            We wish you success and a positive journey ahead with our team.
                        </p>

                        <p className="mb-10 text-[#F5E6C8]/90 print:text-black leading-relaxed">
                            If you need any assistance, please contact the support team through your account dashboard.
                        </p>

                        <div className="mt-12 border-t border-[#C8A96A]/20 print:border-black/20 pt-8">
                            <p className="text-[#C8A96A]/80 print:text-black font-semibold mb-8 uppercase tracking-widest text-[11px]">Yours sincerely,</p>
                            <p className="font-bold text-[#F5E6C8] print:text-black text-lg">Authorized Signatory</p>
                            <p className="text-[#C8A96A] print:text-black font-serif mt-1">Sanyukt Parivaar & Rich Life Pvt.Ltd.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeLetter;
