"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { Product } from '../type/Product';
import { ProductService } from '../services/ProductService';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Cart() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const loadedItems = await Promise.all(
          items.map(async (item) => {
            const product = await ProductService.getProductById(item.id);
            return {
              product,
              quantity: item.quantity
            };
          })
        );
        setCartItems(loadedItems);
      } catch (error) {
        console.error('Error loading cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, [items]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const totalPrice = cartItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-300 border-opacity-20 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-pressstart text-blue-500">กำลังโหลด...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">      
      <div className="pt-28 pb-10 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h1 className="font-pressstart text-3xl text-center text-white mb-4">YOUR CART</h1>
          <div className="flex justify-center">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span className="text-white ml-2">Cart</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 rounded-lg">
            <svg className="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h2 className="font-pressstart text-xl text-white mb-6">YOUR CART IS EMPTY</h2>
            <p className="max-w-md mx-auto text-gray-400 mb-8">Looks like you haven't added any accounts to your cart yet.</p>
            <Link href="/shop" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 font-pressstart text-white py-3 px-8 rounded-lg transition transform hover:scale-105 shadow-lg">
              BROWSE ACCOUNTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  className="bg-[#1a1a1a] rounded-lg p-6 mb-4"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {item.product.price} ฿
                      </p>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="w-10 h-10 bg-gray-700 text-white rounded-l-lg flex items-center justify-center hover:bg-gray-600 transition"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                          className="w-16 h-10 bg-gray-800 text-white text-center border-x border-gray-700"
                        />
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="w-10 h-10 bg-gray-700 text-white rounded-r-lg flex items-center justify-center hover:bg-gray-600 transition"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-4 text-red-500 hover:text-red-400 transition"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">สรุปรายการ</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ราคารวม</span>
                    <span className="text-white">{totalPrice} ฿</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-white">ยอดรวม</span>
                      <span className="text-xl font-bold text-blue-500">{totalPrice} ฿</span>
                    </div>
                  </div>
                  <Link
                    href="/payment"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition shadow-pixel hover:shadow-pixel-hover text-center block"
                  >
                    ชำระเงิน
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {cartItems.length > 0 && (
          <div className="mt-12">
            <h3 className="font-pressstart text-xl text-white mb-6">YOU MAY ALSO LIKE</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 transition">
                  <div className="h-40 bg-gray-800 flex items-center justify-center">
                    <span className="text-blue-400 font-pressstart">GAME {i}</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-white truncate">Special Account {i}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-green-400 font-medium">{199 + i * 100} ฿</span>
                      <button className="text-xs bg-gray-800 hover:bg-gray-700 text-white py-1 px-3 rounded transition">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="font-pressstart text-sm text-gray-400">&copy; 2025 GAME ID SHOP. ALL RIGHTS RESERVED.</p>
          <p className="text-gray-600 mt-2 text-xs">Current date: 2025-04-13 09:23:52 UTC</p>
          <p className="text-gray-600 text-xs">User: hellOoSaksit</p>
        </div>
      </footer>
    </div>
  );
}