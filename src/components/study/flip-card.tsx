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
        {/* Front Side - Black Base */}
        <div className="absolute inset-0 backface-hidden">
          <Card className="w-full h-full bg-black flex flex-col items-center justify-center p-20 rounded-none border-4 border-black relative overflow-hidden group-hover:border-foreground/50 transition-all">
             <div className="absolute top-12 left-12 flex items-center gap-4">
                <div className="w-10 h-10 bg-white flex items-center justify-center">
                   <HelpCircle className="w-5 h-5 text-black" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">THEORY</span>
             </div>

             <div className="text-center relative z-10 w-full max-w-2xl px-6">
               <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                 {front}
               </h2>
             </div>

             <div className="absolute bottom-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
               <span>TRANSITION TO INSIGHT</span>
             </div>
          </Card>
        </div>

        {/* Back Side - Pure White Base */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <Card className="w-full h-full bg-white flex flex-col items-center justify-center p-20 rounded-none border-4 border-black relative overflow-hidden transition-all">
             <div className="absolute top-12 left-12 flex items-center gap-4">
                <div className="w-10 h-10 bg-black flex items-center justify-center">
                   <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black">SYNTHESIS</span>
             </div>

             <div className="text-center relative z-10 w-full max-w-2xl px-6">
               <div className="text-xl sm:text-2xl lg:text-4xl font-black text-black leading-tight uppercase tracking-tight">
                 {back}
               </div>
             </div>

             <div className="absolute bottom-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-black/20">
               <span>KNOWLEDGE SEALED</span>
             </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
