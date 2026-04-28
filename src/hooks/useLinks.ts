import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export interface LinkItem {
  id: string;
  original_url: string;
  short_code: string;
  short_url: string;
  click_count: number;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface LinksResponse {
  links: LinkItem[];
  click_events: {
    total_clicks: number;
    active_links: number;
  };
}

export interface ClickDetail {
  id: number;
  url_id: string;
  clicked_at: string;
  country: string;
  device: string;
  referrer: string | null;
}

export interface LinkStats {
  id: string;
  short_code: string;
  original_url: string;
  total_clicks: number;
  created_at: string;
  expires_at: string | null;
  recent_clicks: ClickDetail[];
}

export const useLinks = () => {
  return useQuery<LinksResponse>({
    queryKey: ['links'],
    queryFn: async () => {
      const response = await apiClient.get('/links');
      return response.data;
    },
  });
};

export const useLinkStats = (shortCode: string | null) => {
  return useQuery<LinkStats>({
    queryKey: ['link-stats', shortCode],
    queryFn: async () => {
      if (!shortCode) throw new Error('Short code is required');
      const response = await apiClient.get(`/${shortCode}/stats`);
      return response.data;
    },
    enabled: !!shortCode,
  });
};
