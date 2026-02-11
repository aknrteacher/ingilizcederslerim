import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
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

interface ClassMonitorProps {
  code?: string;
}

export default function ClassMonitor({ code: codeProp }: ClassMonitorProps = {}) {
  // Get code from location URL - most reliable method for production
  const [location] = useLocation();
  
  // Multiple ways to extract code - be very defensive
  let codeFromUrl: string | undefined;
  const pathParts = location.split('/').filter(Boolean);
  codeFromUrl = pathParts[pathParts.length - 1]; // Last segment
  
  // Also try window.location as fallback (works in production)
  if (!codeFromUrl) {
    try {
      const windowPath = window.location.pathname.split('/').filter(Boolean);
      codeFromUrl = windowPath[windowPath.length - 1];
    } catch (e) {
      // Ignore
    }
  }
  
  const code = codeProp || codeFromUrl;
  
  console.log('[ClassMonitor] Component mounted!', {
    code,
    codeProp,
    location,
    codeFromUrl,
    windowPath: typeof window !== 'undefined' ? window.location.pathname : 'N/A',
    codeValid: code && code.length > 0
  });

  // ALWAYS render something - even if code is invalid, show a message
  // This ensures the component is visible and we can debug
  
  const queryEnabled = !!code && code.length > 0;
  console.log('[ClassMonitor] Query enabled:', queryEnabled);

  // Render immediately - don't wait for query
  // This ensures something is always visible
  if (!code || code.length === 0) {
    console.log('[ClassMonitor] Invalid code, showing error:', code);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-2xl border-2 border-red-200">
            <CardHeader className="bg-red-500 text-white">
              <CardTitle className="text-2xl font-bold">Invalid Class Name</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">Please check the class name and try again.</p>
              <p className="text-sm text-gray-500">Class name received: <strong>{code || 'undefined'}</strong></p>
              <p className="text-xs text-gray-400 mt-2">URL should be: /2a, /3a, /4a, /4b, etc.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fetch published snapshot (teacher publishes from admin; parents see that)
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/classroom/published-snapshot/${code}`],
    queryFn: async () => {
      const codeNorm = code.toLowerCase().replace(/[^a-z0-9]/g, '');
      const res = await fetch(`/api/classroom/published-snapshot/${codeNorm}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('NOT_PUBLISHED');
        throw new Error(`Failed to load: ${res.status}`);
      }
      return res.json();
    },
    enabled: queryEnabled,
    refetchInterval: 60000,
  });

  console.log('[ClassMonitor] Query state:', { isLoading, error: error?.message, hasData: !!data });

  // Show loading state - this should ALWAYS be visible if component mounts
  if (isLoading) {
    console.log('[ClassMonitor] Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-2xl border-2 border-blue-200">
            <CardHeader>
              <CardTitle>Loading Class Data...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20">
                <div className="text-xl font-bold mb-2">Loading...</div>
                <div className="text-gray-600">Fetching class data for code: {code}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNotPublished = errorMessage === 'NOT_PUBLISHED';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className={`shadow-2xl border-2 ${isNotPublished ? 'border-amber-200' : 'border-red-200'}`}>
            <CardHeader className={isNotPublished ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'}>
              <CardTitle className="text-2xl font-bold">
                {isNotPublished ? 'Not Published Yet' : 'Error Loading Data'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                {isNotPublished
                  ? 'The teacher has not published the class data yet. Please check back later.'
                  : `The class ${code} could not be loaded.`
                }
              </p>
              {!isNotPublished && (
                <p className="text-sm text-gray-500 mt-4">
                  Use the class name in lowercase (e.g., /edincik2a, /edincik3a).
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
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
