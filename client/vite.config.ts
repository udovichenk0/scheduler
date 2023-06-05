import * as path from 'path'
import svg from '@neodx/svg/vite';
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svg({
      root: 'assets',
      group: true,
      output: 'public',
      definitions: 'src/shared/ui/icon/sprite.h.ts',
      resetColors: {
        replaceUnknown: '#000'
      }
    })],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve('src'),
      },
    ],
  },
})