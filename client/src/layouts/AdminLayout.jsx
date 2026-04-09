import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, Users, Package, BarChart3, LogOut,
    Menu, X, Search, Bell, ChevronDown, Shield, Newspaper, IndianRupee
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/products', label: 'Products', icon: Package },
        { path: '/admin/withdrawals', label: 'Withdrawal Mgmt', icon: IndianRupee },
        { path: '/admin/franchise', label: 'Franchise', icon: BarChart3 },
        { path: '/admin/grievance', label: 'Grievance', icon: BarChart3 },
        { path: '/admin/orders', label: 'Orders', icon: Package },
        { path: '/admin/gallery', label: 'Gallery', icon: Package },
        { path: '/admin/seminar', label: 'Seminar', icon: Package },
        { path: '/admin/news', label: 'News Management', icon: Newspaper },
        { path: '/admin/mlm', label: 'MLM Management', icon: Shield }
    ];

    // Logout function
    const handleLogout = () => {
        // Clear all stored data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');

        // Clear session storage if used
        sessionStorage.clear();

        // Redirect to login page
        navigate('/login', { replace: true });

        // Optional: Show logout message
        console.log('Logged out successfully');
    };

    // Get current admin info from localStorage
    const getAdminInfo = () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                return user.name || 'Admin';
            }
            return 'Sanyukt Parivaar';
        } catch {
            return 'Sanyukt Parivaar';
        }
    };

    const adminName = getAdminInfo();

    return (
        <div className="h-screen overflow-hidden bg-[#0D0D0D] flex font-sans selection:bg-[#C8A96A]/30">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-20'} bg-[#121212] shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col border-r border-[#C8A96A]/20`}>
                {/* Sidebar Header */}
                <div className="h-24 flex items-center justify-between px-6 border-b border-[#C8A96A]/20 bg-[#0D0D0D]">
                    {sidebarOpen ? (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#121212] border border-[#C8A96A]/40 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(200,169,106,0.15)]">
                                <Shield className="h-6 w-6 text-[#C8A96A]" strokeWidth={1.5} />
                            </div>
                            <span className="text-2xl font-serif font-bold text-[#F5E6C8] tracking-tight">Sanyukt Parivaar</span>
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-[#121212] border border-[#C8A96A]/40 rounded-xl flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(200,169,106,0.15)]">
                            <Shield className="h-6 w-6 text-[#C8A96A]" strokeWidth={1.5} />
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-[#C8A96A]/10 rounded-lg transition-colors border border-transparent hover:border-[#C8A96A]/30"
                    >
                        {sidebarOpen ? <X className="h-5 w-5 text-[#C8A96A]" /> : <Menu className="h-5 w-5 text-[#C8A96A]" />}
                    </button>
                </div>

                {/* Welcome Section */}
                {sidebarOpen && (
                    <div className="px-6 py-6 border-b border-[#C8A96A]/10">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F5E6C8]/40 mb-1">Welcome back,</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-[#F5E6C8]">{adminName}</p>
                                <p className="text-sm text-[#C8A96A] font-medium mt-0.5">Administrator</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation - flex-1 to push logout to bottom */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-1.5 transition-all duration-300 border ${isActive
                                    ? 'bg-[#C8A96A]/10 border-[#C8A96A]/40 text-[#C8A96A] shadow-[inset_4px_0_0_0_#C8A96A]'
                                    : 'border-transparent text-[#F5E6C8]/60 hover:bg-[#C8A96A]/5 hover:text-[#F5E6C8] hover:border-[#C8A96A]/20'
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-[#C8A96A]' : 'group-hover:text-[#F5E6C8]'}`} strokeWidth={isActive ? 2.5 : 2} />
                                {sidebarOpen && <span className={`font-medium text-sm tracking-wide ${isActive ? 'font-bold' : ''}`}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button - Fixed at bottom */}
                <div className="p-4 border-t border-[#C8A96A]/10 mt-auto bg-[#0D0D0D]/50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-300 group border border-transparent hover:border-red-500/30"
                    >
                        <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        {sidebarOpen && (
                            <span className="font-bold text-sm tracking-wide group-hover:translate-x-1 transition-transform">
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-[#121212] border-b border-[#C8A96A]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] sticky top-0 z-10">
                    <div className="flex items-center justify-between px-8 py-4">
                        {/* Page Title */}
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-[#F5E6C8] capitalize tracking-tight m-0">
                                {location.pathname.split('/').pop() || 'Dashboard'}
                            </h1>
                            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#F5E6C8]/40 mt-1">Welcome back, {adminName}</p>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center space-x-6">
                            {/* Search */}
                            <div className="relative group/search hidden md:block">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#C8A96A]/60 group-hover/search:text-[#C8A96A] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Type here to search..."
                                    className="pl-11 pr-4 py-2.5 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-sm font-medium text-[#F5E6C8] placeholder:text-[#F5E6C8]/30 focus:border-[#C8A96A] focus:outline-none focus:shadow-[0_0_0_1px_rgba(200,169,106,0.3)] transition-all w-72"
                                />
                            </div>

                            {/* Admin Profile Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center space-x-3 p-2 border border-transparent hover:border-[#C8A96A]/30 bg-[#0D0D0D] hover:bg-[#C8A96A]/5 rounded-xl transition-all duration-300">
                                    <div className="w-9 h-9 bg-[#121212] border border-[#C8A96A]/50 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(200,169,106,0.2)]">
                                        <div className="text-[13px] font-serif font-bold text-[#C8A96A]">{adminName.charAt(0).toUpperCase()}</div>
                                    </div>
                                    <span className="text-sm font-bold text-[#F5E6C8] tracking-wide">{adminName}</span>
                                    <ChevronDown className="h-4 w-4 text-[#C8A96A]/60 group-hover:text-[#C8A96A] transition-colors" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-3 w-56 bg-[#121212] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-[#C8A96A]/30 hidden group-hover:block overflow-hidden transform origin-top-right transition-all">
                                    <div className="p-2 space-y-1">
                                        <div className="px-3 py-2 border-b border-[#C8A96A]/10 mb-2">
                                            <p className="text-xs text-[#F5E6C8]/50 font-medium">Logged in as</p>
                                            <p className="text-sm text-[#F5E6C8] font-bold truncate">{adminName}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-3 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg flex items-center space-x-3 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0D0D0D] relative">
                    {/* Background glow for content area */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-3xl bg-[#C8A96A]/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10 w-full h-full">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-[#121212] border-t border-[#C8A96A]/20 py-4 px-8 z-10 relative">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-[#F5E6C8]/40 tracking-wide">© 2024 Sanyukt Parivar. All rights reserved.</p>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#C8A96A]/40">Type here to search</p>
                    </div>
                </footer>
            </div>

            {/* Custom styles for scrollbar */}
            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 8px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #0D0D0D;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: rgba(200, 169, 106, 0.2);
                    border-radius: 10px;
                    border: 2px solid #0D0D0D;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: rgba(200, 169, 106, 0.5);
                }
            `}</style>
        </div>
    );
};


export default AdminLayout;
