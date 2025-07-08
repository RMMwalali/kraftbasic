import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  glassmorphic?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  glassmorphic = false,
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: glassmorphic 
      ? 'btn-glass text-white' 
      : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-xl',
    secondary: glassmorphic
      ? 'glass border-2 border-white/30 text-white hover:border-white/50'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: glassmorphic
      ? 'glass border-2 border-white/30 text-white hover:bg-white/10'
      : 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    glass: 'btn-glass text-white'
  };

  const baseClasses = `
    relative
    inline-flex
    items-center
    justify-center
    font-medium
    rounded-xl
    border-none
    cursor-pointer
    transition-all
    duration-300
    focus:outline-none
    focus:ring-4
    focus:ring-primary-500/20
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:transform-none
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  const motionProps = {
    whileHover: !disabled && !loading ? { 
      y: -2,
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }
    } : {},
    whileTap: !disabled && !loading ? { 
      scale: 0.95,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 600, 
        damping: 30 
      }
    } : {},
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 15 
    }
  };

  // Separate conflicting HTML props from motion props
  const { 
    onAnimationStart, 
    onAnimationEnd, 
    onDragStart, 
    onDragEnd, 
    onDrag,
    ...buttonProps 
  } = props;

  return (
    <motion.button
      className={baseClasses}
      disabled={disabled || loading}
      {...motionProps}
      {...buttonProps}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      
      <motion.span
        className={`flex items-center justify-center ${loading ? 'opacity-0' : 'opacity-100'}`}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>

      {/* Glass effect overlay for interactive feedback */}
      {(variant === 'glass' || glassmorphic) && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.button>
  );
}