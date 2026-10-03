"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AtlasLogo } from "./atlas-logo";
import { SITE_NAV, SITE_TAIL_NAV } from "@/lib/atlas-content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const links = [...SITE_NAV, ...SITE_TAIL_NAV];
  return (
    <header className="sticky top-0 z-50 border-b border-cloud/10 nav-atlas"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="AtlasHub Editions — início" onClick={() => setOpen(false)}><AtlasLogo /></Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {links.map(item => <Link key={item.label} href={item.href} className="text-sm text-steel hover:text-cloud">{item.label}</Link>)}
        </nav>
        <button ref={trigger} type="button" aria-expanded={open} aria-controls="mobile-navigation"
          aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center text-cloud lg:hidden">
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>
      <nav id="mobile-navigation" aria-label="Navegação móvel" hidden={!open}
        className="border-t border-cloud/10 bg-ink-soft px-4 py-4 lg:hidden">
        {links.map(item => <Link key={item.label} href={item.href} onClick={() => setOpen(false)}
          className="block rounded px-3 py-3 text-cloud hover:bg-ink-raised">{item.label}</Link>)}
      </nav>
    </header>
  );
}
