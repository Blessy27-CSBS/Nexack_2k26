import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { timelineService } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import TimelineSection from '../components/Home/TimelineSection';
import Timeline3D from '../components/three/Timeline3D';

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await timelineService.getPublic();
        if (res.data?.items) {
          setTimeline(res.data.items);
        }
      } catch (err) {
        console.error('Failed to load timeline:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) return <Loader message="Loading Hackathon Timeline..." />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-white">
      {/* 3D WebGL Pipeline */}
      {timeline.length > 0 && (
        <div className="mb-12">
          <div className="text-center mb-6">
            <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              // 3D CHRONOLOGY PIPELINE
            </span>
          </div>
          <Timeline3D timeline={timeline} />
        </div>
      )}

      {/* Editorial Timeline Component */}
      <TimelineSection timeline={timeline} />
    </div>
  );
};

export default Timeline;
