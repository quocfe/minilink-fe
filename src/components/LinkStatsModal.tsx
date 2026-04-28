"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Calendar, ExternalLink, MousePointer2, Clock, Monitor, Smartphone, Globe } from 'lucide-react';
import { useLinkStats } from '../hooks/useLinks';

interface LinkStatsModalProps {
  shortCode: string | null;
  onClose: () => void;
}

const LinkStatsModal: React.FC<LinkStatsModalProps> = ({ shortCode, onClose }) => {
  const { data: stats, isLoading, error } = useLinkStats(shortCode);

  return (
    <AnimatePresence>
      {shortCode && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl glass border-white/10 rounded-3xl overflow-hidden pointer-events-auto relative shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              {isLoading ? (
                <div className="p-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-slate-400 animate-pulse">Analyzing link data...</p>
                </div>
              ) : error || !stats ? (
                <div className="p-12 text-center">
                  <p className="text-red-400 mb-4">Failed to load analytics</p>
                  <button 
                    onClick={onClose}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="p-8">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <TrendingUp className="text-blue-400" size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Link Analytics</h2>
                    </div>
                    <p className="text-slate-400 text-sm truncate max-w-md">
                      Statistics for <span className="text-blue-400 font-medium">{stats.short_code}</span>
                    </p>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <MousePointer2 size={14} />
                        Total Clicks
                      </div>
                      <p className="text-3xl font-bold text-white">{stats.total_clicks}</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Calendar size={14} />
                        Created
                      </div>
                      <p className="text-lg font-bold text-white">
                        {new Date(stats.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Clock size={14} />
                        Expires
                      </div>
                      <p className="text-lg font-bold text-white">
                        {stats.expires_at ? new Date(stats.expires_at).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>

                  {/* Link Details */}
                  <div className="bg-white/5 border border-white/5 p-6 rounded-2xl mb-8">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <ExternalLink size={16} />
                      Destination URL
                    </h3>
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 break-all">
                      <a 
                        href={stats.original_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm font-medium"
                      >
                        {stats.original_url}
                      </a>
                    </div>
                  </div>

                  {/* Recent Clicks */}
                  <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Clock size={16} />
                      Recent Activity
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {stats.recent_clicks.length > 0 ? (
                        stats.recent_clicks.map((click) => (
                          <div key={click.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/[0.08] transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                {click.device === 'desktop' ? <Monitor size={14} /> : <Smartphone size={14} />}
                                <span className="text-sm capitalize">{click.device}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-400 border-l border-white/10 pl-4">
                                <Globe size={14} />
                                <span className="text-xs uppercase font-bold tracking-tight">{click.country}</span>
                              </div>
                            </div>
                            <span className="text-slate-500 text-xs font-medium">
                              {new Date(click.clicked_at).toLocaleString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500 text-sm italic">
                          No clicks recorded yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LinkStatsModal;
