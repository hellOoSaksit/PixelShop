"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

interface AuthButtonProps {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
  balance?: number;
  points?: number;
}

export default function Navbar() {
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // ไม่ต้องทำอะไรถ้าไม่ได้ล็อกอิน
    },
  });
  const router = useRouter();
  const { items: cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // ตรวจสอบ session เมื่อ component โหลด
  useEffect(() => {
    if (status === 'loading') {
      return;
    }
  }, [status]);

  const CartIcon = () => (
    <Link 
      href="/cart" 
      className="relative group"
      style={{ 
        color: '#F5F5F5',
        transition: 'transform 0.2s ease-in-out'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg 
        style={{ 
          width: '24px', 
          height: '24px',
          filter: 'drop-shadow(0 0 2px rgba(99, 102, 241, 0.3))'
        }} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
        />
      </svg>
      {cart.length > 0 && (
        <span 
          className="absolute -top-2 -right-2 flex items-center justify-center"
          style={{
            background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
            color: 'white',
            borderRadius: '9999px',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
          }}
        >
          {cart.length}
        </span>
      )}
    </Link>
  );

  const NavLink = ({ href, children }: NavLinkProps) => (
    <Link
      href={href}
      className="relative group"
      style={{ 
        color: '#F5F5F5',
        transition: 'color 0.3s ease'
      }}
    >
      {children}
      <span
        className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]
          transition-all duration-300 group-hover:w-full"
      />
    </Link>
  );

  const AuthButton = ({ href, primary = false, children }: AuthButtonProps) => (
    <Link
      href={href}
      className={`transition-all duration-300 transform hover:scale-105
        ${primary 
          ? 'bg-gradient-to-r from-[#EF4444] to-[#F87171] text-white hover:shadow-lg' 
          : 'border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:bg-opacity-10'
        }`}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        boxShadow: primary ? '0 4px 6px rgba(239, 68, 68, 0.2)' : 'none'
      }}
    >
      {children}
    </Link>
  );

  return (
    <nav className="fixed w-full z-50 bg-[#121212] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-pressstart text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                PIXELSHOP
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                หน้าแรก
              </Link>
              <Link
                href="/products"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                สินค้าทั้งหมด
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                ติดต่อ
              </Link>
              <Link
                href="/promotions"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                โปรโมชั่น
              </Link>
              {session?.user && (
                <Link
                  href="/cart"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium relative"
                >
                  ตะกร้า
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {status === 'loading' ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                </div>
              ) : session?.user ? (
                <div className="flex items-center space-x-4">
                  {session.user.role === 'admin' ? (
                    <>
                      <Link
                        href="/admin/dashboard"
                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        แดชบอร์ด
                      </Link>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-300 text-sm">
                            {session.user.name}
                          </span>
                          <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-white text-xs rounded-full">
                            แอดมิน
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          {session.user.email}
                        </span>
                        <div className="flex space-x-2">
                          <span className="text-green-400 text-xs">
                            {(session.user as User).balance || 0} บาท
                          </span>
                          <span className="text-yellow-400 text-xs">
                            {(session.user as User).points || 0} แต้ม
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300 text-sm">
                          {session.user.name}
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {session.user.email}
                      </span>
                      <div className="flex space-x-2">
                        <span className="text-green-400 text-xs">
                          {(session.user as User).balance || 0} บาท
                        </span>
                        <span className="text-yellow-400 text-xs">
                          {(session.user as User).points || 0} แต้ม
                        </span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    สมัครสมาชิก
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              หน้าแรก
            </Link>
            <Link
              href="/products"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              สินค้าทั้งหมด
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              ติดต่อ
            </Link>
            <Link
              href="/promotions"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              โปรโมชั่น
            </Link>
            {session?.user && (
              <Link
                href="/cart"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium relative"
              >
                ตะกร้า
                {cart.length > 0 && (
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {session?.user && session.user.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                แดชบอร์ด
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {status === 'loading' ? (
              <div className="animate-pulse flex space-x-4 px-5">
                <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
              </div>
            ) : session?.user ? (
              <div className="px-5 space-y-2">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 text-sm">
                      {session.user.name}
                    </span>
                    {session.user.role === 'admin' && (
                      <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-white  text-xs rounded-full">
                        แอดมิน
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs">
                    {session.user.email}
                  </span>
                  <div className="flex space-x-2">
                    <span className="text-green-400 text-xs">
                      {(session.user as User).balance || 0} บาท
                    </span>
                    <span className="text-yellow-400 text-xs">
                      {(session.user as User).points || 0} แต้ม
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="px-5 space-y-2">
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium text-center"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}