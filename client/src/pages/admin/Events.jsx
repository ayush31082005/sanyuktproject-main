import { useState, useEffect } from "react"
import api, { API_URL } from "../../api"

const STYLES = `
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin { to{transform:rotate(360deg)} }

.ev-card {
    background:#121212; border:1px solid rgba(200,169,106,0.3); border-radius:12px;
    overflow:hidden; animation:slideUp 0.4s ease forwards; opacity:0;
    transition:box-shadow 0.3s,transform 0.3s,border-color 0.3s;
}
.ev-card:hover { box-shadow:0 10px 30px rgba(200,169,106,0.15); transform:translateY(-4px); border-color:#C8A96A; }
.ev-card img { width:100%; height:160px; object-fit:cover; display:block; transition:transform 0.5s; opacity:0.9; }
.ev-card:hover img { transform:scale(1.05); opacity:1; }
.img-wrap { overflow:hidden; position:relative; border-bottom:1px solid rgba(200,169,106,0.1); }

.action-btn {
    display:flex; align-items:center; justify-content:center;
    width:32px; height:32px; border-radius:7px; border:1px solid rgba(200,169,106,0.2);
    cursor:pointer; transition:all 0.2s; background:#0D0D0D;
}
.btn-edit { color:#C8A96A; }
.btn-edit:hover { background:rgba(200,169,106,0.1); color:#D4AF37; border-color:#C8A96A; }
.btn-delete { color:#ef4444; border-color:rgba(239,68,68,0.3); }
.btn-delete:hover { background:rgba(239,68,68,0.1); color:#f87171; border-color:#ef4444; }

.btn-primary {
    background:transparent;
    color:#C8A96A; border:1px solid #C8A96A; border-radius:4px;
    padding:10px 22px; font-weight:700; font-size:11px; text-transform:uppercase; letter-spacing:2px;
    cursor:pointer; transition:all 0.3s; display:flex; align-items:center; gap:8px;
}
.btn-primary:hover { background:#C8A96A; color:#0D0D0D; box-shadow:0 0 15px rgba(200,169,106,0.3); }
.btn-primary:disabled { opacity:0.5; cursor:not-allowed; }

.modal-bg {
    position:fixed; inset:0; background:rgba(0,0,0,0.85);
    z-index:999; display:flex; align-items:center; justify-content:center;
    padding:16px; animation:fadeIn 0.3s ease; backdrop-filter:blur(10px);
}
.modal-box {
    background:#121212; border:1px solid rgba(200,169,106,0.3); border-radius:16px; width:100%; max-width:640px;
    animation:slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); max-height:92vh; overflow-y:auto;
    box-shadow:0 25px 50px -12px rgba(0,0,0,0.9);
}

.form-input {
    width:100%; padding:14px 16px; border:1px solid rgba(200,169,106,0.2);
    border-radius:10px; font-size:14px; font-family:sans-serif; background:#0D0D0D; color:#F5E6C8;
    outline:none; box-sizing:border-box; transition:all 0.3s;
}
.form-input:focus { border-color:#C8A96A; box-shadow:0 0 0 1px rgba(200,169,106,0.4); }
.form-label { display:block; font-size:11px; font-weight:800; color:#C8A96A; margin-bottom:6px; text-transform:uppercase; letter-spacing:1px; }

.drop-zone {
    border:1px dashed rgba(200,169,106,0.4); border-radius:12px;
    padding:24px 20px; text-align:center; cursor:pointer;
    transition:all 0.3s; background:#0D0D0D;
}
.drop-zone:hover,.drop-zone.active { border-color:#C8A96A; background:rgba(200,169,106,0.05); }

.toast {
    position:fixed; bottom:28px; right:28px; z-index:9999;
    padding:16px 24px; border-radius:8px; font-family:sans-serif; background:#121212;
    font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; animation:slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display:flex; align-items:center; gap:12px; box-shadow:0 15px 30px rgba(0,0,0,0.6);
}

.cat-badge {
    display:inline-block; padding:4px 12px; border-radius:4px;
    font-size:10px; font-weight:800; font-family:sans-serif; text-transform:uppercase; letter-spacing:1px;
    border:1px solid rgba(200,169,106,0.3);
}

/* Custom scrollbar for modal */
.modal-box::-webkit-scrollbar { width:8px; }
.modal-box::-webkit-scrollbar-track { background:#0D0D0D; border-radius:8px; }
.modal-box::-webkit-scrollbar-thumb { background:rgba(200,169,106,0.3); border-radius:8px; }
.modal-box::-webkit-scrollbar-thumb:hover { background:rgba(200,169,106,0.5); }
`

const CAT_COLORS = {
    Meeting: { bg: "rgba(200,169,106,0.1)", color: "#C8A96A" },
    Celebration: { bg: "rgba(212,175,55,0.1)", color: "#D4AF37" },
    Workshop: { bg: "rgba(245,230,200,0.1)", color: "#F5E6C8" },
    Festival: { bg: "rgba(255,215,0,0.1)", color: "#FFD700" },
    Other: { bg: "#0D0D0D", color: "rgba(245,230,200,0.6)" },
}

function Toast({ msg, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [])
    const ok = type === "success"
    return (
        <div className="toast" style={{ color: ok ? "#C8A96A" : "#ef4444", border: `1px solid ${ok ? "rgba(200,169,106,0.4)" : "rgba(239,68,68,0.4)"}` }}>
            {ok ? 
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : 
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            } 
            {msg}
        </div>
    )
}

function ConfirmModal({ msg, onConfirm, onCancel }) {
    return (
        <div className="modal-bg" onClick={onCancel}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#121212", border: "1px solid rgba(200,169,106,0.3)", borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.9)" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#ef4444" }}>
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h3 style={{ margin: "0 0 12px", fontSize: 20, fontFamily: "serif", fontWeight: 700, color: "#F5E6C8" }}>Delete Event?</h3>
                <p style={{ margin: "0 0 24px", color: "rgba(245,230,200,0.6)", fontSize: 13, lineHeight: 1.5, fontFamily: "sans-serif" }}>{msg}</p>

                <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: "12px", borderRadius: 4, border: "1px solid rgba(200,169,106,0.3)", background: "transparent", color: "#C8A96A", fontWeight: 700, cursor: "pointer", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px" }}>Cancel</button>
                    <button onClick={onConfirm} style={{ flex: 1, padding: "12px", borderRadius: 4, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 4px 14px rgba(239,68,68,0.3)" }}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default function AdminEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [toast, setToast] = useState(null)

    const showToast = (msg, type = "success") => setToast({ msg, type })

    const fetchEvents = async () => {
        try {
            const res = await api.get("/events/all")
            setEvents(res.data)
        } catch { showToast("Failed to load events", "error") }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchEvents() }, [])

    const handleDelete = async () => {
        try {
            await api.delete(`/events/delete/${deleteId}`)
            setEvents(prev => prev.filter(e => e._id !== deleteId))
            showToast("Event deleted successfully")
        } catch { showToast("Failed to delete event", "error") }
        finally { setDeleteId(null) }
    }

    const getImgUrl = (fn) => `${API_URL}/uploads/events/${fn}`

    const formatDate = (d) => {
        if (!d) return "No date"
        try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) }
        catch { return d }
    }

    return (
        <div style={{ minHeight: "100vh", background: "#0D0D0D", fontFamily: "sans-serif", position: "relative", overflow: "hidden" }}>
            <style>{STYLES}</style>

            {/* Elegant Background Elements */}
            <div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, background: "rgba(200,169,106,0.03)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ position: "relative", zIndex: 1 }}>
                {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
                {deleteId && <ConfirmModal msg="This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}

                {/* Header */}
                <div style={{ background: "#121212", borderBottom: "1px solid rgba(200,169,106,0.2)", padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#0D0D0D", border: "1px solid rgba(200,169,106,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C8A96A" }}>
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 700, fontFamily: "serif", color: "#F5E6C8", letterSpacing: "-0.5px" }}>Seminar & Event Management</h1>
                            <p style={{ margin: 0, color: "rgba(245,230,200,0.5)", fontSize: 13, fontWeight: 500 }}>Add, edit or delete events and seminars</p>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ background: "#0D0D0D", border: "1px solid rgba(200,169,106,0.3)", borderRadius: 6, padding: "8px 16px", fontSize: 10, fontWeight: 800, color: "#C8A96A", textTransform: "uppercase", letterSpacing: "1px" }}>
                            {events.length} Events
                        </div>
                        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Event
                        </button>
                    </div>
                </div>

                {/* Events List */}
                <div style={{ padding: "40px", maxWidth: 1600, margin: "0 auto" }}>
                    {loading ? (
                        <div style={{ textAlign: "center", padding: 80 }}>
                            <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid rgba(200,169,106,0.2)", borderTopColor: "#C8A96A", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                            <p style={{ color: "rgba(245,230,200,0.4)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px" }}>Loading events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 20px", background: "#121212", borderRadius: 16, border: "1px solid rgba(200,169,106,0.1)" }}>
                            <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#0D0D0D", border: "1px dashed rgba(200,169,106,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "rgba(200,169,106,0.4)" }}>
                                <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 style={{ color: "#F5E6C8", margin: "0 0 8px", fontSize: 20, fontFamily: "serif" }}>No events yet</h3>
                            <p style={{ color: "rgba(245,230,200,0.5)", margin: "0 0 24px", fontSize: 14 }}>Add your first event or seminar</p>
                            <button className="btn-primary" style={{ margin: "0 auto" }} onClick={() => setShowAddModal(true)}>Add First Event</button>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 24 }}>
                            {events.map((item, i) => {
                                const cat = CAT_COLORS[item.category] || CAT_COLORS.Other
                                return (
                                    <div key={item._id} className="ev-card" style={{ animationDelay: `${i * 60}ms` }}>
                                        <div className="img-wrap">
                                            <img src={getImgUrl(item.image)} alt={item.title}
                                                onError={e => { e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='160'%3E%3Crect width='320' height='160' fill='%230D0D0D'/%3E%3Ctext x='50%25' y='50%25' fill='%23C8A96A' font-size='11' font-weight='800' letter-spacing='1px' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' opacity='0.5'%3EIMAGE NOT FOUND%3C/text%3E%3C/svg%3E` }} />

                                            {item.date && (
                                                <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(13,13,13,0.85)", backdropFilter: "blur(4px)", border: "1px solid rgba(200,169,106,0.3)", borderRadius: 6, padding: "6px 12px", fontSize: 10, fontWeight: 800, color: "#C8A96A", letterSpacing: "1px", textTransform: "uppercase" }}>
                                                    📅 {formatDate(item.date)}
                                                </div>
                                            )}
                                            {item.category && (
                                                <div className="cat-badge" style={{ position: "absolute", top: 12, right: 12, background: cat.bg, color: cat.color }}>{item.category}</div>
                                            )}
                                        </div>

                                        <div style={{ padding: "18px 20px" }}>
                                            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontFamily: "serif", fontWeight: 700, color: "#F5E6C8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</h3>
                                            <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(245,230,200,0.6)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.content}</p>

                                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                                                {item.time && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", color: "rgba(245,230,200,0.8)", background: "#0D0D0D", border: "1px solid rgba(200,169,106,0.2)", borderRadius: 4, padding: "4px 10px" }}>⏰ {item.time}</span>}
                                                {item.location && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", color: "rgba(245,230,200,0.8)", background: "#0D0D0D", border: "1px solid rgba(200,169,106,0.2)", borderRadius: 4, padding: "4px 10px" }}>📍 {item.location}</span>}
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(200,169,106,0.1)", paddingTop: 14 }}>
                                                <span style={{ fontSize: 10, color: "rgba(245,230,200,0.4)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{new Date(item.createdAt).toLocaleDateString("en-IN")}</span>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <button className="action-btn btn-edit" title="Edit" onClick={() => setEditItem(item)}>
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button className="action-btn btn-delete" title="Delete" onClick={() => setDeleteId(item._id)}>
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <EventModal
                    title="Add New Event"
                    onClose={() => setShowAddModal(false)}
                    onSuccess={(newItem) => { setEvents(prev => [newItem, ...prev]); setShowAddModal(false); showToast("Event added!") }}
                    showToast={showToast}
                />
            )}

            {/* Edit Modal */}
            {editItem && (
                <EventModal
                    title="Edit Event"
                    event={editItem}
                    onClose={() => setEditItem(null)}
                    onSuccess={(updated) => { setEvents(prev => prev.map(e => e._id === updated._id ? updated : e)); setEditItem(null); showToast("Event updated!") }}
                    showToast={showToast}
                />
            )}
        </div>
    )
}

function EventModal({ title, event, onClose, onSuccess, showToast }) {
    const isEdit = !!event
    const [form, setForm] = useState({
        title: event?.title || "",
        content: event?.content || "",
        date: event?.date || "",
        time: event?.time || "",
        location: event?.location || "",
        category: event?.category || "",
    })
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(event?.image ? `${API_URL}/uploads/events/${event.image}` : null)
    const [loading, setLoading] = useState(false)
    const [drag, setDrag] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleFile = (f) => {
        if (!f || !f.type.startsWith("image/")) return showToast("Please select a valid image", "error")
        setFile(f)
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(f)
    }

    const validate = () => {
        if (!form.title.trim()) { showToast("Title is required", "error"); return false }
        if (!form.content.trim()) { showToast("Description is required", "error"); return false }
        if (!isEdit && !file) { showToast("Image is required", "error"); return false }
        return true
    }

    const submit = async () => {
        if (!validate()) return
        setLoading(true)

        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => fd.append(k, v))
        if (file) fd.append("image", file)

        try {
            let res
            if (isEdit) {
                res = await api.put(`/events/update/${event._id}`, fd)
                onSuccess(res.data.event)
            } else {
                res = await api.post("/events/add", fd)
                onSuccess(res.data.event)
            }
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to save event", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-bg" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(200,169,106,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#121212", zIndex: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontFamily: "serif", fontWeight: 700, color: "#F5E6C8" }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "rgba(200,169,106,0.1)", border: "none", cursor: "pointer", color: "#C8A96A", padding: 6, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(200,169,106,0.2)"} onMouseOut={e=>e.currentTarget.style.background="rgba(200,169,106,0.1)"}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div style={{ padding: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, background: "#0D0D0D" }}>
                    {/* Left col */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                            <label className="form-label">Event Title *</label>
                            <input className="form-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g., Annual Gathering" maxLength={100} />
                            <div style={{ fontSize: 10, color: "rgba(245,230,200,0.4)", marginTop: 6, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{form.title.length}/100</div>
                        </div>

                        <div>
                            <label className="form-label">Description *</label>
                            <textarea className="form-input" value={form.content} onChange={e => set("content", e.target.value)} placeholder="Describe the event..." rows={4} maxLength={500} style={{ resize: "vertical", minHeight: 110 }} />
                            <div style={{ fontSize: 10, color: "rgba(245,230,200,0.4)", marginTop: 6, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>{form.content.length}/500</div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <label className="form-label">Date</label>
                                <input type="date" className="form-input" value={form.date} onChange={e => set("date", e.target.value)} style={{ colorScheme: "dark" }} />
                            </div>
                            <div>
                                <label className="form-label">Time</label>
                                <input type="time" className="form-input" value={form.time} onChange={e => set("time", e.target.value)} style={{ colorScheme: "dark" }} />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Location</label>
                            <input className="form-input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g., Community Hall" />
                        </div>

                        <div>
                            <label className="form-label">Category</label>
                            <select className="form-input" value={form.category} onChange={e => set("category", e.target.value)}>
                                <option value="" style={{ background: "#0D0D0D" }}>Select Category</option>
                                {["Meeting", "Celebration", "Workshop", "Festival", "Other"].map(c => (
                                    <option key={c} value={c} style={{ background: "#0D0D0D" }}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Right col - Image */}
                    <div>
                        <label className="form-label">Event Image {!isEdit && "*"}</label>
                        <div
                            className={`drop-zone ${drag ? "active" : ""}`}
                            style={{ minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "calc(100% - 24px)" }}
                            onDragOver={e => { e.preventDefault(); setDrag(true) }}
                            onDragLeave={() => setDrag(false)}
                            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
                            onClick={() => document.getElementById("ev-file-input").click()}
                        >
                            <input id="ev-file-input" type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

                            {preview ? (
                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <img src={preview} alt="preview" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(200,169,106,0.2)" }} />
                                    <p style={{ margin: "16px 0 0", fontSize: 11, color: "#C8A96A", fontWeight: 800, textAlign: "center", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        {file ? `✓ ${file.name}` : "Click to change image"}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#121212", border: "1px solid rgba(200,169,106,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "rgba(200,169,106,0.6)" }}>
                                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#F5E6C8", fontSize: 16 }}>Drop image here</p>
                                    <p style={{ margin: 0, fontSize: 12, color: "rgba(245,230,200,0.5)" }}>or <span style={{ color: "#C8A96A" }}>browse</span></p>
                                    <p style={{ margin: "6px 0 0", fontSize: 10, color: "rgba(245,230,200,0.3)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>JPG, PNG, GIF · Max 5MB</p>
                                </>
                            )}
                        </div>

                        {isEdit && (
                            <p style={{ fontSize: 10, color: "rgba(245,230,200,0.4)", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>
                                Leave empty to keep current image
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "20px 28px", borderTop: "1px solid rgba(200,169,106,0.15)", display: "flex", gap: 12, justifyContent: "flex-end", background: "#121212" }}>
                    <button onClick={onClose} style={{ padding: "12px 24px", borderRadius: 4, border: "1px solid rgba(200,169,106,0.3)", background: "transparent", fontWeight: 700, cursor: "pointer", fontSize: 11, color: "#C8A96A", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={submit} disabled={loading} style={{ padding: "12px 24px", fontSize: 11 }}>
                        {loading ? (
                            <><div style={{ width: 14, height: 14, border: "2px solid rgba(13,13,13,0.3)", borderTopColor: "#0D0D0D", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Saving...</>
                        ) : isEdit ? "Save Changes" : "Add Event"}
                    </button>
                </div>
            </div>
        </div>
    )
}
