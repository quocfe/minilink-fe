"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Shuffle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {useShortenUrl} from "@/hooks/useShortenUrl";

interface FormData {
  original_url: string;
  custom_code?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLinkModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const { mutate, isPending, error } = useShortenUrl();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const handleClose = () => {
    reset();
    setShortUrl(null);
    onClose();
  };

  const onSubmit = (data: FormData) => {
    mutate({ original_url: data.original_url, custom_code: data.custom_code }, {
      onSuccess: (response) => {
        setShortUrl(response.short_url);
        // Invalidate links query to refresh dashboard
        queryClient.invalidateQueries({ queryKey: ['links'] });
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg glass border border-white/10 rounded-3xl overflow-hidden pointer-events-auto relative shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                    <Link2 size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create New Link</h2>
                    <p className="text-slate-400 text-sm">Shorten and track your URL</p>
                  </div>
                </div>

                {!shortUrl ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Original URL */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 ml-1">
                        Destination URL <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Link2
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                          size={18}
                        />
                        <input
                          {...register('original_url')}
                          type="text"
                          placeholder="https://example.com/your-long-url"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                      </div>
                      {errors.original_url && (
                        <p className="text-red-400 text-xs ml-1">{errors.original_url.message}</p>
                      )}
                    </div>

                    {/* Custom Code */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300 ml-1">
                        Custom code{' '}
                        <span className="text-slate-500 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Shuffle
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                          size={18}
                        />
                        <input
                          {...register('custom_code')}
                          type="text"
                          placeholder="my-custom-code"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                      </div>
                      {errors.custom_code && (
                        <p className="text-red-400 text-xs ml-1">{errors.custom_code.message}</p>
                      )}
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm text-center">
                        Something went wrong. Please try again.
                      </p>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-slate-300 rounded-xl font-medium transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center"
                      >
                        {isPending ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Shorten URL'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Success State */
                  <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
                      <p className="text-green-400 font-medium mb-1">🎉 Link created!</p>
                      <p className="text-slate-400 text-sm">Your short link is ready to share</p>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
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
                        className="ml-4 p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => { reset(); setShortUrl(null); }}
                        className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-slate-300 rounded-xl font-medium transition-all"
                      >
                        Create Another
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateLinkModal;




