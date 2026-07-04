import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Mail, Lock, ShieldAlert, Sparkles, CheckCircle, Info } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState("demo@ghumdeshvidesh.ai");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate email & password exactly as requested
    setTimeout(() => {
      if (email === "demo@ghumdeshvidesh.ai" && password === "demo123") {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess(email);
        }, 1200);
      } else {
        setError("Insecure credentials! Please use: demo@ghumdeshvidesh.ai / demo123");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center relative overflow-hidden font-sans p-4">
      {/* Mesh Gradient Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-sky-300 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-emerald-200 rounded-full blur-[80px] opacity-30"></div>
      </div>

      {/* Floating Travel Cards Mock Decoration */}
      <div className="absolute top-12 left-12 opacity-40 hidden lg:block">
        <div className="p-4 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl w-48 text-slate-850 rotate-6 shadow-md">
          <span className="text-[9px] font-mono text-sky-600 font-bold">BOARDING PASS</span>
          <p className="font-bold text-xs mt-1 text-slate-900">DEL ➔ LEH</p>
          <div className="h-1 bg-sky-200 rounded-full mt-2 w-3/4"></div>
        </div>
      </div>

      <div className="absolute bottom-16 right-16 opacity-40 hidden lg:block">
        <div className="p-4 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl w-48 text-slate-850 -rotate-6 shadow-md">
          <span className="text-[9px] font-mono text-orange-600 font-bold">EXPLORER RATING</span>
          <p className="font-bold text-xs mt-1 text-slate-900">XP Level 14</p>
          <div className="h-1 bg-orange-200 rounded-full mt-2 w-1/2"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/40 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white/50 relative"
        >
          {/* Brand Logo & Presentation */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-sky-500 via-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20 mb-4">
              <Compass className="w-8 h-8 text-white animate-spin-slow" />
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight uppercase">GhumDeshVidesh AI</h1>
            <p className="text-sky-600 text-xs font-mono tracking-widest uppercase mt-0.5 font-bold">PromptWars Hackathon Entry</p>
            <p className="text-slate-600 text-xs font-medium italic mt-2.5">"Travel Like a Local. Explore Like Never Before."</p>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Aapka Swagat Hai! 🙏</h3>
                <p className="text-xs text-slate-600 mt-2">Restoring your travel session... Preparing SafarSaathi AI.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleLogin} className="space-y-4">
                {/* Email input */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="demo@ghumdeshvidesh.ai"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-inner transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-inner transition-all font-mono"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 rounded-xl text-xs flex gap-2">
                    <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-600" />
                    <p className="font-medium">{error}</p>
                  </div>
                )}

                {/* Demo Prompt Helper Box */}
                <div className="p-3.5 bg-sky-500/10 border border-sky-500/20 text-sky-800 rounded-xl text-xs flex gap-2.5 shadow-xs">
                  <Info className="w-4.5 h-4.5 shrink-0 mt-0.5 text-sky-600" />
                  <div>
                    <span className="font-bold block text-sky-950">Hackathon Sandbox Account:</span>
                    <span className="font-mono block mt-0.5">User: demo@ghumdeshvidesh.ai</span>
                    <span className="font-mono block">Pass: demo123</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-sky-500/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Authenticate Account
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-slate-550 text-[10px] uppercase font-bold font-mono tracking-widest mt-6">
          © 2026 GhumDeshVidesh • PromptWars Hackathon Spec
        </p>
      </div>
    </div>
  );
}
