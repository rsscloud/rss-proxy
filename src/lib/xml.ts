import { XMLParser } from "fast-xml-parser";

const CLOUD_TAG = `<cloud domain="rpc.rsscloud.io" port="5337" path="/pleaseNotify" registerProcedure="" protocol="http-post"/>`;

const CLOUD_REGEX = /<cloud\s[^>]*\/?>(\s*<\/cloud>)?/i;

export function replaceCloudTag(xml: string): string {
  if (CLOUD_REGEX.test(xml)) {
    return xml.replace(CLOUD_REGEX, CLOUD_TAG);
  }
  // If no <cloud> tag exists, insert after the first <link>...</link> in <channel>
  const linkCloseIndex = xml.indexOf("</link>");
  if (linkCloseIndex !== -1) {
    const insertAt = linkCloseIndex + "</link>".length;
    return xml.slice(0, insertAt) + "\n    " + CLOUD_TAG + xml.slice(insertAt);
  }
  return xml;
}

export interface CloudInfo {
  domain: string;
  port: number;
  path: string;
  protocol: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export function parseCloudTag(xml: string): CloudInfo | null {
  const parsed = parser.parse(xml);
  const cloud = parsed?.rss?.channel?.cloud;
  if (!cloud) return null;

  const domain = cloud["@_domain"];
  const port = cloud["@_port"];
  const path = cloud["@_path"];
  const protocol = cloud["@_protocol"];

  if (!domain || !port || !path) return null;

  return {
    domain,
    port: parseInt(String(port), 10),
    path,
    protocol: protocol || "http-post",
  };
}
