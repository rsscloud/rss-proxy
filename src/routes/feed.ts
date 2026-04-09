import { Hono } from "hono";
import type { Config } from "../config.js";
import { fetchUpstreamFeed } from "../services/feed-fetcher.js";
import { replaceCloudTag } from "../lib/xml.js";

export function feedRoutes(config: Config): Hono {
  const app = new Hono();

  app.get("/", async (c) => {
    try {
      const xml = await fetchUpstreamFeed(config.upstreamFeedUrl);
      const modified = replaceCloudTag(xml);
      return c.body(modified, 200, {
        "Content-Type": "application/rss+xml; charset=utf-8",
      });
    } catch (err) {
      console.error("Failed to fetch upstream feed:", err);
      return c.text("Bad Gateway", 502);
    }
  });

  return app;
}
