import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Endpoint สำหรับการเข้าสู่ระบบ
 * 
 * POST: เข้าสู่ระบบ
 * ข้อมูลที่รับจาก Frontend:
 * - email: อีเมลผู้ใช้
 * - password: รหัสผ่าน
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/auth/login):
 * - email: อีเมลผู้ใช้
 * - password: รหัสผ่าน
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - accessToken: Token สำหรับการเข้าถึง API
 * - refreshToken: Token สำหรับขอ Access Token ใหม่
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
 * - 400: อีเมลหรือรหัสผ่านไม่ถูกต้อง
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { 
          error: 'กรุณากรอกอีเมลและรหัสผ่าน',
          timestamp: new Date().toISOString(),
          path: '/api/auth/login'
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: errorData.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
          timestamp: new Date().toISOString(),
          path: '/api/auth/login'
        },
        { status: 400 }
      );
    }

    const data = await response.json();
    
    // สร้าง Response object
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

    return responseWithCookies;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/auth/login'
      },
      { status: 500 }
    );
  }
} 