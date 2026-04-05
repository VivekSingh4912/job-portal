import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://e7579c189eff5377e52b7ac3d52849d6@o4511081461645312.ingest.us.sentry.io/4511081471213568",
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
  integrations: [
    ...Sentry.getDefaultIntegrations(),
    Sentry.httpIntegration({ tracing: true }),
    Sentry.expressIntegration(),
    Sentry.mongooseIntegration(),
    nodeProfilingIntegration(),
  ],
});

// Optional: Keep profiler disabled in CI/test if needed
// Sentry.profiler.startProfiler();
// ...
// Sentry.profiler.stopProfiler();