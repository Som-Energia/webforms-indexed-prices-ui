import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    "baseUrl": "http://localhost:5175/"
  },
});

//{
//  "projectId": "6y5vbm",
 // "baseUrl": "http://localhost:3000",
 // "viewportWidth": 1200,
 // "viewportHeight": 960,
 // "video": false,
 // "videoUploadOnPasses": false
//}

