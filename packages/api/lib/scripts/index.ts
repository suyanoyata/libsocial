import { PrismaClient } from "~/lib/prisma";

import { genresSeed } from "~/lib/scripts/genres-seed";

const prisma = new PrismaClient();

await genresSeed(prisma);
