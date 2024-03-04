import { PrismaClient } from "@prisma/client";

/**
 * Function to create a singleton instance of the Prisma client.
 * @returns {PrismaClient} - The Prisma client instance.
 */
const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
