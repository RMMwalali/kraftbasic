import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Award, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockCreators } from '../data/mockData';

export function Creators() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Featured Creators</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing designs from our talented community of artists and designers
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockCreators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8">
                <div className="flex items-start space-x-6">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{creator.name}</h3>
                      <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="text-gray-600 mb-4">{creator.bio}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="h-4 w-4 text-primary-600 mr-1" />
                          <span className="font-semibold text-gray-900">{creator.followers.toLocaleString()}</span>
                        </div>
                        <span className="text-sm text-gray-600">Followers</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          <span className="font-semibold text-gray-900">{creator.totalSales.toLocaleString()}</span>
                        </div>
                        <span className="text-sm text-gray-600">Sales</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <span className="font-semibold text-gray-900">{creator.rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                        </div>
                        <span className="text-sm text-gray-600">Rating</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button size="sm">Follow</Button>
                      <Button variant="outline" size="sm">View Designs</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}