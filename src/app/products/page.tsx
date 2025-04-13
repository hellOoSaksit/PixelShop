"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCart';
import { products } from '../data/products';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'streaming', label: 'สตรีมมิ่ง' },
    { id: 'music', label: 'เพลง' },
    { id: 'gaming', label: 'เกม' },
    { id: 'software', label: 'ซอฟต์แวร์' }
  ];
  
  const filterProducts = () => {
    let filtered = [...products];
    
    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    // Price range filter
    filtered = filtered.filter(
      product => product.price >= minPrice && product.price <= maxPrice
    );
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product => product.name.toLowerCase().includes(query) || 
        product.description?.toLowerCase().includes(query)
      );
    }
    
    // Sort
    switch(sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      default: // recommended - no sorting or default sorting
        break;
    }
    
    return filtered;
  };
  
  const filteredProducts = filterProducts();

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
      
      <Navbar />
      
      <div className="pt-28 pb-10 bg-gradient-to-r from-[#1a1a1a] to-[#121212]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">สินค้า<span className="text-blue-500">ทั้งหมด</span></h1>
          <p className="text-gray-400">เลือกซื้อสินค้าที่คุณต้องการจากรายการด้านล่าง</p>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-[#1a1a1a] rounded-lg p-6 sticky top-28">
              <h2 className="font-medium text-lg mb-4">ตัวกรอง</h2>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">หมวดหมู่</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        activeCategory === category.id 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-400 hover:bg-[#252525]'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">ช่วงราคา</h3>
                <div className="flex items-center mb-4">
                  <input 
                    type="number" 
                    min="0" 
                    max="10000"
                    value={minPrice} 
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full bg-[#252525] text-gray-300 px-3 py-2 rounded-lg border border-gray-700 mr-2" 
                    placeholder="Min" 
                  />
                  <span className="text-gray-500">-</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="10000"
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full bg-[#252525] text-gray-300 px-3 py-2 rounded-lg border border-gray-700 ml-2" 
                    placeholder="Max" 
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{minPrice} ฿</span>
                  <span>{maxPrice} ฿</span>
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">สถานะสินค้า</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" defaultChecked />
                    <span className="ml-2 text-gray-400">มีสินค้าเท่านั้น</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-gray-400">สินค้าลดราคา</span>
                  </label>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                ล้างตัวกรอง
              </button>
            </div>
          </div>
          
          {/* Products Content */}
          <div className="lg:w-3/4">
            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="ค้นหาสินค้า..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1a1a1a] text-gray-300 px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64" 
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-sm text-gray-400">เรียงตาม:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#1a1a1a] text-gray-300 px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow sm:flex-grow-0"
                >
                  <option value="recommended">แนะนำ</option>
                  <option value="price-low">ราคา: ต่ำ-สูง</option>
                  <option value="price-high">ราคา: สูง-ต่ำ</option>
                  <option value="newest">สินค้าใหม่</option>
                  <option value="popular">ยอดนิยม</option>
                </select>
              </div>
            </div>
            
            {/* Results info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-400">แสดง {filteredProducts.length} รายการ</p>
            </div>
            
            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#1a1a1a] rounded-lg p-10 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-medium text-white mb-2">ไม่พบสินค้า</h3>
                <p className="text-gray-400">ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา กรุณาลองใหม่อีกครั้ง</p>
                <button 
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
                  onClick={() => {
                    setActiveCategory('all');
                    setMinPrice(0);
                    setMaxPrice(1000);
                    setSearchQuery('');
                    setSortBy('recommended');
                  }}
                >
                  ล้างตัวกรอง
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            <div className="mt-10 flex justify-center">
              <div className="flex space-x-1">
                <button className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-lg hover:bg-[#252525] transition">&laquo;</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-lg hover:bg-[#252525] transition">2</button>
                <button className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-lg hover:bg-[#252525] transition">3</button>
                <button className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-lg hover:bg-[#252525] transition">&raquo;</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-[#111] py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-pressstart text-lg text-white mb-4">ID SHOP</h3>
              <p className="text-gray-400 text-sm mb-4">บริการขายไอดีเกม บัตรเติมเงิน และสินค้าดิจิตอลหลากหลายรูปแบบ มีบริการรองรับตลอด 24 ชั่วโมง</p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-4">สินค้า</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">สตรีมมิ่ง</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">เพลง</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">เกม</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-4">เกี่ยวกับเรา</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">เกี่ยวกับเรา</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">ติดต่อ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">เงื่อนไข</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-4">ติดตามเรา</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-8">
            <p>&copy; 2025 ID SHOP. ALL RIGHTS RESERVED.</p>
            <p className="mt-2">Current date: 2025-04-13 09:35:17 UTC</p>
            <p>User: hellOoSaksit</p>
          </div>
        </div>
      </footer>
    </div>
  );
}