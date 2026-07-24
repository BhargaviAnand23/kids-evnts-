import React from 'react';
import { MascotLoader } from '@/components/ui/MascotLoader';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <MascotLoader message="Gathering exciting activities for kids..." />
    </div>
  );
}
