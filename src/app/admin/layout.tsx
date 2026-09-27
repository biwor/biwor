"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/footer", label: "Footer" },
  { href: "/admin/process", label: "Process steps" },
  { href: "/admin/terms", label: "Terms" },
  { href: "/admin/security", label: "Password" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin/login")) return <>{children}</>;

  return (
    <div>
      <nav className="bg-teal-950 text-white">
        <div className="max-w-6xl mx-auto px-4 h-11 flex items-center gap-4 overflow-x-auto text-xs">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={active ? "font-semibold text-amber-300 whitespace-nowrap" : "text-teal-100 hover:text-white whitespace-nowrap"}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
      {children}
    </div>
  );
}
