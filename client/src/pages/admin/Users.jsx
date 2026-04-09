import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Grid, Box, TextField, Divider, Paper
} from '@mui/material';
import { RefreshCw, Trash2, Edit2, ShieldAlert, CheckCircle, User as UserIcon, Lock, Save, X, Activity } from 'lucide-react';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        status: ""
    });

    // KYC State
    const [kycDialogOpen, setKycDialogOpen] = useState(false);
    const [selectedUserForKyc, setSelectedUserForKyc] = useState(null);
    const [kycRejectReason, setKycRejectReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);

    // ================= FETCH USERS =================
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");

            if (response.data.users) {
                setUsers(response.data.users);
            } else if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else if (response.data.data) {
                setUsers(response.data.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Fetch error:", error.response?.data || error.message);
            if (error.response?.status === 403) {
                setError("Permission denied. Please log out and log back in to refresh your session.");
            } else if (error.response?.status === 401) {
                setError("Session expired. Please login again.");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError("Failed to fetch users. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ================= DELETE USER =================
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            setError("");
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
            if (error.response?.status === 403) {
                setError("Admin access only. You don't have permission.");
            } else if (error.response?.status === 404) {
                setError("User not found.");
            } else {
                setError("Delete failed. Please try again.");
            }
        }
    };

    // ================= EDIT CLICK =================
    const handleEditClick = (user) => {
        setEditingUser(user._id);
        setFormData({
            name: user.name || "",
            email: user.email || "",
            role: user.role || "user",
            status: user.status || "active"
        });
    };

    // ================= UPDATE USER =================
    const handleUpdate = async () => {
        try {
            setError("");
            await api.put(`/admin/users/${editingUser}`, formData);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error("Update error:", error.response?.data || error.message);
            if (error.response?.status === 403) {
                setError("Admin access only.");
            } else if (error.response?.status === 404) {
                setError("User not found.");
            } else {
                setError("Update failed.");
            }
        }
    };

    // ================= CANCEL EDIT =================
    const handleCancelEdit = () => {
        setEditingUser(null);
        setFormData({ name: "", email: "", role: "", status: "" });
    };

    // ================= HANDLE INPUT CHANGE =================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ================= KYC HANDLERS =================
    const handleOpenKyc = (user) => {
        setSelectedUserForKyc(user);
        setKycRejectReason(user.kycMessage || "");
        setIsRejecting(false);
        setKycDialogOpen(true);
    };

    const handleCloseKyc = () => {
        setKycDialogOpen(false);
        setSelectedUserForKyc(null);
    };

    const handleUpdateKycStatus = async (status) => {
        if (status === 'Rejected' && !kycRejectReason.trim()) {
            setError("Please provide a rejection reason.");
            setKycDialogOpen(false);
            window.scrollTo(0, 0);
            return;
        }

        try {
            setError("");
            await api.put(`/admin/users/${selectedUserForKyc._id}`, {
                kycStatus: status,
                kycMessage: status === 'Rejected' ? kycRejectReason : ""
            });
            handleCloseKyc();
            fetchUsers();
        } catch (error) {
            console.error("Update KYC error:", error.response?.data || error.message);
            setError("Failed to update KYC status.");
            setKycDialogOpen(false);
            window.scrollTo(0, 0);
        }
    };

    // ================= LOGOUT =================
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // ================= THEME BADGES =================
    const getStatusBadge = (status) => {
        const s = status?.toLowerCase();
        if (s === 'active') return "bg-[#C8A96A]/10 text-[#C8A96A] border-[#C8A96A]/30";
        if (s === 'inactive') return "bg-red-900/20 text-red-400 border-red-500/30";
        if (s === 'pending') return "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30";
        return "bg-[#0D0D0D] text-[#F5E6C8]/40 border-[#C8A96A]/20";
    };

    const getRoleBadge = (role) => {
        const r = role?.toLowerCase();
        if (r === 'admin') return "bg-[#C8A96A]/20 text-[#D4AF37] border-[#C8A96A]/50 font-black shadow-[0_0_10px_rgba(200,169,106,0.2)]";
        if (r === 'premium') return "bg-[#C8A96A]/10 text-[#C8A96A] border-[#C8A96A]/30";
        return "bg-[#0D0D0D] text-[#F5E6C8]/60 border-[#C8A96A]/20";
    };

    const getKycStatusBadge = (status) => {
        if (status === 'Verified') return "bg-[#C8A96A]/10 text-[#C8A96A] border-[#C8A96A]/30";
        if (status === 'Rejected') return "bg-red-900/20 text-red-400 border-red-500/30";
        if (status === 'Submitted') return "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30";
        return "bg-[#0D0D0D] text-[#F5E6C8]/40 border-[#C8A96A]/20";
    };

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 pb-12">
            {/* Header */}
            <div className="bg-[#121212] border-b border-[#C8A96A]/30 px-8 py-6 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A96A]/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0D0D0D] border border-[#C8A96A]/30 flex items-center justify-center shadow-gold-900/20">
                        <Lock className="w-5 h-5 text-[#C8A96A]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="m-0 text-2xl font-serif text-[#F5E6C8] tracking-tight">Sanyukt <span className="text-[#C8A96A]">Parivar</span></h1>
                        <p className="m-0 mt-1 text-[#C8A96A]/60 text-[10px] uppercase font-black tracking-widest">
                            Logged in as: {currentUser.name || 'Admin'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="relative z-10 px-6 py-2 border border-[#C8A96A]/30 text-[#C8A96A] text-[10px] uppercase font-black tracking-widest hover:bg-[#C8A96A] hover:text-[#0D0D0D] transition-all rounded-full"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 relative z-10">
                {/* Dashboard Header */}
                <div className="luxury-box p-8 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-2xl gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#0D0D0D] rounded-xl border border-[#C8A96A]/20 text-[#C8A96A]">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="m-0 text-3xl font-serif text-[#F5E6C8] tracking-tight">User <span className="text-[#C8A96A]">Management</span></h2>
                            <p className="m-0 mt-2 text-[#F5E6C8]/40 text-sm font-medium">
                                Manage all registered users
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="luxury-button flex items-center gap-3 !py-3 !px-6"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? "Loading..." : "Refresh"}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-5 bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 animate-slide-down">
                        <ShieldAlert className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Stats */}
                {!loading && users.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: 'Total Users', value: users.length, icon: Activity },
                            { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Lock },
                            { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: CheckCircle },
                            { label: 'Pending KYC', value: users.filter(u => u.status === 'pending').length, icon: RefreshCw }
                        ].map((stat, i) => (
                            <div key={i} className="luxury-box p-6 flex items-center gap-5 group hover:border-[#C8A96A]/60 transition-all duration-500">
                                <div className="p-4 bg-[#0D0D0D] rounded-xl border border-[#C8A96A]/10 text-[#C8A96A] group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-colors">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-3xl font-serif font-bold text-[#F5E6C8] tracking-tight">{stat.value}</div>
                                    <div className="text-[10px] font-black text-[#C8A96A]/60 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Users Table */}
                <div className="luxury-box overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="text-center py-24">
                            <RefreshCw className="w-10 h-10 text-[#C8A96A] animate-spin mx-auto mb-4" />
                            <p className="text-[#F5E6C8]/40 text-sm font-black uppercase tracking-widest">Loading users...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0D0D0D] border-b border-[#C8A96A]/30">
                                        {['Name', 'Email', 'Role', 'Status', 'KYC', 'Actions'].map((head, i) => (
                                            <th key={i} className="p-5 text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.2em] whitespace-nowrap">
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-16 text-center text-[#F5E6C8]/40 font-medium">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user._id} className={`border-b border-[#C8A96A]/10 transition-colors ${editingUser === user._id ? 'bg-[#C8A96A]/5' : 'hover:bg-[#C8A96A]/[0.02]'}`}>
                                                <td className="p-5">
                                                    {editingUser === user._id ? (
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-lg px-3 py-2 text-[#F5E6C8] focus:border-[#C8A96A] outline-none text-sm transition-colors"
                                                        />
                                                    ) : (
                                                        <span className="font-bold text-[#F5E6C8]">{user.name || "Unknown"}</span>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    {editingUser === user._id ? (
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-lg px-3 py-2 text-[#F5E6C8] focus:border-[#C8A96A] outline-none text-sm transition-colors"
                                                        />
                                                    ) : (
                                                        <span className="text-[#F5E6C8]/70 text-sm">{user.email || "N/A"}</span>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    {editingUser === user._id ? (
                                                        <select
                                                            name="role"
                                                            value={formData.role}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-lg px-3 py-2 text-[#F5E6C8] focus:border-[#C8A96A] outline-none text-sm appearance-none"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="premium">Premium</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-3 py-1 text-[9px] uppercase tracking-widest border rounded-full ${getRoleBadge(user.role)}`}>
                                                            {user.role || "user"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    {editingUser === user._id ? (
                                                        <select
                                                            name="status"
                                                            value={formData.status}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-lg px-3 py-2 text-[#F5E6C8] focus:border-[#C8A96A] outline-none text-sm appearance-none"
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                            <option value="pending">Pending</option>
                                                        </select>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-[#C8A96A] animate-pulse' : 'bg-red-500'}`}></div>
                                                            <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest border rounded-full ${getStatusBadge(user.status)}`}>
                                                                {user.status || "active"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    <span className={`px-3 py-1 text-[9px] uppercase tracking-widest border rounded-full ${getKycStatusBadge(user.kycStatus)}`}>
                                                        {user.kycStatus || "Pending"}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    {editingUser === user._id ? (
                                                        <div className="flex gap-2">
                                                            <button onClick={handleUpdate} className="p-2 bg-[#C8A96A]/10 text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#0D0D0D] rounded-lg transition-colors border border-[#C8A96A]/30" title="Save">
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={handleCancelEdit} className="p-2 bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/30" title="Cancel">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-3">
                                                            <button onClick={() => handleEditClick(user)} className="text-[#C8A96A]/60 hover:text-[#C8A96A] transition-colors" title="Edit">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleOpenKyc(user)} className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors" title="KYC">
                                                                <Activity className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(user._id)} className="text-red-500/60 hover:text-red-400 transition-colors" title="Delete">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center border-t border-[#C8A96A]/10 pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F5E6C8]/20">
                        © 2024 Sanyukt Parivar. All rights reserved.
                    </p>
                </div>
            </div>

            {/* KYC Dialog heavily customized for Dark Theme */}
            <Dialog 
                open={kycDialogOpen} 
                onClose={handleCloseKyc} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#121212',
                        color: '#F5E6C8',
                        border: '1px solid rgba(200, 169, 106, 0.3)',
                        borderRadius: '12px',
                        backgroundImage: 'none',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    borderBottom: '1px solid rgba(200, 169, 106, 0.1)', 
                    pb: 3, pt: 4, px: 4,
                    display: 'flex', alignItems: 'center', gap: 2
                }}>
                    <div className="w-10 h-10 rounded-full bg-[#0D0D0D] border border-[#C8A96A]/30 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-[#C8A96A]" />
                    </div>
                    <div>
                        <Typography variant="h5" sx={{ fontFamily: 'serif', color: '#F5E6C8', fontWeight: 'bold' }}>
                            KYC Details
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(200,169,106,0.6)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900, fontSize: '10px' }}>
                            User: {selectedUserForKyc?.name}
                        </Typography>
                    </div>
                </DialogTitle>

                <DialogContent sx={{ p: 4 }}>
                    {selectedUserForKyc && (
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <div className="bg-[#0D0D0D] p-5 rounded-xl border border-[#C8A96A]/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/60 mb-1">Aadhar Number</p>
                                    <p className="text-[#F5E6C8] font-bold font-mono tracking-wider">{selectedUserForKyc.aadharNumber || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div className="bg-[#0D0D0D] p-5 rounded-xl border border-[#C8A96A]/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/60 mb-1">PAN Number</p>
                                    <p className="text-[#F5E6C8] font-bold font-mono tracking-wider">{selectedUserForKyc.panNumber || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div className="bg-[#0D0D0D] p-5 rounded-xl border border-[#C8A96A]/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/60 mb-1">Nominee Name</p>
                                    <p className="text-[#F5E6C8] font-bold tracking-wider">{selectedUserForKyc.nominee?.name || 'N/A'}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div className="bg-[#0D0D0D] p-5 rounded-xl border border-[#C8A96A]/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/60 mb-1">Nominee Relation</p>
                                    <p className="text-[#F5E6C8] font-bold tracking-wider">{selectedUserForKyc.nominee?.relation || 'N/A'}</p>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex items-center gap-4 mt-2 mb-2">
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#C8A96A]/30 to-[#C8A96A]/30 flex-1"></div>
                                    <span className="text-[#C8A96A] text-[10px] font-black uppercase tracking-widest">Bank Details</span>
                                    <div className="h-px bg-gradient-to-r from-[#C8A96A]/30 via-[#C8A96A]/30 to-transparent flex-1"></div>
                                </div>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" sx={{ color: 'rgba(200,169,106,0.6)', textTransform: 'uppercase', fontSize: '9px', fontWeight: 900, letterSpacing: '1px' }}>Account Number</Typography>
                                <Typography variant="body1" sx={{ color: '#F5E6C8', fontWeight: 500 }}>{selectedUserForKyc.bankDetails?.accountNumber || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" sx={{ color: 'rgba(200,169,106,0.6)', textTransform: 'uppercase', fontSize: '9px', fontWeight: 900, letterSpacing: '1px' }}>IFSC Code</Typography>
                                <Typography variant="body1" sx={{ color: '#F5E6C8', fontWeight: 500 }}>{selectedUserForKyc.bankDetails?.ifscCode || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" sx={{ color: 'rgba(200,169,106,0.6)', textTransform: 'uppercase', fontSize: '9px', fontWeight: 900, letterSpacing: '1px' }}>Bank Name</Typography>
                                <Typography variant="body1" sx={{ color: '#F5E6C8', fontWeight: 500 }}>{selectedUserForKyc.bankDetails?.bankName || 'N/A'}</Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="flex items-center gap-4 mt-2 mb-2">
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#C8A96A]/30 to-[#C8A96A]/30 flex-1"></div>
                                    <span className="text-[#C8A96A] text-[10px] font-black uppercase tracking-widest">KYC Documents</span>
                                    <div className="h-px bg-gradient-to-r from-[#C8A96A]/30 via-[#C8A96A]/30 to-transparent flex-1"></div>
                                </div>
                            </Grid>

                            {['aadharFront', 'aadharBack', 'panCard', 'passbook'].map((docKey) => (
                                <Grid item xs={12} sm={6} md={3} key={docKey}>
                                    <div className="bg-[#0D0D0D] p-3 rounded-xl border border-[#C8A96A]/10 text-center h-32 flex flex-col items-center justify-center hover:border-[#C8A96A]/40 transition-colors group">
                                        <Typography variant="caption" sx={{ mb: 2, display: 'block', color: '#F5E6C8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {docKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </Typography>
                                        {selectedUserForKyc.kycDocuments?.[docKey] ? (
                                            <a href={selectedUserForKyc.kycDocuments[docKey]} target="_blank" rel="noreferrer" className="relative overflow-hidden rounded-lg group-hover:shadow-[0_0_15px_rgba(200,169,106,0.3)] transition-all">
                                                <img
                                                    src={selectedUserForKyc.kycDocuments[docKey]}
                                                    alt={docKey}
                                                    className="max-h-[60px] max-w-full object-contain filter group-hover:brightness-110 transition-all opacity-80 group-hover:opacity-100"
                                                />
                                            </a>
                                        ) : (
                                            <Typography variant="body2" sx={{ color: 'rgba(245, 230, 200, 0.2)', fontStyle: 'italic', fontSize: '11px' }}>Not Found</Typography>
                                        )}
                                    </div>
                                </Grid>
                            ))}

                            {isRejecting && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Rejection Reason"
                                        multiline
                                        rows={3}
                                        value={kycRejectReason}
                                        onChange={(e) => setKycRejectReason(e.target.value)}
                                        required
                                        error={!kycRejectReason.trim()}
                                        helperText={!kycRejectReason.trim() ? "Reason is required" : ""}
                                        sx={{
                                            mt: 2,
                                            '& .MuiOutlinedInput-root': {
                                                color: '#F5E6C8',
                                                backgroundColor: '#0D0D0D',
                                                borderRadius: '12px',
                                                '& fieldset': { borderColor: 'rgba(200, 169, 106, 0.2)' },
                                                '&:hover fieldset': { borderColor: '#C8A96A' },
                                                '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
                                            },
                                            '& .MuiInputLabel-root': { color: 'rgba(200, 169, 106, 0.6)' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#C8A96A' },
                                            '& .MuiFormHelperText-root.Mui-error': { color: '#ef4444' }
                                        }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ p: 3, px: 4, borderTop: '1px solid rgba(200, 169, 106, 0.1)', backgroundColor: '#0A0A0A' }}>
                    <button onClick={handleCloseKyc} className="px-5 py-2 text-[10px] uppercase tracking-widest font-black text-[#F5E6C8]/40 hover:text-[#F5E6C8] transition-colors">
                        Cancel
                    </button>
                    {!isRejecting ? (
                        <div className="flex gap-3 ml-auto">
                            <button onClick={() => setIsRejecting(true)} className="px-5 py-2 rounded-lg border border-red-500/30 text-red-500 text-[10px] uppercase tracking-widest font-black hover:bg-red-500 hover:text-white transition-all">
                                Reject
                            </button>
                            <button onClick={() => handleUpdateKycStatus('Verified')} className="px-5 py-2 rounded-lg bg-[#C8A96A] text-[#0D0D0D] text-[10px] uppercase tracking-widest font-black hover:bg-[#D4AF37] transition-all shadow-[0_0_15px_rgba(200,169,106,0.3)]">
                                Verify Identity
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3 ml-auto">
                            <button onClick={() => setIsRejecting(false)} className="px-5 py-2 border border-[#C8A96A]/30 rounded-lg text-[#C8A96A] text-[10px] uppercase tracking-widest font-black hover:bg-[#C8A96A]/10 transition-colors">
                                Back
                            </button>
                            <button onClick={() => handleUpdateKycStatus('Rejected')} className="px-5 py-2 rounded-lg bg-red-600 text-white text-[10px] uppercase tracking-widest font-black hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                Reject
                            </button>
                        </div>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AdminUsers;
