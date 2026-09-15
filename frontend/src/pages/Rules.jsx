import React, { useState, useEffect } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, FileText, CheckCircle } from 'lucide-react';
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
          // Open first category by default if available
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

  if (loading) return <Loader message="Loading Hackathon Rules & Guidelines..." />;

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
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Regulations & Code of Conduct
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          RULES & <span className="text-gradient">GUIDELINES</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Ensure fair competition, project originality, and compliance with the NEXACK 2K26 standard operating procedures.
        </p>
      </div>

      {rules.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Rules and guidelines will appear here soon."
          message="Official hackathon rules, eligibility conditions, and submission guidelines are being updated by the organizing committee."
        />
      ) : (
        <div className="space-y-4">
          {Object.entries(categories).map(([category, catRules]) => {
            const isOpen = openCategory === category;
            return (
              <div
                key={category}
                className="cyber-card overflow-hidden border border-white/10 transition-colors"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                        {category}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {catRules.length} {catRules.length === 1 ? 'Rule' : 'Rules'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4">
                    {catRules.map((rule, idx) => (
                      <div key={rule._id || idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-heading font-semibold text-sm sm:text-base text-white mb-1">
                              {rule.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
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
