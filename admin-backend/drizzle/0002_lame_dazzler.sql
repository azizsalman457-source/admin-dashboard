ALTER TABLE "subjects" ALTER COLUMN "department_code" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_code_unique" UNIQUE("code");