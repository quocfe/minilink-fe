"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft } from 'lucide-react';
import { useForgotPassword, getApiErrorMessage } from '@/hooks/useAuthMutations';
import { toast } from 'react-hot-toast';

interface Props {
  defaultEmail?: string;
  onBack: () => void;
  onSuccess: (email: string) => void;
}

type Fields = { email: string };

const ForgotEmailForm: React.FC<Props> = ({ defaultEmail = '', onBack, onSuccess }) => {
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({ defaultValues: { email: defaultEmail } });

  const onSubmit = async (data: Fields) => {
    // Chuyển ngay sang bước nhập OTP
    onSuccess(data.email);

    // Gửi yêu cầu trong background kèm theo Toast thông báo
    toast.promise(
      forgotPasswordMutation.mutateAsync({ email: data.email }),
      {
        loading: 'Sending verification code...',
        success: 'Code sent to your email!',
        error: (err) => getApiErrorMessage(err, 'Failed to send code'),
      }
    );
  };

  const isPending = isSubmitting || forgotPasswordMutation.isPending;

  return (
    <div className="p-8">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Sign In
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 mb-4">
          <Mail className="text-blue-400" size={26} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
        <p className="text-slate-400 text-sm">
          Enter your email and we'll send you a verification code.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
              })}
              type="email"
              placeholder="name@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email.message}</p>}
        </div>

        {errors.root && (
          <p className="text-red-400 text-sm text-center">{errors.root.message}</p>
        )}

        <button
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
        >
          {isPending ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>
    </div>
  );
};

export default ForgotEmailForm;
