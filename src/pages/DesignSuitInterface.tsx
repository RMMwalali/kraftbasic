import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  X, 
  Info,
  Image as ImageIcon,
  Type,
  Palette,
  Move,
  RotateCcw,
  Check,
  ShirtIcon as Shirt
} from 'lucide-react';
import { useApp, DesignInstructions } from '../context/AppContext';
import { Button } from '../components/ui/Button';

interface PlacementArea {
  id: string;
  name: string;
  description: string;
  maxDesigns: number;
  supportText: boolean;
  supportImage: boolean;
  icon: React.ReactNode;
}

interface CustomizationItem {
  id: string;
  type: 'image' | 'text';
  content: string;
  placement: string;
  size: 'small' | 'medium' | 'large';
  position?: { x: number; y: number };
  rotation?: number;
  color?: string;
}

interface ExtendedDesignInstructions extends DesignInstructions {
  placementAreas?: { [key: string]: CustomizationItem[] };
  urgency?: 'standard' | 'rush' | 'express';
  budget?: string;
}

const questions = [
  {
    id: 'welcome',
    type: 'system',
    content: "Welcome to the Design Suite! I'll help you customize your product. Let's start by selecting where you'd like to place your design.",
    showPlacementAreas: true
  },
  {
    id: 'placement',
    type: 'placement',
    content: "Which areas of your product would you like to customize? Click on the areas below to select them."
  },
  {
    id: 'content-type',
    type: 'content',
    content: "For each selected area, would you like to add an image design, text, or both?"
  },
  {
    id: 'size',
    type: 'sizing',
    content: "What size should your design be in each area?"
  },
  {
    id: 'colors',
    type: 'colors',
    content: "Do you have any preferred colors for your design? This helps our designers match your vision."
  },
  {
    id: 'mood',
    type: 'mood',
    content: "What style or mood are you going for? (e.g., minimalist, bold, vintage, modern)"
  },
  {
    id: 'budget',
    type: 'budget',
    content: "What's your budget range for this custom design?"
  },
  {
    id: 'timeline',
    type: 'timeline',
    content: "When do you need this completed?"
  },
  {
    id: 'notes',
    type: 'notes',
    content: "Any additional notes or special requirements for your design?"
  }
];

const getPlacementAreas = (productType: string): PlacementArea[] => {
  const commonAreas = {
    'front-center': {
      id: 'front-center',
      name: 'Front Center',
      description: 'Main area on the front center of the garment',
      maxDesigns: 1,
      supportText: true,
      supportImage: true,
      icon: <Shirt className="h-5 w-5" />
    },
    'back-center': {
      id: 'back-center',
      name: 'Back Center',
      description: 'Main area on the back center of the garment',
      maxDesigns: 1,
      supportText: true,
      supportImage: true,
      icon: <Shirt className="h-5 w-5 transform rotate-180" />
    },
    'left-chest': {
      id: 'left-chest',
      name: 'Left Chest',
      description: 'Small logo area on the left chest',
      maxDesigns: 1,
      supportText: true,
      supportImage: true,
      icon: <div className="w-2 h-2 bg-current rounded-full" />
    },
    'right-chest': {
      id: 'right-chest',
      name: 'Right Chest',
      description: 'Small logo area on the right chest',
      maxDesigns: 1,
      supportText: true,
      supportImage: true,
      icon: <div className="w-2 h-2 bg-current rounded-full" />
    }
  };

  switch (productType?.toLowerCase()) {
    case 'hoodie':
    case 'sweatshirt':
      return [
        commonAreas['front-center'],
        commonAreas['back-center'],
        commonAreas['left-chest'],
        {
          id: 'hood',
          name: 'Hood',
          description: 'Design on the hood area',
          maxDesigns: 1,
          supportText: true,
          supportImage: true,
          icon: <div className="w-5 h-3 bg-current rounded-t-full" />
        },
        {
          id: 'left-sleeve',
          name: 'Left Sleeve',
          description: 'Design on the left sleeve',
          maxDesigns: 1,
          supportText: true,
          supportImage: true,
          icon: <div className="w-1 h-5 bg-current rounded" />
        },
        {
          id: 'right-sleeve',
          name: 'Right Sleeve',
          description: 'Design on the right sleeve',
          maxDesigns: 1,
          supportText: true,
          supportImage: true,
          icon: <div className="w-1 h-5 bg-current rounded" />
        }
      ];
    
    case 't-shirt':
    case 'tank top':
      return [
        commonAreas['front-center'],
        commonAreas['back-center'],
        commonAreas['left-chest'],
        commonAreas['right-chest'],
        {
          id: 'left-sleeve',
          name: 'Left Sleeve',
          description: 'Design on the left sleeve',
          maxDesigns: 1,
          supportText: true,
          supportImage: true,
          icon: <div className="w-1 h-3 bg-current rounded" />
        },
        {
          id: 'right-sleeve',
          name: 'Right Sleeve',
          description: 'Design on the right sleeve',
          maxDesigns: 1,
          supportText: true,
          supportImage: true,
          icon: <div className="w-1 h-3 bg-current rounded" />
        }
      ];
    
    case 'mug':
    case 'cup':
      return [
        {
          id: 'front',
          name: 'Front Side',
          description: 'Main design area facing forward',
          maxDesigns: 1,
          supportText: true,
          supportImage: true,
          icon: <div className="w-4 h-5 bg-current rounded-b" />
        },
        {
          id: 'back',
          name: 'Back Side',
          description: 'Design area on the opposite side',
          maxDesigns: 1,
          supportText: true,
          supportImage: true,
          icon: <div className="w-4 h-5 bg-current rounded-b opacity-50" />
        },
        {
          id: 'wrap-around',
          name: 'Wrap Around',
          description: 'Design that wraps around the entire mug',
          maxDesigns: 1,
          supportText: true,
          supportImage: true,
          icon: <div className="w-5 h-5 bg-current rounded-full opacity-30" />
        }
      ];
    
    default:
      return Object.values(commonAreas);
  }
};

export function DesignSuitInterface() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [customizations, setCustomizations] = useState<{ [key: string]: CustomizationItem[] }>({});
  const [formData, setFormData] = useState<ExtendedDesignInstructions>({
    placement: '',
    size: '',
    colors: [],
    customNotes: '',
    style: '',
    mood: '',
    placementAreas: {},
    urgency: 'standard',
    budget: ''
  });
  const [showAreaInfo, setShowAreaInfo] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const placementAreas = getPlacementAreas(state.userFlow.selectedProduct?.name || '');

  useEffect(() => {
    // Initialize with welcome message
    setMessages([{
      id: 'welcome',
      type: 'bot',
      content: questions[0].content,
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAreaSelection = (areaId: string) => {
    setSelectedAreas(prev => {
      const isSelected = prev.includes(areaId);
      if (isSelected) {
        const newAreas = prev.filter(id => id !== areaId);
        const newCustomizations = { ...customizations };
        delete newCustomizations[areaId];
        setCustomizations(newCustomizations);
        return newAreas;
      } else {
        return [...prev, areaId];
      }
    });
  };

  const addCustomizationItem = (areaId: string, type: 'image' | 'text') => {
    const newItem: CustomizationItem = {
      id: `${areaId}-${type}-${Date.now()}`,
      type,
      content: type === 'text' ? '' : state.userFlow.selectedDesign?.name || '',
      placement: areaId,
      size: 'medium'
    };

    setCustomizations(prev => ({
      ...prev,
      [areaId]: [...(prev[areaId] || []), newItem]
    }));
  };

  const updateCustomizationItem = (areaId: string, itemId: string, updates: Partial<CustomizationItem>) => {
    setCustomizations(prev => ({
      ...prev,
      [areaId]: prev[areaId]?.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ) || []
    }));
  };

  const removeCustomizationItem = (areaId: string, itemId: string) => {
    setCustomizations(prev => ({
      ...prev,
      [areaId]: prev[areaId]?.filter(item => item.id !== itemId) || []
    }));
  };

  const handleNext = () => {
    if (currentStep === 0 && selectedAreas.length === 0) {
      addMessage('user', 'I need to select at least one area to customize');
      addMessage('bot', 'Please select at least one area where you\'d like to place your design.');
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      if (currentStep + 1 < questions.length) {
        addMessage('bot', questions[currentStep + 1].content);
      }
    } else {
      handleComplete();
    }
  };

  const addMessage = (type: 'user' | 'bot', content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleComplete = () => {
    // Convert to the expected DesignInstructions format
    const instructions: DesignInstructions = {
      placement: selectedAreas.join(', '),
      size: formData.size || 'medium',
      colors: formData.colors,
      customNotes: formData.customNotes,
      style: formData.style,
      mood: formData.mood
    };

    dispatch({ type: 'SET_DESIGN_INSTRUCTIONS', payload: instructions });
    navigate('/flow/summary');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 glass-strong border-b border-gray-200">
        <div className="container-apple py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate(-1)}
                className="btn-secondary p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-heading-medium">Design Suite</h1>
                <p className="text-body-small text-gray-600">
                  Step {currentStep + 1} of {questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {state.userFlow.selectedProduct && (
                <div className="flex items-center space-x-2 text-body-small text-gray-600">
                  <img 
                    src={state.userFlow.selectedProduct.images[0]} 
                    alt={state.userFlow.selectedProduct.name}
                    className="w-8 h-8 object-cover rounded-lg"
                  />
                  <span>{state.userFlow.selectedProduct.name}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
            <motion.div
              className="bg-gray-900 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="container-apple py-8">
        <div className="max-w-4xl mx-auto">
          {/* Chat Interface */}
          <div className="glass-card mb-8">
            <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-xs md:max-w-md ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={`p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-body-medium">{message.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
          </div>

          {/* Current Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Placement Area Selection */}
              {currentStep === 0 && (
                <div className="glass-card p-6">
                  <h3 className="text-heading-medium mb-6 text-center">
                    Select Placement Areas
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {placementAreas.map((area) => {
                      const isSelected = selectedAreas.includes(area.id);
                      return (
                        <motion.div
                          key={area.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`multi-select-card ${isSelected ? 'selected' : ''} p-4`}
                          onClick={() => handleAreaSelection(area.id)}
                        >
                          <div className="relative">
                            <div className="flex items-center justify-center mb-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                                {area.icon}
                              </div>
                            </div>
                            
                            <h4 className="text-label text-center mb-2">{area.name}</h4>
                            <p className="text-body-small text-gray-600 text-center mb-3">{area.description}</p>
                            
                            <div className="flex items-center justify-center space-x-2 text-body-small text-gray-500">
                              {area.supportImage && <ImageIcon className="h-3 w-3" />}
                              {area.supportText && <Type className="h-3 w-3" />}
                            </div>
                            
                            <div className={`selection-indicator ${isSelected ? 'active' : ''}`}>
                              {isSelected ? <Check className="h-3 w-3" /> : selectedAreas.length + 1}
                            </div>
                            
                            <button
                              className="info-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAreaInfo(showAreaInfo === area.id ? null : area.id);
                              }}
                            >
                              <Info className="h-3 w-3" />
                            </button>
                            
                            {showAreaInfo === area.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="absolute top-full left-0 right-0 mt-2 p-3 glass border rounded-lg z-10"
                              >
                                <p className="text-body-small">
                                  Max designs: {area.maxDesigns}<br/>
                                  Supports: {[area.supportImage && 'Images', area.supportText && 'Text'].filter(Boolean).join(', ')}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customization Details for Selected Areas */}
              {currentStep === 1 && selectedAreas.length > 0 && (
                <div className="space-y-6">
                  {selectedAreas.map((areaId) => {
                    const area = placementAreas.find(a => a.id === areaId);
                    const areaCustomizations = customizations[areaId] || [];
                    
                    return (
                      <div key={areaId} className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-heading-small">{area?.name}</h4>
                          <div className="flex space-x-2">
                            {area?.supportImage && (
                              <Button
                                onClick={() => addCustomizationItem(areaId, 'image')}
                                className="btn-secondary p-2"
                                disabled={areaCustomizations.length >= (area?.maxDesigns || 1)}
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            )}
                            {area?.supportText && (
                              <Button
                                onClick={() => addCustomizationItem(areaId, 'text')}
                                className="btn-secondary p-2"
                                disabled={areaCustomizations.length >= (area?.maxDesigns || 1)}
                              >
                                <Type className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {areaCustomizations.map((item) => (
                            <div key={item.id} className="glass border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  {item.type === 'image' ? (
                                    <ImageIcon className="h-4 w-4 text-gray-600" />
                                  ) : (
                                    <Type className="h-4 w-4 text-gray-600" />
                                  )}
                                  <span className="text-label capitalize">{item.type}</span>
                                </div>
                                <Button
                                  onClick={() => removeCustomizationItem(areaId, item.id)}
                                  className="p-1 text-gray-400 hover:text-red-500"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  placeholder={item.type === 'text' ? 'Enter text content' : 'Design description'}
                                  value={item.content}
                                  onChange={(e) => updateCustomizationItem(areaId, item.id, { content: e.target.value })}
                                  className="input-apple"
                                />
                                
                                <div className="grid grid-cols-3 gap-2">
                                  {['small', 'medium', 'large'].map((size) => (
                                    <Button
                                      key={size}
                                      onClick={() => updateCustomizationItem(areaId, item.id, { size: size as any })}
                                      className={`btn-secondary text-xs capitalize ${
                                        item.size === size ? 'bg-gray-900 text-white' : ''
                                      }`}
                                    >
                                      {size}
                                    </Button>
                                  ))}
                                </div>
                                
                                {item.type === 'text' && (
                                  <input
                                    type="color"
                                    value={item.color || '#000000'}
                                    onChange={(e) => updateCustomizationItem(areaId, item.id, { color: e.target.value })}
                                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {areaCustomizations.length === 0 && (
                            <p className="text-body-medium text-gray-500 text-center py-4">
                              Click the buttons above to add {area?.supportImage && area?.supportText ? 'an image or text' : area?.supportImage ? 'an image' : 'text'} to this area
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Additional Form Steps */}
              {currentStep >= 2 && (
                <div className="glass-card p-6">
                  <div className="space-y-6">
                    {currentStep === 2 && (
                      <div>
                        <label className="text-label block mb-3">Preferred Colors (optional)</label>
                        <input
                          type="text"
                          placeholder="e.g., blue, red, gold"
                          value={formData.colors.join(', ')}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                          }))}
                          className="input-apple"
                        />
                      </div>
                    )}
                    
                    {currentStep === 3 && (
                      <div>
                        <label className="text-label block mb-3">Design Style/Mood</label>
                        <textarea
                          placeholder="Describe the style you're looking for..."
                          rows={3}
                          value={formData.mood}
                          onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                          className="input-apple"
                        />
                      </div>
                    )}
                    
                    {currentStep === 4 && (
                      <div>
                        <label className="text-label block mb-3">Budget Range</label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="input-apple"
                        >
                          <option value="">Select budget range</option>
                          <option value="under-50">Under $50</option>
                          <option value="50-100">$50 - $100</option>
                          <option value="100-200">$100 - $200</option>
                          <option value="200-plus">$200+</option>
                        </select>
                      </div>
                    )}
                    
                    {currentStep === 5 && (
                      <div>
                        <label className="text-label block mb-3">Timeline</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { key: 'standard', label: 'Standard (7-10 days)', extra: '' },
                            { key: 'rush', label: 'Rush (3-5 days)', extra: '+$25' },
                            { key: 'express', label: 'Express (1-2 days)', extra: '+$50' }
                          ].map((option) => (
                            <Button
                              key={option.key}
                              onClick={() => setFormData(prev => ({ ...prev, urgency: option.key as any }))}
                              className={`btn-secondary text-center p-4 ${
                                formData.urgency === option.key ? 'bg-gray-900 text-white' : ''
                              }`}
                            >
                              <div>
                                <div className="text-body-medium font-medium">{option.label}</div>
                                {option.extra && <div className="text-body-small text-gray-500">{option.extra}</div>}
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 6 && (
                      <div>
                        <label className="text-label block mb-3">Additional Notes</label>
                        <textarea
                          placeholder="Any specific requirements, inspirations, or details..."
                          rows={4}
                          value={formData.customNotes}
                          onChange={(e) => setFormData(prev => ({ ...prev, customNotes: e.target.value }))}
                          className="input-apple"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className="btn-secondary"
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              className="btn-primary"
            >
              {currentStep === questions.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}