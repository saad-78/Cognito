'use server';

import { auth } from '@/auth';
import { db } from '@/db';
import { flashcards, studySets, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateCardMastery(cardId: string, masteryLevel: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Get real user ID
  let realUserId = session.user.id;
  if (session.user.email) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });
    if (dbUser) realUserId = dbUser.id;
  }

  // Get the card first
  const card = await db.query.flashcards.findFirst({
    where: eq(flashcards.id, cardId),
  });

  if (!card) throw new Error('Card not found');

  // Get the set to verify ownership
  const set = await db.query.studySets.findFirst({
    where: eq(studySets.id, card.setId),
  });

  if (!set) throw new Error('Set not found');
  if (set.userId !== realUserId) throw new Error('Forbidden');

  const normalizedMastery = Math.max(0, Math.min(3, masteryLevel));
  // SM-2 quality: 0-2 = fail (lapse), 3-5 = pass
  const qualityMap: Record<number, number> = {
    0: 0, // again (fail/lapse)
    1: 3, // hard (pass, minimal)
    2: 4, // good (pass, normal)
    3: 5, // easy (pass, perfect)
  };

  const quality = qualityMap[normalizedMastery] ?? 0;
  const prevEaseFactor = card.easeFactor ?? 2.5;
  const prevIntervalDays = card.intervalDays ?? 0;
  const prevReviewCount = card.reviewCount ?? 0;

  // SM-2 ease factor adjustment
  let nextEaseFactor = prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (nextEaseFactor < 1.3) nextEaseFactor = 1.3;

  let nextReviewCount: number;
  let nextIntervalDays: number;
  let isLapse = false;

  if (quality < 3) {
    // Lapse: card needs re-learning
    isLapse = true;
    nextReviewCount = 0; // Reset repetitions on lapse
    nextIntervalDays = 0; // Will use minutes instead
  } else {
    // Pass: advance through SM-2 intervals
    nextReviewCount = prevReviewCount + 1;
    if (prevReviewCount === 0) {
      nextIntervalDays = 1;
    } else if (prevReviewCount === 1) {
      nextIntervalDays = 6;
    } else {
      nextIntervalDays = Math.max(1, Math.round(prevIntervalDays * nextEaseFactor));
    }
    // Easy bonus: multiply interval by 1.3 for perfect recall
    if (quality === 5) {
      nextIntervalDays = Math.max(1, Math.round(nextIntervalDays * 1.3));
    }
  }

  const now = new Date();
  const nextDueAt = new Date(now);
  if (isLapse) {
    // Re-show lapsed cards after 10 minutes (in-session re-learning)
    nextDueAt.setMinutes(nextDueAt.getMinutes() + 10);
  } else {
    nextDueAt.setDate(nextDueAt.getDate() + nextIntervalDays);
  }

  // Update mastery + SRS fields
  await db
    .update(flashcards)
    .set({
      masteryLevel: normalizedMastery,
      easeFactor: nextEaseFactor,
      intervalDays: nextIntervalDays,
      reviewCount: nextReviewCount,
      dueAt: nextDueAt,
      lastReviewedAt: now,
    })
    .where(eq(flashcards.id, cardId));

  revalidatePath(`/dashboard/sets/${set.id}`);
  revalidatePath(`/dashboard/sets/${set.id}/study`);
}
