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
    <div className="space-y-24">
      {/* Stats Cluster - Industrial High Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border shadow-sm">
        {[
          { label: 'Neural Collections', value: sets.length, icon: Brain },
          { label: 'Active Patterns', value: '14 Active', icon: Zap },
          { label: 'Retention Score', value: '92%', icon: Sparkles }
        ].map((stat, i) => (
          <div key={i} className="p-12 bg-background relative group overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">{stat.label}</div>
              <div className="text-6xl font-black text-foreground tracking-tighter tabular-nums">{stat.value}</div>
            </div>
            <stat.icon className="absolute bottom-[-20px] right-[-20px] size-40 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" />
          </div>
        ))}
      </div>

      {/* Logic Generator - The Interaction Point */}
      <section className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
           <h2 className="text-4xl font-black uppercase tracking-tighter">Expand Knowledge Vault</h2>
           <p className="text-foreground/40 text-sm font-bold tracking-tight uppercase">Input subject parameters to generate new intelligence nodes.</p>
        </div>

        <form ref={formRef} action={handleCreate} className="flex flex-col md:flex-row gap-4 p-2 bg-secondary border border-border">
          <Input
            name="title"
            placeholder="SUBJECT: E.G. THERMODYNAMICS"
            required
            className="flex-1 h-14 bg-background border-none rounded-none text-xs font-black uppercase tracking-widest px-8 focus-visible:ring-1 focus-visible:ring-accent"
          />
          <Input
            name="description"
            placeholder="OPTIONAL: CONTEXT..."
            className="flex-1 h-14 bg-background border-none rounded-none text-xs font-black uppercase tracking-widest px-8 focus-visible:ring-1 focus-visible:ring-accent"
          />
          <Button
            type="submit"
            disabled={isCreating}
            className="h-14 px-12 bg-accent text-white font-black uppercase tracking-[0.2em] rounded-none hover:bg-accent/90"
          >
            {isCreating ? 'PROCESSING...' : 'GENERATE'}
          </Button>
        </form>
      </section>

      {/* Intelligence Grid */}
      <div className="space-y-12">
        <div className="flex items-end justify-between border-b border-border pb-8">
           <h3 className="text-2xl font-black uppercase tracking-tighter">Active Intelligence Nodes</h3>
           <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">{sets.length} NODES_STABLE</span>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sets.map((set) => (
              <motion.div
                key={set.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group h-full"
              >
                <Card className="premium-lift h-full border border-border bg-background group-hover:bg-background transition-all">
                  <CardHeader className="p-10 pb-6">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 bg-secondary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                        <Library className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <div className="px-3 py-1 bg-secondary text-[8px] font-black uppercase tracking-[0.3em]">
                            {set._count?.cards || 0} NODES
                         </div>
                         <button
                           onClick={async () => await deleteStudySet(set.id)}
                           className="text-[8px] font-black text-foreground/10 hover:text-destructive uppercase tracking-widest transition-colors"
                         >
                           Purge_Node
                         </button>
                      </div>
                    </div>
                    <Link href={`/dashboard/sets/${set.id}`}>
                      <CardTitle className="text-2xl font-black uppercase tracking-tighter leading-none group-hover:text-accent transition-colors">
                        {set.title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mt-6 line-clamp-2">
                      {set.description || "NO_DESCRIPTION_MAPPED"}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-10 pt-0">
                    <Link href={`/dashboard/sets/${set.id}`} className="w-full">
                      <Button variant="outline" className="w-full h-12 rounded-none border-border group-hover:border-accent group-hover:text-accent text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                        Access Neural Vault
                        <ArrowRight className="ml-3 w-4 h-4" />
                      </Button>
                    </Link>
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
