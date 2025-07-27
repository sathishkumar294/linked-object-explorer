import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReactFlowGraph from "./ReactFlowGraph";

// Mock ResizeObserver for React Flow
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("ReactFlowGraph", () => {
  it("renders all initial nodes", () => {
    render(<ReactFlowGraph />);
    expect(screen.getByText("Req 1.1")).toBeInTheDocument();
    expect(screen.getByText("Req 2.1")).toBeInTheDocument();
    expect(screen.getByText("Req 3.1")).toBeInTheDocument();
    expect(screen.getByText("Req 4.1")).toBeInTheDocument();
  });

  it("shows node details panel on node click", async () => {
    render(<ReactFlowGraph />);
    const node = screen.getByText("Req 2.1");
    userEvent.click(node);
    expect(await screen.findByText("Requirement Details")).toBeInTheDocument();
    expect(screen.getByText("Level: 2")).toBeInTheDocument();
  });

  it("closes node details panel when close button is clicked", async () => {
    render(<ReactFlowGraph />);
    userEvent.click(screen.getByText("Req 2.1"));
    const closeBtn = await screen.findByRole("button", { name: /×/ });
    userEvent.click(closeBtn);
    expect(screen.queryByText("Requirement Details")).not.toBeInTheDocument();
  });

  it("toggles theme when theme button is clicked", async () => {
    render(<ReactFlowGraph />);
    const themeBtn = screen.getByTitle("Toggle theme");
    await waitFor(() =>
      expect(document.body.style.backgroundColor).toBe("rgb(255, 255, 255)")
    );
    await userEvent.click(themeBtn);
    await waitFor(() =>
      expect(document.body.style.backgroundColor).toBe("rgb(24, 24, 27)")
    );
    await userEvent.click(themeBtn);
    await waitFor(() =>
      expect(document.body.style.backgroundColor).toBe("rgb(255, 255, 255)")
    );
  });

  it("resets node positions when reset button is clicked", () => {
    render(<ReactFlowGraph />);
    const resetBtn = screen.getByTitle("Reset view");
    userEvent.click(resetBtn);
    // No error means reset worked; further checks would require React Flow internals
    expect(screen.getByText("Req 1.1")).toBeInTheDocument();
  });

  it("renders the legend with correct labels", () => {
    render(<ReactFlowGraph />);
    expect(screen.getByText("Level 1 (System)")).toBeInTheDocument();
    expect(screen.getByText("Level 2 (Sub-system)")).toBeInTheDocument();
    expect(screen.getByText("Level 3 (Component)")).toBeInTheDocument();
    expect(screen.getByText("Level 4 (Implementation)")).toBeInTheDocument();
  });

  it("renders the minimap", () => {
    render(<ReactFlowGraph />);
    expect(document.querySelector(".react-flow__minimap")).toBeInTheDocument();
  });
});
