// Vercel serverless function for saving class scores
/// <reference types="node" />
import { z } from 'zod';

const saveScoresSchema = z.object({
  classId: z.string(),
  scores: z.record(z.record(z.array(z.number()))),
});

interface ClassScores {
  classId: string;
  scores: Record<string, Record<string, number[]>>;
  updatedAt: Date;
}

declare global {
  var __classScoresStorage: Map<string, ClassScores> | undefined;
}

const getScoresMap = (): Map<string, ClassScores> => {
  if (!global.__classScoresStorage) {
    global.__classScoresStorage = new Map<string, ClassScores>();
  }
  return global.__classScoresStorage;
};

export default async function handler(req: any, res: any) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const method = req.method || 'GET';

    if (method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid JSON' });
        }
      }

      const data = saveScoresSchema.parse(body);
      const scoresMap = getScoresMap();
      
      scoresMap.set(data.classId, {
        classId: data.classId,
        scores: data.scores,
        updatedAt: new Date(),
      });

      return res.status(200).json({ success: true });
    }

    if (method === 'GET') {
      const classId = req.query.classId;
      if (!classId) {
        return res.status(400).json({ message: 'classId required' });
      }

      const scoresMap = getScoresMap();
      const scores = scoresMap.get(classId);
      
      if (!scores) {
        return res.status(200).json({ scores: {} });
      }

      return res.status(200).json({ scores: scores.scores });
    }

    return res.status(405).json({ message: `Method ${method} not allowed` });
  } catch (error: any) {
    console.error('Error in scores handler:', error);
    return res.status(500).json({ message: error?.message || 'Internal server error' });
  }
}
