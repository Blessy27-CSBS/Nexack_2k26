import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, Search, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqService } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import FAQSection from '../components/Home/FAQSection';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* Editorial FAQ Section */}
      <FAQSection faqs={faqs} />
    </div>
  );
};

export default FAQ;
