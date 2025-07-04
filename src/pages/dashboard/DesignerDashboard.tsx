import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  MessageCircle,
  Calendar,
  Award,
  BarChart3,
  Upload,
  Image as ImageIcon,
  FileText,
  Settings,
  Zap,
  Target,
  Crown,
  Gift
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const mockDesigns = [
  {
    id: '1',
    name: 'Mountain Sunset',
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'published',
    sales: 145,
    revenue: 2175.00,
    rating: 4.8,
    views: 2340,
    likes: 189,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Abstract Geometry',
    image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'published',
    sales: 89,
    revenue: 1335.00,
    rating: 4.6,
    views: 1890,
    likes: 156,
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Minimalist Wave',
    image: 'https://images.pexels.com/photos/6347707/pexels-photo-6347707.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'draft',
    sales: 0,
    revenue: 0,
    rating: 0,
    views: 0,
    likes: 0,
    createdAt: '2024-01-20',
  }
];

const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    design: 'Mountain Sunset',
    product: 'Custom T-Shirt',
    status: 'in_progress',
    deadline: '2024-01-25',
    value: 45.00,
    messages: 3,
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    design: 'Abstract Geometry',
    product: 'Custom Hoodie',
    status: 'completed',
    deadline: '2024-01-20',
    value: 75.00,
    messages: 1,
  }
];

const mockAnalytics = {
  thisMonth: {
    revenue: 3450.00,
    sales: 234,
    views: 12340,
    newFollowers: 45,
  },
  lastMonth: {
    revenue: 2890.00,
    sales: 198,
    views: 10230,
    newFollowers: 38,
  }
};

export function DesignerDashboard() {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'designs' | 'orders' | 'analytics' | 'profile'>('overview');
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  const user = state.user!;
  const analytics = mockAnalytics;
  const revenueGrowth = ((analytics.thisMonth.revenue - analytics.lastMonth.revenue) / analytics.lastMonth.revenue * 100).toFixed(1);
  const salesGrowth = ((analytics.thisMonth.sales - analytics.lastMonth.sales) / analytics.lastMonth.sales * 100).toFixed(1);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'designs', label: 'My Designs', icon: Palette },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const statusColors = {
    published: 'bg-green-100/80 text-green-700',
    draft: 'bg-yellow-100/80 text-yellow-700',
    rejected: 'bg-red-100/80 text-red-700',
  };

  const orderStatusColors = {
    in_progress: 'bg-blue-100/80 text-blue-700',
    completed: 'bg-green-100/80 text-green-700',
    cancelled: 'bg-red-100/80 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-4 mb-6"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white/50 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <Palette className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Designer Studio</h1>
              <p className="text-gray-600">Create, manage, and track your designs</p>
            </div>
            <div className="ml-auto">
              <Button className="flex items-center space-x-2" glassmorphic>
                <Plus className="h-4 w-4" />
                <span>New Design</span>
              </Button>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <Card className="p-1 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-gray-900">${user.stats?.totalEarnings?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-green-600">+{revenueGrowth}% this month</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Palette className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Designs</p>
                      <p className="text-2xl font-bold text-gray-900">{user.stats?.totalDesigns || 0}</p>
                      <p className="text-xs text-blue-600">{mockDesigns.filter(d => d.status === 'published').length} published</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="text-2xl font-bold text-gray-900">{user.stats?.totalSales || 0}</p>
                      <p className="text-xs text-purple-600">+{salesGrowth}% this month</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Followers</p>
                      <p className="text-2xl font-bold text-gray-900">{user.stats?.followers || 0}</p>
                      <p className="text-xs text-yellow-600">+{analytics.thisMonth.newFollowers} this month</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing Designs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Designs</h2>
                  <div className="space-y-4">
                    {mockDesigns.filter(d => d.status === 'published').slice(0, 3).map((design, index) => (
                      <motion.div
                        key={design.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center space-x-4 p-3 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-lg hover:shadow-lg transition-all"
                      >
                        <img
                          src={design.image}
                          alt={design.name}
                          className="w-12 h-12 object-cover rounded-lg shadow-md"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{design.name}</p>
                          <p className="text-sm text-gray-600">{design.sales} sales • ${design.revenue}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{design.rating}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
                  <div className="space-y-4">
                    {mockOrders.slice(0, 3).map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-lg hover:shadow-lg transition-all"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer} • {order.design}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${orderStatusColors[order.status as keyof typeof orderStatusColors]} backdrop-blur-sm`}>
                            {order.status.replace('_', ' ')}
                          </span>
                          <span className="font-semibold text-gray-900">${order.value}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md border border-white/20 shadow-xl text-white">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" glassmorphic>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Design
                  </Button>
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" glassmorphic>
                    <Target className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" glassmorphic>
                    <Zap className="h-4 w-4 mr-2" />
                    Promote Design
                  </Button>
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" glassmorphic>
                    <Crown className="h-4 w-4 mr-2" />
                    Go Premium
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Designs Tab */}
        {activeTab === 'designs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Designs</h2>
              <div className="flex space-x-3">
                <select className="px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-primary-500 shadow-lg">
                  <option>All Designs</option>
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Rejected</option>
                </select>
                <Button glassmorphic>
                  <Plus className="h-4 w-4 mr-2" />
                  New Design
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDesigns.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all">
                    <div className="relative">
                      <img
                        src={design.image}
                        alt={design.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[design.status as keyof typeof statusColors]} backdrop-blur-sm`}>
                          {design.status}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-1">
                        <button className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all backdrop-blur-sm">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all backdrop-blur-sm">
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{design.name}</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Sales</p>
                          <p className="font-semibold">{design.sales}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Revenue</p>
                          <p className="font-semibold">${design.revenue}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Views</p>
                          <p className="font-semibold">{design.views}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Rating</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="font-semibold">{design.rating || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1" glassmorphic>
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" glassmorphic>
                          <Download className="h-4 w-4 mr-1" />
                          Download
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Design Orders</h2>
              <select className="px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-primary-500 shadow-lg">
                <option>All Orders</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div className="space-y-4">
              {mockOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-600">Customer: {order.customer}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${orderStatusColors[order.status as keyof typeof orderStatusColors]} backdrop-blur-sm`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Design</p>
                        <p className="font-medium text-gray-900">{order.design}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Product</p>
                        <p className="font-medium text-gray-900">{order.product}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="font-medium text-gray-900">{new Date(order.deadline).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Value</p>
                        <p className="font-medium text-gray-900">${order.value}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{order.messages} messages</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" glassmorphic>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" glassmorphic>View Details</Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">${analytics.thisMonth.revenue}</p>
                <p className="text-sm text-green-600">+{revenueGrowth}% from last month</p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Monthly Sales</p>
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.thisMonth.sales}</p>
                <p className="text-sm text-blue-600">+{salesGrowth}% from last month</p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">Profile Views</p>
                  <Eye className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.thisMonth.views}</p>
                <p className="text-sm text-purple-600">+{((analytics.thisMonth.views - analytics.lastMonth.views) / analytics.lastMonth.views * 100).toFixed(1)}% from last month</p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">New Followers</p>
                  <Users className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.thisMonth.newFollowers}</p>
                <p className="text-sm text-yellow-600">+{((analytics.thisMonth.newFollowers - analytics.lastMonth.newFollowers) / analytics.lastMonth.newFollowers * 100).toFixed(1)}% from last month</p>
              </Card>
            </div>

            {/* Design Performance */}
            <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Design Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200/50">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Design</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Views</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Likes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Sales</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDesigns.filter(d => d.status === 'published').map((design, index) => (
                      <motion.tr
                        key={design.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-100/50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={design.image}
                              alt={design.name}
                              className="w-10 h-10 object-cover rounded-lg shadow-md"
                            />
                            <span className="font-medium text-gray-900">{design.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{design.views}</td>
                        <td className="py-3 px-4 text-gray-900">{design.likes}</td>
                        <td className="py-3 px-4 text-gray-900">{design.sales}</td>
                        <td className="py-3 px-4 text-gray-900">${design.revenue}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-gray-900">{design.rating}</span>
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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Designer Profile</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white/50 shadow-xl"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <Palette className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">{user.stats?.rating || 0} rating</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{user.stats?.followers || 0} followers</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <p className="text-gray-900 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg">
                    {user.profile?.bio || 'No bio added yet.'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Website</label>
                  <p className="text-gray-900 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg">
                    {user.profile?.website || 'No website added yet.'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                  <div className="space-y-2">
                    <p className="text-gray-900 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg">
                      Instagram: {user.profile?.socialLinks?.instagram || 'Not connected'}
                    </p>
                    <p className="text-gray-900 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg">
                      Behance: {user.profile?.socialLinks?.behance || 'Not connected'}
                    </p>
                  </div>
                </div>

                <Button glassmorphic>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}