import { auth } from '@/auth';
import { db } from '@/db';
import { studySets, flashcards, users, flashcardGenerations } from '@/db/schema';
import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { GeneratorComponent } from '@/components/dashboard/generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { ArrowLeft, BrainCircuit, Sparkles, ChevronDown, Rocket, Layers, History, FastForward } from 'lucide-react';
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

  const cardsByGen = new Map<string, typeof currentCards>();
  for (const card of previousGenCardsRaw) {
    if (!card.generationId) continue;
    const bucket = cardsByGen.get(card.generationId) ?? [];
    bucket.push(card);
    cardsByGen.set(card.generationId, bucket);
  }

  const previousGenCards = previousGenerations.map((g) => ({
    generation: g,
    cards: cardsByGen.get(g.id) ?? [],
  }));

  const hasAnyCards =
    (currentCards?.length ?? 0) > 0 ||
    legacyCards.length > 0 ||
    previousGenCards.some((x) => x.cards.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <BrainCircuit className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm tracking-widest uppercase text-white/40">Vault Explorer</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <Layers className="w-3 h-3" />
              Current Generation
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase">{set.title}</h1>
            <p className="text-lg text-white/40 font-medium max-w-xl">
              {set.description || 'Deconstructing complex concepts into bite-sized intelligence.'}
            </p>
          </div>

          {hasAnyCards && (
            <Link 
              href={`/dashboard/sets/${set.id}/study`}
              className="relative group p-1 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_20px_40px_-12px_rgba(59,130,246,0.5)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="px-8 py-4 bg-background rounded-[14px] flex items-center gap-3">
                <Rocket className="w-5 h-5 text-white animate-pulse" />
                <span className="font-black text-white uppercase tracking-widest text-sm">
                  Initialize Training ({currentCards.length || legacyCards.length})
                </span>
                <FastForward className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>

        <GeneratorComponent setId={set.id} />

        {currentCards.length > 0 && (
          <div className="mt-24 space-y-12">
            <div className="flex items-center gap-4">
               <h2 className="text-sm font-black text-white/20 uppercase tracking-[0.3em]">Insights Grid</h2>
               <div className="h-px flex-1 bg-white/[0.05]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCards.map((card, i) => (
                <div key={card.id} className="group relative glass rounded-[2rem] p-8 overflow-hidden">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Node {i+1}</span>
                       <Sparkles className="w-3 h-3 text-blue-500/30 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight">{card.front}</h3>
                    <p className="text-sm text-white/40 font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                      {card.back}
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {(legacyCards.length > 0 || previousGenCards.length > 0) && (
          <div className="mt-32 space-y-8">
            <div className="flex items-center gap-4 mb-4">
               <History className="w-5 h-5 text-white/20" />
               <h2 className="text-lg font-black text-white uppercase tracking-widest">Temporal Archives</h2>
            </div>

            <div className="space-y-4">
              {legacyCards.length > 0 && (
                <details className="group glass rounded-3xl overflow-hidden border-white/[0.08]">
                  <summary className="cursor-pointer list-none p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Layers className="w-5 h-5 text-white/40" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-widest">Legacy Nodes</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase mt-1">Foundational data layer • {legacyCards.length} Cards</div>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-white/20 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-8 bg-black/40 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-3 gap-6">
                    {legacyCards.map((card) => (
                      <div key={card.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="text-sm font-bold text-white mb-2">{card.front}</div>
                        <div className="text-xs text-white/30 leading-relaxed font-medium">{card.back}</div>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {previousGenCards.map(({ generation, cards }) => (
                <details key={generation.id} className="group glass rounded-3xl overflow-hidden border-white/[0.08]">
                   <summary className="cursor-pointer list-none p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/20 text-primary">
                        <History className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-widest truncate max-w-[200px]">{generation.topic}</div>
                        <div className="text-[10px] font-bold text-white/20 uppercase mt-1">
                          {new Date(generation.createdAt || '').toLocaleDateString()} • {cards.length} Cards
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-white/20 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-8 bg-black/40 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card) => (
                      <div key={card.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="text-sm font-bold text-white mb-2">{card.front}</div>
                        <div className="text-xs text-white/30 leading-relaxed font-medium">{card.back}</div>
                      </div>
                    ))}
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
