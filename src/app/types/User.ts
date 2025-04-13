export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  balance?: number;
  points?: number;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
} 