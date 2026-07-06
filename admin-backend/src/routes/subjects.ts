import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema";
import { db } from "../db";



const SubjectRouter =express.Router();
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
    .leftJoin(departments,eq(subjects.departmentId,departments.id))
    .where(whereClause);

    const totalCount = countResult[0]?.count?? 0;

    const subjectsList=await db.select({
        ...getTableColumns(subjects),
        department:{...getTableColumns(departments)}
    }).from(subjects).leftJoin(departments,eq(subjects.departmentId,departments.id))
    .where(whereClause)
    .orderBy(desc(subjects.createdAt))
    .limit(limitPage)
    .offset(offset)
    res.status(200).json({
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

export default SubjectRouter