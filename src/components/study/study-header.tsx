'use client';

import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

type StudyHeaderProps = {
  setTitle: string;
  onFinish: () => void;
};

export function StudyHeader({ setTitle, onFinish }: StudyHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-foreground">
      <div className="max-w-7xl mx-auto px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Button
            onClick={onFinish}
            variant="outline"
            className="size-12 p-0 rounded-none border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex flex-col">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20 leading-none mb-1">LEARNING PROTOCOL</div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-foreground leading-none">
              {setTitle}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="h-2 w-2 bg-foreground animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">SYSTEM_ACTIVE</span>
        </div>
      </div>
    </header>
  );
}
