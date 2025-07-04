import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, User, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'register';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register, state, clearError } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer' as 'customer' | 'designer',
  });

  // Clear error when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, mode, clearError]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'customer',
      });
      setShowPassword(false);
      setMode('login');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      onClose();
    } catch (err) {
      // Error is handled by the auth context
      console.error('Authentication error:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (state.error) {
      clearError();
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData(prev => ({ ...prev, email, password }));
    setMode('login');
    clearError();
  };

  const demoCredentials = [
    { email: 'customer@example.com', password: 'password', role: 'Customer', color: 'from-blue-500 to-cyan-500' },
    { email: 'designer@example.com', password: 'password', role: 'Designer', color: 'from-purple-500 to-pink-500' },
    { email: 'admin@example.com', password: 'password', role: 'Admin', color: 'from-green-500 to-emerald-500' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {mode === 'login' ? 'Sign in to your account' : 'Join our creative community'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100/80 rounded-full transition-colors backdrop-blur-sm"
            >
              <X className="h-5 sm:h-6 w-5 sm:w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)]">
            {/* Demo Credentials */}
            <Card className="p-3 sm:p-4 mb-4 sm:mb-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-md border border-blue-200/50">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Demo Accounts
              </h3>
              <div className="space-y-2">
                {demoCredentials.map((cred, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDemoLogin(cred.email, cred.password)}
                    className="w-full text-left p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-white/50 hover:border-white/80 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-r ${cred.color} flex items-center justify-center`}>
                          <span className="text-white font-bold text-xs sm:text-sm">{cred.role[0]}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">{cred.role}</span>
                          <p className="text-xs text-gray-600 hidden sm:block">{cred.email}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 bg-gray-100/80 px-2 py-1 rounded">
                        Click to use
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                    required
                    placeholder="Enter your full name"
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-3 py-2 pr-10 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange('role', 'customer')}
                      className={`p-2 sm:p-3 border-2 rounded-lg text-center transition-all backdrop-blur-sm ${
                        formData.role === 'customer'
                          ? 'border-primary-600 bg-primary-50/80 text-primary-600'
                          : 'border-gray-300/50 text-gray-700 hover:border-gray-400/50 bg-white/50'
                      }`}
                    >
                      <div className="font-medium text-sm">Customer</div>
                      <div className="text-xs">Buy custom products</div>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange('role', 'designer')}
                      className={`p-2 sm:p-3 border-2 rounded-lg text-center transition-all backdrop-blur-sm ${
                        formData.role === 'designer'
                          ? 'border-primary-600 bg-primary-50/80 text-primary-600'
                          : 'border-gray-300/50 text-gray-700 hover:border-gray-400/50 bg-white/50'
                      }`}
                    >
                      <div className="font-medium text-sm">Designer</div>
                      <div className="text-xs">Sell your designs</div>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg text-red-700 text-sm flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {state.error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full glassmorphic text-sm sm:text-base"
                disabled={state.isLoading}
                size="lg"
              >
                {state.isLoading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  clearError();
                }}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm sm:text-base"
                disabled={state.isLoading}
              >
                {mode === 'login' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}