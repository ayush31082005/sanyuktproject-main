import React, { useState, useEffect } from "react";
import api, { API_URL } from "../../api";
import { 
    Newspaper, Plus, Trash2, Calendar, User, 
    Tag, Image as ImageIcon, X, Loader2, Search,
    Filter, MoreVertical, Edit, Clock
} from "lucide-react";
import toast from "react-hot-toast";

const AdminNews = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Product");
    const [readTime, setReadTime] = useState("5 min read");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            // Add a timestamp to bypass browser cache
            const { data } = await api.get(`/news?t=${new Date().getTime()}`);
            console.log("FETCHED NEWS LIST:", data.data);
            if (data.success) {
                setNewsList(data.data);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
            toast.error("Failed to load news items");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size should be less than 2MB");
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Image is required only when adding new
        if (!title || !content || (!image && !isEditing)) {
            toast.error("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", category);
        formData.append("readTime", readTime);
        if (image) {
            formData.append("image", image);
        }

        try {
            let res;
            if (isEditing) {
                res = await api.put(`/news/${editId}`, formData);
            } else {
                res = await api.post("/news/add", formData);
            }

            if (res.data.success) {
                console.log("UPDATE SUCCESS. Server returned:", res.data.data);
                toast.success(isEditing ? "News updated successfully!" : "News added successfully!");
                setIsAdding(false);
                setIsEditing(false);
                setEditId(null);
                resetForm();
                await fetchNews();
            }
        } catch (error) {
            console.error("Error saving news:", error);
            const msg = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} news`;
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (news) => {
        setIsEditing(true);
        setIsAdding(true);
        setEditId(news._id);
        setTitle(news.title);
        setContent(news.content);
        setCategory(news.category);
        setReadTime(news.readTime);
        const cacheBuster = `?t=${new Date().getTime()}`;
        setPreview(news.image.startsWith('http') ? news.image : `${API_URL}${news.image}${cacheBuster}`);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this news item?")) return;
        
        try {
            const { data } = await api.delete(`/news/${id}`);
            if (data.success) {
                toast.success("News deleted successfully");
                fetchNews();
            }
        } catch (error) {
            console.error("Error deleting news:", error);
            toast.error("Failed to delete news");
        }
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setCategory("Product");
        setReadTime("5 min read");
        setImage(null);
        setPreview(null);
        setIsEditing(false);
        setEditId(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return "Today";
        } else if (d.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    const filteredNews = newsList.filter(news => 
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">News Management</h2>
                    <p className="text-gray-500 mt-1">Manage company updates and announcements</p>
                </div>
                <button 
                    onClick={() => {
                        if (isAdding) {
                            resetForm();
                            setIsAdding(false);
                        } else {
                            setIsAdding(true);
                        }
                    }}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                        isAdding ? 'bg-gray-100 text-gray-600' : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    }`}
                >
                    {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isAdding ? 'Cancel' : 'Add New News'}
                </button>
            </div>

            {/* Quick Stats & Search */}
            {!isAdding && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <Newspaper className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">Total News</p>
                            <p className="text-2xl font-bold text-gray-800">{newsList.length}</p>
                        </div>
                    </div>
                    
                    <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow-sm border border-green-50 flex items-center">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Search news by title or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Form Section */}
            {isAdding && (
                <div className="bg-white rounded-3xl shadow-xl border border-green-50 overflow-hidden animate-slideUp">
                    <div className={`${isEditing ? 'bg-gradient-to-r from-orange-600 to-red-700' : 'bg-gradient-to-r from-green-600 to-emerald-700'} px-8 py-6`}>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            {isEditing ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                            {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
                        </h3>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side: Fields */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">News Title *</label>
                                    <input 
                                        type="text"
                                        placeholder="e.g. New Product Launch: Herbal Sunscreen"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category *</label>
                                        <select 
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        >
                                            <option value="Product">Product</option>
                                            <option value="Event">Event</option>
                                            <option value="Achievement">Achievement</option>
                                            <option value="Update">Company Update</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Read Time</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g. 4 min read"
                                            value={readTime}
                                            onChange={(e) => setReadTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Content Description *</label>
                                    <textarea 
                                        rows="6"
                                        placeholder="Enter detailed news content here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Side: Image Upload */}
                            <div className="space-y-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Cover Image *</label>
                                <div className={`relative h-[320px] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 bg-gray-50 ${
                                    preview ? 'border-green-500 bg-white' : 'border-gray-300 hover:border-green-500 hover:bg-green-50/50'
                                }`}>
                                    {preview ? (
                                        <div className="relative w-full h-full group">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    type="button"
                                                    onClick={() => { setImage(null); setPreview(null); }}
                                                    className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <p className="text-gray-700 font-bold text-center">Drag and drop or click to upload</p>
                                            <p className="text-gray-500 text-xs mt-2">Recommended: 1200x800px (Max 2MB)</p>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                required={!preview}
                                            />
                                        </>
                                    )}
                                </div>
                                
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                News titles should be catchy and concise. Make sure content is well-checked before posting.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
                            <button 
                                type="button"
                                onClick={() => { setIsAdding(false); resetForm(); }}
                                className="px-8 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all font-sans uppercase tracking-wider text-sm"
                            >
                                Discard
                            </button>
                            <button 
                                type="submit"
                                disabled={submitting}
                                className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none flex items-center gap-2 font-sans uppercase tracking-wider text-sm"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                                {submitting ? (isEditing ? "Updating..." : "Publishing...") : (isEditing ? "Update News" : "Publish News")}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Section */}
            {!isAdding && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {loading ? (
                        [1,2,3].map(i => (
                            <div key={i} className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
                        ))
                    ) : filteredNews.length > 0 ? (
                        filteredNews.map((news) => (
                            <div key={news._id} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-green-50 overflow-hidden flex flex-col">
                                {/* Card Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <img 
                                        src={news.image.startsWith('http') ? news.image : `${API_URL}${news.image}?t=${new Date().getTime()}`}
                                        alt={news.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#0A7A2F] text-[10px] font-bold tracking-widest uppercase rounded-lg shadow-sm">
                                            {news.category}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(news)}
                                                className="p-3 bg-white text-green-600 rounded-xl hover:bg-green-50 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(news._id)}
                                                className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs text-gray-500 font-medium">
                                            {formatDate(news.createdAt)}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-xs text-gray-500 font-medium">{news.readTime}</span>
                                    </div>
                                    
                                    <h4 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                                        {news.title}
                                    </h4>
                                    
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">
                                        {news.content}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">
                                                {news.authorAvatar || (news.author ? news.author[0] : 'A')}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">{news.author || 'Admin'}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(news._id)}
                                            className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete News"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                <Newspaper className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">No news items found</h3>
                            <p className="text-gray-500 max-w-xs mt-2">
                                {searchTerm ? "No results match your search term. Try something else." : "Get started by adding your first company announcement!"}
                            </p>
                            {!searchTerm && (
                                <button 
                                    onClick={() => setIsAdding(true)}
                                    className="mt-6 text-green-600 font-bold hover:underline"
                                >
                                    Add your first news item
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminNews;
