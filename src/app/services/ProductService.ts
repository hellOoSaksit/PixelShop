import { Product } from '../type/Product';

export class ProductService {
  static async getProducts(): Promise<Product[]> {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }

  static async getProductById(id: string): Promise<Product> {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  }

  static async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const response = await fetch(`/api/products?categoryId=${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    return response.json();
  }

  static async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  }
} 