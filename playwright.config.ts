import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command:
      "node ./node_modules/dotenv-cli/cli.js -e .env.test -- npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
