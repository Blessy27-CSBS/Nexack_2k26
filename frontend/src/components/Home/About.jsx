import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section className="py-32 relative overflow-hidden section-glow">
            {/* Premium Atmosphere Layers */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_40%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.03),transparent_50%)]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row items-center gap-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="md:w-1/2"
                    >
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-10">ABOUT THE SYMPOSIUM</p>
                        <h2 className="text-4xl md:text-6xl font-black mb-12 leading-none tracking-tighter fast-red-gradient uppercase">
                            THE CONVERGENCE <br />
                            <span className="text-white/50 text-3xl md:text-5xl">OF MINDS</span>
                        </h2>
                        <div className="space-y-8 text-base md:text-lg text-gray-300 leading-relaxed font-medium">
                            <p>
                                Z-NEXUS 2K26 is the premier National Level Technical Symposium organized by the Department of Computer Science and Business Systems at KGiSL Institute of Technology.
                            </p>
                            <p>
                                Our objective is to provide a platform for aspiring engineers and innovators to showcase their technical prowess, creative problem-solving skills, and business acumen through a diverse range of events.
                            </p>
                            <p className="border-l border-white/20 pl-8 text-sm italic py-2 text-white/60">
                                From intensive coding challenges to strategic business pitching, Z-NEXUS is where technology meets enterprise.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="md:w-1/2 relative group"
                    >
                        <div className="sticker-card p-2 rounded-[3.5rem] bg-white/[0.02] border border-white/5 shadow-2xl overflow-hidden relative">
                            {/* Glass Reflection */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10 opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />

                            <img
                                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                                alt="Collaboration"
                                className="w-full h-full object-cover rounded-[3rem] grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] scale-110 group-hover:scale-100"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
