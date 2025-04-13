"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './components/ProductCart';
import type { Product } from './types/Product';
import Image from 'next/image';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('ไม่สามารถเชื่อมต่อกับ API ได้');
        }
        
        const data = await response.json();
        setProducts(data);
        // เลือกสินค้าที่มีส่วนลดเป็นสินค้าแนะนำ
        setFeaturedProducts(data.filter((product: Product) => product.discount));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('ไม่พบข้อมูลสินค้า');
        setProducts([]);
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-sans">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-300 border-opacity-20 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-pressstart text-blue-500">LOADING...</h2>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <Image
          src="/hero-bg.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">ยินดีต้อนรับสู่ PixelShop</h1>
            <p className="text-xl text-gray-300 mb-8">ร้านค้าออนไลน์สำหรับทุกความต้องการ</p>
            <Link 
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition"
            >
              เริ่มช้อปปิ้ง
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8">สินค้าแนะนำ</h2>
          
          {error ? (
            <div className="bg-[#1a1a1a] rounded-lg p-10 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">ไม่พบข้อมูลสินค้า</h3>
              <p className="text-gray-400">ขณะนี้ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้งในภายหลัง</p>
              <button 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
                onClick={() => window.location.reload()}
              >
                ลองใหม่
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-[#1a1a1a] rounded-lg p-10 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">ไม่พบสินค้าแนะนำ</h3>
              <p className="text-gray-400">ขณะนี้ยังไม่มีสินค้าแนะนำ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}