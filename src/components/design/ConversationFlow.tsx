import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Type, Check, X } from 'lucide-react';

// Define the Product type based on your application's data structure
interface Product {
  id: string;
  name: string;
  // Add other product properties as needed
}

interface ConversationFlowProps {
  product?: Product | null;
  onDesignUpdate: (updatedData: Record<string, any>) => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  data?: {
    type?: 'options' | 'confirmation' | 'color-picker' | 'text-input';
    options?: Array<{ text: string; value: string; description?: string }>;
    multiSelect?: boolean;
    maxSelections?: number;
  };
}

interface DesignData {
  productType?: string;
  style?: string;
  placement?: string[];
  colors?: string[];
  customNotes?: string;
}

const initialMessages: Message[] = [{
  id: 'welcome',
  type: 'assistant',
  content: "Hi there! I'm your design assistant. Let's create something amazing together. What would you like to design today?",
  timestamp: new Date(),
  data: {
    type: 'options',
    options: [
      { text: 'T-Shirt', value: 'tshirt' },
      { text: 'Hoodie', value: 'hoodie' },
      { text: 'Tote Bag', value: 'tote' },
      { text: 'Something else', value: 'custom' }
    ]
  }
}];

export function ConversationFlow({ product, onDesignUpdate }: ConversationFlowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [designData, setDesignData] = useState<DesignData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type: 'user' | 'assistant' | 'system', content: string, data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      data
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleOptionSelect = (value: string) => {
    // Add user's selection to chat
    const selectedOption = messages[messages.length - 1]?.data?.options?.find(opt => opt.value === value);
    if (selectedOption) {
      addMessage('user', selectedOption.text);
    } else {
      addMessage('user', value);
    }

    setIsLoading(true);

    // Process the response and generate next steps
    setTimeout(() => {
      if (!designData.productType) {
        // First step: Product type selection
        setDesignData(prev => ({
          ...prev,
          productType: value
        }));
        
        // Ask about style
        addMessage('assistant', `Great choice! What style are you thinking of for your ${value}?`, {
          type: 'options',
          options: [
            { text: 'Minimalist', value: 'minimalist' },
            { text: 'Graphic Print', value: 'graphic' },
            { text: 'Text Only', value: 'text' },
            { text: 'Photo Print', value: 'photo' },
            { text: 'Illustration', value: 'illustration' }
          ]
        });
      } else if (!designData.style) {
        // Second step: Style selection
        setDesignData(prev => ({
          ...prev,
          style: value
        }));
        
        // Ask about colors
        addMessage('assistant', 'What colors would you like to use? (Select up to 3)', {
          type: 'options',
          multiSelect: true,
          maxSelections: 3,
          options: [
            { text: 'Black', value: 'black' },
            { text: 'White', value: 'white' },
            { text: 'Red', value: 'red' },
            { text: 'Blue', value: 'blue' },
            { text: 'Green', value: 'green' },
            { text: 'Yellow', value: 'yellow' },
            { text: 'Pink', value: 'pink' },
            { text: 'Purple', value: 'purple' },
            { text: 'Custom', value: 'custom' }
          ]
        });
      } else if (!designData.colors || designData.colors.length === 0) {
        // Handle color selection (simplified for this example)
        setDesignData(prev => ({
          ...prev,
          colors: [value]
        }));
        
        // Ask for additional notes
        addMessage('assistant', 'Almost there! Any specific details or requirements you\'d like to share?', {
          type: 'text-input'
        });
      } else {
        // Final step: Show confirmation
        addMessage('assistant', 'Perfect! Here\'s a summary of your design request:', {
          type: 'confirmation',
          options: [
            { text: 'Edit', value: 'edit' },
            { text: 'Add to Cart', value: 'add_to_cart' },
            { text: 'Start Over', value: 'restart' }
          ]
        });
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage = addMessage('user', inputValue);
    setInputValue('');
    
    // Process the message and generate response
    handleOptionSelect(inputValue);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-primary-100 text-primary-900 rounded-br-none' 
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              
              {message.data?.type === 'options' && (
                <div className="mt-2 space-y-2">
                  {message.data.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className="block w-full text-left px-3 py-2 text-sm rounded-md bg-white bg-opacity-50 hover:bg-opacity-100 transition-all"
                    >
                      {option.text}
                      {option.description && (
                        <span className="block text-xs text-gray-500 mt-1">
                          {option.description}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {message.data?.type === 'confirmation' && (
                <div className="mt-2 space-x-2">
                  {message.data.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className={`px-3 py-1.5 text-xs rounded-md ${
                        option.value === 'add_to_cart'
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none p-3 max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600"
                onClick={() => {}}
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600"
                onClick={() => {}}
              >
                <Type className="h-5 w-5" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
