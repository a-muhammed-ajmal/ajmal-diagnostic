import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    // Design reference, not production code. `prototypes/support.js` is the
    // prototype runtime the handoff README marks "Not for production" — it
    // assigns to `module` and carries unused locals by design.
    "design_handoff_signal_stack/**",
  ]),
]);

export default eslintConfig;
