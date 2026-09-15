import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { faqService } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await faqService.getPublic();
        if (res.data?.items) {
          setFaqs(res.data.items);
        }
      } catch (err) {
        console.error('FAQ load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  if (loading) return <Loader message="Loading Frequently Asked Questions..." />;

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-mono font-semibold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          Knowledge Base
        </span>
        <h1 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight uppercase mt-4 mb-4">
          FREQUENTLY <span className="text-gradient">ASKED QUESTIONS</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Quick answers to common inquiries regarding registration, eligibility, submissions, and event logistics.
        </p>

        {faqs.length > 0 && (
          <div className="relative max-w-md mx-auto mt-8">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        )}
      </div>

      {faqs.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="FAQs will be published soon."
          message="Frequently asked questions and clarification guides are currently being prepared."
        />
      ) : filteredFaqs.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Matching Questions"
          message="No questions matched your search query. Feel free to contact our coordinators directly!"
        />
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq._id || idx}
                className="cyber-card border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-white pr-4">
                    {faq.question}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white/5 text-slate-400 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {faq.answer}
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

export default FAQ;
