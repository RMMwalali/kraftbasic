import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Package, 
  Star, 
  TrendingUp,
  Calendar,
  MapPin,
  Edit,
  Eye,
  Download,
  MessageCircle,
  Clock,
  CheckCircle,
  Truck,
  CreditCard,
  Award,
  Gift,
  Target,
  Zap
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 89.99,
    items: 3,
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-20',
    products: [
      {
        name: 'Custom T-Shirt',
        image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=200',
        design: 'Mountain Sunset',
        quantity: 2,
      }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'in_production',
    total: 45.50,
    items: 1,
    estimatedDelivery: '2024-01-25',
    products: [
      {
        name: 'Custom Mug',
        image: 'https://images.pexels.com/photos/6347707/pexels-photo-6347707.jpeg?auto=compress&cs=tinysrgb&w=200',
        design: 'Coffee Lover',
        quantity: 1,
      }
    ]
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'shipped',
    total: 125.00,
    items: 2,
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-18',
    products: [
      {
        name: 'Custom Hoodie',
        image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=200',
        design: 'Abstract Art',
        quantity: 1,
      }
    ]
  }
];

const mockWishlist = [
  {
    id: '1',
    name: 'Vintage Poster Design',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=200',
    designer: 'Sarah Chen',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Minimalist Tote Bag',
    price: 18.99,
    image: 'https://images.pexels.com/photos/7679471/pexels-photo-7679471.jpeg?auto=compress&cs=tinysrgb&w=200',
    designer: 'Mike Johnson',
    rating: 4.6,
  }
];

const statusConfig = {
  pending: { color: 'text-yellow-600', bg: 'bg-yellow-100/80', icon: Clock },
  in_production: { color: 'text-blue-600', bg: 'bg-blue-100/80', icon: Package },
  shipped: { color: 'text-purple-600', bg: 'bg-purple-100/80', icon: Truck },
  delivered: { color: 'text-green-600', bg: 'bg-green-100/80', icon: CheckCircle },
};

export function CustomerDashboard() {
  const { state, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'profile'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: state.user?.name || '',
    bio: state.user?.profile?.bio || '',
    location: state.user?.profile?.location || '',
  });

  const user = state.user!;

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({
        name: profileData.name,
        profile: {
          ...user.profile,
          bio: profileData.bio,
          location: profileData.location,
        }
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8">
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
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600">Manage your orders and discover new designs</p>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <Card className="p-1 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
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
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{user.stats?.totalOrders || 0}</p>
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
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900">${user.stats?.totalSpent?.toFixed(2) || '0.00'}</p>
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
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Wishlist Items</p>
                      <p className="text-2xl font-bold text-gray-900">{mockWishlist.length}</p>
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
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reviews Given</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')} glassmorphic>
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {mockOrders.slice(0, 3).map((order, index) => {
                    const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl border border-white/30 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={order.products[0].image}
                            alt={order.products[0].name}
                            className="w-12 h-12 object-cover rounded-lg shadow-md"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.products[0].name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status as keyof typeof statusConfig].bg} ${statusConfig[order.status as keyof typeof statusConfig].color} backdrop-blur-sm`}>
                            <StatusIcon className="h-3 w-3" />
                            <span className="capitalize">{order.status.replace('_', ' ')}</span>
                          </div>
                          <span className="font-semibold text-gray-900">${order.total}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-gradient-to-r from-primary-500/90 to-secondary-500/90 backdrop-blur-md border border-white/20 shadow-xl text-white">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" glassmorphic>
                    <Gift className="h-4 w-4 mr-2" />
                    Browse Products
                  </Button>
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" glassmorphic>
                    <Target className="h-4 w-4 mr-2" />
                    Custom Design
                  </Button>
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" glassmorphic>
                    <Zap className="h-4 w-4 mr-2" />
                    Track Order
                  </Button>
                  <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" glassmorphic>
                    <Award className="h-4 w-4 mr-2" />
                    Rewards
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
              <div className="flex space-x-2">
                <select className="px-3 py-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-lg focus:ring-2 focus:ring-primary-500 shadow-lg">
                  <option>All Orders</option>
                  <option>Pending</option>
                  <option>In Production</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {mockOrders.map((order, index) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                return (
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
                          <p className="text-sm text-gray-600">Ordered on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status as keyof typeof statusConfig].bg} ${statusConfig[order.status as keyof typeof statusConfig].color} backdrop-blur-sm`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="capitalize">{order.status.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <h4 className="font-medium text-gray-900 mb-3">Items ({order.items})</h4>
                          <div className="space-y-3">
                            {order.products.map((product, index) => (
                              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{product.name}</p>
                                  <p className="text-sm text-gray-600">Design: {product.design}</p>
                                  <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold text-gray-900">${order.total}</p>
                          </div>
                          
                          {order.trackingNumber && (
                            <div>
                              <p className="text-sm text-gray-600">Tracking</p>
                              <p className="font-medium text-gray-900">{order.trackingNumber}</p>
                            </div>
                          )}

                          <div>
                            <p className="text-sm text-gray-600">Estimated Delivery</p>
                            <p className="font-medium text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1" glassmorphic>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm" className="flex-1" glassmorphic>
                                <Star className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Wishlist</h2>
              <p className="text-gray-600">{mockWishlist.length} items</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockWishlist.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-all backdrop-blur-sm">
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {item.designer}</p>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(item.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        <Button size="sm" glassmorphic>Add to Cart</Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <Card className="p-6 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  glassmorphic
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditingProfile ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white/50 shadow-xl"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.isVerified 
                          ? 'bg-green-100/80 text-green-700' 
                          : 'bg-yellow-100/80 text-yellow-700'
                      } backdrop-blur-sm`}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100/80 text-blue-700 capitalize backdrop-blur-sm">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="City, Country"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button onClick={handleProfileUpdate} glassmorphic>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)} glassmorphic>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <p className="text-gray-900 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg">
                        {user.profile?.bio || 'No bio added yet.'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <div className="flex items-center space-x-2 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user.profile?.location || 'Location not specified'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                      <div className="flex items-center space-x-2 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}