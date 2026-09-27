import fs from "fs";
import path from "path";
import { DEFAULT_THEME, ThemeConfig } from "./theme";
import { getDB } from "./cf";

const dataDir = path.join(process.cwd(), "data");

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  moq: string;
  leadTime: string;
  image: string;
  featured: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
};

export type MediaItem = {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
};

export type Settings = {
  companyName: string;
  tagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroBadge: string;
  heroBackgroundImage: string;
  heroOverlayColor: string;
  heroOverlayOpacity: number;
  aboutTitle: string;
  aboutText: string;
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  moqNote: string;
  leadTimeNote: string;
  complianceNote: string;
  registeredNote: string;
  logo: string;
  favicon: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  footerText: string;
  bangladeshText: string;
  bangladeshImagesEnabled: boolean;
  bangladeshImageCount: number;
  bangladeshImage1: string;
  bangladeshImage1Alt: string;
  bangladeshImage1Height: number;
  bangladeshImage2: string;
  bangladeshImage2Alt: string;
  bangladeshImage2Height: number;
  bangladeshImage3: string;
  bangladeshImage3Alt: string;
  bangladeshImage3Height: number;
  siteUrl: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  facebookAppId: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  twitterHandle: string;
  cookieConsentEnabled: boolean;
  cookieConsentText: string;
  robotsIndex: boolean;
  meetingNotifyEmail: string;
  resendApiKey: string;
  emailFrom: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  meetingWebhookUrl: string;
};

export type Sections = Record<string, any>;

export type Certification = {
  id: string;
  name: string;
  purpose: string;
  logo: string;
  logoHeight: number;
  order: number;
  visible: boolean;
};

export type MeetingRequest = {
  id: string;
  name: string;
  email: string;
  company: string;
  date: string;
  time: string;
  type: "virtual" | "in-person";
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

export type Buyer = {
  id: number;
  name: string;
  email: string | null;
  company: string | null;
  country: string | null;
  notes: string | null;
  created_at: string;
};

export const defaultSettings: Settings = {
  companyName: "BIWORSOURCING",
  tagline: "Apparel Sourcing Agent in Bangladesh",
  heroTitle: "Need clothes made in Bangladesh?",
  heroHighlight: "Start here.",
  heroSubtitle: "A Dhaka buying house. We find the right factory for you.",
  heroBadge: "Based in Dhaka, Bangladesh",
  heroBackgroundImage: "",
  heroOverlayColor: "#0f172a",
  heroOverlayOpacity: 0,
  aboutTitle: "A registered buying house, built for global brands.",
  aboutText: "",
  address: "Dhaka, Bangladesh",
  email: "info@biworsourcing.com",
  phone: "",
  whatsapp: "",
  moqNote: "Order from 500 pieces",
  leadTimeNote: "45-Day Average Lead Time",
  complianceNote: "ACCORD / BSCI / SEDEX / WRAP Factories",
  registeredNote: "Registered in Bangladesh",
  logo: "",
  favicon: "",
  metaTitle: "BIWORSOURCING | Apparel Sourcing Agent in Bangladesh",
  metaDescription: "Registered garment buying house in Dhaka.",
  metaKeywords: "apparel sourcing Bangladesh",
  ogImage: "",
  footerText: "A registered apparel buying house in Bangladesh.",
  bangladeshText: "",
  bangladeshImagesEnabled: false,
  bangladeshImageCount: 1,
  bangladeshImage1: "",
  bangladeshImage1Alt: "",
  bangladeshImage1Height: 280,
  bangladeshImage2: "",
  bangladeshImage2Alt: "",
  bangladeshImage2Height: 280,
  bangladeshImage3: "",
  bangladeshImage3Alt: "",
  bangladeshImage3Height: 280,
  siteUrl: "https://biworsourcing.com",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  facebookPixelId: "",
  facebookAppId: "",
  facebookUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  twitterUrl: "",
  twitterHandle: "",
  cookieConsentEnabled: true,
  cookieConsentText:
    "We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our use of cookies.",
  robotsIndex: true,
  meetingNotifyEmail: "",
  resendApiKey: "",
  emailFrom: "onboarding@resend.dev",
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  meetingWebhookUrl: "",
};

function readJson<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(filename: string, data: unknown) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

async function kvGet<T>(table: "settings" | "sections" | "theme", fallback: T): Promise<T> {
  const db = await getDB();
  if (!db) return fallback;
  const row = await db.prepare(`SELECT data FROM ${table} WHERE id = 1`).first<{ data: string }>();
  if (!row?.data) return fallback;
  try {
    return JSON.parse(row.data) as T;
  } catch {
    return fallback;
  }
}

async function kvSet(table: "settings" | "sections" | "theme", data: unknown) {
  const db = await getDB();
  if (!db) {
    writeJson(`${table}.json`, data);
    return;
  }
  await db.prepare(`INSERT OR REPLACE INTO ${table} (id, data) VALUES (1, ?)`).bind(JSON.stringify(data)).run();
}

export async function getProducts(): Promise<Product[]> {
  const db = await getDB();
  if (!db) return readJson<Product[]>("products.json", []);
  const { results } = await db.prepare("SELECT * FROM products").all<any>();
  return (results || []).map((p) => ({ ...p, featured: Boolean(p.featured) }));
}

export async function saveProducts(products: Product[]) {
  const db = await getDB();
  if (!db) return writeJson("products.json", products);
  await db.prepare("DELETE FROM products").run();
  for (const p of products) {
    await db.prepare(`INSERT INTO products (id, name, description, category, moq, leadTime, image, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(p.id, p.name, p.description, p.category, p.moq, p.leadTime, p.image, p.featured ? 1 : 0).run();
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  const db = await getDB();
  if (!db) return readJson<GalleryItem[]>("gallery.json", []);
  const { results } = await db.prepare("SELECT * FROM gallery").all<GalleryItem>();
  return results || [];
}

export async function saveGallery(items: GalleryItem[]) {
  const db = await getDB();
  if (!db) return writeJson("gallery.json", items);
  await db.prepare("DELETE FROM gallery").run();
  for (const i of items) {
    await db.prepare(`INSERT INTO gallery (id, title, category, image) VALUES (?, ?, ?, ?)`).bind(i.id, i.title, i.category, i.image).run();
  }
}

export async function getMedia(): Promise<MediaItem[]> {
  const db = await getDB();
  if (!db) return readJson<MediaItem[]>("media.json", []);
  const { results } = await db.prepare("SELECT * FROM media ORDER BY createdAt DESC").all<MediaItem>();
  return results || [];
}

export async function saveMedia(items: MediaItem[]) {
  const db = await getDB();
  if (!db) return writeJson("media.json", items);
  await db.prepare("DELETE FROM media").run();
  for (const m of items) {
    await db.prepare(`INSERT INTO media (id, url, name, type, size, createdAt) VALUES (?, ?, ?, ?, ?, ?)`).bind(m.id, m.url, m.name, m.type, m.size, m.createdAt).run();
  }
}

export async function addMedia(item: MediaItem) {
  const db = await getDB();
  if (!db) {
    const items = readJson<MediaItem[]>("media.json", []);
    items.unshift(item);
    writeJson("media.json", items);
    return item;
  }
  await db.prepare(`INSERT INTO media (id, url, name, type, size, createdAt) VALUES (?, ?, ?, ?, ?, ?)`).bind(item.id, item.url, item.name, item.type, item.size, item.createdAt).run();
  return item;
}

export async function getSettings(): Promise<Settings> {
  const stored = await kvGet<Partial<Settings>>("settings", readJson("settings.json", {}));
  return { ...defaultSettings, ...stored };
}

export async function saveSettings(settings: Settings) {
  await kvSet("settings", settings);
}

export async function getSections(): Promise<Sections> {
  return kvGet<Sections>("sections", readJson("sections.json", {}));
}

export async function saveSections(sections: Sections) {
  await kvSet("sections", sections);
}

export async function getTheme(): Promise<ThemeConfig> {
  const stored = await kvGet<Partial<ThemeConfig>>("theme", readJson("theme.json", {}));
  return { ...DEFAULT_THEME, ...stored };
}

export async function saveTheme(theme: ThemeConfig) {
  await kvSet("theme", theme);
}

export async function getCertifications(): Promise<Certification[]> {
  const db = await getDB();
  if (!db) return readJson<Certification[]>("certifications.json", []);
  const { results } = await db.prepare(`SELECT * FROM certifications ORDER BY "order" ASC`).all<any>();
  return (results || []).map((c) => ({ ...c, visible: Boolean(c.visible) }));
}

export async function saveCertifications(items: Certification[]) {
  const db = await getDB();
  if (!db) return writeJson("certifications.json", items);
  await db.prepare("DELETE FROM certifications").run();
  for (const c of items) {
    await db.prepare(`INSERT INTO certifications (id, name, purpose, logo, logoHeight, "order", visible) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(c.id, c.name, c.purpose, c.logo, c.logoHeight, c.order, c.visible ? 1 : 0).run();
  }
}

export async function getMeetings(): Promise<MeetingRequest[]> {
  const db = await getDB();
  if (!db) return readJson<MeetingRequest[]>("meetings.json", []);
  const { results } = await db.prepare("SELECT * FROM meetings ORDER BY createdAt DESC").all<MeetingRequest>();
  return results || [];
}

export async function saveMeetings(items: MeetingRequest[]) {
  const db = await getDB();
  if (!db) return writeJson("meetings.json", items);
  await db.prepare("DELETE FROM meetings").run();
  for (const m of items) {
    await db.prepare(`INSERT INTO meetings (id, name, email, company, date, time, type, notes, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(m.id, m.name, m.email, m.company, m.date, m.time, m.type, m.notes, m.status, m.createdAt).run();
  }
}

export async function getBuyers(): Promise<Buyer[]> {
  const db = await getDB();
  if (!db) return [];
  const { results } = await db.prepare("SELECT * FROM buyers ORDER BY id DESC").all<Buyer>();
  return results || [];
}

export async function addBuyer(input: Omit<Buyer, "id" | "created_at">) {
  const db = await getDB();
  if (!db) throw new Error("D1 is not bound");
  return db.prepare(`INSERT INTO buyers (name, email, company, country, notes) VALUES (?, ?, ?, ?, ?) RETURNING *`).bind(input.name, input.email, input.company, input.country, input.notes).first<Buyer>();
}
