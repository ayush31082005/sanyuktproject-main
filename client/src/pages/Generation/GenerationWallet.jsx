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
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            title: 'Transaction Report',
            desc: 'All generation income credits and pool transfers',
            icon: History,
            path: '/my-account/generation/all-transactions',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'Deduction Report',
            desc: 'TDS and Admin charges on generation income',
            icon: FileText,
            path: '/my-account/generation/deduction-report',
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            title: 'Withdrawal History',
            desc: 'Track your generation wallet payouts',
            icon: Wallet,
            path: '/my-account/generation/withdrawal-history',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            title: 'Monthly Closing',
            desc: 'View summarized monthly earnings',
            icon: PieChart,
            path: '/my-account/generation/monthly-closing',
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-[#0A7A2F] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/my-account')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Generation Wallet</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your team repurchase earnings</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-[#0A7A2F] to-[#086628] rounded-3xl p-8 mb-8 text-white shadow-xl shadow-green-900/20 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-green-100 font-bold uppercase tracking-widest text-xs mb-2">
                        Available Generation Balance
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        {'\u20B9'}
                        {Number(stats?.generationWalletBalance || 0).toFixed(2)}
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/my-account/generation/withdraw')}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            Withdraw Funds <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-10 -mb-10 blur-2xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(report.path)}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`${report.bg} ${report.color} p-3 rounded-xl`}>
                                    <report.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-gray-800">{report.title}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{report.desc}</p>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 p-2 rounded-lg">
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenerationWallet;
