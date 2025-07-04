import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Package, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  AlertCircle,
  Shield,
  Settings,
  Download,
  Filter,
  Search,
  Calendar,
  Globe,
  Star,
  MessageCircle,
  Flag,
  Zap,
  Crown,
  Award,
  Target,
  Plus,
  ChevronDown,
  FileText,
  ShoppingCart
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Analytics } from '../../types';

const mockAnalytics: Analytics = {
  revenue: {
    total: 125000,
    thisMonth: 15000,
    lastMonth: 12000,
    growth: 25.0,
  },
  orders: {
    total: 2450,
    pending: 45,
    completed: 2300,
    cancelled: 105,
  },
  users: {
    total: 5600,
    customers: 4800,
    designers: 800,
    newThisMonth: 340,
  },
  products: {
    total: 156,
    published: 145,
    draft: 11,
    topSelling: [],
  },
};

const mockUsers = [
  {
    id: '1',
    name: 'John Customer',
    email: 'john@example.com',
    role: 'customer',
    status: 'active',
    joinDate: '2024-01-15',
    orders: 12,
    spent: 450.99,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '2',
    name: 'Sarah Designer',
    email: 'sarah@example.com',
    role: 'designer',
    status: 'active',
    joinDate: '2023-08-20',
    designs: 45,
    earnings: 15678.50,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '3',
    name: 'Mike Artist',
    email: 'mike@example.com',
    role: 'designer',
    status: 'pending',
    joinDate: '2024-01-20',
    designs: 3,
    earnings: 0,
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
  }
];

const mockProducts = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    category: 'T-Shirts',
    price: 19.99,
    stock: 150,
    sales: 234,
    status: 'active',
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=100',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Premium Hoodie',
    category: 'Hoodies',
    price: 39.99,
    stock: 75,
    sales: 156,
    status: 'active',
    image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=100',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Ceramic Coffee Mug',
    category: 'Mugs',
    price: 14.99,
    stock: 200,
    sales: 89,
    status: 'active',
    image: 'https://images.pexels.com/photos/6347707/pexels-photo-6347707.jpeg?auto=compress&cs=tinysrgb&w=100',
    createdAt: '2024-01-25',
  }
];

const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    email: 'john@example.com',
    total: 89.99,
    status: 'completed',
    items: 3,
    date: '2024-01-20',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    total: 45.50,
    status: 'processing',
    items: 1,
    date: '2024-01-19',
    paymentMethod: 'PayPal',
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    email: 'mike@example.com',
    total: 125.00,
    status: 'shipped',
    items: 2,
    date: '2024-01-18',
    paymentMethod: 'M-Pesa',
  }
];

const mockReports = [
  {
    id: '1',
    type: 'design',
    reportedItem: 'Inappropriate Design',
    reporter: 'user123',
    reason: 'Copyright infringement',
    status: 'pending',
    date: '2024-01-20',
  },
  {
    id: '2',
    type: 'user',
    reportedItem: 'Spam Account',
    reporter: 'user456',
    reason: 'Spam behavior',
    status: 'resolved',
    date: '2024-01-18',
  }
];

export function AdminDashboard() {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders' | 'reports' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const user = state.user!;
  const analytics = mockAnalytics;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reports', label: 'Reports', icon: Flag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const statusColors = {
    active: 'bg-green-100/80 text-green-700',
    pending: 'bg-yellow-100/80 text-yellow-700',
    suspended: 'bg-red-100/80 text-red-700',
    resolved: 'bg-green-100/80 text-green-700',
    processing: 'bg-blue-100/80 text-blue-700',
    completed: 'bg-green-100/80 text-green-700',
    shipped: 'bg-purple-100/80 text-purple-700',
    cancelled: 'bg-red-100/80 text-red-700',
  };

  const handleUserAction = (userId: string, action: 'view' | 'edit' | 'suspend' | 'delete') => {
    console.log(`${action} user:`, userId);
    // Implement user actions
  };

  const handleProductAction = (productId: string, action: 'view' | 'edit' | 'delete' | 'toggle') => {
    console.log(`${action} product:`, productId);
    // Implement product actions
  };

  const handleOrderAction = (orderId: string, action: 'view' | 'update' | 'cancel') => {
    console.log(`${action} order:`, orderId);
    // Implement order actions
  };

  const handleReportAction = (reportId: string, action: 'approve' | 'dismiss' | 'investigate') => {
    console.log(`${action} report:`, reportId);
    // Implement report actions
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6"
          >
            <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-xl">
              <Shield className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage platform operations and monitor performance</p>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <Card className="p-1 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <DollarSign className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">${analytics.revenue.total.toLocaleString()}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <TrendingUp className="h-2 sm:h-3 w-2 sm:w-3 text-green-500" />
                        <span className="text-xs text-green-600">+{analytics.revenue.growth}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Users</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{analytics.users.total.toLocaleString()}</p>
                      <p className="text-xs text-blue-600">+{analytics.users.newThisMonth} this month</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Package className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{analytics.orders.total.toLocaleString()}</p>
                      <p className="text-xs text-purple-600">{analytics.orders.pending} pending</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Star className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Active Products</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{analytics.products.published}</p>
                      <p className="text-xs text-yellow-600">{analytics.products.draft} drafts</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Revenue Chart Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                  <div className="h-48 sm:h-64 bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                    <div className="text-center">
                      <BarChart3 className="h-8 sm:h-12 w-8 sm:w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm sm:text-base">Revenue chart would go here</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* User Growth */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Customers</span>
                      <span className="font-semibold">{analytics.users.customers.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200/80 backdrop-blur-sm rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${(analytics.users.customers / analytics.users.total) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm sm:text-base">Designers</span>
                      <span className="font-semibold">{analytics.users.designers.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200/80 backdrop-blur-sm rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${(analytics.users.designers / analytics.users.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-4 sm:p-6 bg-gradient-to-r from-primary-500/90 to-secondary-500/90 backdrop-blur-md border border-white/20 shadow-xl text-white">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs sm:text-sm" glassmorphic>
                    <Users className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Manage </span>Users
                  </Button>
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs sm:text-sm" glassmorphic>
                    <Target className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">View </span>Reports
                  </Button>
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs sm:text-sm" glassmorphic>
                    <Zap className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">System </span>Health
                  </Button>
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs sm:text-sm" glassmorphic>
                    <Crown className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Platform </span>Settings
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-primary-500 shadow-lg text-sm"
                  />
                </div>
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-primary-500 shadow-lg text-sm"
                >
                  <option value="all">All Users</option>
                  <option value="customers">Customers</option>
                  <option value="designers">Designers</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <Card className="overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
                    <tr>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm">User</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm">Role</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm">Status</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm hidden sm:table-cell">Join Date</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm hidden md:table-cell">Activity</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {mockUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 sm:w-8 h-6 sm:h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                              <p className="text-xs text-gray-600 hidden sm:block">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <span className="capitalize text-gray-900 text-sm">{user.role}</span>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[user.status as keyof typeof statusColors]} backdrop-blur-sm`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-900 text-sm hidden sm:table-cell">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-900 text-sm hidden md:table-cell">
                          {user.role === 'customer' ? (
                            <span>{user.orders} orders • ${user.spent}</span>
                          ) : (
                            <span>{user.designs} designs • ${user.earnings}</span>
                          )}
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div className="flex space-x-1 sm:space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              glassmorphic
                              onClick={() => handleUserAction(user.id, 'view')}
                              className="p-1 sm:p-2"
                            >
                              <Eye className="h-3 sm:h-4 w-3 sm:w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              glassmorphic
                              onClick={() => handleUserAction(user.id, 'edit')}
                              className="p-1 sm:p-2"
                            >
                              <Edit className="h-3 sm:h-4 w-3 sm:w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              glassmorphic
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              className="p-1 sm:p-2"
                            >
                              <MessageCircle className="h-3 sm:h-4 w-3 sm:w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product Management</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button glassmorphic className="text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
                <select className="px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-primary-500 shadow-lg text-sm">
                  <option>All Categories</option>
                  <option>T-Shirts</option>
                  <option>Hoodies</option>
                  <option>Mugs</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {mockProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 sm:h-48 object-cover"
                      />
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[product.status as keyof typeof statusColors]} backdrop-blur-sm`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{product.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">{product.category}</p>
                      
                      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-semibold">${product.price}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Stock</p>
                          <p className="font-semibold">{product.stock}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Sales</p>
                          <p className="font-semibold">{product.sales}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="font-semibold">{new Date(product.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 sm:space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs sm:text-sm" 
                          glassmorphic
                          onClick={() => handleProductAction(product.id, 'view')}
                        >
                          <Eye className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs sm:text-sm" 
                          glassmorphic
                          onClick={() => handleProductAction(product.id, 'edit')}
                        >
                          <Edit className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Management</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <select className="px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-primary-500 shadow-lg text-sm">
                  <option>All Orders</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Completed</option>
                </select>
                <Button variant="outline" glassmorphic className="text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
                    <tr>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm">Order ID</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm">Customer</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm">Total</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm">Status</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm hidden sm:table-cell">Date</th>
                      <th className="text-left py-3 px-4 sm:px-6 font-medium text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {mockOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <span className="font-medium text-gray-900 text-sm">{order.id}</span>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{order.customer}</p>
                            <p className="text-xs text-gray-600 hidden sm:block">{order.email}</p>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <span className="font-semibold text-gray-900 text-sm">${order.total}</span>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status as keyof typeof statusColors]} backdrop-blur-sm`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6 text-gray-900 text-sm hidden sm:table-cell">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 sm:py-4 px-4 sm:px-6">
                          <div className="flex space-x-1 sm:space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              glassmorphic
                              onClick={() => handleOrderAction(order.id, 'view')}
                              className="p-1 sm:p-2"
                            >
                              <Eye className="h-3 sm:h-4 w-3 sm:w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              glassmorphic
                              onClick={() => handleOrderAction(order.id, 'update')}
                              className="p-1 sm:p-2"
                            >
                              <Edit className="h-3 sm:h-4 w-3 sm:w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reports & Moderation</h2>
              <div className="flex space-x-3">
                <select className="px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-primary-500 shadow-lg text-sm">
                  <option>All Reports</option>
                  <option>Pending</option>
                  <option>Resolved</option>
                  <option>Dismissed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {mockReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.reportedItem}</h3>
                        <p className="text-sm text-gray-600">Reported by: {report.reporter}</p>
                        <p className="text-sm text-gray-600">Type: {report.type}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[report.status as keyof typeof statusColors]} backdrop-blur-sm`}>
                        {report.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700">
                        <strong>Reason:</strong> {report.reason}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Reported on {new Date(report.date).toLocaleDateString()}
                      </p>
                    </div>

                    {report.status === 'pending' && (
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm" 
                          glassmorphic
                          onClick={() => handleReportAction(report.id, 'approve')}
                        >
                          <Check className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          glassmorphic
                          onClick={() => handleReportAction(report.id, 'dismiss')}
                          className="text-xs sm:text-sm"
                        >
                          <X className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                          Dismiss
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          glassmorphic
                          onClick={() => handleReportAction(report.id, 'investigate')}
                          className="text-xs sm:text-sm"
                        >
                          <Eye className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                          Investigate
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Platform Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* General Settings */}
              <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                    <input
                      type="text"
                      defaultValue="PrintCraft"
                      className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                    <input
                      type="email"
                      defaultValue="support@printcraft.com"
                      className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                    <input
                      type="number"
                      defaultValue="15"
                      className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>
              </Card>

              {/* Security Settings */}
              <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                    </div>
                    <button className="bg-primary-600 relative inline-flex h-6 w-11 items-center rounded-full shadow-lg">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Auto-approve Designs</p>
                      <p className="text-sm text-gray-600">Automatically approve new designs</p>
                    </div>
                    <button className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full shadow-lg">
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button glassmorphic className="text-sm sm:text-base">Save Changes</Button>
              <Button variant="outline" glassmorphic className="text-sm sm:text-base">Reset to Defaults</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}