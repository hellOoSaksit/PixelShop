import { NextResponse } from 'next/server';

/**
 * API Endpoint สำหรับจัดการข้อมูลสินค้า
 * 
 * GET: ดึงข้อมูลสินค้าทั้งหมด
 * ข้อมูลที่รับจาก Frontend:
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ส่งไปที่ Backend (${process.env.API_URL}/api/products):
 * - ไม่มี (สามารถเพิ่ม query parameters สำหรับการกรองได้)
 * 
 * ข้อมูลที่ส่งกลับไป Frontend:
 * - products: รายการสินค้าทั้งหมด
 *   - id: รหัสสินค้า
 *   - name: ชื่อสินค้า
 *   - price: ราคา
 *   - category: หมวดหมู่
 *   - description: คำอธิบาย
 *   - discount: ส่วนลด (ถ้ามี)
 *   - stock: จำนวนสินค้าคงเหลือ
 * 
 * Environment Variables ที่ใช้:
 * - API_URL: URL ของ Backend API
 * 
 * ข้อผิดพลาดที่อาจเกิดขึ้น:
 * - 500: เกิดข้อผิดพลาดในการเชื่อมต่อกับ API
 */

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_URL}/api/products`);
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
          timestamp: new Date().toISOString(),
          path: '/api/products'
        },
        { status: 500 }
      );
    }
    
    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        error: 'ไม่สามารถเชื่อมต่อกับ API ได้',
        timestamp: new Date().toISOString(),
        path: '/api/products'
      },
      { status: 500 }
    );
  }
} 