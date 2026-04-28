import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Quan trọng: Để gửi kèm Cookies
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
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });

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
