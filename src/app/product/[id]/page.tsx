"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../type/Product';
import { ProductService } from '../../services/ProductService';
import ProductCard from '../../components/ProductCart';

interface PageParams {
  id: string;
}

export default function ProductDetail({ params }: { params: PageParams }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await ProductService.getProductById(params.id);
        setProduct(data);
      } catch (err) {
        setError('ไม่พบสินค้า');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) return;
    setQuantity(newQuantity);
  };

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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-pressstart text-red-500">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-400 mt-2">{error || 'ไม่พบสินค้า'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-[#1a1a1a] rounded-lg p-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-auto rounded-lg cursor-pointer hover:opacity-80 transition"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-blue-500">{product.price} ฿</span>
              {product.discount && (
                <span className="ml-4 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                  ลด {product.discount}%
                </span>
              )}
            </div>
            <p className="text-gray-400 mb-6">{product.description}</p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-3">คุณสมบัติ</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock Info */}
            <div className="mb-6">
              <p className="text-gray-400">
                สินค้าคงเหลือ: <span className="text-green-500">{product.stock} ชิ้น</span>
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-10 h-10 bg-gray-700 text-white rounded-l-lg flex items-center justify-center hover:bg-gray-600 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="w-16 h-10 bg-gray-800 text-white text-center border-x border-gray-700"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-10 h-10 bg-gray-700 text-white rounded-r-lg flex items-center justify-center hover:bg-gray-600 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart(product, quantity)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition shadow-pixel hover:shadow-pixel-hover"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 