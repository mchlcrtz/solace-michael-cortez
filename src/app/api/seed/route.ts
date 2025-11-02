import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seed endpoint is disabled in production" },
      { status: 403 }
    );
  }

  try {
    await db.delete(advocates);
    
    const records = await db.insert(advocates).values(advocateData).returning();

    return NextResponse.json({ 
      message: `Seeded ${records.length} advocates`,
      advocates: records.slice(0, 10)
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { 
        error: "Failed to seed database",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
