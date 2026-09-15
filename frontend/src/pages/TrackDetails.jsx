import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers, Cpu, CheckCircle2, Share2 } from 'lucide-react';
import { trackService, getImageUrl } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const TrackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await trackService.getById(id);
        if (res.data?.track) {
          setTrack(res.data.track);
        }
      } catch (err) {
        console.error('Failed to load track:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrack();
  }, [id]);

  if (loading) return <Loader message="Loading Track Specifications..." />;

  if (!track) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <EmptyState
          icon={Layers}
          title="Track Not Found"
          message="The requested track does not exist or has not been published."
          actionText="Back to All Tracks"
          onAction={() => navigate('/tracks')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-white">
      {/* Back navigation */}
      <Link
        to="/tracks"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO ALL TRACKS</span>
      </Link>

      {/* Hero Banner */}
      <div className="cyber-card p-6 sm:p-10 mb-10 relative overflow-hidden">
        {track.bannerImage && (
          <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-8 bg-white/5">
            <img
              src={getImageUrl(track.bannerImage)}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center space-x-3 mb-4">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30">
            TRACK #{track.trackNumber}
          </span>
          <span className="text-xs font-mono text-slate-400 uppercase">
            NEXACK 2K26 Domain
          </span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mb-4">
          {track.title}
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
          {track.shortDescription}
        </p>

        <Link
          to={`/register?track=${track._id}`}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-extrabold text-sm tracking-wider uppercase shadow-neon-cyan hover:scale-105 transition-transform"
        >
          <span>REGISTER FOR THIS TRACK</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Detailed Content */}
      <div className="space-y-8">
        {track.detailedDescription && (
          <div className="cyber-card p-8">
            <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-4">
              Track Overview & Scope
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {track.detailedDescription}
            </p>
          </div>
        )}

        {/* Problem Areas */}
        {track.problemAreas && track.problemAreas.length > 0 && (
          <div className="cyber-card p-8">
            <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-4">
              Focus Problem Areas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {track.problemAreas.map((area, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-200">{area}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Tech */}
        {track.suggestedTechnologies && track.suggestedTechnologies.length > 0 && (
          <div className="cyber-card p-8">
            <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider mb-4">
              Recommended Technologies & Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {track.suggestedTechnologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackDetails;
