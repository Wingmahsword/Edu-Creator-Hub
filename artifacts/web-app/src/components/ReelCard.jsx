import React from 'react';

export default function ReelCard({ reel }) {
  return (
    <div className="group relative bg-[#e5e5e5] rounded-[10px] overflow-hidden cursor-pointer transition-all hover:translate-y-[-8px] hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
      <div className="aspect-[9/14] bg-[#ccc] flex items-center justify-center text-[40px] relative overflow-hidden grayscale group-hover:grayscale-0 transition-[filter] duration-700">
        <iconify-icon icon="lucide:play"></iconify-icon>
        <span className="absolute bottom-3 right-3 text-[10px] font-bold glass px-2.5 py-1 rounded-[4px] tracking-[0.05em]">
          {reel.duration || '0:58'}
        </span>
        
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shadow-xl scale-90 group-hover:scale-100 transition-transform">
            <iconify-icon icon="lucide:play" class="text-[20px] ml-1"></iconify-icon>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="text-[10px] text-[var(--gray-b)] font-bold tracking-[0.1em] uppercase mb-1.5">{reel.creatorName}</div>
        <h4 className="clash text-[14px] font-bold leading-tight line-clamp-2">{reel.title}</h4>
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--gray-a)]">
            <iconify-icon icon="lucide:heart"></iconify-icon>
            {reel.likes || '2.4k'}
          </div>
        </div>
      </div>
    </div>
  );
}
