import { auth } from '@/auth';
import { db } from '@/db';
import { studySets } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StudySetList } from '@/components/dashboard/set-list';
import { Brain, User } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/');

  const userSets = await db.query.studySets.findMany({
    where: eq(studySets.userId, session.user.id!),
    orderBy: [desc(studySets.createdAt)],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-slate-900" />
            <span className="font-bold text-lg tracking-tight text-slate-900">Cognitio</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-xs font-medium text-slate-700 max-w-[150px] sm:max-w-none truncate">
                {session.user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto py-10 px-4 sm:px-6 max-w-6xl">
        <div className="mb-10">
          <div className="mb-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed">
            Manage your learning materials and AI generations.
          </p>
        </div>

        {/* Study Set List */}
        <StudySetList initialSets={userSets} />
      </div>
    </div>
  );
}
