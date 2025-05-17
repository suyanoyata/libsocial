import { PostHog } from "posthog-node";

export const posthog = new PostHog(process.env.POSTHOG_ANALYTICS!, {
  host: "https://eu.i.posthog.com",
  disableGeoip: true,
});
