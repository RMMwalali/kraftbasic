import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trash2, Heart, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CheckoutModal } from '../checkout/CheckoutModal';
import { ChatInterface } from '../chat/ChatInterface';
import { useApp } from '../../context/AppContext';
import { mockProducts } from '../../data/mockData';

export function CartPage() {
  const { state, dispatch } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatOrderDetails, setChatOrderDetails] = useState<any>(null);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    } else {
      dispatch({ 
        type: 'UPDATE_CART_ITEM', 
        payload: { id: itemId, updates: { quantity: newQuantity } }
      });
    }
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const getProductDetails = (productId: string) => {
    return mockProducts.find(p => p.id === productId);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setAppliedPromo('SAVE10');
      setPromoCode('');
    }
  };

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromo === 'SAVE10' ? subtotal * 0.1 : 0;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (orderId: string, orderDetails: any) => {
    setChatOrderDetails(orderDetails);
    setShowCheckout(false);
    setShowChat(true);
  };

  const orderDetails = {
    items: state.cart.map(item => {
      const product = getProductDetails(item.productId);
      return {
        name: product?.name || 'Custom Product',
        productName: product?.name || 'Custom Product',
        designName: item.customization?.designId ? 'Custom Design' : 'No Design',
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price * item.quantity,
        image: product?.images[0],
        customization: item.customization,
        images: product?.images || []
      };
    }),
    subtotal,
    shipping,
    tax,
    total
  };

  const designerInfo = {
    id: 'designer-1',
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    isOnline: true,
    rating: 4.8,
    responseTime: '2 hours'
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button size="lg">Start Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {state.cart.map((item, index) => {
              const product = getProductDetails(item.productId);
              if (!product) return null;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full md:w-32 h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <p className="text-gray-600 mb-3">{product.description}</p>

                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Color:</span>
                            <div 
                              className="w-6 h-6 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium capitalize">{item.color}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Size:</span>
                            <span className="text-sm font-medium">{item.size}</span>
                          </div>
                        </div>

                        {item.customization?.text && (
                          <div className="bg-primary-50 rounded-lg p-3 mb-4">
                            <span className="text-sm text-primary-700 font-medium">Custom Text:</span>
                            <p className="text-primary-900 italic">"{item.customization.text}"</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-500">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
                          <button className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors">
                            <Heart className="h-4 w-4 mr-1" />
                            Save for Later
                          </button>
                          <button className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Edit Design
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            {/* Recommended Products */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">You might also like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <p className="text-sm font-medium text-gray-900 mt-2">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.basePrice}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({state.cart.length} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button variant="outline" onClick={applyPromoCode}>
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Try "SAVE10" for 10% off</p>
              </div>

              {/* Free Shipping Progress */}
              {shipping > 0 && (
                <div className="bg-primary-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-primary-700">Add ${(50 - subtotal).toFixed(2)} for free shipping</span>
                    <span className="text-primary-600 font-medium">${subtotal.toFixed(2)}/$50</span>
                  </div>
                  <div className="w-full bg-primary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <Button className="w-full mb-4" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>

              {/* Security Features */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="h-4 w-4 text-purple-500" />
                  <span>100% satisfaction guarantee</span>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6">
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
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onPaymentSuccess={handlePaymentSuccess}
        orderDetails={orderDetails}
      />

      {/* Chat Interface */}
      <ChatInterface
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        designerInfo={designerInfo}
        orderDetails={chatOrderDetails}
      />
    </div>
  );
}