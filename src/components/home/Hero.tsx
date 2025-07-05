import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Palette, Package } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="container-apple relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading with Fraunces Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <h1 className="fraunces-black text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 tracking-tight">
              Create Something
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                Beautiful
              </span>
            </h1>
            
            <p className="fraunces-regular text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Design custom products with our curated collection of artwork. 
              From concept to creation, your vision comes to life.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="px-6 py-3 flex items-center space-x-2">
              <Palette className="h-5 w-5 text-indigo-700" />
              <span className="fraunces-medium text-indigo-800">Premium Designs</span>
            </div>
            <div className="px-6 py-3 flex items-center space-x-2">
              <Package className="h-5 w-5 text-indigo-700" />
              <span className="fraunces-medium text-indigo-800">Quality Products</span>
            </div>
            <div className="px-6 py-3 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-700" />
              <span className="fraunces-medium text-indigo-800">Expert Designers</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => navigate('/flow/product-selection')}
              className="btn-primary px-8 py-4 text-lg fraunces-semibold flex items-center space-x-2 group"
            >
              <span>Start Creating</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={() => navigate('/designs')}
              className="btn-secondary px-8 py-4 text-lg fraunces-medium"
            >
              Browse Designs
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="fraunces-bold text-3xl md:text-4xl text-gray-900 mb-2">1000+</div>
              <div className="fraunces-regular text-gray-600">Designs</div>
            </div>
            <div className="text-center">
              <div className="fraunces-bold text-3xl md:text-4xl text-gray-900 mb-2">50+</div>
              <div className="fraunces-regular text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="fraunces-bold text-3xl md:text-4xl text-gray-900 mb-2">24/7</div>
              <div className="fraunces-regular text-gray-600">Support</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 opacity-60"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
          <Palette className="h-8 w-8 text-gray-600" />
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-32 right-16 opacity-60"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center">
          <Package className="h-6 w-6 text-gray-700" />
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -8, 0],
          x: [0, 5, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute bottom-20 left-1/4 opacity-60"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-gray-600" />
        </div>
      </motion.div>
    </section>
  );
}