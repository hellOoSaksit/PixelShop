export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  static async register(data: RegisterData) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'ไม่สามารถลงทะเบียนได้');
    }

    return response.json();
  }
} 