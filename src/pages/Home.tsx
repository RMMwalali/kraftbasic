import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Palette, Package, ArrowRight, Sparkles, TrendingUp, Users, Star } from 'lucide-react';
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
  const [selectedType, setSelectedType] = useState<'product' | 'design' | null>(null);

  const handleProductSelect = (productId: string) => {
    navigate(`/create?product=${productId}`);
  };

  const handleDesignSelect = (designId: string) => {
    navigate(`/create?design=${designId}`);
  };

  const handleQuickStart = (type: 'product' | 'design') => {
    setSelectedType(type);
    navigate(`/create?type=${type}`);
  };

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Quick Start Section - Mobile Optimized */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            >
              Start Creating Your Custom Product
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Choose how you want to start - pick a product first or browse designs
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Start with Product */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 md:p-8 h-full bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Start with Product</h3>
                  <p className="text-gray-600 mb-6">
                    Choose your product first, then find the perfect design to customize it
                  </p>
                  <Button 
                    onClick={() => handleQuickStart('product')}
                    className="w-full group-hover:scale-105 transition-transform"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Browse Products
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Start with Design */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 md:p-8 h-full bg-white/80 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Start with Design</h3>
                  <p className="text-gray-600 mb-6">
                    Browse amazing designs first, then choose the perfect product to print on
                  </p>
                  <Button 
                    onClick={() => handleQuickStart('design')}
                    className="w-full group-hover:scale-105 transition-transform"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Browse Designs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Featured Quick Picks */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 text-center mb-8">Quick Picks</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Popular Products */}
              <div>
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
                </div>
              </div>

              {/* Trending Designs */}
              <div>
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
                </div>
              </div>
            </div>
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