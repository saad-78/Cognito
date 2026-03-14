'use client';

import { motion } from 'framer-motion';

type ProgressBarProps = {
  current: number;
  total: number;
  progress: number;
};

export function ProgressBar({ current, total, progress }: ProgressBarProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div className="flex items-baseline gap-4">
          <span className="text-6xl font-black text-foreground tabular-nums tracking-tighter leading-none">
            {current}
          </span>
          <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">
            NODES / {total}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] mb-1">INTENSE</div>
          <div className="text-xl font-black text-foreground tabular-nums">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-6 bg-secondary border border-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 h-full bg-foreground"
        />
      </div>
    </div>
  );
}
