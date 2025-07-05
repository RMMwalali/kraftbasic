import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  MessageCircle,
  Plus,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Package,
  Heart,
  User,
  Eye,
  Star,
  MapPin,
  Calendar,
  Edit
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  status: 'pending' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  items: OrderItem[];
  total: number;
  chatId: string;
  estimatedDelivery?: string;
}

const statusConfig = {
  pending: { color: 'text-yellow-600', bg: 'bg-yellow-100/80', icon: Clock },
  in_production: { color: 'text-blue-600', bg: 'bg-blue-100/80', icon: Package },
  shipped: { color: 'text-purple-600', bg: 'bg-purple-100/80', icon: Truck },
  delivered: { color: 'text-green-600', bg: 'bg-green-100/80', icon: CheckCircle },
  cancelled: { color: 'text-red-600', bg: 'bg-red-100/80', icon: AlertCircle },
};

const mockOrders = [
  {
    id: 'ORD-001',
    status: 'pending',
    orderDate: '2024-01-10',
    total: 45.50,
    items: [
      {
        name: 'Custom Mug',
        image: 'https://images.pexels.com/photos/6347707/pexels-photo-6347707.jpeg?auto=compress&cs=tinysrgb&w=200',
        quantity: 1,
        price: 15.50,
      }
    ],
    chatId: 'CHAT-001',
    estimatedDelivery: '2024-01-25',
  },
  {
    id: 'ORD-002',
    status: 'shipped',
    orderDate: '2024-01-15',
    total: 125.00,
    items: [
      {
        name: 'Custom Hoodie',
        image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=200',
        quantity: 1,
        price: 50.00,
      }
    ],
    chatId: 'CHAT-002',
    estimatedDelivery: '2024-01-18',
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

export const CustomerDashboard = () => {
  const { state: authState } = useAuth();
  const currentUser = authState.user;
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(mockOrders as Order[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Guest',
    bio: '',
    location: '',
  });

  // Initialize profile data when user is loaded
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || 'Guest',
        bio: (currentUser as any)?.profile?.bio || '',
        location: (currentUser as any)?.profile?.location || '',
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/orders?userId=${currentUser?.id}`);
        // const data = await response.json();
        // setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const handleNewOrder = () => {
    navigate('/create');
  };

  const handleChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      // In a real app, you would call your API to update the profile
      // await updateProfile({
      //   name: profileData.name,
      //   profile: {
      //     ...currentUser?.profile,
      //     bio: profileData.bio,
      //     location: profileData.location,
      //   }
      // });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
        <p className="mt-4 text-lg font-medium text-gray-900">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

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
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome back, {currentUser?.name || 'User'}!
                </h2>
                <p className="text-gray-600">Here's an overview of your account</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <Card className="p-1 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="flex space-x-1">
              <button
                key="orders"
                onClick={() => setActiveTab('orders')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Orders</span>
              </button>
              <button
                key="wishlist"
                onClick={() => setActiveTab('wishlist')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'wishlist'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Heart className="h-4 w-4" />
                <span>Wishlist</span>
              </button>
              <button
                key="profile"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
              <Button onClick={handleNewOrder}>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </div>

            <div className="space-y-4">
              {orders.map((order, index) => {
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
                          <p className="text-sm text-gray-600">Ordered on {new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status as keyof typeof statusConfig].bg} ${statusConfig[order.status as keyof typeof statusConfig].color} backdrop-blur-sm`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="capitalize">{order.status.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <h4 className="font-medium text-gray-900 mb-3">Items ({order.items.length})</h4>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
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

                          {order.estimatedDelivery && (
                            <div>
                              <p className="text-sm text-gray-600">Estimated Delivery</p>
                              <p className="font-medium text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1" glassmorphic onClick={() => handleViewOrder(order)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1" 
                              onClick={() => handleChat(order.chatId)}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Chat
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm" className="flex-1">
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
                {/* User info section with proper null checks */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentUser?.name || 'User'}
                    </h3>
                    <p className="text-gray-600">
                      {(currentUser as any)?.email || 'No email provided'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        (currentUser as any)?.isVerified 
                          ? 'bg-green-100/80 text-green-700' 
                          : 'bg-yellow-100/80 text-yellow-700'
                      } backdrop-blur-sm`}>
                        {(currentUser as any)?.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100/80 text-blue-700 capitalize backdrop-blur-sm">
                        {(currentUser as any)?.role || 'customer'}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        name="bio"
                        rows={3}
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                        {profileData.bio || 'No bio added yet.'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <div className="flex items-center space-x-2 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.location || 'Location not specified'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                      <div className="flex items-center space-x-2 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {currentUser?.createdAt 
                            ? new Date((currentUser as any).createdAt).toLocaleDateString() 
                            : 'N/A'}
                        </span>
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