import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, users, flashcards } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StatsSection } from '@/components/dashboard/stats-section';
import { addDays, startOfDay, format } from 'date-fns';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { BrainCircuit, User, ArrowLeft, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default async function StatsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  let realUserId = session.user.id;

  if (session.user.email) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
      });
      if (dbUser) {
        realUserId = dbUser.id;
      }
  }

  const userSets = await db.query.studySets.findMany({
    where: eq(studySets.userId, realUserId),
  });

  const setIds = userSets.map((s) => s.id);

  let totalFlashcards = 0;
  let dueToday = 0;
  let newCards = 0;
  let totalReviewed = 0;
  let masteredCards = 0;

  const today = startOfDay(new Date());
  const forecastMap = new Map<string, number>();

  for (let i = 0; i <= 14; i++) {
    forecastMap.set(format(addDays(today, i), 'MMM dd'), 0);
  }

  const retentionBuckets = {
    '0-3 days': 0,
    '4-7 days': 0,
    '8-21 days': 0,
    '21+ days': 0,
  };

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

        if (card.intervalDays <= 3) retentionBuckets['0-3 days']++;
        else if (card.intervalDays <= 7) retentionBuckets['4-7 days']++;
        else if (card.intervalDays <= 21) retentionBuckets['8-21 days']++;
        else retentionBuckets['21+ days']++;

      } else {
        newCards++;
      }

      if (card.intervalDays > 21) {
        masteredCards++;
      }

      if (card.lastReviewedAt || card.dueAt > today) {
         let targetDate = card.dueAt;
         if (targetDate < today) targetDate = today;

         const dateKey = format(targetDate, 'MMM dd');
         if (forecastMap.has(dateKey)) {
             forecastMap.set(dateKey, (forecastMap.get(dateKey) || 0) + 1);
         }
      }
    });
  }

  const forecastData = Array.from(forecastMap, ([date, count]) => ({ date, count }));
  const retentionData = Object.entries(retentionBuckets).map(([name, value]) => ({ name, value }));

  const stats = {
    totalSets: userSets.length,
    totalFlashcards,
    dueToday,
    newCards,
    totalReviewed,
    masteredCards,
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
       <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5 text-white/40 tracking-widest uppercase font-black text-xs">
              Cognitio Analytics
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
               {session.user.image ? (
                 <img src={session.user.image} alt={session.user.name || ''} className="w-5 h-5 rounded-full" />
               ) : (
                 <User className="w-4 h-4 text-white/40" />
               )}
               <span className="text-xs font-semibold text-white/70">
                 {session.user.name?.split(' ')[0]}
               </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

       <main className="max-w-7xl mx-auto py-16 px-6">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4">
            <BarChart3 className="w-3 h-3" />
            Predictive Stats
          </div>
          <h1 className="text-[44px] font-black tracking-tight text-white mb-3">
             Cognitive <span className="text-gradient">Performance</span>
          </h1>
          <p className="text-lg text-white/40 font-medium max-w-2xl">
            Real-time insights into your memory consolidation and learning velocity.
          </p>
        </div>

        <StatsSection stats={stats} forecastData={forecastData} retentionData={retentionData} />
      </main>
    </div>
  );
}
