import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Upload, Image as ImageIcon, Type, Palette, Move, RotateCcw, ZoomIn, Check, Ruler, MapPin, ZoomOut } from 'lucide-react';
import { Button } from '../ui/Button';

type DesignOption = 'upload' | 'text' | 'graphic' | 'both';

interface ProductCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    category: string;
    colors: string[];
    sizes: string[];
    mockups: string[];
  };
  onComplete: (design: any) => void;
}

const placementOptions: Record<string, { id: string; name: string; icon: React.ReactNode }[]> = {
  default: [
    { id: 'front', name: 'Front', icon: <MapPin className="w-5 h-5" /> },
    { id: 'back', name: 'Back', icon: <MapPin className="w-5 h-5" /> },
  ],
  tshirts: [
    { id: 'front-center', name: 'Front Center', icon: <MapPin className="w-5 h-5" /> },
    { id: 'back', name: 'Back', icon: <MapPin className="w-5 h-5" /> },
    { id: 'left-chest', name: 'Left Chest', icon: <MapPin className="w-5 h-5" /> },
    { id: 'right-sleeve', name: 'Right Sleeve', icon: <MapPin className="w-5 h-5" /> },
  ],
  hoodies: [
    { id: 'front-center', name: 'Front Center', icon: <MapPin className="w-5 h-5" /> },
    { id: 'back', name: 'Back', icon: <MapPin className="w-5 h-5" /> },
    { id: 'hood', name: 'Hood', icon: <MapPin className="w-5 h-5" /> },
  ],
  mugs: [
    { id: 'front', name: 'Front', icon: <MapPin className="w-5 h-5" /> },
    { id: 'wrap', name: 'Wrap Around', icon: <MapPin className="w-5 h-5" /> },
  ],
};

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  isOpen,
  onClose,
  product,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedPlacement, setSelectedPlacement] = useState<string>('');
  const [designType, setDesignType] = useState<DesignOption | null>(null);
  const [customText, setCustomText] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;

  const currentPlacements = placementOptions[product.category] || placementOptions.default;

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedColor(product.colors[0] || '');
      setSelectedSize(product.sizes[0] || '');
      setSelectedPlacement(currentPlacements[0]?.id || '');
      setDesignType(null);
      setCustomText('');
      setUploadedImage(null);
      setPosition({ x: 0, y: 0 });
      setScale(1);
      setRotation(0);
    }
  }, [isOpen, product]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleSubmit = () => {
    const designData = {
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
      placement: selectedPlacement,
      designType,
      customText,
      uploadedImage,
      transform: { position, scale, rotation },
    };
    onComplete(designData);
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Color & Size
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-primary-500' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'primary' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2: // Placement
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Design Placement</h3>
            <div className="grid grid-cols-2 gap-4">
              {currentPlacements.map((p) => (
                <Button
                  key={p.id}
                  variant={selectedPlacement === p.id ? 'primary' : 'outline'}
                  className="h-auto flex-col py-4"
                  onClick={() => setSelectedPlacement(p.id)}
                >
                  {p.icon}
                  <span className="mt-2">{p.name}</span>
                </Button>
              ))}
            </div>
          </div>
        );
      case 3: // Design Type
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">How would you like to design?</h3>
            <div className="space-y-4">
              <Button
                variant={designType === 'upload' ? 'primary' : 'outline'}
                className="w-full justify-start h-auto py-4"
                onClick={() => setDesignType('upload')}
              >
                <Upload className="w-5 h-5 mr-4" />
                Upload a file
              </Button>
              <Button
                variant={designType === 'text' ? 'primary' : 'outline'}
                className="w-full justify-start h-auto py-4"
                onClick={() => setDesignType('text')}
              >
                <Type className="w-5 h-5 mr-4" />
                Add text
              </Button>
            </div>
          </div>
        );
      case 4: // Design Editor
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Create Your Design</h3>
            {designType === 'upload' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Image</label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <p className="pl-1">{uploadedImage ? 'Image selected' : 'Click to upload an image'}</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              </div>
            )}
            {designType === 'text' && (
              <div>
                <label htmlFor="customText" className="block text-sm font-medium text-gray-700">Your Text</label>
                <input
                  type="text"
                  id="customText"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            )}
          </div>
        );
      case 5: // Review
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Review Your Creation</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Product:</strong> {product.name}</p>
              <p><strong>Color:</strong> {selectedColor}</p>
              <p><strong>Size:</strong> {selectedSize}</p>
              <p><strong>Placement:</strong> {selectedPlacement}</p>
              {customText && <p><strong>Text:</strong> {customText}</p>}
              {uploadedImage && <p><strong>Image:</strong> Uploaded</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-4 border-b flex items-center justify-between flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={handleBack}><ArrowLeft /></Button>
              <h2 className="text-lg font-semibold">Customize Your {product.name}</h2>
              <Button variant="ghost" size="sm" onClick={onClose}><X /></Button>
            </header>

            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              {/* Left Panel: Steps */}
              <div className="w-full md:w-1/2 p-6 space-y-6 overflow-y-auto">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-sm font-semibold text-gray-500">STEP {step}/{totalSteps}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-primary-600 h-2 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Panel: Preview */}
              <div className="w-full md:w-1/2 bg-gray-100 p-6 flex items-center justify-center relative overflow-hidden">
                <div className="relative w-full h-full max-w-sm max-h-sm">
                  <img src={product.mockups[0]} alt="Product mockup" className="w-full h-full object-contain" style={{ filter: `brightness(${selectedColor === 'black' ? 0.5 : 1})` }} />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2"
                    onMouseDown={(e) => setIsDragging(true)}
                    onMouseMove={(e) => {
                      if (isDragging) {
                        setPosition({ x: position.x + e.movementX, y: position.y + e.movementY });
                      }
                    }}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                  >
                    <div
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                        transformOrigin: 'center',
                      }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {uploadedImage && <img src={uploadedImage} alt="user design" className="max-w-full max-h-full object-contain" />}
                      {customText && <div className="text-center font-bold text-3xl" style={{ color: selectedColor === 'black' ? 'white' : 'black' }}>{customText}</div>}
                    </div>
                  </div>
                </div>
                {/* Design Controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white p-2 rounded-lg shadow-md">
                  <Button variant="outline" size="sm" onClick={() => setScale(s => s * 1.1)}><ZoomIn className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setScale(s => s / 1.1)}><ZoomOut className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setRotation(r => r + 15)}><RotateCcw className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => { setPosition({x:0, y:0}); setScale(1); setRotation(0);}}><Move className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>

            <footer className="p-4 border-t flex-shrink-0 flex justify-end">
              <Button size="lg" onClick={handleNext}>
                {step === totalSteps ? 'Complete & Add to Cart' : 'Next'}
              </Button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
