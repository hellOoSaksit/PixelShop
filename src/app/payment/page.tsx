'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { Product } from '../type/Product';
import { ProductService } from '../services/ProductService';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // โหลดข้อมูลสินค้า
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
      }
    };

    if (items.length > 0) {
      loadCartItems();
    }
  }, [items]);

  // คำนวณยอดรวม
  const total = cartItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: total,
          paymentMethod: paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      const data = await response.json();
      setPaymentStatus('success');
      setTransactionId(data.transactionId);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">ไม่มีสินค้าในตะกร้า</h1>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            กลับไปที่ร้านค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">ชำระเงิน</h1>
          <p className="mt-2 text-gray-400">กรุณาชำระเงินตามจำนวนที่แสดงด้านล่าง</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">ยอดรวม</h2>
            <span className="text-2xl font-bold text-blue-400">฿{total.toLocaleString()}</span>
          </div>

          <div className="border border-gray-700 rounded-lg p-4 mb-6">
            <div className="text-center mb-4">
              <p className="text-gray-400 mb-2">สแกน QR Code เพื่อชำระเงิน</p>
              <div className="bg-white p-4 rounded-lg inline-block">
                {/* ช่องว่างสำหรับ QR Code */}
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">QR Code</span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>กรุณาชำระเงินภายใน 15 นาที</p>
              <p>หลังจากชำระเงินแล้ว ระบบจะทำการยืนยันอัตโนมัติ</p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || cartItems.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'กำลังดำเนินการ...' : 'ยืนยันการชำระเงิน'}
            </button>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">รายละเอียดการสั่งซื้อ</h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-400">จำนวน: {item.quantity}</p>
                </div>
                <span className="text-blue-400">฿{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}