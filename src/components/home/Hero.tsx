import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Play, Palette, Zap, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

const heroSlides = [
  {
    id: 1,
    title: "Design Your Dreams",
    subtitle: "Create custom products that tell your story",
    image: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Start Designing",
    ctaAction: "/design",
    accent: "Turn your ideas into reality",
    theme: "creative",
    stats: { designs: "50K+", creators: "2K+" }
  },
  {
    id: 2,
    title: "Trending Collections",
    subtitle: "Discover what's popular this season",
    image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Shop Trending",
    ctaAction: "/products?sort=popular",
    accent: "Join thousands of happy customers",
    theme: "trending",
    stats: { sales: "100K+", rating: "4.9★" }
  },
  {
    id: 3,
    title: "Creator Marketplace",
    subtitle: "Support independent artists and designers",
    image: "https://images.pexels.com/photos/6347707/pexels-photo-6347707.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Explore Designs",
    ctaAction: "/designs",
    accent: "Unique designs from talented creators",
    theme: "marketplace",
    stats: { earnings: "$2M+", artists: "1K+" }
  }
];

const floatingElements = [
  { icon: Palette, color: "text-pink-500", delay: 0 },
  { icon: Sparkles, color: "text-yellow-500", delay: 0.5 },
  { icon: Zap, color: "text-blue-500", delay: 1 },
  { icon: TrendingUp, color: "text-green-500", delay: 1.5 },
];

export function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Stable slide data reference
  const slides = useRef(heroSlides);
  const currentSlideData = slides.current[currentSlide];

  // Clear interval helper
  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start interval helper
  const startInterval = useCallback(() => {
    if (!mountedRef.current || !isPlaying) return;
    
    clearCurrentInterval();
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        setCurrentSlide((prev) => (prev + 1) % slides.current.length);
      }
    }, 5000);
  }, [isPlaying, clearCurrentInterval]);

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.current.length);
    if (isPlaying) {
      startInterval();
    }
  }, [isPlaying, startInterval]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.current.length) % slides.current.length);
    if (isPlaying) {
      startInterval();
    }
  }, [isPlaying, startInterval]);

  const handleSlideClick = useCallback((index: number) => {
    setCurrentSlide(index);
    if (isPlaying) {
      startInterval();
    }
  }, [isPlaying, startInterval]);

  // CTA handlers
  const handleCtaClick = useCallback(() => {
    navigate(currentSlideData.ctaAction);
  }, [navigate, currentSlideData.ctaAction]);

  const handleWatchDemo = useCallback(() => {
    navigate('/products');
  }, [navigate]);

  // Effect for auto-play
  useEffect(() => {
    if (isPlaying) {
      startInterval();
    } else {
      clearCurrentInterval();
    }

    return clearCurrentInterval;
  }, [isPlaying, startInterval, clearCurrentInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearCurrentInterval();
    };
  }, [clearCurrentInterval]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Mobile-First Layout */}
      <div className="lg:hidden">
        {/* Mobile Hero */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`mobile-slide-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen flex flex-col"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <img
                src={currentSlideData.image}
                alt={currentSlideData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-20">
              <div className="text-center text-white space-y-8">
                {/* Accent Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/30 shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                    <span className="text-sm font-medium text-white">{currentSlideData.accent}</span>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
                >
                  <span className="bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
                    {currentSlideData.title.split(' ')[0]}
                  </span>{' '}
                  <span className="text-white drop-shadow-lg">
                    {currentSlideData.title.split(' ').slice(1).join(' ')}
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-md mx-auto drop-shadow-md"
                >
                  {currentSlideData.subtitle}
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center space-x-8"
                >
                  {Object.entries(currentSlideData.stats).map(([key, value], index) => (
                    <div key={`stat-${key}`} className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                        className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg"
                      >
                        {value}
                      </motion.div>
                      <div className="text-sm text-white/80 capitalize">{key}</div>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col space-y-4 max-w-sm mx-auto"
                >
                  <Button 
                    size="lg" 
                    className="w-full text-lg py-4 bg-white/95 backdrop-blur-md text-primary-600 hover:bg-white font-semibold shadow-xl border border-white/20"
                    onClick={handleCtaClick}
                  >
                    {currentSlideData.cta}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full text-lg py-4 border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 shadow-lg"
                    onClick={handleWatchDemo}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Demo
                  </Button>
                </motion.div>

                {/* Live Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-sm mx-auto shadow-xl"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg" />
                    <p className="text-sm font-medium text-white/90">Live Preview:</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      C
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-white text-sm">"Christine's Custom Mug"</p>
                      <p className="text-xs text-white/80">Personalized just for you! ✨</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
              {slides.current.map((_, index) => (
                <button
                  key={`mobile-dot-${index}`}
                  onClick={() => handleSlideClick(index)}
                  className={`relative w-10 h-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/30 ${
                    index === currentSlide ? 'bg-white/90 shadow-lg' : 'bg-white/30'
                  }`}
                >
                  {index === currentSlide && isPlaying && (
                    <motion.div
                      key={`mobile-progress-${currentSlide}-${Date.now()}`}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute top-0 left-0 h-full bg-primary-400 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Side Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 z-20 border border-white/30 shadow-lg"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 z-20 border border-white/30 shadow-lg"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlayPause}
              className="absolute bottom-8 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 z-20 border border-white/30 shadow-lg"
            >
              {isPlaying ? (
                <div className="w-4 h-4 flex space-x-1">
                  <div className="w-1 h-full bg-white rounded" />
                  <div className="w-1 h-full bg-white rounded" />
                </div>
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop Layout (unchanged but enhanced with glassmorphism) */}
      <div className="hidden lg:block">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Elements */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={`floating-${index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: element.delay,
            }}
            className={`absolute ${element.color} z-10`}
            style={{
              left: `${20 + index * 20}%`,
              top: `${15 + index * 10}%`,
            }}
          >
            <element.icon className="h-8 w-8" />
          </motion.div>
        ))}

        <div className="relative h-[700px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desktop-slide-${currentSlide}`}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                  {/* Content */}
                  <div className="space-y-8 z-20 relative">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 border border-primary-200 shadow-lg">
                        <Sparkles className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-medium text-primary-700">{currentSlideData.accent}</span>
                      </div>
                      {currentSlideData.theme === 'trending' && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        >
                          HOT 🔥
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
                    >
                      <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {currentSlideData.title.split(' ')[0]}
                      </span>{' '}
                      <span className="relative">
                        {currentSlideData.title.split(' ').slice(1).join(' ')}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                          className="absolute bottom-2 left-0 h-1 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"
                        />
                      </span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg"
                    >
                      {currentSlideData.subtitle}
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex space-x-8"
                    >
                      {Object.entries(currentSlideData.stats).map(([key, value], index) => (
                        <div key={`stat-${key}`} className="text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                            className="text-2xl lg:text-3xl font-bold text-primary-600"
                          >
                            {value}
                          </motion.div>
                          <div className="text-sm text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <Button 
                        size="lg" 
                        className="text-lg px-8 py-4 group shadow-xl"
                        onClick={handleCtaClick}
                      >
                        {currentSlideData.cta}
                        <motion.span
                          className="ml-2 inline-block"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="text-lg px-8 py-4 group bg-white/80 backdrop-blur-md border-white/50 shadow-lg"
                        onClick={handleWatchDemo}
                      >
                        <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        Watch Demo
                      </Button>
                    </motion.div>

                    {/* Personalization Example */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg" />
                        <p className="text-sm font-medium text-gray-700">Live Preview:</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                          C
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">"Christine's Custom Mug"</p>
                          <p className="text-sm text-gray-600">Personalized just for you! ✨</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative"
                  >
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl transform perspective-1000">
                      <img
                        src={currentSlideData.image}
                        alt={currentSlideData.title}
                        className="w-full h-96 lg:h-[500px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      
                      {/* Overlay Content */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-xl border border-white/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">Premium Quality</p>
                              <p className="text-sm text-gray-600">Fast worldwide shipping</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4 text-primary-600" />
                              <span className="text-sm font-medium text-primary-600">2K+ reviews</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <motion.div
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -top-6 -right-6 bg-gradient-to-br from-accent-400 to-accent-600 text-white p-4 rounded-2xl shadow-xl backdrop-blur-md border border-white/20"
                    >
                      <Sparkles className="h-8 w-8" />
                    </motion.div>

                    <motion.div
                      animate={{ 
                        y: [0, 10, 0],
                        rotate: [0, -3, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      className="absolute -bottom-4 -left-4 bg-gradient-to-br from-secondary-400 to-secondary-600 text-white p-3 rounded-xl shadow-lg backdrop-blur-md border border-white/20"
                    >
                      <TrendingUp className="h-6 w-6" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md text-gray-800 p-3 rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-30 border border-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md text-gray-800 p-3 rounded-full shadow-xl transition-all duration-200 hover:scale-110 z-30 border border-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Desktop Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
            {slides.current.map((_, index) => (
              <button
                key={`desktop-dot-${index}`}
                onClick={() => handleSlideClick(index)}
                className={`relative w-12 h-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/30 shadow-lg ${
                  index === currentSlide ? 'bg-primary-600' : 'bg-white/50 hover:bg-white/80'
                }`}
              >
                {index === currentSlide && isPlaying && (
                  <motion.div
                    key={`desktop-progress-${currentSlide}-${Date.now()}`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="absolute top-0 left-0 h-full bg-accent-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Desktop Play/Pause */}
          <button
            onClick={togglePlayPause}
            className="absolute bottom-8 right-8 bg-white/90 hover:bg-white backdrop-blur-md text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-30 border border-white/20"
          >
            {isPlaying ? (
              <div className="w-4 h-4 flex space-x-1">
                <div className="w-1 h-full bg-gray-800 rounded" />
                <div className="w-1 h-full bg-gray-800 rounded" />
              </div>
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}