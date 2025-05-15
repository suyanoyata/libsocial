import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { trpcServer } from "@hono/trpc-server";
import { trimTrailingSlash } from "hono/trailing-slash";

import { cors } from "hono/cors";

import { auth } from "~/lib/auth";
import { appRouter } from "~/router";
import { createTRPCContext } from "~/lib/trpc";

const app = new Hono().basePath("/api");

app.use(async (c, next) => {
  let colorStatus = (status: number) => {
    switch ((status / 100) | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
    return `${status}`;
  };

  const start = Date.now();
  console.log(`<-- ${c.req.method} ${c.req.path}`);
  await next();
  const end = Date.now();
  console.log(
    `--> ${c.req.method} ${c.req.path} ${colorStatus(c.res.status)} ${
      end - start
    }ms`
  );
});

app.use(trimTrailingSlash());

app.use(
  "/*",
  cors({
    origin: process.env.BETTER_AUTH_URL!,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    endpoint: "/api/trpc",
    createContext: (c) => createTRPCContext({ headers: c.req.headers }),
  })
);

showRoutes(app);

export default app;
