import { z } from "zod";

class Validation {
  public query = z.object(
    {
      volume: z.string(),
      number: z.string(),
    },
    {
      message: "Provide all fields",
    }
  );
}

export const ChapterControllerValidation = new Validation();
