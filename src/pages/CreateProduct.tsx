import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Package, 
  Palette, 
  MessageCircle, 
  CheckCircle,
  AlertCircle,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Grid,
  List,
  Search,
  Filter,
  X,
  Send,
  Image as ImageIcon,
  Type,
  MapPin,
  Layers,
  RotateCcw,
  Zap
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { mockProducts, mockDesigns, mockCreators } from '../data/mockData';
import { Product, Design } from '../types';

type Step = 'selection' | 'design-suit' | 'summary';
type SelectionMode = 'product' | 'design';

interface DesignInstructions {
  placement: string;
  size: string;
  colors: string[];
  customNotes: string;
  style: string;
  mood: string;
}

export function CreateProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dispatch } = useApp();
  
  const [currentStep, setCurrentStep] = useState<Step>('selection');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('product');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [designInstructions, setDesignInstructions] = useState<DesignInstructions>({
    placement: '',
    size: '',
    colors: [],
    customNotes: '',
    style: '',
    mood: ''
  });

  // Initialize from URL params
  useEffect(() => {
    const productId = searchParams.get('product');
    const designId = searchParams.get('design');
    const type = searchParams.get('type');

    if (productId) {
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setSelectionMode('design');
      }
    }

    if (designId) {
      const design = mockDesigns.find(d => d.id === designId);
      if (design) {
        setSelectedDesign(design);
        setSelectionMode('product');
      }
    }

    if (type === 'product') {
      setSelectionMode('product');
    } else if (type === 'design') {
      setSelectionMode('design');
    }
  }, [searchParams]);

  // Check if both are selected to proceed
  useEffect(() => {
    if (selectedProduct && selectedDesign && currentStep === 'selection') {
      setCurrentStep('design-suit');
    }
  }, [selectedProduct, selectedDesign, currentStep]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    if (selectedDesign) {
      setCurrentStep('design-suit');
    } else {
      setSelectionMode('design');
    }
  };

  const handleDesignSelect = (design: Design) => {
    setSelectedDesign(design);
    if (selectedProduct) {
      setCurrentStep('design-suit');
    } else {
      setSelectionMode('product');
    }
  };

  const handleInstructionChange = (field: keyof DesignInstructions, value: any) => {
    setDesignInstructions(prev => ({ ...prev, [field]: value }));
  };

  const handleProceedToSummary = () => {
    if (designInstructions.placement && designInstructions.size) {
      setCurrentStep('summary');
    }
  };

  const handleSendToDesigner = () => {
    // Create message thread
    const messageThread = {
      productId: selectedProduct?.id,
      designId: selectedDesign?.id,
      message: `Design Request:
        
Product: ${selectedProduct?.name}
Design: ${selectedDesign?.name}
Placement: ${designInstructions.placement}
Size: ${designInstructions.size}
Colors: ${designInstructions.colors.join(', ')}
Style: ${designInstructions.style}
Mood: ${designInstructions.mood}

Custom Notes: ${designInstructions.customNotes}`,
      timestamp: new Date().toISOString()
    };

    // Add to cart with design instructions
    const cartItem = {
      id: `cart-${Date.now()}`,
      productId: selectedProduct!.id,
      designId: selectedDesign!.id,
      quantity: 1,
      size: 'M',
      color: designInstructions.colors[0] || 'black',
      customization: {
        designId: selectedDesign!.id,
        instructions: JSON.stringify(designInstructions),
        messageThread: messageThread
      },
      price: selectedProduct!.basePrice + selectedDesign!.price,
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'success',
        title: 'Sent to Designer',
        message: 'Your design request has been sent! Proceeding to checkout.'
      }
    });

    // Navigate to checkout
    navigate('/cart');
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDesigns = mockDesigns.filter(design =>
    design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const placementOptions = [
    { id: 'front', label: 'Front Center', icon: '👕' },
    { id: 'back', label: 'Back Center', icon: '🔄' },
    { id: 'front-pocket', label: 'Front Pocket', icon: '📱' },
    { id: 'sleeve', label: 'Sleeve', icon: '💪' },
    { id: 'all-over', label: 'All Over', icon: '🌈' },
  ];

  const sizeOptions = [
    { id: 'small', label: 'Small (3")', description: 'Subtle accent' },
    { id: 'medium', label: 'Medium (6")', description: 'Standard size' },
    { id: 'large', label: 'Large (9")', description: 'Bold statement' },
    { id: 'extra-large', label: 'Extra Large (12")', description: 'Maximum impact' },
  ];

  const colorOptions = [
    { id: 'black', label: 'Black', value: '#000000' },
    { id: 'white', label: 'White', value: '#FFFFFF' },
    { id: 'red', label: 'Red', value: '#DC2626' },
    { id: 'blue', label: 'Blue', value: '#2563EB' },
    { id: 'green', label: 'Green', value: '#059669' },
    { id: 'yellow', label: 'Yellow', value: '#F59E0B' },
    { id: 'purple', label: 'Purple', value: '#7C3AED' },
    { id: 'pink', label: 'Pink', value: '#EC4899' },
  ];

  const styleOptions = [
    { id: 'minimalist', label: 'Minimalist', icon: '⚪' },
    { id: 'bold', label: 'Bold & Vibrant', icon: '🔥' },
    { id: 'vintage', label: 'Vintage', icon: '📻' },
    { id: 'modern', label: 'Modern', icon: '🔮' },
    { id: 'artistic', label: 'Artistic', icon: '🎨' },
    { id: 'geometric', label: 'Geometric', icon: '🔷' },
  ];

  const moodOptions = [
    { id: 'fun', label: 'Fun & Playful', emoji: '😄' },
    { id: 'serious', label: 'Serious & Professional', emoji: '💼' },
    { id: 'edgy', label: 'Edgy & Cool', emoji: '😎' },
    { id: 'elegant', label: 'Elegant & Classy', emoji: '✨' },
    { id: 'casual', label: 'Casual & Relaxed', emoji: '😌' },
    { id: 'energetic', label: 'Energetic & Dynamic', emoji: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Create Product</h1>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className={`w-2 h-2 rounded-full ${selectedProduct ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Product</span>
                <div className={`w-2 h-2 rounded-full ${selectedDesign ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Design</span>
                <div className={`w-2 h-2 rounded-full ${currentStep === 'design-suit' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <span>Customize</span>
              </div>
            </div>
            
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Selection Step */}
      {currentStep === 'selection' && (
        <div className="container mx-auto px-4 py-6">
          {/* Progress Indicator */}
          <div className="mb-6">
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">
                  {!selectedProduct && !selectedDesign ? 'Choose Your Starting Point' :
                   selectedProduct && !selectedDesign ? 'Now Select a Design' :
                   !selectedProduct && selectedDesign ? 'Now Select a Product' :
                   'Ready to Customize!'}
                </h2>
                <div className="text-sm text-gray-600">
                  {selectedProduct && selectedDesign ? '2/2' : 
                   selectedProduct || selectedDesign ? '1/2' : '0/2'} Complete
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg border-2 transition-all ${
                  selectedProduct 
                    ? 'border-green-500 bg-green-50' 
                    : selectionMode === 'product' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center space-x-2">
                    {selectedProduct ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Package className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-900">
                      {selectedProduct ? selectedProduct.name : 'Select Product'}
                    </span>
                  </div>
                  {selectedProduct && (
                    <p className="text-sm text-gray-600 mt-1">${selectedProduct.basePrice}</p>
                  )}
                </div>
                
                <div className={`p-3 rounded-lg border-2 transition-all ${
                  selectedDesign 
                    ? 'border-green-500 bg-green-50' 
                    : selectionMode === 'design' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center space-x-2">
                    {selectedDesign ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Palette className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-900">
                      {selectedDesign ? selectedDesign.name : 'Select Design'}
                    </span>
                  </div>
                  {selectedDesign && (
                    <p className="text-sm text-gray-600 mt-1">${selectedDesign.price}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Mode Toggle */}
          {!selectedProduct || !selectedDesign ? (
            <div className="mb-6">
              <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setSelectionMode('product')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all ${
                    selectionMode === 'product'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                  {selectedProduct && <CheckCircle className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setSelectionMode('design')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all ${
                    selectionMode === 'design'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  <span>Designs</span>
                  {selectedDesign && <CheckCircle className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : null}

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex space-x-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Search ${selectionMode}s...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-3"
              >
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Content Grid */}
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'space-y-4'
          }>
            {selectionMode === 'product' ? (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                      selectedProduct?.id === product.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={`w-full ${viewMode === 'grid' ? 'h-32 md:h-40' : 'h-24'} object-cover`}
                      />
                      {selectedProduct?.id === product.id && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Product
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">${product.basePrice}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              filteredDesigns.map((design, index) => {
                const creator = mockCreators.find(c => c.id === design.creatorId);
                return (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                        selectedDesign?.id === design.id 
                          ? 'ring-2 ring-purple-500 bg-purple-50' 
                          : 'hover:scale-105'
                      }`}
                      onClick={() => handleDesignSelect(design)}
                    >
                      <div className="relative">
                        <img
                          src={design.imageUrl}
                          alt={design.name}
                          className={`w-full ${viewMode === 'grid' ? 'h-32 md:h-40' : 'h-24'} object-cover`}
                        />
                        {selectedDesign?.id === design.id && (
                          <div className="absolute top-2 right-2 bg-purple-500 text-white p-1 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Design
                        </div>
                        {creator && (
                          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-1 flex items-center space-x-1">
                            <img
                              src={creator.avatar}
                              alt={creator.name}
                              className="w-4 h-4 rounded-full"
                            />
                            <span className="text-xs font-medium text-gray-900">{creator.name}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{design.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">${design.price}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{design.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Empty State */}
          {((selectionMode === 'product' && filteredProducts.length === 0) ||
            (selectionMode === 'design' && filteredDesigns.length === 0)) && (
            <Card className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                {selectionMode === 'product' ? <Package className="h-12 w-12 mx-auto" /> : <Palette className="h-12 w-12 mx-auto" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectionMode}s found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </Card>
          )}
        </div>
      )}

      {/* Design Suit Interface */}
      {currentStep === 'design-suit' && selectedProduct && selectedDesign && (
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-gray-900">Product & Design Selected</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="flex items-center space-x-2">
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-8 h-8 object-cover rounded" />
                <span className="text-sm text-gray-700">{selectedProduct.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src={selectedDesign.imageUrl} alt={selectedDesign.name} className="w-8 h-8 object-cover rounded" />
                <span className="text-sm text-gray-700">{selectedDesign.name}</span>
              </div>
            </div>
          </Card>

          {/* Chat-Style Form */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Design Assistant</h3>
                  <p className="text-sm text-gray-600">Let's customize your product!</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">
                  Great choices! Now let's describe how you'd like your <strong>{selectedProduct.name}</strong> designed with the <strong>{selectedDesign.name}</strong> artwork.
                </p>
              </div>

              {/* Placement */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Where would you like the design placed?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {placementOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleInstructionChange('placement', option.id)}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        designInstructions.placement === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{option.icon}</div>
                      <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What size should the design be?
                </label>
                <div className="space-y-2">
                  {sizeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleInstructionChange('size', option.id)}
                      className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                        designInstructions.size === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Any specific color preferences? (Optional)
                </label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        const newColors = designInstructions.colors.includes(color.id)
                          ? designInstructions.colors.filter(c => c !== color.id)
                          : [...designInstructions.colors, color.id];
                        handleInstructionChange('colors', newColors);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        designInstructions.colors.includes(color.id)
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What style are you going for? (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {styleOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleInstructionChange('style', option.id)}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        designInstructions.style === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{option.icon}</div>
                      <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What mood should the design convey? (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {moodOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleInstructionChange('mood', option.id)}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        designInstructions.mood === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{option.emoji}</span>
                        <span className="font-medium text-gray-900 text-sm">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Any additional notes or special requests?
                </label>
                <textarea
                  value={designInstructions.customNotes}
                  onChange={(e) => handleInstructionChange('customNotes', e.target.value)}
                  placeholder="Tell us anything else about how you want your product designed..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Validation */}
              {(!designInstructions.placement || !designInstructions.size) && (
                <Card className="p-4 bg-yellow-50 border-yellow-200 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Please select placement and size to continue
                    </p>
                  </div>
                </Card>
              )}

              {/* Continue Button */}
              <Button
                onClick={handleProceedToSummary}
                disabled={!designInstructions.placement || !designInstructions.size}
                className="w-full"
                size="lg"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Review & Send to Designer
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* Summary Step */}
      {currentStep === 'summary' && selectedProduct && selectedDesign && (
        <div className="container mx-auto px-4 py-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Design Request</h2>
            
            {/* Product & Design Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">${selectedProduct.basePrice}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img src={selectedDesign.imageUrl} alt={selectedDesign.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedDesign.name}</h3>
                  <p className="text-sm text-gray-600">${selectedDesign.price}</p>
                </div>
              </div>
            </div>

            {/* Design Instructions Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Design Instructions</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Placement:</strong> {placementOptions.find(p => p.id === designInstructions.placement)?.label}</div>
                <div><strong>Size:</strong> {sizeOptions.find(s => s.id === designInstructions.size)?.label}</div>
                {designInstructions.colors.length > 0 && (
                  <div><strong>Colors:</strong> {designInstructions.colors.join(', ')}</div>
                )}
                {designInstructions.style && (
                  <div><strong>Style:</strong> {styleOptions.find(s => s.id === designInstructions.style)?.label}</div>
                )}
                {designInstructions.mood && (
                  <div><strong>Mood:</strong> {moodOptions.find(m => m.id === designInstructions.mood)?.label}</div>
                )}
                {designInstructions.customNotes && (
                  <div><strong>Notes:</strong> {designInstructions.customNotes}</div>
                )}
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Price</span>
                <span className="text-2xl font-bold text-green-600">
                  ${(selectedProduct.basePrice + selectedDesign.price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSendToDesigner}
                className="w-full"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Designer & Proceed to Checkout
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setCurrentStep('design-suit')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Edit Instructions
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Sticky Bottom Action (Mobile) */}
      {currentStep === 'selection' && selectedProduct && selectedDesign && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
          <Button
            onClick={() => setCurrentStep('design-suit')}
            className="w-full"
            size="lg"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Continue to Design
          </Button>
        </div>
      )}
    </div>
  );
}