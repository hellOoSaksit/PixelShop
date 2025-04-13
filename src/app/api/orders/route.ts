import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Endpoint สำหรับจัดการคำสั่งซื้อ
 * 
 * GET: ดึงข้อมูลคำสั่งซื้อทั้งหมด
 * ข้อมูลที่รับจาก Frontend:
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/orders):
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - orders: รายการคำสั่งซื้อทั้งหมด
 *   - id: รหัสคำสั่งซื้อ
 *   - userId: รหัสผู้ใช้
 *   - total: ยอดรวม
 *   - status: สถานะคำสั่งซื้อ
 *   - createdAt: วันที่สร้าง
 *   - items: รายการสินค้า
 *     - productId: รหัสสินค้า
 *     - quantity: จำนวน
 *     - price: ราคา
 * 
 * POST: สร้างคำสั่งซื้อใหม่
 * ข้อมูลที่รับจาก Frontend:
 * - items: รายการสินค้า
 *   - productId: รหัสสินค้า
 *   - quantity: จำนวน
 *   - price: ราคา
 * - total: ยอดรวม
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/orders):
 * - items: รายการสินค้า
 * - total: ยอดรวม
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - order: ข้อมูลคำสั่งซื้อที่สร้างใหม่
 * 
 * Environment Variables ที่ใช้:
 * - API_URL: URL ของ Backend API
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 401: ไม่มีสิทธิ์เข้าถึง
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    const response = await fetch(`${process.env.API_URL}/api/orders`, {
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
          path: '/api/orders'
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/orders'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    const body = await request.json();
    
    const response = await fetch(`${process.env.API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': session ? `session=${session.value}` : '',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create order',
        timestamp: new Date().toISOString(),
        path: '/api/orders'
      },
      { status: 500 }
    );
  }
} 