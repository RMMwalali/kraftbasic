import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingCart, 
  Search, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Eye,
  TrendingUp,
  Award,
  Users,
  Palette,
  Shirt,
  Coffee,
  Briefcase,
  Paintbrush,
  Package,
  Sticker,
  Image,
  Zap,
  Crown,
  Verified
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CustomizationModal } from '../components/customization/CustomizationModal';
import { useApp } from '../context/AppContext';
import { mockProducts, mockDesigns, mockCreators } from '../data/mockData';
import { Product, Design } from '../types';

type ViewMode = 'grid' | 'list';
type ContentType = 'products' | 'designs' | 'all';
type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';

interface FilterState {
  category: string[];
  priceRange: [number, number];
  rating: number;
  colors: string[];
  sizes: string[];
  creators: string[];
  tags: string[];
  productType: string[];
}

const productCategories = [
  { id: 'tshirts', name: 'T-Shirts', icon: Shirt, count: 156, description: 'Classic cotton tees' },
  { id: 'hoodies', name: 'Hoodies', icon: Package, count: 89, description: 'Cozy fleece hoodies' },
  { id: 'mugs', name: 'Mugs', icon: Coffee, count: 67, description: 'Ceramic coffee mugs' },
  { id: 'bags', name: 'Bags', icon: Briefcase, count: 45, description: 'Canvas tote bags' },
  { id: 'posters', name: 'Posters', icon: Image, count: 123, description: 'High-quality prints' },
  { id: 'stickers', name: 'Stickers', icon: Sticker, count: 234, description: 'Vinyl stickers' },
];

const designCategories = [
  { id: 'abstract', name: 'Abstract', icon: Palette, count: 89, description: 'Modern abstract art' },
  { id: 'nature', name: 'Nature', icon: Zap, count: 156, description: 'Natural landscapes' },
  { id: 'typography', name: 'Typography', icon: Package, count: 234, description: 'Text-based designs' },
  { id: 'vintage', name: 'Vintage', icon: Crown, count: 67, description: 'Retro style designs' },
  { id: 'minimalist', name: 'Minimalist', icon: Package, count: 123, description: 'Clean simple designs' },
  { id: 'geometric', name: 'Geometric', icon: Package, count: 78, description: 'Geometric patterns' },
];

const colors = ['black', 'white', 'navy', 'red', 'gray', 'blue', 'green', 'yellow', 'pink', 'purple'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const priceRanges = [
  { label: 'Under $20', min: 0, max: 20 },
  { label: '$20 - $40', min: 20, max: 40 },
  { label: '$40 - $60', min: 40, max: 60 },
  { label: '$60 - $100', min: 60, max: 100 },
  { label: 'Over $100', min: 100, max: 1000 },
];

export function Products() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [contentType, setContentType] = useState<ContentType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: [0, 200],
    rating: 0,
    colors: [],
    sizes: [],
    creators: [],
    tags: [],
    productType: [],
  });

  // Initialize from URL params only once on mount
  useEffect(() => {
    if (isInitialized) return;
    
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const highlight = searchParams.get('highlight');
    
    if (category) {
      setFilters(prev => ({ ...prev, category: [category] }));
    }
    
    if (type === 'designs') {
      setContentType('designs');
    } else if (type === 'products') {
      setContentType('products');
    }

    if (search) {
      setSearchQuery(search);
    }

    // If highlighting a specific product, open customization modal
    if (highlight) {
      const product = mockProducts.find(p => p.id === highlight);
      if (product) {
        setSelectedProduct(product);
        setSelectedDesign(null);
        setShowCustomizationModal(true);
      }
    }

    setIsInitialized(true);
  }, [searchParams, isInitialized]);

  // Static data - memoized to prevent recreation
  const allItems = useMemo(() => [
    ...mockProducts.map(product => ({
      ...product,
      type: 'product' as const,
      price: product.basePrice,
      creator: null,
      tags: [product.category],
    })),
    ...mockDesigns.map(design => ({
      ...design,
      type: 'design' as const,
      basePrice: design.price,
      images: [design.imageUrl],
      category: design.tags[0] || 'design',
      colors: ['custom'],
      sizes: ['custom'],
      isCustomizable: true,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      creator: mockCreators.find(c => c.id === design.creatorId),
    })),
  ], []);

  // Filtered items with stable dependencies
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Content type filter
      if (contentType === 'products' && item.type !== 'product') return false;
      if (contentType === 'designs' && item.type !== 'design') return false;

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(searchLower);
        const matchesDescription = item.description?.toLowerCase().includes(searchLower);
        const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        const matchesCreator = item.creator?.name.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesDescription && !matchesTags && !matchesCreator) {
          return false;
        }
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(item.category)) {
        return false;
      }

      // Price filter
      const price = item.type === 'product' ? item.basePrice : item.price;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && item.rating < filters.rating) {
        return false;
      }

      return true;
    });
  }, [allItems, contentType, searchQuery, filters]);

  // Sorted items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const priceA = a.type === 'product' ? a.basePrice : a.price;
      const priceB = b.type === 'product' ? b.basePrice : b.price;

      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
        default:
          return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
    });
  }, [filteredItems, sortBy]);

  // Current categories based on content type
  const currentCategories = useMemo(() => {
    return contentType === 'designs' ? designCategories : 
           contentType === 'products' ? productCategories : 
           [...productCategories, ...designCategories];
  }, [contentType]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    return filters.category.length + 
           filters.colors.length + 
           filters.sizes.length + 
           filters.creators.length + 
           filters.tags.length + 
           (filters.rating > 0 ? 1 : 0);
  }, [filters]);

  // Stable callbacks
  const handleCustomize = useCallback((item: any) => {
    if (item.type === 'product') {
      setSelectedProduct(item);
      setSelectedDesign(null);
    } else {
      setSelectedDesign(item);
      setSelectedProduct(null);
    }
    setShowCustomizationModal(true);
  }, []);

  const toggleFilter = useCallback((filterType: keyof FilterState, value: any) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        const currentArray = prev[filterType] as any[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        return { ...prev, [filterType]: newArray };
      }
      return prev;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: [],
      priceRange: [0, 200],
      rating: 0,
      colors: [],
      sizes: [],
      creators: [],
      tags: [],
      productType: [],
    });
    setSearchQuery('');
    setSearchParams({});
  }, [setSearchParams]);

  const handleCloseModal = useCallback(() => {
    setShowCustomizationModal(false);
    setSelectedProduct(null);
    setSelectedDesign(null);
    
    // Remove highlight parameter from URL
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('highlight');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleContentTypeChange = useCallback((type: ContentType) => {
    setContentType(type);
    // Clear category filters when switching content types
    setFilters(prev => ({ ...prev, category: [] }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {contentType === 'products' ? 'Products' : 
                 contentType === 'designs' ? 'Designs' : 'Products & Designs'}
              </h1>
              <p className="text-gray-600">
                {sortedItems.length} items found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Content Type Tabs */}
            <div className="flex bg-white rounded-lg p-1 border border-gray-200 mt-4 lg:mt-0">
              <button
                onClick={() => handleContentTypeChange('all')}
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  contentType === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleContentTypeChange('products')}
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  contentType === 'products' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => handleContentTypeChange('designs')}
                className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  contentType === 'designs' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Designs
              </button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products and designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 md:top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Sort */}
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-3 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base w-full md:w-auto"
                >
                  <option value="popular">Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 md:top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Filters */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative px-3 md:px-4 py-2 md:py-3"
                size="sm"
              >
                <SlidersHorizontal className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 md:p-3 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 md:p-3 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 md:gap-8">
          {/* Filters Sidebar - Desktop */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden lg:block"
              >
                <Card className="p-6 sticky top-8 max-h-[calc(100vh-120px)] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <div className="flex items-center space-x-2">
                      {activeFilterCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Clear All
                        </Button>
                      )}
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {currentCategories.map((category) => (
                          <label key={category.id} className="flex items-center group cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.category.includes(category.id)}
                              onChange={() => toggleFilter('category', category.id)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="ml-3 flex items-center space-x-2 flex-1">
                              <category.icon className="h-4 w-4 text-gray-500 group-hover:text-primary-600" />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">{category.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">({category.count})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                      <div className="space-y-2">
                        {priceRanges.map((range) => (
                          <label key={range.label} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="priceRange"
                              checked={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max}
                              onChange={() => setFilters(prev => ({ ...prev, priceRange: [range.min, range.max] }))}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-3 text-sm text-gray-700">{range.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                          <label key={rating} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="rating"
                              checked={filters.rating === rating}
                              onChange={() => setFilters(prev => ({ ...prev, rating }))}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <div className="ml-3 flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">& up</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {sortedItems.length === 0 ? (
              <Card className="p-8 md:p-12 text-center">
                <Search className="h-12 md:h-16 w-12 md:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
                  : 'space-y-4 md:space-y-6'
              }>
                {sortedItems.map((item, index) => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                  >
                    {viewMode === 'grid' ? (
                      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <div className="relative">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-48 md:h-64 object-cover transition-transform duration-300"
                          />
                          
                          {/* Action Buttons */}
                          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
                            >
                              <Heart className="h-4 w-4 text-gray-600" />
                            </motion.button>
                          </div>
                          
                          {/* Type Badge */}
                          <div className="absolute top-3 left-3">
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`px-2 md:px-3 py-1 text-xs font-bold rounded-full flex items-center space-x-1 ${
                                item.type === 'design' 
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              }`}
                            >
                              {item.type === 'design' ? (
                                <>
                                  <Paintbrush className="h-3 w-3" />
                                  <span className="hidden sm:inline">Design</span>
                                </>
                              ) : (
                                <>
                                  <Package className="h-3 w-3" />
                                  <span className="hidden sm:inline">Product</span>
                                </>
                              )}
                            </motion.span>
                          </div>

                          {/* Creator Badge for Designs */}
                          {item.type === 'design' && item.creator && (
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg p-2 flex items-center space-x-2 shadow-lg"
                            >
                              <img
                                src={item.creator.avatar}
                                alt={item.creator.name}
                                className="w-5 h-5 rounded-full"
                              />
                              <span className="text-xs font-medium text-gray-900 hidden sm:inline">
                                {item.creator.name}
                              </span>
                              <Award className="h-3 w-3 text-yellow-500" />
                            </motion.div>
                          )}
                        </div>
                        
                        <div className="p-4 md:p-6 flex-1 flex flex-col">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                            {item.description}
                          </p>
                          
                          <div className="flex items-center mb-4">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 md:h-4 w-3 md:w-4 ${
                                    i < Math.floor(item.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs md:text-sm text-gray-600 ml-2">
                              {item.rating} ({item.reviewCount})
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-lg md:text-2xl font-bold text-gray-900">
                              ${item.type === 'product' ? item.basePrice : item.price}
                            </span>
                            <Button 
                              size="sm" 
                              onClick={() => handleCustomize(item)}
                              className="flex items-center space-x-1 md:space-x-2 group text-xs md:text-sm px-2 md:px-4"
                            >
                              {item.type === 'design' ? (
                                <>
                                  <Paintbrush className="h-3 md:h-4 w-3 md:w-4 group-hover:rotate-12 transition-transform" />
                                  <span className="hidden sm:inline">Use</span>
                                </>
                              ) : (
                                <>
                                  <Palette className="h-3 md:h-4 w-3 md:w-4 group-hover:rotate-12 transition-transform" />
                                  <span className="hidden sm:inline">Customize</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card className="p-4 md:p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full sm:w-32 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                                <span className={`px-2 md:px-3 py-1 text-xs font-bold rounded-full flex items-center space-x-1 w-fit ${
                                  item.type === 'design' 
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                }`}>
                                  {item.type === 'design' ? (
                                    <>
                                      <Paintbrush className="h-3 w-3" />
                                      <span>Design</span>
                                    </>
                                  ) : (
                                    <>
                                      <Package className="h-3 w-3" />
                                      <span>Product</span>
                                    </>
                                  )}
                                </span>
                              </div>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-gray-100 rounded-full"
                              >
                                <Heart className="h-5 w-5 text-gray-600" />
                              </motion.button>
                            </div>
                            
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 mb-4">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(item.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">
                                  {item.rating} ({item.reviewCount} reviews)
                                </span>
                              </div>
                              
                              {item.type === 'design' && item.creator && (
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={item.creator.avatar}
                                    alt={item.creator.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span className="text-sm text-gray-600">by {item.creator.name}</span>
                                  <Award className="h-4 w-4 text-yellow-500" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xl md:text-2xl font-bold text-gray-900">
                                ${item.type === 'product' ? item.basePrice : item.price}
                              </span>
                              <Button onClick={() => handleCustomize(item)} className="group">
                                {item.type === 'design' ? (
                                  <>
                                    <Paintbrush className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                                    Use Design
                                  </>
                                ) : (
                                  <>
                                    <Palette className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                                    Customize
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                      <div className="space-y-3">
                        {currentCategories.slice(0, 8).map((category) => (
                          <label key={category.id} className="flex items-center group cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.category.includes(category.id)}
                              onChange={() => toggleFilter('category', category.id)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="ml-3 flex items-center space-x-3 flex-1">
                              <category.icon className="h-5 w-5 text-gray-500 group-hover:text-primary-600" />
                              <span className="text-gray-700 group-hover:text-gray-900">{category.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">({category.count})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                      <div className="space-y-3">
                        {priceRanges.map((range) => (
                          <label key={range.label} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="priceRange"
                              checked={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max}
                              onChange={() => setFilters(prev => ({ ...prev, priceRange: [range.min, range.max] }))}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-3 text-gray-700">{range.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Clear All Filters
                    </Button>
                    <Button onClick={() => setShowFilters(false)} className="w-full">
                      Apply Filters ({activeFilterCount})
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Customization Modal */}
      <CustomizationModal
        isOpen={showCustomizationModal}
        onClose={handleCloseModal}
        initialProduct={selectedProduct}
        initialDesign={selectedDesign}
      />
    </div>
  );
}