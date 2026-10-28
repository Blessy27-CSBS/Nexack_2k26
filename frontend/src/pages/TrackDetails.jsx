import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers, CheckCircle2, Sparkles, Cpu, Terminal } from 'lucide-react';
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

  if (loading) return <Loader message="Loading Challenge Specification..." />;

  if (!track) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <EmptyState
          icon={Layers}
          title="Challenge Not Found"
          message="The requested problem domain does not exist or has not been published."
          actionText="Back to All Challenges"
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
        className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-zinc-400 hover:text-emerald-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO ALL CHALLENGES</span>
      </Link>

      {/* Hero Banner */}
      <div className="p-8 sm:p-12 mb-10 relative overflow-hidden bg-gradient-to-b from-[#0e111a] to-[#07080a] border border-white/[0.08] rounded-3xl">
        {track.bannerImage && (
          <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-8 bg-zinc-900 border border-white/5">
            <img
              src={getImageUrl(track.bannerImage)}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center space-x-3 mb-4">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            CHALLENGE #{track.trackNumber}
          </span>
          <span className="text-xs font-mono text-zinc-400 uppercase">
            // CSBS NEXACK TRACK
          </span>
        </div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mb-4 leading-tight">
          {track.title}
        </h1>

        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl font-sans">
          {track.shortDescription}
        </p>

        <Link
          to={`/register?track=${track._id}`}
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-black font-heading font-black text-xs sm:text-sm tracking-wider uppercase shadow-neon-emerald hover:scale-105 transition-transform"
        >
          <span>SELECT THIS CHALLENGE</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </Link>
      </div>

      {/* Detailed Specifications */}
      <div className="space-y-8">
        {track.detailedDescription && (
          <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-2xl">
            <h3 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
              // 01 PROBLEM SCOPE & ARCHITECTURAL BRIEF
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
              {track.detailedDescription}
            </p>
          </div>
        )}

        {/* Problem Areas */}
        {track.problemAreas && track.problemAreas.length > 0 && (
          <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-2xl">
            <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
              // 02 KEY BOTTLENECKS & FOCUS DOMAINS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {track.problemAreas.map((area, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-zinc-200 font-sans">{area}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Tech */}
        {track.suggestedTechnologies && track.suggestedTechnologies.length > 0 && (
          <div className="p-8 border border-white/[0.08] bg-zinc-950/60 rounded-2xl">
            <h3 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest mb-4">
              // 03 RECOMMENDED TECHNOLOGIES & TOOLS
            </h3>
            <div className="flex flex-wrap gap-2">
              {track.suggestedTechnologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold"
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
