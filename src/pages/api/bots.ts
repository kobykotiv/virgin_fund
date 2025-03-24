import { NextApiRequest, NextApiResponse } from 'next';
import { createBot, getBotsByUser, updateBot, deleteBot } from '../../services/botService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  try {
    switch (method) {
      case 'GET':
        const bots = await getBotsByUser(query.userId as string);
        return res.status(200).json(bots);

      case 'POST':
        const newBot = await createBot(body.userId, body.name, body.strategyId, body.config);
        return res.status(201).json(newBot);

      case 'PUT':
        const updatedBot = await updateBot(body.botId, body.updates);
        return res.status(200).json(updatedBot);

      case 'DELETE':
        await deleteBot(query.botId as string);
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
