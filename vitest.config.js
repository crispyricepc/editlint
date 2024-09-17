// @ts-check

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    coverage: {
      enabled: true,
      include: ["src/"],
      exclude: ["src/index.ts", "src/types.ts"],
    },
  },
});
