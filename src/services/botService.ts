import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBot = async (userId: string, name: string, strategyId: string, config: object) => {
  return await prisma.bot.create({
    data: {
      name,
      config,
      userId,
      strategyId,
    },
  });
};

export const getBotsByUser = async (userId: string) => {
  return await prisma.bot.findMany({
    where: { userId },
    include: { strategy: true },
  });
};

export const updateBot = async (botId: string, updates: { name?: string; config?: object; status?: string }) => {
  return await prisma.bot.update({
    where: { id: botId },
    data: updates,
  });
};

export const deleteBot = async (botId: string) => {
  return await prisma.bot.delete({
    where: { id: botId },
  });
};
