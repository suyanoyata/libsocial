import { z } from "zod";

export const GenreConstantSchema = z.array(
  z.object({
    name: z.string(),
    // site_ids: z.array(z.number()),
    id: z.number(),
    adult: z.boolean().optional(),
  })
);

export const AgeRestrictionConstantSchema = z.array(
  z.object({
    id: z.number(),
    label: z.string(),
    site_ids: z.array(z.number()),
  })
);

export const ImageServersConstantSchema = z.array(
  z.object({
    id: z.string(),
    label: z.string(),
    url: z.string(),
    site_ids: z.array(z.number()),
  })
);
