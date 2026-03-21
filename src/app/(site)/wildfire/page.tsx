import type { Metadata } from "next";
import { ExternalToolEmbed, resolveExternalToolUrl } from "@/components/tools/ExternalToolEmbed";

export const metadata: Metadata = {
  title: "Wildfire Nowcast & Forecast",
  description: "Embedded Wildfire Nowcast stream for live fire monitoring.",
  openGraph: {
    title: "Earth Tools Wildfire",
    description: "Embedded Wildfire Nowcast stream for live fire monitoring."
  }
};

export default async function WildfirePage() {
  const embedUrl = resolveExternalToolUrl(process.env.NEXT_PUBLIC_WILDFIRE_NOWCAST_URL);

  return (
    <ExternalToolEmbed
      title="Wildfire Nowcast"
      testId="wildfire-iframe"
      envVarName="NEXT_PUBLIC_WILDFIRE_NOWCAST_URL"
      fallbackExampleUrl="http://localhost:8501"
      embedUrl={embedUrl}
    />
  );
}
