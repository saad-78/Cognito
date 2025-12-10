import { pgTable, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';

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

export const flashcards = pgTable('flashcard', {
  id: uuid('id').defaultRandom().primaryKey(),
  setId: uuid('set_id').references(() => studySets.id, { onDelete: 'cascade' }).notNull(),
  front: text('front').notNull(),
  back: text('back').notNull(),
  // Real-world: track how often user gets it right for "Spaced Repetition"
  masteryLevel: integer('mastery_level').default(0), 
});
