import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await db.query.projects.findMany({
    orderBy: [asc(schema.projects.order)]
  });
  return NextResponse.json(projects);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const technologies = Array.isArray(data.technologies) 
    ? data.technologies 
    : typeof data.technologies === 'string'
      ? data.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : [];

  const [created] = await db.insert(schema.projects).values({
    title: data.title || "",
    description: data.description || "",
    image: data.image || null,
    technologies,
    liveUrl: data.liveUrl || null,
    githubUrl: data.githubUrl || null,
    isFeatured: Boolean(data.isFeatured),
    isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    order: Number(data.order) || 0,
  }).returning();

  return NextResponse.json({ message: "Project created", project: created });
}

export async function PUT(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "Missing Project ID" }, { status: 400 });

  const updateFields = {};
  if (data.title !== undefined) updateFields.title = data.title;
  if (data.description !== undefined) updateFields.description = data.description;
  if (data.image !== undefined) updateFields.image = data.image;
  if (data.liveUrl !== undefined) updateFields.liveUrl = data.liveUrl;
  if (data.githubUrl !== undefined) updateFields.githubUrl = data.githubUrl;
  if (data.isFeatured !== undefined) updateFields.isFeatured = Boolean(data.isFeatured);
  if (data.isPublished !== undefined) updateFields.isPublished = Boolean(data.isPublished);
  if (data.order !== undefined) updateFields.order = Number(data.order);
  if (data.technologies !== undefined) {
    updateFields.technologies = Array.isArray(data.technologies)
      ? data.technologies
      : typeof data.technologies === 'string'
        ? data.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : [];
  }

  await db.update(schema.projects)
    .set(updateFields)
    .where(eq(schema.projects.id, Number(id)));

  return NextResponse.json({ message: "Project updated" });
}

export async function DELETE(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let id;
  try {
    const body = await req.json();
    id = body.id;
  } catch {
    const { searchParams } = new URL(req.url);
    id = searchParams.get('id');
  }

  if (!id) return NextResponse.json({ error: "Missing Project ID" }, { status: 400 });

  await db.delete(schema.projects).where(eq(schema.projects.id, Number(id)));
  return NextResponse.json({ message: "Project deleted successfully" });
}
