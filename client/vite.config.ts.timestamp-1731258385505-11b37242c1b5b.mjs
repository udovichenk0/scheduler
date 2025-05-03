// vite.config.ts
import * as path from "path"
import svg from "file:///D:/projects/scheduler/client/node_modules/@neodx/svg/vite.mjs"
import react from "file:///D:/projects/scheduler/client/node_modules/@vitejs/plugin-react/dist/index.mjs"
import { defineConfig } from "file:///D:/projects/scheduler/client/node_modules/vite/dist/node/index.js"
import tsconfigPaths from "file:///D:/projects/scheduler/client/node_modules/vite-tsconfig-paths/dist/index.mjs"
var vite_config_default = defineConfig({
  server: {
    port: 4173,
  },
  build: {
    target: "esnext",
  },
  plugins: [
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
          viewBox: true,
        },
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
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxzY2hlZHVsZXJcXFxcY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwcm9qZWN0c1xcXFxzY2hlZHVsZXJcXFxcY2xpZW50XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9wcm9qZWN0cy9zY2hlZHVsZXIvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCJcclxuXHJcbmltcG9ydCBzdmcgZnJvbSBcIkBuZW9keC9zdmcvdml0ZVwiXHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIlxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiXHJcbi8vIGltcG9ydCBjaGVja2VyIGZyb20gXCJ2aXRlLXBsdWdpbi1jaGVja2VyXCJcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIlxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNDE3MyxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICB0YXJnZXQ6IFwiZXNuZXh0XCIsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgLy8gY2hlY2tlcih7XHJcbiAgICAvLyAgIHR5cGVzY3JpcHQ6IHRydWUsXHJcbiAgICAvLyB9KSxcclxuICAgIHRzY29uZmlnUGF0aHMoKSxcclxuICAgIHN2Zyh7XHJcbiAgICAgIHJvb3Q6IFwiYXNzZXRzXCIsXHJcbiAgICAgIGdyb3VwOiB0cnVlLFxyXG4gICAgICBvdXRwdXQ6IFwicHVibGljXCIsXHJcbiAgICAgIG1ldGFkYXRhOiB7XHJcbiAgICAgICAgcGF0aDogXCJzcmMvc2hhcmVkL3VpL2ljb24vc3ByaXRlLmgudHNcIixcclxuICAgICAgICBydW50aW1lOiB7XHJcbiAgICAgICAgICBzaXplOiB0cnVlLFxyXG4gICAgICAgICAgdmlld0JveDogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcmVzZXRDb2xvcnM6IHtcclxuICAgICAgICByZXBsYWNlVW5rbm93bjogXCIjMDAwXCIsXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiBcIkBcIixcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKFwic3JjXCIpLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICB9LFxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsWUFBWSxVQUFVO0FBRXRCLE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFFN0IsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJTixjQUFjO0FBQUEsSUFDZCxJQUFJO0FBQUEsTUFDRixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxNQUFNO0FBQUEsVUFDTixTQUFTO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGFBQWE7QUFBQSxRQUNYLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWtCLGFBQVEsS0FBSztBQUFBLE1BQ2pDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
