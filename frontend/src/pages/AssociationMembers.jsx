import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { associationService, getImageUrl } from '../services/api';
import { User, Phone, Mail } from 'lucide-react';

const AssociationMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const { data } = await associationService.getAll();
                setMembers(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
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

    const leadershipRoles = ['President', 'Vice President', 'Secretary', 'Joint Secretary', 'Treasurer'];

    const leadershipMembers = [...members]
        .filter(m => leadershipRoles.includes(m.role))
        .sort((a, b) => leadershipRoles.indexOf(a.role) - leadershipRoles.indexOf(b.role));

    const mediaMembers = members.filter(m => m.role === 'Media Member');
    const eventCoordinators = members.filter(m => m.role === 'Event Coordinator');

    const renderMemberCard = (member, index) => (
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
            className="max-w-lg mx-auto w-full rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 card-lift group flex flex-col relative"
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
                <span className="px-6 py-2 bg-white/5 text-gray-300 font-bold rounded-full text-base tracking-wider border border-white/5 uppercase transition-all duration-700 group-hover:bg-white/10 group-hover:text-white">
                    {member.role}
                </span>

                {member.contact && (
                    <div className="pt-3 flex items-center gap-3 text-gray-300 font-black text-[10px] tracking-[0.2em] group-hover:text-white transition-colors duration-700 uppercase">
                        <Phone size={16} className="opacity-75" />
                        <span>{member.contact}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );

    return (
        <div id="association-top" className="min-h-screen py-32 container mx-auto px-4 sm:px-6 relative overflow-hidden scroll-mt-24 section-glow">
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
                        ASSOCIATION
                    </h1>
                    <p className="text-gray-300 text-xs font-black uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">THE DEDICATED TEAM WORKING BEHIND THE SCENES TO MAKE THIS SYMPOSIUM A GRAND SUCCESS.</p>
                </motion.div>
            </div>

            {leadershipMembers.length > 0 && (
                <div className="mb-40 relative z-10">
                    <h2 className="text-sm font-black mb-20 text-center fast-red-gradient uppercase tracking-[0.6em] flex items-center justify-center gap-8">
                        <span className="w-12 h-[1px] bg-white/10"></span>
                        LEADERSHIP
                        <span className="w-12 h-[1px] bg-white/10"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-6 justify-items-center">
                        {leadershipMembers.map((member, index) => renderMemberCard(member, index))}
                    </div>
                </div>
            )}

            {mediaMembers.length > 0 && (
                <div className="mb-40 relative z-10">
                    <h2 className="text-sm font-black mb-20 text-center fast-red-gradient uppercase tracking-[0.6em] flex items-center justify-center gap-8">
                        <span className="w-12 h-[1px] bg-white/10"></span>
                        MEDIA TEAM
                        <span className="w-12 h-[1px] bg-white/10"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-6 justify-items-center">
                        {mediaMembers.map((member, index) => renderMemberCard(member, index))}
                    </div>
                </div>
            )}

            {eventCoordinators.length > 0 && (
                <div className="pb-24 relative z-10">
                    <h2 className="text-[10px] font-black mb-20 text-center text-white/40 uppercase tracking-[0.6em] flex items-center justify-center gap-8">
                        <span className="w-12 h-[1px] bg-white/10"></span>
                        EVENT COORDINATORS
                        <span className="w-12 h-[1px] bg-white/10"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-6 justify-items-center">
                        {eventCoordinators.map((member, index) => renderMemberCard(member, index))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssociationMembers;
