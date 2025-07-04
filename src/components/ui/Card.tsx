import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glassmorphic?: boolean;
}

export function Card({ children, className = '', hover = true, glassmorphic = false }: CardProps) {
  const baseClasses = glassmorphic 
    ? 'bg-white/80 backdrop-blur-md border border-white/20 shadow-xl'
    : 'bg-white border border-gray-100 shadow-sm';

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: glassmorphic ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      className={`${baseClasses} rounded-xl transition-all duration-200 ${className}`}
    >
      {children}
    </motion.div>
  );
}