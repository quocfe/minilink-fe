"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AuthForm from './auth/AuthForm';
import ForgotEmailForm from './auth/ForgotEmailForm';
import ForgotOtpForm from './auth/ForgotOtpForm';
import ForgotResetForm from './auth/ForgotResetForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'auth' | 'forgot-email' | 'forgot-otp' | 'forgot-reset';

const OTP_LENGTH = 5;

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<View>('auth');
  const [fpEmail, setFpEmail] = useState('');
  const [fpOtp, setFpOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setView('auth');
        setFpEmail('');
        setFpOtp(Array(OTP_LENGTH).fill(''));
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleForgotPassword = (emailPrefill: string) => {
    setFpEmail(emailPrefill);
    setView('forgot-email');
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
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md glass border-white/10 rounded-3xl overflow-hidden pointer-events-auto relative shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2 }}
                >
                  {view === 'auth' && (
                    <AuthForm
                      onClose={onClose}
                      onForgotPassword={handleForgotPassword}
                    />
                  )}
                  {view === 'forgot-email' && (
                    <ForgotEmailForm
                      defaultEmail={fpEmail}
                      onBack={() => setView('auth')}
                      onSuccess={(email) => { setFpEmail(email); setView('forgot-otp'); }}
                    />
                  )}
                  {view === 'forgot-otp' && (
                    <ForgotOtpForm
                      email={fpEmail}
                      onBack={() => setView('forgot-email')}
                      onSuccess={(otp) => { setFpOtp(otp); setView('forgot-reset'); }}
                    />
                  )}
                  {view === 'forgot-reset' && (
                    <ForgotResetForm
                      email={fpEmail}
                      otp={fpOtp}
                      onSuccess={() => setView('auth')}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
