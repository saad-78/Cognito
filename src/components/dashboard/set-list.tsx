'use client'

import { useOptimistic, useRef, useState } from 'react';
import { createStudySet, deleteStudySet } from '@/actions/sets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Trash2, ArrowRight, Library, Calendar, BookOpen, Sparkles, Zap, Brain } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type StudySet = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date | null;
  _count?: {
    cards: number;
  };
};

export function StudySetList({ initialSets }: { initialSets: any[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [sets, addOptimisticSet] = useOptimistic(
    initialSets,
    (state, newSet: StudySet) => [newSet, ...state]
  );

  async function handleCreate(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    setIsCreating(true);
    addOptimisticSet({
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date(),
      _count: { cards: 0 }
    });

    formRef.current?.reset();
    await createStudySet(null, formData);
    setIsCreating(false);
  }

  return (
    <div className="space-y-32">
      {/* Stats Cluster - Veridian Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 shadow-2xl">
        {[
          { label: 'Neural Collections', value: sets.length, icon: Brain },
          { label: 'Sync Status', value: '14 ACTIVE', icon: Zap },
          { label: 'Retention Logic', value: '92%', icon: Sparkles }
        ].map((stat, i) => (
          <div key={i} className="p-16 bg-background relative group overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-0 bg-primary/20 transition-all duration-700 group-hover:h-full" />
            <div className="relative z-10 space-y-6">
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">{stat.label}</div>
              <div className="font-heading text-6xl font-black text-foreground tracking-tighter tabular-nums">{stat.value}</div>
            </div>
            <stat.icon className="absolute bottom-[-30px] right-[-30px] size-48 text-primary/5 group-hover:text-primary/10 transition-colors duration-700" />
          </div>
        ))}
      </div>

      {/* Logic Generator - Veridian Command Point */}
      <section className="max-w-5xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-4">
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Initialize Vault.</h2>
            <p className="text-white/30 text-[10px] font-black tracking-[0.4em] uppercase">Input parameters to synthesize new neural nodes.</p>
          </div>
          <div className="h-px flex-1 bg-white/5 mx-8 mb-4 hidden md:block" />
        </div>

        <form ref={formRef} action={handleCreate} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-px bg-white/5 border border-white/5">
          <Input
            name="title"
            placeholder="SUBJECT_ID (E.G. QUANTUM_DYNAMICS)"
            required
            className="h-24 bg-background border-none rounded-none text-[11px] font-black uppercase tracking-[0.3em] px-10 focus-visible:ring-1 focus-visible:ring-primary/20"
          />
          <Input
            name="description"
            placeholder="CONTEXTAL_MAPPING (OPTIONAL)"
            className="h-24 bg-background border-none rounded-none text-[11px] font-black uppercase tracking-[0.3em] px-10 focus-visible:ring-1 focus-visible:ring-primary/20 border-l border-white/5"
          />
          <Button
            type="submit"
            disabled={isCreating}
            className="h-24 px-20 bg-primary text-background font-heading text-[12px] uppercase tracking-[0.4em] font-black rounded-none hover:bg-white transition-all cursor-pointer"
          >
            {isCreating ? 'SYNTHESIZING...' : 'INITIALIZE'}
          </Button>
        </form>
      </section>

      {/* Intelligence Grid */}
      <div className="space-y-16">
        <div className="flex items-end justify-between border-b border-white/5 pb-12">
          <div className="space-y-4">
             <h3 className="font-heading text-3xl font-black uppercase tracking-tight">Access Nodes</h3>
             <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{sets.length} NODES_ONLINE</span>
             </div>
          </div>
          <Library className="w-12 h-12 text-white/5" />
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sets.map((set) => (
              <motion.div
                key={set.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group h-full"
              >
                <Card className="premium-lift h-full border border-white/5 bg-[#022c22]/30 backdrop-blur-md rounded-none relative overflow-hidden group-hover:border-primary/50 transition-all duration-500">
                  <div className="absolute top-0 right-0 p-8">
                     <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                        <Zap className="w-6 h-6 text-white/20 group-hover:text-background" />
                     </div>
                  </div>

                  <CardHeader className="p-12 pb-8">
                    <div className="flex justify-between items-start mb-12">
                      <div className="px-4 py-2 bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                        {set._count?.cards || 0} DATAPOINTS
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                       <Link href={`/dashboard/sets/${set.id}`}>
                         <CardTitle className="font-heading text-3xl font-black uppercase tracking-tight leading-[0.9] group-hover:text-primary transition-colors cursor-pointer">
                           {set.title}
                         </CardTitle>
                       </Link>
                       <CardDescription className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors mt-6 line-clamp-3 leading-relaxed">
                         {set.description || "NO_DESCRIPTION_MAPPED"}
                       </CardDescription>
                    </div>
                  </CardHeader>

                  <CardFooter className="p-12 pt-0 flex flex-col items-start gap-8">
                    <div className="h-px w-full bg-white/5" />
                    <div className="flex items-center justify-between w-full">
                       <Link href={`/dashboard/sets/${set.id}`} className="group/btn">
                         <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary transition-all group-hover/btn:gap-6 cursor-pointer">
                           OPEN_VAULT <ArrowRight className="w-4 h-4" />
                         </div>
                       </Link>
                       <button
                         onClick={async () => await deleteStudySet(set.id)}
                         className="text-[9px] font-black text-white/5 hover:text-destructive uppercase tracking-widest transition-colors cursor-pointer"
                       >
                         PURGE
                       </button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
