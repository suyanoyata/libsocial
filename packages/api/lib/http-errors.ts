import { HTTPException } from "hono/http-exception";

export class AnonymousForbidden extends HTTPException {
  constructor(message?: string) {
    super(403, {
      message: message || "This feature is not available for anonymous users",
    });
  }
}

export class Unauthorized extends HTTPException {
  constructor(message?: string) {
    super(401, {
      message: message || "Unauthorized",
    });
  }
}
