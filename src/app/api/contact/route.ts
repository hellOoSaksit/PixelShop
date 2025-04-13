import { NextResponse } from 'next/server';

/**
 * API Endpoint สำหรับส่งข้อความติดต่อ
 * 
 * POST: ส่งข้อความติดต่อ
 * ข้อมูลที่รับจาก Frontend:
 * - name: ชื่อ-นามสกุลผู้ติดต่อ
 * - email: อีเมลผู้ติดต่อ
 * - subject: หัวข้อ
 * - message: ข้อความ
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/contact):
 * - name: ชื่อ-นามสกุลผู้ติดต่อ
 * - email: อีเมลผู้ติดต่อ
 * - subject: หัวข้อ
 * - message: ข้อความ
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - success: สถานะการส่งข้อความ
 * - message: ข้อความตอบกลับ
 * 
 * Environment Variables ที่ใช้:
 * - API_URL: URL ของ Backend API
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 400: ข้อมูลไม่ครบถ้วน
 * - 500: เกิดข้อผิดพลาดในการส่งข้อความ
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${process.env.API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send message');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send message',
        timestamp: new Date().toISOString(),
        path: '/api/contact'
      },
      { status: 500 }
    );
  }
} 