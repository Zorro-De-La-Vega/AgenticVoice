import React from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'destructive' | 'info' | 'medical' | 'legal' | 'sales';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const baseClasses = "inline-flex items-center rounded-full font-medium";

  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-600",
    success: "bg-status-success/10 text-status-success",
    warning: "bg-status-warning/10 text-status-warning",
    error: "bg-status-error/10 text-status-error",
    destructive: "bg-red-100 text-red-800",
    info: "bg-status-info/10 text-status-info",
    medical: "bg-industry-medical/10 text-industry-medical",
    legal: "bg-industry-legal/10 text-industry-legal",
    sales: "bg-industry-sales/10 text-industry-sales"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span className={cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
