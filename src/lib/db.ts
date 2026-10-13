import { createHash } from "crypto";
import type { TripPlanResponse } from "@/types/domain";

type PrismaClientLike = {
  cachedTripPlan: {
    findUnique: (args: {
      where: { fingerprint: string };
    }) => Promise<{ payload: unknown; expiresAt: Date } | null>;
    upsert: (args: {
      where: { fingerprint: string };
      create: {
        fingerprint: string;
        payload: unknown;
        expiresAt: Date;
      };
      update: { payload: unknown; expiresAt: Date };
    }) => Promise<unknown>;
  };
};

const memoryCache = new Map<
  string,
  { payload: TripPlanResponse; expiresAt: number }
>();

let prisma: PrismaClientLike | null = null;

async function getPrisma(): Promise<PrismaClientLike | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (prisma) return prisma;
  try {
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { Pool } = await import("pg");
    const { PrismaClient } = await import("@/generated/prisma/client");
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter }) as unknown as PrismaClientLike;
    return prisma;
  } catch {
    return null;
  }
}

export function planFingerprint(plan: TripPlanResponse): string {
  const { freeText, ...rest } = plan.request;
  return createHash("sha256")
    .update(JSON.stringify(rest))
    .update(freeText ?? "")
    .digest("hex");
}

export async function readCachedPlan(
  fingerprint: string,
): Promise<TripPlanResponse | null> {
  const mem = memoryCache.get(fingerprint);
  if (mem && mem.expiresAt > Date.now()) return mem.payload;
  if (mem) memoryCache.delete(fingerprint);

  const client = await getPrisma();
  if (!client) return null;
  try {
    const row = await client.cachedTripPlan.findUnique({
      where: { fingerprint },
    });
    if (!row || row.expiresAt < new Date()) return null;
    return row.payload as TripPlanResponse;
  } catch {
    return null;
  }
}

export async function writeCachedPlan(
  fingerprint: string,
  plan: TripPlanResponse,
): Promise<void> {
  const expiresAtMs = Date.now() + 1000 * 60 * 60 * 6;
  memoryCache.set(fingerprint, { payload: plan, expiresAt: expiresAtMs });

  const client = await getPrisma();
  if (!client) return;
  const expiresAt = new Date(expiresAtMs);
  try {
    await client.cachedTripPlan.upsert({
      where: { fingerprint },
      create: { fingerprint, payload: plan, expiresAt },
      update: { payload: plan, expiresAt },
    });
  } catch {
    // Postgres optional — in-memory cache already stored.
  }
}
