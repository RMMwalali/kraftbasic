import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  MessageCircle, 
  MapPin, 
  Palette,
  Layers,
  Type,
  CheckCircle,
  Sparkles,
  Heart
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import { DesignInstructions } from '../context/AppContext';

export function DesignSuitInterface() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [instructions, setInstructions] = useState<DesignInstructions>({
    placement: '',
    size: '',
    colors: [],
    customNotes: '',
    style: '',
    mood: '',
  });

  const { userFlow } = state;
  const selectedProduct = userFlow.selectedProduct;
  const selectedDesign = userFlow.selectedDesign;

  const handleBack = () => {
    navigate('/flow/design-selection');
  };

  const handleNext = () => {
    if (instructions.placement && instructions.size) {
      dispatch({ type: 'SET_DESIGN_INSTRUCTIONS', payload: instructions });
      navigate('/flow/summary');
    }
  };

  const placementOptions = [
    { id: 'front', label: 'Front Center', icon: '👕', description: 'Main front area' },
    { id: 'back', label: 'Back Center', icon: '🔄', description: 'Center of the back' },
    { id: 'front-pocket', label: 'Front Pocket', icon: '📱', description: 'Small chest area' },
    { id: 'sleeve', label: 'Sleeve', icon: '💪', description: 'Left or right sleeve' },
  ];

  const sizeOptions = [
    { id: 'small', label: 'Small (3")', description: 'Subtle accent' },
    { id: 'medium', label: 'Medium (6")', description: 'Standard size' },
    { id: 'large', label: 'Large (9")', description: 'Bold statement' },
  ];

  const isFormValid = instructions.placement && instructions.size;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg md:text-xl font-bold text-gray-900">Design Instructions</h1>
              <p className="text-xs text-gray-600">Tell us how you want it designed</p>
            </div>
            
            <div className="w-10" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Customize Your Design</h2>
              <div className="text-sm text-gray-600">Step 3 of 4</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border-2 border-green-500 bg-green-50">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-gray-900 text-sm">{selectedProduct?.name}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">${selectedProduct?.basePrice}</p>
              </div>
              
              <div className="p-3 rounded-lg border-2 border-green-500 bg-green-50">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-gray-900 text-sm">{selectedDesign?.name}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">${selectedDesign?.price}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Hi! Let's create something amazing together! 🎨</h3>
                <p className="text-white/90">
                  I'm here to help you design the perfect custom product. Just answer a few quick questions 
                  about how you'd like your {selectedDesign?.name} to look on your {selectedProduct?.name}.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Where would you like the design placed?</h3>
                <p className="text-gray-600 text-sm">Choose the best location for your design</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {placementOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setInstructions(prev => ({ ...prev, placement: option.id }))}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    instructions.placement === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">What size should the design be?</h3>
                <p className="text-gray-600 text-sm">Select the impact level you want</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sizeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setInstructions(prev => ({ ...prev, size: option.id }))}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    instructions.size === option.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-full">
                <Type className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Any special requests?</h3>
                <p className="text-gray-600 text-sm">Tell us anything else about your vision</p>
              </div>
            </div>
            
            <textarea
              value={instructions.customNotes}
              onChange={(e) => setInstructions(prev => ({ ...prev, customNotes: e.target.value }))}
              placeholder="e.g., 'Make it look vintage' or 'Add sparkles' or 'Keep it professional'..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </Card>
        </div>

        <div className="fixed bottom-4 left-4 right-4 md:relative md:bottom-auto md:left-auto md:right-auto md:mt-8">
          <Card className="p-4 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {isFormValid ? 'Ready to continue!' : 'Please select placement and size'}
                </p>
                <p className="text-sm text-gray-600">
                  {isFormValid ? 'Review your design request' : 'Required fields missing'}
                </p>
              </div>
              <Button 
                onClick={handleNext}
                disabled={!isFormValid}
                className={`flex items-center space-x-2 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}