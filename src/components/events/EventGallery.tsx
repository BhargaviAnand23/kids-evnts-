"use client";

import React, { useState, useEffect } from 'react';
import { EventMedia } from '@/types';
import { Play, ChevronLeft, ChevronRight, X, Image as ImageIcon, Film, Maximize2 } from 'lucide-react';

interface EventGalleryProps {
  media: EventMedia[];
  eventTitle: string;
}

export function getVideoEmbedInfo(url: string): { isEmbed: boolean; embedUrl: string; youtubeId?: string } {
  if (!url) return { isEmbed: false, embedUrl: url };

  // YouTube
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      isEmbed: true,
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`,
      youtubeId: youtubeMatch[1]
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      isEmbed: true,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    };
  }

  return { isEmbed: false, embedUrl: url };
}

export function getMediaThumbnail(item: EventMedia): string {
  if (item.media_type === 'image') {
    return item.media_url;
  }
  
  const embedInfo = getVideoEmbedInfo(item.media_url);
  if (embedInfo.youtubeId) {
    return `https://img.youtube.com/vi/${embedInfo.youtubeId}/hqdefault.jpg`;
  }
  
  // Return placeholder image for generic video
  return 'https://images.unsplash.com/photo-1574629810360-7efbb192569a?auto=format&fit=crop&q=80&w=600';
}

export function EventGallery({ media, eventTitle }: EventGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const mediaList = media || [];

  const handlePrev = React.useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex === null || mediaList.length === 0) return;
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + mediaList.length) % mediaList.length : null));
  }, [selectedIndex, mediaList.length]);

  const handleNext = React.useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex === null || mediaList.length === 0) return;
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % mediaList.length : null));
  }, [selectedIndex, mediaList.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  if (!mediaList || mediaList.length === 0) {
    return null;
  }

  const activeMedia = selectedIndex !== null ? mediaList[selectedIndex] : null;

  return (
    <div className="mt-8 mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-bold text-slate-900">Photos & Videos Gallery</h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
            {media.length} {media.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Thumbnails strip */}
      <div className="flex space-x-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-slate-100 snap-x">
        {media.map((item, idx) => {
          const isVideo = item.media_type === 'video';
          const thumbUrl = getMediaThumbnail(item);

          return (
            <button
              key={item.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className="relative shrink-0 w-44 h-32 sm:w-52 sm:h-36 rounded-2xl overflow-hidden group border-2 border-transparent hover:border-purple-600 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 snap-start bg-slate-900"
            >
              <img
                src={thumbUrl}
                alt={item.caption || `${eventTitle} media ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              
              {/* Media Type Badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                {isVideo ? <Film className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-purple-300" />}
                <span>{isVideo ? 'Video' : 'Photo'}</span>
              </div>

              {/* Video Play Overlay */}
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>
              )}

              {/* Hover Zoom Icon */}
              {!isVideo && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-purple-900/30 transition-opacity">
                  <div className="w-9 h-9 rounded-full bg-white/90 text-purple-900 flex items-center justify-center shadow">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Caption Overlay */}
              {item.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-2 text-left">
                  <p className="text-[11px] font-medium text-white truncate">{item.caption}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox / Modal View */}
      {selectedIndex !== null && activeMedia && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Main Modal Container */}
          <div
            className="relative max-w-5xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Toolbar */}
            <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                  {activeMedia.media_type === 'video' ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                  {activeMedia.media_type === 'video' ? 'Video' : 'Photo'}
                </span>
                <span className="text-slate-400 text-sm font-medium">
                  {selectedIndex + 1} of {media.length}
                </span>
              </div>
              <button
                onClick={() => setSelectedIndex(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Body */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[420px] md:min-h-[500px] overflow-hidden">
              {/* Navigation Arrows */}
              {media.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 z-10 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 border border-slate-700"
                    aria-label="Previous item"
                  >
                    <ChevronLeft className="w-6 h-6 mr-0.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 z-10 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 border border-slate-700"
                    aria-label="Next item"
                  >
                    <ChevronRight className="w-6 h-6 ml-0.5" />
                  </button>
                </>
              )}

              {/* Image or Video Display */}
              {activeMedia.media_type === 'image' ? (
                <img
                  src={activeMedia.media_url}
                  alt={activeMedia.caption || `${eventTitle} photo ${selectedIndex + 1}`}
                  className="max-w-full max-h-[70vh] object-contain select-none"
                />
              ) : (
                (() => {
                  const embedInfo = getVideoEmbedInfo(activeMedia.media_url);
                  if (embedInfo.isEmbed) {
                    return (
                      <iframe
                        src={embedInfo.embedUrl}
                        title={activeMedia.caption || `${eventTitle} video`}
                        className="w-full h-full min-h-[350px] sm:min-h-[460px] border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }
                  return (
                    <video
                      controls
                      autoPlay
                      src={activeMedia.media_url}
                      className="max-w-full max-h-[70vh] object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  );
                })()
              )}
            </div>

            {/* Footer / Caption */}
            {activeMedia.caption && (
              <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 shrink-0">
                <p className="text-slate-200 text-sm font-medium">{activeMedia.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
