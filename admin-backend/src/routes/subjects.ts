import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema";
import { db } from "../db";



export const SubjectRouter =express.Router();
//get all subjects with optional search filtering and pagination
SubjectRouter.get("/",async(req,res)=>{
   try {
    const{search,department,page=1,limit=10}=req.query;

    const currentPage=Math.max(1,+page);
    const limitPage=Math.max(1,+limit);

    const offset=(currentPage-1)*limitPage;

    const filterConditions=[];

    //if search query exists,filter them out by subjects name or subjects code
    if(search){
        filterConditions.push(
            or(
                ilike(subjects.name,`%${search}%`),
                ilike(subjects.code,`%${search}%`)
            )
        )
    }
    //if department flters exists then match acc to them
    if(department)
    {
        filterConditions.push(ilike(departments.name,`%${department}%`))

    }
    //combining both the filter cond
    const whereClause = filterConditions.length>0 ? and(...filterConditions):undefined;

    const countResult = await db.select({count:sql<number>`count(*)`})
    .from(subjects)
    .leftJoin(departments,eq(subjects.departmentCode,departments.code))
    .where(whereClause);

    const totalCount = countResult[0]?.count?? 0;

    const subjectsList=await db.select
    ({
        ...getTableColumns(subjects),
        department:{...getTableColumns(departments)}
    })
    .from(subjects)//main table
    .leftJoin(departments,eq(subjects.departmentCode,departments.code))//one leftjoin per relation
    .where(whereClause)
    .orderBy(desc(subjects.createdAt))
    .limit(limitPage)
    .offset(offset);

    res.status(200).json
    ({
        data:subjectsList,
        pagination:{
            page:currentPage,
            limit:limitPage,
            total:totalCount,
            totalPages:Math.ceil(totalCount/limitPage),
        }
    })

   } catch (e) {
    console.error(`GET/subjects error:${e}`)
    res.status(500).json({error:'failed to get subjects'})
   }
})
SubjectRouter.post('/',async (req,res)=>{
    try {
        const{
            name,
            departmentCode,
            code,
            description,
        }=req.body;
        if(!name||!departmentCode)
        {
            return res.status(400).json({error:"name and departmentId are required"});
        }

      const [newSubject]=await db.insert(subjects)
        .values({
            name,
            departmentCode,
            code,
            description,
        }).returning();
        res.status(201).json({data:newSubject});
    } catch (e) {
        console.error(`POST/subject error:${e} `);
        res.status(500).json({error:"failed to create subject"});
    }
});

export default SubjectRouter;