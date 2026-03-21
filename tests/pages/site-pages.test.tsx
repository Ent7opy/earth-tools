import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(site)/page";
import MethodsPage from "@/app/(site)/methods/page";
import StatusPage from "@/app/(site)/status/page";

describe("site pages", () => {
  it("renders home featured and directory sections", async () => {
    render(await HomePage());

    expect(screen.getByText("Featured Tool")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tool Directory" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /MeteoWatch EU/i })).toBeInTheDocument();
  });

  it("renders methods sections", () => {
    render(<MethodsPage />);

    expect(screen.getByText("01. Data Ingestion")).toBeInTheDocument();
    expect(screen.getByText("03. Forecast Model (Probabilistic)")).toBeInTheDocument();
  });

  it("renders status sections", async () => {
    render(await StatusPage());

    expect(screen.getByText("System Status")).toBeInTheDocument();
    expect(screen.getByText("Latest Pipeline Runs")).toBeInTheDocument();
  });
});
