import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom";

expect.extend(matchers);

// Mock d3-drag
vi.mock("d3-drag", () => {
  return {
    drag: () => ({
      on: () => ({
        subject: () => ({
          on: () => ({}),
        }),
      }),
    }),
  };
});

// Mock d3-selection event handling
vi.mock("d3-selection", () => {
  return {
    select: () => ({
      on: () => ({}),
    }),
    selectAll: () => ({
      on: () => ({}),
    }),
  };
});

afterEach(() => {
  cleanup();
});
