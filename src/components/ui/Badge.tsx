import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'pill';
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-full",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 rounded-full",
    outline: "text-slate-950 border border-slate-200 rounded-full",
    success: "border-transparent bg-green-100 text-green-800 rounded-full",
    warning: "border-transparent bg-amber-100 text-amber-800 rounded-full",
    pill: "border-transparent bg-white/90 backdrop-blur-sm text-slate-800 rounded-full shadow-sm py-2 px-4 text-sm",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
}
