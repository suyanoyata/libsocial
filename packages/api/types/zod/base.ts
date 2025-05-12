import { z } from "zod";

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
  adult: z.boolean(),
});
