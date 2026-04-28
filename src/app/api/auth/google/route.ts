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
 * POST /api/auth/google
 *
 * Nhận Google credential từ browser, gọi backend server-to-server, sau đó:
 * - Set refresh_token vào httpOnly cookie (browser không bao giờ đọc được)
 * - Set access_token vào cookie thường (middleware và browser đọc được)
 * - Trả { access_token } về browser trong response body
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({ message: 'Google login failed' }));
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    const accessToken: string = data.access_token;
    const refreshToken: string = data.refresh_token;

    if (!accessToken || !refreshToken) {
      console.error('[auth/google] Backend response missing tokens');
      return NextResponse.json({ message: 'Invalid response from authentication server' }, { status: 502 });
    }

    const response = NextResponse.json({ access_token: accessToken });

    response.cookies.set(COOKIE_REFRESH_TOKEN, refreshToken, {
      ...cookieOptions,
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    response.cookies.set(COOKIE_ACCESS_TOKEN, accessToken, {
      ...cookieOptions,
      httpOnly: false,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    return response;
  } catch (err) {
    console.error('[auth/google] Unexpected error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
