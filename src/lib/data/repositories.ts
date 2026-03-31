import {
  overallStateSchema,
  pipelineRunsSchema,
  pipelineStatusSchema,
  toolDirectorySchema
} from "@/lib/domain/schemas";
import type {
  OverallState,
  PipelineRun,
  PipelineStatusItem,
  SystemState,
  ToolDirectoryItem
} from "@/lib/domain/types";
import { pipelineRunsData, systemSummaryData, overallStateData } from "@/lib/data/mock/status";
import { toolDirectoryData } from "@/lib/data/mock/tools";

// ---------------------------------------------------------------------------
// Wildfire API integration — real data when WILDFIRE_API_URL is configured
// ---------------------------------------------------------------------------

const WILDFIRE_API_URL = process.env.WILDFIRE_API_URL;

const SOURCE_LABELS: Record<string, string> = {
  firms: "NASA FIRMS (Fire Detections)",
  weather: "Weather Model Ingest",
  terrain: "Terrain / DEM Coverage",
  perimeters: "Fire Perimeters",
  lfmc: "Live Fuel Moisture",
  lulc: "Land Use / Cover"
};

const SOURCE_IDS: Record<string, string> = {
  firms: "FI",
  weather: "WX",
  terrain: "TR",
  perimeters: "PE",
  lfmc: "LF",
  lulc: "LU"
};

type WildfireSourceState = "fresh" | "stale" | "missing";

interface WildfireSource {
  source: string;
  state: WildfireSourceState;
  last_seen_at: string | null;
  age_minutes: number | null;
  stale_threshold_minutes: number;
  is_stale: boolean;
}

interface WildfireFreshnessResponse {
  as_of: string;
  overall_state: string;
  sources: Record<string, WildfireSource>;
}

function mapSourceState(state: WildfireSourceState): SystemState {
  if (state === "fresh") return "active";
  if (state === "stale") return "degraded";
  return "offline";
}

function formatAgeLabel(ageMinutes: number | null): string {
  if (ageMinutes === null) return "Never";
  if (ageMinutes < 1) return "Just updated";
  if (ageMinutes < 60) return `${Math.round(ageMinutes)}m ago`;
  if (ageMinutes < 1440) return `${Math.round(ageMinutes / 60)}h ago`;
  return `${Math.round(ageMinutes / 1440)}d ago`;
}

function formatAgeValue(ageMinutes: number | null): string {
  if (ageMinutes === null) return "No data";
  if (ageMinutes < 1) return "< 1m old";
  if (ageMinutes < 60) return `${Math.round(ageMinutes)}m old`;
  if (ageMinutes < 1440) return `${Math.round(ageMinutes / 60)}h old`;
  return `${Math.round(ageMinutes / 1440)}d old`;
}

function formatTimeUtc(lastSeenAt: string | null): string {
  if (!lastSeenAt) return "—";
  const d = new Date(lastSeenAt);
  return `${d.toISOString().slice(11, 16)} UTC`;
}

function mapOverallState(wildfireState: string): OverallState {
  if (wildfireState === "healthy") return "normal";
  if (wildfireState === "degraded") return "degraded";
  return "outage";
}

async function fetchWildfireFreshness(): Promise<WildfireFreshnessResponse | null> {
  if (!WILDFIRE_API_URL) return null;
  try {
    const res = await fetch(`${WILDFIRE_API_URL}/health/data-freshness`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return (await res.json()) as WildfireFreshnessResponse;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Repository implementations
// ---------------------------------------------------------------------------

export interface StatusRepository {
  getSystemSummary(): Promise<PipelineStatusItem[]>;
  getLatestRuns(): Promise<PipelineRun[]>;
  getOverallState(): Promise<OverallState>;
}

export interface SiteRepository {
  getToolDirectory(): Promise<ToolDirectoryItem[]>;
  getFeaturedTool(): Promise<ToolDirectoryItem>;
}

export const statusRepository: StatusRepository = {
  async getSystemSummary() {
    const freshness = await fetchWildfireFreshness();
    if (freshness) {
      const items: PipelineStatusItem[] = Object.entries(freshness.sources).map(
        ([name, src]) => ({
          label: SOURCE_LABELS[name] ?? name,
          status: mapSourceState(src.state),
          value: formatAgeValue(src.age_minutes),
          lastRunLabel: formatAgeLabel(src.age_minutes)
        })
      );
      return pipelineStatusSchema.parse(items);
    }
    return pipelineStatusSchema.parse(systemSummaryData);
  },

  async getLatestRuns() {
    const freshness = await fetchWildfireFreshness();
    if (freshness) {
      const runs: PipelineRun[] = Object.entries(freshness.sources)
        .filter(([, src]) => src.last_seen_at !== null)
        .sort((a, b) => {
          const ta = a[1].last_seen_at ?? "";
          const tb = b[1].last_seen_at ?? "";
          return tb.localeCompare(ta);
        })
        .map(([name, src]) => ({
          id: `${SOURCE_IDS[name] ?? name.slice(0, 2).toUpperCase()}`,
          type: SOURCE_LABELS[name] ?? name,
          status: src.state === "fresh" ? "success" : ("failed" as const),
          timeUtc: formatTimeUtc(src.last_seen_at)
        }));
      return pipelineRunsSchema.parse(runs);
    }
    return pipelineRunsSchema.parse(pipelineRunsData);
  },

  async getOverallState() {
    const freshness = await fetchWildfireFreshness();
    if (freshness) {
      return overallStateSchema.parse(mapOverallState(freshness.overall_state));
    }
    return overallStateSchema.parse(overallStateData);
  }
};

export const siteRepository: SiteRepository = {
  async getToolDirectory() {
    return toolDirectorySchema.parse(toolDirectoryData);
  },
  async getFeaturedTool() {
    const tools = toolDirectorySchema.parse(toolDirectoryData);
    const first = tools[0];
    if (!first) {
      throw new Error("No tools available for feature selection.");
    }
    return first;
  }
};
