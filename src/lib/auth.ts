import { cookies } from 'next/headers';

/**
 * ฟังก์ชันสำหรับรีเฟรช Token
 * @returns {Promise<boolean>} สถานะการรีเฟรช Token
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // ถ้าไม่สามารถรีเฟรช Token ได้ ให้ลบ Token ทั้งหมด
      const cookieStore = await cookies();
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      cookieStore.delete('session');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}

/**
 * ฟังก์ชันสำหรับตรวจสอบ Token
 * @returns {Promise<boolean>} สถานะการตรวจสอบ Token
 */
export async function checkAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const refreshTokenCookie = cookieStore.get('refreshToken');

    // ถ้าไม่มี Token ใดๆ เลย
    if (!accessToken && !refreshTokenCookie) {
      return false;
    }

    // ถ้ามี Access Token ให้ตรวจสอบว่ายังใช้ได้อยู่หรือไม่
    if (accessToken) {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      });

      if (response.ok) {
        return true;
      }
    }

    // ถ้า Access Token ไม่สามารถใช้ได้ แต่มี Refresh Token ให้ลองรีเฟรช
    if (refreshTokenCookie) {
      return await refreshToken();
    }

    return false;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้จาก Session
 * @returns {Promise<any>} ข้อมูลผู้ใช้
 */
export async function getUser(): Promise<any> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      return null;
    }

    return JSON.parse(session.value);
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * ฟังก์ชันสำหรับตรวจสอบว่าผู้ใช้มีสิทธิ์หรือไม่
 * @param {string} requiredRole สิทธิ์ที่ต้องการ
 * @returns {Promise<boolean>} สถานะการตรวจสอบสิทธิ์
 */
export async function checkRole(requiredRole: string): Promise<boolean> {
  try {
    const user = await getUser();
    return user?.role === requiredRole;
  } catch (error) {
    console.error('Role check error:', error);
    return false;
  }
}

/**
 * ฟังก์ชันสำหรับลบ Token ทั้งหมด
 */
export async function clearAuth(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('session');
} 