import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Wallet,
    Users,
    ArrowRightLeft,
    ShoppingBag,
    BarChart3,
    Network,
    Activity,
    Package,
    Trophy,
    CreditCard,
    CircleDollarSign,
} from 'lucide-react';
import api from '../api';
import ProfileBanner from '../components/ProfileBanner';

const firstNumber = (...values) => {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') {
            return Number(value);
        }
    }
    return 0;
};

const formatMoney = (value) => firstNumber(value).toFixed(2);

const formatPlain = (value) => firstNumber(value).toLocaleString('en-IN', {
    maximumFractionDigits: 3,
});

const tileThemes = {
    green: 'bg-[#37c96d]',
    blue: 'bg-[#3ea2ef]',
    red: 'bg-[#ef6166]',
    orange: 'bg-[#f6a34e]',
};

const TileCard = ({ title, value, theme, icon: Icon, footer }) => (
    <div className={`rounded border border-white/35 px-4 py-3 text-white shadow-sm ${theme}`}>
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={16} className="mt-0.5 shrink-0 opacity-95" />}
                <span className="text-[11px] font-bold uppercase tracking-[0.14em]">{title}</span>
            </div>
            <span className="text-[28px] font-black leading-none">{value}</span>
        </div>
        {footer && (
            <div className="mt-2 text-right text-[9px] font-semibold uppercase tracking-[0.14em] text-white/90">
                {footer}
            </div>
        )}
    </div>
);

const PairCard = ({ title, leftLabel, rightLabel, leftValue, rightValue, theme }) => (
    <div className={`rounded border border-white/35 px-4 py-3 text-white shadow-sm ${theme}`}>
        <div className="text-center">
            <div className="text-[28px] font-black leading-none">
                {leftValue} / {rightValue}
            </div>
            <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
                {title}
            </div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/80">
                {leftLabel} / {rightLabel}
            </div>
        </div>
    </div>
);

const SectionPanel = ({ title, children }) => (
    <div className="overflow-hidden rounded border border-[#d5d5d5] bg-white shadow-sm">
        <div className="border-b border-[#d5d5d5] bg-[#f5f5f5] px-4 py-3">
            <h3 className="text-[12px] font-black uppercase tracking-[0.16em] text-[#374151]">{title}</h3>
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const recentActivities = [
    'Welcome to the dashboard. Track wallet balances, network growth and daily movement from one place.',
    'Use Product Order to place first purchase and repurchase orders from available wallets.',
    'Matching, repurchase, wallet and generation reports can be checked from the sidebar sections.',
];

const DashboardOverview = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        let user = null;

        try {
            const userStr = localStorage.getItem('user');
            user = userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
        }

        setUserData(user);

        const fetchStats = async () => {
            try {
                const res = await api.get('/mlm/get-stats');
                setStats(res.data || null);
            } catch (error) {
                console.error('Error fetching MLM stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const dashboardValues = useMemo(() => {
        const eWallet = firstNumber(stats?.walletBalance, userData?.walletBalance);
        const productWallet = firstNumber(userData?.productWalletBalance);
        const repurchaseWallet = firstNumber(userData?.repurchaseWalletBalance);
        const generationWallet = firstNumber(userData?.generationWalletBalance, stats?.totalGenerationIncome);
        const netCommission = firstNumber(stats?.totalGenerationIncome);
        const totalPurchases = firstNumber(stats?.productPurchases);
        const totalDownline = firstNumber(stats?.totalDownline);
        const leftCount = firstNumber(stats?.totalLeft);
        const rightCount = firstNumber(stats?.totalRight);
        const directCount = firstNumber(stats?.directCount);
        const pv = firstNumber(stats?.pv);
        const bv = firstNumber(stats?.bv);

        return {
            eWallet,
            productWallet,
            repurchaseWallet,
            generationWallet,
            netCommission,
            totalPurchases,
            totalDownline,
            leftCount,
            rightCount,
            directCount,
            pv,
            bv,
            currentSilverLeft: firstNumber(stats?.currentSilverLeft),
            currentSilverRight: firstNumber(stats?.currentSilverRight),
            totalSilverLeft: firstNumber(stats?.totalSilverLeft),
            totalSilverRight: firstNumber(stats?.totalSilverRight),
            currentGoldLeft: firstNumber(stats?.currentGoldLeft),
            currentGoldRight: firstNumber(stats?.currentGoldRight),
            totalGoldLeft: firstNumber(stats?.totalGoldLeft),
            totalGoldRight: firstNumber(stats?.totalGoldRight),
            currentDiamondLeft: firstNumber(stats?.currentDiamondLeft),
            currentDiamondRight: firstNumber(stats?.currentDiamondRight),
            totalDiamondLeft: firstNumber(stats?.totalDiamondLeft),
            totalDiamondRight: firstNumber(stats?.totalDiamondRight),
            pvLeft: firstNumber(stats?.pvLeft),
            pvRight: firstNumber(stats?.pvRight),
            totalPvLeft: firstNumber(stats?.totalPvLeft),
            totalPvRight: firstNumber(stats?.totalPvRight),
        };
    }, [stats, userData]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center rounded border border-[#d5d5d5] bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#0c8f37]"></div>
            </div>
        );
    }

    if (!userData) return null;

    return (
        <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-4 xl:grid-cols-[420px,minmax(0,1fr)]">
                <div className="space-y-4">
                    <ProfileBanner userData={userData} stats={stats} />

                    <SectionPanel title="Member Snapshot">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <div className="flex items-center justify-between rounded border border-[#d6d6d6] bg-[#fafafa] px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag size={15} className="text-[#0c8f37]" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#4b5563]">
                                        Product Purchase
                                    </span>
                                </div>
                                <span className="text-[16px] font-black text-[#111827]">Rs {formatMoney(dashboardValues.totalPurchases)}</span>
                            </div>

                            <div className="flex items-center justify-between rounded border border-[#d6d6d6] bg-[#fafafa] px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <Wallet size={15} className="text-[#3ea2ef]" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#4b5563]">
                                        E-Wallet
                                    </span>
                                </div>
                                <span className="text-[16px] font-black text-[#111827]">Rs {formatMoney(dashboardValues.eWallet)}</span>
                            </div>

                            <div className="flex items-center justify-between rounded border border-[#d6d6d6] bg-[#fafafa] px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <BarChart3 size={15} className="text-[#f6a34e]" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#4b5563]">
                                        Total PV / BV
                                    </span>
                                </div>
                                <span className="text-[16px] font-black text-[#111827]">
                                    {formatPlain(dashboardValues.pv)} / {formatPlain(dashboardValues.bv)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    onClick={() => navigate('/my-account/orders/first')}
                                    className="rounded border border-[#f1b2b2] bg-[#ef4444] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#dc2626]"
                                >
                                    First Purchase
                                </button>
                                <button
                                    onClick={() => navigate('/my-account/downline/directs')}
                                    className="rounded border border-[#8dd9a6] bg-[#33c35f] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#26ad50]"
                                >
                                    My Downline
                                </button>
                            </div>
                        </div>
                    </SectionPanel>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-3 lg:grid-cols-3">
                        <TileCard
                            title="Repurchase Wallet"
                            value={formatMoney(dashboardValues.repurchaseWallet)}
                            footer="Repurchase Wallet"
                            theme={tileThemes.green}
                            icon={Wallet}
                        />
                        <TileCard
                            title="E-Wallet"
                            value={formatMoney(dashboardValues.eWallet)}
                            footer="E-Wallet"
                            theme={tileThemes.blue}
                            icon={CreditCard}
                        />
                        <TileCard
                            title="Generation Wallet"
                            value={formatMoney(dashboardValues.generationWallet)}
                            footer="Generation Wallet"
                            theme={tileThemes.red}
                            icon={CircleDollarSign}
                        />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-3">
                        <TileCard
                            title="Product Wallet"
                            value={formatMoney(dashboardValues.productWallet)}
                            footer="Product Wallet"
                            theme={tileThemes.green}
                            icon={Package}
                        />
                        <TileCard
                            title="Net Commission"
                            value={formatMoney(dashboardValues.netCommission)}
                            footer="Net Commission"
                            theme={tileThemes.orange}
                            icon={ArrowRightLeft}
                        />
                        <TileCard
                            title="Paid Withdrawals"
                            value={formatMoney(userData?.paidWithdrawals || 0)}
                            footer="Paid Withdrawals"
                            theme={tileThemes.red}
                            icon={Wallet}
                        />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-3">
                        <TileCard
                            title="Downline"
                            value={String(dashboardValues.totalDownline)}
                            footer="Downline"
                            theme={tileThemes.blue}
                            icon={Network}
                        />
                        <TileCard
                            title="Left"
                            value={String(dashboardValues.leftCount)}
                            footer="Left"
                            theme={tileThemes.green}
                            icon={Users}
                        />
                        <TileCard
                            title="Right"
                            value={String(dashboardValues.rightCount || dashboardValues.directCount)}
                            footer="Right"
                            theme={tileThemes.orange}
                            icon={Users}
                        />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                        <PairCard
                            title="Today PV Left / Right"
                            leftLabel="Today PV Left"
                            rightLabel="Right"
                            leftValue={formatPlain(dashboardValues.pvLeft)}
                            rightValue={formatPlain(dashboardValues.pvRight)}
                            theme={tileThemes.blue}
                        />
                        <PairCard
                            title="Current Silver Left / Right"
                            leftLabel="Current Silver Left"
                            rightLabel="Right"
                            leftValue={formatPlain(dashboardValues.currentSilverLeft)}
                            rightValue={formatPlain(dashboardValues.currentSilverRight)}
                            theme={tileThemes.blue}
                        />
                        <PairCard
                            title="Total PV Left / Right"
                            leftLabel="Total PV Left"
                            rightLabel="Right"
                            leftValue={formatPlain(dashboardValues.totalPvLeft)}
                            rightValue={formatPlain(dashboardValues.totalPvRight)}
                            theme={tileThemes.green}
                        />
                        <PairCard
                            title="Silver Total Left / Right"
                            leftLabel="Silver Total Left"
                            rightLabel="Right"
                            leftValue={formatPlain(dashboardValues.totalSilverLeft)}
                            rightValue={formatPlain(dashboardValues.totalSilverRight)}
                            theme={tileThemes.green}
                        />
                        <PairCard
                            title="Current Gold Left / Right"
                            leftLabel="Current Gold Left"
                            rightLabel="Right"
                            leftValue={formatPlain(dashboardValues.currentGoldLeft)}
                            rightValue={formatPlain(dashboardValues.currentGoldRight)}
                            theme={tileThemes.orange}
                        />
                        <PairCard
                            title="Total Gold Left / Right"
                            leftLabel="Total Gold Left"
                            rightLabel="Right"
                            leftValue={formatPlain(dashboardValues.totalGoldLeft)}
                            rightValue={formatPlain(dashboardValues.totalGoldRight)}
                            theme={tileThemes.red}
                        />
                        <PairCard
                            title="Current Diamond Left / Right"
                            leftLabel="Current Diamond Left"
                            rightLabel="Right"
                            leftValue={formatPlain(dashboardValues.currentDiamondLeft)}
                            rightValue={formatPlain(dashboardValues.currentDiamondRight)}
                            theme={tileThemes.blue}
                        />
                        <PairCard
                            title="Total Diamond Left / Right"
                            leftLabel="Total Diamond Left"
                            rightLabel="Right"
                            leftValue={formatPlain(dashboardValues.totalDiamondLeft)}
                            rightValue={formatPlain(dashboardValues.totalDiamondRight)}
                            theme={tileThemes.green}
                        />
                    </div>

                    <SectionPanel title="Notices">
                        <div className="space-y-2">
                            {recentActivities.map((item, index) => (
                                <div
                                    key={`${item}-${index}`}
                                    className="flex items-start gap-3 rounded border border-[#dcdcdc] bg-[#fafafa] px-3 py-3"
                                >
                                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e7f1ff] text-[#3ea2ef]">
                                        <Activity size={13} />
                                    </div>
                                    <p className="text-[11px] leading-5 text-[#4b5563]">{item}</p>
                                </div>
                            ))}
                        </div>
                    </SectionPanel>

                    <div className="rounded border border-[#d5d5d5] bg-white px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <span>Sanyukt Member Dashboard</span>
                            <span className="text-[#0c8f37]">Rank: {stats?.rank || userData.rank || 'Member'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
