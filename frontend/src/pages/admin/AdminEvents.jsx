import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService } from '../../services/api';
import { Plus, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import Loading from '../../components/common/Loading';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rules: '',
        venue: '',
        date: '',
        time: '',
        eventType: 'Individual',
        maxTeamSize: 1,
        coordinatorName: '',
        coordinatorPhone: '',
        category: 'Technical'
    });

    useEffect(() => {
        let isMounted = true;
        const loadInitialData = async () => {
            try {
                const { data } = await eventService.getAll();
                if (isMounted) setEvents(data);
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadInitialData();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [showModal]);

    const fetchEvents = async () => {
        try {
            const { data } = await eventService.getAll();
            setEvents(data);
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            rules: '',
            venue: '',
            date: '',
            time: '',
            eventType: 'Individual',
            maxTeamSize: 1,
            coordinatorName: '',
            coordinatorPhone: '',
            category: 'Technical'
        });
        setEditingEvent(null);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            rules: event.rules,
            venue: event.venue,
            date: event.date,
            time: event.time || '',
            eventType: event.eventType,
            maxTeamSize: event.maxTeamSize,
            coordinatorName: event.coordinatorName,
            coordinatorPhone: event.coordinatorPhone,
            category: event.category || 'Technical'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.delete(id);
                fetchEvents();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await eventService.update(editingEvent._id, formData);
            } else {
                await eventService.create(formData);
            }
            setShowModal(false);
            resetForm();
            fetchEvents();
        } catch (error) {
            alert('Error saving event');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6 overflow-x-hidden overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black text-white red-gradient-animate uppercase">MANAGE EVENTS</h1>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black rounded-xl shadow-2xl hover:scale-105 transition-all uppercase text-[10px] tracking-widest"
                >
                    <Plus size={20} /> CREATE EVENT
                </button>
            </div>

            <div className="overflow-x-auto sticker-card p-0 border-none rounded-2xl">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">EVENT TITLE</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">TYPE</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">CATEGORY</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">COORDINATOR</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">STATUS</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300 text-center">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {events.map((event) => (
                            <tr key={event._id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6">
                                    <div className="font-bold text-lg">{event.title}</div>
                                    <div className="text-xs text-gray-300">{event.date} {event.time ? `| ${event.time}` : ''} @ {event.venue}</div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-white/10 ${event.eventType === 'Team' ? 'bg-white/5 text-white/60' : 'bg-white/5 text-white/40'}`}>
                                        {event.eventType}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-white/10 bg-white/5 text-gray-300">
                                        {event.category}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="text-sm font-semibold">{event.coordinatorName}</div>
                                    <div className="text-xs text-gray-300">{event.coordinatorPhone}</div>
                                </td>
                                <td className="p-6">
                                    <span className="flex items-center gap-2 text-gray-300 text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" /> ACTIVE
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/5"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="p-3 bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-lg transition-colors border border-red-500/10"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 sm:p-12 overflow-y-auto overflow-x-hidden">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="modal-scroll sticker-card w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black p-8 sm:p-12 relative border-t-8 border-white/10 shadow-[0_40px_100px_rgba(255,255,255,0.05)]"
                        >
                            <div className="sticky -top-8 -mx-8 sm:-top-12 sm:-mx-12 px-8 sm:px-12 py-6 bg-black z-20 flex justify-between items-center border-b border-white/5 mb-8">
                                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase red-gradient-animate tracking-tighter">
                                    {editingEvent ? 'UPDATE EVENT' : 'CREATE EVENT'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={32} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">TITLE</label>
                                    <input
                                        type="text" required className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-6 py-5 text-sm outline-none focus:border-white/20" placeholder="Event Name"
                                        value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest">DESCRIPTION</label>
                                    <textarea
                                        rows="3" required className="w-full" placeholder="Short description for card"
                                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest">RULES (One per line)</label>
                                    <textarea
                                        rows="5" required className="w-full" placeholder="Event rules and guidelines..."
                                        value={formData.rules} onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest">DATE</label>
                                    <input
                                        type="text" required className="w-full" placeholder="e.g. 25th March, 10:00 AM"
                                        value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest">TIME</label>
                                    <input
                                        type="text" required className="w-full" placeholder="e.g. 10:00 AM - 12:00 PM"
                                        value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest">VENUE</label>
                                    <input
                                        type="text" required className="w-full" placeholder="e.g. Lab 4, CSE Block"
                                        value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest">EVENT TYPE</label>
                                    <select
                                        className="w-full bg-black text-white border border-white/5 rounded-xl px-6 py-5 text-sm outline-none focus:border-white/20 transition-all cursor-pointer"
                                        value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                    >
                                        <option value="Individual" className="bg-black text-white">Individual</option>
                                        <option value="Team" className="bg-black text-white">Team</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest">CATEGORY</label>
                                    <select
                                        className="w-full bg-black text-white border border-white/5 rounded-xl px-6 py-5 text-sm outline-none focus:border-white/20 transition-all cursor-pointer"
                                        value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Technical" className="bg-black text-white">Technical</option>
                                        <option value="Non-Technical" className="bg-black text-white">Non-Technical</option>
                                    </select>
                                </div>

                                {formData.eventType === 'Team' && (
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-300 uppercase tracking-widest">MAX TEAM SIZE</label>
                                        <input
                                            type="number" required className="w-full" min="1"
                                            value={formData.maxTeamSize} onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })}
                                        />
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest">COORDINATOR NAME</label>
                                    <input
                                        type="text" required className="w-full"
                                        value={formData.coordinatorName} onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-300 uppercase tracking-widest">COORDINATOR PHONE</label>
                                    <input
                                        type="tel" required className="w-full"
                                        value={formData.coordinatorPhone} onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="md:col-span-2 py-6 bg-white text-black font-black rounded-2xl shadow-2xl mt-8 uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {editingEvent ? 'UPDATE EVENT' : 'PUBLISH EVENT'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminEvents;
