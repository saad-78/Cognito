'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { readStreamableValue } from '@ai-sdk/rsc';
import { generateFlashcards } from '@/actions/generate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, BrainCircuit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type PromptMode = 'just_questions' | 'custom_prompt';

export function GeneratorComponent({ setId }: { setId: string }) {
  const router = useRouter();

  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<PromptMode>('just_questions');
  const [customPrompt, setCustomPrompt] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!topic.trim()) return;
    if (mode === 'custom_prompt' && !customPrompt.trim()) return;

    setLoading(true);

    try {
      const { object } = await generateFlashcards({
        setId,
        topic: topic.trim(),
        mode,
        customPrompt: mode === 'custom_prompt' ? customPrompt.trim() : undefined,
      });

      for await (const _partial of readStreamableValue(object)) {
      }

      setTopic('');
      setCustomPrompt('');
      router.refresh();
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm font-medium text-slate-600">Prompt mode</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('just_questions')}
              disabled={loading}
              className={[
                'px-3 py-2 rounded-lg border text-sm transition-colors',
                mode === 'just_questions'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
              ].join(' ')}
            >
              Just questions
            </button>
            <button
              type="button"
              onClick={() => setMode('custom_prompt')}
              disabled={loading}
              className={[
                'px-3 py-2 rounded-lg border text-sm transition-colors',
                mode === 'custom_prompt'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
              ].join(' ')}
            >
              Custom prompt
            </button>
          </div>
        </div>

        {mode === 'custom_prompt' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-600">Custom instructions</div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              disabled={loading}
              rows={4}
              placeholder="e.g. Make cards for interview prep. Include 2 tricky misconception questions. Keep answers under 2 sentences."
              className="w-full p-3 rounded-lg border border-slate-200 bg-white outline-none focus-visible:ring-2 focus-visible:ring-blue-200 text-sm"
            />
          </div>
        )}
      </div>

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
          {loading ? 'Generating...' : 'Create'}
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
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
