'use client';

type ProgressBarProps = {
  current: number;
  total: number;
  progress: number;
};

export function ProgressBar({ current, total, progress }: ProgressBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-4xl font-bold text-slate-900 tabular-nums tracking-tight">
            {current}
          </span>
          <span className="text-lg text-slate-400 ml-2 font-medium">
            / {total}
          </span>
        </div>
        <span className="text-sm font-semibold text-slate-600 tabular-nums">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className="absolute top-0 left-0 h-full bg-black rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
