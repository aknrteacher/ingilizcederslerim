import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  monitorCode: string;
}

interface Student {
  id: string;
  name: string;
}

const CATEGORIES = [
  { value: 'assignments', label: 'Assignments', maxSquares: 18 },
  { value: 'participation', label: 'Participation', maxSquares: 18 },
  { value: 'attitude', label: 'Attitude', maxSquares: 18 },
  { value: 'project', label: 'Project', maxSquares: 5 },
  { value: 'trivia', label: 'Trivia', maxSquares: 5 },
  { value: 'advancement', label: 'Advancement', maxSquares: 5 },
];

export default function ClassMonitor() {
  const [match, params] = useRoute('/:code');
  const code = params?.code;

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/classroom/monitor/${code}`],
    queryFn: async () => {
      const res = await fetch(`/api/classroom/monitor/${code}`);
      if (!res.ok) throw new Error('Class not found');
      return res.json();
    },
    enabled: !!code && /^\d{4}$/.test(code || ''),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (!code || !/^\d{4}$/.test(code)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Monitor Code</h1>
            <p className="text-gray-600">Please check the code and try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold mb-2">Loading...</div>
          <div className="text-gray-600">Fetching class data</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Class Not Found</h1>
            <p className="text-gray-600">The monitor code {code} does not exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { class: classObj, students, scores, updatedAt } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{classObj.name}</CardTitle>
            {updatedAt && (
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {new Date(updatedAt).toLocaleString()}
              </p>
            )}
          </CardHeader>
        </Card>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left font-bold">Student Name</th>
                {CATEGORIES.map((cat) => (
                  <th key={cat.value} className="border p-3 text-center font-bold">
                    {cat.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student: Student) => {
                const studentScores = scores[student.id] || {};
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="border p-3 font-semibold">{student.name}</td>
                    {CATEGORIES.map((cat) => {
                      const catScores = studentScores[cat.value] || new Array(cat.maxSquares).fill(0);
                      const plusCount = catScores.filter((s: number) => s === 1).length;
                      const minusCount = catScores.filter((s: number) => s === -1).length;
                      return (
                        <td key={cat.value} className="border p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {plusCount > 0 && (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="text-green-600 font-bold">{plusCount}</span>
                              </div>
                            )}
                            {minusCount > 0 && (
                              <div className="flex items-center gap-1">
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="text-red-600 font-bold">{minusCount}</span>
                              </div>
                            )}
                            {plusCount === 0 && minusCount === 0 && (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
