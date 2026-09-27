"use client";

import { useEffect } from "react";

export default function HomeOrderApply() {
  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((all) => {
        const items = all.homeOrder?.items;
        if (!Array.isArray(items)) return;
        items.forEach((item: any, i: number) => {
          const el =
            document.querySelector(`[data-home-id="${item.id}"]`) ||
            document.getElementById(item.id);
          if (!el) return;
          (el as HTMLElement).style.order = String(i + 1);
          (el as HTMLElement).style.display = item.visible === false ? "none" : "";
        });
      })
      .catch(() => {});
  }, []);
  return null;
}
