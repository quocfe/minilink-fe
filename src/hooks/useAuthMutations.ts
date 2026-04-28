import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';

// Shared query key — export để useAuth và các hook khác dùng chung
export const AUTH_ME_KEY = ['auth', 'me'] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoginVars { email: string; password: string }
export interface RegisterVars { email: string; password: string }
export interface GoogleLoginVars { credential: string }
export interface ForgotPasswordVars { email: string }
export interface VerifyOtpVars { email: string; code: string }
export interface ResetPasswordVars { email: string; code: string; password: string; confirm_password: string }

interface ApiError {
  response?: { data?: { message?: string } };
}

export const getApiErrorMessage = (err: unknown, fallback: string): string =>
  (err as ApiError)?.response?.data?.message ?? fallback;

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Đăng nhập qua Next.js route handler (để set httpOnly cookie) */
export const useLogin = () =>
  useMutation<void, Error, LoginVars>({
    mutationFn: async (vars) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? 'Login failed');
      }
    },
  });

/** Đăng ký tài khoản mới */
export const useRegister = () =>
  useMutation<void, Error, RegisterVars>({
    mutationFn: async (vars) => {
      await apiClient.post('/auth/register', vars);
    },
  });

/** Đăng nhập bằng Google qua Next.js route handler */
export const useGoogleLogin = () =>
  useMutation<void, Error, GoogleLoginVars>({
    mutationFn: async (vars) => {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? 'Google login failed');
      }
    },
  });

/** Gửi OTP về email để đặt lại mật khẩu */
export const useForgotPassword = () =>
  useMutation<void, Error, ForgotPasswordVars>({
    mutationFn: async (vars) => {
      await apiClient.post('/auth/forgot-password', vars);
    },
  });

/** Xác minh mã OTP 5 số */
export const useVerifyOtp = () =>
  useMutation<void, Error, VerifyOtpVars>({
    mutationFn: async (vars) => {
      await apiClient.post('/auth/verify-otp', vars);
    },
  });

/** Đặt lại mật khẩu mới */
export const useResetPassword = () =>
  useMutation<void, Error, ResetPasswordVars>({
    mutationFn: async (vars) => {
      await apiClient.post('/auth/reset-password', vars);
    },
  });

