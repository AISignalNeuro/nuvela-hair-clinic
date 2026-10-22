import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH lets the same build run at "/" locally and at "/<repo>/" on GitHub Pages.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.BASE_PATH || "/",
    plugins: [react()],
    server: { port: 5173 },
    preview: { port: 4173 },
    build: {
      target: "es2020",
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          // Long-lived vendor chunks so app updates don't invalidate cached libraries.
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (/framer-motion|motion-dom|motion-utils/.test(id)) return "motion";
            if (/react-router/.test(id)) return "router";
            if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
            return "vendor";
          },
        },
      },
    },
  };
});
