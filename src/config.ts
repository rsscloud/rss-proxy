export interface Config {
  port: number;
  upstreamFeedUrl: string;
  callbackUrl: string;
  emulatedFeeds: string[];
  resubscribeIntervalHours: number;
}

function parseEmulatedFeeds(): string[] {
  const feeds: string[] = [];
  for (let i = 1; ; i++) {
    const value = process.env[`EMULATED_FEED_${i}`];
    if (!value) break;
    feeds.push(value.trim());
  }
  return feeds;
}

export function loadConfig(): Config {
  return {
    port: parseInt(process.env.PORT ?? "3010", 10),
    upstreamFeedUrl: process.env.UPSTREAM_FEED_URL ?? "",
    callbackUrl: process.env.CALLBACK_URL ?? "",
    emulatedFeeds: parseEmulatedFeeds(),
    resubscribeIntervalHours: parseInt(
      process.env.RESUBSCRIBE_INTERVAL_HOURS ?? "24",
      10
    ),
  };
}
