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
    <div className="space-y-16">
      {/* Mastery Ratings - The Core Interaction */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-foreground border-4 border-foreground"
          >
            {[
              { id: 'again', label: 'VOID', key: '1' },
              { id: 'hard', label: 'STRAIN', key: '2' },
              { id: 'good', label: 'SOLVED', key: '3' },
              { id: 'easy', label: 'MASTER', key: '4' },
            ].map((rating) => (
              <button
                key={rating.id}
                onClick={() => onMastery(rating.id as any)}
                className="group relative bg-background p-10 hover:bg-foreground transition-all flex flex-col items-center justify-center gap-2"
              >
                <span className="text-2xl font-black text-foreground group-hover:text-background tracking-tighter uppercase transition-colors">
                  {rating.label}
                </span>
                <span className="text-[10px] font-black text-foreground/20 group-hover:text-background/40 uppercase tracking-widest transition-colors">
                  KEY [{rating.key}]
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - Minimal Layout */}
      <div className="flex items-center justify-between border-t-2 border-secondary pt-12">
        <Button
          onClick={onPrevious}
          disabled={isFirst}
          variant="outline"
          className="h-14 px-10 rounded-none border-2 border-foreground font-black text-foreground uppercase tracking-widest disabled:opacity-0"
        >
          <ChevronLeft className="w-5 h-5 mr-3" />
          PRIOR
        </Button>

        {!isFlipped && (
           <div className="hidden md:flex flex-col items-center">
              <div className="px-8 py-3 bg-foreground text-background text-xs font-black uppercase tracking-[0.4em]">SPACE TO DISCLOSE</div>
           </div>
        )}

        <Button
          onClick={onNext}
          disabled={isLast}
          variant="outline"
          className="h-14 px-10 rounded-none border-2 border-foreground font-black text-foreground uppercase tracking-widest disabled:opacity-0"
        >
          NEXT
          <ChevronRight className="w-5 h-5 ml-3" />
        </Button>
      </div>
    </div>
  );
}
