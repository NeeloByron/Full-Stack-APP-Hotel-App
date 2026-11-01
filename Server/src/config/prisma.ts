import "dotenv/config"; // variables from .env
import { PrismaClient } from "@prisma/client"; // Prisma client
import { PrismaPg } from "@prisma/adapter-pg"; // PostgreSQL Primsa 

// The postgreSQl adapter, it uses DATABASE_URL from .env to connect Prisma to Neon PostgreSQL database
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

// One Prisma client for the whole backend - express will use this object whenever it needs to read/write data in Neon PostgreSQL
export const prisma = new PrismaClient({
    adapter,
});