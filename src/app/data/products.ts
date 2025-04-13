import { Product } from '../type/Product';

export const products: Product[] = [
  { 
    id: 1, 
    name: 'NETFLIX PREMIUM', 
    price: 199, 
    image: '/images/netflix.jpg',
    category: 'streaming',
    stock: 126,
    isFeatured: true,
    popularity: 98,
    description: 'บัญชี Netflix Premium สามารถดูได้พร้อมกัน 4 อุปกรณ์ ความคมชัดสูงสุด 4K HDR รองรับทุกอุปกรณ์'
  },
  { 
    id: 2, 
    name: 'YOUTUBE PREMIUM', 
    price: 149, 
    image: '/images/youtube.jpg',
    category: 'streaming',
    stock: 84,
    popularity: 85,
    description: 'รับชมวิดีโอบน YouTube โดยไม่มีโฆษณา สามารถดาวน์โหลดวิดีโอมาดูออฟไลน์ได้ และเล่นเพลงเป็นแบ็คกราวนด์'
  },
  { 
    id: 3, 
    name: 'SPOTIFY FAMILY', 
    price: 129, 
    image: '/images/spotify.jpg',
    category: 'music',
    stock: 95,
    discount: 15,
    popularity: 92,
    description: 'แพ็คเกจสุดคุ้ม Spotify สำหรับครอบครัว รองรับการใช้งานพร้อมกันได้สูงสุด 6 คน ฟังเพลงไม่มีโฆษณา'
  },
  { 
    id: 4, 
    name: 'STEAM WALLET CARD', 
    price: 500, 
    image: '/images/steam.jpg',
    category: 'gaming',
    stock: 57,
    isFeatured: true,
    popularity: 94,
    description: 'บัตรเติมเงิน Steam Wallet มูลค่า 500 บาท ใช้สำหรับซื้อเกมและไอเทมในร้านค้า Steam'
  },
  { 
    id: 5, 
    name: 'AMAZON PRIME', 
    price: 179, 
    image: '/images/amazon.jpg',
    category: 'streaming',
    stock: 38,
    popularity: 80,
    description: 'บัญชี Amazon Prime มาพร้อมกับบริการ Prime Video, Prime Music และสิทธิพิเศษสำหรับการซื้อสินค้าบน Amazon'
  },
  { 
    id: 6, 
    name: 'DISNEY+ PREMIUM', 
    price: 159, 
    image: '/images/disney.jpg',
    category: 'streaming',
    stock: 72,
    popularity: 88,
    description: 'บัญชี Disney+ ดูหนังและซีรีส์ดังจาก Disney, Marvel, Star Wars, Pixar, National Geographic ได้ไม่จำกัด'
  },
  { 
    id: 7, 
    name: 'APPLE MUSIC', 
    price: 139, 
    image: '/images/apple.jpg',
    category: 'music',
    stock: 64,
    popularity: 78,
    description: 'บริการสตรีมเพลงจาก Apple ฟังเพลงไม่จำกัดกว่า 90 ล้านเพลง พร้อมมิกซ์เพลงและเพลย์ลิสต์แนะนำ'
  },
  { 
    id: 8, 
    name: 'PLAYSTATION PLUS', 
    price: 349, 
    image: '/images/ps.jpg',
    category: 'gaming',
    stock: 41,
    discount: 10,
    popularity: 91,
    description: 'บริการสมาชิก PlayStation Plus เล่นเกมออนไลน์ รับเกมฟรีทุกเดือน และส่วนลดพิเศษสำหรับสมาชิก'
  },
]