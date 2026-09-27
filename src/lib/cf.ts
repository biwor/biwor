import { getCloudflareContext } from "@opennextjs/cloudflare";

export type CfEnv = {
  DB: D1Database;
  IMAGES: R2Bucket;
  PUBLIC_R2_URL?: string;
};

export async function getCfEnv(): Promise<CfEnv | null> {
  try {
    const { env } = await getCloudflareContext({ async: true } as any);
    if (!env) return null;
    return env as CfEnv;
  } catch {
    return null;
  }
}

export async function getDB(): Promise<D1Database | null> {
  const env = await getCfEnv();
  return env?.DB ?? null;
}

export async function getImages(): Promise<{ bucket: R2Bucket; publicUrl: string } | null> {
  const env = await getCfEnv();
  if (!env?.IMAGES) return null;
  return {
    bucket: env.IMAGES,
    publicUrl: (env.PUBLIC_R2_URL || "").replace(/\/$/, ""),
  };
}
