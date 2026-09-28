import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const isProduction = process.env.NODE_ENV === "production";

// Global pool caching for Next.js dev hot-reload
const globalForDb = globalThis as typeof globalThis & {
  __portfolioDbPool?: Pool;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const requiresSsl =
  isProduction ||
  databaseUrl.includes("supabase.co") ||
  databaseUrl.includes("neon.tech") ||
  databaseUrl.includes("sslmode=require");

export const pool: Pool =
  globalForDb.__portfolioDbPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: requiresSsl ? { rejectUnauthorized: false } : false,
    max: isProduction ? 3 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (!isProduction) {
  globalForDb.__portfolioDbPool = pool;
}

export const db = drizzle(pool, { schema });