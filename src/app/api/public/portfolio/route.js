import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const hero = await db.query.heroContent.findFirst({
      where: eq(schema.heroContent.isPublished, true),
      orderBy: [schema.heroContent.updatedAt]
    });

    const skillCategories = await db.query.skillCategories.findMany({
      where: eq(schema.skillCategories.isPublished, true),
      with: {
        skills: true
      },
      orderBy: [asc(schema.skillCategories.order)]
    });

    const projects = await db.query.projects.findMany({
      where: eq(schema.projects.isPublished, true),
      orderBy: [asc(schema.projects.order)]
    });

    const experiences = await db.query.experiences.findMany({
      where: eq(schema.experiences.isPublished, true),
      orderBy: [asc(schema.experiences.order)]
    });

    const education = await db.query.education.findMany({
      where: eq(schema.education.isPublished, true),
      orderBy: [asc(schema.education.order)]
    });

    const certifications = await db.query.certifications.findMany({
      where: eq(schema.certifications.isPublished, true),
      orderBy: [asc(schema.certifications.order)]
    });

    const socialLinks = await db.query.socialLinks.findMany({
      where: eq(schema.socialLinks.isEnabled, true),
      orderBy: [asc(schema.socialLinks.order)]
    });

    return NextResponse.json({
      hero,
      skillCategories,
      projects,
      experiences,
      education,
      certifications,
      socialLinks
    });
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
