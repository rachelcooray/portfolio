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
    "next-env.d.ts",
    // The old Flutter app and its contact backend are kept for reference only.
    "client/**",
    "server/**",
  ]),
  {
    // Static export with unoptimised images: next/image adds nothing here.
    rules: { "@next/next/no-img-element": "off" },
  },
]);

export default eslintConfig;
