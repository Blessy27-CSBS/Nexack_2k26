import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staffService, getImageUrl } from '../../services/api';
import { Plus, Edit2, Trash2, X, GraduationCap, Camera } from 'lucide-react';
import Loading from '../../components/common/Loading';

const AdminStaff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        department: '',
        photo: null
    });

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const { data } = await staffService.getAll();
                if (isMounted) setStaff(data || []);
            } catch (error) {
                console.error("Admin API error:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const fetchStaff = async () => {
        try {
            const { data } = await staffService.getAll();
            setStaff(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (member) => {
        setEditingStaff(member);
        setFormData({
            name: member.name,
            designation: member.designation,
            department: member.department,
            photo: null
        });
        setPreview(getImageUrl(member.photo));
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this faculty coordinator?')) {
            try {
                await staffService.delete(id);
                fetchStaff();
            } catch (error) {
                alert('Error deleting');
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('designation', formData.designation);
        data.append('department', formData.department);
        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        try {
            if (editingStaff) {
                await staffService.update(editingStaff._id, data);
            } else {
                if (!formData.photo) throw new Error('Photo is required');
                await staffService.create(data);
            }
            setShowModal(false);
            fetchStaff();
        } catch (error) {
            alert(error.message || 'Error saving staff');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6 overflow-x-hidden overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black text-white red-gradient-animate uppercase">STAFF COORDINATORS</h1>
                <button
                    onClick={() => { setEditingStaff(null); setPreview(null); setFormData({ name: '', designation: '', department: '', photo: null }); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-4 bg-white text-black font-black rounded-xl shadow-2xl hover:scale-105 transition-all text-[10px] tracking-widest uppercase"
                >
                    <Plus size={20} /> ADD STAFF
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.isArray(staff) && staff.map((member) => (
                    <motion.div
                        key={member._id} layout
                        className="sticker-card p-0 flex flex-col items-center text-center overflow-hidden group"
                    >
                        <div className="w-full h-48 relative overflow-hidden">
                            <img src={getImageUrl(member.photo)} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button onClick={() => handleEdit(member)} className="p-2 bg-black/50 text-white rounded-lg hover:bg-orangeSplash transition-colors"><Edit2 size={14} /></button>
                                <button onClick={() => handleDelete(member._id)} className="p-2 bg-black/50 text-white rounded-lg hover:bg-red-500 transition-colors"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold uppercase tracking-tight text-white/90 group-hover:text-white transition-colors mb-1">{member.name}</h3>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">{member.designation}</p>
                            <p className="text-[9px] text-white/10 font-black uppercase mt-4 tracking-widest">DEPT OF {member.department}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="sticker-card w-full max-w-md bg-black p-8 relative border-t-8 border-white/10 shadow-[0_40px_100px_rgba(255,255,255,0.05)]"
                        >
                            <h2 className="text-2xl font-black mb-10 text-white uppercase red-gradient-animate tracking-tighter">
                                {editingStaff ? 'UPDATE STAFF' : 'ADD STAFF'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex justify-center mb-6">
                                    <div
                                        onClick={() => document.getElementById('staff-photo-up').click()}
                                        className="w-32 h-32 rounded-xl border-4 border-dashed border-white/5 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-white/20 transition-colors"
                                    >
                                        {preview ? (
                                            <img src={preview} className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="text-white/10" />
                                        )}
                                    </div>
                                    <input id="staff-photo-up" type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">NAME</label>
                                    <input
                                        type="text" required className="w-full"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">DESIGNATION</label>
                                    <input
                                        type="text" required className="w-full" placeholder="e.g. Assistant Professor"
                                        value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">DEPARTMENT</label>
                                    <input
                                        type="text" required className="w-full" placeholder="e.g. CS & BS"
                                        value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-white text-black font-black rounded-xl shadow-2xl mt-6 uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    SAVE STAFF
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminStaff;
