'use client';

import React from 'react';

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export function AnimatedList({
  children,
  className = '',
  staggerDelay = 80
}: AnimatedListProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div
            className="animate-fade-in-up transition-all duration-300"
            style={{
              animationDelay: `${index * staggerDelay}ms`,
              animationFillMode: 'both'
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
