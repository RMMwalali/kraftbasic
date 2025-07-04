import React from 'react';
import { motion } from 'framer-motion';
import { Search, Star, TrendingUp } from 'lucide-react';
import { Product } from '../../types';

interface SearchResultsProps {
  results: Product[];
  query: string;
  onClose: () => void;
}

export function SearchResults({ results, query, onClose }: SearchResultsProps) {
  const popularSearches = ['t-shirts', 'mugs', 'hoodies', 'custom design', 'stickers'];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Results Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50"
      >
        {query && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <Search className="h-4 w-4" />
              <span>Search results for "{query}"</span>
            </div>
            <p className="text-xs text-gray-500">{results.length} products found</p>
          </div>
        )}

        {results.length > 0 ? (
          <div className="p-2">
            {results.slice(0, 5).map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer"
                onClick={onClose}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{product.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-semibold text-primary-600">
                      ${product.basePrice}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {results.length > 5 && (
              <div className="p-3 text-center border-t border-gray-100">
                <button 
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  onClick={onClose}
                >
                  View all {results.length} results →
                </button>
              </div>
            )}
          </div>
        ) : query ? (
          <div className="p-6 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">No results found</h3>
            <p className="text-sm text-gray-500 mb-4">
              Try searching for something else or browse our categories
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded-full transition-colors"
                  onClick={onClose}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>Popular searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded-full transition-colors"
                  onClick={onClose}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}