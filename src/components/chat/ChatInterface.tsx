import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  X,
  Check,
  CheckCheck,
  Clock,
  Star,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'order-details' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: string;
  }[];
  orderDetails?: {
    orderId: string;
    productName: string;
    designName: string;
    quantity: number;
    price: number;
    specifications: {
      color: string;
      size: string;
      customText?: string;
      instructions?: string;
    };
    images: string[];
  };
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  designerInfo: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    rating: number;
    responseTime: string;
  };
  orderDetails?: {
    orderId: string;
    productName: string;
    designName: string;
    quantity: number;
    price: number;
    specifications: {
      color: string;
      size: string;
      customText?: string;
      instructions?: string;
    };
    images: string[];
  };
}

export function ChatInterface({ isOpen, onClose, orderId, designerInfo, orderDetails }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && orderDetails) {
      // Initialize chat with order details as first message
      const orderMessage: Message = {
        id: 'order-initial',
        senderId: 'system',
        senderName: 'System',
        senderAvatar: '',
        content: 'Order details for your custom design project',
        timestamp: new Date(),
        type: 'order-details',
        status: 'read',
        orderDetails: orderDetails
      };

      const welcomeMessage: Message = {
        id: 'welcome',
        senderId: designerInfo.id,
        senderName: designerInfo.name,
        senderAvatar: designerInfo.avatar,
        content: `Hi! I'm excited to work on your custom design project. I've received your order details and will start working on it right away. Feel free to ask any questions or share additional requirements!`,
        timestamp: new Date(Date.now() + 1000),
        type: 'text',
        status: 'read'
      };

      setMessages([orderMessage, welcomeMessage]);
    }
  }, [isOpen, orderDetails, designerInfo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    // Simulate designer typing and response
    setTimeout(() => {
      setIsTyping(true);
    }, 2000);

    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Thanks for the clarification! I'll incorporate that into the design.",
        "Great idea! Let me work on that and I'll share a preview soon.",
        "I understand. I'll make those adjustments right away.",
        "Perfect! I'll have an updated version ready for you to review.",
        "That's exactly what I needed to know. Working on it now!"
      ];
      
      const response: Message = {
        id: `response-${Date.now()}`,
        senderId: designerInfo.id,
        senderName: designerInfo.name,
        senderAvatar: designerInfo.avatar,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text',
        status: 'read'
      };

      setMessages(prev => [...prev, response]);
    }, 4000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const message: Message = {
      id: `file-${Date.now()}`,
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      content: `Shared a file: ${file.name}`,
      timestamp: new Date(),
      type: 'file',
      status: 'sending',
      attachments: [{
        type: 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      }]
    };

    setMessages(prev => [...prev, message]);
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={designerInfo.avatar}
                  alt={designerInfo.name}
                  className="w-10 h-10 rounded-full"
                />
                {designerInfo.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{designerInfo.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{designerInfo.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{designerInfo.isOnline ? 'Online' : `Responds in ${designerInfo.responseTime}`}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowOrderDetails(!showOrderDetails)}
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.senderId === 'user' ? 'order-2' : 'order-1'}`}>
                      {message.type === 'order-details' && message.orderDetails ? (
                        <Card className="p-4 bg-blue-50 border-blue-200">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <Info className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-900">Order Details</h4>
                              <p className="text-xs text-blue-700">#{message.orderDetails.orderId}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Product:</span>
                              <span className="font-medium text-blue-900">{message.orderDetails.productName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Design:</span>
                              <span className="font-medium text-blue-900">{message.orderDetails.designName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Quantity:</span>
                              <span className="font-medium text-blue-900">{message.orderDetails.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Color:</span>
                              <span className="font-medium text-blue-900">{message.orderDetails.specifications.color}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Size:</span>
                              <span className="font-medium text-blue-900">{message.orderDetails.specifications.size}</span>
                            </div>
                            {message.orderDetails.specifications.customText && (
                              <div>
                                <span className="text-blue-700">Custom Text:</span>
                                <p className="font-medium text-blue-900 italic">"{message.orderDetails.specifications.customText}"</p>
                              </div>
                            )}
                            {message.orderDetails.specifications.instructions && (
                              <div>
                                <span className="text-blue-700">Instructions:</span>
                                <p className="font-medium text-blue-900">{message.orderDetails.specifications.instructions}</p>
                              </div>
                            )}
                            <div className="pt-2 border-t border-blue-200 flex justify-between">
                              <span className="text-blue-700">Total:</span>
                              <span className="font-bold text-blue-900">${message.orderDetails.price}</span>
                            </div>
                          </div>

                          {message.orderDetails.images.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-blue-700 mb-2">Reference Images:</p>
                              <div className="flex space-x-2">
                                {message.orderDetails.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Reference ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded border border-blue-200"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </Card>
                      ) : (
                        <div className={`rounded-2xl px-4 py-2 ${
                          message.senderId === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {message.type === 'file' && message.attachments && (
                            <div className="mb-2">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg">
                                  <Paperclip className="h-4 w-4" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{attachment.name}</p>
                                    {attachment.size && (
                                      <p className="text-xs opacity-75">{attachment.size}</p>
                                    )}
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                        </div>
                      )}
                      
                      <div className={`flex items-center space-x-1 mt-1 ${
                        message.senderId === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        {message.senderId === 'user' && getStatusIcon(message.status)}
                      </div>
                    </div>

                    {message.senderId !== 'user' && message.senderId !== 'system' && (
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full order-1 mr-2"
                      />
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={designerInfo.avatar}
                        alt={designerInfo.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Button variant="ghost" size="sm" className="absolute right-1 top-1">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Details Sidebar */}
            <AnimatePresence>
              {showOrderDetails && orderDetails && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-l border-gray-200 bg-gray-50 overflow-y-auto"
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
                    
                    <Card className="p-4 mb-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">Order ID</span>
                          <p className="font-medium">#{orderDetails.orderId}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Product</span>
                          <p className="font-medium">{orderDetails.productName}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Design</span>
                          <p className="font-medium">{orderDetails.designName}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-sm text-gray-600">Color</span>
                            <p className="font-medium capitalize">{orderDetails.specifications.color}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Size</span>
                            <p className="font-medium">{orderDetails.specifications.size}</p>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600">Quantity</span>
                          <p className="font-medium">{orderDetails.quantity}</p>
                        </div>
                        
                        {orderDetails.specifications.customText && (
                          <div>
                            <span className="text-sm text-gray-600">Custom Text</span>
                            <p className="font-medium italic">"{orderDetails.specifications.customText}"</p>
                          </div>
                        )}
                        
                        {orderDetails.specifications.instructions && (
                          <div>
                            <span className="text-sm text-gray-600">Instructions</span>
                            <p className="font-medium">{orderDetails.specifications.instructions}</p>
                          </div>
                        )}
                        
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="text-lg font-bold text-primary-600">${orderDetails.price}</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {orderDetails.images.length > 0 && (
                      <Card className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Reference Images</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {orderDetails.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Reference ${index + 1}`}
                                className="w-full h-20 object-cover rounded border border-gray-200"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4 text-white" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}