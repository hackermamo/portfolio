import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

const DEFAULT_APPEARANCE = {
  primaryColor: "#2563eb",
  secondaryColor: "#4f46e5",
  accentColor: "#f97316",
  defaultTheme: "dark",
  fontHeading: "Inter",
  heroPattern: "grid",
  showGlowEffects: true,
  enableAnimations: true,
  borderRadius: "rounded-2xl",
  customCss: "",
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const record = await db.query.siteSettings.findFirst({
    where: eq(schema.siteSettings.key, "appearance")
  });

  return NextResponse.json(record?.value || DEFAULT_APPEARANCE);
}

export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const existing = await db.query.siteSettings.findFirst({
    where: eq(schema.siteSettings.key, "appearance")
  });

  if (existing) {
    await db.update(schema.siteSettings)
      .set({ value: body })
      .where(eq(schema.siteSettings.key, "appearance"));
  } else {
    await db.insert(schema.siteSettings).values({
      key: "appearance",
      value: body,
    });
  }

  return NextResponse.json({ message: "Appearance updated successfully", appearance: body });
}
