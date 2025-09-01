import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*"],
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts"],
      outDir: "dist",
      copyDtsFiles: false,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        client: resolve(__dirname, "src/client.ts"),
        "wuzapi-client": resolve(__dirname, "src/wuzapi-client.ts"),
        "modules/admin": resolve(__dirname, "src/modules/admin.ts"),
        "modules/session": resolve(__dirname, "src/modules/session.ts"),
        "modules/user": resolve(__dirname, "src/modules/user.ts"),
        "modules/chat": resolve(__dirname, "src/modules/chat.ts"),
        "modules/group": resolve(__dirname, "src/modules/group.ts"),
        "modules/webhook": resolve(__dirname, "src/modules/webhook.ts"),
        "modules/newsletter": resolve(__dirname, "src/modules/newsletter.ts"),
        "types/index": resolve(__dirname, "src/types/index.ts"),
      },
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["axios"],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    sourcemap: true,
    minify: false,
  },
});
