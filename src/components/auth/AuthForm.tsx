"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  useLogin,
  useRegister,
  useGoogleLogin,
  getApiErrorMessage,
} from '@/hooks/useAuthMutations';
import { useBulkAssign } from '@/hooks/useBulkAssign';
import { useLinks } from '@/hooks/useLinks';

interface Props {
  onClose: () => void;
  onForgotPassword: (emailPrefill: string) => void;
}

type AuthFields = { email: string; password: string };

const AuthForm: React.FC<Props> = ({ onClose, onForgotPassword }) => {
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { login } = useAuth();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();
  const bulkAssignMutation = useBulkAssign();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthFields>({ defaultValues: { email: '', password: '' } });

  const handleAuthSuccess = () => {
    login();
    // Thực hiện gán link ẩn danh vào user mới login
    bulkAssignMutation.mutate(undefined, {
      onSuccess: () => {
        // Sau khi gán xong mới làm mới toàn bộ dữ liệu links
        queryClient.invalidateQueries({ queryKey: ['links'] });
        router.refresh();
      },
      onError: () => {
        // Kể cả lỗi gán link cũng nên refresh để user thấy data hiện tại của họ
        queryClient.invalidateQueries({ queryKey: ['links'] });
        router.refresh();
      }
    });
    onClose();
  };

  const currentEmail = watch('email');

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    googleLoginMutation.mutate(
      { credential: credentialResponse.credential },
      {
        onSuccess: handleAuthSuccess,
        onError: (err) => alert(getApiErrorMessage(err, 'Google login failed')),
      }
    );
  };

  const onSubmit = async (data: AuthFields) => {
    if (isLogin) {
      loginMutation.mutate(data, {
        onSuccess: handleAuthSuccess,
        onError: (err) =>
          setError('root', { message: getApiErrorMessage(err, 'Login failed') }),
      });
    } else {
      registerMutation.mutate(data, {
        onSuccess: handleAuthSuccess,
        onError: (err) =>
          setError('root', { message: getApiErrorMessage(err, 'Registration failed') }),
      });
    }
  };

  const isPending =
    isSubmitting || loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-slate-400">
          {isLogin ? 'Enter your details to sign in' : 'Join MiniLink to track your links'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
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

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-sm font-medium text-slate-300">Password</label>
            {isLogin && (
              <button
                type="button"
                onClick={() => onForgotPassword(currentEmail)}
                className="text-xs text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>
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
          {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>}
        </div>

        {errors.root && (
          <p className="text-red-400 text-sm text-center">{errors.root.message}</p>
        )}

        <button
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
        >
          {isPending ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="relative my-8 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <span className="relative px-4 bg-[#0f172a] text-slate-500 text-sm">OR</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert('Google login failed')}
          theme="outline"
          shape="rectangular"
          width="100%"
        />
      </div>

      <p className="mt-8 text-center text-slate-400 text-sm">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 font-bold hover:underline"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;

