import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MessageCircle, 
  Download, 
  Home, 
  User,
  Calendar,
  MapPin,
  CreditCard,
  Star,
  Gift,
  Sparkles,
  ArrowRight,
  Clock,
  Bell
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    orderId: string;
    total: number;
    estimatedDelivery: string;
    items: any[];
    shippingAddress: any;
    paymentMethod: string;
  };
  onStartChat?: () => void;
}

export function OrderSuccessModal({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onStartChat 
}: OrderSuccessModalProps) {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown]);

  const handleGoToDashboard = () => {
    onClose();
    if (authState.user?.role === 'customer') {
      navigate('/dashboard/customer');
    } else if (authState.user?.role === 'designer') {
      navigate('/dashboard/designer');
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    onClose();
    navigate('/');
  };

  const handleStartChat = () => {
    onClose();
    if (onStartChat) {
      onStartChat();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  y: -100, 
                  x: Math.random() * window.innerWidth,
                  rotate: 0 
                }}
                animate={{ 
                  opacity: 0, 
                  y: window.innerHeight + 100, 
                  rotate: 360 
                }}
                transition={{ 
                  duration: 3, 
                  delay: Math.random() * 2,
                  ease: "easeOut" 
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20"
        >
          {/* Header */}
          <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-200/50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
            >
              Order Successful! 🎉
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg"
            >
              Thank you for your order! We're excited to create your custom product.
            </motion.p>
          </div>

          {/* Order Details */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Order Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{orderDetails.orderId}</h3>
                    <p className="text-sm text-gray-600">Total: ${orderDetails.total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Estimated Delivery:</span>
                  </div>
                  <span className="font-medium text-gray-900">{orderDetails.estimatedDelivery}</span>
                  
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Payment Method:</span>
                  </div>
                  <span className="font-medium text-gray-900">{orderDetails.paymentMethod}</span>
                </div>
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item, index) => (
                  <Card key={index} className="p-4 bg-white/80 border border-gray-200/50">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.color} • {item.size} • Qty: {item.quantity}
                        </p>
                        {item.customization?.text && (
                          <p className="text-sm text-blue-600 italic">
                            Custom Text: "{item.customization.text}"
                          </p>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">${item.price}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">What's Next?</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Design Review</p>
                      <p className="text-sm text-gray-600">Our designers will review your custom requirements</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Production</p>
                      <p className="text-sm text-gray-600">Your product will be carefully crafted and printed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Shipping</p>
                      <p className="text-sm text-gray-600">Fast and secure delivery to your address</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleStartChat}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat with Designer</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleGoToDashboard}
                  className="flex items-center justify-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>View Dashboard</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Receipt</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  className="flex items-center justify-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Button>
              </div>
            </motion.div>

            {/* Auto-redirect Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Redirecting to dashboard in {countdown} seconds</span>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200/50">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Stay Updated</p>
                    <p className="text-sm text-gray-600">
                      We'll send you email updates about your order progress
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}