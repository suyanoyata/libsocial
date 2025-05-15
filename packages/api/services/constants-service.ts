import { constantFields } from "~/const/constant-fields";
import { db } from "~/lib/db";

class Service {
  public async getConstants(field: string) {
    const constantField = constantFields[field as "genres"];

    if (!constantField) return null;

    const data = await db[constantField.name as "genre"].findMany();

    return constantField.schema.parse(data);
  }
}

export const ConstantsService = new Service();
