//query logic
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { classes, departments, subjects,teachers } from "../db/schema";
import { db } from "../db";

export const ClassRouter=express.Router();

ClassRouter.get('/',async(req,res)=>{
    try {
        const{search,
              subject,
              teacher,
              page=1,
              limit=10
            }=req.query;

        const currentPage=Math.max(1,+page);
        const limitPage=Math.max(1,+limit);
        const offset=(currentPage-1)*limitPage;

        const filterConditions=[];
        //if search exist 
        if(search){
            filterConditions.push(
                or(
                    ilike(subjects.name,`%${search}%`),
                    ilike(subjects.code,`%${search}%`),
                    ilike(teachers.name,`%${search}%`)
                )
            );
        }
        if(subject)
        {
            filterConditions.push(ilike(subjects.name,`%${subject}%`))
        }
        if(teacher)
        {
            filterConditions.push(ilike(teachers.name,`%${teacher}%`))
        }
       
        const whereClause= filterConditions.length>0 ? and(...filterConditions):undefined;

        const countResult=await db.select({count:sql<number>`count(*)`})
        .from(classes)
        .leftJoin(subjects,eq(classes.subjectId,subjects.id))
        .leftJoin(teachers,eq(classes.teacherId,teachers.id))
        .where(whereClause);

        const totalCount=countResult[0]?.count ??0;

        const classesList=await db.select({
            ...getTableColumns(classes),//main table 
            //relations now
            subject:{...getTableColumns(subjects)},
            teacher:{...getTableColumns(teachers)},
        })
        .from(classes)
        .leftJoin(subjects,eq(classes.subjectId,subjects.id))
        .leftJoin(teachers,eq(classes.teacherId,teachers.id))
        .where(whereClause)
        .orderBy(desc(subjects.createdAt))
        .limit(limitPage)
        .offset(offset);

     res.status(200).json({
        data:classesList,
        pagination:{
            page:currentPage,
            limit:limitPage,
            totalPages:Math.ceil(totalCount/limitPage),
            total:totalCount,
        }
     })
    } catch (e) {
        console.error(`GET/classes error:${e}`)
        res.status(500).json({error:'failed to get subjects'})
    }
});
ClassRouter.post('/',async(req,res)=>{
    try{
        const
        {
            name,
            section,
            subjectId,
            teacherId,
            capacity,
            schedule,

        }=req.body;
       if(!name||!subjectId)
        {
            return res.status(400).json({error:"name and subjectId are requied"});
        }
        const [newClass]=await db.insert(classes)
        .values({
            name,
            subjectId,
            teacherId,
            section,
            capacity,
            schedule,
        }).returning();
        
        res.status(201).json({data:newClass});

    }catch(e)
    {
        console.error(`POST/classes error:${e}`);
        res.status(500).json({error:"failed to create class"})

    }
})

export default ClassRouter;
