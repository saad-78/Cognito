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
      <div className="flex justify-between items-end px-1">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
            {current}
          </span>
          <span className="text-sm font-bold text-white/20 uppercase tracking-widest">
            Nodes In Jest / {total}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Saturation</div>
          <div className="text-sm font-black text-primary tabular-nums">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
      
      <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 group">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
