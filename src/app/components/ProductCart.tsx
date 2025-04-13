"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import type { Product, PriceDetail } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // คำนวณราคาและส่วนลด
  const calculatePriceDetails = (product: Product): PriceDetail => {
    const originalPrice = product.price;
    const discountPercent = product.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * (discountPercent / 100));
    const saveAmount = originalPrice - discountedPrice;

    return {
      originalPrice,
      discountedPrice,
      saveAmount,
      discountPercent
    };
  };

  const priceDetails = calculatePriceDetails(product);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: priceDetails.discountedPrice,
        image: product.image || '/default-product.png'
      });
      setIsAdding(false);
    }, 500);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // ฟังก์ชันจัดรูปแบบราคาเป็นสกุลเงินไทย
  const formatPrice = (price: number): string => {
    return price.toLocaleString('th-TH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="group bg-[#1a1a1a] rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#252525] h-full flex flex-col">
      {/* รูปภาพสินค้า */}
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="relative overflow-hidden aspect-square">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#252525]">
              <span className="text-gray-400">{product.name}</span>
            </div>
          )}
          
          {/* แสดงส่วนลดและสต็อก */}
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
            <div className="flex items-center text-xs text-gray-300 bg-black/50 px-2 py-1 rounded">
              <span>มีสินค้า: {product.stock}</span>
            </div>
            {product.discount && (
              <div className="bg-[#2962ff] text-white text-xs px-2 py-1 rounded">
                -{product.discount}%
              </div>
            )}
          </div>
        </div>
      </Link>
      
      {/* รายละเอียดสินค้า */}
      <div className="p-4 flex flex-col flex-grow">
        {/* ชื่อสินค้า */}
        <Link href={`/product/${product.id}`} className="block mb-4 flex-grow">
          <h3 className="text-white text-lg font-medium hover:text-[#2962ff] transition line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {/* ราคาและปุ่มเพิ่มลดจำนวน */}
        <div className="space-y-4">
          {/* ส่วนราคา */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              {product.discount ? (
                <>
                  <span className="text-[#2962ff] text-xl font-bold">
                    {formatPrice(priceDetails.discountedPrice)} ฿
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm line-through">
                      {formatPrice(priceDetails.originalPrice)} ฿
                    </span>
                    <span className="text-green-500 text-sm whitespace-nowrap">
                      (-{formatPrice(priceDetails.saveAmount)} ฿)
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-[#2962ff] text-xl font-bold">
                  {formatPrice(product.price)} ฿
                </span>
              )}
            </div>
            
            {/* ปุ่มเพิ่ม/ลดจำนวน */}
            <div className="flex items-center gap-2 bg-[#252525] rounded-lg p-1">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="text-white w-8 h-8 rounded flex items-center justify-center hover:bg-[#2962ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-white w-8 text-center">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="text-white w-8 h-8 rounded flex items-center justify-center hover:bg-[#2962ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* ปุ่มเพิ่มลงตะกร้า */}
          <button 
            className={`${isAdding 
              ? 'bg-green-600' 
              : 'bg-[#2962ff] hover:bg-[#1e88e5]'} 
              text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center w-full disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
          >
            {isAdding ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                เพิ่มแล้ว
              </>
            ) : product.stock === 0 ? (
              'สินค้าหมด'
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                เพิ่มใส่ตะกร้า
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}