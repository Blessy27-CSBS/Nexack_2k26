import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, ArrowUpRight, Search, Cpu, Sparkles, Filter } from 'lucide-react';
import { trackService, getImageUrl } from '../services/api';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';

const defaultFallbackTracks = [
  {
    _id: 'track-1',
    trackNumber: '01',
    title: 'Autonomous Multi-Agent AI & LLM Workflows',
    category: 'ARTIFICIAL_INTELLIGENCE',
    difficulty: 'ADVANCED',
    shortDescription: 'Build self-orchestrating multi-agent networks that solve complex enterprise tasks, automate business ops, and perform real-time verification.',
    problemAreas: ['Autonomous Operations', 'Agent Verification', 'Enterprise Knowledge Synthesis'],
    suggestedTechnologies: ['Python', 'LangChain', 'FastAPI', 'React', 'Ollama', 'Redis']
  },
  {
    _id: 'track-2',
    trackNumber: '02',
    title: 'Decentralized Finance & Verifiable Proof Protocols',
    category: 'BLOCKCHAIN_WEB3',
    difficulty: 'ADVANCED',
    shortDescription: 'Develop next-gen zero-knowledge proof verification systems, decentralized identity frameworks, or transparent supply-chain liquidity protocols.',
    problemAreas: ['ZK-Rollups', 'Cross-Border Settlements', 'Self-Sovereign Identity'],
    suggestedTechnologies: ['Solidity', 'Circom', 'Ethers.js', 'Next.js', 'Hardhat', 'IPFS']
  },
  {
    _id: 'track-3',
    trackNumber: '03',
    title: 'Cloud-Native Distributed Resilience & Observability',
    category: 'DISTRIBUTED_SYSTEMS',
    difficulty: 'INTERMEDIATE',
    shortDescription: 'Architect self-healing microservice meshes with automated failover, intelligent bottleneck tracing, and predictive auto-scaling.',
    problemAreas: ['Chaos Engineering', 'Sub-second Anomaly Detection', 'Dynamic Mesh Routing'],
    suggestedTechnologies: ['Go', 'Rust', 'Docker', 'Kubernetes', 'Prometheus', 'gRPC']
  },
  {
    _id: 'track-4',
    trackNumber: '04',
    title: 'Next-Gen Intelligent Business Systems & FinTech',
    category: 'BUSINESS_SYSTEMS',
    difficulty: 'INTERMEDIATE',
    shortDescription: 'Design frictionless digital payment pipelines, algorithmic risk-mitigation models, and real-time fraud mitigation engines.',
    problemAreas: ['Fraud Stream Processing', 'Predictive Risk Scoring', 'Instant Liquidity Rails'],
    suggestedTechnologies: ['Node.js', 'Kafka', 'PostgreSQL', 'TailwindCSS', 'TypeScript']
  },
  {
    _id: 'track-5',
    trackNumber: '05',
    title: 'Smart Healthcare & Predictive Diagnostics',
    category: 'HEALTH_TECH',
    difficulty: 'ADVANCED',
    shortDescription: 'Engineer privacy-preserving clinical informatics platforms, automated radiological assistance, and patient vitals telemetry.',
    problemAreas: ['Federated Learning', 'Clinical Record Synthesis', 'Real-time Vitals Triaging'],
    suggestedTechnologies: ['PyTorch', 'TensorFlow', 'Python', 'React Native', 'WebRTC']
  },
  {
    _id: 'track-6',
    trackNumber: '06',
    title: 'Open Innovation & Disruptive Moonshots',
    category: 'OPEN_INNOVATION',
    difficulty: 'FLEXIBLE',
    shortDescription: 'Have a breakthrough invention outside traditional tracks? Prototype high-impact hardware-software integrations, AR interfaces, or robotics.',
    problemAreas: ['Hardware-Software Meshes', 'Spatial Computing', 'Autonomous Embedded Systems'],
    suggestedTechnologies: ['C++', 'Rust', 'Embedded C', 'WebXR', 'Three.js', 'MQTT']
  }
];

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await trackService.getPublished();
        if (res.data?.tracks && res.data.tracks.length > 0) {
          setTracks(res.data.tracks);
        } else {
          setTracks(defaultFallbackTracks);
        }
      } catch (err) {
        console.error('Failed to fetch tracks:', err);
        setTracks(defaultFallbackTracks);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  if (loading) return <Loader message="Loading Challenges & Tracks..." />;

  // Categories list
  const categories = ['ALL', ...new Set(tracks.map(t => t.category || 'INNOVATION'))];

  const filteredTracks = tracks.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
      (t.problemAreas && t.problemAreas.some(p => p.toLowerCase().includes(search.toLowerCase()))) ||
      (t.suggestedTechnologies && t.suggestedTechnologies.some(tech => tech.toLowerCase().includes(search.toLowerCase())));

    const matchesCategory = selectedCategory === 'ALL' || (t.category || 'INNOVATION') === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // PROBLEM DOMAINS
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          HACKATHON <span className="text-gradient">CHALLENGES</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Explore vetted problem statements across enterprise AI, blockchain, distributed clouds, and intelligent business systems.
        </p>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problem statements, areas, tech stacks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 font-sans"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tracks Grid */}
      {filteredTracks.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Matching Challenges Found"
          message="Try adjusting your search query or switching the category filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track, idx) => {
            const trackNum = track.trackNumber || String(idx + 1).padStart(2, '0');
            const category = track.category || 'CORE_DOMAIN';
            const difficulty = track.difficulty || 'ADVANCED';

            return (
              <div
                key={track._id || idx}
                className="p-7 rounded-2xl border border-white/[0.08] bg-zinc-950/60 hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Banner Image if available */}
                  {track.bannerImage && (
                    <div className="w-full h-36 rounded-xl overflow-hidden mb-5 bg-white/5 border border-white/5">
                      <img
                        src={getImageUrl(track.bannerImage)}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      CHALLENGE #{trackNum}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
                      {category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-emerald-300 transition-colors mb-3 leading-snug">
                    {track.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed font-sans mb-5">
                    {track.shortDescription || track.description}
                  </p>

                  {/* Problem Areas */}
                  {track.problemAreas && track.problemAreas.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">Problem Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {track.problemAreas.slice(0, 3).map((area, aIdx) => (
                          <span key={aIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-300 border border-white/5">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Tech */}
                  {track.suggestedTechnologies && track.suggestedTechnologies.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">Suggested Tech:</p>
                      <div className="flex flex-wrap gap-1">
                        {track.suggestedTechnologies.slice(0, 4).map((tech, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Link & Register */}
                <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between mt-4">
                  <Link
                    to={`/tracks/${track._id}`}
                    className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <span>DETAILS</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/register?track=${track._id}`}
                    className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 hover:text-black text-emerald-300 border border-emerald-500/30 transition-all"
                  >
                    SELECT CHALLENGE
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tracks;
