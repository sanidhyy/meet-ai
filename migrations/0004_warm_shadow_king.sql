ALTER TABLE "user_settings" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;