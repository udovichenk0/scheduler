// vite.config.ts
import * as path from "path";
import svg from "file:///C:/Users/WebUser/scheduler/client/node_modules/@neodx/svg/dist/vite.mjs";
import react from "file:///C:/Users/WebUser/scheduler/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/WebUser/scheduler/client/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///C:/Users/WebUser/scheduler/client/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svg({
      root: "assets",
      group: true,
      output: "public",
      definitions: "src/shared/ui/icon/sprite.h.ts",
      resetColors: {
        replaceUnknown: "#000"
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve("src")
      }
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxXZWJVc2VyXFxcXHNjaGVkdWxlclxcXFxjbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFdlYlVzZXJcXFxcc2NoZWR1bGVyXFxcXGNsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvV2ViVXNlci9zY2hlZHVsZXIvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgc3ZnIGZyb20gJ0BuZW9keC9zdmcvdml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIHRzY29uZmlnUGF0aHMoKSxcclxuICAgIHN2Zyh7XHJcbiAgICAgIHJvb3Q6ICdhc3NldHMnLFxyXG4gICAgICBncm91cDogdHJ1ZSxcclxuICAgICAgb3V0cHV0OiAncHVibGljJyxcclxuICAgICAgZGVmaW5pdGlvbnM6ICdzcmMvc2hhcmVkL3VpL2ljb24vc3ByaXRlLmgudHMnLFxyXG4gICAgICByZXNldENvbG9yczoge1xyXG4gICAgICAgIHJlcGxhY2VVbmtub3duOiAnIzAwMCdcclxuICAgICAgfVxyXG4gICAgfSldLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBmaW5kOiAnQCcsXHJcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZSgnc3JjJyksXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1IsWUFBWSxVQUFVO0FBQ3JULE9BQU8sU0FBUztBQUNoQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sY0FBYztBQUFBLElBQ2QsSUFBSTtBQUFBLE1BQ0YsTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsUUFBUTtBQUFBLE1BQ1IsYUFBYTtBQUFBLE1BQ2IsYUFBYTtBQUFBLFFBQ1gsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUFDO0FBQUEsRUFDSixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBa0IsYUFBUSxLQUFLO0FBQUEsTUFDakM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
