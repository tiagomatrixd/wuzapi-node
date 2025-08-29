import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts"],
      outDir: "dist",
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "WuzAPI",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["axios"],
      output: {
        globals: {
          axios: "axios",
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
});
