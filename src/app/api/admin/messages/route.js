import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await db.query.contactMessages.findMany({
    orderBy: [desc(schema.contactMessages.createdAt)]
  });
  return NextResponse.json(messages);
}

export async function PUT(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, isRead } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.update(schema.contactMessages)
    .set({ isRead: Boolean(isRead) })
    .where(eq(schema.contactMessages.id, id));

  return NextResponse.json({ message: "Message status updated" });
}

export async function DELETE(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
  return NextResponse.json({ message: "Message deleted" });
}
