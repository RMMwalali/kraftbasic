import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Package, CheckCircle, Search, Grid, List, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { mockProducts } from '../data/mockData';
import { Product } from '../types';
import { ProductCustomizationModal } from '../components/customize/ProductCustomizationModal';

export function ProductSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToCustomize, setProductToCustomize] = useState<Product | null>(null);

  const { userFlow } = state;
  const selectedProduct = userFlow.selectedProduct;
  const selectedDesign = userFlow.selectedDesign;

  const handleProductSelect = (product: Product) => {
    setProductToCustomize(product);
    setIsModalOpen(true);
  };

  const handleCustomizationComplete = (design: any) => {
    if (productToCustomize) {
      dispatch({ type: 'SELECT_PRODUCT', payload: productToCustomize });
      dispatch({ type: 'ADD_DESIGN_DETAILS', payload: design });
      navigate('/design-suit');
    }
    setIsModalOpen(false);
    setProductToCustomize(null);
  };

  const handleBack = () => {
    if (selectedDesign) {
      navigate('/flow/design-selection');
    } else {
      navigate('/');
    }
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 't-shirts', 'hoodies', 'mugs', 'stickers', 'bags'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {productToCustomize && (
        <ProductCustomizationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={productToCustomize}
          onComplete={handleCustomizationComplete}
        />
      )}

      {/* Mobile Header */}
      <motion.div 
        className="sticky-glass"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className="container-glass">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <div className="text-center">
              <h1 className="text-heading-medium text-gray-900">Select Product</h1>
              {selectedDesign && (
                <p className="text-body-small text-gray-600">
                  Design: {selectedDesign.name}
                </p>
              )}
            </div>
            
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </motion.div>

      <div className="container-glass py-8">
        {/* Progress Indicator */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" size="md" className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-small text-gray-900">
                {selectedDesign ? 'Choose a Product for Your Design' : 'Choose Your Product'}
              </h2>
              <div className="text-body-small text-gray-600">
                Step {selectedDesign ? '2' : '1'} of 4
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl transition-all duration-300 ${
                selectedProduct 
                  ? 'glass-strong border-emerald-400 bg-emerald-50/20' 
                  : 'glass border-blue-400 bg-blue-50/20'
              }`}>
                <div className="flex items-center space-x-3">
                  {selectedProduct ? (
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Package className="h-6 w-6 text-blue-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-label text-gray-900 block truncate">
                      {selectedProduct ? selectedProduct.name : 'Select Product'}
                    </span>
                    {selectedProduct && (
                      <p className="text-body-small text-gray-600">${selectedProduct.basePrice}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl transition-all duration-300 ${
                selectedDesign 
                  ? 'glass-strong border-emerald-400 bg-emerald-50/20' 
                  : 'glass border-gray-300 bg-gray-50/20'
              }`}>
                <div className="flex items-center space-x-3">
                  {selectedDesign ? (
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Package className="h-6 w-6 text-gray-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-label text-gray-900 block truncate">
                      {selectedDesign ? selectedDesign.name : 'Next: Design'}
                    </span>
                    {selectedDesign && (
                      <p className="text-body-small text-gray-600">${selectedDesign.price}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button
              variant="glass"
              size="md"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4"
            >
              {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
            </Button>
          </div>

          {/* Category Filter */}
          <div className="overflow-x-auto">
            <div className="flex space-x-3 pb-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full text-label transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'glass-strong text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg'
                      : 'glass text-gray-700 hover:glass-strong hover:text-gray-900'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Warning if no design selected */}
        {!selectedDesign && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass" className="border-amber-400 bg-amber-50/20">
              <div className="flex items-center space-x-3 text-amber-800">
                <Package className="h-6 w-6 flex-shrink-0" />
                <p className="text-body-medium">
                  After selecting a product, you'll choose a design to complete your custom item.
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div 
          className={`mb-8 ${
            viewMode === 'grid' 
              ? 'grid-responsive'
              : 'space-y-4'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card 
                variant="interactive"
                onClick={() => handleProductSelect(product)}
                className={`overflow-hidden ${
                  selectedProduct?.id === product.id 
                    ? 'ring-2 ring-indigo-500 bg-indigo-50/20' 
                    : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`w-full object-cover transition-transform duration-300 ${
                      viewMode === 'grid' ? 'h-48' : 'h-32'
                    }`}
                  />
                  {selectedProduct?.id === product.id && (
                    <div className="absolute top-3 right-3 glass-strong p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-body-small font-medium">
                    Product
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-heading-small text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-body-medium text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-heading-medium text-gray-900">${product.basePrice}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-body-small text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-heading-medium text-gray-900 mb-3">No products found</h3>
            <p className="text-body-large text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* Next Step Button */}
      {selectedProduct && !selectedDesign && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 p-4 glass-strong border-t border-white/20"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <div className="container-glass">
            <Card variant="glass" className="overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label text-gray-900">{selectedProduct.name} selected</p>
                  <p className="text-body-small text-gray-600">${selectedProduct.basePrice}</p>
                </div>
                <Button 
                  variant="glass"
                  onClick={() => navigate('/flow/design-selection')}
                  className="flex items-center space-x-2"
                >
                  <span>Next: Choose Design</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}