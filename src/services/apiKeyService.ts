import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createApiKey = async (userId: string, name: string, key: string, secret: string, provider: string) => {
  return await prisma.apiKey.create({
    data: {
      name,
      key,
      secret,
      provider,
      userId,
    },
  });
};

export const getApiKeysByUser = async (userId: string) => {
  return await prisma.apiKey.findMany({
    where: { userId },
  });
};

export const deleteApiKey = async (apiKeyId: string) => {
  return await prisma.apiKey.delete({
    where: { id: apiKeyId },
  });
};
