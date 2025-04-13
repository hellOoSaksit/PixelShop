"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Premium Account', price: 499, quantity: 1, image: '/images/product-1.jpg', type: 'RPG' },
    { id: 3, name: 'Basic Account', price: 199, quantity: 2, image: '/images/product-2.jpg', type: 'FPS' },
    { id: 5, name: 'Gold Package', price: 349, quantity: 1, image: '/images/product-3.jpg', type: 'MMO' }
  ]);

  const removeItem = (id: number): void => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number): void => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };

  const totalPrice: number = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems: number = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Navbar />
      
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
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="font-pressstart text-xl text-white">CART ITEMS ({totalItems})</h2>
                </div>
                
                <div className="divide-y divide-gray-800">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-6 flex flex-col md:flex-row items-start md:items-center">
                      <div className="w-full md:w-auto md:mr-6 mb-4 md:mb-0">
                        <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                          <span className="font-pressstart text-sm text-blue-400">{item.type}</span>
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">Type: {item.type}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="flex items-center mb-4 sm:mb-0">
                            <button 
                              className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-l-lg hover:bg-gray-700 transition"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="bg-gray-800 text-white w-12 h-8 flex items-center justify-center border-x border-gray-700">
                              {item.quantity}
                            </span>
                            <button 
                              className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-r-lg hover:bg-gray-700 transition"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between w-full sm:w-auto">
                            <span className="font-pressstart text-green-400 text-lg">
                              {item.price * item.quantity} ฿
                            </span>
                            <button 
                              className="ml-6 text-red-400 hover:text-red-300 transition"
                              onClick={() => removeItem(item.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-gray-800 bg-opacity-50 flex justify-between items-center">
                  <Link href="/shop" className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium transition">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Continue Shopping
                  </Link>
                  
                  <button 
                    className="text-red-400 hover:text-red-300 flex items-center text-sm font-medium transition"
                    onClick={() => setCartItems([])}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800 sticky top-28">
                <div className="p-6 border-b border-gray-800">
                  <h2 className="font-pressstart text-xl text-white">ORDER SUMMARY</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span>{totalPrice} ฿</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Processing Fee</span>
                      <span>0 ฿</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discount</span>
                      <span>0 ฿</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">Total</span>
                      <span className="font-pressstart text-xl text-green-400">{totalPrice} ฿</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 font-pressstart text-white py-3 rounded-lg transition transform hover:scale-[1.02] shadow-lg mb-4">
                    CHECKOUT
                  </button>
                  
                  <div className="text-center text-xs text-gray-500">Secure Payment</div>
                  
                  <div className="flex justify-center gap-2 mt-4">
                    <div className="h-6 w-10 bg-gray-800 rounded"></div>
                    <div className="h-6 w-10 bg-gray-800 rounded"></div>
                    <div className="h-6 w-10 bg-gray-800 rounded"></div>
                    <div className="h-6 w-10 bg-gray-800 rounded"></div>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-800 bg-gray-800 bg-opacity-30">
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Coupon Code</label>
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder="Enter code" 
                        className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500" 
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition">
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    By completing your purchase, you agree to our 
                    <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">Terms of Service</a>.
                  </div>
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