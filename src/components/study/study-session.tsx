'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FlipCard } from './flip-card';
import { StudyControls } from './study-controls';
import { ProgressBar } from './progress-bar';
import { StudyHeader } from './study-header';
import { updateCardMastery } from '@/actions/study';
import { motion, AnimatePresence } from 'framer-motion';

type Card = {
  id: string;
  front: string;
  back: string;
  masteryLevel: number | null;
  order: number;
};

type StudySessionProps = {
  set: {
    id: string;
    title: string;
    description: string | null;
  };
  cards: Card[];
  userId: string;
};

export function StudySession({ set, cards, userId }: StudySessionProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [sessionCards, setSessionCards] = useState<Card[]>(cards);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentCard = sessionCards[currentIndex];
  const totalCards = sessionCards.length;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key === 'ArrowRight' && currentIndex < totalCards - 1) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        handlePrevious();
      } else if (e.key === '1' && isFlipped) {
        handleMastery('again');
      } else if (e.key === '2' && isFlipped) {
        handleMastery('hard');
      } else if (e.key === '3' && isFlipped) {
        handleMastery('good');
      } else if (e.key === '4' && isFlipped) {
        handleMastery('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isFlipped, totalCards]);

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleMastery = async (level: 'again' | 'hard' | 'good' | 'easy') => {
    const masteryValue = { again: 0, hard: 1, good: 2, easy: 3 }[level];
    
    if (level === 'again') {
      // Requeue the card at the end of the session
      setSessionCards(prev => [...prev, currentCard]);
    }

    try {
      await updateCardMastery(currentCard.id, masteryValue);
    } catch (error) {
      console.error('Failed to update mastery:', error);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (currentIndex < sessionCards.length - 1 || level === 'again') {
      timeoutRef.current = setTimeout(() => handleNext(), 150);
    } else {
      timeoutRef.current = setTimeout(() => handleFinish(), 150);
    }
  };

  const handleFinish = () => {
    router.push(`/dashboard/sets/${set.id}`);
  };

  const progress = ((currentIndex + 1) / totalCards) * 100;

  const variants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? 300 : -300,
      rotateY: d > 0 ? 10 : -10,
      scale: 0.95
    }),
    center: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      scale: 1
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? -300 : 300,
      rotateY: d > 0 ? -10 : 10,
      scale: 0.95
    })
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden selection:bg-black selection:text-white">
      <StudyHeader 
        setTitle={set.title} 
        onFinish={handleFinish}
      />

      <main className="flex-1 flex flex-col justify-center items-center px-12 py-24 max-w-7xl mx-auto w-full">
        {/* Progress Tracker - Stark and Wide */}
        <div className="w-full max-w-4xl mb-24">
          <ProgressBar progress={progress} current={currentIndex + 1} total={totalCards} />
        </div>

        {/* Card Stage - High impact focal point */}
        <div className="relative w-full max-w-4xl aspect-[2/1] perspective-2000">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 40
              }}
              className="absolute inset-0"
            >
              <FlipCard
                front={currentCard.front}
                back={currentCard.back}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(prev => !prev)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Controls - Border-centric interaction */}
        <div className="w-full max-w-4xl mt-24">
          <StudyControls
            isFlipped={isFlipped}
            isFirst={currentIndex === 0}
            isLast={currentIndex === totalCards - 1}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onMastery={handleMastery}
          />
        </div>

        {/* Interaction Map - Minimalist Overlay */}
        <div className="mt-auto pt-24 flex gap-12 items-center text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
           <div className="flex items-center gap-4">
             <span className="px-3 py-1 bg-secondary text-foreground">SPACE</span>
             <span>FLIP_INSIGHT</span>
           </div>
           <div className="flex items-center gap-4">
             <span className="px-3 py-1 bg-secondary text-foreground">ARROWS</span>
             <span>TRAVERSE</span>
           </div>
           {isFlipped && (
             <div className="flex items-center gap-4 text-foreground">
               <span className="px-3 py-1 bg-foreground text-background">1-4</span>
               <span>RATIFY_RECALL</span>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
