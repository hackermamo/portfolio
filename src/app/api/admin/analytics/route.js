import { db } from "@/db";
import * as schema from "@/db/schema";
import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await db.query.analyticsEvents.findMany({
    orderBy: [desc(schema.analyticsEvents.createdAt)],
    limit: 100
  });

  // Calculate event type counts
  const typeCounts = events.reduce((acc, curr) => {
    acc[curr.eventType] = (acc[curr.eventType] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    totalEvents: events.length,
    events,
    typeCounts
  });
}
