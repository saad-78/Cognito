'use client';

import { Card } from '@/components/ui/card';

type FlipCardProps = {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
};

export function FlipCard({ front, back, isFlipped, onFlip }: FlipCardProps) {
  return (
    <div 
      className="perspective-1000 cursor-pointer select-none group"
      onClick={onFlip}
    >
      <div 
        className={`relative w-full transition-all duration-700 ease-out transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          minHeight: '420px',
        }}
      >
        {/* Front - Question */}
        <Card 
          className={`absolute inset-0 backface-hidden flex items-center justify-center p-8 sm:p-12 shadow-2xl border-2 transition-all duration-300 ${
            isFlipped 
              ? 'invisible border-transparent' 
              : 'visible border-slate-200 bg-white group-hover:border-slate-300 group-hover:shadow-3xl'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center space-y-8 w-full">
            {/* Question Badge */}
            <div className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                Question
              </span>
            </div>
            
            {/* Question Text */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight px-4 transition-transform duration-300 group-hover:scale-[1.02]">
              {front}
            </h2>
            
            {/* Hint */}
            <div className="pt-6 space-y-2">
              <p className="text-sm text-slate-500 font-medium">
                Click or press <kbd className="px-2.5 py-1.5 mx-1 text-xs font-semibold bg-slate-100 border border-slate-300 rounded-md shadow-sm">Space</kbd> to reveal
              </p>
            </div>
          </div>
        </Card>

        {/* Back - Answer */}
        <Card 
          className={`absolute inset-0 backface-hidden flex items-center justify-center p-8 sm:p-12 shadow-2xl border-2 transition-all duration-300 ${
            isFlipped 
              ? 'visible border-slate-900 bg-slate-950 group-hover:border-slate-800' 
              : 'invisible border-transparent'
          }`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center space-y-8 w-full">
            {/* Answer Badge */}
            <div className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20">
              <span className="text-xs font-bold text-white uppercase tracking-widest">
                Answer
              </span>
            </div>
            
            {/* Answer Text */}
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-relaxed px-4 transition-transform duration-300 group-hover:scale-[1.02]">
              {back}
            </div>

            {/* Click hint */}
            <div className="pt-4">
              <p className="text-sm text-slate-400 font-medium">
                Click to flip back
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
