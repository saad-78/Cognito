'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Frown, Smile, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type StudyControlsProps = {
  isFlipped: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMastery: (level: 'again' | 'hard' | 'good' | 'easy') => void;
};

export function StudyControls({
  isFlipped,
  isFirst,
  isLast,
  onPrevious,
  onNext,
  onMastery,
}: StudyControlsProps) {
  return (
    <div className="space-y-10">
      {/* Mastery Ratings */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { id: 'again', label: 'Incognizant', icon: RotateCcw, color: 'hover:text-red-500 hover:border-red-500/50', key: '1' },
              { id: 'hard', label: 'Strained', icon: Frown, color: 'hover:text-orange-500 hover:border-orange-500/50', key: '2' },
              { id: 'good', label: 'Retained', icon: Smile, color: 'hover:text-green-500 hover:border-green-500/50', key: '3' },
              { id: 'easy', label: 'Mastered', icon: Zap, color: 'hover:text-blue-500 hover:border-blue-500/50', key: '4' },
            ].map((rating) => (
              <Button
                key={rating.id}
                onClick={() => onMastery(rating.id as any)}
                variant="outline"
                className={`h-auto py-6 flex flex-col items-center justify-center gap-2 glass rounded-2xl border-white/[0.08] transition-all group ${rating.color}`}
              >
                <rating.icon className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-all duration-300" />
                <div className="space-y-0.5">
                  <div className="text-xs font-black uppercase tracking-widest text-white/80">{rating.label}</div>
                  <div className="text-[10px] font-bold text-white/20 uppercase">Press {rating.key}</div>
                </div>
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Basic Navigation */}
      <div className="flex items-center justify-between gap-6">
        <Button
          onClick={onPrevious}
          disabled={isFirst}
          variant="ghost"
          className="flex-1 max-w-[200px] h-14 rounded-2xl font-bold text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-0 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Prior Insight
        </Button>

        <div className="h-px flex-1 bg-white/[0.05]" />

        <Button
          onClick={onNext}
          disabled={isLast}
          variant="ghost"
          className="flex-1 max-w-[200px] h-14 rounded-2xl font-bold text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-0 transition-opacity"
        >
          Proceed
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
