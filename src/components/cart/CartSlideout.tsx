import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { mockProducts } from '../../data/mockData';

interface CartSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSlideout({ isOpen, onClose }: CartSlideoutProps) {
  const { state, dispatch } = useApp();

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

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl z-50 flex flex-col border-l border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/80 backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Cart ({state.cart.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {state.cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some products to get started!</p>
                  <Button onClick={onClose} glassmorphic>Continue Shopping</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {state.cart.map((item) => {
                    const product = getProductDetails(item.productId);
                    if (!product) return null;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex space-x-4 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                          <p className="text-sm text-gray-500">
                            {item.color} • {item.size}
                          </p>
                          {item.customization?.text && (
                            <p className="text-sm text-primary-600 italic">
                              "{item.customization.text}"
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-white/50 rounded transition-colors backdrop-blur-sm"
                              >
                                <Minus className="h-4 w-4 text-gray-500" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-white/50 rounded transition-colors backdrop-blur-sm"
                              >
                                <Plus className="h-4 w-4 text-gray-500" />
                              </button>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors backdrop-blur-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.cart.length > 0 && (
              <div className="border-t border-white/20 p-6 space-y-4 bg-white/80 backdrop-blur-md">
                {/* Order Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <div className="bg-primary-50/80 backdrop-blur-sm rounded-lg p-3 border border-primary-200/50">
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

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg" glassmorphic>
                    Checkout • ${total.toFixed(2)}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={onClose} glassmorphic>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}