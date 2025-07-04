import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { mockCreators } from '../../data/mockData';

export function FeaturedCreators() {
  const navigate = useNavigate();

  const handleViewDesigns = (creatorId: string) => {
    navigate(`/designs?creator=${creatorId}`);
  };

  const handleJoinBattle = () => {
    navigate('/designs?featured=battle');
  };

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
            Featured Creators
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover amazing designs from our talented community
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {mockCreators.slice(0, 2).map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex items-start space-x-4 md:space-x-6">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-20 md:w-24 h-20 md:h-24 rounded-full object-cover shadow-lg ring-4 ring-white/50"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900">{creator.name}</h3>
                      <Award className="h-4 md:h-5 w-4 md:w-5 text-yellow-500" />
                    </div>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">{creator.bio}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="h-3 md:h-4 w-3 md:w-4 text-primary-600 mr-1" />
                          <span className="font-semibold text-gray-900 text-sm md:text-base">{creator.followers.toLocaleString()}</span>
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">Followers</span>
                      </div>
                      <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="h-3 md:h-4 w-3 md:w-4 text-green-600 mr-1" />
                          <span className="font-semibold text-gray-900 text-sm md:text-base">{creator.totalSales.toLocaleString()}</span>
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">Sales</span>
                      </div>
                      <div className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                        <div className="flex items-center justify-center mb-1">
                          <span className="font-semibold text-gray-900 text-sm md:text-base">{creator.rating}</span>
                          <span className="text-yellow-400 ml-1">★</span>
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">Rating</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button size="sm" className="flex-1 shadow-lg">Follow</Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 bg-white/80 backdrop-blur-sm border-white/50 shadow-lg"
                        onClick={() => handleViewDesigns(creator.id)}
                      >
                        View Designs
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Design Battle Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 md:p-8 text-white text-center relative overflow-hidden shadow-2xl"
        >
          {/* Glassmorphic overlay */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-bold mb-4">Design Battle of the Week</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Vote for your favorite design and help creators win amazing prizes. New battles every week!
            </p>
            <Button 
              variant="outline" 
              className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 shadow-xl"
              onClick={handleJoinBattle}
            >
              Join the Battle
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}