'use client';

import { ArrowLeft, BrainCircuit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  setTitle: string;
  setId: string;
  onFinish: () => void;
};

export function Header({ setTitle, setId, onFinish }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Button
            onClick={onFinish}
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="ml-2 hidden sm:inline font-semibold">Exit</span>
          </Button>
          <div className="h-6 w-px bg-slate-300 hidden sm:block" />
          <div className="flex items-center gap-2 min-w-0">
            <BrainCircuit className="w-6 h-6 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-900 truncate text-sm sm:text-base">
              {setTitle}
            </span>
          </div>
        </div>
        {/* <Button
          onClick={onFinish}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-slate-600 sm:hidden"
        >
          <X className="w-5 h-5" />
        </Button> */}
      </div>
    </header>
  );
}
