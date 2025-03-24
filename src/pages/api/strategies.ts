import { NextApiRequest, NextApiResponse } from 'next';
import { createStrategy, getStrategiesByUser, updateStrategy, deleteStrategy } from '../../services/strategyService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  try {
    switch (method) {
      case 'GET':
        const strategies = await getStrategiesByUser(query.userId as string);
        return res.status(200).json(strategies);

      case 'POST':
        const newStrategy = await createStrategy(body.userId, body.name, body.config);
        return res.status(201).json(newStrategy);

      case 'PUT':
        const updatedStrategy = await updateStrategy(body.strategyId, body.updates);
        return res.status(200).json(updatedStrategy);

      case 'DELETE':
        await deleteStrategy(query.strategyId as string);
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
