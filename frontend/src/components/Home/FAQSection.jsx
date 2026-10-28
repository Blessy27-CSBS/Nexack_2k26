import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultFaqs = [
  {
    num: '01',
    question: 'Who is eligible to participate in CSBS NEXACK 2K26?',
    answer: 'Undergraduate and postgraduate students enrolled in engineering, technology, science, and computer application degrees nationwide are eligible. Cross-college and cross-discipline teams are encouraged.'
  },
  {
    num: '02',
    question: 'What is the required squad and team composition?',
    answer: 'Teams must consist of 2 to 4 members. Every squad must elect a designated Team Leader who manages registration, project commits, and communication.'
  },
  {
    num: '03',
    question: 'How do we register and confirm our participation?',
    answer: 'Complete the online registration form on this portal, provide participant details, select your preferred problem domain, and complete verification. Once validated, your team dashboard and access QR pass will be unlocked.'
  },
  {
    num: '04',
    question: 'What is the submission procedure for our project?',
    answer: 'Submissions are completed through the Participant Submission Portal. You will provide your GitHub repository link, system architecture summary, demo video/presentation link, and live deployment URL before the submission deadline.'
  },
  {
    num: '05',
    question: 'Can we change problem statements or team members later?',
    answer: 'You can update your challenge track and squad member roster directly from your Team Dashboard before the official intake freeze deadline.'
  },
  {
    num: '06',
    question: 'How does the jury evaluation and judging rubric work?',
    answer: 'Projects are evaluated on technical complexity, architectural elegance, business impact, demo execution, code quality, and presentation clarity by our expert jury panel.'
  }
];

const FAQSection = ({ faqs = [] }) => {
  const [openIdx, setOpenIdx] = useState(0);

  const displayFaqs = faqs && faqs.length >= 4 ? faqs.map((f, idx) => ({
    num: String(idx + 1).padStart(2, '0'),
    question: f.question,
    answer: f.answer
  })) : defaultFaqs;

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[160px] pointer-events-none -translate-y-1/2" />

      {/* Top Tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.08] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-purple-400 tracking-widest uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            // 07 KNOWLEDGE_BASE
          </span>
          <span className="text-zinc-600 font-mono text-xs hidden sm:inline">——</span>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline">
            FREQUENTLY ASKED QUESTIONS
          </span>
        </div>
        <Link
          to="/faq"
          className="text-xs font-mono uppercase tracking-widest text-purple-400 hover:text-purple-300 flex items-center space-x-1.5 group"
        >
          <span>VIEW FULL KNOWLEDGE BASE</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Editorial Heading */}
      <div className="max-w-3xl mb-16">
        <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight leading-[0.95] uppercase mb-4">
          FREQUENTLY ASKED <span className="text-gradient-purple">QUESTIONS</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans">
          Clear answers on eligibility, squad formation, submission requirements, and judging parameters.
        </p>
      </div>

      {/* Editorial Accordion List */}
      <div className="space-y-4">
        {displayFaqs.map((faq, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={faq.num}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-zinc-900/90 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                  : 'bg-zinc-950/60 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 sm:p-7 flex items-center justify-between text-left group"
              >
                <div className="flex items-center space-x-4 sm:space-x-6 pr-4">
                  <span className={`font-mono text-lg sm:text-xl font-black transition-colors ${
                    isOpen ? 'text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400'
                  }`}>
                    {faq.num}
                  </span>
                  <span className="font-heading font-bold text-lg sm:text-xl text-white group-hover:text-emerald-300 transition-colors">
                    {faq.question}
                  </span>
                </div>

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isOpen
                    ? 'bg-emerald-500 text-black rotate-180'
                    : 'bg-white/5 text-zinc-400 border border-white/10 group-hover:text-white'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-7 pb-7 pt-2 pl-14 sm:pl-16 border-t border-white/[0.06] text-zinc-300 text-sm leading-relaxed font-sans">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
