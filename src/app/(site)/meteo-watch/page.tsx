import type { Metadata } from "next";
import { ExternalToolEmbed, resolveExternalToolUrl } from "@/components/tools/ExternalToolEmbed";

export const metadata: Metadata = {
  title: "MeteoWatch EU",
  description: "Embedded MeteoWatch dashboard for pan-European weather hazard monitoring.",
  openGraph: {
    title: "Earth Tools MeteoWatch EU",
    description: "Embedded MeteoWatch dashboard for pan-European weather hazard monitoring."
  }
};

export default async function MeteoWatchPage() {
  const embedUrl = resolveExternalToolUrl(process.env.NEXT_PUBLIC_METEO_WATCH_URL);

  return (
    <ExternalToolEmbed
      title="MeteoWatch EU"
      testId="meteo-watch-iframe"
      envVarName="NEXT_PUBLIC_METEO_WATCH_URL"
      fallbackExampleUrl="http://localhost:5174"
      embedUrl={embedUrl}
    />
  );
}
