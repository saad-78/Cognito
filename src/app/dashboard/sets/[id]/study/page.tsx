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

  // Get all cards for this set, ordered
  const cards = await db
    .select()
    .from(flashcards)
    .where(eq(flashcards.setId, set.id))
    .orderBy(flashcards.order);

  if (cards.length === 0) {
    redirect(`/dashboard/sets/${id}`);
  }

  return (
    <StudySession 
      set={set} 
      cards={cards}
      userId={realUserId}
    />
  );
}
