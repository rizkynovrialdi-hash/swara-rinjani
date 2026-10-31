"use client";

import React from 'react';
import { Play, Square } from 'lucide-react';
import { RadioStation } from '@/lib/types';

interface RadioCardProps {
  station: RadioStation;
  isCurrentStation: boolean;
  isPlaying: boolean;
  onPlay: (station: RadioStation) => void;
  featured?: boolean;
}

export function RadioCard({ station, isCurrentStation, isPlaying, onPlay, featured }: RadioCardProps) {
  return (
    <div 
      className={`relative group overflow-hidden transition-all cursor-pointer border bg-[#FFFFFF] ${isCurrentStation ? 'border-[#1A1A1A] shadow-lg shadow-black/5' : 'border-[#E5E5E5] hover:border-[#1A1A1A]'}`}
      onClick={() => onPlay(station)}
    >
      <div className="flex p-5 gap-5">
        <div className="w-24 h-24 bg-[#F0F0F0] overflow-hidden relative shrink-0">
          <img src={station.cover} alt={station.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/40 transition-colors flex items-center justify-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-[#E4572E] text-[#FFFFFF] transition-all transform ${isCurrentStation ? 'scale-100 opacity-100' : 'scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}>
              {isCurrentStation && isPlaying ? <Square className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4 ml-0.5" fill="currentColor" />}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5" style={{ background: '#F0F0F0', color: '#1A1A1A' }}>{station.genre}</span>
            {isCurrentStation && isPlaying && <span className="flex w-2 h-2 rounded-full bg-[#E4572E] animate-pulse" />}
          </div>
          <h3 className="font-extrabold text-lg text-[#1A1A1A] truncate tracking-tight">{station.name}</h3>
          <p className="text-sm font-medium text-[#1A1A1A]/60 truncate mt-1">{station.programSaatIni}</p>
        </div>
      </div>
    </div>
  );
}
