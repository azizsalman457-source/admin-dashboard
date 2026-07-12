import { and, desc, ilike, sql } from "drizzle-orm";
import express from "express";
import { departments } from "../db/schema";
import { db } from "../db";

export const DepartmentRouter = express.Router();

// GET /api/departments
DepartmentRouter.get("/", async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, +page);
    const limitPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPage;

    const filterConditions = [];
    if (search) {
      filterConditions.push(ilike(departments.name, `%${search}%`));
    }
    const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(departments)
      .where(whereClause);
    const totalCount = countResult[0]?.count ?? 0;

    const departmentsList = await db.select()
      .from(departments)
      .where(whereClause)
      .orderBy(desc(departments.createdAt))
      .limit(limitPage)
      .offset(offset);

    res.status(200).json({
      data: departmentsList,
      pagination: {
        page: currentPage,
        limit: limitPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPage),
      },
    });
  } catch (e) {
    console.error("GET /departments error:", e);
    res.status(500).json({ error: "failed to get departments" });
  }
});

// POST /api/departments
DepartmentRouter.post("/", async (req, res) => {
  try {
    const { code, name, description } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: "code and name are required" });
    }

    const [newDepartment] = await db.insert(departments)
      .values({ code, name, description })
      .returning();

    res.status(201).json({ data: newDepartment });

  } catch (e) {
    console.error("POST /departments error:", e);
    res.status(500).json({ error: "failed to create department" });
  }
});