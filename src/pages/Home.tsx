import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Palette, Package, ArrowRight, TrendingUp, Star, Plus, Info, Check } from 'lucide-react';
=======
import { Palette, Package, ArrowRight, Sparkles, TrendingUp, Users, Star } from 'lucide-react';
>>>>>>> 3bd94caae1be217f5dd1eea76d1aa32826c7501f
import { Hero } from '../components/home/Hero';
import { ProductCategories } from '../components/home/ProductCategories';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { FeaturedCreators } from '../components/home/FeaturedCreators';
import { Testimonials } from '../components/home/Testimonials';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockProducts, mockDesigns } from '../data/mockData';

export function Home() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { dispatch } = useApp();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);
  const [showExamples, setShowExamples] = useState<{[key: string]: boolean}>({});

  const handleProductSelect = (product: any) => {
    setSelectedProducts(prev => {
      const isSelected = prev.includes(product.id);
      return isSelected 
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id];
    });
  };

  const handleDesignSelect = (design: any) => {
    setSelectedDesigns(prev => {
      const isSelected = prev.includes(design.id);
      return isSelected 
        ? prev.filter(id => id !== design.id)
        : [...prev, design.id];
    });
=======
  const [selectedType, setSelectedType] = useState<'product' | 'design' | null>(null);

  const handleProductSelect = (productId: string) => {
    navigate(`/create?product=${productId}`);
  };

  const handleDesignSelect = (designId: string) => {
    navigate(`/create?design=${designId}`);
>>>>>>> 3bd94caae1be217f5dd1eea76d1aa32826c7501f
  };

  const handleQuickStart = (type: 'product' | 'design') => {
    setSelectedType(type);
    navigate(`/create?type=${type}`);
  };

  const handleContinueWithSelections = () => {
    // Store multiple selections in context for later use
    if (selectedProducts.length > 0) {
      const firstProduct = mockProducts.find(p => p.id === selectedProducts[0]);
      if (firstProduct) {
        dispatch({ type: 'SELECT_PRODUCT', payload: firstProduct });
      }
    }
    if (selectedDesigns.length > 0) {
      const firstDesign = mockDesigns.find(d => d.id === selectedDesigns[0]);
      if (firstDesign) {
        dispatch({ type: 'SELECT_DESIGN', payload: firstDesign });
      }
    }
    
    if (selectedProducts.length > 0 && selectedDesigns.length > 0) {
      navigate('/flow/design-suit');
    } else if (selectedProducts.length > 0) {
      navigate('/flow/design-selection');
    } else if (selectedDesigns.length > 0) {
      navigate('/flow/product-selection');
    }
  };

  const toggleExample = (key: string) => {
    setShowExamples(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Hero />
      
      {/* Quick Start Section - Apple-Inspired */}
      <section className="py-16 md:py-24">
        <div className="container-apple">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-display-medium mb-6"
            >
              Start Creating Your Custom Product
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-body-large max-w-2xl mx-auto"
            >
              Choose how you want to start - pick products first or browse designs. 
              You can select multiple items to compare and customize.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Start with Product */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="quick-pick-card"
              onClick={() => handleQuickStart('product')}
            >
              <div className="info-icon" onClick={(e) => { e.stopPropagation(); toggleExample('product'); }}>
                <Info className="h-3 w-3" />
              </div>
              
              <div className="icon-container">
                <Package className="h-8 w-8 text-gray-600" />
              </div>
              
              <h3 className="text-heading-medium mb-3">Start with Product</h3>
              <p className="text-body-medium mb-6">
                Choose your product first, then find the perfect design to customize it
              </p>
              
              <div className="flex items-center justify-center text-body-small font-medium text-gray-800">
                <span>Browse Products</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>

              {showExamples.product && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 glass border-l-4 border-gray-800 text-left"
                >
                  <p className="text-body-small font-medium mb-2">Example:</p>
                  <p className="text-body-small">
                    Select a hoodie → Choose artwork → Customize placement (front, back, sleeves) → 
                    Add text if desired → Review and order
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Start with Design */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="quick-pick-card"
              onClick={() => handleQuickStart('design')}
            >
              <div className="info-icon" onClick={(e) => { e.stopPropagation(); toggleExample('design'); }}>
                <Info className="h-3 w-3" />
              </div>
              
              <div className="icon-container">
                <Palette className="h-8 w-8 text-gray-600" />
              </div>
              
              <h3 className="text-heading-medium mb-3">Start with Design</h3>
              <p className="text-body-medium mb-6">
                Browse amazing designs first, then choose the perfect product to print on
              </p>
              
              <div className="flex items-center justify-center text-body-small font-medium text-gray-800">
                <span>Browse Designs</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>

              {showExamples.design && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 glass border-l-4 border-gray-800 text-left"
                >
                  <p className="text-body-small font-medium mb-2">Example:</p>
                  <p className="text-body-small">
                    Pick a cool graphic → Select t-shirt → Choose front center placement → 
                    Add personalized text → Customize colors → Place order
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Multi-Selection Quick Picks */}
          <div className="mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-heading-large text-center mb-8"
            >
              Quick Picks - Select Multiple Items
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Popular Products */}
              <div>
<<<<<<< HEAD
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-heading-small text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 text-gray-600 mr-2" />
                    Popular Products
                  </h4>
                  {selectedProducts.length > 0 && (
                    <span className="text-body-small font-medium text-gray-600">
                      {selectedProducts.length} selected
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {mockProducts.slice(0, 4).map((product, index) => {
                    const isSelected = selectedProducts.includes(product.id);
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`multi-select-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <div className={`selection-indicator ${isSelected ? 'active' : ''}`}>
                            {isSelected ? <Check className="h-3 w-3" /> : selectedProducts.length + 1}
                          </div>
                        </div>
                        
                        <h5 className="text-label mb-1 line-clamp-1">{product.name}</h5>
                        <div className="flex items-center justify-between">
                          <p className="text-body-small text-gray-600">${product.basePrice}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-body-small text-gray-600">{product.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
=======
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  Popular Products
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {mockProducts.slice(0, 4).map((product, index) => (
                    <motion.button
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleProductSelect(product.id)}
                      className="group"
                    >
                      <Card className="p-3 hover:shadow-lg transition-all group-hover:scale-105">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <h5 className="font-medium text-gray-900 text-sm truncate">{product.name}</h5>
                        <p className="text-xs text-gray-600">${product.basePrice}</p>
                      </Card>
                    </motion.button>
                  ))}
>>>>>>> 3bd94caae1be217f5dd1eea76d1aa32826c7501f
                </div>
              </div>

              {/* Trending Designs */}
              <div>
<<<<<<< HEAD
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-heading-small text-gray-900 flex items-center">
                    <Star className="h-5 w-5 text-gray-600 mr-2" />
                    Trending Designs
                  </h4>
                  {selectedDesigns.length > 0 && (
                    <span className="text-body-small font-medium text-gray-600">
                      {selectedDesigns.length} selected
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {mockDesigns.slice(0, 4).map((design, index) => {
                    const isSelected = selectedDesigns.includes(design.id);
                    return (
                      <motion.div
                        key={design.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`multi-select-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleDesignSelect(design)}
                      >
                        <div className="relative">
                          <img
                            src={design.imageUrl}
                            alt={design.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <div className={`selection-indicator ${isSelected ? 'active' : ''}`}>
                            {isSelected ? <Check className="h-3 w-3" /> : selectedDesigns.length + 1}
                          </div>
                        </div>
                        
                        <h5 className="text-label mb-1 line-clamp-1">{design.name}</h5>
                        <div className="flex items-center justify-between">
                          <p className="text-body-small text-gray-600">${design.price}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-body-small text-gray-600">{design.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
=======
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  Trending Designs
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {mockDesigns.slice(0, 4).map((design, index) => (
                    <motion.button
                      key={design.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleDesignSelect(design.id)}
                      className="group"
                    >
                      <Card className="p-3 hover:shadow-lg transition-all group-hover:scale-105">
                        <img
                          src={design.imageUrl}
                          alt={design.name}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <h5 className="font-medium text-gray-900 text-sm truncate">{design.name}</h5>
                        <p className="text-xs text-gray-600">${design.price}</p>
                      </Card>
                    </motion.button>
                  ))}
>>>>>>> 3bd94caae1be217f5dd1eea76d1aa32826c7501f
                </div>
              </div>
            </div>
            
            {/* Continue Button */}
            {(selectedProducts.length > 0 || selectedDesigns.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-8"
              >
                <Button
                  onClick={handleContinueWithSelections}
                  className="btn-primary flex items-center space-x-2 px-8 py-4"
                >
                  <span>Continue with Selected Items</span>
                  <ArrowRight className="h-4 w-4" />
                  {(selectedProducts.length > 0 || selectedDesigns.length > 0) && (
                    <span className="bg-white text-black rounded-full px-2 py-1 text-xs ml-2">
                      {selectedProducts.length + selectedDesigns.length}
                    </span>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <ProductCategories />
      <FeaturedProducts />
      <FeaturedCreators />
      <Testimonials />
    </div>
  );
}