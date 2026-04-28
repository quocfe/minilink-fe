"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import {useAuth} from "@/hooks/useAuth";

const Header: React.FC = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Mini<span className="text-blue-400">Link</span>
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            ) : isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-white/10 hover:bg-white/10 text-white rounded-full text-sm font-semibold transition-all active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
              >
                Login
              </button>
            )}
          </nav>
        </div>


      </header>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>

  );
};

export default Header;
