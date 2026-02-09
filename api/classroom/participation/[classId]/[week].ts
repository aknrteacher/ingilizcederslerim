// Vercel serverless function for participation data API

// Inline storage to avoid module resolution issues in Vercel
interface Participation {
  id: string;
  studentId: string;
  classId: string;
  week: string;
  points: number;
  assignments: number;
  createdAt: Date;
  updatedAt: Date;
}

const participationMap = new Map<string, Participation>();

const storage = {
  getAllParticipationForClass: async (classId: string, week: string): Promise<Participation[]> => {
    return Array.from(participationMap.values()).filter(
      (p) => p.classId === classId && p.week === week,
    );
  },
};

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { classId, week } = req.query;
    if (!classId || typeof classId !== 'string' || !week || typeof week !== 'string') {
      return res.status(400).json({ message: 'Class ID and week are required' });
    }
    const participation = await storage.getAllParticipationForClass(classId, week);
    return res.status(200).json({ participation });
  } catch (error: any) {
    console.error('Error in classroom/participation:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
