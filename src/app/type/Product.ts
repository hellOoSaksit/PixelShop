export interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
    category: string;
    stock: number;
    isFeatured?: boolean;
    discount?: number;
    description?: string;
    popularity?: number;
  }