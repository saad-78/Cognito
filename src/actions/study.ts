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

  // Update mastery level
  await db
    .update(flashcards)
    .set({ masteryLevel })
    .where(eq(flashcards.id, cardId));

  revalidatePath(`/dashboard/sets/${set.id}`);
  revalidatePath(`/dashboard/sets/${set.id}/study`);
}
