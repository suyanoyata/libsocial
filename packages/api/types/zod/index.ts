import { z } from "zod";

export * from "~/types/zod/chapter-controller-validation";
export * from "~/types/zod/manga";
export * from "~/types/zod/anime";
export * from "~/types/zod/relations";

export const catalogSearchSchema = z
  .object({
    q: z.string().optional(),
    genres: z.array(z.number()).optional(),
    cursor: z.coerce.number().optional().default(1),
    siteId: z.string().optional().default("1"),
  })
  .transform((val) => {
    return {
      ...val,
      type: val.siteId == "1" ? "manga" : "anime",
    };
  });

export type CatalogSearchFormData = z.infer<typeof catalogSearchSchema>;
