import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Endpoint สำหรับจัดการข้อมูลโปรโมชั่น
 * 
 * GET: ดึงข้อมูลโปรโมชั่นทั้งหมด
 * ข้อมูลที่รับจาก Frontend:
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/promotions):
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - promotions: รายการโปรโมชั่นทั้งหมด
 *   - id: รหัสโปรโมชั่น
 *   - title: ชื่อโปรโมชั่น
 *   - description: คำอธิบาย
 *   - discount: ส่วนลด (เปอร์เซ็นต์)
 *   - startDate: วันที่เริ่ม
 *   - endDate: วันที่สิ้นสุด
 *   - products: รายการสินค้าที่ร่วมโปรโมชั่น
 * 
 * Environment Variables ที่ใช้:
 * - API_URL: URL ของ Backend API
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    const response = await fetch(`${process.env.API_URL}/api/promotions`, {
      headers: {
        'Cookie': session ? `session=${session.value}` : '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
          timestamp: new Date().toISOString(),
          path: '/api/promotions'
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Promotions fetch error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/promotions'
      },
      { status: 500 }
    );
  }
} 