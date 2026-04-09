import { XMLParser } from "fast-xml-parser";
import type { Config } from "../config.js";
import { fetchUpstreamFeed } from "./feed-fetcher.js";
import { parseCloudTag } from "../lib/xml.js";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export async function subscribe(config: Config): Promise<void> {
  const xml = await fetchUpstreamFeed(config.upstreamFeedUrl);
  const cloud = parseCloudTag(xml);
  if (!cloud) {
    console.error("No <cloud> tag found in upstream feed, cannot subscribe");
    return;
  }

  const callbackUrl = new URL(config.callbackUrl);
  const subscribeUrl = `http://${cloud.domain}:${cloud.port}${cloud.path}`;

  const body = new URLSearchParams({
    domain: callbackUrl.hostname,
    port: callbackUrl.port || (callbackUrl.protocol === "https:" ? "443" : "80"),
    path: callbackUrl.pathname,
    registerProcedure: "",
    protocol: "http-post",
    url1: config.upstreamFeedUrl,
  });

  const res = await fetch(subscribeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Subscription failed (${res.status}): ${text}`);
  }

  const parsed = parser.parse(text);
  const result = parsed?.notifyResult;
  if (result) {
    const success = result["@_success"] === "true";
    const msg = result["@_msg"] || "";
    if (!success) {
      throw new Error(`Subscription rejected: ${msg}`);
    }
  }

  console.log(`Subscribed to ${subscribeUrl} for ${config.upstreamFeedUrl}`);
}

export async function notifyFeeds(feedUrls: string[]): Promise<void> {
  const results = await Promise.allSettled(
    feedUrls.map(async (url) => {
      const res = await fetch("https://rpc.rsscloud.io/ping", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ url }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ping failed for ${url} (${res.status}): ${text}`);
      }
      console.log(`Pinged rpc.rsscloud.io for ${url}`);
    })
  );

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Notify error:", result.reason);
    }
  }
}
