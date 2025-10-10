CREATE TABLE "user_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"api_key" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;