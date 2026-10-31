import React from 'react';
import { Globe2 } from 'lucide-react';

export function Globe({ size = 300 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center rounded-full bg-[#0a121a] border border-[#00c86e]/20 shadow-[0_0_40px_rgba(0,200,110,0.1)]">
      <Globe2 size={size * 0.4} className="text-[#00c86e] opacity-50" />
      <div className="absolute inset-0 rounded-full border border-[#00c86e]/30 animate-[spin_10s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
    </div>
  );
}
