import { and, desc, ilike, sql } from "drizzle-orm";
import express from "express";
import { teachers } from "../db/schema";
import { db } from "../db";

export const teacherRouter = express.Router();

teacherRouter.get("/", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, +page);
    const limitPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPage;

    const filterConditions = [];
    if (search) {
      filterConditions.push(ilike(teachers.name, `%${search}%`));
    }
    const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(teachers)
      .where(whereClause);
    const totalCount = countResult[0]?.count ?? 0;

    const teachersList = await db.select()
      .from(teachers)
      .where(whereClause)
      .orderBy(desc(teachers.createdAt))
      .limit(limitPage)
      .offset(offset);

    res.status(200).json({
      data: teachersList,
      pagination: {
        page: currentPage,
        limit: limitPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPage),
      },
    });
  } catch (e) {
    console.error(`GET /teachers error:`,e);
    res.status(500).json({ error: "failed to get teachers" });
  }
});
teacherRouter.post('/',async(req,res)=>{
  try {
    const{
      name,

    }=req.body;
    if(!name)
    {
      return res.status(400).json({error:'name is required'});
    }
    const[newTeacher]=await db.insert(teachers)
    .values({
      name,
    }).returning();
    res.status(200).json({data:newTeacher});
  } catch (err) {
    console.error(`post/teacher error:`,err);
    res.status(500).json({error:"failed to create teacher"})
    
  }
})