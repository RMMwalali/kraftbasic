import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';

const categories = [
  { id: 'tshirts', name: 'T-Shirts', icon: '👕', productCount: 156 },
  { id: 'hoodies', name: 'Hoodies', icon: '🧥', productCount: 89 },
  { id: 'mugs', name: 'Mugs', icon: '☕', productCount: 67 },
  { id: 'bags', name: 'Bags', icon: '👜', productCount: 45 },
  { id: 'posters', name: 'Posters', icon: '🖼️', productCount: 123 },
  { id: 'stickers', name: 'Stickers', icon: '🏷️', productCount: 234 },
];

export function ProductCategories() {
  const navigate = useNavigate();

  const handleCategoryClick = useCallback((categoryId: string) => {
    navigate(`/products?category=${categoryId}&type=products`);
  }, [navigate]);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Find the perfect product for your custom design
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-4 md:p-6 text-center cursor-pointer group hover:shadow-lg transition-all duration-300"
                onClick={() => handleCategoryClick(category.id)}
              >
                <motion.div 
                  className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-200"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {category.icon}
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  {category.productCount} products
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}