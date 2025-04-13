/**
 * API Endpoint สำหรับจัดการข้อมูลโปรไฟล์ผู้ใช้
 * 
 * GET: ดึงข้อมูลโปรไฟล์
 * ข้อมูลที่ต้องการ:
 * - token: JWT token จาก cookie
 * 
 * ข้อมูลที่ส่งกลับ:
 * - user: ข้อมูลผู้ใช้ (id, name, email, address, phone)
 * 
 * PUT: อัปเดตข้อมูลโปรไฟล์
 * ข้อมูลที่ต้องการ:
 * - token: JWT token จาก cookie
 * - name: ชื่อ-นามสกุล (ไม่บังคับ)
 * - address: ที่อยู่ (ไม่บังคับ)
 * - phone: เบอร์โทรศัพท์ (ไม่บังคับ)
 * 
 * ข้อมูลที่ส่งกลับ:
 * - user: ข้อมูลผู้ใช้ที่อัปเดตแล้ว
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 401: ไม่มีสิทธิ์เข้าถึง
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.API_URL}/api/profile`, {
      headers: {
        'Cookie': sessionCookie ? `session=${sessionCookie.value}` : '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    const body = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie ? `session=${sessionCookie.value}` : '',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' },
      { status: 500 }
    );
  }
} 