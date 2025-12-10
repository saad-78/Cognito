import { auth } from '@/auth';
import { db } from '@/db';
import { studySets } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StudySetList } from '@/components/dashboard/set-list';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/');

  const userSets = await db.query.studySets.findMany({
    where: eq(studySets.userId, session.user.id!),
    orderBy: [desc(studySets.createdAt)],
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your learning materials and AI generations.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">
             {session.user.email}
           </span>
        </div>
      </div>

      {/* 3. Pass data to Client Component */}
      <StudySetList initialSets={userSets} />
    </div>
  );
}
