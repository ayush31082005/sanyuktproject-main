import React, { useState, useEffect } from 'react';
import api, { API_URL } from '../../api';
import { devSharedFetch } from '../../utils/devSharedFetch';
import NewsDetailsModal from '../../components/NewsDetailsModal';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

const NewsSection = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const data = await devSharedFetch(
                'home:news',
                async () => {
                    const response = await api.get('/news');
                    return response.data;
                },
                4000
            );

            if (data.success) {
                setNewsItems(data.data);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewsClick = (news) => {
        setSelectedNews(news);
        setIsModalOpen(true);
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/600x400";
        if (url.startsWith('http')) return url;
        // If the URL already starts with /uploads, don't prepend it again
        const path = url.startsWith('/uploads') ? url : `/uploads/${url}`;
        return `${API_URL}${path}`;
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

    if (loading) {
        return (
            <section className="py-6 bg-[#121212] relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header Skeleton */}
                    <div className="h-6 w-full max-w-lg sm:w-96 skeleton-box shimmer mx-auto mb-2"></div>
                    <div className="w-16 h-[1px] bg-[#C8A96A]/20 mx-auto mb-8"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="luxury-box h-[380px] md:h-[420px] animate-pulse flex flex-col">
                                <div className="h-32 md:h-44 bg-[#1A1A1A] skeleton-box shimmer border-b border-[#C8A96A]/10"></div>
                                <div className="p-4 flex-1">
                                    <div className="h-3 w-24 bg-[#1A1A1A] skeleton-box shimmer mb-3"></div>
                                    <div className="h-5 w-full bg-[#1A1A1A] skeleton-box shimmer mb-2"></div>
                                    <div className="h-5 w-2/3 bg-[#1A1A1A] skeleton-box shimmer mb-4"></div>
                                    <div className="mt-auto pt-4 border-t border-[#C8A96A]/5 flex justify-between">
                                        <div className="h-3 w-20 bg-[#1A1A1A] skeleton-box shimmer"></div>
                                        <div className="h-4 w-4 bg-[#1A1A1A] skeleton-box shimmer"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!loading && newsItems.length === 0) {
        return (
            <section className="py-6 bg-[#121212] text-center" >
                <div className="container mx-auto px-4">
                    <h2 className="text-xl md:text-3xl font-serif font-bold text-[#F5E6C8] mb-1 uppercase tracking-widest">
                        Latest News & <span className="text-[#C8A96A]">Updates</span>
                    </h2>
                    <div className="w-16 h-[1px] bg-[#C8A96A]/40 mx-auto mb-6"></div>
                    <div className="luxury-box p-8 max-w-2xl mx-auto bg-[#1A1A1A]/50">
                        <div className="w-16 h-16 rounded-full bg-[#C8A96A]/5 flex items-center justify-center mb-4 mx-auto border border-[#C8A96A]/10">
                            <Clock className="w-8 h-8 text-[#C8A96A]/20" />
                        </div>
                        <h3 className="text-[#F5E6C8] font-serif text-lg mb-2 uppercase tracking-widest">No News Discovered</h3>
                        <p className="text-[#F5E6C8]/40 text-xs font-light max-w-sm mx-auto">Our editors are preparing new updates. Please check back later for the latest news.</p>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <section className="py-3 md:py-6 bg-[#121212] relative overflow-hidden" >
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-xl md:text-3xl font-serif font-bold text-center text-[#F5E6C8] mb-1 uppercase tracking-widest">
                    Latest News & <span className="text-[#C8A96A]">Updates</span>
                </h2>
                <div className="w-16 h-[1px] bg-[#C8A96A]/40 mx-auto mb-3"></div>
                <p className="text-center text-[#F5E6C8]/60 mb-4 max-w-2xl mx-auto text-[10px] md:text-xs font-light tracking-tight uppercase">
                    Stay updated with the latest company announcements and success stories.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {newsItems.map((news) => (
                        <div
                            key={news._id}
                            onClick={() => handleNewsClick(news)}
                            className="luxury-box transition-all duration-500 overflow-hidden cursor-pointer flex flex-col group min-h-[350px] md:min-h-[420px]"
                        >
                            {/* Cover Image */}
                            <div className="relative h-32 md:h-44 overflow-hidden p-1">
                                <img
                                    src={getImageUrl(news.image)}
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2">
                                    <span className="px-2 py-0.5 bg-[#C8A96A] text-[#0D0D0D] text-[7px] font-bold tracking-widest uppercase shadow-lg">
                                        {news.category}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-3 md:p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-1 text-[#F5E6C8]/40 text-[9px] font-medium uppercase tracking-tight">
                                    <Calendar className="w-2.5 h-2.5 text-[#C8A96A]" />
                                    <span>{formatDate(news.createdAt)}</span>
                                    <span className="text-[#C8A96A] font-bold mx-1">|</span>
                                    <span>{news.readTime}</span>
                                </div>

                                <h4 className="font-bold text-[#F5E6C8] text-sm md:text-base mb-1 leading-snug group-hover:text-[#C8A96A] transition-colors line-clamp-2 uppercase tracking-tight">
                                    {news.title}
                                </h4>

                                <p className="text-[11px] md:text-xs text-gray-500 line-clamp-3 mb-3 flex-1 font-light">
                                    {news.content}
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-[#C8A96A]/10">
                                    <span className="text-[9px] font-bold text-[#C8A96A] uppercase tracking-widest">READ MORE</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-[#C8A96A] text-[#0D0D0D] flex items-center justify-center font-bold text-[7px]">
                                            {news.authorAvatar || (news.author ? news.author[0] : 'A')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <NewsDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                news={selectedNews}
            />
        </section>
    );
};

export default NewsSection;
