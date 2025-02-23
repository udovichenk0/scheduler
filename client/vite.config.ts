/// <reference types="vitest" />
import * as path from "path"

import svg from "@neodx/svg/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import unusedCode from 'vite-plugin-unused-code'
import tailwindcss from '@tailwindcss/vite';
// import checker from "vite-plugin-checker"
import tsconfigPaths from "vite-tsconfig-paths"
// https://vitejs.dev/config/
export default defineConfig({
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
      output: "public",
      metadata: {
        path: "src/shared/ui/icon/sprite.h.ts",
        runtime: {
          size: true,
          viewBox: true
        }
      },
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
