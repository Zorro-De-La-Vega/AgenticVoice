import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'medical' | 'legal' | 'sales' | 'gradient';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  hover = false,
  padding = 'md'
}) => {
  const baseClasses = "bg-white rounded-brand border border-gray-200 transition-all duration-300";
  
  const variantClasses = {
    default: "shadow-sm hover:shadow-md",
    medical: hover ? "shadow-medical hover:shadow-lg hover:shadow-medical" : "shadow-medical",
    legal: hover ? "shadow-legal hover:shadow-lg hover:shadow-legal" : "shadow-legal", 
    sales: hover ? "shadow-sales hover:shadow-lg hover:shadow-sales" : "shadow-sales",
    gradient: "bg-gradient-to-br from-primary-purple/5 to-primary-teal/5 border-primary-purple/20"
  };

  const paddingClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  };

  const hoverClasses = hover ? "hover:scale-[1.02] hover:-translate-y-1 cursor-pointer" : "";

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
