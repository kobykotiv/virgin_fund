import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createStrategy = async (userId: string, name: string, config: object) => {
  return await prisma.strategy.create({
    data: {
      name,
      config,
      userId,
    },
  });
};

export const getStrategiesByUser = async (userId: string) => {
  return await prisma.strategy.findMany({
    where: { userId },
  });
};

export const updateStrategy = async (strategyId: string, updates: { name?: string; config?: object }) => {
  return await prisma.strategy.update({
    where: { id: strategyId },
    data: updates,
  });
};

export const deleteStrategy = async (strategyId: string) => {
  return await prisma.strategy.delete({
    where: { id: strategyId },
  });
};
