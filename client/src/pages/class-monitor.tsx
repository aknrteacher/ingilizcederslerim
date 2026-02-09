import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const [location] = useLocation();
  const code = location.split('/').pop();

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/classroom/monitor/${code}`],
    queryFn: async () => {
      const res = await fetch(`/api/classroom/monitor/${code}`);
      if (!res.ok) throw new Error('Class not found');
      return res.json();
    },
    enabled: !!code && /^\d{4}$/.test(code || ''),
    refetchInterval: 30000,
  });

  if (!code || !/^\d{4}$/.test(code)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Monitor Code</h1>
              <p className="text-gray-600">Please check the code and try again.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="text-xl font-bold mb-2">Loading...</div>
            <div className="text-gray-600">Fetching class data</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h1>
              <p className="text-gray-600">The monitor code {code} could not be loaded.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { class: classObj, students = [], scores = {}, updatedAt } = data;

  if (!classObj) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Data</h1>
              <p className="text-gray-600">The monitor code {code} returned invalid data.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // EXACT COPY OF ADMIN TABLE - Data Table - Enhanced Visuals with Gradients and Animations
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-2xl border-2 border-blue-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <CardTitle className="text-2xl font-bold relative z-10 flex items-center gap-2">
              <span>📊 Current Data - {classObj.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 bg-gradient-to-br from-gray-50 to-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
                    <th className="border-2 border-gray-300 p-4 text-left font-bold text-gray-800 text-lg">Student Name</th>
                    {CATEGORIES.map((cat) => (
                      <th key={cat.value} className="border-2 border-gray-300 p-4 text-center font-bold text-gray-800">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-base">{cat.label}</span>
                          <span className="text-xs text-gray-600 font-normal bg-gray-200 px-2 py-0.5 rounded-full">({cat.maxSquares})</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: Student, idx: number) => {
                    const studentScores = scores[student.id] || {};
                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="border-2 border-gray-200 p-4 font-semibold">
                          <span className="text-gray-800 text-lg">{student.name}</span>
                        </td>
                        {CATEGORIES.map((cat) => {
                          const catScores = studentScores[cat.value] || new Array(cat.maxSquares).fill(0);
                          const plusCount = catScores.filter((s: number) => s === 1).length;
                          const minusCount = catScores.filter((s: number) => s === -1).length;
                          return (
                            <td key={cat.value} className="border-2 border-gray-200 p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {plusCount > 0 && (
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1.5 rounded-full shadow-sm border border-green-300">
                                    <span className="text-green-700 font-bold text-xl">✓</span>
                                    <span className="text-green-700 font-semibold text-sm">{plusCount}</span>
                                  </div>
                                )}
                                {minusCount > 0 && (
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-red-100 to-rose-100 px-3 py-1.5 rounded-full shadow-sm border border-red-300">
                                    <span className="text-red-700 font-bold text-xl">✗</span>
                                    <span className="text-red-700 font-semibold text-sm">{minusCount}</span>
                                  </div>
                                )}
                                {plusCount === 0 && minusCount === 0 && (
                                  <span className="text-gray-400 text-sm">-</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {(!students || students.length === 0) && (
                    <tr>
                      <td colSpan={CATEGORIES.length + 1} className="border-2 border-gray-200 p-12 text-center text-gray-500 text-lg">
                        No students yet. Add students above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
