import React, { useState, useEffect } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, FileText, CheckCircle, Terminal } from 'lucide-react';
import { ruleService } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await ruleService.getPublic();
        if (res.data?.items) {
          setRules(res.data.items);
          if (res.data.items.length > 0) {
            setOpenCategory(res.data.items[0].category || 'General');
          }
        }
      } catch (err) {
        console.error('Failed to load rules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  if (loading) return <Loader message="Loading Hackathon Rules & Integrity Directives..." />;

  // Group rules by category
  const categories = rules.reduce((acc, rule) => {
    const cat = rule.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rule);
    return acc;
  }, {});

  const toggleCategory = (cat) => {
    setOpenCategory(prev => (prev === cat ? null : cat));
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
          // INTEGRITY & CODE OF CONDUCT
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          RULES & <span className="text-gradient">GUIDELINES</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Standards of integrity, original code verification, and standard operating procedures for CSBS NEXACK 2K26.
        </p>
      </div>

      {rules.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Rules and guidelines will appear here shortly."
          message="Official hackathon rules, eligibility conditions, and submission guidelines are being updated by the organizing committee."
        />
      ) : (
        <div className="space-y-4">
          {Object.entries(categories).map(([category, catRules]) => {
            const isOpen = openCategory === category;
            return (
              <div
                key={category}
                className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 overflow-hidden transition-colors hover:border-emerald-500/40"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-neon-emerald">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                        {category}
                      </h3>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {catRules.length} {catRules.length === 1 ? 'Directive' : 'Directives'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 text-zinc-400">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-7 pb-7 pt-2 border-t border-white/[0.06] space-y-4">
                    {catRules.map((rule, idx) => (
                      <div key={rule._id || idx} className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5">
                        <div className="flex items-start space-x-3.5">
                          <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-heading font-bold text-sm sm:text-base text-white mb-1.5">
                              {rule.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
                              {rule.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rules;
