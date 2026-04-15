import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom';
import api from '../api';
import {
    Home,
    LogIn,
    Users,
    ShoppingCart,
    Briefcase,
    Trophy,
    Tag,
    UserCheck,
    Mail,
    LogOut,
    ChevronDown,
    Menu,
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const profileFallback =
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80';

const getRankColor = (rank) => {
    const colors = {
        Member: '#8ea2b8',
        Bronze: '#b7794d',
        Silver: '#94a3b8',
        Gold: '#d6a84c',
        Platinum: '#59a7ff',
        Star: '#8f7bff',
        Ruby: '#ff6f7d',
        Sapphire: '#4fc3f7',
        Emerald: '#47b76f',
        Diamond: '#72cde9',
        MD: '#f2c55b',
    };

    return colors[rank] || '#8ea2b8';
};

const normalizeBadge = (value) => {
    if (value === undefined || value === null || value === '') return '0';
    return value;
};

const shouldShowSidebarBadge = (itemId) => ['wallet', 'gen_wallet'].includes(itemId);

const UserDashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [userData] = useState(() => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data in dashboard layout:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
    });

    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const menuItems = useMemo(() => ([
        { id: 'home', name: 'Home', icon: Home, path: '/my-account' },
        { id: 'signup', name: 'New Sign Up', icon: LogIn, path: '/register' },
        {
            id: 'downline',
            name: 'My Downline',
            icon: Users,
            path: '/my-account/downline',
            badge: normalizeBadge(stats?.totalDownline),
            children: [
                { name: 'My Directs', path: '/my-account/downline/directs', id: 'downline_directs' },
                { name: 'Left Team', path: '/my-account/downline/left-team', id: 'downline_left' },
                { name: 'Right Team', path: '/my-account/downline/right-team', id: 'downline_right' },
                { name: 'All Team', path: '/my-account/downline/all-team', id: 'downline_all' },
                { name: 'Tree View', path: '/my-account/downline/tree-view', id: 'downline_tree' },
            ],
        },
        {
            id: 'orders',
            name: 'Product Order',
            icon: ShoppingCart,
            path: '/my-account/orders',
            badge: normalizeBadge(stats?.totalOrders),
            children: [
                { name: 'First Purchase Product', path: '/my-account/orders/first', id: 'orders_first' },
                { name: 'Repurchase Product', path: '/my-account/orders/repurchase', id: 'orders_repurchase' },
                { name: 'Order History', path: '/my-account/orders/history', id: 'orders_history' },
                { name: 'Product Wallet Request', path: '/my-account/orders/wallet-request', id: 'orders_wallet_request' },
                { name: 'Product Wallet Transaction', path: '/my-account/orders/wallet-transaction', id: 'orders_wallet_transaction' },
                { name: 'Repurchase Wallet Transaction', path: '/my-account/orders/repurchase-wallet-transaction', id: 'orders_repurchase_wallet_transaction' },
            ],
        },
        {
            id: 'first_bonus',
            name: 'First Purchase Bonus',
            icon: Briefcase,
            path: '/my-account/bonus/first/silver',
            badge: '0',
            children: [
                { name: 'Silver Matching', path: '/my-account/bonus/first/silver', id: 'first_silver' },
                { name: 'Gold Matching', path: '/my-account/bonus/first/gold', id: 'first_gold' },
                { name: 'Diamond Matching', path: '/my-account/bonus/first/diamond', id: 'first_diamond' },
            ],
        },
        {
            id: 'repurchase_bonus',
            name: 'Repurchase Bonus',
            icon: Briefcase,
            path: '/my-account/bonus/repurchase/self',
            badge: '0',
            children: [
                { name: 'Self Repurchase Income', path: '/my-account/bonus/repurchase/self', id: 'repurchase_self' },
                { name: 'Repurchase Level Income', path: '/my-account/bonus/repurchase/level', id: 'repurchase_level' },
                { name: 'Sponsor Income', path: '/my-account/bonus/repurchase/sponsor', id: 'repurchase_sponsor' },
                { name: 'Royalty Bonus', path: '/my-account/bonus/repurchase/royalty', id: 'repurchase_royalty' },
                { name: 'House Fund', path: '/my-account/bonus/repurchase/house', id: 'repurchase_house' },
                { name: 'Leadership Fund', path: '/my-account/bonus/repurchase/leadership', id: 'repurchase_leadership' },
                { name: 'Car Fund', path: '/my-account/bonus/repurchase/car', id: 'repurchase_car' },
                { name: 'Travel Fund', path: '/my-account/bonus/repurchase/travel', id: 'repurchase_travel' },
                { name: 'Bike Fund', path: '/my-account/bonus/repurchase/bike', id: 'repurchase_bike' },
            ],
        },
        {
            id: 'wallet',
            name: 'E-Wallet',
            icon: Briefcase,
            path: '/my-account/wallet',
            badge: stats?.walletBalance !== undefined ? `Rs ${Number(stats.walletBalance || 0).toFixed(2)}` : '0',
            children: [
                { name: 'Withdraw Funds', path: '/my-account/wallet/withdraw', id: 'wallet_withdraw_request' },
                { name: 'Deduction Report', path: '/my-account/wallet/deduction-report', id: 'wallet_deduction' },
                { name: 'Withdrawal History', path: '/my-account/wallet/withdrawal-history', id: 'wallet_withdrawal' },
                { name: 'All Transaction Report', path: '/my-account/wallet/all-transactions', id: 'wallet_all' },
                { name: 'Daily Closing Report', path: '/my-account/wallet/daily-closing', id: 'wallet_daily' },
            ],
        },
        {
            id: 'rank',
            name: 'My Rank',
            icon: Trophy,
            path: '/my-account/rank',
            rankBadge: stats?.rank || 'Member',
        },
        {
            id: 'gen_wallet',
            name: 'Generation Wallet',
            icon: Briefcase,
            path: '/my-account/generation',
            badge:
                stats?.generationWalletBalance !== undefined
                    ? `Rs ${Number(stats.generationWalletBalance || 0).toFixed(2)}`
                    : '0',
            children: [
                { name: 'Withdraw Funds', path: '/my-account/generation/withdraw', id: 'generation_withdraw_request' },
                { name: 'Deduction Report', path: '/my-account/generation/deduction-report', id: 'generation_deduction' },
                { name: 'Withdrawal History', path: '/my-account/generation/withdrawal-history', id: 'generation_withdrawal' },
                { name: 'All Transaction Report', path: '/my-account/generation/all-transactions', id: 'generation_all' },
                { name: 'Monthly Closing Report', path: '/my-account/generation/monthly-closing', id: 'generation_monthly' },
            ],
        },
        {
            id: 'folder',
            name: 'My Folder',
            icon: Tag,
            path: '/my-account/folder',
            badge: '0',
            children: [
                { name: 'Welcome Letter', path: '/my-account/folder/welcome-letter', id: 'folder_welcome' },
                { name: 'Our Banker', path: '/banker', id: 'folder_banker' },
                { name: 'ID Card', path: '/my-account/folder/id-card', id: 'folder_id' },
            ],
        },
        {
            id: 'profile',
            name: 'Profile & KYC',
            icon: UserCheck,
            path: '/my-account/profile',
            badge: '0',
            children: [
                { name: 'Update Profile', path: '/my-account/profile', id: 'profile_update' },
                { name: 'Change Password', path: '/forgot-password', id: 'profile_change_password' },
            ],
        },
        { id: 'grievance', name: 'Submit Complain', icon: Mail, path: '/my-account/grievances', badge: '0' },
    ]), [stats]);

    const pageTitle = useMemo(() => {
        for (const item of menuItems) {
            if (location.pathname === item.path) return item.name;
            if (item.children) {
                const child = item.children.find((entry) => location.pathname === entry.path);
                if (child) return child.name;
            }
        }
        return 'Member Dashboard';
    }, [location.pathname, menuItems]);

    useEffect(() => {
        if (!userData) {
            navigate('/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const response = await api.get('/mlm/get-stats');
                setStats(response.data || null);
            } catch (error) {
                console.error('Error fetching stats in layout:', error);
            }
        };

        fetchStats();

        if (isMobile) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
        }

        const handleExternalToggle = () => setSidebarOpen((prev) => !prev);
        window.addEventListener('toggle-dashboard-sidebar', handleExternalToggle);
        return () => window.removeEventListener('toggle-dashboard-sidebar', handleExternalToggle);
    }, [isMobile, navigate, userData]);

    useEffect(() => {
        const activeDropdown = menuItems.find((item) =>
            Array.isArray(item.children) &&
            (location.pathname === item.path ||
                item.children.some((child) => location.pathname === child.path || location.pathname.startsWith(`${child.path}/`)))
        );

        setOpenDropdown(activeDropdown?.id || null);
    }, [location.pathname, menuItems]);

    if (!userData) return null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#0d0d0d] text-[#f5e6c8]">
            <div className="sticky top-0 z-40 h-[6px] bg-[#c07a1b]" />

            <div className="flex min-h-[calc(100vh-6px)]">
            <aside
                className={`fixed left-0 top-[94px] md:top-[121px] z-50 h-[calc(100vh-94px)] md:h-[calc(100vh-121px)] overflow-y-auto border-r border-[#c8a96a]/14 bg-[linear-gradient(180deg,#121212_0%,#0d0d0d_48%,#111111_100%)] text-[#f5e6c8] transition-all duration-300
                    ${isMobile
                        ? `w-[min(86vw,320px)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
                        : sidebarOpen ? 'w-[214px]' : 'w-[82px]'}`}
            >
                <div className={`${sidebarOpen || isMobile ? 'px-0 py-0' : 'px-0 py-3'}`}>
                    <div className={`border-b border-[#c8a96a]/12 ${sidebarOpen || isMobile ? 'px-4 py-4' : 'px-0 py-4'} ${sidebarOpen || isMobile ? '' : 'flex justify-center'}`}>
                        {sidebarOpen || isMobile ? (
                            <div className="flex items-center gap-3">
                                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[#c8a96a]/30 bg-black shadow-lg">
                                    <img
                                        src={userData.profileImage || profileFallback}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate text-[13px] font-black uppercase tracking-[0.08em] text-[#f5e6c8]">
                                        {userData.userName || 'Member'}
                                    </div>
                                    <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#c8a96a]">
                                        {userData.memberId || 'SPRL0000'}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span
                                            className="rounded-sm bg-[#c8a96a]/12 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#f5e6c8]"
                                            style={{
                                                border: `1px solid ${getRankColor(stats?.rank || 'Member')}55`,
                                            }}
                                        >
                                            {stats?.rank || 'Member'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#c8a96a]/20 bg-black">
                                <img
                                    src={userData.profileImage || profileFallback}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <nav className="py-1.5">
                        {menuItems.map((item) => {
                            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                            const isActiveDirect = location.pathname === item.path || (item.path === '/my-account' && location.pathname === '/my-account/');
                            const isChildActive = hasChildren && item.children.some(
                                (child) => location.pathname === child.path || location.pathname.startsWith(`${child.path}/`)
                            );
                            const isActive = isActiveDirect || isChildActive;
                            const Icon = item.icon;

                            return (
                                <div key={item.id} className="px-2 py-0.5">
                                    <button
                                        onClick={() => {
                                            if (hasChildren && (sidebarOpen || isMobile)) {
                                                setOpenDropdown((prev) => (prev === item.id ? null : item.id));
                                                return;
                                            }

                                            navigate(item.path);
                                            if (isMobile) setSidebarOpen(false);
                                        }}
                                        className={`group relative flex w-full items-center rounded-md border text-left transition-all duration-200
                                            ${sidebarOpen || isMobile ? 'min-h-[28px] px-2.5 py-1.5' : 'mx-auto min-h-[34px] w-[56px] justify-center px-0'}
                                            ${isActive
                                                ? 'border-[#c8a96a]/28 bg-[#1b1b1b] text-[#f5e6c8] shadow-[inset_3px_0_0_#c8a96a]'
                                                : 'border-transparent bg-transparent text-[#f5e6c8]/92 hover:border-[#c8a96a]/18 hover:bg-[#181818]'
                                            }`}
                                    >
                                        <Icon className={`${sidebarOpen || isMobile ? 'mr-2 h-3.5 w-3.5' : 'h-4 w-4'} shrink-0`} strokeWidth={2.2} />

                                        {(sidebarOpen || isMobile) && (
                                            <>
                                                <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">
                                                    {item.name}
                                                </span>
                                                {item.rankBadge && (
                                                    <span
                                                        className="mr-2 rounded-sm px-1.5 py-0.5 text-[8px] font-black uppercase"
                                                        style={{
                                                            backgroundColor: `${getRankColor(item.rankBadge)}33`,
                                                            color: getRankColor(item.rankBadge),
                                                        }}
                                                    >
                                                        {item.rankBadge}
                                                    </span>
                                                )}
                                                {shouldShowSidebarBadge(item.id) && item.badge !== undefined && item.badge !== null && (
                                                    <span className="mr-1 rounded-sm border border-[#c8a96a]/18 bg-[#c8a96a]/14 px-1.5 py-0.5 text-[8px] font-black text-[#f5e6c8]">
                                                        {item.badge}
                                                    </span>
                                                )}
                                                {hasChildren && (
                                                    <ChevronDown
                                                        size={14}
                                                        className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180' : ''}`}
                                                    />
                                                )}
                                            </>
                                        )}

                                        {!sidebarOpen && !isMobile && (
                                            <div className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-[#181818] px-2 py-1 text-[10px] font-bold text-[#f5e6c8] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                                                {item.name}
                                            </div>
                                        )}
                                    </button>

                                    {hasChildren && (sidebarOpen || isMobile) && openDropdown === item.id && (
                                        <div className="mt-1 overflow-hidden rounded-md border border-[#c8a96a]/14 bg-[#141414] py-1">
                                            {item.children.map((child) => {
                                                const isChildActiveRoute = location.pathname === child.path;
                                                return (
                                                    <Link
                                                        key={child.id}
                                                        to={child.path}
                                                        onClick={() => isMobile && setSidebarOpen(false)}
                                                        className={`block px-10 py-2 text-[10px] font-semibold transition-colors
                                                            ${isChildActiveRoute
                                                                ? 'bg-[#1d1d1d] text-[#f5e6c8]'
                                                                : 'text-[#f5e6c8]/86 hover:bg-[#191919] hover:text-[#f5e6c8]'
                                                            }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div className="mt-2 px-2">
                            <button
                                onClick={handleLogout}
                                className={`group flex w-full items-center rounded-md border border-transparent text-[#f5e6c8] transition-colors hover:bg-[#181818]
                                    ${sidebarOpen || isMobile ? 'px-3 py-2 text-left' : 'mx-auto w-[56px] justify-center px-0 py-2'}`}
                            >
                                <LogOut className={`${sidebarOpen || isMobile ? 'mr-3 h-4 w-4' : 'h-4 w-4'}`} strokeWidth={2.2} />
                                {(sidebarOpen || isMobile) && <span className="text-[12px] font-semibold">Logout</span>}
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            <main
                className={`min-h-[calc(100vh-94px)] flex-1 transition-all duration-300 md:min-h-[calc(100vh-121px)]
                    ${sidebarOpen ? 'md:ml-[214px]' : 'md:ml-[82px]'}`}
            >
                <div className="relative z-30">
                    <div className="flex flex-col gap-3 border-b border-[#c8a96a]/12 bg-[#111111] px-4 py-3 md:flex-row md:items-center md:justify-between md:px-8">
                        <div className="flex items-center gap-3">
                            {isMobile && (
                                <button
                                    onClick={() => setSidebarOpen((prev) => !prev)}
                                    className="flex h-9 w-9 items-center justify-center rounded border border-[#c8a96a]/18 bg-[#171717] text-[#f5e6c8]"
                                >
                                    <Menu size={18} />
                                </button>
                            )}
                            <div>
                                <div className="text-[18px] font-black text-[#f5e6c8] md:text-[22px]">
                                    {pageTitle}
                                </div>
                            </div>
                        </div>

                        <div className="text-left md:text-right">
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c8a96a]/65">
                                Welcome
                            </div>
                            <div className="text-[13px] font-bold uppercase text-[#f5e6c8]">
                                {userData.userName || userData.memberId || 'Member'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0d0d0d] px-2 py-3 sm:px-3 md:px-6 md:py-6">
                    <Outlet />
                </div>
            </main>

            {isMobile && sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/55"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }

                @media print {
                    aside {
                        display: none !important;
                    }

                    main {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }
                }
            `}</style>
            </div>
        </div>
    );
};

export default UserDashboardLayout;
