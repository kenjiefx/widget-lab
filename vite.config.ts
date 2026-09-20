import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ command }) => {
  return {
    server: {
      port: 8045,
      strictPort: true,
    },
    plugins: [react()],
    base: "/",
    build: {
      minify: false,
      rollupOptions: {
        input: {
          index: "index.html",
        },
      },
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
      sourcemap: false,
    },
  };
});
