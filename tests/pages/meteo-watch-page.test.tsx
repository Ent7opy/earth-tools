import { render, screen } from "@testing-library/react";
import MeteoWatchPage from "@/app/(site)/meteo-watch/page";

describe("meteo-watch page", () => {
  const originalMeteoWatchUrl = process.env.NEXT_PUBLIC_METEO_WATCH_URL;

  afterEach(() => {
    if (originalMeteoWatchUrl === undefined) {
      delete process.env.NEXT_PUBLIC_METEO_WATCH_URL;
      return;
    }

    process.env.NEXT_PUBLIC_METEO_WATCH_URL = originalMeteoWatchUrl;
  });

  it("renders a setup message when iframe URL is not configured", async () => {
    delete process.env.NEXT_PUBLIC_METEO_WATCH_URL;
    render(await MeteoWatchPage());

    expect(screen.getByRole("heading", { name: "MeteoWatch EU" })).toBeInTheDocument();
    expect(screen.getByText(/NEXT_PUBLIC_METEO_WATCH_URL/)).toBeInTheDocument();
  });

  it("renders meteo-watch iframe when external URL is configured", async () => {
    process.env.NEXT_PUBLIC_METEO_WATCH_URL = "http://localhost:5174";

    render(await MeteoWatchPage());

    const iframe = screen.getByTitle("MeteoWatch EU app");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", "http://localhost:5174/");
  });
});
