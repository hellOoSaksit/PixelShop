import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Endpoint สำหรับจัดการสินค้าของ admin
 * 
 * GET: ดึงข้อมูลสินค้าทั้งหมด
 * ข้อมูลที่รับจาก Frontend:
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/admin/products):
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - products: รายการสินค้าทั้งหมด
 *   - id: รหัสสินค้า
 *   - name: ชื่อสินค้า
 *   - price: ราคา
 *   - category: ประเภท
 *   - description: รายละเอียด
 *   - discount: ส่วนลด
 *   - stock: สต็อก
 *   - createdAt: วันที่สร้าง
 *   - updatedAt: วันที่อัพเดท
 * 
 * POST: สร้างสินค้าใหม่
 * ข้อมูลที่รับจาก Frontend:
 * - name: ชื่อสินค้า
 * - price: ราคา
 * - category: ประเภท
 * - description: รายละเอียด
 * - discount: ส่วนลด
 * - stock: สต็อก
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/admin/products):
 * - name: ชื่อสินค้า
 * - price: ราคา
 * - category: ประเภท
 * - description: รายละเอียด
 * - discount: ส่วนลด
 * - stock: สต็อก
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - product: ข้อมูลสินค้าที่สร้างใหม่
 * 
 * PUT: อัพเดทสินค้า
 * ข้อมูลที่รับจาก Frontend:
 * - id: รหัสสินค้า
 * - name: ชื่อสินค้า
 * - price: ราคา
 * - category: ประเภท
 * - description: รายละเอียด
 * - discount: ส่วนลด
 * - stock: สต็อก
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/admin/products):
 * - id: รหัสสินค้า
 * - name: ชื่อสินค้า
 * - price: ราคา
 * - category: ประเภท
 * - description: รายละเอียด
 * - discount: ส่วนลด
 * - stock: สต็อก
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - product: ข้อมูลสินค้าที่อัพเดท
 * 
 * DELETE: ลบสินค้า
 * ข้อมูลที่รับจาก Frontend:
 * - id: รหัสสินค้า (ผ่าน query parameter)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/admin/products?id={id}):
 * - ไม่มี (ใช้ query parameter)
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - success: สถานะการลบ
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
    const session = cookieStore.get('session');
    
    const response = await fetch(`${process.env.API_URL}/api/admin/products`, {
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
          path: '/api/admin/products'
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/admin/products'
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
    
    const response = await fetch(`${process.env.API_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
        'Cookie': session ? `session=${session.value}` : '',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create product',
        timestamp: new Date().toISOString(),
        path: '/api/admin/products'
      },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    const body = await request.json();
    
    const response = await fetch(`${process.env.API_URL}/api/admin/products`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
        'Cookie': session ? `session=${session.value}` : '',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update product',
        timestamp: new Date().toISOString(),
        path: '/api/admin/products'
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const response = await fetch(`${process.env.API_URL}/api/admin/products?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Cookie': session ? `session=${session.value}` : '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Product deletion error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to delete product',
        timestamp: new Date().toISOString(),
        path: '/api/admin/products'
      },
      { status: 400 }
    );
  }
} 