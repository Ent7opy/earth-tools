"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Wildfire", href: "/wildfire" },
  { label: "MeteoWatch", href: "/meteo-watch" },
  { label: "Methods", href: "/methods" },
  { label: "Status", href: "/status" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const activePath = pathname ?? "/";

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    firstMenuLinkRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="rounded-md bg-accent p-1.5 text-white transition-colors group-hover:bg-orange-500">
            <Globe size={18} />
          </span>
          <span className="text-sm font-bold tracking-tight text-white">Earth Tools</span>
          <span className="hidden border-l border-border pl-2 text-xs text-text-muted sm:inline">
            Open Ecological Intelligence
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? activePath === "/" : activePath.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.2em] transition-colors",
                  isActive ? "text-accent" : "text-text-muted hover:text-white"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="mailto:contact@earth-tools.example"
            className="hidden text-xs font-medium text-text-muted transition-colors hover:text-white sm:inline"
          >
            Contact
          </a>
          <button
            type="button"
            className="rounded-md p-1 text-text-muted transition-colors hover:text-white md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-x-0 top-16 z-40 border-b border-border bg-bg/95 p-6 backdrop-blur md:hidden"
        >
          <nav className="flex flex-col gap-4" aria-label="Mobile primary">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                ref={index === 0 ? firstMenuLinkRef : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md border border-border bg-surface px-4 py-3 text-lg font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
