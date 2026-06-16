
import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`relative ${sizes[size]} transition-transform duration-300 group-hover:scale-110`}>
        <svg viewBox="0 0 100 100" className="fill-neon-cyan">
          <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M30 40 Q50 20 70 40 Q60 50 50 60 Q40 50 30 40 Z" fill="currentColor" />
          <circle cx="40" cy="35" r="3" fill="#0a192f" />
          <circle cx="60" cy="35" r="3" fill="#0a192f" />
          <path d="M45 45 L50 50 L55 45" fill="none" stroke="#0a192f" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-neon-cyan rounded-full animate-pulse blur-[2px]"></div>
      </div>
      <span className={`font-bold tracking-tighter text-white ${size === 'lg' ? 'text-4xl' : 'text-xl'}`}>
        BLACK<span className="text-neon-cyan"> CAT</span>
      </span>
    </div>
  );
};
