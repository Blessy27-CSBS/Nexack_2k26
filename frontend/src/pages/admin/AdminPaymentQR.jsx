import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { paymentQRService, getImageUrl } from '../../services/api';
import { Camera, Save } from 'lucide-react';
import Loading from '../../components/common/Loading';

const AdminPaymentQR = () => {
    const [currentQR, setCurrentQR] = useState({ image: '', text: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [upiText, setUpiText] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const { data } = await paymentQRService.get();
                if (isMounted) {
                    const safe = data && typeof data === 'object' ? data : { image: '', text: '' };
                    setCurrentQR(safe);
                    setUpiText(safe.text || '');
                    if (safe.image) {
                        setPreview(getImageUrl(safe.image));
                    }
                }
            } catch (err) {
                console.error("Admin API error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const loadQR = async () => {
        try {
            const { data } = await paymentQRService.get();
            const safe = data && typeof data === 'object' ? data : { image: '', text: '' };
            setCurrentQR(safe);
            setUpiText(safe.text || '');
            if (safe.image) {
                setPreview(getImageUrl(safe.image));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!imageFile && !currentQR.image) {
            alert('Please upload a QR image first');
            return;
        }
        setSaving(true);
        try {
            const form = new FormData();
            // Field names match the backend route: image + text
            if (imageFile) form.append('image', imageFile);
            form.append('text', upiText || '');

            const { data } = await paymentQRService.save(form);
            setCurrentQR(data);
            setImageFile(null);
            alert('QR saved successfully!');
        } catch (err) {
            console.error('Save failed:', err.message);
            alert('Error saving QR: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6 overflow-x-hidden overflow-y-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-white red-gradient-animate uppercase">PAYMENT CONFIGURATION</h1>
                <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] mt-4">SET UP QR CODE AND UPI ID FOR REGISTRATIONS</p>
            </div>

            <div className="max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="sticker-card p-8 sm:p-12 bg-black border-t-8 border-white/10 shadow-[0_40px_100px_rgba(255,255,255,0.05)] space-y-10"
                >
                    <form onSubmit={handleSave} className="space-y-8">
                        {/* QR Image Upload */}
                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">QR CODE IMAGE</label>
                            <div
                                onClick={() => document.getElementById('qr-upload-input').click()}
                                className="w-56 h-56 mx-auto bg-white/[0.02] border-4 border-dashed border-white/5 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-white/20 transition-all p-2"
                            >
                                {preview ? (
                                    <div className="w-full h-full p-4">
                                        <img src={preview} className="w-full h-full object-contain rounded-xl" alt="QR Preview" />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Camera className="text-white/10 mx-auto mb-2" size={40} />
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">UPLOAD QR</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                    <span className="text-sm font-bold tracking-widest">CHANGE IMAGE</span>
                                </div>
                            </div>
                            <input
                                id="qr-upload-input"
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* UPI ID Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">UPI ID</label>
                            <input
                                type="text"
                                className="w-full"
                                placeholder="e.g. znexus2026@upi"
                                value={upiText || ''}
                                onChange={(e) => setUpiText(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-5 bg-white text-black font-black rounded-xl shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-[10px] tracking-widest uppercase"
                        >
                            <Save size={20} />
                            {saving ? 'UPLOADING...' : 'SAVE CONFIGURATION'}
                        </button>
                    </form>

                    {currentQR.text && (
                        <div className="pt-8 border-t border-white/5">
                            <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em] mb-4">CURRENT CONFIGURATION</p>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                                <p className="font-black text-white/40 uppercase text-xs tracking-widest">UPI: {currentQR.text}</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPaymentQR;
