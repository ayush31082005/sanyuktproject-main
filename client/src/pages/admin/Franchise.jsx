import React, { useEffect, useState } from "react";
import api from "../../api";
import { motion as Motion } from 'framer-motion';
import { Building2, Plus, Eye, EyeOff, Copy, CheckCircle } from "lucide-react";

const AdminFranchise = () => {
    const [form, setForm] = useState({
        franchiseId: "",
        name: "",
        mobile: "",
        address: "",
        password: "",
    });

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({});
    const [copied, setCopied] = useState("");

    // =====================
    // INPUT CHANGE
    // =====================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // =====================
    // COPY TO CLIPBOARD
    // =====================
    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(""), 2000);
    };

    // =====================
    // ADD FRANCHISE
    // =====================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate form
            if (!form.franchiseId || !form.name || !form.mobile || !form.address || !form.password) {
                alert("Please fill all fields");
                setLoading(false);
                return;
            }

            await api.post("/franchises/add", form); // Note: franchises vs franchise

            alert("Franchise Added Successfully ✅");

            setForm({
                franchiseId: "",
                name: "",
                mobile: "",
                address: "",
                password: "",
            });

            loadData();

        } catch (err) {
            console.error("Add Error:", err);
            alert(err.response?.data?.message || "Error Adding Franchise");
        } finally {
            setLoading(false);
        }
    };

    // =====================
    // ADMIN LIST
    // =====================
    const loadData = async () => {
        try {
            const res = await api.get("/franchises/admin-list"); // Note: franchises vs franchise
            setList(res.data);
        } catch (err) {
            console.error("Load Error:", err);
            alert("Error loading franchise list");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Toggle password visibility
    const togglePassword = (id) => {
        setShowPasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A96A]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#F5E6C8] tracking-tight flex items-center gap-3">
                        <div className="p-3 bg-[#0D0D0D] rounded-xl border border-[#C8A96A]/20 text-[#C8A96A]">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <span className="text-[#F5E6C8]">Admin Franchise Panel</span>
                    </h1>
                    <p className="text-[#F5E6C8]/40 mt-2 text-sm font-medium">Manage your franchise partners</p>
                </Motion.div>

                {/* Add Franchise Form */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="luxury-box p-6 md:p-8 mb-8 shadow-2xl"
                >
                    <h2 className="text-xl font-serif font-bold text-[#F5E6C8] tracking-tight mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-[#C8A96A]" />
                        Add New Franchise
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Franchise ID */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#C8A96A] mb-2">
                                Franchise ID
                            </label>
                            <input
                                type="text"
                                name="franchiseId"
                                value={form.franchiseId}
                                onChange={handleChange}
                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl px-4 py-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-medium text-sm"
                                placeholder="Enter Franchise ID"
                                required
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#C8A96A] mb-2">
                                Franchise Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl px-4 py-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-medium text-sm"
                                placeholder="Enter Name"
                                required
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#C8A96A] mb-2">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={form.mobile}
                                onChange={handleChange}
                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl px-4 py-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-medium text-sm"
                                placeholder="Enter Mobile"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#C8A96A] mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl px-4 py-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-medium text-sm"
                                placeholder="Enter Address"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#C8A96A] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-xl px-4 py-3 text-[#F5E6C8] placeholder:text-[#F5E6C8]/20 focus:border-[#C8A96A] outline-none transition-all font-medium text-sm"
                                placeholder="Enter Password"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full luxury-button flex items-center justify-center gap-2 !py-4"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-[#C8A96A] border-t-transparent rounded-full animate-spin"></div>
                                        Adding...
                                    </>
                                ) : (
                                    "Add Franchise"
                                )}
                            </button>
                        </div>
                    </form>
                </Motion.div>

                {/* Franchise List */}
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="luxury-box p-6 md:p-8 shadow-2xl"
                >
                    <h3 className="text-xl font-serif font-bold text-[#F5E6C8] tracking-tight mb-6">
                        Franchise List (Admin Only)
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0D0D0D] border-b border-[#C8A96A]/30">
                                    <th className="p-5 text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.2em] whitespace-nowrap">ID</th>
                                    <th className="p-5 text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.2em] whitespace-nowrap">Name</th>
                                    <th className="p-5 text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.2em] whitespace-nowrap">Mobile</th>
                                    <th className="p-5 text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.2em] whitespace-nowrap">Address</th>
                                    <th className="p-5 text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.2em] whitespace-nowrap">Password</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-16 text-center text-[#F5E6C8]/40 font-medium">
                                            No franchises found
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((item, index) => (
                                        <Motion.tr
                                            key={item._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-[#C8A96A]/10 hover:bg-[#C8A96A]/[0.02] transition-colors"
                                        >
                                            <td className="p-5 text-sm font-bold text-[#F5E6C8]">{item.franchiseId}</td>
                                            <td className="p-5 text-sm text-[#F5E6C8]/70">{item.name}</td>
                                            <td className="p-5 text-sm text-[#F5E6C8]/70">{item.mobile}</td>
                                            <td className="p-5 text-sm text-[#F5E6C8]/70">{item.address}</td>
                                            <td className="p-5 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-[#F5E6C8]/70">
                                                        {showPasswords[item._id] ? item.password : "••••••••"}
                                                    </span>
                                                    <button
                                                        onClick={() => togglePassword(item._id)}
                                                        className="text-[#C8A96A]/60 hover:text-[#C8A96A] transition-colors"
                                                    >
                                                        {showPasswords[item._id] ?
                                                            <EyeOff className="w-4 h-4" /> :
                                                            <Eye className="w-4 h-4" />
                                                        }
                                                    </button>
                                                    <button
                                                        onClick={() => copyToClipboard(item.password, item._id)}
                                                        className={`transition-colors ${copied === item._id ? 'text-green-500' : 'text-[#C8A96A]/60 hover:text-[#C8A96A]'} `}
                                                    >
                                                        {copied === item._id ?
                                                            <CheckCircle className="w-4 h-4" /> :
                                                            <Copy className="w-4 h-4" />
                                                        }
                                                    </button>
                                                </div>
                                            </td>
                                        </Motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 pt-6 border-t border-[#C8A96A]/10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F5E6C8]/40">
                            Total Franchises: <span className="font-bold text-[#C8A96A]">{list.length}</span>
                        </p>
                    </div>
                </Motion.div>
            </div>
        </div>
    );
};

export default AdminFranchise;