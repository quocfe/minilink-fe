"use client";

import React, { useState, useRef } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useVerifyOtp, useForgotPassword, getApiErrorMessage } from '@/hooks/useAuthMutations';

const OTP_LENGTH = 5;

interface Props {
  email: string;
  onBack: () => void;
  onSuccess: (otp: string[]) => void;
}

const ForgotOtpForm: React.FC<Props> = ({ email, onBack, onSuccess }) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyOtpMutation = useVerifyOtp();
  const resendMutation = useForgotPassword();

  const handleChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = sanitized;
    setOtp(next);
    if (sanitized && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleResend = () => {
    setError('');
    resendMutation.mutate(
      { email },
      { onError: (err) => setError(getApiErrorMessage(err, 'Không thể gửi lại mã.')) }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError(`Vui lòng nhập đủ ${OTP_LENGTH} chữ số.`);
      return;
    }
    verifyOtpMutation.mutate(
      { email, code },
      {
        onSuccess: () => onSuccess(otp),
        onError: (err) =>
          setError(getApiErrorMessage(err, 'Mã không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.')),
      }
    );
  };

  return (
    <div className="p-8">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 mb-4">
          <ShieldCheck className="text-blue-400" size={26} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Nhập Mã</h2>
        <p className="text-slate-400 text-sm">
          Chúng tôi đã gửi mã {OTP_LENGTH} chữ số đến{' '}
          <span className="text-white font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { otpRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all caret-transparent"
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          disabled={verifyOtpMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
        >
          {verifyOtpMutation.isPending ? 'Đang xác nhận...' : 'Xác Nhận Mã'}
        </button>

        <p className="text-center text-slate-500 text-sm">
          Không nhận được mã?{' '}
          <button
            type="button"
            disabled={resendMutation.isPending}
            onClick={handleResend}
            className="text-blue-400 hover:underline font-medium disabled:opacity-50"
          >
            {resendMutation.isPending ? 'Đang gửi...' : 'Gửi lại'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default ForgotOtpForm;
