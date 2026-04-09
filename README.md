# rss-proxy

An RSS feed proxy with rssCloud integration. Fetches an upstream RSS feed, modifies the rssCloud tags, and serves it to emulated feeds. Handles feed update notifications via callbacks and automatically resubscribes to upstream feeds on a configured interval.

## Installation (Dockge)

```yaml
services:
  web:
    image: andrewshell/rss-proxy:latest
    restart: unless-stopped
    ports:
      - 3010:3010
    env_file:
      - .env
networks: {}
```

## Environment Variables

| Variable                     | Required | Default | Description                                          |
| ---------------------------- | -------- | ------- | ---------------------------------------------------- |
| `PORT`                       | No       | `3010`  | Server listening port                                |
| `UPSTREAM_FEED_URL`          | Yes      |         | URL of the upstream RSS feed to proxy                |
| `CALLBACK_URL`               | Yes      |         | Callback URL for receiving feed update notifications |
| `EMULATED_FEED_1`            | Yes      |         | URL of the first feed to emulate                     |
| `EMULATED_FEED_2`, `3`, etc. | No       |         | Additional feed URLs to emulate                      |
| `RESUBSCRIBE_INTERVAL_HOURS` | No       | `24`    | Hours between subscription renewal attempts          |
