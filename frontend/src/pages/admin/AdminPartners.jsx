import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { partnerService, getImageUrl } from '../../services/api';
import { Plus, Edit2, Trash2, Camera, LinkIcon } from 'lucide-react';
import Loading from '../../components/common/Loading';

const AdminPartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        website: '',
        logo: null
    });

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const { data } = await partnerService.getAll();
                if (isMounted) setPartners(data || []);
            } catch (error) {
                console.error("Admin API error:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const fetchPartners = async () => {
        try {
            const { data } = await partnerService.getAll();
            setPartners(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name,
            website: partner.website || '',
            logo: null
        });
        setPreview(getImageUrl(partner.logo));
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this partner?')) {
            try {
                await partnerService.delete(id);
                fetchPartners();
            } catch (error) {
                alert('Error deleting');
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        if (formData.website) {
            data.append('website', formData.website);
        }
        if (formData.logo) {
            data.append('logo', formData.logo);
        }

        try {
            if (editingPartner) {
                await partnerService.update(editingPartner._id, data);
            } else {
                if (!formData.logo) throw new Error('Logo is required');
                await partnerService.create(data);
            }
            setShowModal(false);
            fetchPartners();
        } catch (error) {
            alert(error.message || 'Error saving partner');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6 overflow-x-hidden overflow-y-auto">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black text-white red-gradient-animate uppercase">PARTNERS</h1>
                <button
                    onClick={() => { setEditingPartner(null); setPreview(null); setFormData({ name: '', website: '', logo: null }); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-4 bg-white text-black font-black rounded-xl shadow-2xl hover:scale-105 transition-all text-[10px] tracking-widest uppercase"
                >
                    <Plus size={20} /> ADD PARTNER
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.isArray(partners) && partners.map((partner) => (
                    <motion.div
                        key={partner._id} layout
                        className="sticker-card p-6 flex flex-col items-center text-center group"
                    >
                        <div className="w-full h-32 rounded-xl bg-white/5 overflow-hidden mb-6 border-2 border-transparent group-hover:border-white/10 transition-colors flex items-center justify-center p-4">
                            <img src={getImageUrl(partner.logo)} alt={partner.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <h3 className="font-bold uppercase tracking-tight mb-2 text-white/80 group-hover:text-white transition-colors">{partner.name}</h3>
                        {partner.website && (
                            <div className="text-[10px] text-white/20 mb-6 flex items-center justify-center gap-1 font-black uppercase tracking-widest group-hover:text-white/40 transition-colors">
                                <LinkIcon size={12} /> <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a>
                            </div>
                        )}
                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => handleEdit(partner)} className="p-2 text-gray-500 hover:text-white transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(partner._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 mt-16 md:mt-0 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="sticker-card w-full max-w-md bg-black p-8 relative border-t-8 border-white/10 shadow-[0_40px_100px_rgba(255,255,255,0.05)] max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-black mb-10 text-white uppercase red-gradient-animate tracking-tighter">
                                {editingPartner ? 'UPDATE PARTNER' : 'ADD PARTNER'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col items-center justify-center mb-6">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">PARTNER LOGO</label>
                                    <div
                                        onClick={() => document.getElementById('logo-up').click()}
                                        className="w-full h-32 rounded-xl border-4 border-dashed border-white/5 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-white/20 transition-colors"
                                    >
                                        {preview ? (
                                            <img src={preview} className="max-w-full max-h-full object-contain p-2" />
                                        ) : (
                                            <Camera className="text-white/10" />
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Upload Logo</span>
                                        </div>
                                    </div>
                                    <input id="logo-up" type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">PARTNER NAME</label>
                                    <input
                                        type="text" required className="w-full"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter partner name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">WEBSITE (OPTIONAL)</label>
                                    <input
                                        type="url" className="w-full"
                                        value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-white text-black font-black rounded-xl shadow-2xl mt-6 uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {editingPartner ? 'SAVE CHANGES' : 'CREATE PARTNER'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPartners;
