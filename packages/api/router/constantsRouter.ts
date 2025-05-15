import { z } from "zod";
import { t } from "~/lib/trpc";

import { ConstantsService } from "~/services";

export const constantsRouter = t.router({
  get: t.procedure.input(z.string()).query(async ({ input }) => {
    const data = await ConstantsService.getConstants(input);

    return data;
  }),
});
