import { defineConfig } from "vite";
import os from "os";

// Monkey-patch to bypass networkInterfaces() crash i>
os.networkInterfaces = () => ({});

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
});