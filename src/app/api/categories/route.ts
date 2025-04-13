import { NextResponse } from 'next/server';

/**
 * API Endpoint สำหรับจัดการหมวดหมู่สินค้า
 * 
 * GET: ดึงข้อมูลหมวดหมู่ทั้งหมด
 * ข้อมูลที่รับจาก Frontend:
 * - ไม่มี (ดึงข้อมูลทั้งหมด)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/categories):
 * - ไม่มี (ดึงข้อมูลทั้งหมด)
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - categories: รายการหมวดหมู่
 *   - id: รหัสหมวดหมู่
 *   - name: ชื่อหมวดหมู่
 *   - description: คำอธิบาย
 *   - image: รูปภาพ
 * 
 * Environment Variables ที่ใช้:
 * - API_URL: URL ของ Backend API
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_URL}/api/categories`);
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้',
          timestamp: new Date().toISOString(),
          path: '/api/categories'
        },
        { status: 500 }
      );
    }

    const categories = await response.json();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/categories'
      },
      { status: 500 }
    );
  }
} 