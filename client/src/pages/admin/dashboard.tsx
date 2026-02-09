import { NoIndex } from '@/components/NoIndex';
import { Settings } from 'lucide-react';
import { Link } from 'wouter';

export default function AdminDashboard() {
  const handleLogout = () => {
    sessionStorage.removeItem('admin_unlocked');
    window.location.href = '/';
  };

  const adminPages = [
    { name: 'Word Map', path: '/admin/word-map' },
    { name: 'Workflow', path: '/admin/workflow' },
    { name: 'In Class', path: '/admin/inclass' },
  ];

  const placeholderButtons = [
    { name: 'Statistics', description: 'View site statistics' },
    { name: 'Content', description: 'Manage content' },
    { name: 'Settings', description: 'Configure settings' },
  ];

  return (
    <>
      <NoIndex />
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02),transparent_40%)]"></div>
        
        <header className="relative border-b border-neutral-800/50 bg-neutral-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                  <Settings className="w-3.5 h-3.5 text-black" />
                </div>
                <h1 className="text-sm font-bold text-white uppercase tracking-wider">ADMIN PANEL</h1>
              </div>
              
              <div className="flex items-center gap-3">
                <a href="/" className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wide">SITE</a>
                <button onClick={handleLogout} className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors uppercase tracking-wide">LOGOUT</button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-neutral-500 text-[10px] uppercase tracking-wide mb-6">
            Password: AdminGate.tsx → ADMIN_SECRET
          </p>

          <div className="mb-8">
            <h2 className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-3">PAGES</h2>
            
            <div className="space-y-1.5">
              {adminPages.map((page) => (
                <Link 
                  key={page.path}
                  href={page.path}
                  className="flex items-center gap-3 p-3 bg-neutral-900/50 border border-neutral-800/50 rounded-lg hover:bg-neutral-800/50 hover:border-neutral-700 transition-all group"
                >
                  <span className="text-white text-sm font-medium uppercase tracking-wide">{page.name}</span>
                  <span className="ml-auto text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider mb-3">QUICK ACCESS</h2>
            
            <div className="flex flex-wrap gap-2">
              {placeholderButtons.map((btn) => (
                <button 
                  key={btn.name}
                  className="px-3 py-1.5 text-[10px] text-neutral-500 bg-neutral-900/30 border border-neutral-800/50 rounded-md hover:bg-neutral-800/50 hover:text-neutral-300 transition-colors uppercase tracking-wide cursor-not-allowed opacity-50"
                  title={btn.description}
                  disabled
                >
                  {btn.name}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
