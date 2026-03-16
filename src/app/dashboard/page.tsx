import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { StudySetList } from '@/components/dashboard/set-list';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { BrainCircuit, User } from 'lucide-react';
import Link from 'next/link';


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
    <div className="min-h-screen bg-background selection:bg-primary/20 font-sans text-foreground">
      {/* Header - Veridian Noir Command Center */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-12 h-24 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
              <BrainCircuit className="w-6 h-6 text-background" />
            </div>
            <span className="font-heading font-black text-2xl tracking-tighter uppercase group-hover:text-primary transition-colors">Cognitio</span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 bg-white/5 border border-white/10">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name || ''} className="w-6 h-6 rounded-none border border-primary/20" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                {session?.user?.name?.split(' ')[0]} / NEURAL_ID
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-24 px-12">
        <div className="mb-24 space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Command Center</span>
          </div>
          <h1 className="font-heading text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Digital<br />
            <span className="text-primary italic">Mind Collective.</span>
          </h1>
          <p className="text-xl text-white/40 font-medium max-w-2xl leading-relaxed border-l border-white/10 pl-8">
            Welcome back. Your knowledge collective is ready for expansion via atomic neural synthesis.
          </p>
        </div>

        <div className="mt-16 relative">
          <div className="absolute -top-12 right-0 flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Active Nodes</span>
            <div className="h-[2px] w-24 bg-white/5 overflow-hidden">
                <div className="h-full w-12 bg-primary/40 animate-pulse" />
            </div>
          </div>
          <StudySetList initialSets={JSON.parse(JSON.stringify(userSets))} />

          {userSets.length === 0 && (
            <div className="text-center py-48 px-12 border border-dashed border-white/10 bg-white/[0.02] mt-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.02),transparent)] pointer-events-none" />
              <div className="w-24 h-24 bg-white/5 flex items-center justify-center mx-auto mb-10 border border-white/10 transition-transform group-hover:rotate-12">
                <BrainCircuit className="w-12 h-12 text-primary/40" />
              </div>
              <p className="font-heading text-3xl font-black uppercase tracking-tight text-white/80 mb-4">Initialize Neural Node</p>
              <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em] max-w-sm mx-auto">Neural database empty. Click the initialization button below to start synthesis.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
