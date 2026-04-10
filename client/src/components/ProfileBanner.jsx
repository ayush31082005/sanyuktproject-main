import React, { useMemo } from 'react';
import {
    Award,
    CalendarDays,
    CheckCircle2,
    Copy,
    Link2,
    MessageCircle,
    Package2,
    User,
    Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

const profileFallback =
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80';

const copyToClipboard = async (text, message) => {
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

    toast.success(message, {
        style: {
            borderRadius: '10px',
            background: '#0d7b33',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '700',
        },
    });
};

const infoRows = (userData, stats) => [
    {
        label: 'User ID',
        value: userData?.memberId || 'N/A',
        icon: User,
        badge: stats?.rank || userData?.rank || 'Member',
        badgeClass: 'bg-[#ef4444] text-white',
    },
    {
        label: 'Sponsor ID',
        value: userData?.sponsorId || 'N/A',
        icon: Users,
    },
    {
        label: 'Joining Date',
        value: userData?.joinDate
            ? new Date(userData.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'N/A',
        icon: CalendarDays,
    },
    {
        label: 'Package',
        value: userData?.packageType && userData.packageType !== 'none' ? userData.packageType : 'Not Active',
        icon: Package2,
    },
    {
        label: 'Rank Achievement',
        value: stats?.rank || userData?.rank || 'Member',
        icon: Award,
    },
];

const InfoRow = ({ row }) => {
    const Icon = row.icon;

    return (
        <div className="flex items-center gap-3 bg-white px-3 py-2">
            <Icon size={13} className="shrink-0 text-[#64748b]" />
            <div className="min-w-0 flex-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#64748b]">
                {row.label}
            </div>
            <div className="flex items-center gap-2">
                <span className="max-w-[140px] truncate text-right text-[10px] font-bold uppercase tracking-[0.08em] text-[#111827]">
                    {row.value}
                </span>
                {row.badge ? (
                    <span className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] ${row.badgeClass || ''}`}>
                        {row.badge}
                    </span>
                ) : null}
            </div>
        </div>
    );
};

const ProfileBanner = ({ userData, stats, matchingReport }) => {
    const referralLinks = useMemo(() => {
        if (!userData?.memberId) {
            return { left: '', right: '' };
        }

        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const encodedId = encodeURIComponent(userData.memberId);

        return {
            left: `${origin}/register?ref=${encodedId}&pos=left`,
            right: `${origin}/register?ref=${encodedId}&pos=right`,
        };
    }, [userData?.memberId]);

    if (!userData) {
        return null;
    }

    const memberRows = infoRows(userData, stats);
    const shareOnWhatsApp = (position, link) => {
        if (!link) return;

        const message = `Join my Sanyukt Parivaar network using this ${position} link: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="overflow-hidden rounded-[3px] border border-[#cfd4da] bg-white shadow-[0_14px_36px_rgba(0,0,0,0.12)]">
            <div className="bg-[linear-gradient(180deg,#42d47d_0%,#38c66f_100%)] px-4 py-5">
                <div className="mx-auto flex max-w-[280px] flex-col items-center text-center">
                    <div className="mb-4 flex h-[162px] w-[162px] items-center justify-center overflow-hidden rounded-full border-[6px] border-black bg-black shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
                        <img
                            src={userData.profileImage || profileFallback}
                            alt="Member"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="text-[13px] font-black uppercase tracking-[0.12em] text-white">
                        {userData.userName || 'Member'}
                    </div>
                    <div className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/95">
                        {stats?.rank || userData.rank || 'Verified Member'}
                    </div>
                    <div className="mt-2 text-[8px] font-bold uppercase tracking-[0.2em] text-white/85">
                        Member Home Panel
                    </div>
                </div>
            </div>

            <div className="space-y-[1px] bg-[#d7dce1]">
                {memberRows.map((row) => (
                    <InfoRow key={row.label} row={row} />
                ))}
            </div>

            <div className="space-y-3 border-t border-[#d7dce1] bg-[#fbfbfb] p-3">
                <div className="rounded-[3px] border border-[#d7dce1] bg-white p-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#475569]">
                        <Link2 size={13} />
                        Quick Member Links
                    </div>
                    <div className="mt-3 grid gap-2">
                        <button
                            type="button"
                            onClick={() => shareOnWhatsApp('left', referralLinks.left)}
                            className="rounded-[2px] border border-[#f1b2b2] bg-[#ef4444] px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#dc2626]"
                        >
                            Show WhatsApp Link Left
                        </button>
                        <button
                            type="button"
                            onClick={() => shareOnWhatsApp('right', referralLinks.right)}
                            className="rounded-[2px] border border-[#8fd8a6] bg-[#32c661] px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#27b152]"
                        >
                            Show WhatsApp Link Right
                        </button>
                    </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <button
                        type="button"
                        onClick={() => copyToClipboard(userData.memberId || '', 'Member ID copied')}
                        className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#d7dce1] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#334155] transition-colors hover:bg-[#f8fafc]"
                    >
                        <Copy size={12} />
                        Copy Member ID
                    </button>
                    <button
                        type="button"
                        onClick={() => copyToClipboard(referralLinks.left || '', 'Left referral link copied')}
                        className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#d7dce1] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#334155] transition-colors hover:bg-[#f8fafc]"
                    >
                        <MessageCircle size={12} />
                        Copy Left Link
                    </button>
                    <button
                        type="button"
                        onClick={() => copyToClipboard(referralLinks.right || '', 'Right referral link copied')}
                        className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#d7dce1] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#334155] transition-colors hover:bg-[#f8fafc]"
                    >
                        <MessageCircle size={12} />
                        Copy Right Link
                    </button>
                </div>

                <div className="rounded-[3px] border border-[#bfe5cc] bg-[#edf9f1] px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#0d7b33]">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} />
                        Profile verified and active
                    </div>
                    {matchingReport ? (
                        <div className="mt-2 border-t border-[#bfe5cc] pt-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#166534]">
                            Carry Forward PV: {Number(matchingReport.availableLeftPV || 0).toFixed(2)} / {Number(matchingReport.availableRightPV || 0).toFixed(2)}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ProfileBanner;
