import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

const DEFAULT_SETTINGS = {
  siteTitle: "Maman Das - Full-Stack Developer & AI Enthusiast",
  metaDescription: "Personal portfolio and showcase of full-stack development, Generative AI, and software engineering projects by Maman Das.",
  contactEmail: "maman.cse.tcea.2026@gmail.com",
  contactPhone: "+91 98765 43210",
  location: "Sabroom, South Tripura, India",
  resumeUrl: "#",
  copyrightText: "© 2026 Maman Das. All rights reserved.",
  enableContactForm: true,
  showAvailabilityBadge: true,
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const record = await db.query.siteSettings.findFirst({
    where: eq(schema.siteSettings.key, "general")
  });

  return NextResponse.json(record?.value || DEFAULT_SETTINGS);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const existing = await db.query.siteSettings.findFirst({
    where: eq(schema.siteSettings.key, "general")
  });

  if (existing) {
    await db.update(schema.siteSettings)
      .set({ value: body })
      .where(eq(schema.siteSettings.key, "general"));
  } else {
    await db.insert(schema.siteSettings).values({
      key: "general",
      value: body,
    });
  }

  return NextResponse.json({ message: "Settings saved successfully", settings: body });
}
