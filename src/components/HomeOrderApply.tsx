"use client";

import { useEffect } from "react";

function findSection(id: string): HTMLElement | null {
  const tagged = document.querySelector(`[data-home-id="${id}"]`) as HTMLElement | null;
  if (tagged) return tagged;
  const byId = document.getElementById(id) as HTMLElement | null;
  if (byId) return byId;

  const match: Record<string, string> = {
    hero: "need clothes made",
    about: "registered buying house",
    bangladesh: "real story",
    principles: "we live by",
    services: "full-service apparel",
    process5: "one accountable team",
    clients: "every stage",
    leadtimes: "by category",
    products: "what we",
    certs: "partner factories",
    gallery: "production network",
    whyus: "advantage",
    contact: "next order",
    roadmap: "tech pack to delivery",
    terms: "no surprises",
  };
  const needle = match[id];
  if (!needle) return null;
  const nodes = Array.from(document.querySelectorAll("main section, #roadmap, #terms")) as HTMLElement[];
  return (
    nodes.find((el) => (el.innerText || "").toLowerCase().includes(needle)) || null
  );
}

export default function HomeOrderApply() {
  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((all) => {
        const items = all.homeOrder?.items;
        if (!Array.isArray(items) || !items.length) return;
        const main = document.querySelector("main") as HTMLElement | null;
        if (!main) return;
        main.style.display = "flex";
        main.style.flexDirection = "column";
        items.forEach((item: any) => {
          const el = findSection(item.id);
          if (!el) return;
          if (item.visible === false) {
            el.style.display = "none";
            return;
          }
          el.style.display = "";
          main.appendChild(el);
        });
      })
      .catch(() => {});
  }, []);
  return null;
}
