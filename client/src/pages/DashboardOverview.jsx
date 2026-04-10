import React, { useEffect, useMemo, useState } from 'react';
import {
    Activity,
    ArrowLeftRight,
    BadgeIndianRupee,
    Boxes,
    CircleDollarSign,
    CreditCard,
    Layers3,
    Network,
    ShoppingBag,
    UserRoundCheck,
    Users,
    Wallet,
} from 'lucide-react';
import api from '../api';
import ProfileBanner from '../components/ProfileBanner';

const firstNumber = (...values) => {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') {
            const numeric = Number(value);
            if (!Number.isNaN(numeric)) {
                return numeric;
            }
        }
    }
    return 0;
};

const toArray = (payload) => {
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
};

const formatMoney = (value) =>
    firstNumber(value).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatMetric = (value, digits = 2) =>
    firstNumber(value).toLocaleString('en-IN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });

const formatWhole = (value) =>
    firstNumber(value).toLocaleString('en-IN', {
        maximumFractionDigits: 0,
    });

const countPairs = (pv, unit) => Math.floor((firstNumber(pv) + 0.000001) / unit);

const tilePalette = {
    green: 'bg-[linear-gradient(135deg,#2fd36e_0%,#34c86b_100%)]',
    blue: 'bg-[linear-gradient(135deg,#2e9df0_0%,#59b2f3_100%)]',
    red: 'bg-[linear-gradient(135deg,#ef5b61_0%,#f67075_100%)]',
    orange: 'bg-[linear-gradient(135deg,#f7a145_0%,#ffb05d_100%)]',
};

const StatTile = ({ title, value, footer, icon: Icon, color }) => (
    <div className={`relative overflow-hidden rounded-[3px] border border-white/35 px-4 py-3 text-white shadow-[0_10px_26px_rgba(0,0,0,0.18)] ${color}`}>
        <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
                {Icon ? <Icon size={15} className="shrink-0 opacity-95" /> : null}
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">{title}</span>
            </div>
            <span className="text-[30px] font-black leading-none">{value}</span>
        </div>
        <div className="relative mt-2 text-right text-[9px] font-bold uppercase tracking-[0.16em] text-white/90">
            {footer}
        </div>
    </div>
);

const PairStrip = ({ title, leftValue, rightValue, color }) => (
    <div className={`rounded-[3px] border border-white/35 px-4 py-4 text-center text-white shadow-[0_10px_26px_rgba(0,0,0,0.14)] ${color}`}>
        <div className="text-[30px] font-black leading-none">
            {leftValue} / {rightValue}
        </div>
        <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white/90">{title}</div>
    </div>
);

const NoticePanel = ({ notices }) => (
    <div className="overflow-hidden rounded-[3px] border border-[#bfc4ca] bg-white shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
        <div className="bg-[#4f5c63] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
            Notifications
        </div>
        <div className="space-y-[1px] bg-[#d8dde1] p-[1px]">
            {notices.map((notice, index) => (
                <div key={`${notice}-${index}`} className="flex gap-3 bg-[#fbfbfb] px-3 py-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f2ff] text-[#3b9df1]">
                        <Activity size={12} />
                    </div>
                    <p className="text-[11px] leading-5 text-[#4b5563]">{notice}</p>
                </div>
            ))}
        </div>
    </div>
);

const DashboardOverview = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [matchingReport, setMatchingReport] = useState(null);
    const [networkCounts, setNetworkCounts] = useState({
        directs: 0,
        left: 0,
        right: 0,
        downline: 0,
        activeDirects: 0,
    });
    const [userData, setUserData] = useState(() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);

            try {
                const results = await Promise.allSettled([
                    api.get('/mlm/get-stats'),
                    api.get('/mlm/get-directs'),
                    api.get('/mlm/get-team-list/left'),
                    api.get('/mlm/get-team-list/right'),
                    api.get('/mlm/get-team-list/all'),
                    api.get('/mlm/matching-report/me'),
                ]);

                const statsPayload =
                    results[0].status === 'fulfilled' ? results[0].value.data || null : null;
                const directs = results[1].status === 'fulfilled' ? toArray(results[1].value.data) : [];
                const leftTeam = results[2].status === 'fulfilled' ? toArray(results[2].value.data) : [];
                const rightTeam = results[3].status === 'fulfilled' ? toArray(results[3].value.data) : [];
                const allTeam = results[4].status === 'fulfilled' ? toArray(results[4].value.data) : [];
                const matchingPayload =
                    results[5].status === 'fulfilled' ? results[5].value.data?.data || results[5].value.data || null : null;

                setStats(statsPayload);
                setMatchingReport(matchingPayload);
                setNetworkCounts({
                    directs: directs.length,
                    left: leftTeam.length,
                    right: rightTeam.length,
                    downline: allTeam.length || leftTeam.length + rightTeam.length,
                    activeDirects: directs.filter((member) => member?.activeStatus).length,
                });
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const viewModel = useMemo(() => {
        const availableLeftPV = firstNumber(matchingReport?.availableLeftPV);
        const availableRightPV = firstNumber(matchingReport?.availableRightPV);
        const totalLeftPV = firstNumber(matchingReport?.totalLeftPV, stats?.leftPV);
        const totalRightPV = firstNumber(matchingReport?.totalRightPV, stats?.rightPV);
        const leftBV = firstNumber(matchingReport?.leftBV, stats?.leftBV);
        const rightBV = firstNumber(matchingReport?.rightBV, stats?.rightBV);

        return {
            repurchaseWallet: firstNumber(userData?.repurchaseWalletBalance),
            eWallet: firstNumber(stats?.walletBalance, userData?.walletBalance),
            generationWallet: firstNumber(userData?.generationWalletBalance, stats?.totalGenerationIncome),
            productWallet: firstNumber(userData?.productWalletBalance),
            netCommission: firstNumber(stats?.totalGenerationIncome),
            paidWithdrawals: firstNumber(userData?.paidWithdrawals),
            downline: firstNumber(networkCounts.downline, stats?.totalDownline),
            leftCount: firstNumber(networkCounts.left, stats?.totalLeft),
            rightCount: firstNumber(networkCounts.right, stats?.totalRight),
            activeDirects: firstNumber(networkCounts.activeDirects),
            currentPvLeft: availableLeftPV,
            currentPvRight: availableRightPV,
            totalPvLeft: totalLeftPV,
            totalPvRight: totalRightPV,
            currentSilverLeft: countPairs(availableLeftPV, 0.25),
            currentSilverRight: countPairs(availableRightPV, 0.25),
            totalSilverLeft: countPairs(totalLeftPV, 0.25),
            totalSilverRight: countPairs(totalRightPV, 0.25),
            currentGoldLeft: countPairs(availableLeftPV, 0.5),
            currentGoldRight: countPairs(availableRightPV, 0.5),
            totalGoldLeft: countPairs(totalLeftPV, 0.5),
            totalGoldRight: countPairs(totalRightPV, 0.5),
            currentDiamondLeft: countPairs(availableLeftPV, 1),
            currentDiamondRight: countPairs(availableRightPV, 1),
            totalDiamondLeft: countPairs(totalLeftPV, 1),
            totalDiamondRight: countPairs(totalRightPV, 1),
            leftBV,
            rightBV,
            totalPurchases: firstNumber(stats?.productPurchases),
            totalOrders: firstNumber(stats?.totalOrders),
            matchedPV: firstNumber(matchingReport?.matchedPV, stats?.matchedPV),
        };
    }, [matchingReport, networkCounts, stats, userData]);

    const notices = useMemo(() => {
        const currentRank = stats?.rank || userData?.rank || 'Member';
        return [
            `Welcome ${userData?.userName || userData?.memberId || 'Member'}, your current rank is ${currentRank}.`,
            `Network summary: ${formatWhole(viewModel.downline)} total team members with ${formatWhole(viewModel.activeDirects)} active directs.`,
            `Current carry forward volume is ${formatMetric(viewModel.currentPvLeft)} PV on left and ${formatMetric(viewModel.currentPvRight)} PV on right.`,
            `Total matched PV recorded so far is ${formatMetric(viewModel.matchedPV)} with ${formatWhole(viewModel.totalOrders)} total orders.`,
        ];
    }, [stats?.rank, userData?.rank, userData?.userName, userData?.memberId, viewModel]);

    if (loading) {
        return (
            <div className="flex min-h-[68vh] items-center justify-center rounded-[3px] border border-[#d7d9dd] bg-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#d7d9dd] border-t-[#2e9df0]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#64748b]">
                        Loading Dashboard
                    </span>
                </div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <div className="mx-auto max-w-[1520px]">
            <div className="grid gap-4 xl:grid-cols-[420px,minmax(0,1fr)]">
                <div className="space-y-4">
                    <ProfileBanner userData={userData} stats={stats} matchingReport={matchingReport} />
                </div>

                <div className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <StatTile
                            title="Repurchase Wallet"
                            value={formatMoney(viewModel.repurchaseWallet)}
                            footer="Repurchase Wallet"
                            color={tilePalette.green}
                            icon={Wallet}
                        />
                        <StatTile
                            title="E-Wallet"
                            value={formatMoney(viewModel.eWallet)}
                            footer="E-Wallet"
                            color={tilePalette.blue}
                            icon={CreditCard}
                        />
                        <StatTile
                            title="Generation Wallet"
                            value={formatMoney(viewModel.generationWallet)}
                            footer="Generation Wallet"
                            color={tilePalette.red}
                            icon={CircleDollarSign}
                        />
                        <StatTile
                            title="Product Wallet"
                            value={formatMoney(viewModel.productWallet)}
                            footer="Product Wallet"
                            color={tilePalette.green}
                            icon={ShoppingBag}
                        />
                        <StatTile
                            title="Net Commission"
                            value={formatMoney(viewModel.netCommission)}
                            footer="Net Commission"
                            color={tilePalette.orange}
                            icon={BadgeIndianRupee}
                        />
                        <StatTile
                            title="Paid Withdrawals"
                            value={formatMoney(viewModel.paidWithdrawals)}
                            footer="Paid Withdrawals"
                            color={tilePalette.red}
                            icon={Wallet}
                        />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <StatTile
                            title="Downline"
                            value={formatWhole(viewModel.downline)}
                            footer="Downline"
                            color={tilePalette.blue}
                            icon={Network}
                        />
                        <StatTile
                            title="Left"
                            value={formatWhole(viewModel.leftCount)}
                            footer="Left"
                            color={tilePalette.green}
                            icon={Users}
                        />
                        <StatTile
                            title="Active Directs"
                            value={formatWhole(viewModel.activeDirects)}
                            footer="Active Directs"
                            color={tilePalette.red}
                            icon={UserRoundCheck}
                        />
                        <StatTile
                            title="Right"
                            value={formatWhole(viewModel.rightCount)}
                            footer="Right"
                            color={tilePalette.orange}
                            icon={Users}
                        />
                        <StatTile
                            title="Total Orders"
                            value={formatWhole(viewModel.totalOrders)}
                            footer="Orders"
                            color={tilePalette.blue}
                            icon={Boxes}
                        />
                        <StatTile
                            title="Left / Right BV"
                            value={`${formatWhole(viewModel.leftBV)} / ${formatWhole(viewModel.rightBV)}`}
                            footer="Current BV"
                            color={tilePalette.green}
                            icon={ArrowLeftRight}
                        />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <PairStrip
                            title="Today PV Left / Right"
                            leftValue={formatMetric(viewModel.currentPvLeft)}
                            rightValue={formatMetric(viewModel.currentPvRight)}
                            color={tilePalette.blue}
                        />
                        <PairStrip
                            title="Current Silver Left / Right"
                            leftValue={formatWhole(viewModel.currentSilverLeft)}
                            rightValue={formatWhole(viewModel.currentSilverRight)}
                            color={tilePalette.blue}
                        />
                        <PairStrip
                            title="Total PV Left / Right"
                            leftValue={formatMetric(viewModel.totalPvLeft)}
                            rightValue={formatMetric(viewModel.totalPvRight)}
                            color={tilePalette.green}
                        />
                        <PairStrip
                            title="Silver Total Left / Right"
                            leftValue={formatWhole(viewModel.totalSilverLeft)}
                            rightValue={formatWhole(viewModel.totalSilverRight)}
                            color={tilePalette.green}
                        />
                        <PairStrip
                            title="Current Gold Left / Right"
                            leftValue={formatWhole(viewModel.currentGoldLeft)}
                            rightValue={formatWhole(viewModel.currentGoldRight)}
                            color={tilePalette.orange}
                        />
                        <PairStrip
                            title="Total Gold Left / Right"
                            leftValue={formatWhole(viewModel.totalGoldLeft)}
                            rightValue={formatWhole(viewModel.totalGoldRight)}
                            color={tilePalette.red}
                        />
                        <PairStrip
                            title="Current Diamond Left / Right"
                            leftValue={formatWhole(viewModel.currentDiamondLeft)}
                            rightValue={formatWhole(viewModel.currentDiamondRight)}
                            color={tilePalette.blue}
                        />
                        <PairStrip
                            title="Total Diamond Left / Right"
                            leftValue={formatWhole(viewModel.totalDiamondLeft)}
                            rightValue={formatWhole(viewModel.totalDiamondRight)}
                            color={tilePalette.green}
                        />
                    </div>

                    <NoticePanel notices={notices} />

                    <div className="rounded-[3px] border border-[#cfd4da] bg-[#fafafa] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#64748b]">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <span>Sanyukt Member Dashboard</span>
                            <span className="text-[#0c8f37]">
                                Rank: {stats?.rank || userData?.rank || 'Member'} | Matched PV: {formatMetric(viewModel.matchedPV)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
