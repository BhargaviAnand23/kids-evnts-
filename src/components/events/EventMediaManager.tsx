"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/utils/supabase/client';
import { Upload, Plus, Trash2, ArrowLeft, ArrowRight, Film, Image as ImageIcon, Link as LinkIcon, Loader2, Play } from 'lucide-react';
import { getMediaThumbnail } from './EventGallery';

export interface ManagedMediaItem {
  id?: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption?: string;
  display_order?: number;
}

interface EventMediaManagerProps {
  mediaItems: ManagedMediaItem[];
  onChange: (items: ManagedMediaItem[]) => void;
}

export function EventMediaManager({ mediaItems, onChange }: EventMediaManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'image_url' | 'video_url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  // File Upload Handler (Supabase Storage with fallback to base64 Data URL)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setInputError(null);
    const newItems: ManagedMediaItem[] = [...mediaItems];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let uploadedUrl: string | null = null;

      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        try {
          const supabase = createClient();
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const filePath = `events/${fileName}`;

          const { data, error } = await supabase.storage
            .from('event-media')
            .upload(filePath, file);

          if (!error && data) {
            const { data: publicUrlData } = supabase.storage
              .from('event-media')
              .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
              uploadedUrl = publicUrlData.publicUrl;
            }
          }
        } catch (err) {
          console.warn('Supabase storage upload fallback to local preview data url', err);
        }
      }

      // Fallback to FileReader data URL if Supabase storage isn't ready
      if (!uploadedUrl) {
        uploadedUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      }

      if (uploadedUrl) {
        newItems.push({
          media_url: uploadedUrl,
          media_type: 'image',
          caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          display_order: newItems.length + 1
        });
      }
    }

    onChange(newItems);
    setUploading(false);
    // Reset file input
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) {
      setInputError('Please enter a valid Image URL');
      return;
    }
    setInputError(null);
    const updated = [
      ...mediaItems,
      {
        media_url: imageUrl.trim(),
        media_type: 'image' as const,
        caption: imageCaption.trim() || undefined,
        display_order: mediaItems.length + 1
      }
    ];
    onChange(updated);
    setImageUrl('');
    setImageCaption('');
  };

  const handleAddVideoUrl = () => {
    if (!videoUrl.trim()) {
      setInputError('Please enter a valid Video URL (YouTube, Vimeo, or MP4 link)');
      return;
    }
    setInputError(null);
    const updated = [
      ...mediaItems,
      {
        media_url: videoUrl.trim(),
        media_type: 'video' as const,
        caption: videoCaption.trim() || undefined,
        display_order: mediaItems.length + 1
      }
    ];
    onChange(updated);
    setVideoUrl('');
    setVideoCaption('');
  };

  const handleRemove = (index: number) => {
    const updated = mediaItems.filter((_, i) => i !== index).map((item, i) => ({
      ...item,
      display_order: i + 1
    }));
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= mediaItems.length) return;

    const updated = [...mediaItems];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    const reordered = updated.map((item, i) => ({
      ...item,
      display_order: i + 1
    }));
    onChange(reordered);
  };

  const handleCaptionChange = (index: number, caption: string) => {
    const updated = [...mediaItems];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <span>📸</span> Photos & Videos Gallery
        </h3>
        <p className="text-sm text-slate-500">
          Upload event photos or add video links to give parents an engaging preview.
        </p>
      </div>

      {/* Tabs for Add Methods */}
      <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
            activeTab === 'upload' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Photos</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('image_url')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
            activeTab === 'image_url' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Photo URL</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('video_url')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
            activeTab === 'video_url' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Video Link</span>
        </button>
      </div>

      {/* Error display */}
      {inputError && (
        <p className="text-xs text-rose-600 font-medium">{inputError}</p>
      )}

      {/* Tab 1: Upload Photos */}
      {activeTab === 'upload' && (
        <div className="border-2 border-dashed border-purple-200 rounded-2xl p-6 text-center bg-purple-50/30 hover:bg-purple-50/60 transition-colors">
          <input
            type="file"
            id="gallery-file-upload"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <label htmlFor="gallery-file-upload" className="cursor-pointer block">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
            </div>
            <p className="text-sm font-semibold text-slate-800 mb-1">
              {uploading ? 'Processing photos...' : 'Click to select multiple photos'}
            </p>
            <p className="text-xs text-slate-500">Supports PNG, JPG, WEBP formats</p>
          </label>
        </div>
      )}

      {/* Tab 2: Image URL */}
      {activeTab === 'image_url' && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Image URL</label>
            <Input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Caption (Optional)</label>
            <Input
              type="text"
              placeholder="e.g. Kids warming up on the pitch"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
            />
          </div>
          <Button type="button" onClick={handleAddImageUrl} size="sm" className="w-full bg-purple-600 text-white">
            <Plus className="w-4 h-4 mr-1.5" /> Add Photo to Gallery
          </Button>
        </div>
      )}

      {/* Tab 3: Video Link */}
      {activeTab === 'video_url' && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Video Link (YouTube, Vimeo, or MP4 URL)</label>
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=... or MP4 URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Caption (Optional)</label>
            <Input
              type="text"
              placeholder="e.g. Highlight video of last camp"
              value={videoCaption}
              onChange={(e) => setVideoCaption(e.target.value)}
            />
          </div>
          <Button type="button" onClick={handleAddVideoUrl} size="sm" className="w-full bg-purple-600 text-white">
            <Plus className="w-4 h-4 mr-1.5" /> Add Video to Gallery
          </Button>
        </div>
      )}

      {/* Gallery Items Grid */}
      {mediaItems.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Added Gallery Items ({mediaItems.length})
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mediaItems.map((item, idx) => {
              const isVideo = item.media_type === 'video';
              const thumbUrl = getMediaThumbnail(item as any);

              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group"
                >
                  {/* Thumbnail Preview Header */}
                  <div className="relative h-32 bg-slate-900 overflow-hidden shrink-0">
                    <img
                      src={thumbUrl}
                      alt={item.caption || `Item ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Media Type Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                      {isVideo ? <Film className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-purple-300" />}
                      <span>{isVideo ? 'Video' : 'Photo'}</span>
                    </div>

                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                          <Play className="w-4 h-4 ml-0.5 fill-current" />
                        </div>
                      </div>
                    )}

                    {/* Order Controls & Remove Button */}
                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'left')}
                          className="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-purple-600 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                          title="Move earlier"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < mediaItems.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'right')}
                          className="w-7 h-7 rounded-lg bg-slate-900/80 hover:bg-purple-600 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
                          title="Move later"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="w-7 h-7 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center shadow transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Caption Editor */}
                  <div className="p-3 bg-white flex-1 flex flex-col justify-center">
                    <Input
                      type="text"
                      placeholder="Caption..."
                      value={item.caption || ''}
                      onChange={(e) => handleCaptionChange(idx, e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
