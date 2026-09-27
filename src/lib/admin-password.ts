import { getDB } from "./cf";

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "biwor2024";

async function ensureTable(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS admin_auth (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        password TEXT NOT NULL
      )`
    )
    .run();
}

export async function getAdminPassword(): Promise<string> {
  try {
    const db = await getDB();
    if (!db) return DEFAULT_PASSWORD;
    await ensureTable(db);
    const row = await db.prepare("SELECT password FROM admin_auth WHERE id = 1").first<{ password: string }>();
    return row?.password || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export async function setAdminPassword(next: string) {
  const db = await getDB();
  if (!db) throw new Error("Database is not available");
  await ensureTable(db);
  await db.prepare("INSERT OR REPLACE INTO admin_auth (id, password) VALUES (1, ?)").bind(next).run();
}
