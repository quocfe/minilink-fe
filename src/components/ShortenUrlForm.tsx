"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { shortenUrlSchema, type ShortenUrlFormData } from '../utils/validation';
import { useShortenUrl } from '../hooks/useShortenUrl';
import { useAuth } from '../hooks/useAuth';

const ShortenUrlForm: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const { mutate, isPending, error } = useShortenUrl();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShortenUrlFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(shortenUrlSchema) as any,
    mode: 'onChange',
  });

  const onSubmit = (data: ShortenUrlFormData) => {
    mutate(data, {
      onSuccess: (response) => {
        setShortUrl(response.short_url);

        // Lưu vào localStorage
        const recentLinks = JSON.parse(localStorage.getItem('minilink_recent_links') || '[]');
        const newLink = {
          id: response.id || Date.now().toString(),
          original_url: data.original_url,
          short_url: response.short_url,
          short_code: response.short_code,
          created_at: new Date().toISOString(),
        };

        localStorage.setItem('minilink_recent_links', JSON.stringify([newLink, ...recentLinks].slice(0, 10))); // Lưu tối đa 10 link gần nhất

        reset();
      },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass p-2 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center shadow-2xl gap-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/50"
      >
        <div className="flex-1 flex flex-col relative px-2">
          <input
            {...register('original_url')}
            type="text"
            placeholder="Paste your long link here..."
            className="w-full bg-transparent border-none outline-none focus:ring-0 py-3 text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="md:w-48 flex flex-col relative border-t md:border-t-0 md:border-l border-white/10 px-2">
          <input
            {...register('custom_code')}
            type="text"
            placeholder="Custom code (optional)"
            className="w-full bg-transparent border-none outline-none focus:ring-0 py-3 text-slate-200 placeholder:text-slate-500 text-sm"
          />
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center min-w-[120px]"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Shorten'
          )}
        </button>
      </form>

      {/* Error Messages */}
      <div className="mt-2 flex flex-col gap-1 px-4 text-left">
        {errors.original_url && (
          <p className="text-red-400 text-xs font-medium animate-pulse">
            {errors.original_url.message}
          </p>
        )}
        {errors.custom_code && (
          <p className="text-red-400 text-xs font-medium animate-pulse">
            {errors.custom_code.message}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-xs font-medium">
            Something went wrong. Please try again.
          </p>
        )}
      </div>

      {/* Success Message */}
      {shortUrl && (
        <div className="mt-8 glass p-6 rounded-2xl border-blue-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-slate-400 text-sm mb-2">Success! Your short link is ready:</p>
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 font-bold hover:underline break-all"
            >
              {shortUrl}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          {!isAuthenticated && (
            <p className="text-slate-500 text-[10px] mt-4 text-center">
              Want to track this link? <button className="text-blue-400 hover:underline">Login</button> to save it to your dashboard.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShortenUrlForm;
