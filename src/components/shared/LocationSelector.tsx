'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Check, ChevronDown, Search, Globe, Loader2, X } from 'lucide-react';

export const SUPPORTED_CITIES = [
  { name: 'Chennai', state: 'Tamil Nadu', icon: '📍' },
  { name: 'Bengaluru', state: 'Karnataka', icon: '📍' },
  { name: 'Mumbai', state: 'Maharashtra', icon: '📍' },
  { name: 'Delhi NCR', state: 'Capital Region', icon: '📍' },
  { name: 'Hyderabad', state: 'Telangana', icon: '📍' },
  { name: 'Online', state: 'Virtual / Anywhere', icon: '🌐' },
  { name: 'All', state: 'Nationwide Activities', icon: '🗺️' },
];

export const STORAGE_KEY = 'kidspire_selected_city';
export const EVENT_KEY = 'kidspire_location_change';

// ── Custom Hook for reactive location state ──────────────────────────────
export function useSelectedLocation() {
  const [city, setCity] = useState<string>('Chennai');

  useEffect(() => {
    // 1. Initial load from LocalStorage or default
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCity(saved);
    }

    // 2. Listen for reactive custom location change events across components
    const handleLocationChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setCity(customEvent.detail);
      }
    };

    window.addEventListener(EVENT_KEY, handleLocationChange);
    return () => {
      window.removeEventListener(EVENT_KEY, handleLocationChange);
    };
  }, []);

  const updateCity = (newCity: string) => {
    setCity(newCity);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newCity);
      window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: newCity }));
    }
  };

  return { selectedCity: city, setSelectedCity: updateCity };
}

// ── Location Selector Component ──────────────────────────────────────────
export function LocationSelector({ className = '' }: { className?: string }) {
  const { selectedCity, setSelectedCity } = useSelectedLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [detectMsg, setDetectMsg] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Geolocation Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setDetectMsg('Geolocation is not supported by your browser.');
      return;
    }

    setDetecting(true);
    setDetectMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Simple bounding box mapping for Indian cities
        let detected = 'Chennai';
        if (latitude >= 12.8 && latitude <= 13.2 && longitude >= 80.1 && longitude <= 80.3) {
          detected = 'Chennai';
        } else if (latitude >= 12.8 && latitude <= 13.1 && longitude >= 77.4 && longitude <= 77.8) {
          detected = 'Bengaluru';
        } else if (latitude >= 18.8 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.1) {
          detected = 'Mumbai';
        } else if (latitude >= 28.4 && latitude <= 28.9 && longitude >= 76.9 && longitude <= 77.4) {
          detected = 'Delhi NCR';
        } else if (latitude >= 17.2 && latitude <= 17.6 && longitude >= 78.2 && longitude <= 78.6) {
          detected = 'Hyderabad';
        } else {
          detected = 'Chennai'; // Default fallback
        }

        setSelectedCity(detected);
        setDetecting(false);
        setDetectMsg(`Location detected: ${detected}!`);
        setTimeout(() => {
          setIsOpen(false);
          setDetectMsg(null);
        }, 1200);
      },
      (error) => {
        setDetecting(false);
        console.warn('Geolocation error:', error);
        setDetectMsg('Could not fetch GPS. Selected default city (Chennai).');
      },
      { timeout: 8000 }
    );
  };

  const filteredCities = SUPPORTED_CITIES.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative inline-block ${className}`}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-purple-700 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 shrink-0 font-medium text-xs sm:text-sm cursor-pointer shadow-sm"
        title="Select city or location"
        aria-label="Select location"
      >
        <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
        <span className="font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-[160px]">
          {selectedCity === 'All' ? 'All Cities' : selectedCity}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Modal / Dropdown Container */}
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute right-0 sm:left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Select Your City</h3>
                <p className="text-[11px] text-slate-500">Filter activities & events near you</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Detect Location Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={detecting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-700 font-bold py-2.5 px-4 rounded-2xl text-xs hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 mb-4 shadow-sm"
          >
            {detecting ? (
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            ) : (
              <Navigation className="w-4 h-4 text-purple-600 fill-purple-200" />
            )}
            <span>{detecting ? 'Detecting GPS location…' : 'Use My Current Location'}</span>
          </button>

          {detectMsg && (
            <div className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl mb-3 text-center">
              {detectMsg}
            </div>
          )}

          {/* Search Filter */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Supported Cities List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredCities.map(city => {
              const isSelected = selectedCity === city.name;
              return (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city.name);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{city.icon}</span>
                    <div className="text-left">
                      <p className="font-bold leading-tight">{city.name}</p>
                      <p className={`text-[10px] ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                        {city.state}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
