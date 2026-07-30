import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // required so the Vite dev server is reachable from inside Docker
    port: 5173,
    watch: {
      usePolling: true, // needed for hot-reload reliability on some Docker volume setups
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
});
