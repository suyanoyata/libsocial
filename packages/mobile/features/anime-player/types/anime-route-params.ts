import { z } from "zod"

export const AnimeRouteSchema = z.object({
  slug_url: z.string(),
  episodeIndex: z.string().optional(),
})

export type AnimeRouteType = z.infer<typeof AnimeRouteSchema>
