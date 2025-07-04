import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Bell, Check, Info, AlertCircle } from 'lucide-react';

interface NotificationToastProps {
  id: string;
  type: 'chat' | 'order' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const typeConfig = {
  chat: {
    icon: MessageCircle,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-50',
  },
  order: {
    icon: Bell,
    bgColor: 'bg-green-500',
    textColor: 'text-green-50',
  },
  success: {
    icon: Check,
    bgColor: 'bg-green-500',
    textColor: 'text-green-50',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-50',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-50',
  },
};

export function NotificationToast({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationToastProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      className={`${config.bgColor} ${config.textColor} rounded-lg shadow-lg p-4 max-w-sm w-full pointer-events-auto`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm opacity-90 mt-1">{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 hover:opacity-75 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}