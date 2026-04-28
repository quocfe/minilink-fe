import { NextRequest, NextResponse } from 'next/server';
import {
  BACKEND_URL,
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
} from '@/lib/auth-config';

/**
 * POST /api/auth/logout
 *
 * 1. Gọi backend /auth/logout để invalidate refresh_token server-side
 * 2. Xóa cả hai cookie: refresh_token (httpOnly) và access_token
 * 3. Trả 200 về client
 */
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;

  // Gọi backend để invalidate token server-side (best-effort, không throw nếu thất bại)
  if (refreshToken) {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Truyền refresh_token qua Cookie header theo format backend yêu cầu
          Cookie: `${COOKIE_REFRESH_TOKEN}=${refreshToken}`,
        },
      });
    } catch (err) {
      // Không chặn logout nếu backend không trả lời được
      console.warn('[auth/logout] Could not reach backend to invalidate token:', err);
    }
  }

  // Xóa cả hai cookie bất kể backend có phản hồi hay không
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete(COOKIE_REFRESH_TOKEN);
  response.cookies.delete(COOKIE_ACCESS_TOKEN);

  return response;
}

