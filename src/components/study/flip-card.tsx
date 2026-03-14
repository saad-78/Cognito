'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

type FlipCardProps = {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
};

export function FlipCard({ front, back, isFlipped, onFlip }: FlipCardProps) {
  return (
    <div 
      className="w-full h-full cursor-pointer select-none perspective-1000 group"
      onClick={onFlip}
    >
      <motion.div 
        className="relative w-full h-full transform-style-3d duration-700"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 260, 
          damping: 20 
        }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <Card className="w-full h-full glass flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-white/[0.08] relative overflow-hidden group-hover:border-white/[0.15] transition-all">
             <div className="absolute top-10 left-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                   <HelpCircle className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/60">Investigation</span>
             </div>

             <div className="text-center relative z-10 w-full max-w-2xl px-6">
               <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
                 {front}
               </h2>
             </div>

             <div className="absolute bottom-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20">
               <Sparkles className="w-3 h-3" />
               <span>Click to disclose answer</span>
             </div>
             
             {/* Abstract depth background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </Card>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <Card className="w-full h-full bg-white flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-0 relative overflow-hidden group-hover:shadow-[0_0_80px_-20px_rgba(255,255,255,0.3)] transition-all">
             <div className="absolute top-10 left-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black/5 border border-black/10 flex items-center justify-center">
                   <CheckCircle2 className="w-4 h-4 text-black" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Verified Insight</span>
             </div>

             <div className="text-center relative z-10 w-full max-w-2xl px-6">
               <div className="text-lg sm:text-xl lg:text-2xl font-bold text-black leading-relaxed font-sans">
                 {back}
               </div>
             </div>

             <div className="absolute bottom-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black/20">
               <span>Knowledge Synthesized</span>
             </div>

             {/* Contrast glow */}
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
