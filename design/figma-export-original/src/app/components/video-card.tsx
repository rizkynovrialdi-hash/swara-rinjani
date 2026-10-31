import React from 'react';
import { Play } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoCardProps {
  video: VideoItem;
  onWatch: (video: VideoItem) => void;
}

export function VideoCard({ video, onWatch }: VideoCardProps) {
  return (
    <div 
      className="group overflow-hidden cursor-pointer border border-[#E5E5E5] bg-[#FFFFFF] transition-all hover:border-[#1A1A1A] hover:shadow-xl hover:shadow-black/5"
      onClick={() => onWatch(video)}
    >
      <div className="relative aspect-video overflow-hidden bg-[#1A1A1A]">
        <img src={video.thumbnail} alt={video.judul} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/20 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#E4572E] text-[#FFFFFF] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 shadow-lg shadow-black/20">
            <Play fill="currentColor" className="ml-1" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-[#1A1A1A] text-[#FFFFFF] text-[10px] font-bold tracking-wider">
          {video.durasi}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1" style={{ background: '#F0F0F0', color: '#E4572E' }}>
            {video.kategori}
          </span>
          <span className="text-xs font-medium text-[#1A1A1A]/50 uppercase tracking-widest">{video.tanggal}</span>
        </div>
        <h3 className="font-extrabold text-[#1A1A1A] text-lg mb-2 line-clamp-2 leading-tight tracking-tight">
          {video.judul}
        </h3>
        <p className="text-sm font-medium text-[#1A1A1A]/70 truncate">{video.pembicara}</p>
      </div>
    </div>
  );
}
