import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Endpoint สำหรับจัดการข้อมูลโปรไฟล์ผู้ใช้
 * 
 * GET: ดึงข้อมูลโปรไฟล์
 * ข้อมูลที่รับจาก Frontend:
 * - ไม่มี (ใช้ Access Token จาก Cookie)
 * 
 * PUT: อัพเดทข้อมูลโปรไฟล์
 * ข้อมูลที่รับจาก Frontend:
 * - name: ชื่อ
 * - email: อีเมล
 * - phone: เบอร์โทร
 * - address: ที่อยู่
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/profile):
 * GET:
 * - ไม่มี (ใช้ Access Token จาก Cookie)
 * 
 * PUT:
 * - name: ชื่อ
 * - email: อีเมล
 * - phone: เบอร์โทร
 * - address: ที่อยู่
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - user: ข้อมูลผู้ใช้
 *   - id: รหัสผู้ใช้
 *   - name: ชื่อ
 *   - email: อีเมล
 *   - phone: เบอร์โทร
 *   - address: ที่อยู่
 *   - role: สิทธิ์
 * 
 * Environment Variables ที่ใช้:
 * - API_URL: URL ของ Backend API
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 401: ไม่มีสิทธิ์เข้าถึง
 * - 400: ข้อมูลไม่ถูกต้อง
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    
    if (!accessToken) {
      return NextResponse.json(
        { 
          error: 'กรุณาเข้าสู่ระบบ',
          timestamp: new Date().toISOString(),
          path: '/api/profile'
        },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.API_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้',
          timestamp: new Date().toISOString(),
          path: '/api/profile'
        },
        { status: 401 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/profile'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const body = await request.json();
    
    if (!accessToken) {
      return NextResponse.json(
        { 
          error: 'กรุณาเข้าสู่ระบบ',
          timestamp: new Date().toISOString(),
          path: '/api/profile'
        },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: errorData.message || 'ไม่สามารถอัพเดทข้อมูลโปรไฟล์ได้',
          timestamp: new Date().toISOString(),
          path: '/api/profile'
        },
        { status: 400 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/profile'
      },
      { status: 500 }
    );
  }
} 