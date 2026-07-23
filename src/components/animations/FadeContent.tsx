'use client';

import React, { useEffect, useRef, useState } from 'react';

interface FadeContentProps {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  initialOpacity?: number;
  className?: string;
}

export function FadeContent({
  children,
  duration = 600,
  delay = 0,
  className = ''
}: FadeContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Immediate viewport check on mount
    if (domRef.current) {
      const rect = domRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
        setIsVisible(true);
      }
    }

    // 2. IntersectionObserver with generous rootMargin
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: 0.01, rootMargin: '150px 0px' }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // 3. Safety fallback timer so content is NEVER permanently invisible on cold load
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 250);

    return () => {
      clearTimeout(safetyTimer);
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 filter-none'
          : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
