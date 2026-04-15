import React from 'react';
import { useApp } from '../AppContext';

export default function CourseCard({ course }) {
  const { enrollCourse } = useApp();

  return (
    <div 
      className="neo-depth bg-white p-10 flex flex-col border border-[var(--border)] group cursor-pointer transition-all hover:scale-[1.02]"
      id={`course-${course.id}`}
      onClick={() => enrollCourse(course.id)}
    >
      <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-10 transition-transform duration-500 group-hover:rotate-[360deg] text-[28px]">
        <iconify-icon icon={course.thumbnail === 'ml' ? 'lucide:brain' : 'lucide:cpu'}></iconify-icon>
      </div>
      <div className="text-[11px] font-bold tracking-[0.2em] text-[var(--gray-b)] uppercase mb-4">
        {course.partner} / 0{course.id}
      </div>
      <h3 className="clash text-[26px] font-bold leading-tight mb-6 uppercase">
        {course.title}
      </h3>
      <p className="text-[15px] text-[var(--gray-a)] leading-relaxed flex-1 mb-10">
        {course.description}
      </p>
      <div className="pt-8 border-t border-[var(--border)] flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-[12px] font-bold uppercase tracking-widest">${course.price || '299'}.00</div>
          <div className="text-[10px] text-[var(--gray-b)] font-bold uppercase tracking-widest mt-1">+{course.rewardCoins} COINS</div>
        </div>
        <button className="w-12 h-12 bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
          <iconify-icon icon="lucide:arrow-right" class="text-[20px]"></iconify-icon>
        </button>
      </div>
    </div>
  );
}
