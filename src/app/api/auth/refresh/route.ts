import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Endpoint สำหรับรีเฟรช Token
 * 
 * POST: รีเฟรช Token
 * ข้อมูลที่รับจาก Frontend:
 * - ไม่มี (ใช้ Refresh Token จาก Cookie)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/auth/refresh):
 * - refreshToken: Token สำหรับรีเฟรช
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - accessToken: Token ใหม่สำหรับการเข้าถึง
 * - refreshToken: Refresh Token ใหม่
 * - user: ข้อมูลผู้ใช้
 *   - id: รหัสผู้ใช้
 *   - name: ชื่อ
 *   - email: อีเมล
 *   - role: สิทธิ์
 * 
 * Environment Variables ที่ใช้:
 * - API_URL: URL ของ Backend API
 * - NODE_ENV: สภาพแวดล้อม (development/production)
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 401: Refresh Token ไม่ถูกต้องหรือหมดอายุ
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken');
    
    if (!refreshToken) {
      return NextResponse.json(
        { 
          error: 'ไม่พบ Refresh Token',
          timestamp: new Date().toISOString(),
          path: '/api/auth/refresh'
        },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken.value}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: errorData.message || 'ไม่สามารถรีเฟรช Token ได้',
          timestamp: new Date().toISOString(),
          path: '/api/auth/refresh'
        },
        { status: 401 }
      );
    }

    const data = await response.json();
    
    // ตั้งค่า Cookie ใหม่
    const responseWithCookies = NextResponse.json(data);
    
    // ตั้งค่า Access Token
    responseWithCookies.cookies.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 15, // 15 นาที
    });

    // ตั้งค่า Refresh Token
    responseWithCookies.cookies.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 วัน
    });

    // ตั้งค่า Session
    responseWithCookies.cookies.set('session', JSON.stringify(data.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 วัน
    });

    return responseWithCookies;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/auth/refresh'
      },
      { status: 500 }
    );
  }
} 