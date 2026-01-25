ALTER TABLE "flashcard" ADD COLUMN "ease_factor" real DEFAULT 2.5 NOT NULL;--> statement-breakpoint
ALTER TABLE "flashcard" ADD COLUMN "interval_days" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "flashcard" ADD COLUMN "review_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "flashcard" ADD COLUMN "due_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "flashcard" ADD COLUMN "last_reviewed_at" timestamp;