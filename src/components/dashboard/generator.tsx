'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { readStreamableValue } from '@ai-sdk/rsc';
import { generateFlashcards } from '@/actions/generate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Zap, Wand2, MessageSquareText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="space-y-8">
      {/* Mode Selector */}
      <div className="flex p-1.5 rounded-2xl glass w-full sm:w-fit gap-1">
        {[
          { id: 'just_questions', label: 'AI Questions', icon: Wand2 },
          { id: 'custom_prompt', label: 'Custom Logic', icon: MessageSquareText },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as PromptMode)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              mode === item.id 
                ? 'bg-white text-black shadow-xl' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <Card className="border-white/[0.08] bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] overflow-hidden">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {mode === 'custom_prompt' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                    System Instructions
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    disabled={loading}
                    rows={4}
                    placeholder="e.g. Focus on edge cases and high-level architectural patterns. Avoid surface level definitions."
                    className="w-full p-6 rounded-2xl bg-white/5 border border-white/[0.08] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none text-white placeholder:text-white/20 transition-all resize-none font-medium"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                Refining Topic
              </label>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. The Byzantine Fault Tolerance Algorithm"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  disabled={loading}
                  className="relative h-14 bg-white/5 border-white/[0.1] focus:border-primary/30 focus:ring-0 text-white placeholder:text-white/20 rounded-2xl px-6 font-semibold"
                />
              </div>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !topic.trim()} 
              className="h-14 px-10 bg-white hover:bg-white/90 text-black font-black rounded-2xl transition-all shadow-xl disabled:opacity-50 min-w-[160px] group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
                  <span>Execute</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modern Skeleton State */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 pt-4"
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-full glass w-fit mx-auto border-blue-500/20">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/70">
                AI Agent Processing: {topic}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass rounded-[2rem] p-8 space-y-4 opacity-50">
                  <div className="h-4 bg-white/10 rounded-full w-24 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-6 bg-white/5 rounded-full w-full animate-pulse" />
                    <div className="h-6 bg-white/5 rounded-full w-4/5 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
