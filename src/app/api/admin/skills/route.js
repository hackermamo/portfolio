import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await db.query.skillCategories.findMany({
    with: { skills: true },
    orderBy: [asc(schema.skillCategories.order)]
  });
  return NextResponse.json(categories);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, ...data } = await req.json();

  if (type === 'category') {
    await db.insert(schema.skillCategories).values(data);
  } else if (type === 'skill') {
    await db.insert(schema.skills).values(data);
  }

  return NextResponse.json({ message: "Skill item created" });
}

export async function DELETE(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, type } = await req.json();

  if (type === 'category') {
    await db.delete(schema.skillCategories).where(eq(schema.skillCategories.id, id));
  } else if (type === 'skill') {
    await db.delete(schema.skills).where(eq(schema.skills.id, id));
  }

  return NextResponse.json({ message: "Deleted successfully" });
}
