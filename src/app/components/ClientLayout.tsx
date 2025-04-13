"use client";

import { CartProvider } from '../context/CartContext';
import Navbar from './Navbar';
import Footer from './Footer';
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Navbar />
      <main>{children}</main>
      <Footer/>
    </CartProvider>
  );
} 