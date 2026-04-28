"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Lock, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useResetPassword, getApiErrorMessage } from '@/hooks/useAuthMutations';

interface Props {
  email: string;
  otp: string[];
  onSuccess: () => void;
}

type Fields = { password: string; confirmPassword: string };

const ForgotResetForm: React.FC<Props> = ({ email, otp, onSuccess }) => {
  const [successMsg, setSuccessMsg] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Fields>();

  const passwordValue = watch('password');

  const onSubmit = (data: Fields) => {
    resetPasswordMutation.mutate(
      { email, code: otp.join(''), password: data.password, confirm_password: data.confirmPassword },
      {
        onSuccess: () => {
          setSuccessMsg('Password reset successfully! You can now sign in.');
          setTimeout(onSuccess, 2500);
        },
        onError: (err) =>
          setError('root', {
            message: getApiErrorMessage(err, 'Failed to reset password. Please try again.'),
          }),
      }
    );
  };

  const isPending = isSubmitting || resetPasswordMutation.isPending;

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 mb-4">
          <KeyRound className="text-blue-400" size={26} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">New Password</h2>
        <p className="text-slate-400 text-sm">Create a strong new password for your account.</p>
      </div>

      {successMsg ? (
        <div className="text-center py-6">
          <p className="text-green-400 font-medium">{successMsg}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-11 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === passwordValue || 'Passwords do not match',
                })}
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-11 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs ml-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-red-400 text-sm text-center">{errors.root.message}</p>
          )}

          <button
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
          >
            {isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotResetForm;
