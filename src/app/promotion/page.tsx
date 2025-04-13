"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCart';
import Footer from '../components/Footer';
import type { Product } from '../types/Product';

export default function Promotion() {
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [promotions, setPromotions] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        const data = await response.json();
        setPromotions(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // กรองเฉพาะสินค้าที่มีส่วนลด
  const discountedProducts = promotions.filter((product: Product) => product.discount);

  // จัดเรียงสินค้า
  const sortProducts = () => {
    let sorted = [...discountedProducts];
    
    switch(sortBy) {
      case 'price-low':
        sorted.sort((a, b) => {
          const priceA = a.price - (a.price * (a.discount || 0) / 100);
          const priceB = b.price - (b.price * (b.discount || 0) / 100);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const priceA = a.price - (a.price * (a.discount || 0) / 100);
          const priceB = b.price - (b.price * (b.discount || 0) / 100);
          return priceB - priceA;
        });
        break;
      case 'discount-high':
        sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        break;
    }
    
    return sorted;
  };

  const sortedProducts = sortProducts();

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
      <div className="pt-28 pb-10 bg-gradient-to-r from-[#1a1a1a] to-[#121212]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">โปร<span className="text-red-500">โมชั่น</span></h1>
          <p className="text-gray-400">รวมสินค้าราคาพิเศษ ลดสูงสุด {Math.max(...promotions.map((p: Product) => p.discount || 0))}%</p>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-gray-400">พบ {discountedProducts.length} รายการ</p>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">เรียงตาม:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1a1a1a] text-gray-300 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recommended">แนะนำ</option>
              <option value="price-low">ราคาหลังลด: ต่ำ-สูง</option>
              <option value="price-high">ราคาหลังลด: สูง-ต่ำ</option>
              <option value="discount-high">ส่วนลดมากที่สุด</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {discountedProducts.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg p-10 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">ไม่พบสินค้าลดราคา</h3>
            <p className="text-gray-400">ขณะนี้ยังไม่มีสินค้าที่อยู่ในช่วงโปรโมชั่น กรุณากลับมาใหม่ในภายหลัง</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer/>
    </div>
  );
} 