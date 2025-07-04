import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Globe, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About PrintCraft</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're passionate about helping creators and customers bring their ideas to life through high-quality custom products.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center">
            <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">50K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </Card>
          
          <Card className="p-6 text-center">
            <Award className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1K+</div>
            <div className="text-gray-600">Active Creators</div>
          </Card>
          
          <Card className="p-6 text-center">
            <Globe className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">100+</div>
            <div className="text-gray-600">Countries</div>
          </Card>
          
          <Card className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.9</div>
            <div className="text-gray-600">Rating</div>
          </Card>
        </div>

        {/* Mission */}
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            To democratize creativity by providing an accessible platform where anyone can design, create, and sell custom products. 
            We believe everyone has a unique story to tell, and we're here to help you tell it through beautiful, high-quality products.
          </p>
        </Card>
      </div>
    </div>
  );
}