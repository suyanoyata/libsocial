import { PrismaClient } from "@prisma/client";

import { genresSeed } from "lib/scripts/genres-seed";

const prisma = new PrismaClient();

await genresSeed(prisma);
