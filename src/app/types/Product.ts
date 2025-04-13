export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  discount?: number;
  stock: number;
  image?: string;
}

export interface PriceDetail {
  originalPrice: number;
  discountedPrice: number;
  saveAmount: number;
  discountPercent: number;
} 