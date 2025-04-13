"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#121212] shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="font-pressstart text-xl text-white transition hover:text-blue-400 flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">ID SHOP</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-blue-400 transition font-medium">
              หน้าแรก
            </Link>
            <Link href="/shop" className="text-gray-300 hover:text-blue-400 transition font-medium">
              สินค้า
            </Link>
            <Link href="/promotion" className="text-gray-300 hover:text-blue-400 transition font-medium">
              โปรโมชั่น
            </Link>
            <Link href="/howto" className="text-gray-300 hover:text-blue-400 transition font-medium">
              วิธีการสั่งซื้อ
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition font-medium">
              ติดต่อเรา
            </Link>
            
            {/* Cart Button */}
            <Link href="/cart" className="text-gray-300 hover:text-white transition relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs rounded-full h-5 w-5 flex items-center justify-center text-white">3</span>
            </Link>
            
            {/* Login/Register Buttons */}
            <div className="flex items-center space-x-2">
              <Link href="/login" className="bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500 hover:bg-opacity-10 px-4 py-1.5 rounded-lg text-sm font-medium transition">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">
                สมัครสมาชิก
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link href="/cart" className="text-gray-300 hover:text-white transition relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span className="absolute -top-2 -right-2 bg-blue-500 text-xs rounded-full h-5 w-5 flex items-center justify-center text-white">3</span>
            </Link>
            
            <button 
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 py-6 px-2 bg-[#171717] rounded-lg mb-4">
            <Link href="/" className="text-white hover:text-blue-400 transition font-medium">
              หน้าแรก
            </Link>
            <Link href="/shop" className="text-gray-300 hover:text-blue-400 transition font-medium">
              สินค้า
            </Link>
            <Link href="/promotion" className="text-gray-300 hover:text-blue-400 transition font-medium">
              โปรโมชั่น
            </Link>
            <Link href="/howto" className="text-gray-300 hover:text-blue-400 transition font-medium">
              วิธีการสั่งซื้อ
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition font-medium">
              ติดต่อเรา
            </Link>
            
            <div className="pt-2 flex flex-col space-y-2">
              <Link href="/login" className="bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500 hover:bg-opacity-10 py-2 px-4 rounded-lg text-center font-medium transition">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center font-medium transition">
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}