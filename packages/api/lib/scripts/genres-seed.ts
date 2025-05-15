import axios from "axios";
import { PrismaClient } from "~/lib/prisma";
import { GenreConstantSchema } from "~/types/zod/constants";

export const genresSeed = async (prisma: PrismaClient) => {
  const {
    data: {
      data: { genres },
    },
  } = await axios("https://api2.mangalib.me/api/constants?fields[]=genres");

  await prisma.genre.createMany({
    data: GenreConstantSchema.parse(genres),
  });
};
