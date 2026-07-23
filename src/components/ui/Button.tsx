import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    const variants = {
      primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-sm",
      secondary: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",
      outline: "border border-slate-200 hover:bg-slate-50 text-slate-900 bg-white",
      ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-sm md:text-base",
      lg: "h-12 md:h-14 px-8 text-sm md:text-base",
      icon: "h-10 w-10",
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    // When asChild is true, clone the single child element and inject
    // the button classes + forwarded props onto it — enabling Link-as-button.
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        className: `${combinedClasses} ${(children.props as { className?: string }).className ?? ''}`.trim(),
      });
    }

    return (
      <button ref={ref} className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
