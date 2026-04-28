'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useLinks } from '@/hooks/useLinks';
import { useAuth } from '@/hooks/useAuth';
import LinkStatsModal from '@/components/LinkStatsModal';
import CreateLinkModal from '@/components/CreateLinkModal';
import ShortenUrlForm from '@/components/ShortenUrlForm';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data, isLoading: isLinksLoading, error } = useLinks();
  const [selectedShortCode, setSelectedShortCode] = useState<string | null>(null);
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header />
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-1000"></div>
        </div>
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-20 z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
            Shorten Your <span className="gradient-text">Links</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
            Paste your long URL below to get a short link instantly. Sign in to track clicks and manage your links.
          </p>
          <ShortenUrlForm />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-slate-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
            <p className="text-slate-400">Manage and track your shortened links</p>
          </div>
          <button
            onClick={() => setIsCreateLinkOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 active:scale-95"
          >
            <span>+</span> Create New Link
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Clicks', value: data?.click_events.total_clicks || 0, trend: '+12%' },
            { label: 'Active Links', value: data?.click_events.active_links || 0, trend: '0%' },
            { label: 'Top Domain', value: 'minilink.io', trend: '' },
            { label: 'Saved Space', value: '450B', trend: '+5%' }
          ].map((stat, i) => (
            <div key={i} className="glass p-5 rounded-xl border-white/5">
              <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-white">{isLinksLoading ? '...' : stat.value}</p>
                {stat.trend && !isLinksLoading && <span className="text-green-400 text-xs font-medium">{stat.trend}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Links Table */}
        <div className="glass rounded-2xl border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h2 className="text-xl font-bold text-white">Recent Links</h2>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View all</button>
          </div>
          
          <div className="divide-y divide-white/5">
            {isLinksLoading ? (
              // Loading Skeletons
              [1, 2, 3].map((i) => (
                <div key={i} className="p-6 animate-pulse flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-white/10 rounded"></div>
                    <div className="h-4 w-64 bg-white/5 rounded"></div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="h-8 w-12 bg-white/10 rounded"></div>
                    <div className="h-8 w-20 bg-white/10 rounded"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="p-12 text-center text-slate-500">
                Failed to load links. Please try again later.
              </div>
            ) : data?.links.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No links found. Create your first link above!
              </div>
            ) : (
              data?.links.map((link) => (
                <div key={link.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <h4 className="text-white font-medium mb-1 truncate max-w-xs md:max-w-md">
                      {link.original_url}
                    </h4>
                    <div className="flex items-center gap-2">
                      <a 
                        href={link.short_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm font-bold hover:underline"
                      >
                        {link.short_url}
                      </a>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-slate-500 text-xs">
                        {new Date(link.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                    <div className="text-right">
                      <p className="text-white font-bold">{link.click_count}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">Clicks</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigator.clipboard.writeText(link.short_url)}
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setSelectedShortCode(link.short_code)}
                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="View analytics"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <LinkStatsModal 
        shortCode={selectedShortCode} 
        onClose={() => setSelectedShortCode(null)} 
      />

      <CreateLinkModal
        isOpen={isCreateLinkOpen}
        onClose={() => setIsCreateLinkOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
