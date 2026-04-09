import React, { useState } from 'react';
import { Download, CreditCard, Shield, CheckCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const IdCard = () => {
    const [userData] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    });
    const [downloadLoading, setDownloadLoading] = useState(false);

    const handleDownload = async () => {
        if (downloadLoading) return;

        const memberId = userData?.memberId || 'SPRL0000';
        setDownloadLoading(true);

        try {
            const initialsValue = (userData?.userName || 'U').charAt(0).toUpperCase();
            const joinedDate = userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString('en-GB')
                : '-';
            const statusText = userData?.activeStatus ? 'Active Member' : 'Registered';
            const cardContent = document.createElement('div');

            cardContent.innerHTML = `
                <div style="padding: 28px; background: #ffffff; width: 420px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="border: 1px solid #d1d5db; border-radius: 12px; overflow: hidden; background: #ffffff; box-shadow: 0 10px 24px rgba(0,0,0,0.08);">
                        <div style="background: #16a34a; padding: 14px 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <p style="margin: 0; font-size: 12px; font-weight: 500; color: #dcfce7;">Sanyukt Parivaar</p>
                                    <h2 style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #ffffff; letter-spacing: 0.04em;">MEMBERSHIP CARD</h2>
                                </div>
                                <div style="font-size: 18px; color: #ffffff;">&#128737;</div>
                            </div>
                        </div>

                        <div style="padding: 20px;">
                            <div style="display: flex; gap: 16px; align-items: flex-start;">
                                <div style="flex-shrink: 0;">
                                    ${
                                        userData?.profileImage
                                            ? `<img src="${userData.profileImage}" alt="${userData?.userName || 'Member'}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;" />`
                                            : `<div style="width: 80px; height: 80px; border-radius: 8px; background: #f3f4f6; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #6b7280;">${initialsValue}</div>`
                                    }
                                </div>
                                <div style="flex: 1; min-width: 0;">
                                    <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #111827;">${userData?.userName || 'Member Name'}</h3>
                                    <p style="margin: 6px 0 0; font-size: 13px; color: #374151;">${userData?.email || 'email@example.com'}</p>
                                    <div style="margin-top: 10px; display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; background: #f0fdf4; border: 1px solid #bbf7d0; font-size: 12px; font-weight: 600; color: #15803d;">
                                        ${statusText}
                                    </div>
                                </div>
                            </div>

                            <div style="margin-top: 18px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
                                <div style="padding-bottom: 8px; border-bottom: 1px solid #f3f4f6;">
                                    <p style="margin: 0; font-size: 12px; color: #6b7280;">Member ID</p>
                                    <p style="margin: 6px 0 0; font-size: 15px; font-weight: 700; color: #111827;">${userData?.memberId || 'SPRL0000'}</p>
                                </div>
                                <div style="padding-bottom: 8px; border-bottom: 1px solid #f3f4f6;">
                                    <p style="margin: 0; font-size: 12px; color: #6b7280;">Sponsor ID</p>
                                    <p style="margin: 6px 0 0; font-size: 15px; font-weight: 700; color: #111827;">${userData?.sponsorId || '-'}</p>
                                </div>
                                <div style="padding-bottom: 8px; border-bottom: 1px solid #f3f4f6;">
                                    <p style="margin: 0; font-size: 12px; color: #6b7280;">Mobile</p>
                                    <p style="margin: 6px 0 0; font-size: 15px; font-weight: 700; color: #111827;">${userData?.mobile || '-'}</p>
                                </div>
                                <div style="padding-bottom: 8px; border-bottom: 1px solid #f3f4f6;">
                                    <p style="margin: 0; font-size: 12px; color: #6b7280;">Joined</p>
                                    <p style="margin: 6px 0 0; font-size: 15px; font-weight: 700; color: #111827;">${joinedDate}</p>
                                </div>
                            </div>

                            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9ca3af;">
                                    <span>ID: ${userData?.memberId?.slice(-4) || '0000'}</span>
                                </div>
                                <span style="font-size: 12px; color: #9ca3af;">Valid for official use</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const options = {
                margin: [0.35, 0.35, 0.35, 0.35],
                filename: `ID_Card_${memberId}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 3,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                },
                jsPDF: {
                    unit: 'in',
                    format: 'a4',
                    orientation: 'portrait',
                },
                pagebreak: { mode: ['avoid-all'] },
            };

            await html2pdf().set(options).from(cardContent).save();
        } catch (error) {
            console.error('Error downloading ID card:', error);
        } finally {
            setDownloadLoading(false);
        }
    };
    const initials = (userData?.userName || 'U').charAt(0).toUpperCase();

    return (
        <div className="mx-auto max-w-5xl bg-gray-50 px-4 py-6 min-h-screen print:bg-white print:max-w-none print:px-0 print:py-0">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between print:hidden">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">My Folder</p>
                    <h1 className="mt-1 text-2xl md:text-3xl font-bold text-gray-800">ID Card</h1>
                </div>
                <button
                    onClick={handleDownload}
                    disabled={downloadLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 active:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    <Download size={18} />
                    {downloadLoading ? 'Preparing PDF...' : 'Download PDF'}
                </button>
            </div>

            {/* ID Card - Professional Design */}
            <div className="mx-auto flex max-w-md justify-center bg-white p-4 print:max-w-[420px]">
                <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden print:shadow-none print:border-black/30">
                    {/* Card Header - Simple Green Bar */}
                    <div className="bg-green-600 px-5 py-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-green-100">Sanyukt Parivaar</p>
                                <h2 className="text-sm font-bold text-white flex items-center gap-1">
                                    MEMBERSHIP CARD
                                    {userData?.activeStatus && <CheckCircle className="w-4 h-4 text-white fill-green-600" />}
                                </h2>
                            </div>
                            <div className="text-white opacity-80">
                                <Shield className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                        {/* Profile Section */}
                        <div className="flex items-start gap-4">
                            {/* Photo */}
                            <div className="flex-shrink-0">
                                {userData?.profileImage ? (
                                    <img
                                        src={userData.profileImage}
                                        alt={userData?.userName || 'Member'}
                                        className="w-20 h-20 rounded border border-gray-200 object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                                        <span className="text-xl font-medium text-gray-500">{initials}</span>
                                    </div>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 truncate">
                                    {userData?.userName || 'Member Name'}
                                </h3>
                                <p className="text-[13px] text-gray-700 mt-0.5 truncate">
                                    {userData?.email || 'email@example.com'}
                                </p>
                                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                    {userData?.activeStatus ? 'Active Member' : 'Registered'}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-[12px] text-gray-700">Member ID</p>
                                <p className="text-[15px] font-semibold text-gray-900 mt-0.5">{userData?.memberId || 'SPRL0000'}</p>
                            </div>
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-[12px] text-gray-700">Sponsor ID</p>
                                <p className="text-[15px] font-semibold text-gray-900 mt-0.5">{userData?.sponsorId || '-'}</p>
                            </div>
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-[12px] text-gray-700">Mobile</p>
                                <p className="text-[15px] font-semibold text-gray-900 mt-0.5">{userData?.mobile || '-'}</p>
                            </div>
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-[12px] text-gray-700">Joined</p>
                                <p className="text-[15px] font-semibold text-gray-900 mt-0.5">
                                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-GB') : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <CreditCard className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-400">ID: {userData?.memberId?.slice(-4) || '0000'}</span>
                                </div>
                                <span className="text-xs text-gray-400">Valid for official use</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body {
                        background: white;
                    }
                    .print\\:hidden {
                        display: none;
                    }
                    * {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>
        </div>
    );
};


export default IdCard;
