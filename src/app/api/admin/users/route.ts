import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Endpoint สำหรับจัดการผู้ใช้ของ admin
 * 
 * GET: ดึงข้อมูลผู้ใช้ทั้งหมด
 * ข้อมูลที่รับจาก Frontend:
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/admin/users):
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - users: รายการผู้ใช้ทั้งหมด
 *   - id: รหัสผู้ใช้
 *   - name: ชื่อ
 *   - email: อีเมล
 *   - role: สิทธิ์
 *   - createdAt: วันที่สร้าง
 *   - updatedAt: วันที่อัพเดท
 * 
 * POST: สร้างผู้ใช้ใหม่
 * ข้อมูลที่รับจาก Frontend:
 * - name: ชื่อ
 * - email: อีเมล
 * - password: รหัสผ่าน
 * - role: สิทธิ์
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/admin/users):
 * - name: ชื่อ
 * - email: อีเมล
 * - password: รหัสผ่าน
 * - role: สิทธิ์
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - user: ข้อมูลผู้ใช้ที่สร้างใหม่
 * 
 * PUT: อัพเดทผู้ใช้
 * ข้อมูลที่รับจาก Frontend:
 * - id: รหัสผู้ใช้
 * - name: ชื่อ
 * - email: อีเมล
 * - role: สิทธิ์
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/admin/users):
 * - id: รหัสผู้ใช้
 * - name: ชื่อ
 * - email: อีเมล
 * - role: สิทธิ์
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - user: ข้อมูลผู้ใช้ที่อัพเดท
 * 
 * DELETE: ลบผู้ใช้
 * ข้อมูลที่รับจาก Frontend:
 * - id: รหัสผู้ใช้ (ผ่าน query parameter)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/admin/users?id={id}):
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
    
    const response = await fetch(`${process.env.API_URL}/api/admin/users`, {
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
          path: '/api/admin/users'
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/admin/users'
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
    
    const response = await fetch(`${process.env.API_URL}/api/admin/users`, {
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
      throw new Error(errorData.message || 'Failed to create user');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create user',
        timestamp: new Date().toISOString(),
        path: '/api/admin/users'
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
    
    const response = await fetch(`${process.env.API_URL}/api/admin/users`, {
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
      throw new Error(errorData.message || 'Failed to update user');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update user',
        timestamp: new Date().toISOString(),
        path: '/api/admin/users'
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
    
    const response = await fetch(`${process.env.API_URL}/api/admin/users?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Cookie': session ? `session=${session.value}` : '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to delete user',
        timestamp: new Date().toISOString(),
        path: '/api/admin/users'
      },
      { status: 400 }
    );
  }
} 