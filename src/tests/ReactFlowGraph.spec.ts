import { test } from "@playwright/test";
import { expect } from "@playwright/test";

// Test constants
const TEST_REQUIREMENTS = ["Req 1.1", "Req 2.1", "Req 3.1", "Req 4.1"];
const TEST_LEVELS = [
  "Level 1 (System)",
  "Level 2 (Sub-system)",
  "Level 3 (Component)",
  "Level 4 (Implementation)",
];

test.describe("ReactFlowGraph", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Initial Rendering", () => {
    test("should initialize with all required components", async ({ page }) => {
      await expect(page.getByTestId("rf__wrapper")).toBeVisible();
      await expect(page.getByRole("application")).toBeVisible();
      await expect(page.locator(".react-flow__controls")).toBeVisible();
    });

    test("should display all initial nodes", async ({ page }) => {
      for (const req of TEST_REQUIREMENTS) {
        await expect(
          page.getByTestId(`rf__node-${req.split(" ")[1]}`)
        ).toBeVisible();
      }
    });

    test("should render the legend with all level labels", async ({ page }) => {
      for (const level of TEST_LEVELS) {
        await expect(page.getByText(level)).toBeVisible();
      }
    });

    test("should render the minimap", async ({ page }) => {
      await expect(page.locator(".react-flow__minimap")).toBeVisible();
    });
  });

  test.describe("Node Details Panel", () => {
    test("should show details when node is clicked", async ({ page }) => {
      const nodeText = "Req 2.1";
      await page.getByText(nodeText).click();

      await expect(page.getByText("Requirement Details")).toBeVisible();
      await expect(page.getByText("Level: 2")).toBeVisible();
    });

    test("should close details panel when close button is clicked", async ({
      page,
    }) => {
      await page.getByText("Req 2.1").click();
      await page.getByRole("button", { name: "×" }).click();

      await expect(page.getByText("Requirement Details")).toBeHidden();
    });
  });

  test.describe("Theme Toggle", () => {
    test("should toggle between light and dark themes", async ({ page }) => {
      const themeBtn = page.getByTitle("Toggle theme");

      // Check initial state (light theme)
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        "rgb(255, 255, 255)"
      );

      // Toggle to dark theme
      await themeBtn.click();
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        "rgb(24, 24, 27)"
      );

      // Toggle back to light theme
      await themeBtn.click();
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        "rgb(255, 255, 255)"
      );
    });
  });

  test.describe("View Controls", () => {
    test("should reset node positions when reset button is clicked", async ({
      page,
    }) => {
      const resetBtn = page.getByTitle("Reset view");
      const nodeText = "Req 1.1";

      await resetBtn.click();
      await expect(page.getByText(nodeText)).toBeVisible();
    });
  });
});
