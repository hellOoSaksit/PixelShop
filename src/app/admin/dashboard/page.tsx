'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'available' | 'sold' | 'deleted';
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  credentials: {
    username: string;
    password: string;
    contact: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
}

interface SaleLog {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  price: number;
  date: string;
  status: 'completed' | 'cancelled' | 'pending';
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'sales'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [saleLogs, setSaleLogs] = useState<SaleLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'product' | 'user', id: string, name: string } | null>(null);
  const [chartData, setChartData] = useState({
    sales: {
      labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
      datasets: [
        {
          label: 'ยอดขาย',
          data: [0, 0, 0, 0, 0, 0],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
      ],
    },
    categories: {
      labels: ['streaming', 'music', 'gaming'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
          ],
        },
      ],
    },
    status: {
      labels: ['พร้อมขาย', 'ขายแล้ว', 'ปิดการขาย'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
        },
      ],
    },
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    balance: 0,
    points: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลสินค้า
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // ดึงข้อมูลผู้ใช้
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // ดึงข้อมูลประวัติการขาย
        const salesResponse = await fetch('/api/sales');
        const salesData = await salesResponse.json();
        setSaleLogs(salesData);

        // คำนวณข้อมูลสำหรับกราฟ
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

        // คำนวณยอดขายรายเดือน
        const monthlySales = Array(6).fill(0);
        salesData.forEach((log: any) => {
          const logDate = new Date(log.date);
          if (logDate >= sixMonthsAgo && log.status === 'completed') {
            const monthDiff = currentDate.getMonth() - logDate.getMonth();
            if (monthDiff >= 0 && monthDiff < 6) {
              monthlySales[5 - monthDiff] += log.price;
            }
          }
        });

        // คำนวณการกระจายตามหมวดหมู่
        const categoryCounts = {
          streaming: 0,
          music: 0,
          gaming: 0
        };
        productsData.forEach((product: any) => {
          if (product.category) {
            categoryCounts[product.category as keyof typeof categoryCounts]++;
          }
        });

        // คำนวณสถานะสินค้า
        const statusCounts = {
          available: productsData.filter((p: any) => p.status === 'available').length,
          sold: productsData.filter((p: any) => p.status === 'sold').length,
          deleted: productsData.filter((p: any) => p.status === 'deleted').length
        };

        setChartData({
          sales: {
            ...chartData.sales,
            datasets: [{
              ...chartData.sales.datasets[0],
              data: monthlySales
            }]
          },
          categories: {
            ...chartData.categories,
            datasets: [{
              ...chartData.categories.datasets[0],
              data: Object.values(categoryCounts)
            }]
          },
          status: {
            ...chartData.status,
            datasets: [{
              ...chartData.status.datasets[0],
              data: Object.values(statusCounts)
            }]
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    // กรองตามวันที่
    if (startDate && endDate) {
      const productDate = new Date(product.createdAt || product.updatedAt || '');
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // ตั้งเวลาเป็นสิ้นวัน
      
      if (productDate < start || productDate > end) {
        return false;
      }
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    sold: products.filter(p => p.status === 'sold').length,
    available: products.filter(p => p.status === 'available').length,
    deleted: products.filter(p => p.status === 'deleted').length
  };

  // ฟังก์ชันแก้ไขสินค้า
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditProductModal(true);
  };

  // ฟังก์ชันลบสินค้า
  const handleDeleteProduct = (productId: string, productName: string) => {
    setItemToDelete({ type: 'product', id: productId, name: productName });
    setShowDeleteConfirm(true);
  };

  // ฟังก์ชันแก้ไขผู้ใช้
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  // ฟังก์ชันลบผู้ใช้
  const handleDeleteUser = (userId: string, userName: string) => {
    setItemToDelete({ type: 'user', id: userId, name: userName });
    setShowDeleteConfirm(true);
  };

  // ฟังก์ชันยืนยันการลบ
  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'product') {
        setProducts(products.filter(product => product.id !== itemToDelete.id));
      } else {
        setUsers(users.filter(user => user.id !== itemToDelete.id));
      }
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // เพิ่มผู้ใช้ใหม่
      const newUserData = {
        id: Date.now().toString(),
        ...newUser
      };
      
      setUsers([...users, newUserData]);
      setShowAddUserModal(false);
      setShowSuccessPopup(true);
      
      // รีเซ็ตฟอร์ม
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user',
        balance: 0,
        points: 0
      });

      // ซ่อน popup หลังจาก 3 วินาที
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-300 border-opacity-20 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-pressstart text-blue-500">LOADING...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="font-pressstart text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              ADMIN DASHBOARD
            </span>
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium transition-colors"
            >
              เพิ่มสินค้าใหม่
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="border border-blue-500 text-blue-400 hover:bg-blue-900/20 py-2 px-6 rounded font-medium transition-colors"
            >
              เพิ่มผู้ใช้
            </button>
          </div>
        </div>

        {/* สถิติ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a1a1a] rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500/20 animate-pulse">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">ขายแล้ว</p>
                <p className="text-2xl font-bold text-green-500">{stats.sold}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/20 animate-pulse">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">พร้อมขาย</p>
                <p className="text-2xl font-bold text-blue-500">{stats.available}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500/20 animate-pulse">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">อยู่ในตะกร้า</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.deleted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* กราฟ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1a1a1a] rounded-lg p-4 transform hover:scale-[1.02] transition-transform duration-300">
            <h3 className="text-lg font-medium mb-2">ยอดขายรายเดือน</h3>
            <div className="h-48">
              <Line
                data={chartData.sales}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                      labels: {
                        color: '#9CA3AF',
                      },
                    },
                  },
                  scales: {
                    y: {
                      grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                      },
                      ticks: {
                        color: '#9CA3AF',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                      },
                      ticks: {
                        color: '#9CA3AF',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 transform hover:scale-[1.02] transition-transform duration-300">
            <h3 className="text-lg font-medium mb-2">การกระจายตามหมวดหมู่</h3>
            <div className="h-48">
              <Pie
                data={chartData.categories}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                      labels: {
                        color: '#9CA3AF',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 transform hover:scale-[1.02] transition-transform duration-300">
            <h3 className="text-lg font-medium mb-2">สถานะสินค้า</h3>
            <div className="h-48">
              <Bar
                data={chartData.status}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                      labels: {
                        color: '#9CA3AF',
                      },
                    },
                  },
                  scales: {
                    y: {
                      grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                      },
                      ticks: {
                        color: '#9CA3AF',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                      },
                      ticks: {
                        color: '#9CA3AF',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ..."
                className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">หมวดหมู่ทั้งหมด</option>
                <option value="streaming">Streaming</option>
                <option value="music">Music</option>
                <option value="gaming">Gaming</option>
              </select>
            </div>
            <div>
              <select
                className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="available">พร้อมขาย</option>
                <option value="sold">ขายแล้ว</option>
                <option value="deleted">ปิดการขาย</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
          <div className="border-b border-gray-800">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                สินค้า
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                ผู้ใช้
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'sales'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                ประวัติการขาย
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-[#252525]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        รหัสสินค้า
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ชื่อเกม / หมวดหมู่
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ราคา
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        สถานะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        การจัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1a1a1a] divide-y divide-gray-800">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#252525] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-200">
                            {product.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-200">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            ฿{product.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.status === 'sold'
                                ? 'bg-green-500/20 text-green-400'
                                : product.status === 'available'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {product.status === 'sold'
                              ? 'ขายแล้ว'
                              : product.status === 'available'
                              ? 'พร้อมขาย'
                              : 'ปิดการขาย'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-400 hover:text-blue-300 mr-4"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-[#252525]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ชื่อ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        อีเมล
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        สิทธิ์
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ยอดเงิน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        การจัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1a1a1a] divide-y divide-gray-800">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#252525] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-200">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${
                              user.role === 'admin'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {user.role === 'admin' ? 'แอดมิน' : 'ผู้ใช้'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            ฿{user.balance}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-400 hover:text-blue-300 mr-4"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'sales' && (
              <>
                <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="วันที่เริ่มต้น"
                      />
                      <input
                        type="date"
                        className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="วันที่สิ้นสุด"
                      />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-[#252525]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          รหัสการขาย
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          สินค้า
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          ผู้ซื้อ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          ราคา
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          วันที่
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          สถานะ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#1a1a1a] divide-y divide-gray-800">
                      {saleLogs
                        .filter(log => {
                          if (startDate && endDate) {
                            const logDate = new Date(log.date);
                            const start = new Date(startDate);
                            const end = new Date(endDate);
                            end.setHours(23, 59, 59, 999);
                            
                            return logDate >= start && logDate <= end;
                          }
                          return true;
                        })
                        .map((log) => (
                          <tr key={log.id} className="hover:bg-[#252525] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-200">
                                {log.id}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-200">
                                {log.productName}
                              </div>
                              <div className="text-sm text-gray-400">
                                ID: {log.productId}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-200">
                                {log.buyerName}
                              </div>
                              <div className="text-sm text-gray-400">
                                ID: {log.buyerId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">
                                ฿{log.price}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">
                                {new Date(log.date).toLocaleString('th-TH')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  log.status === 'completed'
                                    ? 'bg-green-500/20 text-green-400'
                                    : log.status === 'cancelled'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}
                              >
                                {log.status === 'completed'
                                  ? 'สำเร็จ'
                                  : log.status === 'cancelled'
                                  ? 'ยกเลิก'
                                  : 'รอดำเนินการ'}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-200">เพิ่มสินค้าใหม่</h2>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">หมวดหมู่</label>
                  <select className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="ROV">ROV</option>
                    <option value="Valorant">Valorant</option>
                    {/* เพิ่มหมวดหมู่อื่นๆ ตามต้องการ */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อสินค้า</label>
                  <input
                    type="text"
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">คำอธิบาย</label>
                  <textarea
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ราคา</label>
                  <input
                    type="number"
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ข้อมูลเข้าสู่ระบบ</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="ช่องทางการติดต่อ (Line/Facebook)"
                      className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">รูปภาพ</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-gray-400">ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="mr-4 px-4 py-2 text-gray-400 hover:text-gray-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium transition-colors"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-200">เพิ่มผู้ใช้ใหม่</h2>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อ</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">อีเมล</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">รหัสผ่าน</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">สิทธิ์</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">ผู้ใช้</option>
                    <option value="admin">แอดมิน</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ยอดเงิน</label>
                  <input
                    type="number"
                    required
                    value={newUser.balance}
                    onChange={(e) => setNewUser({ ...newUser, balance: Number(e.target.value) })}
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">พอยท์</label>
                  <input
                    type="number"
                    required
                    value={newUser.points}
                    onChange={(e) => setNewUser({ ...newUser, points: Number(e.target.value) })}
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-gray-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium transition-colors"
                  >
                    เพิ่มผู้ใช้
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {showEditProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-200">แก้ไขสินค้า</h2>
                <button
                  onClick={() => {
                    setShowEditProductModal(false);
                    setSelectedProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">หมวดหมู่</label>
                  <select 
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedProduct.category}
                  >
                    <option value="ROV">ROV</option>
                    <option value="Valorant">Valorant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อสินค้า</label>
                  <input
                    type="text"
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedProduct.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">คำอธิบาย</label>
                  <textarea
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    defaultValue={selectedProduct.description}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ราคา</label>
                  <input
                    type="number"
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedProduct.price}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">สถานะ</label>
                  <select 
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedProduct.status}
                  >
                    <option value="available">พร้อมขาย</option>
                    <option value="sold">ขายแล้ว</option>
                    <option value="deleted">ปิดการขาย</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ข้อมูลเข้าสู่ระบบ</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Username"
                      className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedProduct.credentials.username}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedProduct.credentials.password}
                    />
                    <input
                      type="text"
                      placeholder="ช่องทางการติดต่อ (Line/Facebook)"
                      className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={selectedProduct.credentials.contact}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditProductModal(false);
                      setSelectedProduct(null);
                    }}
                    className="mr-4 px-4 py-2 text-gray-400 hover:text-gray-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium transition-colors"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-200">แก้ไขผู้ใช้</h2>
                <button
                  onClick={() => {
                    setShowEditUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ชื่อ</label>
                  <input
                    type="text"
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedUser.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">อีเมล</label>
                  <input
                    type="email"
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedUser.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">รหัสผ่าน</label>
                  <input
                    type="password"
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="********"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ยอดเงิน</label>
                  <input
                    type="number"
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedUser.balance}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">สิทธิ์</label>
                  <select 
                    className="w-full bg-[#252525] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedUser.role}
                  >
                    <option value="admin">แอดมิน</option>
                    <option value="user">ผู้ใช้</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditUserModal(false);
                      setSelectedUser(null);
                    }}
                    className="mr-4 px-4 py-2 text-gray-400 hover:text-gray-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium transition-colors"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && itemToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-200">ยืนยันการลบ</h2>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <p className="text-gray-300 mb-2">
                  คุณแน่ใจหรือไม่ที่จะลบ{itemToDelete.type === 'product' ? 'สินค้า' : 'ผู้ใช้'}นี้?
                </p>
                <p className="text-gray-400 font-medium">{itemToDelete.name}</p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded font-medium transition-colors"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>เพิ่มผู้ใช้สำเร็จ!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 