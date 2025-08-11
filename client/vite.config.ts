/// <reference types="vitest" />
import * as path from "path"

import svg from "@neodx/svg/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
// import checker from "vite-plugin-checker"
import tsconfigPaths from "vite-tsconfig-paths"
// https://vitejs.dev/config/

export default defineConfig({
  define: {
    MODE: JSON.stringify(process.env.NODE_ENV),
  },
  server: {
    port: 4173,
  },
  // build: {
  //   target: "esnext",
  // },
  plugins: [
    // unusedCode({
    //   patterns: ['src/**/*.*'],
    //   exclude: ['src/**/index.ts', 'src/**/*.test.ts']
    // }),
    tailwindcss(),
    react(),
    // checker({
    //   typescript: true,
    // }),
    tsconfigPaths(),
    svg({
      root: "assets",
      group: true,
      output: "public/sprites",
      metadata: "src/shared/ui/icon/sprite.gen.ts",
      resetColors: {
        replaceUnknown: "#000",
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve("src"),
      },
    ],
  },
})
