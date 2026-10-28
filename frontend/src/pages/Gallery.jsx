import React, { useState, useEffect, useCallback } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await galleryService.getPublic();
        if (res.data?.items) {
          setImages(res.data.items);
        }
      } catch (err) {
        console.error('Gallery load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['All', ...new Set(images.map(img => img.category).filter(Boolean))];

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter(img => img.category === activeCategory);

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback((e) => {
    if (selectedIndex === null) return;
    if (e.key === 'Escape') setSelectedIndex(null);
    if (e.key === 'ArrowRight') {
      setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
    }
    if (e.key === 'ArrowLeft') {
      setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    }
  }, [selectedIndex, filteredImages.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) return <Loader message="Accessing Visual Archives & Gallery..." />;

  const currentImage = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // VISUAL ARCHIVES
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          EVENT <span className="text-gradient">GALLERY</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Memorable moments, 24-hour sprint milestones, architectural mentorship desks, and grand pitch valedictory captures.
        </p>

        {/* Category Filter Pills */}
        {images.length > 0 && categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedIndex(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-black font-bold shadow-neon-emerald scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {images.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="Event captures will appear here soon."
          message="High-resolution event photographs will be published by the media committee as the hackathon unfolds."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img, idx) => (
            <motion.div
              key={img._id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 8) * 0.05, duration: 0.4 }}
              onClick={() => setSelectedIndex(idx)}
              className="group cursor-pointer overflow-hidden relative aspect-square border border-white/[0.08] bg-zinc-950/60 hover:border-emerald-500/40 rounded-3xl transition-all"
            >
              <img
                src={getImageUrl(img.imageUrl)}
                alt={img.caption || 'Hackathon moment'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    {img.category || 'CSBS_CODEX'}
                  </span>
                  <Maximize2 className="w-4 h-4 text-zinc-300 group-hover:text-emerald-300" />
                </div>
                {img.caption && (
                  <p className="text-xs font-semibold text-white line-clamp-2 mt-1 font-sans">{img.caption}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#090b10] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              {/* Controls */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-zinc-300 hover:text-white hover:bg-black transition-colors z-20 border border-white/10"
                aria-label="Close image"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next */}
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black border border-white/10 z-20 transition-transform hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedIndex((prev) => (prev + 1) % filteredImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black border border-white/10 z-20 transition-transform hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="bg-black flex items-center justify-center min-h-[50vh] max-h-[75vh] overflow-hidden">
                <img
                  src={getImageUrl(currentImage.imageUrl)}
                  alt={currentImage.caption || 'Expanded moment'}
                  className="max-h-[75vh] max-w-full object-contain"
                />
              </div>

              <div className="p-5 bg-[#07080a] border-t border-white/10 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <p className="font-bold text-white">{currentImage.caption || 'CSBS NEXACK Moment'}</p>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {selectedIndex + 1} / {filteredImages.length}
                  </span>
                </div>
                <span className="font-mono text-emerald-400 text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {currentImage.category || 'Gallery'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
