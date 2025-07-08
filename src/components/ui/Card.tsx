import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  glassmorphic?: boolean;
  variant?: 'default' | 'glass' | 'interactive';
  size?: 'sm' | 'md' | 'lg';
}

export function Card({ 
  children, 
  className = '', 
  onClick,
  hover = true, 
  glassmorphic = false,
  variant = 'default',
  size = 'md'
}: CardProps) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantClasses = {
    default: glassmorphic 
      ? 'glass-card' 
      : 'bg-white border border-gray-100 shadow-sm',
    glass: 'glass-card',
    interactive: 'glass-card card-interactive'
  };

  const baseClasses = `
    rounded-xl 
    transition-all 
    duration-300 
    ${variantClasses[variant]} 
    ${sizeClasses[size]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  const MotionCard = motion.div;

  const hoverAnimation = hover && onClick ? {
    whileHover: { 
      y: -4,
      scale: variant === 'interactive' ? 1.02 : 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    },
    whileTap: { 
      scale: 0.98,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }
    }
  } : hover ? {
    whileHover: { 
      y: -2,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }
    }
  } : {};

  if (onClick) {
    return (
      <MotionCard
        className={baseClasses}
        onClick={onClick}
        {...hoverAnimation}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15 
        }}
      >
        {children}
      </MotionCard>
    );
  }

  return (
    <MotionCard
      className={baseClasses}
      {...hoverAnimation}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }}
    >
      {children}
    </MotionCard>
  );
}