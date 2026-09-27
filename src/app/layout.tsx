import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";
import ThemeStyles from "@/components/ThemeStyles";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

function absUrl(siteUrl: string, value?: string) {
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const s = (await getSettings()) as any;
  const siteUrl = (s.siteUrl || "https://biworsourcing.com").replace(/\/$/, "");
  const title = s.metaTitle || s.companyName || "BIWORSOURCING";
  const description = s.metaDescription || "";
  const ogImage = absUrl(siteUrl, s.ogImage);
  const favicon = absUrl(siteUrl, s.favicon);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${s.companyName || "BIWORSOURCING"}` },
    description,
    keywords: s.metaKeywords ? String(s.metaKeywords).split(",").map((k: string) => k.trim()) : undefined,
    authors: [{ name: s.companyName || "BIWORSOURCING" }],
    creator: s.companyName,
    publisher: s.companyName,
    robots: s.robotsIndex === false
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    alternates: { canonical: siteUrl },
    icons: favicon
      ? {
          icon: [{ url: favicon }],
          shortcut: favicon,
          apple: favicon,
        }
      : undefined,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: s.companyName || "BIWORSOURCING",
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: s.twitterHandle || undefined,
      site: s.twitterHandle || undefined,
    },
    other: { ...(s.facebookAppId ? { "fb:app_id": s.facebookAppId } : {}) },
    category: "business",
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const s = (await getSettings()) as any;
  const siteUrl = (s.siteUrl || "https://biworsourcing.com").replace(/\/$/, "");
  const favicon = s.favicon
    ? s.favicon.startsWith("http")
      ? s.favicon
      : `${siteUrl}${s.favicon}`
    : undefined;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <ThemeStyles />
        <JsonLd />
        {favicon && (
          <>
            <link rel="icon" href={favicon} />
            <link rel="shortcut icon" href={favicon} />
            <link rel="apple-touch-icon" href={favicon} />
          </>
        )}
        {s.facebookAppId && <meta property="fb:app_id" content={s.facebookAppId} />}
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        {children}
        <Analytics />
        <CookieConsent
          enabled={s.cookieConsentEnabled !== false}
          text={s.cookieConsentText}
          privacyUrl={`${siteUrl}/#contact`}
        />
      </body>
    </html>
  );
}
