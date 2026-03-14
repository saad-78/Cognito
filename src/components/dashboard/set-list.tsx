'use client'

import { useOptimistic, useRef, useState } from 'react';
import { createStudySet, deleteStudySet } from '@/actions/sets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Trash2, ArrowRight, Plus, Calendar, BookOpen, Sparkles, Zap, Brain } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type StudySet = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date | null;
};

export function StudySetList({ initialSets }: { initialSets: StudySet[] }) {
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
    });

    formRef.current?.reset();
    await createStudySet(null, formData);
    setIsCreating(false);
  }

  return (
    <div className="space-y-20 py-12 px-12 pb-32">
      {/* Stats Overview - Strict Minimalist */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
        {[
          { label: 'Intelligence Sets', value: sets.length, icon: Brain },
          { label: 'Active This Week', value: sets.filter(s => s.createdAt && new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: Zap },
          { label: 'Knowledge Points', value: sets.length * 12, icon: Sparkles }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 bg-background relative group hover:bg-secondary/50 transition-colors"
          >
            <div className="relative z-10 space-y-4">
              <div className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em]">{stat.label}</div>
              <div className="text-6xl font-black text-foreground tracking-tighter tabular-nums">{stat.value}</div>
            </div>
            <stat.icon className="absolute bottom-10 right-10 w-8 h-8 opacity-5 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>

      {/* Creation Area - High Contrast */}
      <section className="max-w-4xl">
        <div className="mb-12 space-y-2">
           <h3 className="text-4xl font-black text-foreground tracking-tight uppercase">EXPAND VAULT</h3>
           <p className="text-foreground/40 text-sm font-bold tracking-tight">Generate atomic study units from any topic.</p>
        </div>

        <form ref={formRef} action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end border-t border-border pt-12">
          <div className="space-y-3">
            <label htmlFor="title" className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
              TOPIC OR SUBJECT
            </label>
            <Input
              name="title"
              id="title"
              placeholder="E.G. QUANTUM PHYSICS"
              required
              className="bg-background border-2 border-foreground/10 focus:border-foreground"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-3">
              <label htmlFor="description" className="block text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                CONTEXT
              </label>
              <Input
                name="description"
                id="description"
                placeholder="OPTIONAL..."
                className="bg-background border-2 border-foreground/10 focus:border-foreground"
              />
            </div>
            <Button
              type="submit"
              disabled={isCreating}
              className="h-12 px-12 bg-foreground text-background font-black rounded-none uppercase tracking-widest self-end"
            >
              VALIDATE
            </Button>
          </div>
        </form>
      </section>

      {/* Grid Header */}
      {sets.length > 0 && (
        <div className="flex items-center justify-between border-b-4 border-foreground pb-6">
          <h2 className="text-3xl font-black tracking-tighter uppercase">KNOWLEDGE VAULT</h2>
          <span className="text-xs font-black text-foreground tracking-[0.3em] uppercase">{sets.length} COLLECTIONS</span>
        </div>
      )}

      {/* Cards Grid - The Swiss Look */}
      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-px bg-border border border-border">
          {sets.map((set, idx) => (
            <motion.div
              layout
              key={set.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-background p-12 flex flex-col min-h-[400px] hover:bg-secondary/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-12">
                <BookOpen className="w-8 h-8 text-foreground/20 group-hover:text-foreground transition-colors" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 text-foreground/10 hover:text-foreground hover:bg-transparent"
                  onClick={async () => await deleteStudySet(set.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <h3 className="text-3xl font-black text-foreground leading-none tracking-tighter uppercase group-hover:underline underline-offset-8">
                  {set.title}
                </h3>
                <p className="text-foreground/40 text-sm leading-relaxed line-clamp-3 font-bold uppercase tracking-tight">
                  {set.description || "NO CONTEXT PROVIDED."}
                </p>
              </div>

              <div className="flex flex-col gap-8 pt-12">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">
                    <Calendar className="w-3 h-3" />
                    <span>{set.createdAt ? new Date(set.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'NOW'}</span>
                  </div>
                  <Link href={`/dashboard/sets/${set.id}`}>
                    <Button
                      variant="outline"
                      className="h-10 px-6 border-foreground/10 hover:border-foreground"
                    >
                      ENTER
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
