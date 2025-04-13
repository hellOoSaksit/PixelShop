import { NextResponse } from 'next/server';

/**
 * API Endpoint สำหรับการลงทะเบียนผู้ใช้ใหม่
 * 
 * POST: ลงทะเบียนผู้ใช้ใหม่
 * ข้อมูลที่รับจาก Frontend:
 * - name: ชื่อและนามสกุลของผู้ใช้ (รวมเป็นฟิลด์เดียว)
 * - email: อีเมลของผู้ใช้
 * - password: รหัสผ่านของผู้ใช้
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/auth/register):
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "name": "ชื่อ นามสกุล"
 * }
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - user: ข้อมูลผู้ใช้ที่สร้างใหม่
 *   - id: รหัสผู้ใช้
 *   - name: ชื่อและนามสกุล
 *   - email: อีเมล
 *   - role: สิทธิ์
 * 
 * Environment Variables ที่ใช้:
 * - API_URL: URL ของ Backend API
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 400: อีเมลซ้ำหรือข้อมูลไม่ถูกต้อง
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received data:', body);
    
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          error: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          timestamp: new Date().toISOString(),
          path: '/api/auth/register'
        },
        { status: 400 }
      );
    }

    const apiUrl = `${process.env.API_URL}/api/auth/register`;
    
    const requestBody = {
      name: name.trim(),
      email: email.trim(),
      password
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: responseData.message || 'ไม่สามารถลงทะเบียนได้',
          timestamp: new Date().toISOString(),
          path: '/api/auth/register'
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/auth/register'
      },
      { status: 500 }
    );
  }
} 