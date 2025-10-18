CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"experience" text NOT NULL,
	"skills" json DEFAULT '[]'::json,
	"linkedin" text,
	"github" text,
	"portfolio" text,
	"motivation" text NOT NULL,
	"availability" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
