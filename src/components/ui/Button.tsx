import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  glassmorphic?: boolean;
  as?: 'button' | 'span';
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  glassmorphic = false,
  className = '',
  as = 'button',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: glassmorphic 
      ? 'bg-primary-600/90 backdrop-blur-md hover:bg-primary-700/90 text-white focus:ring-primary-500 border border-primary-500/30 shadow-xl'
      : 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-lg',
    secondary: glassmorphic
      ? 'bg-secondary-600/90 backdrop-blur-md hover:bg-secondary-700/90 text-white focus:ring-secondary-500 border border-secondary-500/30 shadow-xl'
      : 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500 shadow-lg',
    outline: glassmorphic
      ? 'border-2 border-primary-600/50 bg-white/20 backdrop-blur-md text-primary-600 hover:bg-primary-600/10 focus:ring-primary-500 shadow-lg'
      : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
    ghost: glassmorphic
      ? 'text-gray-600 hover:text-gray-900 hover:bg-white/20 backdrop-blur-sm focus:ring-gray-500'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const Component = as === 'span' ? motion.span : motion.button;

  return (
    <Component
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading}
      {...(as === 'button' ? props : {})}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        children
      )}
    </Component>
  );
}