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

export function parseCloudTag(xml: string): CloudInfo | null {
  const match = xml.match(/<cloud\s([^>]*)\/?>/)
  if (!match) return null;

  const attrs = match[1];
  const domain = extractAttr(attrs, "domain");
  const port = extractAttr(attrs, "port");
  const path = extractAttr(attrs, "path");
  const protocol = extractAttr(attrs, "protocol");

  if (!domain || !port || !path) return null;

  return {
    domain,
    port: parseInt(port, 10),
    path,
    protocol: protocol || "http-post",
  };
}

function extractAttr(attrs: string, name: string): string | null {
  const match = attrs.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : null;
}
