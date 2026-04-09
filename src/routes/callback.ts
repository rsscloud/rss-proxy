import { Hono } from "hono";
import type { Config } from "../config.js";
import { notifyFeeds } from "../services/rsscloud.js";

export function callbackRoutes(config: Config): Hono {
  const app = new Hono();

  const handler = async (c: any) => {
    const challenge = c.req.query("challenge");
    if (challenge) {
      return c.text(challenge, 200);
    }

    const body = await c.req.parseBody();
    const url = body["url"] as string;

    if (url) {
      console.log(`Feed updated notification for: ${url}`);
      notifyFeeds(config.emulatedFeeds).catch((err) =>
        console.error("Error notifying feeds:", err)
      );
    }

    return c.text("Thanks", 200);
  };

  app.get("/", handler);
  app.post("/", handler);

  return app;
}
