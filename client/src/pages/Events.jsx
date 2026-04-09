import { useEffect, useState } from "react"
import api, { API_URL } from "../api"
import { Calendar, MapPin, Clock, Tag, X, ChevronRight, Bookmark } from 'lucide-react'

function Events() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedEvent, setSelectedEvent] = useState(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await api.get("/events/all")
            setEvents(response.data)
        } catch (error) {
            console.error("Error fetching events:", error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return null
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        } catch { return dateString }
    }

    const formatTime = (timeString) => {
        if (!timeString) return null
        try {
            const [h, m] = timeString.split(':')
            const hour = parseInt(h)
            const ampm = hour >= 12 ? 'PM' : 'AM'
            const displayHour = hour % 12 || 12
            return `${displayHour}:${m} ${ampm}`
        } catch { return timeString }
    }

    const getImageUrl = (filename) => `${API_URL}/uploads/events/${filename}`

    // Mapping categories to the dark theme styles (Using gold and muted dark variants instead of bright pastel colors)
    const categoryColors = {
        Meeting: { bg: 'bg-[#1e1a2d]', text: 'text-[#a78bfa]', border: 'border-[#8b5cf6]/30' },
        Celebration: { bg: 'bg-[#292317]', text: 'text-[#D4AF37]', border: 'border-[#C8A96A]/30' },
        Workshop: { bg: 'bg-[#1a232c]', text: 'text-[#38bdf8]', border: 'border-[#0ea5e9]/30' },
        Festival: { bg: 'bg-[#2a1720]', text: 'text-[#f472b6]', border: 'border-[#db2777]/30' },
        Other: { bg: 'bg-[#121212]', text: 'text-[#C8A96A]', border: 'border-[#C8A96A]/30' },
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 rounded-full border-4 border-[#C8A96A]/20 border-t-[#C8A96A] animate-spin mx-auto mb-4" />
                    <p className="text-[#C8A96A] font-black text-xs uppercase tracking-[0.2em] animate-pulse">Loading Events...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30 relative">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C8A96A]/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute top-[40%] left-0 w-[300px] h-[300px] bg-[#C8A96A]/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Header */}
            <div className="relative py-10 md:py-12 px-6 text-center border-b border-[#C8A96A]/10 bg-[#121212]/80 backdrop-blur-sm z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D0D0D] border border-[#C8A96A]/30 text-[#C8A96A] text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-[0_0_15px_rgba(200,169,106,0.1)]">
                    <Calendar size={14} className="text-[#C8A96A]" strokeWidth={2.5} />
                    Upcoming & Recent
                </div>

                <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#F5E6C8] mb-3 tracking-tight uppercase">
                    Our Seminars & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]">Events</span>
                </h1>

                <div className="w-12 h-1 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] mx-auto rounded-full mb-3"></div>

                <p className="text-[#F5E6C8] text-[11px] md:text-xs font-black uppercase tracking-widest max-w-xl mx-auto leading-relaxed mb-6 italic opacity-60">
                    Join us for exclusive seminars, prestigious celebrations, and insightful workshops designed for growth and networking.
                </p>

                {/* Stats */}
                {events.length > 0 && (
                    <div className="inline-flex flex-wrap justify-center gap-6 md:gap-12 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl p-4 md:py-4 md:px-10 shadow-xl shrink-0 mx-auto max-w-full">
                        {[
                            { label: 'Total Events', val: events.length },
                            { label: 'Scheduled', val: events.filter(e => e.date).length },
                            { label: 'With Location', val: events.filter(e => e.location).length },
                        ].map((s, i) => (
                            <div key={i} className="text-center relative">
                                {i !== 0 && <div className="hidden md:block absolute -left-6 md:-left-6 top-1/2 -translate-y-1/2 w-px h-8 bg-[#C8A96A]/20"></div>}
                                <div className="text-2xl md:text-3xl font-serif font-bold text-[#C8A96A] mb-1">{s.val}</div>
                                <div className="text-[9px] text-[#F5E6C8]/50 uppercase font-black tracking-widest">{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
                {events.length === 0 ? (
                    <div className="text-center py-24 bg-[#121212] rounded-2xl border border-[#C8A96A]/10">
                        <Calendar size={48} strokeWidth={1} className="text-[#C8A96A]/30 mx-auto mb-4" />
                        <h3 className="text-xl font-serif text-[#F5E6C8] mb-2">No Events Scheduled</h3>
                        <p className="text-[#F5E6C8]/40 text-sm">Please check back later for upcoming seminars and events.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((item, index) => {
                            const catStyle = categoryColors[item.category] || categoryColors.Other;
                            return (
                                <div
                                    key={item._id || index}
                                    className="group flex flex-col bg-[#121212] border border-[#C8A96A]/20 rounded-xl overflow-hidden cursor-pointer hover:border-[#C8A96A]/50 hover:shadow-[0_10px_30px_rgba(200,169,106,0.15)] hover:-translate-y-1 transition-all duration-500"
                                    onClick={() => setSelectedEvent(item)}
                                >
                                    {/* Image Section */}
                                    <div className="relative h-56 overflow-hidden bg-[#0D0D0D] border-b border-[#C8A96A]/10">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/400x250/121212/C8A96A?text=Event+Visual"
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80"></div>

                                        {/* Date Badge */}
                                        <div className="absolute top-4 left-4 bg-[#0D0D0D]/80 backdrop-blur-md border border-[#C8A96A]/30 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg">
                                            <Calendar size={12} className="text-[#C8A96A]" strokeWidth={2.5} />
                                            <span className="text-xs font-mono font-bold text-[#F5E6C8]">{item.date ? formatDate(item.date) : "TBD"}</span>
                                        </div>

                                        {/* Category Badge */}
                                        {item.category && (
                                            <div className={`absolute top-4 right-4 ${catStyle.bg} border ${catStyle.border} rounded px-2 py-1 shadow-lg`}>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${catStyle.text}`}>{item.category}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex flex-col flex-1 p-4 md:p-5">
                                        <h3 className="text-lg font-serif font-bold text-[#F5E6C8] mb-2 leading-tight line-clamp-2 group-hover:text-[#C8A96A] transition-colors uppercase">
                                            {item.title}
                                        </h3>
                                        
                                        <p className="text-[#F5E6C8] text-xs font-bold leading-relaxed mb-4 line-clamp-2 opacity-60">
                                            {item.content}
                                        </p>

                                        {/* Metadata Row */}
                                        <div className="mt-auto flex flex-wrap gap-3 mb-6">
                                            {item.time && (
                                                <div className="flex items-center gap-1.5 bg-[#0D0D0D] border border-[#C8A96A]/10 rounded px-2 py-1 text-[#F5E6C8]/70">
                                                    <Clock size={12} className="text-[#C8A96A]" />
                                                    <span className="text-[10px] font-mono font-bold uppercase">{formatTime(item.time)}</span>
                                                </div>
                                            )}
                                            {item.location && (
                                                <div className="flex items-center gap-1.5 bg-[#0D0D0D] border border-[#C8A96A]/10 rounded px-2 py-1 text-[#F5E6C8]/70">
                                                    <MapPin size={12} className="text-[#C8A96A]" />
                                                    <span className="text-[10px] uppercase font-bold tracking-wider">{item.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <div className="pt-3 border-t border-[#C8A96A]/10 flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A] group-hover:text-[#D4AF37] transition-colors">
                                                View Details
                                            </span>
                                            <div className="w-7 h-7 rounded-full bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-all">
                                                <ChevronRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div 
                    className="fixed inset-0 bg-[#0D0D0D]/90 backdrop-blur-md z-[1000] flex items-center justify-center p-4 md:p-8 animate-fade-in"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div 
                        className="relative bg-[#121212] border border-[#C8A96A]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button Top */}
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#0D0D0D]/60 backdrop-blur-sm border border-[#C8A96A]/30 text-[#F5E6C8] flex items-center justify-center hover:bg-red-900/80 hover:text-red-400 hover:border-red-500/50 transition-all shadow-lg"
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* Modal Image */}
                        <div className="relative h-64 shrink-0 bg-[#0D0D0D] border-b border-[#C8A96A]/20">
                            <img
                                src={getImageUrl(selectedEvent.image)}
                                alt={selectedEvent.title}
                                className="w-full h-full object-cover opacity-80"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/600x300/121212/C8A96A?text=Event+Visual"
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                            
                            {/* Title overlay */}
                            <div className="absolute bottom-6 left-6 right-6">
                                {selectedEvent.category && (() => {
                                    const cStyle = categoryColors[selectedEvent.category] || categoryColors.Other;
                                    return (
                                        <div className={`inline-block mb-3 ${cStyle.bg} border ${cStyle.border} rounded px-3 py-1`}>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${cStyle.text}`}>{selectedEvent.category}</span>
                                        </div>
                                    )
                                })()}
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F5E6C8] leading-tight drop-shadow-md">
                                    {selectedEvent.title}
                                </h2>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                            
                            {/* Meta Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[
                                    { icon: <Calendar size={16} />, label: 'Date', val: formatDate(selectedEvent.date) || 'TBD' },
                                    { icon: <Clock size={16} />, label: 'Time', val: formatTime(selectedEvent.time) || 'TBD' },
                                    { icon: <MapPin size={16} />, label: 'Location', val: selectedEvent.location || 'TBD' },
                                    { icon: <Tag size={16} />, label: 'Category', val: selectedEvent.category || 'General' },
                                ].map((d, i) => (
                                    <div key={i} className="bg-[#0D0D0D] border border-[#C8A96A]/10 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                        <div className="text-[#C8A96A] mb-2">{d.icon}</div>
                                        <div className="text-[9px] text-[#F5E6C8]/40 uppercase font-black tracking-widest mb-1">{d.label}</div>
                                        <div className="text-[11px] font-bold text-[#F5E6C8]">{d.val}</div>
                                    </div>
                                ))}
                            </div>

                            <h3 className="text-sm font-bold text-[#C8A96A] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#C8A96A]/10 pb-2">
                                <Bookmark size={14}/> Event Overview
                            </h3>
                            <p className="text-[#F5E6C8]/70 text-sm md:text-base leading-relaxed whitespace-pre-line">
                                {selectedEvent.content}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Global custom styles specifically for this page */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #0D0D0D; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #C8A96A; 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D4AF37; 
                }
            `}</style>
        </div>
    )
}

export default Events
