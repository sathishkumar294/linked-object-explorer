/// <reference types="vitest/globals" />
import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReactFlowGraph from "../components/ReactFlowGraph";
import "@testing-library/jest-dom";

// Test constants
const TEST_REQUIREMENTS = ["Req 1.1", "Req 2.1", "Req 3.1", "Req 4.1"];
const TEST_LEVELS = [
  "Level 1 (System)",
  "Level 2 (Sub-system)",
  "Level 3 (Component)",
  "Level 4 (Implementation)",
];

// --- Mocks ---
vi.mock("d3-drag", () => ({
  drag: () => ({
    on: () => ({ subject: () => ({}) }),
  }),
}));

vi.mock("d3-selection", () => ({
  select: () => ({
    on: () => ({}),
  }),
}));

// Mock ResizeObserver for React Flow
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("ReactFlowGraph", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    render(<ReactFlowGraph />);
  });

  describe("Initial Rendering", () => {
    it("should initialize with all required components", () => {
      expect(screen.getByTestId("rf__wrapper")).toBeInTheDocument();
      expect(screen.getByRole("application")).toBeInTheDocument();
      expect(
        document.querySelector(".react-flow__controls")
      ).toBeInTheDocument();
    });

    it("should display all initial nodes", () => {
      TEST_REQUIREMENTS.forEach((req) => {
        expect(screen.getByText(req)).toBeInTheDocument();
      });
    });

    it("should render the legend with all level labels", () => {
      TEST_LEVELS.forEach((level) => {
        expect(
          screen.getByText(level),
          `Legend should contain ${level}`
        ).toBeInTheDocument();
      });
    });

    it("should render the minimap", () => {
      expect(
        document.querySelector(".react-flow__minimap")
      ).toBeInTheDocument();
    });
  });

  describe("Node Details Panel", () => {
    it("should show details when node is clicked", async () => {
      // Arrange
      const nodeText = "Req 2.1";
      const node = screen.getByText(nodeText);

      // Act
      await user.click(node);

      // Assert
      await waitFor(() => {
        expect(screen.getByText("Requirement Details")).toBeInTheDocument();
        expect(screen.getByText("Level: 2")).toBeInTheDocument();
      });
    });

    it("should close details panel when close button is clicked", async () => {
      // Arrange
      const node = screen.getByText("Req 2.1");
      await user.click(node);

      // Wait for panel to appear before trying to close it
      const closeBtn = await screen.findByRole("button", { name: /×/ });

      // Act
      await user.click(closeBtn);

      // Assert
      await waitFor(
        () => {
          expect(
            screen.queryByText("Requirement Details")
          ).not.toBeInTheDocument();
        },
        {
          timeout: 2000, // Increased timeout for React Flow operations
        }
      );
    });
  });

  describe("Theme Toggle", () => {
    it("should toggle between light and dark themes", async () => {
      // Arrange
      const themeBtn = screen.getByTitle("Toggle theme");

      // Assert initial state
      await waitFor(() => {
        expect(document.body.style.backgroundColor).toBe("rgb(255, 255, 255)");
      });

      // Act & Assert dark theme
      await user.click(themeBtn);
      await waitFor(() => {
        expect(document.body.style.backgroundColor).toBe("rgb(24, 24, 27)");
      });

      // Act & Assert light theme
      await user.click(themeBtn);
      await waitFor(() => {
        expect(document.body.style.backgroundColor).toBe("rgb(255, 255, 255)");
      });
    });
  });

  describe("View Controls", () => {
    it("should reset node positions when reset button is clicked", async () => {
      const resetBtn = screen.getByTitle("Reset view");
      const nodeText = "Req 1.1";

      await user.click(resetBtn);

      expect(
        screen.getByText(nodeText),
        "Node should remain in document after reset"
      ).toBeInTheDocument();
    });
  });
});
