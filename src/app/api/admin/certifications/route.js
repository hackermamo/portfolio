import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await db.query.certifications.findMany({
    orderBy: [asc(schema.certifications.order)]
  });
  return NextResponse.json(items);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const [created] = await db.insert(schema.certifications).values({
    name: data.name || "",
    organization: data.organization || "",
    issueDate: data.issueDate || "",
    image: data.image || null,
    credentialUrl: data.credentialUrl || null,
    order: Number(data.order) || 0,
    isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
  }).returning();

  return NextResponse.json({ message: "Certification created", certification: created });
}

export async function PUT(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.update(schema.certifications).set({
    name: data.name,
    organization: data.organization,
    issueDate: data.issueDate,
    image: data.image || null,
    credentialUrl: data.credentialUrl || null,
    order: Number(data.order) || 0,
    isPublished: Boolean(data.isPublished),
  }).where(eq(schema.certifications.id, id));

  return NextResponse.json({ message: "Certification updated" });
}

export async function DELETE(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await db.delete(schema.certifications).where(eq(schema.certifications.id, id));
  return NextResponse.json({ message: "Certification deleted" });
}
