import { z } from "zod";

export const readerPropsSchema = z.object({
  slug_url: z.string(),
  index: z.string(),
});
