import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await db.query.education.findMany({
    orderBy: [asc(schema.education.order)]
  });
  return NextResponse.json(items);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const [created] = await db.insert(schema.education).values({
    qualification: data.qualification || "",
    institution: data.institution || "",
    location: data.location || "",
    startYear: data.startYear || "",
    endYear: data.endYear || "",
    description: data.description || "",
    order: Number(data.order) || 0,
    isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
  }).returning();

  return NextResponse.json({ message: "Education entry created", education: created });
}

export async function PUT(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.update(schema.education).set({
    qualification: data.qualification,
    institution: data.institution,
    location: data.location,
    startYear: data.startYear,
    endYear: data.endYear,
    description: data.description || "",
    order: Number(data.order) || 0,
    isPublished: Boolean(data.isPublished),
  }).where(eq(schema.education.id, id));

  return NextResponse.json({ message: "Education entry updated" });
}

export async function DELETE(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.delete(schema.education).where(eq(schema.education.id, id));
  return NextResponse.json({ message: "Education entry deleted" });
}
