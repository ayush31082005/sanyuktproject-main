import React, { useMemo } from 'react';
import { User, CalendarDays, Award, Users, Copy, CheckCircle2, MessageCircle, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';

const infoRows = (userData, stats) => [
    {
        label: 'User ID',
        value: userData.memberId || 'N/A',
        icon: User,
        pill: stats?.rank || userData.rank || 'Member',
        pillColor: '#ef4444',
    },
    {
        label: 'Sponsor ID',
        value: userData.sponsorId || 'N/A',
        icon: Users,
    },
    {
        label: 'Joining Date',
        value: userData.joinDate
            ? new Date(userData.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'N/A',
        icon: CalendarDays,
    },
    {
        label: 'Rank Achievement',
        value: stats?.rank || userData.rank || 'Member',
        icon: Award,
    },
];

const ProfileBanner = ({ userData, stats }) => {
    const referralLinks = useMemo(() => {
        if (!userData?.memberId) {
            return { left: '', right: '' };
        }

        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const encodedMemberId = encodeURIComponent(userData.memberId);

        return {
            left: `${origin}/register?ref=${encodedMemberId}&pos=left`,
            right: `${origin}/register?ref=${encodedMemberId}&pos=right`,
        };
    }, [userData?.memberId]);

    if (!userData) return null;

    const copyToClipboard = async (text, successMessage) => {
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }

        toast.success(successMessage, {
            style: {
                borderRadius: '10px',
                background: '#0d7b33',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '700',
            },
        });
    };

    const shareOnWhatsApp = (position, link) => {
        if (!link) return;

        const message = `Join my Sanyukt Parivaar network using this ${position} referral link: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    };

    const rows = infoRows(userData, stats);

    return (
        <div className="overflow-hidden rounded border border-[#d3d3d3] bg-white shadow-sm">
            <div className="bg-[#2ecf73] px-4 py-4">
                <div className="mx-auto flex max-w-[280px] flex-col items-center text-center">
                    <div className="mb-4 flex h-[158px] w-[158px] items-center justify-center overflow-hidden rounded-full border-[6px] border-black bg-black shadow-lg">
                        <img
                            src={userData.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80'}
                            alt="Member"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <h2 className="text-[14px] font-black uppercase tracking-[0.08em] text-white">
                        {userData.userName || 'Member Name'}
                    </h2>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                        {stats?.rank || userData.rank || 'Verified Member'}
                    </p>
                </div>
            </div>

            <div className="space-y-[1px] bg-[#dfdfdf]">
                {rows.map((row) => {
                    const Icon = row.icon;

                    return (
                        <div key={row.label} className="flex items-center gap-3 bg-white px-3 py-2.5">
                            <Icon size={14} className="shrink-0 text-[#6b7280]" />
                            <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                                    {row.label}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="max-w-[130px] truncate text-right text-[11px] font-semibold text-[#111827]">
                                    {row.value}
                                </span>
                                {row.pill && (
                                    <span
                                        className="rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-white"
                                        style={{ backgroundColor: row.pillColor || '#ef4444' }}
                                    >
                                        {row.pill}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-3 px-3 py-3">
                <div className="rounded border border-[#d7d7d7] bg-[#f7f7f7] px-3 py-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#6b7280]">
                        <Link2 size={13} />
                        My Referral Links
                    </div>

                    <div className="mt-3 space-y-2">
                        <div className="rounded border border-[#f1b2b2] bg-[#fff5f5] p-2">
                            <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#ef4444]">Left Link</div>
                            <div className="mt-1 break-all text-[11px] font-semibold text-[#111827]">{referralLinks.left || 'Referral link unavailable'}</div>
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(referralLinks.left, 'Left referral link copied')}
                                    className="inline-flex items-center gap-1 rounded border border-[#f1b2b2] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#111827] transition-colors hover:bg-[#fef2f2]"
                                >
                                    <Copy size={12} />
                                    Copy
                                </button>
                                <button
                                    onClick={() => shareOnWhatsApp('left', referralLinks.left)}
                                    className="inline-flex items-center gap-1 rounded border border-[#f1b2b2] bg-[#ef4444] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#dc2626]"
                                >
                                    <MessageCircle size={12} />
                                    WhatsApp
                                </button>
                            </div>
                        </div>

                        <div className="rounded border border-[#7fd79f] bg-[#f0fff4] p-2">
                            <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[#0d7b33]">Right Link</div>
                            <div className="mt-1 break-all text-[11px] font-semibold text-[#111827]">{referralLinks.right || 'Referral link unavailable'}</div>
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(referralLinks.right, 'Right referral link copied')}
                                    className="inline-flex items-center gap-1 rounded border border-[#7fd79f] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#111827] transition-colors hover:bg-[#f0fdf4]"
                                >
                                    <Copy size={12} />
                                    Copy
                                </button>
                                <button
                                    onClick={() => shareOnWhatsApp('right', referralLinks.right)}
                                    className="inline-flex items-center gap-1 rounded border border-[#7fd79f] bg-[#33c35f] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#26ad50]"
                                >
                                    <MessageCircle size={12} />
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded border border-[#d7d7d7] bg-[#f7f7f7] px-3 py-2">
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6b7280]">
                            Member ID
                        </div>
                        <div className="text-[13px] font-black text-[#111827]">{userData.memberId || 'N/A'}</div>
                    </div>
                    <button
                        onClick={() => copyToClipboard(userData.memberId, 'Member ID copied')}
                        className="inline-flex items-center gap-1 rounded border border-[#d7d7d7] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#111827] transition-colors hover:bg-[#f3f4f6]"
                    >
                        <Copy size={12} />
                        Copy
                    </button>
                </div>

                <div className="flex items-center gap-2 rounded border border-[#bfe5cc] bg-[#edf9f1] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0d7b33]">
                    <CheckCircle2 size={14} />
                    Profile verified and active
                </div>
            </div>
        </div>
    );
};

export default ProfileBanner;
