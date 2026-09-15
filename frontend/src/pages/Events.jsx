import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { MapPin, Calendar, Users, User, Phone, Clock } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await eventService.getAll();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
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
        <div id="events-top" className="min-h-screen py-32 container mx-auto px-4 sm:px-6 relative overflow-hidden scroll-mt-24 section-glow">
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
                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-8 leading-none tracking-tighter fast-red-gradient uppercase">
                        ALL EVENTS
                    </h1>
                    <p className="text-gray-300 text-xs font-black uppercase tracking-[0.3em] max-w-xl mx-auto">JOIN OUR DIVERSE RANGE OF TECHNICAL COMPETITIONS AND SHOWCASE YOUR SKILLS.</p>
                    <p className="mt-2 text-sm md:text-base font-semibold tracking-wide text-gray-300">
                        PARTICIPANTS MUST REGISTER FOR 1 TECHNICAL EVENT AND 1 NON-TECHNICAL EVENT.
                    </p>
                </motion.div>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-32 liquid-glass rounded-[3rem] border border-white/5 relative z-10">
                    <p className="text-xs text-white/40 font-black uppercase tracking-[0.4em]">NO EVENTS DISCOVERED YET</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                    {events.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="sticker-card card-lift overflow-hidden flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] group"
                        >
                            <div className="h-48 bg-white/[0.01] relative flex items-center justify-center overflow-hidden border-b border-white/5">
                                {/* Glass Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-1000" />

                                <div className="p-8 text-center z-10 relative">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight group-hover:scale-105 transition-transform duration-1000 ease-[0.16, 1, 0.3, 1]">{event.title}</h3>
                                    <div className="mt-6 flex flex-col items-center gap-2">
                                        <span className="px-5 py-2 bg-white/5 rounded-full text-[9px] font-black tracking-[0.3em] text-gray-300 border border-white/5 uppercase">
                                            {event.eventType}
                                        </span>
                                        <span className="text-[8px] font-black tracking-[0.2em] text-white/30 uppercase">
                                            {event.category} Event
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 flex flex-col flex-grow">
                                <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-10 font-bold uppercase tracking-widest">{event.description}</p>

                                <div className="space-y-5 text-[10px] font-black text-gray-300 mb-12 uppercase tracking-[0.2em]">
                                    <div className="flex items-center gap-4 group/item">
                                        <Calendar size={14} className="opacity-40 group-hover/item:text-white transition-colors" />
                                        <span className="group-hover/item:text-white/60 transition-colors">{event.date}</span>
                                    </div>
                                    {event.time && (
                                        <div className="flex items-center gap-4 group/item">
                                            <Clock size={14} className="opacity-40 group-hover/item:text-white transition-colors" />
                                            <span className="group-hover/item:text-white/60 transition-colors">{event.time}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 group/item">
                                        <MapPin size={14} className="opacity-40 group-hover/item:text-white transition-colors" />
                                        <span className="group-hover/item:text-white/60 transition-colors">{event.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-4 group/item">
                                        <User size={14} className="opacity-40 group-hover/item:text-white transition-colors" />
                                        <span className="group-hover/item:text-white/60 transition-colors">{event.coordinatorName}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex gap-4">
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black tracking-[0.2em] text-center rounded-2xl border border-white/5 transition-all duration-700 ease-[0.16, 1, 0.3, 1] hover:scale-[1.03] active:scale-[0.97]"
                                    >
                                        VIEW DETAILS
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex-1 py-5 bg-white text-black text-[9px] font-black tracking-[0.2em] text-center rounded-2xl hover:bg-white/90 transition-all duration-700 ease-[0.16, 1, 0.3, 1] hover:scale-[1.03] active:scale-[0.97] shadow-xl"
                                    >
                                        REGISTER NOW
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
