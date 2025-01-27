import { z } from "zod";

export const titleInfoRouteSchema = z.object({
  slug_url: z.string(),
  site: z.string().length(1),
});
