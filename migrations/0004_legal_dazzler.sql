CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"inquiry_type" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
