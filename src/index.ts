import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { loadConfig } from "./config.js";
import { createStatusTracker } from "./status.js";
import { healthRoute } from "./routes/health.js";
import { feedRoutes } from "./routes/feed.js";
import { callbackRoutes } from "./routes/callback.js";
import { subscribe } from "./services/rsscloud.js";

const config = loadConfig();
const status = createStatusTracker();
const app = new Hono();

app.route("/", healthRoute(config, status));
app.route("/feedupdated", callbackRoutes(config, status));
app.route("/", feedRoutes(config));

async function subscriptionLoop() {
  while (true) {
    try {
      await subscribe(config);
    } catch (err) {
      console.error("Subscription failed:", err instanceof Error ? err.message : err);
    }
    await new Promise((r) =>
      setTimeout(r, config.resubscribeIntervalHours * 60 * 60 * 1000)
    );
  }
}

subscriptionLoop();

serve({ fetch: app.fetch, port: config.port }, (info) => {
  console.log(`RSS proxy listening on port ${info.port}`);
});
