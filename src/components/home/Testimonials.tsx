import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

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
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">Loved by Parents & Partners</h2>
          <p className="text-slate-600 text-base">Don't just take our word for it. Here's what our community has to say about Kidspire.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-none shadow-lg shadow-slate-200/50 relative">
              <div className="absolute top-6 right-6 text-slate-100">
                <Quote className="w-12 h-12 fill-current" />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-orange-400 fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-700 mb-8 text-base leading-relaxed font-normal">"{testimonial.content}"</p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-purple-100">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
