import React, { useEffect, useState } from "react";
import api, { API_URL } from "../../api";
import { Package, Search, Filter, Plus, X, Edit2, Trash2, CheckCircle, Image as ImageIcon, Star, AlertCircle, Save } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        oldPrice: "",
        bv: "",
        stock: "",
        category: "",
        description: "",
        rating: "",
        numReviews: "",
        isFeatured: false,
        paymentMethods: ["cod", "upi", "card"],
    });

    const categories = [
        "Mobile",
        "Electronics",
        "Fashion",
        "Beauty and cosmetic home based products",
        "Toys and baby toys",
        "Food & health",
        "Auto & accessories",
        "Sports & games",
        "Books & education",
        "Furniture",
        "Footwear",
        "Jwellery & accessories",
        "Appliances",
        "Pharmacy and household",
        "Everyday needs",
        "Grocery"
    ];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            oldPrice: "",
            bv: "",
            stock: "",
            category: "",
            description: "",
            rating: "",
            numReviews: "",
            isFeatured: false,
            paymentMethods: ["cod", "upi", "card"],
        });
        setSelectedImage(null);
        setImagePreview(null);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
            if (formData[key] !== "") {
                if (key === 'paymentMethods') {
                    // Send array properly depending on API implementation. usually JSON or repeated keys
                    formData.paymentMethods.forEach(method => {
                        formDataToSend.append('paymentMethods', method);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
        });

        if (selectedImage) {
            formDataToSend.append("image", selectedImage);
        }

        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Product updated successfully!");
            } else {
                await api.post("/products", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Product added successfully!");
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Error saving product");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);
        setFormData({
            name: product.name || "",
            price: product.price || "",
            oldPrice: product.oldPrice || "",
            bv: product.bv || "",
            stock: product.stock || "",
            category: product.category || "",
            description: product.description || "",
            rating: product.rating || "",
            numReviews: product.numReviews || "",
            isFeatured: product.isFeatured || false,
            paymentMethods: product.paymentMethods || ["cod", "upi", "card"],
        });

        if (product.image) {
            setImagePreview(`${API_URL}/uploads/${product.image}`);
        }

        setSelectedImage(null);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setLoading(true);
            try {
                await api.delete(`/products/${id}`);
                alert("Product deleted successfully!");
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Error deleting product");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 p-4 md:p-8">
            {/* Header section matches overall Elite Luxury style */}
            <div className="bg-[#121212] rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-[#C8A96A]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A96A]/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#0D0D0D] rounded-xl border border-[#C8A96A]/30 text-[#C8A96A] shadow-[0_0_15px_rgba(200,169,106,0.1)]">
                            <Package size={32} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-[#F5E6C8] tracking-tight">Product <span className="text-[#C8A96A]">Management</span></h1>
                            <p className="text-[#C8A96A]/60 text-[10px] uppercase font-black tracking-widest mt-1">Manage global inventory inventory</p>
                        </div>
                    </div>
                    
                    <button
                        className={`px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 transform transition-all duration-300 border shadow-lg ${showForm
                            ? "bg-red-900/20 text-red-400 border-red-500/30 hover:bg-red-900/40"
                            : "bg-[#C8A96A]/10 text-[#C8A96A] border-[#C8A96A]/30 hover:bg-[#C8A96A] hover:text-[#0D0D0D]"
                            }`}
                        onClick={() => {
                            if (showForm) resetForm();
                            else setShowForm(true);
                        }}
                    >
                        {showForm ? <X size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                        {showForm ? "Cancel Entry" : "Add Product"}
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className={`transition-all duration-500 overflow-hidden mb-8 ${showForm ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="bg-[#121212] rounded-2xl shadow-2xl p-6 md:p-8 border border-[#C8A96A]/20 relative">
                    <h2 className="text-xl font-serif text-[#F5E6C8] mb-8 pb-4 border-b border-[#C8A96A]/10 flex items-center gap-3">
                        {editingId ? <Edit2 size={20} className="text-[#C8A96A]" /> : <Plus size={20} className="text-[#C8A96A]" />}
                        {editingId ? "Modify Product Listing" : "Create New Product Listing"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            {/* Form Input fields */}
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80">Product Name <span className="text-red-500">*</span></label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Enter product name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-[#F5E6C8] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] transition-colors outline-none placeholder-[#F5E6C8]/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80">Category <span className="text-red-500">*</span></label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-[#F5E6C8] focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] transition-colors outline-none appearance-none"
                                >
                                    <option value="" disabled className="text-gray-500">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80">Selling Price (₹) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A96A] font-bold">₹</span>
                                    <input
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required min="0" step="0.01"
                                        className="w-full pl-8 pr-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-[#F5E6C8] focus:border-[#C8A96A] transition-colors outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80">Original Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C8A96A]/50 font-bold">₹</span>
                                    <input
                                        name="oldPrice"
                                        type="number"
                                        value={formData.oldPrice}
                                        onChange={handleChange}
                                        min="0" step="0.01"
                                        className="w-full pl-8 pr-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-[#F5E6C8] focus:border-[#C8A96A] transition-colors outline-none font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80">Stock Quantity <span className="text-red-500">*</span></label>
                                <input
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required min="0"
                                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-[#F5E6C8] focus:border-[#C8A96A] transition-colors outline-none font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80">Business Volume (BV) <span className="text-red-500">*</span></label>
                                <input
                                    name="bv"
                                    type="number"
                                    value={formData.bv}
                                    onChange={handleChange}
                                    required min="0" step="0.01"
                                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-[#F5E6C8] focus:border-[#C8A96A] transition-colors outline-none font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80">Rating (0-5)</label>
                                <input
                                    name="rating"
                                    type="number"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    min="0" max="5" step="0.1"
                                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-[#F5E6C8] focus:border-[#C8A96A] transition-colors outline-none font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80">Number of Reviews</label>
                                <input
                                    name="numReviews"
                                    type="number"
                                    value={formData.numReviews}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-[#F5E6C8] focus:border-[#C8A96A] transition-colors outline-none font-mono"
                                />
                            </div>

                            {/* Featured Toggle */}
                            <div className="space-y-2 flex items-center lg:col-span-3 bg-[#0D0D0D] p-4 rounded-xl border border-[#C8A96A]/20">
                                <label className="flex items-center gap-4 cursor-pointer w-full">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                                            className="sr-only"
                                        />
                                        <div className={`w-14 h-7 rounded-full transition-colors duration-300 border-2 ${formData.isFeatured ? 'bg-[#C8A96A] border-[#C8A96A]' : 'bg-[#121212] border-[#C8A96A]/30'}`}></div>
                                        <div className={`absolute top-1 left-1 bg-[#121212] w-5 h-5 rounded-full shadow-md transition-transform duration-300 ${formData.isFeatured ? 'translate-x-7 bg-[#121212]' : 'translate-x-0 bg-[#C8A96A]/50'}`}></div>
                                    </div>
                                    <span className="text-[11px] font-bold text-[#F5E6C8] uppercase tracking-widest flex items-center gap-2">
                                        <Star size={14} className={formData.isFeatured ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#C8A96A]/40"} />
                                        Feature on Homepage
                                    </span>
                                </label>
                            </div>

                            {/* Payment Methods */}
                            <div className="space-y-3 lg:col-span-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80 mb-2 block">
                                    Available Payment Methods <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-6 bg-[#0D0D0D] p-5 rounded-xl border border-[#C8A96A]/20">
                                    {[
                                        { id: 'cod', label: 'Cash on Delivery' },
                                        { id: 'upi', label: 'UPI Payment' },
                                        { id: 'card', label: 'Debit/Credit Card' }
                                    ].map(method => (
                                        <label key={method.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={formData.paymentMethods?.includes(method.id)}
                                                onChange={(e) => {
                                                    const newMethods = e.target.checked 
                                                        ? [...(formData.paymentMethods || []), method.id]
                                                        : (formData.paymentMethods || []).filter(m => m !== method.id);
                                                    setFormData({...formData, paymentMethods: newMethods});
                                                }}
                                                className="w-5 h-5 rounded bg-[#121212] border border-[#C8A96A]/50 checked:bg-[#C8A96A] checked:border-[#C8A96A] appearance-none relative flex items-center justify-center before:content-['✓'] before:text-[#121212] before:text-xs before:font-black before:opacity-0 checked:before:opacity-100 transition-all cursor-pointer"
                                            />
                                            <span className="text-xs font-bold text-[#F5E6C8]/70 group-hover:text-[#C8A96A] transition-colors">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                                {(formData.paymentMethods?.length === 0 || !formData.paymentMethods) && (
                                    <p className="text-[10px] text-red-500 font-bold tracking-widest flex items-center gap-1"><AlertCircle size={12}/> At least one payment method is required</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2 lg:col-span-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80">
                                    Detailed Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-xl text-[#F5E6C8] focus:border-[#C8A96A] transition-colors outline-none resize-none leading-relaxed"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-4 lg:col-span-3 bg-[#0D0D0D] p-6 rounded-xl border border-[#C8A96A]/20">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[#C8A96A]/80 block">
                                    Product Cover Image
                                </label>
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div>
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="inline-flex items-center gap-3 px-6 py-3 bg-[#C8A96A]/10 text-[#C8A96A] border border-[#C8A96A]/30 rounded-xl cursor-pointer hover:bg-[#C8A96A] hover:text-[#0D0D0D] transition-all font-bold text-xs uppercase tracking-widest"
                                        >
                                            <ImageIcon size={16} />
                                            {selectedImage ? "Change Image" : "Upload File"}
                                        </label>
                                        {selectedImage && (
                                            <p className="text-[10px] text-[#C8A96A]/60 mt-3 font-mono break-all max-w-[200px]">
                                                {selectedImage.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="relative group rounded-xl overflow-hidden border border-[#C8A96A]/30 bg-[#121212]">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-32 h-32 md:w-48 md:h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setImagePreview(null);
                                                    document.getElementById("image-upload").value = "";
                                                }}
                                                className="absolute top-2 right-2 w-8 h-8 bg-[#0D0D0D]/80 backdrop-blur-sm border border-[#C8A96A]/30 text-[#F5E6C8] rounded-full hover:bg-red-900/50 hover:text-red-400 hover:border-red-500/50 flex items-center justify-center transition-all"
                                            >
                                                <X size={14} strokeWidth={2.5}/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex gap-4 justify-end pt-6 border-t border-[#C8A96A]/10">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-[#0D0D0D] text-[#F5E6C8]/60 border border-[#C8A96A]/30 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:text-[#F5E6C8] hover:bg-[#C8A96A]/10 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-3 bg-[#C8A96A] text-[#0D0D0D] rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#D4AF37] transition-all shadow-[0_0_15px_rgba(200,169,106,0.3)] ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin"></div>
                                        Processing
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} strokeWidth={2.5} />
                                        {editingId ? "Update Product" : "Save Product"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Products List */}
            <div className="bg-[#121212] rounded-2xl shadow-2xl p-6 md:p-8 border border-[#C8A96A]/20 relative">
                <div className="flex justify-between items-center mb-8 border-b border-[#C8A96A]/10 pb-4">
                    <h2 className="text-xl font-serif text-[#F5E6C8] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/30 text-[#C8A96A] flex items-center justify-center">
                            <span className="text-sm font-black">{products.length}</span>
                        </div>
                        Inventory <span className="text-[#C8A96A]">Directory</span>
                    </h2>
                </div>

                {loading && !products.length ? (
                    <div className="text-center py-24">
                        <div className="w-12 h-12 border-2 border-[#C8A96A]/20 border-t-[#C8A96A] rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="text-[10px] text-[#C8A96A]/60 font-black uppercase tracking-[0.2em]">Synchronizing Inventory...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 bg-[#0D0D0D] rounded-xl border border-[#C8A96A]/10">
                        <Package size={48} strokeWidth={1} className="text-[#C8A96A]/30 mx-auto mb-4" />
                        <p className="text-sm text-[#F5E6C8]/40 font-medium">No products cataloged yet. Create an entry.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="group relative bg-[#0D0D0D] rounded-xl border border-[#C8A96A]/20 overflow-hidden hover:border-[#C8A96A]/50 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                            >
                                {/* Featured Ribbon */}
                                {product.isFeatured && (
                                    <div className="absolute top-4 -right-10 bg-[#C8A96A] text-[#0D0D0D] text-[9px] font-black uppercase tracking-widest py-1 px-10 transform rotate-45 z-10 shadow-lg">
                                        Featured
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-[#121212] border-b border-[#C8A96A]/10">
                                    {product.image ? (
                                        <img
                                            src={`${API_URL}/uploads/${product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/300x200/121212/C8A96A?text=Missing+Image";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-[#C8A96A]/20">
                                            <ImageIcon size={48} strokeWidth={1} />
                                            <p className="text-[10px] uppercase font-bold tracking-widest mt-2">No Visual</p>
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-[#0D0D0D]/80 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="w-10 h-10 rounded-full bg-[#C8A96A] text-[#0D0D0D] flex items-center justify-center hover:bg-[#D4AF37] hover:scale-110 transition-transform shadow-[0_0_15px_rgba(200,169,106,0.5)]"
                                            title="Edit Product"
                                        >
                                            <Edit2 size={16} strokeWidth={2.5} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                            title="Delete Product"
                                        >
                                            <Trash2 size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>

                                    {/* Stock Badge */}
                                    <div className={`absolute bottom-3 left-3 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${product.stock > 0
                                        ? "bg-green-900/60 text-green-400 border-green-500/30"
                                        : "bg-red-900/60 text-red-400 border-red-500/30"
                                        }`}>
                                        {product.stock > 0 ? `${product.stock} In Stock` : "Depleted"}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="p-5">
                                    <div className="mb-3">
                                        <span className="text-[9px] font-black text-[#C8A96A]/60 px-2 py-0.5 rounded border border-[#C8A96A]/20 uppercase tracking-widest">
                                            {product.category || "Uncategorized"}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-serif font-bold text-[#F5E6C8] mb-3 line-clamp-1 group-hover:text-[#C8A96A] transition-colors">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-xl font-bold text-[#10b981]">
                                            ₹{parseFloat(product.price).toLocaleString('en-IN')}
                                        </span>
                                        {product.oldPrice && parseFloat(product.oldPrice) > parseFloat(product.price) && (
                                            <span className="text-[11px] text-[#F5E6C8]/40 line-through font-mono">
                                                ₹{parseFloat(product.oldPrice).toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-2 gap-2 mb-4 pt-4 border-t border-[#C8A96A]/10">
                                        <div className="bg-[#121212] p-2 rounded border border-[#C8A96A]/5">
                                            <p className="text-[9px] text-[#C8A96A]/50 uppercase font-black mb-1">Volumetrics</p>
                                            <p className="text-xs font-mono text-[#F5E6C8]">{product.bv} BV</p>
                                        </div>
                                        <div className="bg-[#121212] p-2 rounded border border-[#C8A96A]/5">
                                            <p className="text-[9px] text-[#C8A96A]/50 uppercase font-black mb-1">Reception</p>
                                            <div className="flex items-center gap-1">
                                                <Star size={10} className="text-[#C8A96A] fill-[#C8A96A]" />
                                                <span className="text-xs font-mono text-[#F5E6C8]">{product.rating || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-[11px] text-[#F5E6C8]/50 line-clamp-2 leading-relaxed h-8">
                                        {product.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className="mt-12 text-center pb-8 opacity-50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F5E6C8]/40">
                    © 2024 Sanyukt Parivar. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AdminProducts;
