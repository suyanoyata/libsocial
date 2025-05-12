import { handle } from "hono/vercel";
import app from "api";

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
