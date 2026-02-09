// Vercel serverless function for saving class scores
/// <reference types="node" />
import { z } from 'zod';

const saveScoresSchema = z.object({
  classId: z.string(),
  scores: z.record(z.record(z.array(z.number()))),
});

// Inline storage - MUST match monitor/[code].ts exactly to share storage
interface ClassScores {
  classId: string;
  scores: Record<string, Record<string, number[]>>;
  updatedAt: Date;
}

// Global storage (shared across all API endpoints in the same runtime)
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
      console.log('[scores.ts] POST request received');
      console.log('[scores.ts] req.body type:', typeof req.body);
      console.log('[scores.ts] req.body:', JSON.stringify(req.body, null, 2));
      
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
          console.log('[scores.ts] Parsed string body');
        } catch (e) {
          console.error('[scores.ts] JSON parse error:', e);
          return res.status(400).json({ message: 'Invalid JSON' });
        }
      }

      if (!body || typeof body !== 'object') {
        console.error('[scores.ts] Invalid body:', body);
        return res.status(400).json({ message: 'Request body is required and must be an object' });
      }

      try {
        console.log('[scores.ts] Validating with schema...');
        const data = saveScoresSchema.parse(body);
        console.log('[scores.ts] Validation passed, classId:', data.classId);
        console.log('[scores.ts] Scores keys:', Object.keys(data.scores));
        
        const scoresMap = getScoresMap();
        
        scoresMap.set(data.classId, {
          classId: data.classId,
          scores: data.scores,
          updatedAt: new Date(),
        });

        console.log('[scores.ts] Scores saved successfully for class:', data.classId);
        return res.status(200).json({ success: true });
      } catch (err: any) {
        if (err instanceof z.ZodError) {
          console.error('[scores.ts] Zod validation error:', err.errors);
          return res.status(400).json({ 
            message: err.errors[0]?.message || 'Validation error',
            errors: err.errors 
          });
        }
        console.error('[scores.ts] Unexpected error:', err);
        throw err;
      }
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
