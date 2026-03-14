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
    <div className="min-h-screen bg-background flex flex-col overflow-hidden selection:bg-primary/20">
      <StudyHeader 
        setTitle={set.title} 
        onFinish={handleFinish}
      />

      <main className="flex-1 flex flex-col justify-center items-center px-6 py-12 max-w-5xl mx-auto w-full">
        {/* Progress Tracker */}
        <div className="w-full max-w-xl mb-12">
          <ProgressBar progress={progress} current={currentIndex + 1} total={totalCards} />
        </div>

        {/* Card Stage with AnimatePresence for transitions */}
        <div className="relative w-full max-w-3xl aspect-[3/2] sm:aspect-[4/3] perspective-1000">
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
                stiffness: 300,
                damping: 30
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

        {/* Action Controls */}
        <div className="w-full max-w-2xl mt-12">
          <StudyControls
            isFlipped={isFlipped}
            isFirst={currentIndex === 0}
            isLast={currentIndex === totalCards - 1}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onMastery={handleMastery}
          />
        </div>

        {/* Minimalist Keyboard Overlay */}
        <div className="mt-auto pt-12 flex gap-8 items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/10">
           <div className="flex items-center gap-2">
             <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Space</span>
             <span>Flip Card</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Arrows</span>
             <span>Navigate</span>
           </div>
           {isFlipped && (
             <div className="flex items-center gap-2 text-primary">
               <span className="px-2 py-1 rounded bg-primary/10 border border-primary/20">1-4</span>
               <span>Rate Recall</span>
             </div>
           )}
        </div>
      </main>
    </div>
  );
}
