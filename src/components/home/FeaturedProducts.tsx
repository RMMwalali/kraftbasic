import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { mockProducts } from '../../data/mockData';

export function FeaturedProducts() {
  const navigate = useNavigate();

  const handleCustomizeProduct = useCallback((productId: string) => {
    navigate(`/products?highlight=${productId}`);
  }, [navigate]);

  const handleViewAllProducts = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            Trending Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover our most popular customizable products
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {mockProducts.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group h-full flex flex-col">
                <div className="relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow-sm transition-all duration-200 hover:scale-110">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
                
                <div className="p-4 md:p-6 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl md:text-2xl font-bold text-gray-900">
                      ${product.basePrice}
                    </span>
                    <Button 
                      size="sm" 
                      className="flex items-center space-x-2"
                      onClick={() => handleCustomizeProduct(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Customize</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleViewAllProducts}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}