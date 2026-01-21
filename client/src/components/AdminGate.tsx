import { useState, useEffect } from 'react';

// Change this to your secret password!
const ADMIN_SECRET = 'ingilizce2026';

interface AdminGateProps {
  children: React.ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unlocked = sessionStorage.getItem('admin_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      sessionStorage.setItem('admin_unlocked', 'true');
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)]"></div>
      
      <form 
        onSubmit={handleSubmit} 
        className="relative bg-neutral-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-sm mx-4"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">ADMIN LOGIN</h2>
          <p className="text-neutral-500 text-sm uppercase tracking-wide">Restricted access</p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password..."
              className={`w-full px-4 py-3 bg-neutral-800/50 border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all ${
                error 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-neutral-700 focus:ring-white/20 focus:border-neutral-500'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-2 uppercase tracking-wide">
                Invalid password
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black py-3 px-4 rounded-xl font-medium hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide"
          >
            Login
          </button>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors uppercase tracking-wide"
          >
            ← Back to site
          </a>
        </div>
      </form>
    </div>
  );
}
