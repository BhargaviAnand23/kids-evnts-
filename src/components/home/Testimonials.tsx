'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Mother of two',
    content: "Kidspire has been a lifesaver. Finding good weekend activities used to take hours of searching Facebook groups. Now I book everything here in 5 minutes.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Karthik Rajan',
    role: 'Father of a 7yo',
    content: "The verified partner badge really gives me peace of mind. The football coaching camp we found through Kidspire has top-notch safety standards.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Anita Desai',
    role: 'Dance Academy Director',
    content: "As an organizer, Kidspire has transformed how we reach students. The platform handles all bookings and payments seamlessly, letting us focus on teaching.",
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Monitor desktop width
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto advance slide every 5 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, currentIndex]);

  // Touch Swipe Handlers for Mobile support
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsHovered(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsHovered(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Compute visible card indices
  const visibleIndices = isDesktop
    ? [currentIndex, (currentIndex + 1) % testimonials.length]
    : [currentIndex];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-mesh-purple-rich overflow-hidden border-b border-purple-100/50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
        >
          <h2 className="text-section-title font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">Loved by Parents &amp; Partners</h2>
          <p className="text-slate-655 text-body">Don't just take our word for it. Here's what our community has to say about Kidspire.</p>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-6xl mx-auto px-4 md:px-14 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Slide Row Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 min-h-[300px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleIndices.map((idx) => {
                const testimonial = testimonials[idx];
                return (
                  <motion.div
                    key={`${idx}-${testimonial.name}`}
                    initial={{ opacity: 0, x: 45 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -45 }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                    className="h-full"
                  >
                    <Card className="bg-white border-none shadow-lg shadow-slate-200/50 relative h-full flex flex-col justify-between">
                      <div className="absolute top-6 right-6 text-slate-100 pointer-events-none">
                        <Quote className="w-12 h-12 fill-current" />
                      </div>
                      <CardContent className="p-6 sm:p-8 flex flex-col flex-grow justify-between relative z-10">
                        <div>
                          {/* Stars */}
                          <div className="flex items-center mb-6">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                            ))}
                          </div>
                          {/* Quote */}
                          <p className="text-slate-650 mb-8 text-body leading-relaxed font-normal">"{testimonial.content}"</p>
                        </div>
                        
                        {/* Profile Details */}
                        <div className="flex items-center mt-auto pt-4 border-t border-slate-50">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-purple-100 shrink-0">
                            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-card-title text-slate-900 leading-tight">{testimonial.name}</h4>
                            <p className="text-caption text-slate-500 mt-0.5">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePrev();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-600 hover:text-purple-650 p-2 rounded-full shadow-md border border-slate-100 transition-all z-20 cursor-pointer flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 md:-translate-x-2 hover:scale-105 active:scale-95 border-none outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-600 hover:text-purple-650 p-2 rounded-full shadow-md border border-slate-100 transition-all z-20 cursor-pointer flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 md:translate-x-2 hover:scale-105 active:scale-95 border-none outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-purple-650 w-6'
                  : 'bg-slate-300 hover:bg-slate-400 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
