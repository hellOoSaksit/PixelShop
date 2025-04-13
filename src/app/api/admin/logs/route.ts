import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Endpoint สำหรับจัดการ logs ของ admin
 * 
 * GET: ดึงข้อมูล logs ทั้งหมด
 * ข้อมูลที่รับจาก Frontend:
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/admin/logs):
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - logs: รายการ logs ทั้งหมด
 *   - id: รหัส log
 *   - userId: รหัสผู้ใช้
 *   - action: การกระทำ
 *   - details: รายละเอียด
 *   - createdAt: วันที่สร้าง
 * 
 * Environment Variables ที่ใช้:
 * - API_URL: URL ของ Backend API
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 401: ไม่มีสิทธิ์เข้าถึง
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    const response = await fetch(`${process.env.API_URL}/api/admin/logs`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Cookie': session ? `session=${session.value}` : '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
          timestamp: new Date().toISOString(),
          path: '/api/admin/logs'
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Logs fetch error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/admin/logs'
      },
      { status: 500 }
    );
  }
} 