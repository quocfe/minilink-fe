import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'minilink_recent_links';

interface RecentLink {
  id: string;
  [key: string]: unknown;
}

const getRecentLinkIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const links: RecentLink[] = JSON.parse(raw);
    return links.map((l) => l.id).filter(Boolean);
  } catch {
    return [];
  }
};

const clearRecentLinks = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/**
 * Sau khi login thành công, gọi hook này để bulk-assign
 * các link ẩn danh (lưu trong localStorage) về tài khoản vừa đăng nhập.
 */
export const useBulkAssign = () => {
  return useMutation({
    mutationFn: async () => {
      const url_ids = getRecentLinkIds();
      if (url_ids.length === 0) return null;

      const response = await apiClient.put('/bulk-assign', { url_ids });
      return response.data;
    },
    onSuccess: (data) => {
      if (data !== null) {
        clearRecentLinks();
      }
    },
    onError: () => {
      toast.error('Failed to assign your recent links. Please try again.');
    },
  });
};

