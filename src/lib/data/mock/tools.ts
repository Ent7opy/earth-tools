import type { ToolDirectoryItem } from "@/lib/domain/types";

export const toolDirectoryData: ToolDirectoryItem[] = [
  {
    id: "wildfire-nowcast",
    title: "Wildfire Nowcast",
    description: "Real-time satellite detections cleaned of noise and false positives.",
    status: "live",
    icon: "flame",
    href: "/wildfire"
  },
  {
    id: "meteo-watch",
    title: "MeteoWatch EU",
    description: "Pan-European weather warnings aggregated from live Meteoalarm alerts.",
    status: "live",
    icon: "wind",
    href: "/meteo-watch"
  }
];
