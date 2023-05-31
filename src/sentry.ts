export const Sentry = require("@sentry/browser"); // require is used to avoid TS errors related to sentry and project TS versions incompatibility

Sentry.init({
  dsn: "https://6cba1547949e4bdead1c0a3029a45f16@o327936.ingest.sentry.io/4505276125872128",
  release: process.env.VERSION,
  environment: process.env.NODE_ENV,
});
