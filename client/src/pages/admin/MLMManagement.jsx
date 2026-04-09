import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Grid, 
    Paper, 
    Card, 
    CardContent,
    CircularProgress,
    Divider,
    Alert,
    TextField,
    InputAdornment,
    IconButton,
    Avatar
} from '@mui/material';
import { 
    Zap, 
    Award, 
    BarChart, 
    RefreshCw,
    Shield,
    TrendingUp,
    Search,
    Users,
    Wallet,
    Target,
    Trophy,
    Gem,
    Activity,
    ChevronRight,
    UserCheck,
    CreditCard,
    PieChart
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import api from '../../api';
import toast from 'react-hot-toast';

// --- Reusable Modern Card Component (matching client dashboard) ---
const ModernStatsCard = ({ title, value, color, icon: Icon, subtitle, showCurrency = false }) => (
    <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A1A1A] rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/5 flex flex-col relative overflow-hidden group hover:shadow-xl hover:shadow-black/40 transition-all duration-300 h-full"
    >
        <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-xl shadow-sm`} style={{ backgroundColor: `${color || '#C8A96A'}10`, color: color || '#C8A96A' }}>
                {Icon && <Icon size={20} />}
            </div>
            {subtitle && (
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{subtitle}</span>
                </div>
            )}
        </div>

        <div className="flex flex-col gap-1">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</h3>
            <div className="flex items-baseline gap-1.5">
                {showCurrency && <span className="text-xl font-black text-slate-500">₹</span>}
                <span className="text-2xl font-black text-white tracking-tighter">{value || "0"}</span>
            </div>
        </div>
        <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full -mr-8 -mt-8`} style={{ backgroundColor: color }}></div>
    </Motion.div>
);

const UserDashboardPreview = ({ userId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserStats = async () => {
            setLoading(true);
            try {
                const res = await api.get(`mlm/get-stats/${userId}`);
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching user MLM stats:", err);
                toast.error("Failed to load user statistics");
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchUserStats();
    }, [userId]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#C8A96A' }} />
        </Box>
    );

    if (!stats) return <Alert severity="error">Could not load user data</Alert>;

    return (
        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-6">
            <Divider sx={{ borderColor: 'rgba(200, 169, 106, 0.1)', my: 4 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#C8A96A', mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                User MLM Perspective
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <ModernStatsCard title="User Wallet" value={stats.walletBalance?.toFixed(2)} color="#C8A96A" icon={Wallet} showCurrency={true} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ModernStatsCard title="Personal PV" value={stats.pv} color="#C8A96A" icon={Target} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ModernStatsCard title="Current Rank" value={stats.rank} color="#C89D6A" icon={Award} subtitle="Status" />
                </Grid>
                
                <Grid item xs={6} md={3}>
                    <ModernStatsCard title="Left PV" value={stats.leftPV} color="#64748b" icon={TrendingUp} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <ModernStatsCard title="Right PV" value={stats.rightPV} color="#C8A96A" icon={TrendingUp} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <ModernStatsCard title="Downline L" value={stats.totalLeft} color="#64748b" icon={Users} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <ModernStatsCard title="Downline R" value={stats.totalRight} color="#C8A96A" icon={Users} />
                </Grid>
            </Grid>
        </Motion.div>
    );
};

const MLMManagement = () => {
    const [loading, setLoading] = useState(false);
    const [systemStats, setSystemStats] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleString());
    const [searchId, setSearchId] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchSystemStats = async () => {
        try {
            const res = await api.get('mlm/admin/system-stats');
            setSystemStats(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load system statistics");
        }
    };

    useEffect(() => {
        fetchSystemStats();
    }, []);

    const handleRunBinaryMatching = async () => {
        setLoading(true);
        try {
            await api.post('mlm/admin/calculate-binary');
            toast.success("Binary matching calculated successfully for all users!");
            setLastUpdated(new Date().toLocaleString());
            fetchSystemStats();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to run binary matching");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRanks = async () => {
        setLoading(true);
        try {
            await api.post('mlm/admin/update-ranks');
            toast.success("All user ranks updated successfully!");
            setLastUpdated(new Date().toLocaleString());
            fetchSystemStats();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update ranks");
        } finally {
            setLoading(false);
        }
    };

    const handleUserSearch = async () => {
        if (!searchId) return;
        setLoading(true);
        try {
            // Check if searchId is an ID or try to find user by ID first
            const res = await api.get(`admin/users`);
            const users = res.data;
            const user = users.find(u => u.memberId === searchId || u.userName === searchId || u._id === searchId);
            if (user) {
                setSelectedUser(user);
                toast.success(`Found User: ${user.userName}`);
            } else {
                toast.error("User not found");
                setSelectedUser(null);
            }
        } catch {
            toast.error("Search failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 4 }, py: 4, color: 'white' }}>
            {/* Header Area */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#C8A96A' }}>
                        MLM System Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'slate.400', fontWeight: 600 }}>
                        Global oversight of networking structures, income distribution, and performance metrics.
                    </Typography>
                </div>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', tracking: '0.2em' }}>
                        Last Calculation
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#F5E6C8' }}>{lastUpdated}</Typography>
                </Box>
            </Box>

            {/* System Overview Section */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <ModernStatsCard title="Total Network" value={systemStats?.totalUsers} color="#C8A96A" icon={Users} subtitle="All Accounts" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ModernStatsCard title="Active IDs" value={systemStats?.activeUsers} color="#0A7A2F" icon={UserCheck} subtitle="Qualified" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ModernStatsCard title="System PV" value={systemStats?.pvStats?.totalPV?.toFixed(0)} color="#C8A96A" icon={Target} subtitle="Total Point Value" />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <ModernStatsCard title="Payout Pool" value={systemStats?.incomeStats?.Matching?.toLocaleString()} color="#C8A96A" icon={Wallet} subtitle="Total Bonuses" showCurrency={true} />
                </Grid>
            </Grid>

            {/* Rank Distribution Section */}
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Rank Distribution
            </Typography>
            <Grid container spacing={2} sx={{ mb: 6 }}>
                {Object.entries(systemStats?.rankDistribution || {}).map(([rank, count]) => (
                    <Grid item xs={6} sm={4} md={2.4} key={rank}>
                        <Paper sx={{ p: 2, bgcolor: '#1A1A1A', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 900, color: 'rgba(200,169,106,0.6)', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                                {rank}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 900, color: 'white' }}>
                                {count}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Quick Actions (Admin Controls) */}
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Shield size={20} className="text-[#C8A96A]" /> System Controls
            </Typography>
            <Grid container spacing={3} sx={{ mb: 8 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, bgcolor: '#1A1A1A', borderRadius: '24px', border: '1px solid rgba(200,169,106,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-[#0A7A2F]/10 text-[#0A7A2F] rounded-2xl"><Zap size={24} /></div>
                            <h3 className="text-xl font-black">Binary Matching</h3>
                        </div>
                        <p className="text-slate-400 text-sm mb-6 flex-grow">Calculate and distribute matching income for the entire network based on current L/R PV balances.</p>
                        <Button variant="contained" fullWidth onClick={handleRunBinaryMatching} disabled={loading} sx={{ bgcolor: '#C8A96A', py: 1.5, borderRadius: '12px', fontWeight: 800, color: '#0D0D0D', '&:hover': { bgcolor: '#D4AF37' } }}>
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Execute Calculation'}
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, bgcolor: '#1A1A1A', borderRadius: '24px', border: '1px solid rgba(200,169,106,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl"><Award size={24} /></div>
                            <h3 className="text-xl font-black">Rank Synchronization</h3>
                        </div>
                        <p className="text-slate-400 text-sm mb-6 flex-grow">Audit every account and update ranks according to their lifetime matched PV. Required after manual PV adjustments.</p>
                        <Button variant="contained" fullWidth onClick={handleUpdateRanks} disabled={loading} sx={{ bgcolor: '#C8A96A', py: 1.5, borderRadius: '12px', fontWeight: 800, color: '#0D0D0D', '&:hover': { bgcolor: '#D4AF37' } }}>
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Synchronize Ranks'}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* User Search & Drill-down */}
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                User Performance Lookup
            </Typography>
            <Paper sx={{ p: 1, bgcolor: '#1A1A1A', borderRadius: '24px', border: '1px solid rgba(200,169,106,0.2)', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
                    <TextField 
                        fullWidth 
                        placeholder="Search by Member ID, Username, or Database ID..." 
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
                        sx={{ 
                            '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: '#C8A96A' } },
                            '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.3)', opacity: 1 }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search className="text-slate-500" size={20} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button onClick={handleUserSearch} disabled={loading} color="inherit" sx={{ bgcolor: 'white', color: 'black', px: 4, borderRadius: '14px', fontWeight: 900, '&:hover': { bgcolor: '#F5E6C8' } }}>
                        Search
                    </Button>
                </Box>
            </Paper>

            {selectedUser && (
                <UserDashboardPreview userId={selectedUser._id} />
            )}
        </Box>
    );
};

export default MLMManagement;
