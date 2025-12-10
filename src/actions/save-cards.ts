'use server'

import { db } from '@/db';
import { flashcards } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function saveFlashcards(setId: string, cards: { front: string; back: string }[]) {
  if (!cards.length) return;
  
  await db.insert(flashcards).values(
    cards.map(c => ({
      setId,
      front: c.front,
      back: c.back
    }))
  );
  
  revalidatePath(`/dashboard/sets/${setId}`);
}
