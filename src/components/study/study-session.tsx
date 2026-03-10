'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FlipCard } from './flip-card';
import { StudyControls } from './study-controls';
import { ProgressBar } from './progress-bar';
import { Header } from './study-header';
import { updateCardMastery } from '@/actions/study';

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
  const [masteryUpdates, setMasteryUpdates] = useState<Record<string, number>>({});
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

  // Keyboard navigation
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
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleMastery = async (level: 'again' | 'hard' | 'good' | 'easy') => {
    const masteryValue = {
      again: 0,
      hard: 1,
      good: 2,
      easy: 3,
    }[level];

    setMasteryUpdates(prev => ({ ...prev, [currentCard.id]: masteryValue }));

    if (level === 'again') {
      // Requeue the card at the end of the session
      setSessionCards(prev => [...prev, currentCard]);
    }

    try {
      await updateCardMastery(currentCard.id, masteryValue);
    } catch (error) {
      console.error('Failed to update mastery:', error);
      setMasteryUpdates(prev => {
        const { [currentCard.id]: _, ...rest } = prev;
        return rest;
      });
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (currentIndex < sessionCards.length - 1 || level === 'again') {
      timeoutRef.current = setTimeout(() => handleNext(), 300);
    } else {
      timeoutRef.current = setTimeout(() => handleFinish(), 300);
    }
  };

  const handleFinish = () => {
    router.push(`/dashboard/sets/${set.id}`);
  };

  const progress = ((currentIndex + 1) / totalCards) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Header 
        setTitle={set.title} 
        setId={set.id}
        onFinish={handleFinish}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-5xl">
        {/* Progress Section */}
        <div className="mb-8 sm:mb-10">
          <ProgressBar 
            current={currentIndex + 1} 
            total={totalCards} 
            progress={progress}
          />
        </div>

        {/* Card Section */}
        <div className="mb-6 sm:mb-8">
          <FlipCard
            front={currentCard.front}
            back={currentCard.back}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(prev => !prev)}
          />
        </div>

        {/* Controls Section */}
        <div className="space-y-6">
          <StudyControls
            isFlipped={isFlipped}
            isFirst={currentIndex === 0}
            isLast={currentIndex === totalCards - 1}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onMastery={handleMastery}
            onFinish={handleFinish}
          />

          {/* Keyboard Hints - Hidden on mobile and tablet */}
          <div className="hidden lg:block mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
              Keyboard Shortcuts
            </p>
            <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-1.5">
                <kbd className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm">
                  Space
                </kbd>
                <span className="text-xs text-slate-500">Flip</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm">
                  ←
                </kbd>
                <kbd className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm">
                  →
                </kbd>
                <span className="text-xs text-slate-500">Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm">
                  1-4
                </kbd>
                <span className="text-xs text-slate-500">Rate</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
