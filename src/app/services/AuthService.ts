import { User } from '../types/User';

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(): Promise<User> {
    try {
      const response = await fetch('/api/auth/profile');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'ไม่สามารถอัปเดตโปรไฟล์ได้');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }
} 