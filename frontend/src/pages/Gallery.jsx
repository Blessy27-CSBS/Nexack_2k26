import React, { useState, useEffect } from 'react';
import { Camera, X, Calendar, Tag } from 'lucide-react';
import { galleryService, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

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

  if (loading) return <Loader message="Loading Event Gallery..." />;

  const categories = ['All', ...new Set(images.map(img => img.category).filter(Boolean))];

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Visual Archives
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          EVENT <span className="text-gradient">GALLERY</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Memorable moments, development sprints, mentorship sessions, and grand finale captures.
        </p>

        {/* Category Filters */}
        {images.length > 0 && categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-black font-bold shadow-neon-cyan'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
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
          title="Event moments will appear here soon."
          message="High-resolution event photographs will be uploaded by the media team as the hackathon unfolds."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img._id || idx}
              onClick={() => setSelectedImage(img)}
              className="cyber-card group cursor-pointer overflow-hidden relative aspect-square border border-white/10"
            >
              <img
                src={getImageUrl(img.imageUrl)}
                alt={img.caption || 'Hackathon moment'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                {img.caption && (
                  <p className="text-xs font-medium text-white line-clamp-2">{img.caption}</p>
                )}
                <span className="text-[10px] font-mono text-cyan-400 mt-1">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#0c0f1c] rounded-2xl overflow-hidden border border-white/10"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={getImageUrl(selectedImage.imageUrl)}
              alt={selectedImage.caption}
              className="w-full max-h-[75vh] object-contain bg-black"
            />

            <div className="p-4 sm:p-6 bg-[#0c0f1c] flex items-center justify-between text-xs sm:text-sm">
              <p className="font-semibold text-white">{selectedImage.caption || 'NEXACK 2K26 Moment'}</p>
              <span className="font-mono text-cyan-400">{selectedImage.category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
