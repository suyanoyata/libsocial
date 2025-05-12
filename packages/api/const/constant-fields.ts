import {
  AgeRestrictionConstantSchema,
  GenreConstantSchema,
  ImageServersConstantSchema,
} from "~/types/zod/constants";

export const constantFields = {
  imageServers: {
    name: "imageServer",
    schema: ImageServersConstantSchema,
  },
  genres: {
    name: "genre",
    schema: GenreConstantSchema,
  },
  ageRestriction: {
    name: "ageRestriction",
    schema: AgeRestrictionConstantSchema,
  },
};
