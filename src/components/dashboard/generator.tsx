'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { readStreamableValue } from '@ai-sdk/rsc';
import { generateFlashcards } from '@/actions/generate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Zap } from 'lucide-react';
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
      {/* Prompt Mode Selector */}
      <Card className="border-2 border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          {/* <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-slate-700" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Generation Mode</div>
                <div className="text-xs text-slate-500">Choose how to create flashcards</div>
              </div>
            </div>
          </div> */}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode('just_questions')}
              disabled={loading}
              className={[
                'flex-1 px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all',
                mode === 'just_questions'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                loading && 'opacity-50 cursor-not-allowed',
              ].join(' ')}
            >
              <div className="text-left">
                <div>Smart Questions</div>
                <div className={`text-xs mt-1 ${mode === 'just_questions' ? 'text-white/70' : 'text-slate-500'}`}>
                  AI generates optimal questions
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMode('custom_prompt')}
              disabled={loading}
              className={[
                'flex-1 px-4 py-3 rounded-lg border-2 text-sm font-semibold transition-all',
                mode === 'custom_prompt'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50',
                loading && 'opacity-50 cursor-not-allowed',
              ].join(' ')}
            >
              <div className="text-left">
                <div>Custom Instructions</div>
                <div className={`text-xs mt-1 ${mode === 'custom_prompt' ? 'text-white/70' : 'text-slate-500'}`}>
                  Define your own requirements
                </div>
              </div>
            </button>
          </div>

          {mode === 'custom_prompt' && (
            <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-slate-700">
                Custom Instructions
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                disabled={loading}
                rows={4}
                placeholder="e.g., Make cards for interview prep. Include 2 tricky misconception questions. Keep answers under 2 sentences."
                className="w-full p-3 rounded-lg border-2 border-slate-200 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-sm placeholder:text-slate-400 transition-colors resize-none"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Input Section */}
      <Card className="border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/30 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="46" height="46" rx="7" stroke="black" strokeWidth="2" fill="white"/>
              <path d="M24 12L26.854 19.146L34 22L26.854 24.854L24 32L21.146 24.854L14 22L21.146 19.146L24 12Z" fill="black"/>
              <path d="M32 14L33.472 17.528L37 19L33.472 20.472L32 24L30.528 20.472L27 19L30.528 17.528L32 14Z" fill="black" opacity="0.5"/>
              <circle cx="17" cy="31" r="2" fill="black" opacity="0.3"/>
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">Generate Flashcards</h3>
              <p className="text-sm text-slate-600">Enter any topic and let AI create perfect study materials</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Quantum Mechanics, React Hooks, Ancient Rome..."
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                disabled={loading}
                className="h-12 border-2 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-base placeholder:text-slate-400 bg-white"
              />
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !topic.trim()} 
              size="lg"
              className="h-12 px-6 bg-slate-900 hover:bg-black text-white font-semibold shadow-sm hover:shadow-md transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  {/* <Sparkles className="w-4 h-4 mr-2" /> */}
                  Generate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
            <span className="text-sm font-medium text-slate-700">
              Generating flashcards about <span className="font-bold">"{topic}"</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-2 border-slate-200 bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 bg-slate-200 rounded w-16 animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded w-12 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-slate-100 rounded w-4/5 animate-pulse" />
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <div className="h-3 bg-slate-100 rounded w-2/3 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
