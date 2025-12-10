'use server'

import { createStreamableValue } from '@ai-sdk/rsc';
import { streamObject } from 'ai';
import { aiModel } from '@/lib/ai';
import { z } from 'zod';
import { auth } from '@/auth';

// Define the exact structure we want the AI to return
const FlashcardSchema = z.object({
  cards: z.array(z.object({
    front: z.string().describe("The question, term, or concept"),
    back: z.string().describe("The answer, definition, or explanation"),
  })),
});

export async function generateFlashcards(topic: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const stream = createStreamableValue();

  (async () => {
    try {
      const { partialObjectStream } = await streamObject({
        model: aiModel,
        system: "You are an expert tutor. Create 6 high-quality flashcards for the given topic. Keep answers concise.",
        prompt: topic,
        schema: FlashcardSchema,
      });

      for await (const partial of partialObjectStream) {
        stream.update(partial);
      }
      stream.done();
    } catch (e) {
      console.error(e);
      stream.error(e);
    }
  })();

  return { object: stream.value };
}
