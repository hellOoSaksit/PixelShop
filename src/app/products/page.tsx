"use client";

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCart';
import type { Product } from '../types/Product';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
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
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('ไม่พบข้อมูลสินค้า');
        // ตั้งค่า products เป็น array ว่างเพื่อให้ระบบยังทำงานได้
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
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
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // recommended - no sorting or default sorting
        break;
    }
    
    return filtered;
  };
  
  useEffect(() => {
    setFilteredProducts(filterProducts());
  }, [activeCategory, minPrice, maxPrice, searchQuery, sortBy, products]);

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
      
      {/* Error Message */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-red-500 text-white p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">เกิดข้อผิดพลาด</h2>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100"
            >
              ลองใหม่
            </button>
          </div>
        </div>
      )}
      
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
                    max="1000000"
                    value={minPrice} 
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full bg-[#252525] text-gray-300 px-3 py-2 rounded-lg border border-gray-700 mr-2" 
                    placeholder="Min" 
                  />
                  <span className="text-gray-500">-</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="1000000"
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
                </select>
              </div>
            </div>
            
            {/* Results info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-400">แสดง {filteredProducts.length} รายการ</p>
            </div>
            
            {/* Products Grid */}
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
            ) : filteredProducts.length === 0 ? (
              <div className="bg-[#1a1a1a] rounded-lg p-10 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-medium text-white mb-2">ไม่พบสินค้า</h3>
                <p className="text-gray-400">ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา กรุณาลองใหม่อีกครั้ง</p>
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
    </div>
  );
}