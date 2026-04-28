import React, { type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { AUTH_ME_KEY } from '../hooks/useAuthMutations';
import { AuthContext } from './authContext';

export const AuthProvider: React.FC<{ children: ReactNode; initialAuth: boolean }> = ({
  children,
  initialAuth,
}) => {
  const queryClient = useQueryClient();

  // Query để verify token — dùng initialData từ SSR để tránh flicker
  const { data, isLoading } = useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/auth/me');
      return res.data as Record<string, unknown>;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 phút
    // initialDataUpdatedAt: 0 → đánh dấu stale → vẫn re-validate ngầm
    ...(initialAuth && {
      initialData: {} as Record<string, unknown>,
      initialDataUpdatedAt: 0,
    }),
  });

  // Mutation để logout qua Next.js route handler (xóa httpOnly cookie server-side)
  const logoutMutation = useMutation({
    mutationFn: () => fetch('/api/auth/logout', { method: 'POST' }).then(() => undefined),
    onSettled: () => {
      queryClient.removeQueries({ queryKey: AUTH_ME_KEY });
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });

  const isAuthenticated = data !== undefined;

  // login: set data ngay lập tức rồi re-verify ngầm
  const login = () => {
    queryClient.setQueryData(AUTH_ME_KEY, {});
    queryClient.invalidateQueries({ queryKey: AUTH_ME_KEY });
  };

  const logout = () => logoutMutation.mutate();

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

