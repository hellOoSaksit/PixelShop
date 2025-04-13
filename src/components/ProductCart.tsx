"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../app/context/CartContext';
import { Product } from '../app/type/Product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product);
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-200 shadow-md">
      <Link href={`/product/${product.id}`}>
        <div className="h-40 bg-[#252525] flex items-center justify-center relative">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-medium text-blue-400">{product.name}</span>
          )}
          
          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{product.discount}%
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="mb-2">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-white hover:text-blue-400 transition">{product.name}</h3>
          </Link>
        </div>
        
        <div className="flex items-center text-xs text-gray-400 mb-3">
          <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>มีสินค้า: {product.stock}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-blue-500">{product.price} ฿</span>
          <button 
            className={`${isAdding 
              ? 'bg-green-600' 
              : 'bg-blue-600 hover:bg-blue-700'} 
              text-white text-sm py-1 px-3 rounded transition flex items-center`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                เพิ่มแล้ว
              </>
            ) : 'ซื้อเลย'}
          </button>
        </div>
      </div>
    </div>
  );
}