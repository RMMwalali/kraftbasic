import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Shield, 
  Truck, 
  MapPin,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Loader,
  FileText,
  Upload,
  Image as ImageIcon,
  Lock,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { OrderSuccessModal } from './OrderSuccessModal';
import { useApp } from '../../context/AppContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (orderId: string, orderDetails: any) => void;
  orderDetails: {
    items: any[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

type Step = 'shipping' | 'payment' | 'review' | 'processing';
type PaymentMethod = 'paypal' | 'mpesa' | 'card';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  method: PaymentMethod;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  mpesaPhone: string;
}

export function CheckoutModal({ isOpen, onClose, onPaymentSuccess, orderDetails }: CheckoutModalProps) {
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState<Step>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    mpesaPhone: ''
  });

  // Enhanced order details with design requirements
  const enhancedOrderDetails = useMemo(() => {
    const itemsWithDesignInfo = orderDetails.items.map(item => {
      const hasCustomDesign = item.customization?.isCustomDesign;
      const hasDesign = item.customization?.designId || hasCustomDesign;
      
      return {
        ...item,
        hasDesign,
        hasCustomDesign,
        designSubmission: hasCustomDesign ? {
          customText: item.customization?.text,
          customDesignUrl: item.customization?.customDesignUrl,
          instructions: item.customization?.instructions,
          specifications: {
            color: item.color,
            size: item.size,
            position: item.customization?.position,
            scale: item.customization?.scale,
            rotation: item.customization?.rotation,
          }
        } : null
      };
    });

    return {
      ...orderDetails,
      items: itemsWithDesignInfo
    };
  }, [orderDetails]);

  const updateShippingInfo = (updates: Partial<ShippingInfo>) => {
    setShippingInfo(prev => ({ ...prev, ...updates }));
  };

  const updatePaymentInfo = (updates: Partial<PaymentInfo>) => {
    setPaymentInfo(prev => ({ ...prev, ...updates }));
    setPaymentError('');
  };

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => shippingInfo[field as keyof ShippingInfo].trim() !== '');
  };

  const validatePayment = () => {
    if (paymentInfo.method === 'card') {
      return paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && paymentInfo.cardName;
    } else if (paymentInfo.method === 'mpesa') {
      return paymentInfo.mpesaPhone;
    }
    return true; // PayPal validation handled externally
  };

  const handlePayment = async () => {
    if (!validatePayment()) {
      setPaymentError('Please fill in all required payment information');
      return;
    }

    setCurrentStep('processing');
    setIsProcessing(true);
    setPaymentError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate order ID
      const orderId = `ORD-${Date.now()}`;
      const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();

      // Create comprehensive order details
      const orderData = {
        orderId,
        total: enhancedOrderDetails.total,
        estimatedDelivery,
        items: enhancedOrderDetails.items.map(item => ({
          name: item.name || 'Custom Product',
          productName: item.name || 'Custom Product',
          designName: item.customization?.designId ? 'Custom Design' : 'No Design',
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price * item.quantity,
          image: item.image,
          customization: item.customization,
        })),
        shippingAddress: shippingInfo,
        paymentMethod: paymentInfo.method,
        subtotal: enhancedOrderDetails.subtotal,
        shipping: enhancedOrderDetails.shipping,
        tax: enhancedOrderDetails.tax,
      };

      setCompletedOrder(orderData);

      // Add notification for successful payment
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'success',
          title: 'Payment Successful',
          message: `Order ${orderId} has been placed successfully!`
        }
      });

      // Show order success modal
      setShowOrderSuccess(true);
      
      // Call the success callback
      onPaymentSuccess(orderId, orderData);

    } catch (error) {
      setPaymentError('Payment failed. Please try again.');
      setCurrentStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOrderSuccessClose = () => {
    setShowOrderSuccess(false);
    onClose();
    // Clear cart after successful order
    dispatch({ type: 'CLEAR_CART' });
  };

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: FileText },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {currentStep === 'processing' ? 'Processing Payment' : 'Checkout'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    Complete your order securely
                  </p>
                </div>
              </div>
              
              {/* Step Indicator */}
              {currentStep !== 'processing' && (
                <div className="hidden md:flex items-center space-x-2">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStepIndex
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index < currentStepIndex ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-2 ${
                          index < currentStepIndex ? 'bg-primary-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100/80 rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row h-[calc(95vh-120px)] sm:h-[calc(90vh-120px)]">
              {/* Main Content */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                {/* Processing Step */}
                {currentStep === 'processing' && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-6"
                      />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Payment</h3>
                      <p className="text-gray-600">Please wait while we securely process your payment...</p>
                    </div>
                  </div>
                )}

                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Shipping Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="h-4 w-4 inline mr-1" />
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) => updateShippingInfo({ firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) => updateShippingInfo({ lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="h-4 w-4 inline mr-1" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => updateShippingInfo({ email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="h-4 w-4 inline mr-1" />
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) => updateShippingInfo({ phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Address *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.address}
                          onChange={(e) => updateShippingInfo({ address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) => updateShippingInfo({ city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          value={shippingInfo.state}
                          onChange={(e) => updateShippingInfo({ state: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) => updateShippingInfo({ zipCode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                        <select
                          value={shippingInfo.country}
                          onChange={(e) => updateShippingInfo({ country: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="KE">Kenya</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Information</h3>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-4">Select Payment Method</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => updatePaymentInfo({ method: 'card' })}
                          className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                            paymentInfo.method === 'card'
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <CreditCard className="h-8 w-8 text-gray-600" />
                          <span className="text-sm font-medium">Credit Card</span>
                        </button>
                        
                        <button
                          onClick={() => updatePaymentInfo({ method: 'paypal' })}
                          className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                            paymentInfo.method === 'paypal'
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                            PayPal
                          </div>
                          <span className="text-sm font-medium">PayPal</span>
                        </button>
                        
                        <button
                          onClick={() => updatePaymentInfo({ method: 'mpesa' })}
                          className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                            paymentInfo.method === 'mpesa'
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Smartphone className="h-8 w-8 text-green-600" />
                          <span className="text-sm font-medium">M-Pesa</span>
                        </button>
                      </div>
                    </div>

                    {/* Payment Details */}
                    {paymentInfo.method === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CreditCard className="h-4 w-4 inline mr-1" />
                            Card Number *
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => updatePaymentInfo({ cardNumber: e.target.value })}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => updatePaymentInfo({ expiryDate: e.target.value })}
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Lock className="h-4 w-4 inline mr-1" />
                              CVV *
                            </label>
                            <input
                              type="text"
                              value={paymentInfo.cvv}
                              onChange={(e) => updatePaymentInfo({ cvv: e.target.value })}
                              placeholder="123"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="h-4 w-4 inline mr-1" />
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            value={paymentInfo.cardName}
                            onChange={(e) => updatePaymentInfo({ cardName: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    {paymentInfo.method === 'mpesa' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Smartphone className="h-4 w-4 inline mr-1" />
                          M-Pesa Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={paymentInfo.mpesaPhone}
                          onChange={(e) => updatePaymentInfo({ mpesaPhone: e.target.value })}
                          placeholder="+254 700 000 000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          You will receive an M-Pesa prompt on your phone to complete the payment.
                        </p>
                      </div>
                    )}

                    {paymentInfo.method === 'paypal' && (
                      <Card className="p-4 bg-gray-50">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                            PP
                          </div>
                          <span className="font-medium">PayPal</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          You will be redirected to PayPal to complete your payment securely.
                        </p>
                      </Card>
                    )}

                    {paymentError && (
                      <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{paymentError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Review Step */}
                {currentStep === 'review' && (
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Review Your Order</h3>
                    
                    {/* Order Items */}
                    <Card className="p-6 mb-6">
                      <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                      <div className="space-y-4">
                        {enhancedOrderDetails.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={item.image || 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=100'}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-600">
                                {item.color} • {item.size} • Qty: {item.quantity}
                              </p>
                              {item.customization?.text && (
                                <p className="text-sm text-blue-600 italic">
                                  Custom Text: "{item.customization.text}"
                                </p>
                              )}
                            </div>
                            <span className="font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Shipping Address */}
                    <Card className="p-6 mb-6">
                      <h4 className="font-medium text-gray-900 mb-4">Shipping Address</h4>
                      <div className="text-sm text-gray-600">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                        <p className="mt-2">
                          <Mail className="h-4 w-4 inline mr-1" />
                          {shippingInfo.email}
                        </p>
                        <p>
                          <Phone className="h-4 w-4 inline mr-1" />
                          {shippingInfo.phone}
                        </p>
                      </div>
                    </Card>

                    {/* Payment Method */}
                    <Card className="p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Payment Method</h4>
                      <div className="flex items-center space-x-3">
                        {paymentInfo.method === 'card' && (
                          <>
                            <CreditCard className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-900">
                              **** **** **** {paymentInfo.cardNumber.slice(-4)}
                            </span>
                          </>
                        )}
                        {paymentInfo.method === 'paypal' && (
                          <>
                            <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                              PP
                            </div>
                            <span className="text-gray-900">PayPal</span>
                          </>
                        )}
                        {paymentInfo.method === 'mpesa' && (
                          <>
                            <Smartphone className="h-5 w-5 text-green-600" />
                            <span className="text-gray-900">M-Pesa ({paymentInfo.mpesaPhone})</span>
                          </>
                        )}
                      </div>
                    </Card>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="w-full lg:w-80 xl:w-96 border-l border-gray-200/50 bg-gray-50/50 p-4 sm:p-6 overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({enhancedOrderDetails.items.length} items)</span>
                    <span className="font-medium">${enhancedOrderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {enhancedOrderDetails.shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${enhancedOrderDetails.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${enhancedOrderDetails.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">${enhancedOrderDetails.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <Card className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">We Accept</h4>
                  <div className="flex space-x-2">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      MC
                    </div>
                    <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      AMEX
                    </div>
                    <div className="w-12 h-8 bg-yellow-400 rounded flex items-center justify-center text-black text-xs font-bold">
                      PP
                    </div>
                    <div className="w-12 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      MP
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Footer */}
            {currentStep !== 'processing' && (
              <div className="border-t border-gray-200/50 p-4 sm:p-6 bg-white/80 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    {currentStep !== 'shipping' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (currentStep === 'payment') setCurrentStep('shipping');
                          if (currentStep === 'review') setCurrentStep('payment');
                        }}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {currentStep === 'shipping' && (
                      <Button
                        onClick={() => setCurrentStep('payment')}
                        disabled={!validateShipping()}
                        className="flex items-center space-x-2"
                      >
                        <span>Continue to Payment</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {currentStep === 'payment' && (
                      <Button
                        onClick={() => setCurrentStep('review')}
                        disabled={!validatePayment()}
                        className="flex items-center space-x-2"
                      >
                        <span>Review Order</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {currentStep === 'review' && (
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex items-center space-x-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4" />
                            <span>Complete Order ${enhancedOrderDetails.total.toFixed(2)}</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Order Success Modal */}
      {showOrderSuccess && completedOrder && (
        <OrderSuccessModal
          isOpen={showOrderSuccess}
          onClose={handleOrderSuccessClose}
          orderDetails={completedOrder}
          onStartChat={() => {
            // This will be handled by the parent component
            handleOrderSuccessClose();
          }}
        />
      )}
    </>
  );
}