import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { loadConfig } from "./config.js";
import { feedRoutes } from "./routes/feed.js";
import { callbackRoutes } from "./routes/callback.js";
import { subscribe } from "./services/rsscloud.js";

const config = loadConfig();
const app = new Hono();

app.route("/", feedRoutes(config));
app.route("/feedupdated", callbackRoutes(config));

async function subscriptionLoop() {
  while (true) {
    try {
      await subscribe(config);
    } catch (err) {
      console.error("Subscription failed:", err);
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
