import db from "../../../db";
import { advocates } from "../../../db/schema";
import { or, ilike, sql, and, gte, lte, gt, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let searchTerm = searchParams.get("search") || "";
    const yearsFilter = searchParams.get("years") || "";
    const titleFilter = searchParams.get("title") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    searchTerm = searchTerm.trim().slice(0, 100);

    const conditions: any[] = [];

    if (searchTerm) {
      const sanitizedSearch = searchTerm.replace(/[%_]/g, "");
      const searchPattern = `%${sanitizedSearch}%`;
      conditions.push(
        or(
          ilike(advocates.firstName, searchPattern),
          ilike(advocates.lastName, searchPattern),
          ilike(advocates.city, searchPattern),
          ilike(advocates.degree, searchPattern),
          sql`CAST(${advocates.yearsOfExperience} AS TEXT) ILIKE ${searchPattern}`,
          sql`${advocates.specialties}::text ILIKE ${searchPattern}`
        )
      );
    }

    if (yearsFilter && yearsFilter !== "all") {
      if (yearsFilter === "0-5") {
        conditions.push(
          and(
            gte(advocates.yearsOfExperience, 0),
            lte(advocates.yearsOfExperience, 5)
          )
        );
      } else if (yearsFilter === "6-10") {
        conditions.push(
          and(
            gte(advocates.yearsOfExperience, 6),
            lte(advocates.yearsOfExperience, 10)
          )
        );
      } else if (yearsFilter === "11-15") {
        conditions.push(
          and(
            gte(advocates.yearsOfExperience, 11),
            lte(advocates.yearsOfExperience, 15)
          )
        );
      } else if (yearsFilter === "16+") {
        conditions.push(gt(advocates.yearsOfExperience, 15));
      }
    }

    if (titleFilter && titleFilter !== "all") {
      conditions.push(eq(advocates.degree, titleFilter));
    }

    let countQuery = db.select({ count: sql<number>`count(*)` }).from(advocates);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions)) as typeof countQuery;
    }

    let dataQuery = db.select().from(advocates);
    if (conditions.length > 0) {
      dataQuery = dataQuery.where(and(...conditions)) as typeof dataQuery;
    }

    const offset = (page - 1) * limit;
    dataQuery = dataQuery.limit(limit).offset(offset);

    const [countResult, data] = await Promise.all([
      countQuery,
      dataQuery
    ]);

    const total = countResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);
    
    const response = NextResponse.json({ 
      data, 
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    
    return response;
  } catch (error) {
    console.error("Error fetching advocates:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
