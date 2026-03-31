import type { Metadata } from "next";
import { statusRepository } from "@/lib/data/repositories";

export const dynamic = "force-dynamic";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "System Status",
  description: "Operational transparency and live pipeline health for Earth Tools.",
  openGraph: {
    title: "Earth Tools Status",
    description: "Operational transparency and live pipeline health for Earth Tools."
  }
};

const systemStateClasses = {
  active: "text-emerald-400",
  degraded: "text-amber-300",
  offline: "text-rose-400"
};

const runStatusClasses = {
  success: "text-emerald-400",
  failed: "text-rose-400",
  running: "text-amber-300"
};

export default async function StatusPage() {
  const [systems, runs, overallState] = await Promise.all([
    statusRepository.getSystemSummary(),
    statusRepository.getLatestRuns(),
    statusRepository.getOverallState()
  ]);

  const healthy = overallState === "normal";

  return (
    <>
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">System Status</h1>
            <p className="text-text-muted">Operational transparency and pipeline health.</p>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] ${
              healthy
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                : "border-amber-400/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            <div className={`h-2 w-2 rounded-full ${healthy ? "bg-emerald-400" : "bg-amber-300"}`} />
            {healthy ? "All Systems Normal" : "Partial Degradation"}
          </div>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {systems.map((system) => (
            <section key={system.label} className="rounded-xl border border-border bg-surface/60 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200">{system.label}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] ${systemStateClasses[system.status]}`}
                >
                  {system.status}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-mono text-2xl text-white">{system.value}</span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-text-muted">
                  Last Run: {system.lastRunLabel}
                </span>
              </div>
            </section>
          ))}
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface/50">
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-sm font-bold text-white">Latest Pipeline Runs</h2>
            <span className="text-xs text-text-muted">Last 24 hours</span>
          </div>
          <div className="divide-y divide-border font-mono text-[11px]">
            {runs.map((run) => (
              <div key={run.id} className="flex justify-between p-4 transition-colors hover:bg-surface">
                <div className="flex gap-8">
                  <span className="text-text-muted">{run.id}</span>
                  <span className="text-slate-200">{run.type}</span>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-text-muted">{run.timeUtc}</span>
                  <span className={`font-bold uppercase ${runStatusClasses[run.status]}`}>{run.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
