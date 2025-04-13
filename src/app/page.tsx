"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCart';
import { products as allProducts } from '../app/data/products';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'streaming', label: 'สตรีมมิ่ง' },
    { id: 'music', label: 'เพลง' },
    { id: 'gaming', label: 'เกม' }
  ];
  
  const filteredProducts = activeCategory === 'all' 
    ? allProducts.slice(0, 10) 
    : allProducts.filter(p => p.category === activeCategory).slice(0, 10);
  
  const featuredProducts = allProducts.filter(p => p.isFeatured).slice(0, 6);
  
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
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a1a1a] to-[#121212] pt-24 pb-12">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
                <span className="font-pressstart text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">ID SHOP</span> <br />
                <span className="text-3xl">บริการ ID สินค้าดิจิตอล</span>
              </h1>
              <p className="text-lg mb-8 text-gray-400">
                บริการขายไอดีเกม บัตรเติมเงิน และสินค้าดิจิตอลหลากหลายรูปแบบ มีบริการรองรับตลอด 24 ชั่วโมง
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition transform hover:scale-105 shadow-lg">
                  สินค้าทั้งหมด
                </Link>
                <Link href="/contact" className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-900 hover:bg-opacity-20 py-3 px-8 rounded-lg font-medium transition">
                  ติดต่อเรา
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75"></div>
                <div className="bg-gray-900 p-6 rounded-lg relative">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {featuredProducts.map(product => (
                      <div key={product.id} className="bg-[#1a1a1a] rounded-lg p-4 flex flex-col items-center hover:bg-[#222] transition">
                        <div className="h-12 w-12 rounded-full bg-blue-900 bg-opacity-20 mb-3 flex items-center justify-center">
                          <span className="font-bold text-blue-400">{product.name.charAt(0)}</span>
                        </div>
                        <h3 className="text-sm font-medium text-center">{product.name}</h3>
                        <p className="text-blue-500 font-bold mt-2">{product.price} ฿</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="container mx-auto px-4 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-500">10,000+</div>
              <div className="text-sm text-gray-400">รายการขายสำเร็จ</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-500">24/7</div>
              <div className="text-sm text-gray-400">บริการตลอดเวลา</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-500">150+</div>
              <div className="text-sm text-gray-400">สินค้าให้เลือก</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-500">98%</div>
              <div className="text-sm text-gray-400">ความพึงพอใจ</div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">สินค้า<span className="text-blue-500">แนะนำ</span></h2>
            <Link href="/products" className="text-blue-500 hover:text-blue-400">
              ดูทั้งหมด →
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525]'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* How To Use Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-white mb-8">วิธีการ<span className="text-blue-500">ใช้งาน</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] rounded-lg p-6 relative">
              <div className="absolute -top-4 -left-4 bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">1</div>
              <h3 className="text-lg font-semibold mb-3 mt-4 text-white">เลือกสินค้า</h3>
              <p className="text-gray-400">เลือกสินค้าที่ต้องการจากรายการสินค้าของเรา หลากหลายหมวดหมู่</p>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-6 relative">
              <div className="absolute -top-4 -left-4 bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">2</div>
              <h3 className="text-lg font-semibold mb-3 mt-4 text-white">ชำระเงิน</h3>
              <p className="text-gray-400">ชำระเงินผ่านช่องทางที่สะดวก รองรับทั้งโอนเงินและบัตรเครดิต</p>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-6 relative">
              <div className="absolute -top-4 -left-4 bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">3</div>
              <h3 className="text-lg font-semibold mb-3 mt-4 text-white">รับสินค้าทันที</h3>
              <p className="text-gray-400">รับข้อมูลสินค้าทันทีหลังชำระเงิน ผ่านอีเมลหรือหน้าเว็บไซต์</p>
            </div>
          </div>
        </div>
        
        {/* Reviews */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-white">รีวิวจาก<span className="text-blue-500">ลูกค้า</span></h2>
            <button className="text-blue-500 hover:text-blue-400">ดูทั้งหมด</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#1a1a1a] rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <h4 className="font-medium">ลูกค้า{i}</h4>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, j) => (
                        <span key={j}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  "บริการดีมาก สินค้าส่งเร็ว คุณภาพเยี่ยม ใช้งานได้ทันที ประทับใจมาก จะกลับมาอุดหนุนอีกแน่นอน"
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-white mb-8">คำถาม<span className="text-blue-500">ที่พบบ่อย</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="font-medium text-white mb-3">วิธีการชำระเงิน?</h3>
              <p className="text-gray-400 text-sm">เรารองรับการชำระผ่านบัตรเครดิต บัตรเดบิต โอนผ่านธนาคาร และ e-wallet ชั้นนำทั้งหมด</p>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="font-medium text-white mb-3">ได้รับสินค้าเมื่อไหร่?</h3>
              <p className="text-gray-400 text-sm">สินค้าดิจิตอลส่งทันทีหลังชำระเงินสำเร็จ โดยจะส่งข้อมูลผ่านอีเมลและแสดงในหน้าบัญชีของคุณ</p>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="font-medium text-white mb-3">มีปัญหาการใช้งาน ติดต่อที่ไหน?</h3>
              <p className="text-gray-400 text-sm">ติดต่อฝ่ายบริการลูกค้าได้ 24 ชั่วโมงผ่านช่องทาง Live Chat หรืออีเมล support@idshop.com</p>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="font-medium text-white mb-3">มีนโยบายคืนเงินหรือไม่?</h3>
              <p className="text-gray-400 text-sm">เรามีนโยบายคืนเงินภายใน 24 ชั่วโมงหากสินค้ามีปัญหาและไม่สามารถใช้งานได้</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Newsletter */}
      <section className="bg-[#1a1a1a] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">รับข่าวสารและโปรโมชั่น</h2>
            <p className="text-gray-400 mb-6">ลงทะเบียนเพื่อรับข้อมูลโปรโมชั่นและสินค้าใหม่ก่อนใคร</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="อีเมลของคุณ" 
                className="bg-[#252525] text-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto flex-grow max-w-md"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
                สมัครรับข่าวสาร
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#111] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-pressstart text-lg text-white mb-4">ID SHOP</h3>
              <p className="text-gray-400 text-sm mb-4">บริการขายไอดีเกม บัตรเติมเงิน และสินค้าดิจิตอลหลากหลายรูปแบบ มีบริการรองรับตลอด 24 ชั่วโมง</p>
              <div className="flex space-x-4 mt-4">
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
            
            <div>
              <h4 className="font-medium text-white mb-4">สินค้า</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">สตรีมมิ่ง</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">เพลง</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">เกม</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">บัตรเติมเงิน</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">ซอฟต์แวร์</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-4">บริษัท</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">เกี่ยวกับเรา</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">ติดต่อ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">ร่วมงานกับเรา</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">บล็อก</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">พาร์ทเนอร์</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-4">ช่วยเหลือ</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">ศูนย์ช่วยเหลือ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">คำถามที่พบบ่อย</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">เงื่อนไขการใช้บริการ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">นโยบายความเป็นส่วนตัว</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">นโยบายการคืนเงิน</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-gray-400 text-sm">&copy; 2025 ID SHOP. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <div className="h-6 w-10 bg-gray-800 rounded"></div>
              <div className="h-6 w-10 bg-gray-800 rounded"></div>
              <div className="h-6 w-10 bg-gray-800 rounded"></div>
            </div>
          </div>
          
          <div className="text-center mt-8 text-xs text-gray-500">
            <p>Current date: 2025-04-13 09:35:17 UTC</p>
            <p>User: hellOoSaksit</p>
          </div>
        </div>
      </footer>
    </div>
  );
}