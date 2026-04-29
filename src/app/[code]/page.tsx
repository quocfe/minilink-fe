"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BACKEND_URL } from '@/lib/auth-config';
import { Loader2 } from 'lucide-react';

export default function RedirectPage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code;

  useEffect(() => {
    if (code) {
      window.location.href = `${BACKEND_URL}/${code}`;
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        {/* Logo hoặc Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative mx-auto" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Redirecting you...</h1>
          <p className="text-slate-400 animate-pulse">
            Please wait while we take you to your destination
          </p>
        </div>

        {/* Thông tin thêm (tùy chọn) */}
        <div className="pt-8 text-xs text-slate-500">
          Powered by MiniLink
        </div>
      </div>
    </div>
  );
}
