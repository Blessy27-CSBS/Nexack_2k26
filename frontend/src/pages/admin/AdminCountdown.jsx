import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countdownService } from '../../services/api';
import { Plus, Edit2, Trash2, X, Check, Timer } from 'lucide-react';
import Loading from '../../components/common/Loading';

const AdminCountdown = () => {
    const [countdown, setCountdown] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        targetDate: ''
    });

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const { data } = await countdownService.get();
                if (isMounted) setCountdown(data);
            } catch (error) {
                console.error("Admin API error:", error);
                if (isMounted) setCountdown(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const fetchCountdown = async () => {
        try {
            const { data } = await countdownService.get();
            setCountdown(data);
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            targetDate: ''
        });
        setEditing(false);
    };

    const handleEdit = () => {
        if (countdown) {
            setEditing(true);
            setFormData({
                title: countdown.title || '',
                targetDate: countdown.targetDate ? new Date(countdown.targetDate).toISOString().slice(0, 16) : ''
            });
            setShowModal(true);
        }
    };

    const handleDelete = async () => {
        if (!countdown) return;
        if (window.confirm('Are you sure you want to delete the active countdown?')) {
            try {
                await countdownService.delete(countdown._id);
                fetchCountdown();
            } catch (error) {
                alert('Error deleting countdown');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing && countdown) {
                await countdownService.update(countdown._id, formData);
            } else {
                await countdownService.create(formData);
            }
            setShowModal(false);
            resetForm();
            fetchCountdown();
        } catch (error) {
            alert('Error saving countdown');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6 overflow-x-hidden overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black text-white red-gradient-animate flex items-center gap-4 uppercase">
                    <Timer size={40} /> MANAGE COUNTDOWN
                </h1>
                {!countdown && (
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="flex items-center gap-2 px-6 py-4 bg-white text-black font-black rounded-xl shadow-2xl hover:scale-105 transition-all uppercase text-[10px] tracking-widest"
                    >
                        <Plus size={20} /> CREATE COUNTDOWN
                    </button>
                )}
            </div>

            <div className="overflow-x-auto sticker-card p-0 border-none rounded-2xl">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-white/20">TITLE</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-white/20">TARGET DATE</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-white/20">STATUS</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-white/20 text-center">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {countdown ? (
                            <tr className="hover:bg-white/5 transition-colors group">
                                <td className="p-6">
                                    <div className="font-bold text-lg">{countdown.title}</div>
                                </td>
                                <td className="p-6">
                                    <div className="text-sm font-semibold">{new Date(countdown.targetDate).toLocaleString()}</div>
                                </td>
                                <td className="p-6">
                                    <span className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" /> ACTIVE
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={handleEdit}
                                            className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/5"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="p-3 bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-lg transition-colors border border-red-500/10"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-gray-500 font-bold uppercase">
                                    No active countdown found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="sticker-card w-full max-w-2xl bg-black p-8 sm:p-12 relative border-t-8 border-white/10 shadow-[0_40px_100px_rgba(255,255,255,0.05)]"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-8 right-8 text-white/20 hover:text-white"
                            >
                                <X size={32} />
                            </button>

                            <h2 className="text-3xl font-black mb-10 text-white uppercase red-gradient-animate tracking-tighter">
                                {editing ? 'UPDATE COUNTDOWN' : 'CREATE COUNTDOWN'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">TITLE</label>
                                    <input
                                        type="text" required className="w-full" placeholder="Countdown Title"
                                        value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">TARGET DATE</label>
                                    <input
                                        type="datetime-local" required className="w-full"
                                        value={formData.targetDate} onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-white text-black font-black rounded-xl shadow-2xl mt-6 uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {editing ? 'UPDATE TIMER' : 'START TIMER'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCountdown;
