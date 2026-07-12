ALTER TABLE "subjects" DROP CONSTRAINT "subjects_department_id_departments_id_fk";
--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "department_code" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_department_code_departments_code_fk" FOREIGN KEY ("department_code") REFERENCES "public"."departments"("code") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subjects" DROP COLUMN "department_id";