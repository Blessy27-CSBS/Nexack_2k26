import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Search, Cpu, Sparkles } from 'lucide-react';
import { trackService, getImageUrl } from '../services/api';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import ArtmasterTrackCards from '../components/Home/ArtmasterTrackCards';

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await trackService.getPublished();
        if (res.data?.tracks) {
          setTracks(res.data.tracks);
        }
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  if (loading) return <Loader message="Loading Tracks..." />;

  const filteredTracks = tracks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
    (t.problemAreas && t.problemAreas.some(p => p.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Innovation Domains
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          HACKATHON <span className="text-gradient">TRACKS</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Explore the challenge domains for NEXACK 2K26. Choose the track aligned with your squad's technical expertise and passion.
        </p>

        {/* Search Bar */}
        {tracks.length > 0 && (
          <div className="relative max-w-md mx-auto mt-8">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tracks, problem areas or tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        )}
      </div>

      {/* Featured Artmaster Carousel when not searching */}
      {tracks.length > 0 && !search && (
        <div className="mb-14">
          <ArtmasterTrackCards tracks={tracks} />
        </div>
      )}

      {/* Tracks Grid */}
      {tracks.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Hackathon tracks will be announced soon."
          message="The competition committee is curating the official technology problem domains. Check back shortly!"
        />
      ) : filteredTracks.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Matching Tracks"
          message="No tracks matched your search query. Try searching for different keywords."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <div
              key={track._id}
              className="cyber-card p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              {track.bannerImage && (
                <div className="w-full h-36 rounded-xl overflow-hidden mb-4 bg-white/5">
                  <img
                    src={getImageUrl(track.bannerImage)}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                    TRACK #{track.trackNumber}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {track.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 mb-4">
                  {track.shortDescription}
                </p>

                {/* Problem Areas */}
                {track.problemAreas && track.problemAreas.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1.5">Problem Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {track.problemAreas.slice(0, 3).map((area, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Tech */}
                {track.suggestedTechnologies && track.suggestedTechnologies.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-mono text-slate-500 uppercase mb-1.5">Tech Stack Ideas:</p>
                    <div className="flex flex-wrap gap-1">
                      {track.suggestedTechnologies.slice(0, 4).map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/5 text-cyan-300 border border-cyan-500/15">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                <Link
                  to={`/tracks/${track._id}`}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <span>Explore Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/register?track=${track._id}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tracks;
