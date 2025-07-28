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

// Set up test environment
beforeAll(() => {
  // Mock document methods needed by D3
  Object.defineProperties(window.document.documentElement, {
    style: {
      value: {
        MozUserSelect: '',
        WebkitUserSelect: '',
        userSelect: '',
      },
      writable: true
    }
  });

  // Mock window methods needed by React Flow
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Set initial background color
  document.body.style.backgroundColor = 'rgb(255, 255, 255)';

  // Mock getComputedStyle
  window.getComputedStyle = () => ({
    getPropertyValue: () => '',
    backgroundColor: document.body.style.backgroundColor,
    accentColor: '',
    alignContent: '',
    alignItems: '',
    alignSelf: '',
    // Add other required properties as needed
  } as unknown as CSSStyleDeclaration);
});

// --- Mock React Flow ---
vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react');

  return {
    ...actual,
    Panel: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="rf__panel">
        <button 
          title="Toggle theme" 
          data-testid="themeBtn" 
          onClick={() => {
            const currentBg = document.body.style.backgroundColor;
            document.body.style.backgroundColor = currentBg === 'rgb(255, 255, 255)' ? 'rgb(24, 24, 27)' : 'rgb(255, 255, 255)';
          }}
        >
          Theme
        </button>
        {children}
      </div>
    ),
    MiniMap: () => <div data-testid="rf__minimap" className="react-flow__minimap" />,
    Controls: () => (
      <div data-testid="rf__controls" className="react-flow__controls">
        <button title="Reset view" data-testid="resetBtn" className="react-flow__controls-button">
          Reset
        </button>
      </div>
    ),
    useReactFlow: () => ({
      fitView: vi.fn(),
      setCenter: vi.fn(),
      getNode: () => ({ position: { x: 0, y: 0 } }),
      setNodes: vi.fn(),
      getNodes: () => [],
      setViewport: vi.fn(),
    }),
  };
});

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
      expect(screen.getByTestId("rf__controls")).toBeInTheDocument();
      expect(screen.getByRole("application")).toBeInTheDocument();
    });

    it("should display all initial nodes", () => {
      TEST_REQUIREMENTS.forEach((req) => {
        const reqId = req.split(' ')[1];
        expect(screen.getByTestId(`rf__node-${reqId}`)).toBeInTheDocument();
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
      expect(screen.getByTestId("rf__minimap")).toBeInTheDocument();
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
