'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Wrench, Eye, EyeOff, Mail, Lock, Smartphone, Monitor, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(login({ email, password }));

    if (login.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden w-full">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Floating Icons */}
        <div className={`absolute top-20 left-[15%] text-blue-500/20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Smartphone className="w-12 h-12 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        <div className={`absolute top-40 right-[20%] text-purple-500/20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
          <Monitor className="w-16 h-16 animate-bounce" style={{ animationDuration: '4s' }} />
        </div>
        <div className={`absolute bottom-32 left-[20%] text-cyan-500/20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <Cpu className="w-10 h-10 animate-bounce" style={{ animationDuration: '3.5s' }} />
        </div>
      </div>

      <div className={`relative w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-40 animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-transform duration-300">
              <Wrench className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mt-6 tracking-tight">
            NITHUSH <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">TECH</span>
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Repair Shop Management System</p>
        </div>

        {/* Login Card */}
        <div className="relative">
          {/* Card Glow */}
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-lg opacity-70" />
          
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-10 sm:p-12 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400 text-base">Sign in to access your dashboard</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative group">
                  <div className={`absolute -inset-0.5 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity blur ${focusedField === 'email' ? 'opacity-50' : ''}`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="relative w-full px-5 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                    placeholder="admin@nithushtech.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label htmlFor="password" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative group">
                  <div className={`absolute -inset-0.5 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity blur ${focusedField === 'password' ? 'opacity-50' : ''}`} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="relative w-full px-5 py-4 pr-14 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group overflow-hidden mt-4"
              >
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity animate-gradient-x" />
                <div className="relative flex items-center justify-center gap-2 w-full py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-base rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Credentials Hint */}
            <div className="mt-10 pt-8 border-t border-slate-700/50">
              <div className="flex items-center gap-4 p-5 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-sm">
                  <p className="text-slate-400">Demo credentials</p>
                  <p className="text-slate-200 font-mono text-xs mt-1">admin@nithushtech.com / admin123</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-sm mt-8">
          © 2025 NITHUSH TECH. All rights reserved.
        </p>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
