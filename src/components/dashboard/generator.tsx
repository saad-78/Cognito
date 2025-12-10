'use client'

import { useState } from 'react';
import { readStreamableValue } from '@ai-sdk/rsc';
import { generateFlashcards } from '@/actions/generate';
import { saveFlashcards } from '@/actions/save-cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function GeneratorComponent({ setId }: { setId: string }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    
    try {
      const { object } = await generateFlashcards(topic);
      let finalData = null;
      for await (const partial of readStreamableValue(object)) {
        finalData = partial;
      }
      
      if (finalData?.cards) {
         await saveFlashcards(setId, finalData.cards);
         setTopic('');
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="p-6 border rounded-xl bg-white shadow-sm flex gap-3 items-center">
        <div className="bg-blue-100 p-2 rounded-full">
            <BrainCircuit className="w-5 h-5 text-blue-600" />
        </div>
        <Input 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="What do you want to master today?" 
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          disabled={loading}
          className="border-0 shadow-none focus-visible:ring-0 text-lg placeholder:text-slate-400"
        />
        <Button onClick={handleGenerate} disabled={loading} size="lg">
          {loading ? "Generating..." : "Create"}
        </Button>
      </div>
      
      {/* THE LOADER: Only shows when loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
           {/* Generate 6 fake skeleton cards */}
           {[...Array(6)].map((_, i) => (
             <Card key={i} className="border-2 border-slate-100">
               <CardContent className="p-6 space-y-4">
                 <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                 <div className="h-16 bg-slate-100 rounded w-full animate-pulse" />
               </CardContent>
             </Card>
           ))}
           <div className="col-span-full text-center py-4 text-slate-500 flex items-center justify-center gap-2">
             <Loader2 className="w-4 h-4 animate-spin" />
             <span>Synthesizing knowledge about "{topic}"...</span>
           </div>
        </div>
      )}
    </div>
  );
}
