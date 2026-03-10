import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, flashcards, users, flashcardGenerations } from '@/db/schema';
import { and, desc, eq, inArray, isNull, ne } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { GeneratorComponent } from '@/components/dashboard/generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { ArrowLeft, BrainCircuit, Sparkles, ChevronDown } from 'lucide-react';
import Link from 'next/link';


type PageProps = {
  params: Promise<{ id: string }>;
};


export default async function SetPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user?.id) redirect('/');


  let realUserId = session.user.id;
  if (session.user.email) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });
    if (dbUser) realUserId = dbUser.id;
  }


  const set = await db.query.studySets.findFirst({
    where: eq(studySets.id, id),
  });


  if (!set || set.userId !== realUserId) {
    redirect('/dashboard');
  }


  const generations = await db
    .select()
    .from(flashcardGenerations)
    .where(eq(flashcardGenerations.setId, set.id))
    .orderBy(desc(flashcardGenerations.createdAt));


  const latestGeneration = generations[0] ?? null;


  const currentCards =
    latestGeneration
      ? await db
        .select()
        .from(flashcards)
        .where(eq(flashcards.generationId, latestGeneration.id))
        .orderBy(flashcards.order)
      : [];


  const legacyCards = await db
    .select()
    .from(flashcards)
    .where(and(eq(flashcards.setId, set.id), isNull(flashcards.generationId)))
    .orderBy(desc(flashcards.createdAt));


  const previousGenerations = latestGeneration
    ? generations.filter((g) => g.id !== latestGeneration.id)
    : generations;


  const previousGenCardsRaw =
    previousGenerations.length > 0
      ? await db
          .select()
          .from(flashcards)
          .where(inArray(flashcards.generationId, previousGenerations.map((g) => g.id)))
          .orderBy(flashcards.order)
      : [];

  const previousGenCards = previousGenerations.map((g) => ({
    generation: g,
    cards: previousGenCardsRaw.filter((c) => c.generationId === g.id),
  }));


  const hasAnyCards =
    (currentCards?.length ?? 0) > 0 ||
    legacyCards.length > 0 ||
    previousGenCards.some((x) => x.cards.length > 0);


  return (
    <div className="min-h-screen bg-slate-50/50">
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
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{set.title}</h1>
          <p className="text-lg text-slate-500">
            {set.description || 'Master this topic using AI-generated cards.'}
          </p>
        </div>


        <div className="mb-12">
          <GeneratorComponent setId={set.id} />
        </div>


        {hasAnyCards && (
          <div className="mb-8 flex justify-center">
            <Link 
  href={`/dashboard/sets/${set.id}/study`}
  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-slate-200 hover:border-slate-900 overflow-hidden"
>
  {/* Shimmer effect on hover */}
  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-slate-100/50 to-transparent" />
  
  {/* Animated icon with bounce */}
  <BrainCircuit className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
  
  {/* Text with subtle slide */}
  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
    Study Now ({currentCards.length > 0 ? currentCards.length : legacyCards.length} cards)
  </span>
  
  {/* Glow effect on hover */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-slate-200/20 -z-10" />
</Link>



          </div>
        )}


        {hasAnyCards && (
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500 font-medium tracking-wider">
                Current Flashcards ({Math.min(6, currentCards.length)})
              </span>
            </div>
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCards.slice(0, 6).map((card, i) => (
            <Card
              key={card.id}
              className="group hover:shadow-lg transition-all duration-300 border-slate-200 bg-white overflow-hidden"
            >
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


        {(legacyCards.length > 0 || previousGenCards.length > 0) && (
          <div className="mt-14 space-y-5">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Previous flashcards</h2>
                <p className="text-sm text-slate-500">
                  Older generations and legacy cards saved from earlier runs.
                </p>
              </div>
            </div>


            <div className="space-y-4">
              {legacyCards.length > 0 && (
                <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden open:border-blue-200">
                  <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 truncate">Legacy cards</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {legacyCards.length} cards
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Cards created before generation tracking
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </summary>


                  <div className="px-5 pb-5 pt-4 border-t border-slate-100 bg-slate-50/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {legacyCards.map((card) => (
                        <div
                          key={card.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <div className="text-sm font-semibold text-slate-900 line-clamp-3">
                            {card.front}
                          </div>
                          <div className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-5">
                            {card.back}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              )}


              {previousGenCards.map(({ generation, cards }) => (
                <details
                  key={generation.id}
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden open:border-blue-200"
                >
                  <summary className="cursor-pointer select-none px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 truncate">
                          {generation.topic}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          Mode: {String(generation.mode).replace('_', ' ')}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {cards.length} cards
                        </span>
                      </div>


                      <div className="text-xs text-slate-500 mt-1">
                        {generation.createdAt ? new Date(generation.createdAt).toLocaleString() : ''}
                      </div>
                    </div>


                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </summary>


                  <div className="px-5 pb-5 pt-4 border-t border-slate-100 bg-slate-50/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cards.map((card) => (
                        <div
                          key={card.id}
                          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                          <div className="text-sm font-semibold text-slate-900 line-clamp-3">
                            {card.front}
                          </div>
                          <div className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-5">
                            {card.back}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
