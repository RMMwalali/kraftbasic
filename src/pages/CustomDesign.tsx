import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Upload, Type, Layers, Download, Share } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CustomizationModal } from '../components/customization/CustomizationModal';

export function CustomDesign() {
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  const handleGetStarted = () => {
    setShowCustomizationModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Custom Design Studio</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create your own unique designs with our powerful design tools
          </p>
        </div>

        {/* Design Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Upload className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Upload Image</h3>
            <p className="text-sm text-gray-600">Add your own images and photos</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Type className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Add Text</h3>
            <p className="text-sm text-gray-600">Customize with fonts and colors</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Palette className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Color Tools</h3>
            <p className="text-sm text-gray-600">Pick perfect color combinations</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Layers className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Layers</h3>
            <p className="text-sm text-gray-600">Organize your design elements</p>
          </Card>
        </div>

        {/* Design Canvas */}
        <Card className="p-8 mb-8">
          <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Design Canvas</h3>
              <p className="text-gray-500">Start creating your custom design here</p>
              <Button className="mt-4" onClick={handleGetStarted}>Get Started</Button>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Save Design
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleGetStarted}>Start Designing</Button>
        </div>
      </div>

      {/* Customization Modal */}
      <CustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
      />
    </div>
  );
}