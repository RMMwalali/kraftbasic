import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Palette, CheckCircle, Search, Grid, List, Star, User } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { mockDesigns, mockCreators } from '../data/mockData';
import { Design } from '../types';

export function DesignSelection() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { userFlow } = state;
  const selectedProduct = userFlow.selectedProduct;
  const selectedDesign = userFlow.selectedDesign;

  const handleDesignSelect = (design: Design) => {
    dispatch({ type: 'SELECT_DESIGN', payload: design });
    
    // If product is already selected, go to design suit interface
    if (selectedProduct) {
      navigate('/flow/design-suit');
    } else {
      navigate('/flow/product-selection');
    }
  };

  const handleBack = () => {
    if (selectedProduct) {
      navigate('/flow/product-selection');
    } else {
      navigate('/');
    }
  };

  const filteredDesigns = mockDesigns.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || design.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(mockDesigns.flatMap(design => design.tags)));
  const tags = ['all', ...allTags.slice(0, 10)]; // Show first 10 tags + all

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
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Select Design</h1>
              {selectedProduct && (
                <p className="text-xs text-gray-600">
                  Product: {selectedProduct.name}
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
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">
                {selectedProduct ? 'Choose a Design for Your Product' : 'Choose Your Design'}
              </h2>
              <div className="text-sm text-gray-600">
                Step {selectedProduct ? '2' : '1'} of 4
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 rounded-lg border-2 transition-all ${
                selectedProduct 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center space-x-2">
                  {selectedProduct ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Palette className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-900">
                    {selectedProduct ? selectedProduct.name : 'Next: Product'}
                  </span>
                </div>
                {selectedProduct && (
                  <p className="text-sm text-gray-600 mt-1">${selectedProduct.basePrice}</p>
                )}
              </div>
              
              <div className={`p-3 rounded-lg border-2 transition-all ${
                selectedDesign 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-purple-500 bg-purple-50'
              }`}>
                <div className="flex items-center space-x-2">
                  {selectedDesign ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Palette className="h-5 w-5 text-purple-500" />
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

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex space-x-3 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search designs..."
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

          {/* Tag Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Warning if no product selected */}
        {!selectedProduct && (
          <div className="mb-6">
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-center space-x-2 text-amber-800">
                <Palette className="h-5 w-5" />
                <p className="text-sm">
                  After selecting a design, you'll choose a product to print it on.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Designs Grid */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'space-y-4'
        }>
          {filteredDesigns.map((design, index) => {
            const creator = mockCreators.find(c => c.id === design.creatorId);
            return (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => handleDesignSelect(design)}
                >
                  <Card 
                    className={`overflow-hidden ${
                      selectedDesign?.id === design.id 
                        ? 'ring-2 ring-purple-500 bg-purple-50' 
                        : ''
                    }`}
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
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{design.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-gray-900">${design.price}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{design.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {design.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {design.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{design.tags.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Next Step Button */}
        {selectedDesign && !selectedProduct && (
          <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:mt-8">
            <Card className="p-4 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedDesign.name} selected</p>
                  <p className="text-sm text-gray-600">${selectedDesign.price}</p>
                </div>
                <Button 
                  onClick={() => navigate('/flow/product-selection')}
                  className="flex items-center space-x-2"
                >
                  <span>Next: Choose Product</span>
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