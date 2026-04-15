import React, { useEffect, useMemo, useState } from 'react';
import {
    Bell,
    CircleDollarSign,
    CreditCard,
    IndianRupee,
    Network,
    ShoppingBag,
    UserCheck,
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

const formatSimplePair = (left, right, digits = 2) => {
    const formatter = (value) =>
        firstNumber(value).toLocaleString('en-IN', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        });

    return `${formatter(left)} / ${formatter(right)}`;
};

const countPairs = (pv, unit) => Math.floor((firstNumber(pv) + 0.000001) / unit);

const boxThemes = {
    mint: {
        surface: 'bg-[linear-gradient(135deg,#4f7c61_0%,#9ee3b8_55%,#dff8e7_100%)]',
        text: 'text-[#0d0d0d]',
        subtext: 'text-[#0d0d0d]/80',
    },
    emerald: {
        surface: 'bg-[linear-gradient(135deg,#295e40_0%,#49c87b_52%,#c6f3d6_100%)]',
        text: 'text-[#0d0d0d]',
        subtext: 'text-[#0d0d0d]/82',
    },
    jade: {
        surface: 'bg-[linear-gradient(135deg,#1f5648_0%,#63d3aa_52%,#d3f7ea_100%)]',
        text: 'text-[#0d0d0d]',
        subtext: 'text-[#0d0d0d]/82',
    },
    lime: {
        surface: 'bg-[linear-gradient(135deg,#4c6a24_0%,#a8da62_52%,#edf8d2_100%)]',
        text: 'text-[#0d0d0d]',
        subtext: 'text-[#0d0d0d]/82',
    },
};

const MoneyBox = ({ theme, label, value }) => (
    <div className={`overflow-hidden rounded-[2px] border border-[#c8a96a]/15 px-3 py-3.5 shadow-[0_12px_24px_rgba(0,0,0,0.24)] min-h-[74px] ${theme.surface} ${theme.text}`}>
        <div className="flex items-start justify-between gap-3">
            <IndianRupee size={26} strokeWidth={2.2} className="mt-1 shrink-0" />
            <div className="text-right">
                <div className="text-[24px] sm:text-[26px] font-black leading-none">{value}</div>
                <div className={`mt-2 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] ${theme.subtext}`}>{label}</div>
            </div>
        </div>
    </div>
);

const CountBox = ({ theme, icon: Icon, label, value }) => (
    <div className={`overflow-hidden rounded-[2px] border border-[#c8a96a]/15 px-3 py-3.5 shadow-[0_12px_24px_rgba(0,0,0,0.24)] min-h-[74px] ${theme.surface} ${theme.text}`}>
        <div className="flex items-start justify-between gap-3">
            <Icon size={22} strokeWidth={2.2} className="mt-1 shrink-0" />
            <div className="text-right">
                <div className="text-[24px] sm:text-[26px] font-black leading-none">{value}</div>
                <div className={`mt-2 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] ${theme.subtext}`}>{label}</div>
            </div>
        </div>
    </div>
);

const PairBox = ({ theme, label, value }) => (
    <div className={`overflow-hidden rounded-[2px] border border-[#c8a96a]/15 px-3 py-4.5 text-center shadow-[0_12px_24px_rgba(0,0,0,0.24)] min-h-[92px] flex flex-col items-center justify-center ${theme.surface} ${theme.text}`}>
        <div className="text-[28px] sm:text-[30px] font-black leading-none">{value}</div>
        <div className={`mt-2 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.08em] ${theme.subtext}`}>{label}</div>
    </div>
);

const NoticePanel = ({ notices }) => (
    <div className="overflow-hidden rounded-[2px] border border-[#c8a96a]/16 bg-[#111111] shadow-[0_14px_36px_rgba(0,0,0,0.35)]">
        <div className="bg-[#1a1a1a] px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#c8a96a]">
            Notifications
        </div>
        <div className="space-y-px bg-[#c8a96a]/10 p-px">
            {notices.map((notice, index) => (
                <div key={`${notice}-${index}`} className="flex items-start gap-2 bg-[#161616] px-3 py-2">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c8a96a]/12 text-[#c8a96a]">
                        <Bell size={9} />
                    </div>
                    <p className="text-[11px] leading-5 text-[#f5e6c8]/78">{notice}</p>
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
    const [userData] = useState(() => {
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
        return {
            repurchaseWallet: firstNumber(
                stats?.repurchaseWalletBalance,
                userData?.repurchaseWalletBalance,
                stats?.legacyRepurchaseIncome
            ),
            eWallet: firstNumber(stats?.walletBalance, userData?.walletBalance),
            generationWallet: firstNumber(
                stats?.generationWalletBalance,
                userData?.generationWalletBalance,
                stats?.legacyGenerationIncome,
                stats?.totalGenerationIncome
            ),
            productWallet: firstNumber(userData?.productWalletBalance),
            netCommission: firstNumber(stats?.totalGenerationIncome),
            paidWithdrawals: firstNumber(stats?.paidWithdrawals, userData?.paidWithdrawals),
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
        };
    }, [matchingReport, networkCounts, stats, userData]);

    const notices = useMemo(() => {
        const currentRank = stats?.rank || userData?.rank || 'Member';

        return [
            `Welcome ${userData?.userName || userData?.memberId || 'Member'}, current rank is ${currentRank}.`,
            `Network summary: ${networkCounts.downline} total members, ${networkCounts.activeDirects} active directs.`,
            `Current PV carry is ${formatSimplePair(viewModel.currentPvLeft, viewModel.currentPvRight)}.`,
            `Total PV summary is ${formatSimplePair(viewModel.totalPvLeft, viewModel.totalPvRight)}.`,
        ];
    }, [networkCounts.activeDirects, networkCounts.downline, stats?.rank, userData?.memberId, userData?.rank, userData?.userName, viewModel.currentPvLeft, viewModel.currentPvRight, viewModel.totalPvLeft, viewModel.totalPvRight]);

    if (loading) {
        return (
            <div className="flex min-h-[68vh] items-center justify-center rounded-[2px] border border-[#c8a96a]/16 bg-[#111111]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#2b2b2b] border-t-[#c8a96a]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#c8a96a]">
                        Loading Dashboard
                    </span>
                </div>
            </div>
        );
    }

    if (!userData) return null;

    return (
        <div className="mx-auto w-full max-w-[1280px] rounded-[2px] border border-[#c8a96a]/14 bg-[radial-gradient(circle_at_top,#1c1c1c_0%,#121212_55%,#0d0d0d_100%)] p-3 shadow-[0_20px_48px_rgba(0,0,0,0.34)]">
            <div className="hidden gap-3 lg:grid lg:grid-cols-3">
                <div className="space-y-2">
                    <MoneyBox theme={boxThemes.mint} label="Repurchase-Wallet" value={formatMoney(viewModel.repurchaseWallet)} />
                    <MoneyBox theme={boxThemes.emerald} label="Product Wallet" value={formatMoney(viewModel.productWallet)} />
                    <ProfileBanner userData={userData} stats={stats} matchingReport={matchingReport} />
                </div>

                <div className="space-y-2">
                    <MoneyBox theme={boxThemes.jade} label="E-Wallet" value={formatMoney(viewModel.eWallet)} />
                    <MoneyBox theme={boxThemes.lime} label="Net Commission" value={formatMoney(viewModel.netCommission)} />
                    <CountBox theme={boxThemes.jade} icon={Network} label="Downline" value={networkCounts.downline} />
                    <CountBox theme={boxThemes.lime} icon={Users} label="Right" value={networkCounts.right} />
                    <PairBox theme={boxThemes.jade} label="Today PV Left / Right" value={formatSimplePair(viewModel.currentPvLeft, viewModel.currentPvRight)} />
                    <PairBox theme={boxThemes.mint} label="Total PV Left / Right" value={formatSimplePair(viewModel.totalPvLeft, viewModel.totalPvRight)} />
                    <PairBox theme={boxThemes.lime} label="Current Gold Left / Right" value={formatSimplePair(viewModel.currentGoldLeft, viewModel.currentGoldRight, 0)} />
                    <PairBox theme={boxThemes.jade} label="Current Diamond Left / Right" value={formatSimplePair(viewModel.currentDiamondLeft, viewModel.currentDiamondRight, 0)} />
                </div>

                <div className="space-y-2">
                    <MoneyBox theme={boxThemes.emerald} label="Generation-Wallet" value={formatMoney(viewModel.generationWallet)} />
                    <MoneyBox theme={boxThemes.mint} label="Paid Withdrawal" value={formatMoney(viewModel.paidWithdrawals)} />
                    <CountBox theme={boxThemes.mint} icon={Users} label="Left" value={networkCounts.left} />
                    <CountBox theme={boxThemes.emerald} icon={UserCheck} label="Active Direct" value={networkCounts.activeDirects} />
                    <PairBox theme={boxThemes.jade} label="Current Silver Left / Right" value={formatSimplePair(viewModel.currentSilverLeft, viewModel.currentSilverRight, 0)} />
                    <PairBox theme={boxThemes.mint} label="Silver Team Left / Right" value={formatSimplePair(viewModel.totalSilverLeft, viewModel.totalSilverRight, 0)} />
                    <PairBox theme={boxThemes.lime} label="Total Gold Left / Right" value={formatSimplePair(viewModel.totalGoldLeft, viewModel.totalGoldRight, 0)} />
                    <PairBox theme={boxThemes.emerald} label="Total Diamond Left / Right" value={formatSimplePair(viewModel.totalDiamondLeft, viewModel.totalDiamondRight, 0)} />
                </div>
            </div>

            <div className="grid gap-3 lg:hidden">
                <div className="space-y-2">
                    <MoneyBox theme={boxThemes.mint} label="Repurchase-Wallet" value={formatMoney(viewModel.repurchaseWallet)} />
                    <MoneyBox theme={boxThemes.jade} label="E-Wallet" value={formatMoney(viewModel.eWallet)} />
                    <MoneyBox theme={boxThemes.emerald} label="Generation-Wallet" value={formatMoney(viewModel.generationWallet)} />
                    <MoneyBox theme={boxThemes.emerald} label="Product Wallet" value={formatMoney(viewModel.productWallet)} />
                    <MoneyBox theme={boxThemes.lime} label="Net Commission" value={formatMoney(viewModel.netCommission)} />
                    <MoneyBox theme={boxThemes.mint} label="Paid Withdrawal" value={formatMoney(viewModel.paidWithdrawals)} />
                    <ProfileBanner userData={userData} stats={stats} matchingReport={matchingReport} />
                </div>

                <div className="space-y-2">
                    <CountBox theme={boxThemes.jade} icon={Network} label="Downline" value={networkCounts.downline} />
                    <CountBox theme={boxThemes.mint} icon={Users} label="Left" value={networkCounts.left} />
                    <CountBox theme={boxThemes.lime} icon={Users} label="Right" value={networkCounts.right} />
                    <CountBox theme={boxThemes.emerald} icon={UserCheck} label="Active Direct" value={networkCounts.activeDirects} />
                    <PairBox theme={boxThemes.mint} label="Total PV Left / Right" value={formatSimplePair(viewModel.totalPvLeft, viewModel.totalPvRight)} />
                    <PairBox theme={boxThemes.jade} label="Current Silver Left / Right" value={formatSimplePair(viewModel.currentSilverLeft, viewModel.currentSilverRight, 0)} />
                    <PairBox theme={boxThemes.mint} label="Silver Team Left / Right" value={formatSimplePair(viewModel.totalSilverLeft, viewModel.totalSilverRight, 0)} />
                    <PairBox theme={boxThemes.lime} label="Current Gold Left / Right" value={formatSimplePair(viewModel.currentGoldLeft, viewModel.currentGoldRight, 0)} />
                    <PairBox theme={boxThemes.lime} label="Total Gold Left / Right" value={formatSimplePair(viewModel.totalGoldLeft, viewModel.totalGoldRight, 0)} />
                    <PairBox theme={boxThemes.jade} label="Current Diamond Left / Right" value={formatSimplePair(viewModel.currentDiamondLeft, viewModel.currentDiamondRight, 0)} />
                    <PairBox theme={boxThemes.emerald} label="Total Diamond Left / Right" value={formatSimplePair(viewModel.totalDiamondLeft, viewModel.totalDiamondRight, 0)} />
                </div>
            </div>

            <div className="mt-3 lg:ml-[calc((100%+0.75rem)/3)] lg:w-[calc(((100%-1.5rem)*2/3)+0.75rem)]">
                <NoticePanel notices={notices} />
            </div>
        </div>
    );
};

export default DashboardOverview;
