import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, users, flashcards } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StatsSection } from '@/components/dashboard/stats-section';
import { addDays, startOfDay, format } from 'date-fns';

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

  // For future analysis (due dates)
  const today = startOfDay(new Date());
  const forecastMap = new Map<string, number>();

  // Initialize forecast map for next 14 days
  for (let i = 0; i <= 14; i++) {
    forecastMap.set(format(addDays(today, i), 'MMM dd'), 0);
  }

  // For retention distribution
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
      // Basic Stats
      if (card.lastReviewedAt) {
        totalReviewed++;
        if (card.dueAt <= now) {
          dueToday++;
        }

        // Retention Distribution (only for reviewed cards)
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

      // Forecast mapping
      // If a card is due in the past or today, we consider it due today for the forecast.
      // If due in the future, we bucket it into the specific date.
      if (card.lastReviewedAt || card.dueAt > today) {
         let targetDate = card.dueAt;
         if (targetDate < today) targetDate = today;

         const dateKey = format(targetDate, 'MMM dd');
         if (forecastMap.has(dateKey)) {
             forecastMap.set(dateKey, forecastMap.get(dateKey)! + 1);
         }
      }
    });
  }

  // Convert map to array for chart
  const forecastData = Array.from(forecastMap, ([date, count]) => ({ date, count }));

  // Convert retention buckets to array
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
    <div className="container mx-auto py-12 px-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
          Study Statistics
        </h1>
        <p className="mt-2 text-lg text-slate-500 max-w-2xl">
          Track your progress, review forecast, and mastery.
        </p>
      </div>

      <StatsSection stats={stats} forecastData={forecastData} retentionData={retentionData} />
    </div>
  );
}
