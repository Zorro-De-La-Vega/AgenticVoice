import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'medical' | 'legal' | 'sales';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  variant = 'default',
  className,
  ...props
}) => {
  const baseClasses = "w-full px-3 py-2 border rounded-brand focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
  const variantClasses = {
    default: "border-gray-300 focus:border-primary-purple focus:ring-primary-purple",
    medical: "border-gray-300 focus:border-industry-medical focus:ring-industry-medical",
    legal: "border-gray-300 focus:border-industry-legal focus:ring-industry-legal",
    sales: "border-gray-300 focus:border-industry-sales focus:ring-industry-sales"
  };

  const errorClasses = error ? "border-status-error focus:border-status-error focus:ring-status-error" : "";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-secondary-dark-blue">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={cn(
            baseClasses,
            variantClasses[variant],
            errorClasses,
            icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-status-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-medium-gray">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
