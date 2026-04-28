"use client";

import React, { useEffect, useState } from 'react';
import { Copy, ExternalLink, History } from 'lucide-react';

interface LocalLink {
  id: string;
  original_url: string;
  short_url: string;
  short_code: string;
  created_at: string;
}

const RecentLinks: React.FC = () => {
  const [links, setLinks] = useState<LocalLink[]>([]);

  useEffect(() => {
    const loadLinks = () => {
      const savedLinks = JSON.parse(localStorage.getItem('minilink_recent_links') || '[]');
      setLinks(savedLinks);
    };

    loadLinks();

    // Listen for custom event or storage changes
    window.addEventListener('storage', loadLinks);

    // Poll for changes in the same tab (since ShortenUrlForm updates localStorage)
    const interval = setInterval(loadLinks, 2000);

    return () => {
      window.removeEventListener('storage', loadLinks);
      clearInterval(interval);
    };
  }, []);

  if (links.length === 0) return null;

  return (
    <div className="mt-12 w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-4 text-slate-400">
        <History size={18} />
        <h2 className="text-sm font-bold uppercase tracking-wider">Your Recent Links (Local)</h2>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="glass p-4 rounded-xl border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.02] transition-colors group">
            <div className="flex-1 min-w-0">
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">
                {new Date(link.created_at).toLocaleString()}
              </p>
              <h4 className="text-white text-sm font-medium truncate mb-1 pr-4">
                {link.original_url}
              </h4>
              <a
                href={link.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm font-bold hover:underline flex items-center gap-1"
              >
                {link.short_url}
                <ExternalLink size={12} />
              </a>
            </div>
            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link.short_url);
                  // Optional: add a toast or feedback
                }}
                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[10px] text-slate-600 text-center italic">
        These links are stored locally in your browser.
        Login to save them permanently and view analytics.
      </p>
    </div>
  );
};

export default RecentLinks;
