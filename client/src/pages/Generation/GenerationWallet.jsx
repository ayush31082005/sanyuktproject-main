import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    FileText,
    History,
    PieChart,
    Wallet,
} from 'lucide-react';
import api from '../../api';

const GenerationWallet = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenStats = async () => {
            try {
                const res = await api.get('/mlm/get-stats');
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching generation stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenStats();
    }, []);

    const reports = [
        {
            title: 'Withdraw Funds',
            desc: 'Request payout from generation wallet balance',
            icon: Wallet,
            path: '/my-account/generation/withdraw',
        },
        {
            title: 'Transaction Report',
            desc: 'All generation income credits and pool transfers',
            icon: History,
            path: '/my-account/generation/all-transactions',
        },
        {
            title: 'Deduction Report',
            desc: 'TDS and admin charges on generation income',
            icon: FileText,
            path: '/my-account/generation/deduction-report',
        },
        {
            title: 'Withdrawal History',
            desc: 'Track your generation wallet payouts',
            icon: Wallet,
            path: '/my-account/generation/withdrawal-history',
        },
        {
            title: 'Monthly Closing',
            desc: 'View summarized monthly earnings',
            icon: PieChart,
            path: '/my-account/generation/monthly-closing',
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-[#0D0D0D]">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C8A96A] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#0D0D0D] px-2 py-4 text-white sm:px-3 sm:py-6 md:px-6">
            <div className="mx-auto max-w-[1280px]">
                <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center md:mb-6">
                    <button
                        onClick={() => navigate('/my-account')}
                        className="rounded-[2px] border border-[#C8A96A]/20 bg-[#171717] p-2 text-[#C8A96A] transition hover:bg-[#1F1F1F]"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="break-words text-[1.45rem] font-black leading-tight text-[#F5E6C8] sm:text-[1.7rem] md:text-[2.05rem]">
                            Generation Wallet
                        </h1>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-[#C8A96A]/55">
                            Manage your team repurchase earnings
                        </p>
                    </div>
                </div>

                <div className="relative mb-4 overflow-hidden rounded-[2px] border border-[#C8A96A]/20 bg-[linear-gradient(135deg,#1d3d1f_0%,#0A7A2F_40%,#2fb15f_100%)] px-4 py-5 shadow-[0_14px_40px_rgba(0,0,0,0.35)] sm:px-6 sm:py-7 md:mb-6">
                    <div className="relative z-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f4f9ef]/70">
                            Available Generation Balance
                        </p>
                        <h2 className="mt-3 break-all text-[2rem] font-black leading-none text-white sm:text-[3.25rem]">
                            {'\u20B9'}{Number(stats?.generationWalletBalance || 0).toFixed(2)}
                        </h2>
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={() => navigate('/my-account/generation/withdraw')}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#C8A96A] px-5 py-3 text-[12px] font-black uppercase tracking-[0.14em] text-[#0D0D0D] transition hover:brightness-105 sm:w-auto"
                            >
                                Withdraw Funds
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="absolute right-[-60px] top-[-70px] h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-[-50px] left-[-40px] h-36 w-36 rounded-full bg-black/10 blur-2xl" />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                    {reports.map((report) => (
                        <button
                            key={report.path}
                            onClick={() => navigate(report.path)}
                            className="group rounded-[2px] border border-[#C8A96A]/15 bg-[#171717] p-4 text-left shadow-[0_14px_40px_rgba(0,0,0,0.25)] transition hover:border-[#C8A96A]/30 hover:bg-[#1B1B1B] sm:p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="rounded-[2px] bg-[#C8A96A]/10 p-3 text-[#C8A96A]">
                                        <report.icon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="break-words text-base font-black text-[#F5E6C8] sm:text-lg">{report.title}</h3>
                                        <p className="mt-1 break-words text-sm text-[#F5E6C8]/55">{report.desc}</p>
                                    </div>
                                </div>
                                <div className="rounded-[2px] bg-[#111111] p-2 text-[#C8A96A]/45 transition group-hover:text-[#C8A96A]">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GenerationWallet;
