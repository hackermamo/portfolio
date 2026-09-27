import { db } from "@/db";
import * as schema from "@/db/schema";
import { count } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sectionsCount = 6; // Fixed count of main sections
    const projectsCount = await db.select({ value: count() }).from(schema.projects);
    const experienceCount = await db.select({ value: count() }).from(schema.experiences);
    const educationCount = await db.select({ value: count() }).from(schema.education);
    const certsCount = await db.select({ value: count() }).from(schema.certifications);
    const messagesCount = await db.select({ value: count() }).from(schema.contactMessages);

    return NextResponse.json({
      sections: sectionsCount,
      projects: projectsCount[0].value,
      experience: experienceCount[0].value,
      education: educationCount[0].value,
      certifications: certsCount[0].value,
      messages: messagesCount[0].value,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
