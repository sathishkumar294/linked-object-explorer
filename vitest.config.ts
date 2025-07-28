import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setupTests.ts",
    globals: true,
    testTimeout: 10000,
    silent: true,
    exclude: ["**/ReactFlowGraph.spec.ts", "node_modules/**"],
  },
});
