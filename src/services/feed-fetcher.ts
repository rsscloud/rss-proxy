let cachedXml: string | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 30_000;

export async function fetchUpstreamFeed(url: string): Promise<string> {
  const now = Date.now();
  if (cachedXml && now - cachedAt < CACHE_TTL_MS) {
    return cachedXml;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Upstream feed returned ${res.status}`);
  }

  cachedXml = await res.text();
  cachedAt = now;
  return cachedXml;
}
