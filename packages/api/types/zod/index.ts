import { z } from "zod";

export * from "~/types/zod/chapter-controller-validation";
export * from "~/types/zod/manga";
export * from "~/types/zod/anime";
export * from "~/types/zod/associations";

export const header = z.object({
  _s: z.string(),
});

export const catalogSearchSchema = z
  .object({
    q: z.string().optional(),
    genres: z.array(z.number()).optional(),
    cursor: z.coerce.number().optional().default(1),
  })
  .merge(header);

export type CatalogSearchFormData = Omit<
  z.infer<typeof catalogSearchSchema>,
  "_s"
>;
