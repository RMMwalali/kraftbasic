import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Type, 
  Palette, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move,
  Download,
  Share2,
  ShoppingCart,
  Heart,
  Eye,
  Layers,
  Settings,
  Image as ImageIcon,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  Wand2,
  Save,
  RefreshCw,
  Grid,
  Square,
  Circle,
  Triangle,
  Star,
  Hexagon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockProducts } from '../../data/mockData';
import { Product, Design } from '../../types';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  initialDesign?: Design | null;
}

interface CustomizationState {
  selectedProduct: Product | null;
  selectedDesign: Design | null;
  selectedColor: string;
  selectedSize: string;
  customText: string;
  textColor: string;
  textSize: number;
  textPosition: { x: number; y: number };
  uploadedImage: string | null;
  imagePosition: { x: number; y: number };
  imageScale: number;
  imageRotation: number;
  quantity: number;
  totalPrice: number;
}

const colors = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Navy', value: '#1E3A8A' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#059669' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Yellow', value: '#F59E0B' },
];

const textColors = [
  '#000000', '#FFFFFF', '#DC2626', '#059669', '#2563EB', '#7C3AED', '#F59E0B', '#EC4899'
];

const shapes = [
  { name: 'Square', icon: Square },
  { name: 'Circle', icon: Circle },
  { name: 'Triangle', icon: Triangle },
  { name: 'Star', icon: Star },
  { name: 'Hexagon', icon: Hexagon },
];

export function CustomizationModal({ 
  isOpen, 
  onClose, 
  initialProduct, 
  initialDesign 
}: CustomizationModalProps) {
  const { dispatch } = useApp();
  const { state: authState } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'product' | 'design' | 'text' | 'upload' | 'shapes'>('product');
  const [showPreview, setShowPreview] = useState(false);

  const [customization, setCustomization] = useState<CustomizationState>({
    selectedProduct: initialProduct || mockProducts[0],
    selectedDesign: initialDesign || null,
    selectedColor: initialProduct?.colors[0] || 'black',
    selectedSize: initialProduct?.sizes[0] || 'M',
    customText: '',
    textColor: '#000000',
    textSize: 24,
    textPosition: { x: 50, y: 50 },
    uploadedImage: null,
    imagePosition: { x: 50, y: 50 },
    imageScale: 1,
    imageRotation: 0,
    quantity: 1,
    totalPrice: initialProduct?.basePrice || initialDesign?.price || 0,
  });

  // Calculate total price
  const calculatedPrice = useMemo(() => {
    const basePrice = customization.selectedProduct?.basePrice || customization.selectedDesign?.price || 0;
    const textCost = customization.customText ? 5 : 0;
    const imageCost = customization.uploadedImage ? 10 : 0;
    const designCost = customization.selectedDesign ? customization.selectedDesign.price : 0;
    return (basePrice + textCost + imageCost + designCost) * customization.quantity;
  }, [customization]);

  const updateCustomization = useCallback((updates: Partial<CustomizationState>) => {
    setCustomization(prev => ({ ...prev, ...updates, totalPrice: calculatedPrice }));
  }, [calculatedPrice]);

  const handleProductSelect = useCallback((product: Product) => {
    updateCustomization({
      selectedProduct: product,
      selectedColor: product.colors[0],
      selectedSize: product.sizes[0],
    });
  }, [updateCustomization]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateCustomization({ uploadedImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  }, [updateCustomization]);

  const handleAddToCart = useCallback(() => {
    if (!customization.selectedProduct) return;

    const cartItem = {
      id: `cart-${Date.now()}`,
      productId: customization.selectedProduct.id,
      designId: customization.selectedDesign?.id,
      quantity: customization.quantity,
      size: customization.selectedSize,
      color: customization.selectedColor,
      customization: {
        text: customization.customText,
        textColor: customization.textColor,
        textSize: customization.textSize,
        textPosition: customization.textPosition,
        image: customization.uploadedImage || undefined,
        imagePosition: customization.imagePosition,
        imageScale: customization.imageScale,
        imageRotation: customization.imageRotation,
        designId: customization.selectedDesign?.id,
        isCustomDesign: !!customization.uploadedImage,
      },
      price: calculatedPrice / customization.quantity,
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'success',
        title: 'Added to Cart',
        message: `${customization.selectedProduct.name} has been added to your cart!`
      }
    });
    onClose();
  }, [customization, calculatedPrice, dispatch, onClose]);

  const tabs = [
    { id: 'product', label: 'Product', icon: ShoppingCart },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'shapes', label: 'Shapes', icon: Grid },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg">
                <Wand2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  Customize Your Product
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Design your perfect custom product
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100/80 rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row h-[calc(95vh-120px)] sm:h-[calc(90vh-120px)]">
            {/* Left Panel - Controls */}
            <div className="w-full lg:w-80 xl:w-96 border-r border-gray-200/50 bg-gray-50/50 overflow-y-auto">
              {/* Tabs */}
              <div className="p-3 sm:p-4 border-b border-gray-200/50">
                <div className="grid grid-cols-5 lg:grid-cols-1 gap-1 lg:gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center justify-center lg:justify-start space-x-0 lg:space-x-2 p-2 lg:p-3 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
                {/* Product Selection */}
                {activeTab === 'product' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Select Product</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {mockProducts.slice(0, 4).map((product) => (
                        <motion.button
                          key={product.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleProductSelect(product)}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                            customization.selectedProduct?.id === product.id
                              ? 'border-primary-600 bg-primary-50/80'
                              : 'border-gray-200 hover:border-gray-300 bg-white/50'
                          }`}
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-600">${product.basePrice}</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Color Selection */}
                    {customization.selectedProduct && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 text-sm">Color</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {colors.map((color) => (
                            <motion.button
                              key={color.value}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateCustomization({ selectedColor: color.value })}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                                customization.selectedColor === color.value
                                  ? 'border-primary-600 ring-2 ring-primary-200'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Selection */}
                    {customization.selectedProduct && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 text-sm">Size</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {customization.selectedProduct.sizes.map((size) => (
                            <motion.button
                              key={size}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateCustomization({ selectedSize: size })}
                              className={`p-2 rounded-lg border-2 font-medium transition-all text-sm ${
                                customization.selectedSize === size
                                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
                              }`}
                            >
                              {size}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Design Selection */}
                {activeTab === 'design' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Choose Design</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateCustomization({ selectedDesign: null })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          !customization.selectedDesign
                            ? 'border-primary-600 bg-primary-50/80'
                            : 'border-gray-200 hover:border-gray-300 bg-white/50'
                        }`}
                      >
                        <p className="font-medium text-gray-900 text-sm">No Design</p>
                        <p className="text-xs text-gray-600">Plain product</p>
                      </motion.button>
                      
                      {initialDesign && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateCustomization({ selectedDesign: initialDesign })}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                            customization.selectedDesign?.id === initialDesign.id
                              ? 'border-primary-600 bg-primary-50/80'
                              : 'border-gray-200 hover:border-gray-300 bg-white/50'
                          }`}
                        >
                          <img
                            src={initialDesign.imageUrl}
                            alt={initialDesign.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900 text-sm">{initialDesign.name}</p>
                            <p className="text-xs text-gray-600">+${initialDesign.price}</p>
                          </div>
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}

                {/* Text Customization */}
                {activeTab === 'text' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Add Text</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                        <input
                          type="text"
                          value={customization.customText}
                          onChange={(e) => updateCustomization({ customText: e.target.value })}
                          placeholder="Enter your text..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                        <div className="grid grid-cols-4 gap-2">
                          {textColors.map((color) => (
                            <motion.button
                              key={color}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateCustomization({ textColor: color })}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                customization.textColor === color
                                  ? 'border-primary-600 ring-2 ring-primary-200'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Text Size: {customization.textSize}px
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="48"
                          value={customization.textSize}
                          onChange={(e) => updateCustomization({ textSize: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Image */}
                {activeTab === 'upload' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Upload Image</h3>
                    
                    <div className="space-y-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors bg-white/50"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-900">Upload Image</p>
                          <p className="text-xs text-gray-600">PNG, JPG up to 10MB</p>
                        </div>
                      </motion.button>

                      {customization.uploadedImage && (
                        <div className="space-y-3">
                          <img
                            src={customization.uploadedImage}
                            alt="Uploaded"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Scale: {Math.round(customization.imageScale * 100)}%
                            </label>
                            <input
                              type="range"
                              min="0.5"
                              max="2"
                              step="0.1"
                              value={customization.imageScale}
                              onChange={(e) => updateCustomization({ imageScale: parseFloat(e.target.value) })}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Rotation: {customization.imageRotation}°
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={customization.imageRotation}
                              onChange={(e) => updateCustomization({ imageRotation: parseInt(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shapes */}
                {activeTab === 'shapes' && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Add Shapes</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {shapes.map((shape) => (
                        <motion.button
                          key={shape.name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center space-y-2 p-4 border border-gray-300 rounded-lg hover:border-primary-400 transition-colors bg-white/50"
                        >
                          <shape.icon className="h-8 w-8 text-gray-600" />
                          <span className="text-xs font-medium text-gray-900">{shape.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center Panel - Preview */}
            <div className="flex-1 bg-gray-100/50 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
              <div className="relative">
                {/* Product Preview */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-md w-full"
                >
                  <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-50">
                    {customization.selectedProduct && (
                      <img
                        src={customization.selectedProduct.images[0]}
                        alt={customization.selectedProduct.name}
                        className="w-full h-full object-cover"
                        style={{ 
                          filter: customization.selectedColor !== '#FFFFFF' ? 
                            `hue-rotate(${customization.selectedColor === '#000000' ? '0' : '180'}deg)` : 
                            'none' 
                        }}
                      />
                    )}

                    {/* Design Overlay */}
                    {customization.selectedDesign && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={customization.selectedDesign.imageUrl}
                          alt={customization.selectedDesign.name}
                          className="max-w-[60%] max-h-[60%] object-contain opacity-80"
                        />
                      </div>
                    )}

                    {/* Text Overlay */}
                    {customization.customText && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          left: `${customization.textPosition.x}%`,
                          top: `${customization.textPosition.y}%`,
                          transform: 'translate(-50%, -50%)',
                          color: customization.textColor,
                          fontSize: `${customization.textSize}px`,
                          fontWeight: 'bold',
                          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                        }}
                      >
                        {customization.customText}
                      </div>
                    )}

                    {/* Image Overlay */}
                    {customization.uploadedImage && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          left: `${customization.imagePosition.x}%`,
                          top: `${customization.imagePosition.y}%`,
                          transform: `translate(-50%, -50%) scale(${customization.imageScale}) rotate(${customization.imageRotation}deg)`,
                        }}
                      >
                        <img
                          src={customization.uploadedImage}
                          alt="Custom"
                          className="max-w-24 max-h-24 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {customization.selectedProduct?.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">
                      {customization.selectedColor} • {customization.selectedSize}
                    </p>
                  </div>
                </motion.div>

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all backdrop-blur-sm"
                  >
                    <ZoomIn className="h-5 w-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all backdrop-blur-sm"
                  >
                    <RotateCcw className="h-5 w-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Right Panel - Summary */}
            <div className="w-full lg:w-80 xl:w-96 border-l border-gray-200/50 bg-white/50 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Order Summary</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-medium">
                        ${customization.selectedProduct?.basePrice || customization.selectedDesign?.price || 0}
                      </span>
                    </div>
                    
                    {customization.selectedDesign && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Design</span>
                        <span className="font-medium">+${customization.selectedDesign.price}</span>
                      </div>
                    )}
                    
                    {customization.customText && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Custom Text</span>
                        <span className="font-medium">+$5</span>
                      </div>
                    )}
                    
                    {customization.uploadedImage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Custom Image</span>
                        <span className="font-medium">+$10</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="font-semibold text-gray-900">Subtotal</span>
                      <span className="font-bold text-gray-900">
                        ${(calculatedPrice / customization.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Quantity</h4>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateCustomization({ 
                        quantity: Math.max(1, customization.quantity - 1) 
                      })}
                      className="p-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </motion.button>
                    <span className="font-semibold text-lg w-12 text-center">
                      {customization.quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateCustomization({ 
                        quantity: customization.quantity + 1 
                      })}
                      className="p-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200/50">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${calculatedPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center space-x-2 text-sm sm:text-base py-3"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Add to Cart</span>
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="flex items-center justify-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center justify-center space-x-1">
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>High-quality printing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Fast shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>30-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}