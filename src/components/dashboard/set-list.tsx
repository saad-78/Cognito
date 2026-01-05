'use client'

import { useOptimistic, useRef } from 'react';
import { createStudySet, deleteStudySet } from '@/actions/sets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Trash2, ArrowRight, Plus, Calendar, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

type StudySet = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date | null;
};

export function StudySetList({ initialSets }: { initialSets: StudySet[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [sets, addOptimisticSet] = useOptimistic(
    initialSets,
    (state, newSet: StudySet) => [newSet, ...state]
  );

  async function handleCreate(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    addOptimisticSet({
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date(),
    });

    formRef.current?.reset();
    await createStudySet(null, formData);
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="text-sm font-medium text-slate-600 mb-1">Total Sets</div>
          <div className="text-3xl font-bold text-slate-900">{sets.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="text-sm font-medium text-slate-600 mb-1">This Week</div>
          <div className="text-3xl font-bold text-slate-900">
            {sets.filter(s => s.createdAt && new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white">
          <div className="text-sm font-medium text-slate-600 mb-1">In Progress</div>
          <div className="text-3xl font-bold text-slate-900">{sets.length}</div>
        </div>
      </div>

      {/* Creation Form - Notion-inspired */}
      <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="46" height="46" rx="7" stroke="black" strokeWidth="2" fill="white" />
              <path d="M16 14H28C29.1046 14 30 14.8954 30 16V32C30 33.1046 29.1046 34 28 34H16V14Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 34C16 32.8954 16.8954 32 18 32H30" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 20H26" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <path d="M20 24H26" stroke="black" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Create New Study Set</h3>
              <p className="text-sm text-slate-500">Generate AI-powered flashcards in seconds</p>
            </div>
          </div>

          <form ref={formRef} action={handleCreate} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                  Subject Title
                </label>
                <Input
                  name="title"
                  id="title"
                  placeholder="e.g., Quantum Physics, React Hooks, World History..."
                  required
                  className="h-11 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-base placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                  Description <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                </label>
                <Input
                  name="description"
                  id="description"
                  placeholder="Add context about what you're learning..."
                  className="h-11 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-base placeholder:text-slate-400"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-slate-900 hover:bg-black text-white font-semibold shadow-sm hover:shadow-md transition-all text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Study Set
            </Button>
          </form>
        </div>
      </Card>

      {/* Section Header */}
      {sets.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Study Sets</h2>
            <p className="text-sm text-slate-500 mt-0.5">{sets.length} {sets.length === 1 ? 'set' : 'sets'} created</p>
          </div>
        </div>
      )}

      {/* Empty State - Linear-inspired */}
      {sets.length === 0 && (
        <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No study sets yet</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Create your first study set above to start generating AI-powered flashcards instantly.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Llama 3.3</span>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid - HubSpot-inspired */}
      {sets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map((set) => (
            <Card
              key={set.id}
              className="group relative border-2 border-slate-200 hover:border-slate-900 bg-white hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-slate-700" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all -mt-1 -mr-1"
                    onClick={async () => await deleteStudySet(set.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <CardTitle className="text-base font-bold text-slate-900 line-clamp-2 leading-tight min-h-[2.5rem]">
                  {set.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-slate-600 leading-relaxed min-h-[2.5rem]">
                  {set.description || "No description"}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {set.createdAt && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(set.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                )}

                <Link href={`/dashboard/sets/${set.id}`} className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium transition-all group/btn -mr-2"
                  >
                    Open
                    <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
