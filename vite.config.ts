import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,

    // ✅ Add this block
    https: {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost.pem"),
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
