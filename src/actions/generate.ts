'use server';

import { createStreamableValue } from '@ai-sdk/rsc';
import { streamObject } from 'ai';
import { aiModel } from '@/lib/ai';
import { z } from 'zod';
import { auth } from '@/auth';

import { db } from '@/db';
import { users, studySets, flashcards, flashcardGenerations } from '@/db/schema';
import { eq } from 'drizzle-orm';

const FlashcardSchema = z.object({
  cards: z.array(
    z.object({
      front: z.string().describe('The question, term, or concept'),
      back: z.string().describe('The answer, definition, or explanation'),
    })
  ),
});

type FlashcardPayload = z.infer<typeof FlashcardSchema>;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>> | undefined
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K] | undefined;
};

type FlashcardPartial = DeepPartial<FlashcardPayload>;

const GenerateInputSchema = z.object({
  setId: z.string().uuid(),
  topic: z.string().min(1),
  mode: z.enum(['just_questions', 'custom_prompt']),
  customPrompt: z.string().optional(),
});

function buildPrompts(input: z.infer<typeof GenerateInputSchema>) {
  if (input.mode === 'just_questions') {
    return {
      system:
        'You are an expert tutor. Create exactly 6 high-quality flashcards. Front must be ONLY a question (no answers on the front). Keep answers concise (1–2 sentences).',
      prompt: input.topic,
    };
  }

  return {
    system:
      'You are an expert tutor. Create exactly 6 high-quality flashcards. Follow the user instructions precisely while keeping output structured as flashcards with clear front/back.',
    prompt: `Topic: ${input.topic}\n\nUser instructions:\n${input.customPrompt ?? ''}`,
  };
}

function isCompleteCard(card: unknown): card is { front: string; back: string } {
  return (
    !!card &&
    typeof card === 'object' &&
    typeof (card as any).front === 'string' &&
    typeof (card as any).back === 'string' &&
    (card as any).front.length > 0 &&
    (card as any).back.length > 0
  );
}

export async function generateFlashcards(payload: unknown) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');

  const input = GenerateInputSchema.parse(payload);

  let realUserId = session.user.id;
  if (session.user.email) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });
    if (dbUser) realUserId = dbUser.id;
  }

  const set = await db.query.studySets.findFirst({
    where: eq(studySets.id, input.setId),
  });
  if (!set || set.userId !== realUserId) throw new Error('Forbidden');

  const stream = createStreamableValue<FlashcardPartial>();

  (async () => {
    try {
      const [generation] = await db
        .insert(flashcardGenerations)
        .values({
          setId: set.id,
          userId: realUserId,
          mode: input.mode,
          topic: input.topic,
          customPrompt: input.mode === 'custom_prompt' ? (input.customPrompt ?? '') : null,
        })
        .returning();

      const { system, prompt } = buildPrompts(input);

      const { partialObjectStream } = streamObject({
        model: aiModel,
        system,
        prompt,
        schema: FlashcardSchema,
      });

      let finalCards: Array<{ front: string; back: string }> = [];

      for await (const partial of partialObjectStream) {
        stream.update(partial as FlashcardPartial);

        const maybeCards = (partial as any)?.cards;
        if (Array.isArray(maybeCards)) {
          const complete = maybeCards.filter(isCompleteCard);
          if (complete.length) finalCards = complete;
        }
      }

      if (finalCards.length > 0) {
        await db.insert(flashcards).values(
          finalCards.map((c, idx) => ({
            setId: set.id,
            generationId: generation.id,
            order: idx,
            front: c.front,
            back: c.back,
          }))
        );
      }

      stream.done();
    } catch (e) {
      console.error(e);
      stream.error(e);
    }
  })();

  return { object: stream.value };
}
