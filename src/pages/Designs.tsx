import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  Eye, 
  Download, 
  Share2, 
  Filter,
  Grid,
  List,
  Search,
  Award,
  TrendingUp,
  Users,
  Paintbrush,
  ChevronDown
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CustomizationModal } from '../components/customization/CustomizationModal';
import { mockDesigns, mockCreators } from '../data/mockData';

type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';

export function Designs() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<any>(null);

  const categories = ['all', 'nature', 'abstract', 'typography', 'vintage', 'minimalist'];

  const filteredDesigns = mockDesigns.filter(design => {
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         design.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || design.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return b.sales - a.sales;
    }
  });

  const handleDesignClick = (design: any) => {
    setSelectedDesign(design);
    setShowCustomizationModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Design Marketplace
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Discover unique designs from talented creators around the world
            </motion.p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
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

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-2 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600">
            {sortedDesigns.length} designs found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Designs Grid */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
        }>
          {sortedDesigns.map((design, index) => {
            const creator = mockCreators.find(c => c.id === design.creatorId);
            
            return (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {viewMode === 'grid' ? (
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative" onClick={() => handleDesignClick(design)}>
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={design.imageUrl}
                        alt={design.name}
                        className="w-full h-64 object-cover transition-transform duration-300"
                      />
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle preview
                            }}
                          >
                            <Eye className="h-5 w-5 text-gray-700" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle like
                            }}
                          >
                            <Heart className="h-5 w-5 text-gray-700" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Design Badge */}
                      <div className="absolute top-4 left-4">
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center space-x-1"
                        >
                          <Paintbrush className="h-3 w-3" />
                          <span>Design</span>
                        </motion.span>
                      </div>

                      {/* Creator Info */}
                      {creator && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-2 flex items-center space-x-2 shadow-lg"
                        >
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-xs font-medium text-gray-900">
                            {creator.name}
                          </span>
                          <Award className="h-3 w-3 text-yellow-500" />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {design.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {design.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(design.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{design.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{design.sales} sales</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          ${design.price}
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => handleDesignClick(design)}
                          className="flex items-center space-x-2 group"
                        >
                          <Paintbrush className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                          <span>Use Design</span>
                        </Button>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {design.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex space-x-6" onClick={() => handleDesignClick(design)}>
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={design.imageUrl}
                        alt={design.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{design.name}</h3>
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center space-x-1 w-fit">
                              <Paintbrush className="h-3 w-3" />
                              <span>Design</span>
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
                        
                        <p className="text-gray-600 mb-4">{design.description}</p>
                        
                        <div className="flex items-center space-x-6 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(design.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">
                              {design.rating} • {design.sales} sales
                            </span>
                          </div>
                          
                          {creator && (
                            <div className="flex items-center space-x-2">
                              <img
                                src={creator.avatar}
                                alt={creator.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-gray-600">by {creator.name}</span>
                              <Award className="h-4 w-4 text-yellow-500" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            ${design.price}
                          </span>
                          <Button onClick={() => handleDesignClick(design)} className="group">
                            <Paintbrush className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                            Use Design
                          </Button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-4">
                          {design.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {sortedDesigns.length === 0 && (
          <Card className="p-12 text-center">
            <Paintbrush className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      {/* Customization Modal */}
      <CustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        initialDesign={selectedDesign}
      />
    </div>
  );
}