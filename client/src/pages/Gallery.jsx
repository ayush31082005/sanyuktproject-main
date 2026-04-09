import { useEffect, useState } from "react"
import api, { API_URL } from "../api"
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react'

function Gallery() {
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        api.get("/gallery/all")
            .then(res => {
                setGallery(res.data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Error fetching gallery:", err)
                setLoading(false)
            })
    }, [])

    const openLightbox = (item, index) => {
        setSelectedImage(item)
        setSelectedIndex(index)
    }

    const closeLightbox = () => setSelectedImage(null)

    const prevImage = (e) => {
        e.stopPropagation()
        const newIndex = (selectedIndex - 1 + gallery.length) % gallery.length
        setSelectedImage(gallery[newIndex])
        setSelectedIndex(newIndex)
    }

    const nextImage = (e) => {
        e.stopPropagation()
        const newIndex = (selectedIndex + 1) % gallery.length
        setSelectedImage(gallery[newIndex])
        setSelectedIndex(newIndex)
    }

    const getImageUrl = (item) => {
        if (!item || !item.image) return "";
        if (item.image.startsWith('http')) return item.image;
        const filename = item.image.startsWith('/uploads') ? item.image : `/uploads/gallery/${item.image}`;
        return `${API_URL}${filename}`;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 rounded-full border-4 border-[#C8A96A]/20 border-t-[#C8A96A] animate-spin mx-auto mb-4" />
                    <p className="text-[#C8A96A] font-black text-xs uppercase tracking-[0.2em] animate-pulse">Loading Gallery...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#0D0D0D] font-sans text-[#F5E6C8] selection:bg-[#C8A96A]/30">
            {/* Hero Header */}
            <div className="relative py-10 md:py-12 px-6 text-center border-b border-[#C8A96A]/10 bg-[#121212] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.05)_0%,transparent_70%)] pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C8A96A]/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212] border border-[#C8A96A]/30 text-[#C8A96A] text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-[0_0_15px_rgba(200,169,106,0.1)]">
                        <Camera size={14} className="text-[#C8A96A]" strokeWidth={2.5} />
                        Our Memories
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#F5E6C8] mb-3 tracking-tight uppercase">
                        Beautiful <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]">Moments</span>
                    </h1>

                    <div className="w-12 h-1 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] mx-auto rounded-full mb-3"></div>

                    <p className="text-[#F5E6C8] text-[11px] md:text-xs font-black uppercase tracking-widest max-w-xl mx-auto leading-relaxed mb-4 italic opacity-60">
                        Explore our curated collection of cherished memories, milestones, and prestigious events
                    </p>

                    {gallery.length > 0 && (
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#0D0D0D] border border-[#C8A96A]/20 shadow-lg">
                            <span className="text-[#C8A96A] font-black text-xl">{gallery.length}</span>
                            <span className="text-[#F5E6C8]/50 text-[10px] uppercase font-bold tracking-widest">Photographs</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
                {gallery.length === 0 ? (
                    <div className="text-center py-12 bg-[#121212] rounded-2xl border border-[#C8A96A]/10">
                        <Camera size={32} strokeWidth={1} className="text-[#C8A96A]/30 mx-auto mb-2" />
                        <h3 className="text-lg font-serif text-[#F5E6C8] mb-1">No Images Yet</h3>
                        <p className="text-[#F5E6C8]/40 text-xs">Our gallery is currently being curated. Check back soon.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {gallery.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="group relative bg-[#121212] rounded-xl overflow-hidden border border-[#C8A96A]/20 cursor-pointer hover:border-[#C8A96A]/50 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(200,169,106,0.15)] hover:-translate-y-1 block animate-fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => openLightbox(item, index)}
                            >
                                <div className="aspect-[4/3] bg-[#0D0D0D] overflow-hidden relative">
                                    <img
                                        src={getImageUrl(item)}
                                        alt={item.title || `Gallery ${index + 1}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/400x300/121212/C8A96A?text=Missing+Image"
                                        }}
                                    />
                                    
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <span className="text-[#F5E6C8] font-bold text-sm mb-1 font-serif line-clamp-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {item.title}
                                        </span>
                                        <span className="text-[#C8A96A] text-[10px] font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            Click to view full size
                                        </span>
                                    </div>
                                    
                                    {/* Number Badge */}
                                    <div className="absolute top-3 right-3 bg-[#0D0D0D]/80 backdrop-blur-md border border-[#C8A96A]/30 text-[#C8A96A] text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">
                                        #{index + 1}
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox / Modal */}
            {selectedImage && (
                <div
                    onClick={closeLightbox}
                    className="fixed inset-0 bg-[#0D0D0D]/95 backdrop-blur-xl z-[1000] flex items-center justify-center p-4 md:p-8 animate-fade-in"
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="relative max-w-5xl w-full max-h-screen flex flex-col items-center animate-scale-in"
                    >
                        <div className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-[#C8A96A]/20 bg-[#121212]">
                            <img
                                src={getImageUrl(selectedImage)}
                                alt="Gallery full"
                                className="w-full max-h-[85vh] object-contain block mx-auto py-4"
                            />
                        </div>
                        
                        {/* Title and Counter */}
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center w-full">
                            <h3 className="text-[#F5E6C8] font-serif font-bold text-lg md:text-xl mb-1">{selectedImage.title}</h3>
                            <p className="text-[#C8A96A]/60 font-mono text-sm">{selectedIndex + 1} / {gallery.length}</p>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button 
                        onClick={prevImage} 
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#121212]/80 border border-[#C8A96A]/30 text-[#C8A96A] flex items-center justify-center hover:bg-[#C8A96A] hover:text-[#0D0D0D] transition-all duration-300 backdrop-blur-md"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>

                    <button 
                        onClick={nextImage} 
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#121212]/80 border border-[#C8A96A]/30 text-[#C8A96A] flex items-center justify-center hover:bg-[#C8A96A] hover:text-[#0D0D0D] transition-all duration-300 backdrop-blur-md"
                    >
                        <ChevronRight size={24} strokeWidth={2.5} />
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 rounded-full bg-[#121212]/80 border border-[#C8A96A]/30 text-[#F5E6C8] flex items-center justify-center hover:bg-red-900/80 hover:text-red-400 hover:border-red-500/50 transition-all duration-300 backdrop-blur-md"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default Gallery
