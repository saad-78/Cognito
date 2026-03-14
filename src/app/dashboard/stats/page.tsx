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
    <div className="min-h-screen bg-background selection:bg-black selection:text-white">
      {/* High-Impact Header Area */}
      <div className="px-12 py-24 bg-foreground border-b-8 border-foreground">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-4">
            <h1 className="text-8xl md:text-[10rem] font-black text-background leading-[0.8] tracking-tighter uppercase">
              METRICS
            </h1>
            <p className="text-background/40 text-sm font-black tracking-[0.4em] uppercase">
              Cognitive Evolution Tracking / System Version 2.0.1
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-[10px] font-black text-background/30 uppercase tracking-[0.3em]">Last Sync</div>
            <div className="text-xl font-black text-background tabular-nums uppercase">
              {new Date().toLocaleTimeString('en-GB')}
            </div>
          </div>
        </div>
      </div>

      <main className="py-24">
        <StatsSection stats={stats} forecastData={forecastData} retentionData={retentionData} />
      </main>
    </div>
  );
}
