CREATE TABLE "idea_submissions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"submitter_name" text NOT NULL,
	"problem_statement" text NOT NULL,
	"proposed_solution" text NOT NULL,
	"target_audience" text NOT NULL,
	"expected_impact" text NOT NULL,
	"required_expertise" json DEFAULT '[]'::json,
	"success_metrics" text,
	"dependencies" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
