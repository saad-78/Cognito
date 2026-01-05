'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

type StudyControlsProps = {
  isFlipped: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMastery: (level: 'again' | 'hard' | 'good' | 'easy') => void;
  onFinish: () => void;
};

export function StudyControls({
  isFlipped,
  isFirst,
  isLast,
  onPrevious,
  onNext,
  onMastery,
  onFinish,
}: StudyControlsProps) {
  return (
    <div className="space-y-5">
      {/* Mastery Buttons */}
      {isFlipped && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-center text-sm font-semibold text-slate-700 mb-4">
            How well did you know this?
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Again - Refresh/Repeat Icon */}
            <Button
              onClick={() => onMastery('again')}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-2 border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all group"
            >
              <svg 
                className="w-5 h-5 text-slate-700 group-hover:text-slate-900 group-hover:scale-110 transition-all" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              <span className="text-sm font-bold text-slate-900">Again</span>
              <span className="text-xs text-slate-500 lg:block hidden">Press 1</span>
            </Button>

            {/* Hard - Thumbs Down Icon */}
            <Button
              onClick={() => onMastery('hard')}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-2 border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all group"
            >
              <svg 
                className="w-5 h-5 text-slate-700 group-hover:text-slate-900 group-hover:scale-110 transition-all" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
              </svg>
              <span className="text-sm font-bold text-slate-900">Hard</span>
              <span className="text-xs text-slate-500 lg:block hidden">Press 2</span>
            </Button>

            {/* Good - Thumbs Up Icon */}
            <Button
              onClick={() => onMastery('good')}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-2 border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all group"
            >
              <svg 
                className="w-5 h-5 text-slate-700 group-hover:text-slate-900 group-hover:scale-110 transition-all" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
              </svg>
              <span className="text-sm font-bold text-slate-900">Good</span>
              <span className="text-xs text-slate-500 lg:block hidden">Press 3</span>
            </Button>

            {/* Easy - Star/Sparkle Icon */}
            <Button
              onClick={() => onMastery('easy')}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border-2 border-slate-300 hover:border-slate-900 hover:bg-slate-50 transition-all group"
            >
              <svg 
                className="w-5 h-5 text-slate-700 group-hover:text-slate-900 group-hover:scale-110 transition-all" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-sm font-bold text-slate-900">Easy</span>
              <span className="text-xs text-slate-500 lg:block hidden">Press 4</span>
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={onPrevious}
          disabled={isFirst}
          variant="outline"
          size="lg"
          className="flex-1 max-w-[160px] font-semibold border-2 border-slate-300 hover:border-slate-900 disabled:opacity-40 disabled:hover:border-slate-300"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </Button>

        {isLast ? (
          <Button
            onClick={onFinish}
            size="lg"
            className="flex-1 max-w-[160px] bg-slate-900 hover:bg-black text-white font-bold shadow-lg hover:shadow-xl transition-all border-2 border-slate-900 hover:border-black"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Finish
          </Button>
        ) : (
          <Button
            onClick={onNext}
            size="lg"
            className="flex-1 max-w-[160px] bg-slate-900 hover:bg-black text-white font-bold shadow-lg hover:shadow-xl transition-all border-2 border-slate-900 hover:border-black"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
