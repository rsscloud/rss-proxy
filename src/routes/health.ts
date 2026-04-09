import { Hono } from "hono";
import { html } from "hono/html";
import type { Config } from "../config.js";
import type { StatusTracker } from "../status.js";

export function healthRoute(config: Config, status: StatusTracker): Hono {
  const app = new Hono();

  app.get("/", (c) => {
    const lastPing = status.lastPingAt
      ? status.lastPingAt.toISOString()
      : "Never";

    const feedLinks = config.emulatedFeeds.map(
      (url) => html`<li><a href="${url}">${url}</a></li>`
    );

    return c.html(html`<!doctype html>
      <html>
        <head>
          <title>rss-proxy</title>
        </head>
        <body>
          <h1>rss-proxy</h1>
          <h2>Upstream Feed</h2>
          <p>
            <a href="${config.upstreamFeedUrl}">${config.upstreamFeedUrl}</a>
          </p>
          <h2>Proxied Feeds</h2>
          <ul>
            ${feedLinks}
          </ul>
          <h2>Last Ping</h2>
          <p>${lastPing}</p>
        </body>
      </html>`);
  });

  return app;
}
