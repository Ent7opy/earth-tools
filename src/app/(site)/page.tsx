import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Database,
  Droplets,
  Flame,
  Wind,
  Zap
} from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollToDirectoryButton } from "@/components/home/ScrollToDirectoryButton.client";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { siteRepository } from "@/lib/data/repositories";
import type { ToolIconName } from "@/lib/domain/types";

export const metadata: Metadata = {
  title: "Open Tools for Wildfire and Weather Awareness",
  description:
    "Explore live wildfire nowcasting, pan-European weather warnings, transparent ecological methods, and system status insights.",
  openGraph: {
    title: "Earth Tools Home",
    description:
      "Explore live wildfire nowcasting, pan-European weather warnings, transparent ecological methods, and system status insights."
  }
};

const iconByName: Record<ToolIconName, typeof Flame> = {
  flame: Flame,
  wind: Wind,
  clock: Clock,
  zap: Zap,
  droplets: Droplets,
  database: Database
};

export default async function HomePage() {
  const [tools, featuredTool] = await Promise.all([
    siteRepository.getToolDirectory(),
    siteRepository.getFeaturedTool()
  ]);

  return (
    <>
      <div className="animate-in fade-in duration-500">
        <section className="relative overflow-hidden border-b border-border px-6 py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.08),transparent)]" />
          <div className="relative z-10 mx-auto max-w-6xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              Open Tools for <span className="text-accent">Wildfire Awareness</span>
              <br />
              and Weather Insight
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-text-muted md:text-xl">
              Live satellite detections, pan-European hazard warnings, and transparent environmental data tools for a
              changing world.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/wildfire"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-3 font-medium text-slate-950 transition-colors hover:bg-orange-500"
              >
                Explore Live Wildfires <Flame size={18} />
              </Link>
              <ScrollToDirectoryButton />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted">Featured Tool</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid items-center gap-12 rounded-2xl border border-border bg-surface/50 p-8 transition-colors hover:border-border/80 md:grid-cols-2 md:p-12">
            <div>
              <div className="mb-4 flex gap-2">
                <Badge variant="live">Live</Badge>
                <Badge variant="beta">Beta</Badge>
              </div>
              <h3 className="mb-4 text-3xl font-bold text-white">{featuredTool.title} &amp; Forecast</h3>
              <p className="mb-8 leading-relaxed text-text-muted">
                We combine NASA FIRMS satellite detections with high-resolution GFS/ERA5 weather models and local
                topography to estimate 24-72 hour fire spread probability.
              </p>
              <div className="mb-8 space-y-4">
                {[
                  { label: "Map Overlay", value: "Dynamic Heat & Probability" },
                  { label: "AOI Summary", value: "Automated Regional Reports" },
                  { label: "Risk Layer", value: "Vegetation & Fuel Density" }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                    <span className="font-medium text-slate-200">{item.label}:</span>
                    <span className="text-text-muted">{item.value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/wildfire"
                className="inline-flex rounded-lg border border-orange-400/40 px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-orange-300 transition-colors hover:bg-orange-500 hover:text-white"
              >
                Open Tool
              </Link>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-slate-950">
              <div className="absolute inset-0 opacity-35 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
              <div className="absolute inset-0 border border-border bg-[size:40px_40px] [background-image:linear-gradient(to_right,#1d2a3f_1px,transparent_1px),linear-gradient(to_bottom,#1d2a3f_1px,transparent_1px)]" />
              <div className="absolute left-1/4 top-1/3 h-32 w-32 animate-pulse rounded-full bg-orange-600/20 blur-3xl" />
              <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/30 blur-2xl" />
              <div className="absolute bottom-4 left-4 rounded border border-border bg-bg/80 p-2 font-mono text-[10px] text-text-muted backdrop-blur">
                LAT: 34.0522 N
                <br />
                LON: 118.2437 W
              </div>
            </div>
          </div>
        </section>

        <section id="directory" className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12">
            <h2 className="mb-2 text-2xl font-bold text-white">Tool Directory</h2>
            <p className="text-text-muted">Explore our modular ecological intelligence suite.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Card
                key={tool.id}
                title={tool.title}
                description={tool.description}
                badge={tool.status}
                icon={iconByName[tool.icon]}
                href={tool.href}
              />
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
