import { NextApiRequest, NextApiResponse } from 'next';
import { createFeedback, getFeedbackByUser, getAllFeedback, updateFeedbackStatus } from '../../services/feedbackService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.userId) {
          const feedback = await getFeedbackByUser(query.userId as string);
          return res.status(200).json(feedback);
        } else {
          const allFeedback = await getAllFeedback();
          return res.status(200).json(allFeedback);
        }

      case 'POST':
        const newFeedback = await createFeedback(body.userId, body.content, body.type);
        return res.status(201).json(newFeedback);

      case 'PUT':
        const updatedFeedback = await updateFeedbackStatus(body.feedbackId, body.status);
        return res.status(200).json(updatedFeedback);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
