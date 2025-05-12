import { Context, Hono } from "hono";
import { ConstantsService } from "~/services";

const app = new Hono();

app.get("/", async (context: Context) => {
  const fields = context.req.queries("fields[]");

  const data = await ConstantsService.getConstants(fields);

  return context.json({
    data,
  });
});

export default app;
