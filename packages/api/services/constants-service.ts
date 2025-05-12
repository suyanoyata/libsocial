import { constantFields } from "~/const/constant-fields";
import { db } from "~/lib/db";

class Service {
  public async getConstants(fields?: string[]) {
    let response = {};

    if (!fields) return null;

    await Promise.all(
      fields.map(async (field) => {
        if (field == "imageServers") return null;
        const constantField = constantFields[field as "genres"];

        if (!constantField) return null;

        const data = await db[constantField.name as "genre"].findMany();

        response = {
          ...response,
          [field]: constantField.schema.parse(data),
        };
      })
    );

    return response;
  }
}

export const ConstantsService = new Service();
