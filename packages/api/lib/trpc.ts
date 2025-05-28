import { initTRPC, TRPCError } from "@trpc/server"

import SuperJSON from "superjson"
import { ZodError } from "zod"
import { auth } from "~/lib/auth"

import type { ModelName, User } from "~/lib/prisma"
import { appRouter } from "~/router"

const base = initTRPC.context<{ user?: User; type: ModelName }>().create({
  transformer: SuperJSON,
  errorFormatter(opts) {
    const { shape, error } = opts

    // console.error(error)

    return {
      ...shape,
      data: {
        ...shape.data,
        dbError: error.code === "INTERNAL_SERVER_ERROR" ? error.message : null,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null
      }
    }
  }
})

const { middleware, procedure: publicProcedure } = base

const enforceUser = middleware(({ ctx, next }) => {
  if (!ctx.user?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in"
    })
  }
  return next({
    ctx: { user: ctx.user }
  })
})

const protectedProcedure = publicProcedure.use(enforceUser)

export const t = Object.assign(base, {
  publicProcedure,
  protected: protectedProcedure
})

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const authSession = await auth.api.getSession({ headers: opts.headers })

  const siteId = opts.headers.get("siteId") ?? "1"

  return { user: authSession?.user, type: siteId == "1" ? "manga" : "anime" }
}

export type AppRouter = typeof appRouter
