import { expect, test } from "@playwright/test";

test("navigates across primary routes", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Tool Directory" })).toBeVisible();

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Methods" }).click();
  await expect(page.getByRole("heading", { name: "Methods & Transparency" })).toBeVisible();

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Status" }).click();
  await expect(page.getByRole("heading", { name: "System Status" })).toBeVisible();

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Wildfire" }).click();
  if (await page.getByTestId("wildfire-iframe").count()) {
    await expect(page.getByTestId("wildfire-iframe")).toBeVisible();
  } else {
    await expect(page.getByRole("heading", { name: "Wildfire Nowcast" })).toBeVisible();
    await expect(page.getByText(/NEXT_PUBLIC_WILDFIRE_NOWCAST_URL/)).toBeVisible();
  }

  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "MeteoWatch" }).click();
  if (await page.getByTestId("meteo-watch-iframe").count()) {
    await expect(page.getByTestId("meteo-watch-iframe")).toBeVisible();
  } else {
    await expect(page.getByRole("heading", { name: "MeteoWatch EU" })).toBeVisible();
    await expect(page.getByText(/NEXT_PUBLIC_METEO_WATCH_URL/)).toBeVisible();
  }
});

test("mobile menu navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();

  await page
    .getByRole("navigation", { name: "Mobile primary" })
    .getByRole("link", { name: "Status" })
    .click();
  await expect(page.getByRole("heading", { name: "System Status" })).toBeVisible();
});
