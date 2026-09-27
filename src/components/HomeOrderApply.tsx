"use client";

import { useEffect } from "react";

function findSection(id: string): HTMLElement | null {
  const direct =
    (document.querySelector(`[data-home-id="${id}"]`) as HTMLElement | null) ||
    (document.getElementById(id) as HTMLElement | null);
  if (direct) return direct;

  if (id === "process5") return document.getElementById("process");
  if (id === "gallery") return document.getElementById("factories");

  const needles: Record<string, string[]> = {
    hero: ["contact us", "our services"],
    about: ["headquarters", "factory sourcing"],
    bangladesh: ["real story", "bangladesh sourcing"],
    principles: ["we live by", "transparency first"],
    services: ["factory matching", "private label"],
    process5: ["accountable team", "five stages"],
    clients: ["who we work with", "every stage"],
    leadtimes: ["lead times", "sample lead"],
    products: ["what we", "source"],
    certs: ["certifications", "partner factories"],
    gallery: ["our factories", "production network"],
    whyus: ["why source", "advantage"],
    contact: ["discuss your next", "schedule a virtual"],
    roadmap: ["tech pack to delivery", "fourteen steps"],
    terms: ["no surprises", "working with us"],
  };

  const words = needles[id] || [];
  const nodes = Array.from(
    document.querySelectorAll("main section, section#roadmap, section#terms")
  ) as HTMLElement[];
  return (
    nodes.find((el) => {
      const text = (el.innerText || "").toLowerCase();
      return words.some((w) => text.includes(w));
    }) || null
  );
}

function apply(items: any[]) {
  const main = document.querySelector("main") as HTMLElement | null;
  if (!main || !items?.length) return;
  main.style.display = "flex";
  main.style.flexDirection = "column";
  items.forEach((item) => {
    const el = findSection(String(item.id));
    if (!el) return;
    if (item.visible === false) {
      el.style.display = "none";
      return;
    }
    el.style.display = "";
    main.appendChild(el);
  });
}

export default function HomeOrderApply() {
  useEffect(() => {
    const run = () => {
      fetch("/api/sections", { cache: "no-store" })
        .then((r) => r.json())
        .then((all) => apply(all.homeOrder?.items || []))
        .catch(() => {});
    };
    run();
    const t = window.setTimeout(run, 800);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
