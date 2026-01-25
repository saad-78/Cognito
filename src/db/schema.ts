import { pgTable, text, timestamp, uuid, integer, jsonb, pgEnum, real } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const studySets = pgTable('study_set', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const promptModeEnum = pgEnum('prompt_mode', ['just_questions', 'custom_prompt']);

export const flashcardGenerations = pgTable('flashcard_generation', {
  id: uuid('id').defaultRandom().primaryKey(),
  setId: uuid('set_id').references(() => studySets.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),

  mode: promptModeEnum('mode').notNull(),

  topic: text('topic').notNull(),

  customPrompt: text('custom_prompt'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const flashcards = pgTable('flashcard', {
  id: uuid('id').defaultRandom().primaryKey(),
  setId: uuid('set_id').references(() => studySets.id, { onDelete: 'cascade' }).notNull(),

  generationId: uuid('generation_id').references(() => flashcardGenerations.id, {
    onDelete: 'set null',
  }),

  order: integer('order').default(0).notNull(),

  front: text('front').notNull(),
  back: text('back').notNull(),

  masteryLevel: integer('mastery_level').default(0),

  // Spaced Repetition (SM-2) fields
  easeFactor: real('ease_factor').default(2.5).notNull(),
  intervalDays: integer('interval_days').default(0).notNull(),
  reviewCount: integer('review_count').default(0).notNull(),
  dueAt: timestamp('due_at').defaultNow().notNull(),
  lastReviewedAt: timestamp('last_reviewed_at'),

  createdAt: timestamp('created_at').defaultNow(),
});
