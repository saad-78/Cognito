import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, users } from '@/db/schema'; // Add users
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StudySetList } from '@/components/dashboard/set-list';

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

  return (
    <div className="container mx-auto py-12 px-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
          Your Sets
        </h1>
        <p className="mt-2 text-lg text-slate-500 max-w-2xl">
          Create, study, and manage your flashcard sets.
        </p>
      </div>

      <div className="mt-8">
        <StudySetList initialSets={JSON.parse(JSON.stringify(userSets))} />
      </div>

      {userSets.length === 0 && (
          <div className="text-center py-20 px-6 border-2 border-dashed rounded-2xl bg-white mt-8">
            <p className="mt-2 text-slate-500">Create your first Study Set.</p>
        </div>
      )}
    </div>
  );
}
