import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowRight, ArrowUpRight, X, Check, Code, Cpu, Sparkles, Shield, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';

const defaultMockChallenges = [
  {
    _id: 'default-1',
    trackNumber: '01',
    title: 'Autonomous Multi-Agent AI & LLM Workflows',
    category: 'ARTIFICIAL_INTELLIGENCE',
    difficulty: 'ADVANCED',
    status: 'ACTIVE',
    shortDescription: 'Build self-orchestrating multi-agent networks that solve complex enterprise tasks, automate business ops, and perform real-time verification.',
    problemStatement: 'Modern businesses suffer from fragmented micro-operations and slow manual synthesis. Build an autonomous agent architecture that leverages local/cloud LLMs with tool-use capabilities to self-coordinate and resolve end-to-end workflows.',
    expectedOutcome: 'A deployable multi-agent system with dynamic task decomposition, fault-tolerant retries, and an interactive monitoring dashboard.',
    suggestedTechnologies: ['Python', 'LangChain', 'FastAPI', 'React', 'Ollama', 'Redis'],
    problemAreas: ['Autonomous Operations', 'Agent Verification', 'Enterprise Knowledge Synthesis']
  },
  {
    _id: 'default-2',
    trackNumber: '02',
    title: 'Decentralized Finance & Verifiable Proof Protocols',
    category: 'BLOCKCHAIN_WEB3',
    difficulty: 'ADVANCED',
    status: 'ACTIVE',
    shortDescription: 'Develop next-gen zero-knowledge proof verification systems, decentralized identity frameworks, or transparent supply-chain liquidity protocols.',
    problemStatement: 'Trust and cryptographic proof are paramount in cross-border settlements and data privacy. Implement zero-knowledge verifiers or decentralized identity primitives ensuring complete compliance without exposing sensitive business telemetry.',
    expectedOutcome: 'Smart contract testnet deployment, client SDK, and an intuitive Web3 dashboard demonstrating instant cryptographic proofs.',
    suggestedTechnologies: ['Solidity', 'Circom', 'Ethers.js', 'Next.js', 'Hardhat', 'IPFS'],
    problemAreas: ['ZK-Rollups', 'Cross-Border Settlements', 'Self-Sovereign Identity']
  },
  {
    _id: 'default-3',
    trackNumber: '03',
    title: 'Cloud-Native Distributed Resilience & Observability',
    category: 'DISTRIBUTED_SYSTEMS',
    difficulty: 'INTERMEDIATE',
    status: 'ACTIVE',
    shortDescription: 'Architect self-healing microservice meshes with automated failover, intelligent bottleneck tracing, and predictive auto-scaling.',
    problemStatement: 'Distributed infrastructure at scale experiences cascading failures and silent performance degradation. Build an automated observability mesh that detects anomalies in sub-second time and triggers automated remediation without human intervention.',
    expectedOutcome: 'High-throughput microservices demo running across containers with live chaos-injection and instant self-healing recovery.',
    suggestedTechnologies: ['Go', 'Rust', 'Docker', 'Kubernetes', 'Prometheus', 'gRPC'],
    problemAreas: ['Chaos Engineering', 'Sub-second Anomaly Detection', 'Dynamic Mesh Routing']
  },
  {
    _id: 'default-4',
    trackNumber: '04',
    title: 'Next-Gen Intelligent Business Systems & FinTech',
    category: 'BUSINESS_SYSTEMS',
    difficulty: 'INTERMEDIATE',
    status: 'ACTIVE',
    shortDescription: 'Design frictionless digital payment pipelines, algorithmic risk-mitigation models, and real-time fraud mitigation engines.',
    problemStatement: 'Financial platforms require millisecond-level transaction safety and dynamic compliance verification. Construct an intelligent transaction analytics engine capable of streaming analysis and predictive risk profiling.',
    expectedOutcome: 'Interactive financial portal, real-time transaction simulator, and analytics dashboard with risk scoring.',
    suggestedTechnologies: ['Node.js', 'Kafka', 'PostgreSQL', 'TailwindCSS', 'TypeScript'],
    problemAreas: ['Fraud Stream Processing', 'Predictive Risk Scoring', 'Instant Liquidity Rails']
  }
];

const ChallengesSection = ({ tracks = [] }) => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const displayChallenges = tracks && tracks.length > 0 ? tracks : defaultMockChallenges;

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[160px] pointer-events-none -translate-y-1/2" />

      {/* Top Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            // 03 PROBLEM_STATEMENTS
          </span>
          <span className="text-zinc-600 font-mono text-xs hidden sm:inline">——</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
            CORE DOMAINS
          </span>
        </div>
        <Link
          to="/tracks"
          className="text-xs font-mono uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 group"
        >
          <span>EXPLORE ALL DOMAINS ({displayChallenges.length})</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Editorial Header */}
      <div className="max-w-3xl mb-16">
        <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] uppercase mb-4">
          THE <span className="text-gradient">CHALLENGES</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Select your battlefield. Each challenge represents an unfiltered technical bottleneck vetted by industry architects and faculty leads.
        </p>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayChallenges.map((challenge, idx) => {
          const trackNum = challenge.trackNumber || String(idx + 1).padStart(2, '0');
          const category = challenge.category || 'TECHNICAL_INNOVATION';
          const difficulty = challenge.difficulty || 'ADVANCED';

          return (
            <motion.div
              key={challenge._id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setSelectedChallenge(challenge)}
              className="p-8 rounded-2xl border border-white/[0.08] bg-zinc-950/60 hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              {/* Header Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                    CHALLENGE #{trackNum}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest bg-white/[0.03] px-2.5 py-1 rounded border border-white/[0.06]">
                      {category}
                    </span>
                    <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                      {difficulty}
                    </span>
                  </div>
                </div>

                {/* Challenge Title */}
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight uppercase group-hover:text-emerald-300 transition-colors mb-3 leading-snug">
                  {challenge.title}
                </h3>

                {/* Short Description */}
                <p className="text-zinc-400 text-sm leading-relaxed font-sans line-clamp-3 mb-6">
                  {challenge.shortDescription || challenge.description}
                </p>

                {/* Problem Areas / Tech Tags */}
                {challenge.suggestedTechnologies && challenge.suggestedTechnologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {challenge.suggestedTechnologies.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="font-mono text-[10px] text-zinc-300 bg-white/5 px-2.5 py-1 rounded border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1 group-hover:underline">
                  <span>VIEW FULL SPECIFICATION</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                  STATUS: OPEN
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Challenge Detail Modal Panel */}
      <AnimatePresence>
        {selectedChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-[#090b10] border border-emerald-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedChallenge(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Top Metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30">
                  CHALLENGE #{selectedChallenge.trackNumber || '01'}
                </span>
                <span className="font-mono text-xs text-zinc-400 bg-white/5 px-3 py-1 rounded-md border border-white/10 uppercase">
                  {selectedChallenge.category || 'TECHNICAL_TRACK'}
                </span>
              </div>

              {/* Modal Title */}
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight uppercase mb-6 leading-snug">
                {selectedChallenge.title}
              </h2>

              {/* Problem Statement Section */}
              <div className="space-y-6 text-sm text-zinc-300 font-sans leading-relaxed">
                <div>
                  <h4 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                    // 01 THE PROBLEM STATEMENT
                  </h4>
                  <p className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
                    {selectedChallenge.problemStatement || selectedChallenge.description || selectedChallenge.shortDescription}
                  </p>
                </div>

                {/* Expected Outcome */}
                <div>
                  <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">
                    // 02 EXPECTED DELIVERABLE OUTCOME
                  </h4>
                  <p className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
                    {selectedChallenge.expectedOutcome || "A functional end-to-end prototype, tested codebase hosted on GitHub, live deployed endpoint or demo video, and architecture documentation."}
                  </p>
                </div>

                {/* Suggested Technologies */}
                {selectedChallenge.suggestedTechnologies && selectedChallenge.suggestedTechnologies.length > 0 && (
                  <div>
                    <h4 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                      // 03 SUGGESTED TECHNOLOGY STACK
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChallenge.suggestedTechnologies.map((tech, idx) => (
                        <span key={idx} className="font-mono text-xs px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to={`/register?track=${selectedChallenge._id}`}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 text-black font-heading font-extrabold text-xs tracking-wider uppercase shadow-neon-emerald flex items-center justify-center space-x-2"
                >
                  <span>REGISTER FOR THIS CHALLENGE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono uppercase tracking-wider border border-white/10 transition-colors"
                >
                  CLOSE SPECIFICATION
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ChallengesSection;
