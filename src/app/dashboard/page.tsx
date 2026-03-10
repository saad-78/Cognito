import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, users } from '@/db/schema'; // Add users
import { eq, desc, inArray } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StudySetList } from '@/components/dashboard/set-list';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { BrainCircuit } from 'lucide-react';
import { flashcards } from '@/db/schema';
import { StatsSection } from '@/components/dashboard/stats-section';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  // 1. Resolve the REAL User ID (Handle the ID mismatch)
  let realUserId = session.user.id;
  
  // Try to find user by email first to be safe
  if (session.user.email) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
      });
      if (dbUser) {
        realUserId = dbUser.id;
      }
  }

  // 2. Fetch Data using the REAL ID
  const userSets = await db.query.studySets.findMany({
    where: eq(studySets.userId, realUserId), // <--- Use realUserId
    orderBy: [desc(studySets.createdAt)],
  });

  const setIds = userSets.map((s) => s.id);

  let totalFlashcards = 0;
  let dueToday = 0;
  let newCards = 0;
  let totalReviewed = 0;
  let masteredCards = 0;

  if (setIds.length > 0) {
    const userFlashcards = await db.query.flashcards.findMany({
      where: inArray(flashcards.setId, setIds),
      columns: {
        dueAt: true,
        lastReviewedAt: true,
        intervalDays: true,
      },
    });

    totalFlashcards = userFlashcards.length;

    const now = new Date();
    userFlashcards.forEach((card) => {
      if (card.lastReviewedAt) {
        totalReviewed++;
        if (card.dueAt <= now) {
          dueToday++;
        }
      } else {
        newCards++;
      }
      if (card.intervalDays > 21) {
        masteredCards++;
      }
    });
  }

  const stats = {
    totalSets: userSets.length,
    totalFlashcards,
    dueToday,
    newCards,
    totalReviewed,
    masteredCards,
  };

  return (
    // ... rest of your JSX remains exactly the same ...
    <div className="min-h-screen bg-slate-50/50">
      {/* ... header ... */}
       <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg tracking-tight">Cognitio</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden md:inline">
              {session?.user?.name ?? session?.user?.email ?? 'User'}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      
       <main className="container mx-auto py-12 px-4 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Your Digital Mind
          </h1>
             <p className="mt-2 text-lg text-slate-500 max-w-2xl">
            This is your library of knowledge.
          </p>
        </div>

        <StatsSection stats={stats} />

        <div className="mt-12">
          <StudySetList initialSets={JSON.parse(JSON.stringify(userSets))} />
        </div>
        
        {userSets.length === 0 && (
           <div className="text-center py-20 px-6 border-2 border-dashed rounded-2xl bg-white mt-8">
             <p className="mt-2 text-slate-500">Create your first Study Set.</p>
          </div>
        )}
      </main>
    </div>
  );
}
