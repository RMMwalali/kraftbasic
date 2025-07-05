import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Palette, Package, ArrowRight, TrendingUp, Star, Info, Check } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { ProductCategories } from '../components/home/ProductCategories';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { FeaturedCreators } from '../components/home/FeaturedCreators';
import { Testimonials } from '../components/home/Testimonials';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockProducts, mockDesigns } from '../data/mockData';

interface Product {
  id: string;
  name: string;
  basePrice: number;
  rating?: number;
  images: string[];
}

interface Design {
  id: string;
  name: string;
  price: number;
  rating?: number;
  imageUrl: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showExamples, setShowExamples] = useState<{[key: string]: boolean}>({});
  const [selectedType, setSelectedType] = useState<'product' | 'design' | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleDesignSelect = (designId: string) => {
    setSelectedDesigns(prev => {
      if (prev.includes(designId)) {
        return prev.filter(id => id !== designId);
      } else {
        return [...prev, designId];
      }
    });
  };

  const handleQuickStart = (type: 'product' | 'design') => {
    setSelectedType(type);
    navigate(`/create?type=${type}`);
  };

  const toggleExample = (key: string) => {
    setShowExamples(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContinueWithSelections = () => {
    if (selectedProducts.length > 0 && selectedDesigns.length > 0) {
      navigate('/flow/design-suit');
    } else if (selectedProducts.length > 0) {
      navigate('/flow/design-selection');
    } else if (selectedDesigns.length > 0) {
      navigate('/flow/product-selection');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Hero />
      
      {/* Quick Start Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
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
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                    Popular Products
                  </h4>
                  {selectedProducts.length > 0 && (
                    <span className="text-sm font-medium text-gray-600">
                      {selectedProducts.length} selected
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {mockProducts.slice(0, 4).map((product, index) => {
                    const isSelected = selectedProducts.includes(product.id);
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group w-full"
                        onClick={() => handleProductSelect(product.id)}
                      >
                        <Card 
                          className={`p-3 hover:shadow-lg transition-all group-hover:scale-105 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                          />
                          <h5 className="font-medium text-gray-900 text-sm truncate">{product.name}</h5>
                          <p className="text-xs text-gray-600">${product.basePrice}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 ml-1">{product.rating || '4.5'}</span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Trending Designs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    Trending Designs
                  </h4>
                  {selectedDesigns.length > 0 && (
                    <span className="text-sm font-medium text-gray-600">
                      {selectedDesigns.length} selected
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {mockDesigns.slice(0, 4).map((design, index) => {
                    const isSelected = selectedDesigns.includes(design.id);
                    return (
                      <motion.div
                        key={design.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group w-full"
                        onClick={() => handleDesignSelect(design.id)}
                      >
                        <Card 
                          className={`p-3 hover:shadow-lg transition-all group-hover:scale-105 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          <img
                            src={design.imageUrl}
                            alt={design.name}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                          />
                          <h5 className="font-medium text-gray-900 text-sm truncate">{design.name}</h5>
                          <p className="text-xs text-gray-600">${design.price}</p>
                        </Card>
                      </motion.div>
                    );
                  })}
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
};

export default Home;