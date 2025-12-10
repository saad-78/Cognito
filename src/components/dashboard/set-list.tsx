'use client'

import { useOptimistic, useRef } from 'react';
import { createStudySet, deleteStudySet } from '@/actions/sets'; // Import server actions
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Trash2, ArrowRight } from 'lucide-react'; // Make sure to install lucide-react
import Link from 'next/link';

type StudySet = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date | null;
};

export function StudySetList({ initialSets }: { initialSets: StudySet[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  
  // 1. The Optimistic Hook
  const [sets, addOptimisticSet] = useOptimistic(
    initialSets,
    (state, newSet: StudySet) => [newSet, ...state] // Add new set to TOP
  );

  async function handleCreate(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    // 2. Instant UI Update
    addOptimisticSet({
      id: crypto.randomUUID(), // Temp ID
      title,
      description,
      createdAt: new Date(),
    });

    formRef.current?.reset();

    // 3. Server Call
    await createStudySet(null, formData);
  }

  return (
    <div className="space-y-8">
      {/* Creation Form */}
      <Card className="p-6 border-dashed border-2 shadow-none bg-slate-50/50">
        <form ref={formRef} action={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="grid gap-2 flex-1 w-full">
            <label htmlFor="title" className="text-sm font-medium">New Subject</label>
            <Input name="title" id="title" placeholder="e.g. Advanced React Patterns" required />
          </div>
          <div className="grid gap-2 flex-1 w-full">
             <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
             <Input name="description" placeholder="Notes for the final exam..." />
          </div>
          <Button type="submit" className="w-full md:w-auto">Create Set</Button>
        </form>
      </Card>

      {/* The List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sets.map((set) => (
          <Card key={set.id} className="hover:shadow-md transition-all group relative">
            <CardHeader>
              <CardTitle className="truncate">{set.title}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">
                {set.description || "No description provided."}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
              <Link href={`/dashboard/sets/${set.id}`}>
                <Button variant="outline" size="sm">
                  View <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={async () => await deleteStudySet(set.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
