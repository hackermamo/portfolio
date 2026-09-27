import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const hero = await db.query.heroContent.findFirst({
    orderBy: [schema.heroContent.updatedAt]
  });
  return NextResponse.json(hero || {});
}

export async function PUT(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { id, ...updateData } = data;

  if (id) {
    await db.update(schema.heroContent).set({ ...updateData, updatedAt: new Date() }).where(eq(schema.heroContent.id, id));
  } else {
    await db.insert(schema.heroContent).values({ ...updateData, updatedAt: new Date() });
  }

  return NextResponse.json({ message: "Hero content updated successfully" });
}
