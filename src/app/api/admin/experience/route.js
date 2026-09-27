import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const experiences = await db.query.experiences.findMany({
    orderBy: [asc(schema.experiences.order)]
  });
  return NextResponse.json(experiences);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const [created] = await db.insert(schema.experiences).values({
    role: data.role || "",
    company: data.company || "",
    location: data.location || "",
    startDate: data.startDate || "",
    endDate: data.endDate || "",
    isCurrent: Boolean(data.isCurrent),
    responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
    companyLogo: data.companyLogo || null,
    order: Number(data.order) || 0,
    isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
  }).returning();

  return NextResponse.json({ message: "Experience created", experience: created });
}

export async function PUT(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.update(schema.experiences).set({
    role: data.role,
    company: data.company,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate,
    isCurrent: Boolean(data.isCurrent),
    responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
    companyLogo: data.companyLogo || null,
    order: Number(data.order) || 0,
    isPublished: Boolean(data.isPublished),
  }).where(eq(schema.experiences.id, id));

  return NextResponse.json({ message: "Experience updated" });
}

export async function DELETE(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.delete(schema.experiences).where(eq(schema.experiences.id, id));
  return NextResponse.json({ message: "Experience deleted" });
}
