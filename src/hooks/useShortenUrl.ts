import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { ShortenUrlFormData } from '../utils/validation';

interface ShortenUrlResponse {
  id: string;
  short_code: string;
  original_url: string;
  short_url: string;
}

export const useShortenUrl = () => {
  return useMutation<ShortenUrlResponse, Error, ShortenUrlFormData>({
    mutationFn: async (data) => {
      const response = await apiClient.post('/shorten', data);
      return response.data;
    },
  });
};
