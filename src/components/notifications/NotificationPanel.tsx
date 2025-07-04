import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Package, Heart, Star, Gift, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped!',
    message: 'Your custom t-shirt design is on its way. Track your package.',
    time: '2 hours ago',
    icon: Package,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    unread: true,
  },
  {
    id: '2',
    type: 'like',
    title: 'Design Liked',
    message: 'Sarah Chen liked your "Mountain Sunset" design.',
    time: '4 hours ago',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    unread: true,
  },
  {
    id: '3',
    type: 'review',
    title: 'New Review',
    message: 'You received a 5-star review on your custom mug design.',
    time: '1 day ago',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    unread: true,
  },
  {
    id: '4',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off your next order with code SAVE20.',
    time: '2 days ago',
    icon: Gift,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    unread: false,
  },
  {
    id: '5',
    type: 'trending',
    title: 'Trending Design',
    message: 'Your design is trending! It\'s been viewed 1,000+ times today.',
    time: '3 days ago',
    icon: TrendingUp,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    unread: false,
  },
];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Notification Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Bell className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {mockNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {mockNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notification.unread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex space-x-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${notification.bgColor} flex items-center justify-center`}>
                          <notification.icon className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 space-y-3">
              <Button variant="outline" className="w-full" size="sm">
                Mark All as Read
              </Button>
              <Button variant="ghost" className="w-full" size="sm">
                Notification Settings
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}