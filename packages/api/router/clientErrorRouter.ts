import { z } from "zod";
import { t } from "~/lib/trpc";

import { posthog } from "~/lib/posthog";

const reportSchema = z.object({
  name: z.string(),
  message: z.string().optional(),
  cause: z.string().optional(),
  stack: z.string().optional(),
});

export const clientErrorRouter = t.router({
  report: t.procedure.input(reportSchema).mutation(async ({ input, ctx }) => {
    posthog.capture({
      distinctId: ctx.user?.email ?? "anonymous",
      event: "unrecoverable_error",
      properties: input,
    });
  }),
});
