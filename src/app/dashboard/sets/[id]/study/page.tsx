import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, flashcards, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StudySession } from '@/components/study/study-session';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudyPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;
  
  if (!session?.user?.id) redirect('/');

  // Get real user ID (same logic from set page)
  let realUserId = session.user.id;
  if (session.user.email) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });
    if (dbUser) realUserId = dbUser.id;
  }

  // Fetch study set with authorization
  const set = await db.query.studySets.findFirst({
    where: eq(studySets.id, id),
  });

  if (!set || set.userId !== realUserId) {
    redirect('/dashboard');
  }

  // Get all cards for this set
  const cards = await db
    .select()
    .from(flashcards)
    .where(eq(flashcards.setId, set.id));

  if (cards.length === 0) {
    redirect(`/dashboard/sets/${id}`);
  }

  const now = new Date();
  
  // Due reviews: cards that have been reviewed before and are due now
  const dueReviewed = cards
    .filter(card => card.lastReviewedAt && card.dueAt && card.dueAt <= now)
    .sort((a, b) => a.dueAt!.getTime() - b.dueAt!.getTime());

  // New cards: never reviewed before
  const newCards = cards
    .filter(card => !card.lastReviewedAt)
    .sort((a, b) => a.order - b.order);

  const mixed: typeof cards = [];
  const reviewChunkSize = 3;

  if (dueReviewed.length === 0) {
    mixed.push(...newCards);
  } else if (newCards.length === 0) {
    mixed.push(...dueReviewed);
  } else {
    let reviewIndex = 0;
    let newIndex = 0;

    while (reviewIndex < dueReviewed.length || newIndex < newCards.length) {
      for (let i = 0; i < reviewChunkSize && reviewIndex < dueReviewed.length; i += 1) {
        mixed.push(dueReviewed[reviewIndex]);
        reviewIndex += 1;
      }

      if (newIndex < newCards.length) {
        mixed.push(newCards[newIndex]);
        newIndex += 1;
      }

      if (reviewIndex >= dueReviewed.length && newIndex < newCards.length) {
        mixed.push(...newCards.slice(newIndex));
        break;
      }
    }
  }

  const orderedCards = mixed.length > 0
    ? mixed
    : cards
        .filter(card => card.lastReviewedAt && card.dueAt)
        .sort((a, b) => a.dueAt!.getTime() - b.dueAt!.getTime())
        .slice(0, 10);

  if (orderedCards.length === 0) {
    redirect(`/dashboard/sets/${id}`);
  }

  return (
    <StudySession 
      set={set} 
      cards={orderedCards}
      userId={realUserId}
    />
  );
}
