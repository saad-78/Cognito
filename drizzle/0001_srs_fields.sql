ALTER TABLE "flashcard" ADD COLUMN IF NOT EXISTS "ease_factor" real NOT NULL DEFAULT 2.5;
ALTER TABLE "flashcard" ADD COLUMN IF NOT EXISTS "interval_days" integer NOT NULL DEFAULT 0;
ALTER TABLE "flashcard" ADD COLUMN IF NOT EXISTS "review_count" integer NOT NULL DEFAULT 0;
ALTER TABLE "flashcard" ADD COLUMN IF NOT EXISTS "due_at" timestamp NOT NULL DEFAULT now();
ALTER TABLE "flashcard" ADD COLUMN IF NOT EXISTS "last_reviewed_at" timestamp;
