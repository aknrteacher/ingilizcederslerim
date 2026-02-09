// Vercel serverless function for assignment points API

// Simple UUID generator (no external dependencies)
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

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
  getParticipation: async (studentId: string, classId: string, week: string): Promise<Participation | undefined> => {
    return Array.from(participationMap.values()).find(
      (p) => p.studentId === studentId && p.classId === classId && p.week === week,
    );
  },
  addAssignmentPoint: async (studentId: string, classId: string, week: string): Promise<Participation> => {
    const existing = await storage.getParticipation(studentId, classId, week);
    if (existing) {
      const updated: Participation = {
        ...existing,
        assignments: (existing.assignments || 0) + 1,
        updatedAt: new Date(),
      };
      participationMap.set(existing.id, updated);
      return updated;
    } else {
      const id = generateId();
      const participation: Participation = {
        id,
        studentId,
        classId,
        week,
        points: 0,
        assignments: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      participationMap.set(id, participation);
      return participation;
    }
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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { studentId, classId, week } = req.body;
    if (!studentId || !classId || !week) {
      return res.status(400).json({ message: 'Missing required fields: studentId, classId, week' });
    }
    const participation = await storage.addAssignmentPoint(studentId, classId, week);
    return res.status(200).json({ participation });
  } catch (error: any) {
    console.error('Error in classroom/participation/assignment:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
