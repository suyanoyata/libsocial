import { z } from "zod";

export const AnimeRouteSchema = z.object({
  slug_url: z.string(),
});

export type AnimeRouteType = z.infer<typeof AnimeRouteSchema>;
