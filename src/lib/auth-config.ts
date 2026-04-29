/**
 * Tên các cookie dùng cho xác thực
 */
export const COOKIE_ACCESS_TOKEN = 'access_token';
export const COOKIE_REFRESH_TOKEN = 'refresh_token';

/**
 * Thời gian sống của cookie (đơn vị: giây)
 */
export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 phút
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 ngày

/**
 * URL của backend service (server-side only, không có NEXT_PUBLIC_ prefix)
 * Fallback về NEXT_PUBLIC_API_BASE_URL nếu BACKEND_URL chưa được set
 */
export const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:8000';

/**
 * Cấu hình chung cho cookie (dùng lại ở route handlers)
 */
export const cookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, // 'lax' tốt hơn cho cross-subdomain
  path: '/',
};

