 import { defineConfig } from 'orval';
 
 export default defineConfig({
   scheduler: {
     input: './orval.yaml',
     output: {
      target: './src/shared/api/scheduler.ts',
      baseUrl: "http://localhost:3000/api",
      // mock: true,
      mode: "split",
      client: "fetch",
      override: {
        mutator: "./src/shared/api/fetch.ts"
      }
    },
    // hooks: {
    //   afterAllFilesWrite: "npx prettier --write"
    // }
   },
   zod: {
    input: './orval.yaml',
    output: {
      target: './src/shared/api/zod.ts',
      client: "zod"
    },
   }
 });