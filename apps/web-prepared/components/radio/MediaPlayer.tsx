"use client";

import React from 'react';
import { Play, Pause, Volume2, VolumeX, X, Radio } from 'lucide-react';
import { RadioStation } from '@/lib/types';

interface MediaPlayerProps {
  station: RadioStation;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onClose: () => void;
}

export function MediaPlayer({ station, isPlaying, isBuffering, volume, isMuted, onTogglePlay, onVolumeChange, onToggleMute, onClose }: MediaPlayerProps) {
  return (
    <div className="w-full p-4 border-t border-[#E5E5E5] bg-[#FFFFFF] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-[#F0F0F0] overflow-hidden shrink-0">
            <img src={station.cover} alt={station.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#1A1A1A] truncate text-base tracking-tight">{station.name}</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/50 truncate flex items-center gap-1.5 mt-0.5">
              <Radio size={12} className="text-[#E4572E]" /> {isBuffering ? "MENGHUBUNGKAN..." : "SIARAN LANGSUNG"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <button onClick={onTogglePlay} className="w-14 h-14 flex items-center justify-center rounded-full bg-[#1A1A1A] text-[#FFFFFF] hover:bg-[#E4572E] hover:scale-105 transition-all shadow-lg shadow-black/10">
            {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>
        </div>

        <div className="flex items-center justify-end gap-6 flex-1">
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={onToggleMute} className="text-[#1A1A1A]/70 hover:text-[#E4572E] transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={isMuted ? 0 : volume} 
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-24 accent-[#1A1A1A]"
            />
          </div>
          <button onClick={onClose} className="p-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-[#F0F0F0] transition-colors rounded-full">
            <X size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
