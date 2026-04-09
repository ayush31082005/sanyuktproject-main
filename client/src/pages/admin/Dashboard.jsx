import React, { useEffect, useState } from 'react';
import { Calendar, Target, Trophy, DollarSign, TrendingUp, Star, Award, Clock, Users, Package, ShoppingCart, Activity, Download, RefreshCw } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import api from '../../api';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week'); // week, month, year

    // Data states
    const [userStats, setUserStats] = useState({
        total: 0,
        active: 0,
        newToday: 0,
        growth: 0,
        chartData: []
    });

    const [productStats, setProductStats] = useState({
        total: 0,
        outOfStock: 0,
        topSelling: [],
        revenue: 0,
        chartData: []
    });

    const [orderStats, setOrderStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        revenue: 0,
        chartData: []
    });

    const [recentActivity, setRecentActivity] = useState([]);

    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData();

        // Implement Polling for Real-Time Updates
        const interval = setInterval(() => {
            fetchDashboardData(true); // silent refresh
        }, 10000);

        return () => clearInterval(interval);
    }, [timeRange]);

    const fetchDashboardData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            // Fetch all data in parallel
            const [usersRes, productsRes, ordersRes, activityRes] = await Promise.all([
                api.get('/admin/stats/users?range=' + timeRange),
                api.get('/admin/stats/products?range=' + timeRange),
                api.get('/admin/stats/orders?range=' + timeRange),
                api.get('/admin/activity/recent')
            ]);

            // Update states with real data
            if (usersRes.data) setUserStats(usersRes.data);
            if (productsRes.data) setProductStats(productsRes.data);
            if (ordersRes.data) setOrderStats(ordersRes.data);
            if (activityRes.data) setRecentActivity(activityRes.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            if (!silent) setDemoData();
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // Demo data for development
    const setDemoData = () => {
        setUserStats({
            total: 1250,
            active: 890,
            newToday: 24,
            growth: 12.5,
            chartData: [65, 78, 90, 85, 95, 110, 125, 140, 155, 170, 185, 200]
        });

        setProductStats({
            total: 156,
            outOfStock: 12,
            topSelling: [
                { name: 'Vitamin C Cream', sales: 245, revenue: 85675 },
                { name: 'Sunscreen SPF 50', sales: 198, revenue: 64350 },
                { name: 'Anti-Aging Cream', sales: 167, revenue: 83333 },
                { name: 'Aloe Vera Gel', sales: 145, revenue: 28855 }
            ],
            revenue: 385000,
            chartData: [45, 52, 48, 70, 65, 80, 95, 88, 92, 110, 125, 140]
        });

        setOrderStats({
            total: 892,
            pending: 45,
            completed: 812,
            revenue: 425000,
            chartData: [30, 45, 38, 52, 48, 65, 72, 68, 85, 92, 105, 118]
        });

        setRecentActivity([
            { id: '1', user: 'John Doe', action: 'placed an order', product: 'Vitamin C Cream', time: '5 minutes ago', amount: 375, type: 'order' },
            { id: '2', user: 'Jane Smith', action: 'registered as new user', time: '15 minutes ago', type: 'user' },
            { id: '3', user: 'Bob Johnson', action: 'purchased', product: 'Sunscreen SPF 50', time: '1 hour ago', amount: 325, type: 'order' },
            { id: '4', user: 'Alice Brown', action: 'earned Direct Bonus', amount: 5000, time: '2 hours ago', type: 'income' },
            { id: '5', user: 'Charlie Wilson', action: 'achieved Silver Rank', time: '3 hours ago', type: 'rank' }
        ]);
    };

    // Chart configurations
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#0A7A2F',
                titleColor: 'white',
                bodyColor: 'white'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e5e7eb'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        elements: {
            line: {
                tension: 0.4
            }
        }
    };

    const userChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Users',
                data: userStats.chartData,
                borderColor: '#0A7A2F',
                backgroundColor: 'rgba(10, 122, 47, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const productChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Products Sold',
                data: productStats.chartData,
                backgroundColor: '#F7931E',
                borderRadius: 6
            }
        ]
    };

    // Helper for Activity Icons and Colors
    const getActivityConfig = (type) => {
        switch (type) {
            case 'order':
                return { icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-100' };
            case 'user':
                return { icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' };
            case 'recharge':
                return { icon: RefreshCw, color: 'text-orange-600', bg: 'bg-orange-100' };
            case 'income':
                return { icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-100' };
            case 'rank':
                return { icon: Trophy, color: 'text-green-600', bg: 'bg-green-100' };
            default:
                return { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-100' };
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header with Refresh */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                    <div className="flex items-center mt-1 text-sm text-gray-500 uppercase tracking-wider font-semibold">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Network Live Updates
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent transition-all shadow-sm"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>

                    <button
                        onClick={() => fetchDashboardData()}
                        disabled={loading}
                        className="p-2.5 bg-white hover:bg-green-50 rounded-xl border border-gray-100 transition-all shadow-sm hover:shadow-md"
                    >
                        <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Users Card */}
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                            <Users className="h-7 w-7 text-green-600" />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-green-600 px-2 py-0.5 bg-green-100 rounded-full">
                                +{userStats.growth}%
                            </span>
                        </div>
                    </div>
                    <h3 className="text-4xl font-extrabold text-gray-800 tracking-tight">{userStats.total}</h3>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-1">Total Users</p>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold">
                        <span className="text-green-600 px-2 py-1 bg-green-50 rounded-lg">{userStats.active} ACTIVE</span>
                        <span className="text-blue-600 px-2 py-1 bg-blue-50 rounded-lg">{userStats.newToday} NEW TODAY</span>
                    </div>
                </div>

                {/* Products Card */}
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                            <Package className="h-7 w-7 text-orange-600" />
                        </div>
                        <span className="text-xs font-bold text-orange-600 px-2 py-0.5 bg-orange-100 rounded-full">
                            {productStats.outOfStock} LOW STOCK
                        </span>
                    </div>
                    <h3 className="text-4xl font-extrabold text-gray-800 tracking-tight">{productStats.total}</h3>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-1">Total Products</p>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-xs font-bold truncate text-gray-500 italic">
                        TOP: {productStats.topSelling[0]?.name || 'N/A'}
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                            <ShoppingCart className="h-7 w-7 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-blue-600 px-2 py-0.5 bg-blue-100 rounded-full">
                            {orderStats.pending} PENDING
                        </span>
                    </div>
                    <h3 className="text-4xl font-extrabold text-gray-800 tracking-tight">{orderStats.total}</h3>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-1">Total Orders</p>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-xs font-bold text-gray-500">
                        {orderStats.completed} SUCCESSFULLY DELIVERED
                    </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-purple-50 rounded-2xl group-hover:bg-purple-100 transition-colors">
                            <DollarSign className="h-7 w-7 text-purple-600" />
                        </div>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                        ₹{(productStats.revenue + orderStats.revenue).toLocaleString()}
                    </h3>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-1">Total Revenue</p>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-[10px] font-bold text-gray-400">
                        <span>PRD: ₹{productStats.revenue.toLocaleString()}</span>
                        <span>ORD: ₹{orderStats.revenue.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Charts and Tables (8 cols) */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">User Growth</h3>
                                <Activity className="h-5 w-5 text-gray-300" />
                            </div>
                            <div className="h-64">
                                <Line data={userChartData} options={lineChartOptions} />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Product Sales</h3>
                                <Package className="h-5 w-5 text-gray-300" />
                            </div>
                            <div className="h-64">
                                <Bar data={productChartData} options={lineChartOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Top Selling Products Table */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-50 overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Performance Ranking</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b border-gray-50">
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase">Product Name</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase">Units</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase">Revenue Generated</th>
                                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase">Performance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {productStats.topSelling.map((product, index) => (
                                        <tr key={index} className="group hover:bg-green-50/50 transition-colors">
                                            <td className="py-4 font-bold text-gray-700">{product.name}</td>
                                            <td className="py-4 text-gray-500 font-semibold">{product.sales} u</td>
                                            <td className="py-4 text-green-600 font-extrabold">₹{product.revenue.toLocaleString()}</td>
                                            <td className="py-4">
                                                <div className="flex items-center">
                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mr-3">
                                                        <div 
                                                            className="h-full bg-green-500 rounded-full" 
                                                            style={{ width: `${100 - (index * 20)}%` }}
                                                        ></div>
                                                    </div>
                                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activity (4 cols) */}
                <div className="lg:col-span-12 xl:col-span-4">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-full sticky top-6">
                        <div className="p-8 border-b border-gray-50">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
                                <div className="flex items-center text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                    <span className="relative flex h-1.5 w-1.5 mr-1.5">
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                    </span>
                                    LIVE
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto max-h-[800px] scrollbar-hide">
                            <div className="space-y-3">
                                {recentActivity.map((activity, idx) => {
                                    const config = getActivityConfig(activity.type);
                                    const Icon = config.icon || Activity;
                                    const isToday = activity.time.includes('now') || activity.time.includes('minute') || activity.time.includes('hour');
                                    
                                    return (
                                        <div 
                                            key={activity.id} 
                                            className="group relative flex items-center p-4 bg-white hover:bg-gray-50/80 rounded-2xl border border-transparent hover:border-gray-100 transition-all duration-300"
                                        >
                                            <div className={`w-12 h-12 ${config.bg} rounded-2xl flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform`}>
                                                <Icon className={`h-6 w-6 ${config.color}`} />
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <p className="text-sm font-bold text-gray-800 truncate pr-2">
                                                        {activity.user}
                                                    </p>
                                                    <p className={`text-[10px] font-bold ${isToday ? 'text-gray-900' : 'text-gray-400'} uppercase`}>
                                                        {activity.time}
                                                    </p>
                                                </div>
                                                <p className="text-[13px] font-medium text-gray-500 leading-tight">
                                                    <span className={`${config.color}/80 font-semibold`}>{activity.action}</span>
                                                    {activity.product && (
                                                        <span className="text-gray-800 font-bold"> {activity.product}</span>
                                                    )}
                                                </p>
                                                <div className="flex items-center mt-1">
                                                    <p className="text-[10px] font-bold text-gray-400 tracking-wider">
                                                        LOG ID: #{String(activity.id).split('-')[1]?.substring(0, 6).toUpperCase() || idx}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {activity.amount && (
                                                <div className="ml-3 text-right">
                                                    <p className="text-sm font-extrabold text-gray-700">
                                                        ₹{activity.amount.toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                
                                {recentActivity.length === 0 && (
                                    <div className="text-center py-20">
                                        <Activity className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-sm font-bold text-gray-400">WAITING FOR NETWORK ACTIVITY...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="p-6 border-t border-gray-50">
                            <button className="w-full py-3 bg-gray-50 text-gray-400 text-xs font-bold rounded-xl hover:bg-gray-100 hover:text-gray-600 transition-all uppercase tracking-widest">
                                View Full Activity Log
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
