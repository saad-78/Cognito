import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StudySetList } from '@/components/dashboard/set-list';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { BrainCircuit, User } from 'lucide-react';

export default async function DashboardPage() {
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
    orderBy: [desc(studySets.createdAt)],
  });

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Header */}
       <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Cognitio</span>
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
          <h1 className="text-[44px] font-black tracking-tight text-white mb-3">
             Digital <span className="text-gradient">Mind</span>
          </h1>
          <p className="text-lg text-white/40 font-medium max-w-2xl">
            Welcome back. Your knowledge collective is ready for expansion.
          </p>
        </div>

      <div className="mt-8">
        <StudySetList initialSets={JSON.parse(JSON.stringify(userSets))} />
        
        {userSets.length === 0 && (
           <div className="text-center py-32 px-6 rounded-3xl glass mt-12">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
               <BrainCircuit className="w-10 h-10 text-white/20" />
             </div>
             <p className="text-xl font-bold text-white/80 mb-2">Initialize your first Study Set</p>
             <p className="text-white/40 max-w-md mx-auto">Click the button above to start your AI-powered learning journey.</p>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
