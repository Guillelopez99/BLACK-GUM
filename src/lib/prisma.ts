import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaEnvLogged?: boolean;
};

if (process.env.NODE_ENV === "production" && !globalForPrisma.prismaEnvLogged) {
  console.info(`[prisma] DATABASE_URL ${process.env.DATABASE_URL ? "present" : "missing"}`);
  globalForPrisma.prismaEnvLogged = true;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
