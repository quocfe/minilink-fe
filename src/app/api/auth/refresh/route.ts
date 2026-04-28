import { NextRequest, NextResponse } from 'next/server';
import {
  BACKEND_URL,
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  cookieOptions,
} from '@/lib/auth-config';

/**
 * POST /api/auth/refresh
 *
 * NextJS đọc refresh_token từ httpOnly cookie, gọi backend server-to-server,
 * sau đó:
 * - Set refresh_token mới vào httpOnly cookie
 * - Set access_token mới vào cookie thường
 * - Trả { access_token } về browser
 */
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  try {
    // Gọi backend server-to-server, truyền refresh_token qua Cookie header
    const backendRes = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Backend đọc refresh_token từ cookie header
        Cookie: `${COOKIE_REFRESH_TOKEN}=${refreshToken}`,
      },
    });

    if (!backendRes.ok) {
      // Refresh thất bại → xóa cookie và báo client đăng nhập lại
      const response = NextResponse.json({ message: 'Session expired' }, { status: 401 });
      response.cookies.delete(COOKIE_REFRESH_TOKEN);
      response.cookies.delete(COOKIE_ACCESS_TOKEN);
      return response;
    }

    const data = await backendRes.json();
    const newAccessToken: string = data.access_token;
    // refresh token rotation: backend có thể trả refresh_token mới, nếu không thì giữ cũ
    const newRefreshToken: string = data.refresh_token ?? refreshToken;

    if (!newAccessToken) {
      console.error('[auth/refresh] Backend response missing access_token');
      return NextResponse.json({ message: 'Invalid response from authentication server' }, { status: 502 });
    }

    const response = NextResponse.json({ access_token: newAccessToken });

    response.cookies.set(COOKIE_REFRESH_TOKEN, newRefreshToken, {
      ...cookieOptions,
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    response.cookies.set(COOKIE_ACCESS_TOKEN, newAccessToken, {
      ...cookieOptions,
      httpOnly: false,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    return response;
  } catch (err) {
    console.error('[auth/refresh] Unexpected error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
