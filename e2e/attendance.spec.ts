import { test, expect } from "@playwright/test";

test.describe("PulseCheck attendance flow", () => {
  test("Professor can start session and student can check in", async ({ page }) => {
    test.skip(true, "E2E scenario requires Supabase project and seeded data");

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /attendance your campus/i })).toBeVisible();
  });
});
