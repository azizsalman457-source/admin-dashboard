
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

const timestamps={
    createdAt:timestamp('created_at').defaultNow().notNull(),
    updatedAt:timestamp('updated_at').defaultNow().notNull(),
}

export const departments = pgTable('departments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    code:varchar('code',{length: 50}).notNull().unique(),
    name: varchar('name',{length: 250}).notNull(),
    description:varchar('description',{length: 500}),
    ...timestamps


});

export const subjects=pgTable('subjects',{
    id:integer('id').primaryKey().generatedAlwaysAsIdentity(),
    departmentCode:varchar('department_code',{length:50}).notNull().references(()=>departments.code,{onDelete:'restrict'}),
    code:varchar('code',{length: 50}).notNull(),
    name:varchar('name',{length:250}).notNull(),
    description:varchar('description',{length:500}),
    ...timestamps
})
export const teachers=pgTable('teachers',{
    id:integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name:varchar('name',{length:250}).notNull(),
    ...timestamps,
})
export const classes=pgTable('classes',{
    id:integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name:varchar('name',{length:255}).notNull(),
    section:varchar('section',{length:255}).notNull(),
    subjectId:integer('subjectId').references(()=>subjects.id),
    teacherId:integer('teacherId').references(()=>teachers.id),
    capacity: integer("capacity"),                             // max students
    schedule: varchar("schedule", { length: 255 }),
    ...timestamps,

})

export const departmentRelations=relations(departments,({many})=>({
    subjects:many(subjects)
}))
export const subjectRelations=relations(subjects,({many,one})=>({
    departments:one(departments,{
        fields:[subjects.departmentCode],
        references:[departments.code],
    })
}));

export type Department =typeof departments.$inferSelect;
export type NewDepartment =typeof departments.$inferInsert;

export type Subject =typeof subjects.$inferSelect;
export type NewSubject =typeof subjects.$inferInsert;

export type Teacher =typeof teachers.$inferSelect;
export type NewTeacher =typeof teachers.$inferInsert;