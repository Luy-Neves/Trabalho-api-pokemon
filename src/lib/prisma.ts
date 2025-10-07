import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Conexão com o banco de dados estabelecida");
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error);
    return false;
  }
};
