import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createFeedback = async (userId: string, content: string, type: string) => {
  return await prisma.feedback.create({
    data: {
      content,
      type,
      userId,
    },
  });
};

export const getFeedbackByUser = async (userId: string) => {
  return await prisma.feedback.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAllFeedback = async () => {
  return await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const updateFeedbackStatus = async (feedbackId: string, status: string) => {
  return await prisma.feedback.update({
    where: { id: feedbackId },
    data: { status },
  });
};
