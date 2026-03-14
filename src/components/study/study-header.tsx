'use client';

import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

type StudyHeaderProps = {
  setTitle: string;
  onFinish: () => void;
};

export function StudyHeader({ setTitle, onFinish }: StudyHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-3xl border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button
            onClick={onFinish}
            variant="ghost"
            className="w-10 h-10 p-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 truncate max-w-[200px] sm:max-w-md">
              Focusing on: <span className="text-white">{setTitle}</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-right hidden sm:flex">
          <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Learning Protocol Active</div>
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/10">
            <BrainCircuit className="w-4 h-4 text-white/40" />
          </div>
        </div>
      </div>
    </header>
  );
}
