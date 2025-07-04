import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Package, CheckCircle, Search, Filter, Grid, List, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { mockProducts } from '../data/mockData';
import { Product } from '../types';

export function ProductSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { userFlow } = state;
  const selectedProduct = userFlow.selectedProduct;
  const selectedDesign = userFlow.selectedDesign;

  const handleProductSelect = (product: Product) => {
    dispatch({ type: 'SELECT_PRODUCT', payload: product });
    
    // If design is already selected, go to design suit interface
    if (selectedDesign) {
      navigate('/flow/design-suit');
    } else {
      navigate('/flow/design-selection');
    }
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
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Select Product</h1>
              {selectedDesign && (
                <p className="text-xs text-gray-600">
                  Design: {selectedDesign.name}
                </p>
              )}
            </div>
            
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Progress Indicator */}
        <div className="mb-6">
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">
                {selectedDesign ? 'Choose a Product for Your Design' : 'Choose Your Product'}
              </h2>
              <div className="text-sm text-gray-600">
                Step {selectedDesign ? '2' : '1'} of 4
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg border-2 transition-all ${
                selectedProduct 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-center space-x-2">
                  {selectedProduct ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Package className="h-5 w-5 text-blue-500" />
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
                  : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center space-x-2">
                  {selectedDesign ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Package className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-900">
                    {selectedDesign ? selectedDesign.name : 'Next: Design'}
                  </span>
                </div>
                {selectedDesign && (
                  <p className="text-sm text-gray-600 mt-1">${selectedDesign.price}</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex space-x-3 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
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

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Warning if no design selected */}
        {!selectedDesign && (
          <div className="mb-6">
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-center space-x-2 text-amber-800">
                <Package className="h-5 w-5" />
                <p className="text-sm">
                  After selecting a product, you'll choose a design to complete your custom item.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Products Grid */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'space-y-4'
        }>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => handleProductSelect(product)}
              >
                <Card 
                  className={`overflow-hidden ${
                    selectedProduct?.id === product.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : ''
                  }`}
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
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${product.basePrice}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                                  </div>
                </Card>
              </div>
              </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Next Step Button */}
        {selectedProduct && !selectedDesign && (
          <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:mt-8">
            <Card className="p-4 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedProduct.name} selected</p>
                  <p className="text-sm text-gray-600">${selectedProduct.basePrice}</p>
                </div>
                <Button 
                  onClick={() => navigate('/flow/design-selection')}
                  className="flex items-center space-x-2"
                >
                  <span>Next: Choose Design</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}