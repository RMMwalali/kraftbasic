import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Edit3, 
  CheckCircle, 
  Package,
  Palette,
  MapPin,
  Layers,
  Type,
  MessageCircle,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function Summary() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();

  const { userFlow } = state;
  const selectedProduct = userFlow.selectedProduct;
  const selectedDesign = userFlow.selectedDesign;
  const designInstructions = userFlow.designInstructions;

  const handleBack = () => {
    navigate('/flow/design-suit');
  };

  const handleEdit = (section: 'product' | 'design' | 'instructions') => {
    switch (section) {
      case 'product':
        navigate('/flow/product-selection');
        break;
      case 'design':
        navigate('/flow/design-selection');
        break;
      case 'instructions':
        navigate('/flow/design-suit');
        break;
    }
  };

  const handleSendToDesigner = () => {
    if (!selectedProduct || !selectedDesign || !designInstructions || !authState.user) {
      return;
    }

    // Create message thread
    const messageThread = {
      productId: selectedProduct.id,
      designId: selectedDesign.id,
      customerId: authState.user.id,
      message: `Design Request:

Product: ${selectedProduct.name}
Design: ${selectedDesign.name}
Placement: ${designInstructions.placement}
Size: ${designInstructions.size}
${designInstructions.colors.length > 0 ? `Colors: ${designInstructions.colors.join(', ')}` : ''}
${designInstructions.style ? `Style: ${designInstructions.style}` : ''}
${designInstructions.mood ? `Mood: ${designInstructions.mood}` : ''}

${designInstructions.customNotes ? `Special requests: ${designInstructions.customNotes}` : ''}`,
      instructions: designInstructions,
      status: 'pending' as const,
    };

    dispatch({ type: 'CREATE_MESSAGE_THREAD', payload: messageThread });

    // Add to cart with design instructions
    const cartItem = {
      id: `cart-${Date.now()}`,
      productId: selectedProduct.id,
      designId: selectedDesign.id,
      quantity: 1,
      size: 'M',
      color: 'default',
      customization: {
        designId: selectedDesign.id,
        instructions: JSON.stringify(designInstructions),
        messageThread: messageThread,
      },
      price: selectedProduct.basePrice + selectedDesign.price,
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'success',
        title: 'Sent to Designer',
        message: 'Your design request has been sent! A designer will start working on it.'
      }
    });

    // Navigate to cart/checkout
    navigate('/cart');
  };

  const totalPrice = (selectedProduct?.basePrice || 0) + (selectedDesign?.price || 0);

  const placementLabels: Record<string, string> = {
    'front': 'Front Center',
    'back': 'Back Center',
    'front-pocket': 'Front Pocket',
    'sleeve': 'Sleeve',
  };

  const sizeLabels: Record<string, string> = {
    'small': 'Small (3")',
    'medium': 'Medium (6")',
    'large': 'Large (9")',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Review & Send</h1>
              <p className="text-xs text-gray-600">Confirm your design request</p>
            </div>
            
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-6">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Ready to Send to Designer</h2>
              <div className="text-sm text-gray-600">Step 4 of 4</div>
            </div>
            
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">All requirements completed</span>
            </div>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="space-y-6">
          {/* Product Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Selected Product</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit('product')}
                  className="flex items-center space-x-1"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <img
                  src={selectedProduct?.images[0]}
                  alt={selectedProduct?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{selectedProduct?.name}</h4>
                  <p className="text-gray-600 text-sm">{selectedProduct?.description}</p>
                  <p className="text-lg font-bold text-gray-900">${selectedProduct?.basePrice}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Design Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Palette className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Selected Design</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit('design')}
                  className="flex items-center space-x-1"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <img
                  src={selectedDesign?.imageUrl}
                  alt={selectedDesign?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{selectedDesign?.name}</h4>
                  <p className="text-gray-600 text-sm">{selectedDesign?.description}</p>
                  <p className="text-lg font-bold text-gray-900">${selectedDesign?.price}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Design Instructions Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Design Instructions</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit('instructions')}
                  className="flex items-center space-x-1"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Placement</p>
                      <p className="text-gray-600">{placementLabels[designInstructions?.placement || '']}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Layers className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Size</p>
                      <p className="text-gray-600">{sizeLabels[designInstructions?.size || '']}</p>
                    </div>
                  </div>
                </div>

                {designInstructions?.colors && designInstructions.colors.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <Palette className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Color Preferences</p>
                      <p className="text-gray-600">{designInstructions.colors.join(', ')}</p>
                    </div>
                  </div>
                )}

                {designInstructions?.style && (
                  <div className="flex items-center space-x-3">
                    <Type className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Style</p>
                      <p className="text-gray-600">{designInstructions.style}</p>
                    </div>
                  </div>
                )}

                {designInstructions?.mood && (
                  <div className="flex items-center space-x-3">
                    <Type className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mood</p>
                      <p className="text-gray-600">{designInstructions.mood}</p>
                    </div>
                  </div>
                )}

                {designInstructions?.customNotes && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-2">Special Requests</p>
                    <p className="text-gray-600">{designInstructions.customNotes}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Total Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-full">
                    <DollarSign className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Total Price</h3>
                    <p className="text-gray-600 text-sm">Product + Design</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Final pricing after design review</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Next Steps Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200/50">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Your design request will be sent to our design team</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>A designer will review and start working on your custom product</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>You'll receive updates and can chat with the designer if needed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Once approved, your item will be produced and shipped</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Send to Designer Button */}
        <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:mt-8">
          <Card className="p-4 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Ready to send to designer</p>
                <p className="text-sm text-gray-600">Total: ${totalPrice.toFixed(2)}</p>
              </div>
              <Button 
                onClick={handleSendToDesigner}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500"
              >
                <Send className="h-4 w-4" />
                <span>Send to Designer & Checkout</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}