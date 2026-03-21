import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration} from "@sentry/profiling-node";

Sentry.init({
   dsn: "https://e7579c189eff5377e52b7ac3d52849d6@o4511081461645312.ingest.us.sentry.io/4511081471213568",
  // "https://7684e5a0eb9b67d146635eec1c55299f@ao4508408152653824.ingest.us.sentry.io/4508408155406336",
integrations:[
  nodeProfilingIntegration(),
  Sentry.mongooseIntegration()

],
// tracesSampleRate: 1.0,
});

Sentry.profiler.startProfiler();

Sentry.startSpan({
  name: "My First Transaction",
}, () => {
});

Sentry.profiler.stopProfiler();