import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventService } from '../services/api';
import { Calendar, MapPin, User, Phone, ArrowLeft, Trophy, Info, List, Clock } from 'lucide-react';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await eventService.getById(id);
                setEvent(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

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

    if (!event) return <div className="text-center py-40 uppercase tracking-[0.5em] text-white/40 font-black">EVENT NOT FOUND</div>;

    return (
        <div className="min-h-screen py-32 container mx-auto px-6 max-w-7xl relative overflow-hidden">
            {/* Atmosphere Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.04),transparent_40%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.03),transparent_40%)]" />
            </div>

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-4 text-gray-300 hover:text-white mb-20 group transition-all duration-700 ease-[0.16, 1, 0.3, 1] font-black text-[10px] uppercase tracking-[0.4em] relative z-10"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]" />
                BACK TO EVENTS
            </button>

            <div className="flex flex-col lg:flex-row gap-24 relative z-10">
                {/* Event Header Card */}
                <motion.div
                    initial={{ opacity: 0, x: -40, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:w-[450px]"
                >
                    <div className="sticker-card p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] shadow-3xl relative overflow-hidden group">
                        {/* Glass Reflection Component */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none" />

                        <h1 className="text-4xl md:text-6xl font-black mb-10 uppercase tracking-tighter text-white leading-[0.85] group-hover:scale-[1.02] transition-transform duration-1000 ease-[0.16, 1, 0.3, 1] red-gradient-animate">{event.title}</h1>
                        <div className="inline-block px-6 py-2 bg-white/5 text-gray-300 rounded-full font-black text-[9px] mb-16 tracking-[0.4em] border border-white/5 uppercase">
                            {event.eventType} EVENT
                        </div>

                        <div className="space-y-12">
                            <div className="flex items-center gap-6 group/item">
                                <div className="p-5 bg-white/3 rounded-[1.5rem] text-white/20 group-hover/item:text-white/60 transition-colors duration-500"><Calendar size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em] mb-2">DATE</p>
                                    <p className="text-base font-black text-white uppercase tracking-tighter transition-all">{event.date}</p>
                                </div>
                            </div>
                            {event.time && (
                                <div className="flex items-center gap-6 group/item">
                                    <div className="p-5 bg-white/3 rounded-[1.5rem] text-white/20 group-hover/item:text-white/60 transition-colors duration-500"><Clock size={20} /></div>
                                    <div>
                                        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em] mb-2">TIME</p>
                                        <p className="text-base font-black text-white uppercase tracking-tighter transition-all">{event.time}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-6 group/item">
                                <div className="p-5 bg-white/3 rounded-[1.5rem] text-white/20 group-hover/item:text-white/60 transition-colors duration-500"><MapPin size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em] mb-2">VENUE</p>
                                    <p className="text-base font-black text-white uppercase tracking-tighter transition-all">{event.venue}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group/item">
                                <div className="p-5 bg-white/3 rounded-[1.5rem] text-white/20 group-hover/item:text-white/60 transition-colors duration-500"><User size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em] mb-2">COORDINATOR</p>
                                    <p className="text-base font-black text-white uppercase tracking-tighter transition-all">{event.coordinatorName}</p>
                                    <p className="text-[10px] text-white/40 font-black mt-2 tracking-[0.2em] uppercase">{event.coordinatorPhone}</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/register"
                            className="mt-20 block w-full py-6 bg-white text-black text-center font-black text-xs rounded-2xl hover:scale-[1.03] active:scale-[0.97] transition-all duration-700 ease-[0.16, 1, 0.3, 1] shadow-2xl uppercase tracking-[0.4em]"
                        >
                            REGISTER NOW
                        </Link>
                    </div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, x: 40, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-grow space-y-24"
                >
                    {/* Description */}
                    <section>
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-1.5 h-6 bg-white opacity-20 rounded-full"></div>
                            <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.4em]">DESCRIPTION</h2>
                        </div>
                        <div className="bg-white/[0.02] p-12 rounded-[3.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.03),transparent_50%)]" />
                            <p className="text-gray-300 text-[15px] leading-loose whitespace-pre-wrap font-bold uppercase tracking-widest relative z-10 group-hover:text-white transition-colors duration-1000">
                                {event.description}
                            </p>
                        </div>
                    </section>

                    {/* Rules */}
                    <section>
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-1.5 h-6 bg-white opacity-20 rounded-full"></div>
                            <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.4em]">RULES & GUIDELINES</h2>
                        </div>
                        <div className="bg-white/[0.02] p-12 rounded-[3.5rem] border border-white/5 shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.03),transparent_50%)]" />
                            <div className="text-gray-300 text-[13px] whitespace-pre-wrap leading-loose font-bold uppercase tracking-[0.15em] relative z-10 group-hover:text-white transition-colors duration-1000">
                                {event.rules}
                            </div>
                        </div>
                    </section>

                    {event.eventType === 'Team' && (
                        <motion.section
                            initial={{ opacity: 0, y: 40, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white/[0.02] p-12 rounded-[3.5rem] border border-white/5 shadow-2xl flex items-center gap-10 hover:scale-[1.02] transition-transform duration-1000 ease-[0.16, 1, 0.3, 1]"
                        >
                            <div className="p-8 bg-white/5 rounded-[2rem] text-white/20">
                                <Trophy size={40} />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-white mb-2 uppercase tracking-[0.3em]">TEAM SIZE</h3>
                                <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]">MAX LIMIT: <span className="text-white opacity-80 ml-2 underline underline-offset-8">{event.maxTeamSize} MEMBERS</span></p>
                            </div>
                        </motion.section>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default EventDetails;
