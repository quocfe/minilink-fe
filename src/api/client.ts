import axios from 'axios';

/**
 * Tất cả API calls đi qua /api/proxy/* (same-origin với Next.js).
 * Next.js rewrite sẽ forward tới backend kèm toàn bộ headers (Cookie included).
 * Tránh hoàn toàn cross-domain cookie issue.
 */
const apiClient = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true, // Gửi cookie cho same-origin request
  timeout: 10000, // 10 giây — tránh treo mãi nếu backend không phản hồi
  headers: {
    'Content-Type': 'application/json',
  },
});



// Response interceptor để xử lý lỗi 401 (Hết hạn token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code

    // Nếu lỗi 401 và code là TOKEN_EXPIRED
    if (error.response?.status === 401 && code === 'TOKEN_EXPIRED') {
      try {
        await apiClient.post('/auth/refresh', {});

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

