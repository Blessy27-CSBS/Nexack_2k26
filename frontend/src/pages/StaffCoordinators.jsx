import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staffService, getImageUrl } from '../services/api';
import { Award, BookOpen } from 'lucide-react';

const StaffCoordinators = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const { data } = await staffService.getAll();
                setStaff(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-b-2 border-white/20 rounded-full animate-spin-slow"></div>
                </div>
            </div>
        );
    }

    return (
        <div id="staff-top" className="min-h-screen py-32 container mx-auto px-4 sm:px-6 relative overflow-hidden scroll-mt-24">
            {/* Atmosphere Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.04),transparent_40%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.03),transparent_40%)]" />
            </div>

            <div className="mb-24 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-10 leading-none tracking-tighter fast-red-gradient uppercase">
                        FACULTY COORDINATOR
                    </h1>
                    <p className="text-gray-300 text-xs font-black uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">OUR FACULTY MEMBERS GUIDING THE SYMPOSIUM TO EXCELLENCE.</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto px-4 sm:px-6 relative z-10 justify-items-center">
                {staff.map((member, index) => (
                    <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-50px" }}
                        onMouseMove={(e) => {
                            if (window.innerWidth < 768) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            e.currentTarget.style.setProperty("--x", `${x}px`);
                            e.currentTarget.style.setProperty("--y", `${y}px`);
                        }}
                        className="max-w-lg mx-auto w-full rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_25px_70px_rgba(0,0,0,0.8)] group flex flex-col relative"
                    >
                        {/* Cursor Spotlight Overlay */}
                        <div
                            className="absolute inset-0 pointer-events-none bg-[radial-gradient(350px_circle_at_var(--x)_var(--y),rgba(255,255,255,0.08),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                        />

                        <div className="w-full h-96 relative overflow-hidden rounded-t-3xl">
                            <img
                                src={member.photo ? getImageUrl(member.photo) : 'https://via.placeholder.com/400x500'}
                                alt={member.name}
                                className="w-full h-full object-cover grayscale brightness-75 contrast-125 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 ease-[0.16, 1, 0.3, 1]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-1000"></div>

                            {/* Glass Reflection Component */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-1000" />
                        </div>

                        <div className="p-8 w-full relative z-10 text-center flex flex-col items-center space-y-3">
                            <h3 className="text-2xl font-semibold uppercase tracking-tight text-white group-hover:text-red-500 transition-colors duration-500">{member.name}</h3>
                            <p className="text-base text-gray-300 font-bold tracking-wider uppercase group-hover:text-white transition-colors duration-700">{member.designation}</p>

                            <div className="pt-3 flex items-center justify-center gap-3 text-white/40 font-black text-[10px] tracking-[0.2em] group-hover:text-white transition-colors duration-700 uppercase">
                                <BookOpen size={16} className="opacity-75" />
                                <span>DEPARTMENT OF {member.department}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StaffCoordinators;
