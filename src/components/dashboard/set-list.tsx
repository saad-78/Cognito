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
    <div className="space-y-12">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Intelligence Sets', value: sets.length, icon: Brain, color: 'text-blue-500' },
          { label: 'Active This Week', value: sets.filter(s => s.createdAt && new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: Zap, color: 'text-yellow-500' },
          { label: 'Knowledge Points', value: sets.length * 12, icon: Sparkles, color: 'text-purple-500' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl glass glass-hover relative overflow-hidden group"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white/40 mb-1 uppercase tracking-widest">{stat.label}</div>
                <div className="text-4xl font-black text-white">{stat.value}</div>
              </div>
              <stat.icon className={`w-10 h-10 ${stat.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl" />
          </motion.div>
        ))}
      </div>

      {/* Creation Area */}
      <section className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[2.5rem] blur-2xl opacity-50" />
        <Card className="relative border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">Expand Your Mind</h3>
                <p className="text-white/40 text-sm font-medium">Add a topic to generate AI-powered insights</p>
              </div>
            </div>

            <form ref={formRef} action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2.5">
                <label htmlFor="title" className="block text-xs font-bold text-white/50 uppercase tracking-widest ml-1">
                  Topic or Subject
                </label>
                <Input
                  name="title"
                  id="title"
                  placeholder="e.g. Advanced Bio-Chemistry"
                  required
                  className="h-14 bg-white/5 border-white/[0.08] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 rounded-2xl px-6"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2.5">
                  <label htmlFor="description" className="block text-xs font-bold text-white/50 uppercase tracking-widest ml-1">
                    Context (Optional)
                  </label>
                  <Input
                    name="description"
                    id="description"
                    placeholder="Brief objective..."
                    className="h-14 bg-white/5 border-white/[0.08] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/20 rounded-2xl px-6"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="h-14 px-8 bg-white hover:bg-white/90 text-black font-black rounded-2xl transition-all shadow-xl disabled:opacity-50 group shrink-0"
                >
                  <Sparkles className="w-5 h-5 mr-3 text-blue-600 group-hover:animate-pulse" />
                  Generate
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </section>

      {/* Grid Header */}
      {sets.length > 0 && (
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight text-white px-2">Knowledge Vault</h2>
          <div className="h-px flex-1 mx-8 bg-white/[0.05]" />
          <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">{sets.length} Collections</span>
        </div>
      )}

      {/* Cards Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sets.map((set, idx) => (
            <motion.div
              layout
              key={set.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className="group relative h-full glass glass-hover rounded-3xl overflow-hidden border-white/[0.08] flex flex-col pt-8 pb-6 px-8"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="w-6 h-6 text-white/60 group-hover:text-primary transition-colors" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-xl"
                    onClick={async () => await deleteStudySet(set.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight tracking-tight group-hover:text-primary transition-colors">
                    {set.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
                    {set.description || "Synthesizing intelligence through AI analysis."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    <Calendar className="w-3 h-3 text-blue-500/50" />
                    <span>{set.createdAt ? new Date(set.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Now'}</span>
                  </div>

                  <Link href={`/dashboard/sets/${set.id}`}>
                    <Button
                      variant="ghost"
                      className="group/btn h-10 -mr-4 px-6 text-white/60 hover:text-white font-bold hover:bg-transparent transition-all"
                    >
                      Enter Vault
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
                
                {/* Decorative depth element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
