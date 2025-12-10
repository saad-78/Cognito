import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, flashcards, users } from '@/db/schema'; // Added users import
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { GeneratorComponent } from '@/components/dashboard/generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { ArrowLeft, BrainCircuit, Sparkles } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SetPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params; // Await params (Next.js 16 requirement)

  if (!session?.user?.id) redirect('/');

  // 1. Resolve REAL User ID to fix the redirect loop
  let realUserId = session.user.id;
  if (session.user.email) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });
    if (dbUser) realUserId = dbUser.id;
  }

  // 2. Fetch Set
  const set = await db.query.studySets.findFirst({
    where: eq(studySets.id, id),
  });

  // 3. Authorization Check
  if (!set || set.userId !== realUserId) {
    redirect('/dashboard');
  }

  const existingCards = await db.query.flashcards.findMany({
    where: eq(flashcards.setId, set.id),
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header (Consistent with Dashboard) */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Link href="/dashboard" className="text-slate-500 hover:text-blue-600 transition-colors">
               <ArrowLeft className="w-5 h-5" />
             </Link>
             <div className="h-6 w-px bg-slate-200 mx-2" />
             <BrainCircuit className="w-6 h-6 text-blue-600" />
             <span className="font-bold text-lg tracking-tight hidden sm:block">Cognitio</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden md:inline">{session.user.name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 max-w-5xl">
        {/* Title Section */}
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{set.title}</h1>
          <p className="text-lg text-slate-500">{set.description || "Master this topic using AI-generated cards."}</p>
        </div>

        {/* The Generator (Hero Section) */}
        <div className="mb-12">
           <GeneratorComponent setId={set.id} />
        </div>

        {/* Content Divider */}
        {existingCards.length > 0 && (
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500 font-medium tracking-wider">
                Current Flashcards ({existingCards.length})
              </span>
            </div>
          </div>
        )}

        {/* Flashcards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {existingCards.map((card, i) => (
            <Card key={card.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 bg-white overflow-hidden">
              <div className="h-1 w-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  Card {i + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 leading-tight mb-2">
                    {card.front}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {card.back}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
