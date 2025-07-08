import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shirt as ShirtIcon,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  RotateCcw,
  Share2,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { ConversationFlow } from '../components/design/ConversationFlow';
import type { Product } from '../types';

interface DesignPreviewProps {
  product: Product | null;
  onSaveDraft: () => void;
  onContinueToCheckout: () => void;
}

const DesignPreview: React.FC<DesignPreviewProps> = ({ 
  product, 
  onSaveDraft, 
  onContinueToCheckout 
}) => (
  <div className="relative w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
    <div className="text-center p-6 max-w-sm">
      <div className="mx-auto w-48 h-48 bg-white rounded-lg shadow-inner border border-gray-200 flex items-center justify-center mb-4">
        <ShirtIcon className="h-24 w-24 text-gray-300" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {product?.name || 'Your Design Preview'}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Your custom design will appear here as you make changes
      </p>
      <div className="flex justify-center space-x-2">
        <button 
          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 flex items-center"
          onClick={() => {}}
        >
          <ZoomIn className="h-3 w-3 mr-1" /> Zoom
        </button>
        <button 
          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 flex items-center"
          onClick={() => {}}
        >
          <RotateCcw className="h-3 w-3 mr-1" /> Reset
        </button>
      </div>
    </div>
  </div>
);

interface DesignActionsProps {
  onSaveDraft: () => void;
  onContinue: () => void;
  isSaving?: boolean;
}

const DesignActions: React.FC<DesignActionsProps> = ({
  onSaveDraft,
  onContinue,
  isSaving = false
}) => (
  <div className="absolute bottom-4 left-0 right-0 px-4">
    <div className="flex justify-between items-center bg-white rounded-full shadow-lg p-1">
      <button 
        onClick={onSaveDraft}
        disabled={isSaving}
        className="flex-1 py-2 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-full flex flex-col items-center disabled:opacity-50"
      >
        <Heart className="h-4 w-4 mb-1" />
        <span>{isSaving ? 'Saving...' : 'Save'}</span>
      </button>
      <button 
        className="flex-1 py-2 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-full flex flex-col items-center"
        onClick={() => {}}
      >
        <Share2 className="h-4 w-4 mb-1" />
        <span>Share</span>
      </button>
      <button 
        onClick={onContinue}
        disabled={isSaving}
        className="flex-1 py-2 px-3 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-full flex flex-col items-center disabled:opacity-50"
      >
        <ShoppingCart className="h-4 w-4 mb-1" />
        <span>Add to Cart</span>
      </button>
    </div>
  </div>
);

interface DesignSuitInterfaceProps {
  product?: Product;
}

const DesignSuitInterface: React.FC<DesignSuitInterfaceProps> = ({ product: propProduct }) => {
  const navigate = useNavigate();
  const { state } = useApp();
  
  // Use prop product or fallback to state or null
  const currentProduct = propProduct || (state.products?.[0] || null);
  
  const [showPreview, setShowPreview] = useState(true);
  const [progress, setProgress] = useState(25);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowPreview(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message or update UI
    }, 1500);
  };

  const handleContinueToCheckout = () => {
    navigate('/checkout');
  };

  const handleDesignUpdate = (updatedData: Record<string, any>) => {
    console.log('Design updated:', updatedData);
    // Update progress based on completion
    const newProgress = Math.min(25 + (Object.keys(updatedData).length * 15), 90);
    setProgress(newProgress);
  };

  useEffect(() => {
    // Initialize with welcome message
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Design Studio</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {currentProduct && (
                <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                    <ShirtIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentProduct.name}
                  </span>
                </div>
              )}
              
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                aria-label={showPreview ? 'Hide preview' : 'Show preview'}
              >
                {showPreview ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <motion.div 
              className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row h-[calc(100vh-180px)]">
            {/* Chat Interface */}
            <div className={`${showPreview ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-2/5 lg:w-1/3 border-r border-gray-200`}>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Design Assistant</h2>
                <p className="text-sm text-gray-500">I'll help you create your perfect design</p>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <ConversationFlow 
                  product={currentProduct}
                  onDesignUpdate={handleDesignUpdate}
                />
              </div>
            </div>
            
            {/* Design Preview */}
            <div className={`${!showPreview && isMobile ? 'hidden' : 'flex'} flex-1 flex-col relative`}>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Design Preview</h2>
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => {}}
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => {}}
                    aria-label="Reset view"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto relative">
                <DesignPreview 
                  product={currentProduct} 
                  onSaveDraft={handleSaveDraft}
                  onContinueToCheckout={handleContinueToCheckout}
                />
                <DesignActions 
                  onSaveDraft={handleSaveDraft}
                  onContinue={handleContinueToCheckout}
                  isSaving={isSaving}
                />
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Design Status</p>
                    <p className="text-sm font-medium text-gray-900">
                      {isSaving ? 'Saving...' : 'In Progress'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button 
                      onClick={handleContinueToCheckout}
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                      Continue to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DesignSuitInterface;