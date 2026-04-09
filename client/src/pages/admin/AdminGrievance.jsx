import { useEffect, useState } from "react";
import api from "../../api";
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldAlert, Search, RefreshCw, CheckCircle, Clock, 
    Activity, LayoutList, Fingerprint, Phone, Mail, 
    Tag, MessageSquare, Shield, AlertTriangle
} from "lucide-react";

const AdminGrievance = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchData = async () => {
        setLoading(true);
        try {
            console.log("Fetching grievances...");
            const res = await api.get("/grievance/all");
            console.log("✅ API Response:", res);
            console.log("✅ Data received:", res.data);
            console.log("✅ Number of items:", res.data.length);

            if (res.data.length > 0) {
                console.log("✅ First item sample:", res.data[0]);
            } else {
                console.log("⚠️ No data received from API");
            }

            setData(res.data);
            setFilteredData(res.data);
        } catch (error) {
            console.error("❌ Error fetching grievances:", error);
            console.error("❌ Error response:", error.response);
            console.error("❌ Error message:", error.message);
            showSnackbar(error.response?.data?.message || 'Error fetching grievances', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
        setTimeout(() => setSnackbar({ open: false, message: '', severity: 'success' }), 3000);
    };

    const updateStatus = async (id, status) => {
        try {
            const grievance = data.find(item => item._id === id);
            console.log("Updating status for:", grievance.ticket, "to:", status);

            const res = await api.post("/grievance/update", {
                ticket: grievance.ticket,
                status
            });

            if (res.data.success) {
                showSnackbar('Status updated successfully!', 'success');
                fetchData();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            showSnackbar(error.response?.data?.msg || 'Error updating status', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.ticket?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sellerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'All') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        setFilteredData(filtered);
    }, [searchTerm, statusFilter, data]);

    const handleRefresh = () => {
        fetchData();
        showSnackbar('Data refreshed!', 'success');
    };

    const stats = {
        total: data.length,
        pending: data.filter(item => item.status === 'Pending').length,
        inProgress: data.filter(item => item.status === 'In Progress').length,
        resolved: data.filter(item => item.status === 'Resolved').length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center font-sans">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-[#C8A96A] animate-spin mx-auto mb-4" />
                    <p className="text-[#F5E6C8]/60 text-sm font-black uppercase tracking-widest animate-pulse">Loading grievances...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 pb-12 relative overflow-hidden">
            {/* Elegant Background Elements */}
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-[#C8A96A]/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10">
                {/* Header Section */}
                <Motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="luxury-box p-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-2xl gap-4 border border-[#C8A96A]/30"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(200,169,106,0.15)]">
                            <Shield className="w-7 h-7 text-[#C8A96A]" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#F5E6C8] tracking-tight m-0">
                                Grievance Management
                            </h1>
                            <p className="mt-1 text-[#F5E6C8]/40 text-sm font-medium">
                                Manage and track all user grievances
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="luxury-button flex items-center gap-3 !py-3 !px-6"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </Motion.div>

                {/* Stats Cards */}
                <Motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8"
                >
                    {[
                        { label: 'Total', value: stats.total, color: 'text-[#C8A96A]', bg: 'bg-[#C8A96A]/10', icon: LayoutList },
                        { label: 'Pending', value: stats.pending, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', icon: Clock },
                        { label: 'In Progress', value: stats.inProgress, color: 'text-[#F5E6C8]', bg: 'bg-[#F5E6C8]/10', icon: Activity },
                        { label: 'Resolved', value: stats.resolved, color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle }
                    ].map((stat, i) => (
                        <div key={i} className="luxury-box p-6 flex items-center gap-4 group hover:border-[#C8A96A]/60 transition-all duration-500 shadow-xl">
                            <div className={`p-4 rounded-xl border border-[#C8A96A]/20 transition-colors ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className={`text-3xl font-serif font-bold tracking-tight ${stat.color}`}>{stat.value}</div>
                                <div className="text-[10px] font-black text-[#F5E6C8]/40 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </Motion.div>

                {/* Search and Filters */}
                <Motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="luxury-box p-5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xl"
                >
                    <div className="w-full md:w-5/12 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A96A]/40 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, ticket, seller ID, mobile, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl pl-12 pr-4 py-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/30 focus:border-[#C8A96A] outline-none text-sm transition-colors"
                        />
                    </div>
                    
                    <div className="w-full md:w-3/12 relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl px-4 py-3 text-[#F5E6C8] focus:border-[#C8A96A] outline-none text-sm appearance-none cursor-pointer transition-colors"
                        >
                            <option value="All">Filter by Status - All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C8A96A] pointer-events-none text-xs font-black">▼</div>
                    </div>

                    <div className="w-full md:w-4/12 text-left md:text-right text-sm text-[#F5E6C8]/40 font-black uppercase tracking-widest">
                        Showing {filteredData.length} of {data.length} grievances
                    </div>
                </Motion.div>

                {/* Debug Info */}
                {data.length === 0 && !loading && (
                    <Motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="p-6 mb-8 border border-red-500/30 bg-red-900/10 rounded-2xl shadow-xl"
                    >
                        <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            ⚠️ Debug Information - No Data Found
                        </h3>
                        <ul className="text-[#F5E6C8]/70 text-sm space-y-2 mb-6 ml-6 list-none">
                            <li>1. Check if backend is running on correct port</li>
                            <li>2. Check MongoDB connection</li>
                            <li>3. Check if any grievances exist in database</li>
                            <li>4. API endpoint: /grievance/all</li>
                        </ul>
                        <button onClick={fetchData} className="px-6 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-100 rounded-lg text-sm font-bold border border-red-500/30 transition-colors">
                            Retry Fetch
                        </button>
                    </Motion.div>
                )}

                {/* Grievance List */}
                {filteredData.length === 0 && data.length > 0 ? (
                    <Motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="luxury-box p-16 text-center shadow-2xl"
                    >
                        <ShieldAlert className="w-16 h-16 text-[#C8A96A]/20 mx-auto mb-4" />
                        <h3 className="text-xl font-serif font-bold text-[#F5E6C8] mb-2">No grievances found</h3>
                        <p className="text-[#F5E6C8]/40 text-sm">{searchTerm || statusFilter !== 'All' ? 'Try adjusting your filters' : 'New grievances will appear here'}</p>
                    </Motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData.map((item, index) => (
                            <Motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="luxury-box group hover:border-[#C8A96A]/50 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col"
                            >
                                {/* Card Header */}
                                <div className="p-5 border-b border-[#C8A96A]/10 bg-[#121212] relative flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#0D0D0D] border border-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] text-sm font-serif font-bold group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-colors">
                                            {(item.name || 'A').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#F5E6C8] m-0 text-sm tracking-wide">{item.name || 'Anonymous'}</h3>
                                            <p className="text-[#C8A96A]/80 text-xs font-mono mt-0.5">{item.ticket || 'No ticket'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className={`px-2.5 py-1 text-[9px] uppercase tracking-widest border rounded border-[#C8A96A]/30 flex items-center gap-1.5 font-bold ${
                                        item.status === 'Resolved' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                                        item.status === 'In Progress' ? 'bg-[#C8A96A]/10 text-[#C8A96A] border-[#C8A96A]/30' :
                                        'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
                                    }`}>
                                        {item.status === 'Resolved' && <CheckCircle className="w-3 h-3" />}
                                        {item.status === 'In Progress' && <Activity className="w-3 h-3 animate-pulse" />}
                                        {item.status === 'Pending' && <Clock className="w-3 h-3" />}
                                        {item.status}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 bg-[#0D0D0D]">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Fingerprint className="w-4 h-4 text-[#C8A96A]/60 shrink-0" />
                                            <span className="text-[#F5E6C8]/40 w-16 text-xs uppercase tracking-widest font-black">Seller ID:</span>
                                            <span className="text-[#F5E6C8] font-mono break-all">{item.sellerId || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-4 h-4 text-[#C8A96A]/60 shrink-0" />
                                            <span className="text-[#F5E6C8]/40 w-16 text-xs uppercase tracking-widest font-black">Mobile:</span>
                                            <span className="text-[#F5E6C8] break-all">{item.mobile || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-4 h-4 text-[#C8A96A]/60 shrink-0" />
                                            <span className="text-[#F5E6C8]/40 w-16 text-xs uppercase tracking-widest font-black">Email:</span>
                                            <span className="text-[#F5E6C8] break-all text-xs">{item.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Tag className="w-4 h-4 text-[#C8A96A]/60 shrink-0" />
                                            <span className="text-[#F5E6C8]/40 w-16 text-xs uppercase tracking-widest font-black">Category:</span>
                                            <span className={`text-[#F5E6C8] text-xs px-2 py-0.5 rounded bg-[#C8A96A]/10 border border-[#C8A96A]/20`}>{item.category || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[#C8A96A]/10 my-4 w-full"></div>

                                    <div className="mb-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A] mb-1">Subject:</div>
                                        <div className="text-[#F5E6C8] font-medium text-sm leading-snug">{item.subject || 'No subject'}</div>
                                    </div>

                                    {item.message && (
                                        <div className="mt-3 relative pl-3 border-l-2 border-[#C8A96A]/20">
                                            <MessageSquare className="w-3 h-3 text-[#C8A96A]/40 absolute -left-[7px] bg-[#0D0D0D] py-0.5" />
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/40 mb-1">Message:</div>
                                            <div className="text-[#F5E6C8]/70 text-sm leading-relaxed line-clamp-3 italic">
                                                "{item.message}"
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer & Actions */}
                                <div className="p-4 border-t border-[#C8A96A]/10 bg-[#121212] mt-auto">
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={item.status}
                                            onChange={(e) => updateStatus(item._id, e.target.value)}
                                            className="flex-1 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-lg px-3 py-2 text-[#F5E6C8] focus:border-[#C8A96A] transition-colors outline-none text-xs font-bold uppercase tracking-wider cursor-pointer appearance-none text-center"
                                        >
                                            <option value="Pending">⏱ Pending</option>
                                            <option value="In Progress">⚡ In Progress</option>
                                            <option value="Resolved">✓ Resolved</option>
                                        </select>
                                    </div>
                                    {item.createdAt && (
                                        <div className="text-center mt-3 text-[9px] uppercase tracking-[0.2em] text-[#F5E6C8]/30 font-black">
                                            Created: {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Snackbar Notification */}
            <AnimatePresence>
                {snackbar.open && (
                    <Motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
                            snackbar.severity === 'error' ? 'bg-red-900 border-red-500/50 text-red-100' : 'bg-[#121212] border-[#C8A96A]/40 text-[#F5E6C8]'
                        }`}
                    >
                        {snackbar.severity === 'error' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5 text-[#C8A96A]" />}
                        <span className="font-medium text-sm">{snackbar.message}</span>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminGrievance;