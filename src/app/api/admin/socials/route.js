import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const socials = await db.query.socialLinks.findMany({
    orderBy: [asc(schema.socialLinks.order)]
  });
  return NextResponse.json(socials);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const [created] = await db.insert(schema.socialLinks).values({
    platform: data.platform || "",
    url: data.url || "",
    icon: data.icon || "Globe",
    order: Number(data.order) || 0,
    isEnabled: data.isEnabled !== undefined ? Boolean(data.isEnabled) : true,
  }).returning();

  return NextResponse.json({ message: "Social link created", social: created });
}

export async function PUT(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.update(schema.socialLinks).set({
    platform: data.platform,
    url: data.url,
    icon: data.icon || "Globe",
    order: Number(data.order) || 0,
    isEnabled: Boolean(data.isEnabled),
  }).where(eq(schema.socialLinks.id, id));

  return NextResponse.json({ message: "Social link updated" });
}

export async function DELETE(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.delete(schema.socialLinks).where(eq(schema.socialLinks.id, id));
  return NextResponse.json({ message: "Social link deleted" });
}
