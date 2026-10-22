import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      // Core no-unused-vars does not see JSX usage: components are capitalized and
      // framer-motion is used as <motion.div>, so both are exempted here.
      "no-unused-vars": ["error", { varsIgnorePattern: "^([A-Z_]|motion$)" }],
    },
  },
  {
    files: ["vite.config.js", "scripts/**/*.{js,mjs}"],
    languageOptions: { globals: globals.node },
  },
]);
