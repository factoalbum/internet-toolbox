import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["components/tools/trading-tools-suite.tsx"],
    rules: {
      // The trading suite selects an icon component from a static title mapping.
      // Keep this rule scoped to that intentional dynamic presentation choice.
      "react-hooks/static-components": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "node_modules/**"]),
]);
