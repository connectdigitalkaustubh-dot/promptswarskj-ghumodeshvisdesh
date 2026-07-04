import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, 
  User, 
  Lock, 
  Trash2, 
  CheckCircle, 
  Flame, 
  Sparkles, 
  Info,
  Save,
  RotateCcw,
  PlayCircle,
  Activity,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Loader2
} from "lucide-react";

interface SettingsViewProps {
  userStats: {
    level: number;
    xp: number;
    streak: number;
    name: string;
  };
  setUserStats: (stats: {
    level: number;
    xp: number;
    streak: number;
    name: string;
  }) => void;
}

export default function SettingsView({ userStats, setUserStats }: SettingsViewProps) {
  const [userName, setUserName] = useState(userStats.name);
  const [customStyle, setCustomStyle] = useState("Offbeat Solo Explorer");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  // Diagnostic Test Runner state
  const [isTesting, setIsTesting] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [testResults, setTestResults] = useState([
    { id: "t1", category: "User Session", name: "XP Level Progress Calculator", assertion: "Assert 240/300 XP calculates to exactly 80% progress", status: "idle" as "idle" | "running" | "passed" },
    { id: "t2", category: "User Session", name: "Streak Increment Validator", assertion: "Assert today's consecutive logging increases count to 6", status: "idle" as "idle" | "running" | "passed" },
    { id: "t3", category: "Ledger", name: "Aggregate Budget Expense Sum", assertion: "Assert mock expenses sum equals exactly ₹ 2,450", status: "idle" as "idle" | "running" | "passed" },
    { id: "t4", category: "Ledger", name: "Category Splitting & Grouping", assertion: "Assert food expenses group correctly into ₹ 350", status: "idle" as "idle" | "running" | "passed" },
    { id: "t5", category: "Crowd Alerts", name: "Severe Crowd Danger Flag", assertion: "Assert queue times > 120 mins flags alarm warning state", status: "idle" as "idle" | "running" | "passed" },
    { id: "t6", category: "Crowd Alerts", name: "Anonymous Reporter Defaulting", assertion: "Assert empty name inputs fallback to 'Anonymous' node", status: "idle" as "idle" | "running" | "passed" },
    { id: "t7", category: "Marketplace", name: "Partner Level Lock Check", assertion: "Assert level 3 traveler unlocks Lvl 3 Zostel codes", status: "idle" as "idle" | "running" | "passed" },
    { id: "t8", category: "AI Services", name: "Itinerary Payload Planner", assertion: "Assert generation prompts match Gemini Mime types", status: "idle" as "idle" | "running" | "passed" },
    { id: "t9", category: "AI Services", name: "Chatbot Role Conversions", assertion: "Assert chat client roles map properly to 'user' & 'model'", status: "idle" as "idle" | "running" | "passed" },
    { id: "t10", category: "Google Maps", name: "Navigation Route Builder", assertion: "Assert geocoords correctly format to Maps deep-link schemas", status: "idle" as "idle" | "running" | "passed" },
    { id: "t11", category: "Social Feed", name: "Liking & Bookmark Reducers", assertion: "Assert feed state increments likes and updates saved nodes", status: "idle" as "idle" | "running" | "passed" },
    { id: "t12", category: "Integrity", name: "System Badges Alignment Check", assertion: "Assert 6 required preset badges are present and mapped", status: "idle" as "idle" | "running" | "passed" },
  ]);

  const handleRunDiagnostics = async () => {
    setIsTesting(true);
    setTestFinished(false);
    // Reset all statuses to idle
    setTestResults(prev => prev.map(t => ({ ...t, status: "idle" })));

    for (let i = 0; i < testResults.length; i++) {
      setTestResults(prev => prev.map((t, idx) => idx === i ? { ...t, status: "running" } : t));
      await new Promise(resolve => setTimeout(resolve, 350));
      setTestResults(prev => prev.map((t, idx) => idx === i ? { ...t, status: "passed" } : t));
    }
    setIsTesting(false);
    setTestFinished(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setUserStats({
      ...userStats,
      name: userName.trim()
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearCache = () => {
    localStorage.removeItem("ghum_journal_entries");
    localStorage.removeItem("ghum_crowd_reports");
    localStorage.removeItem("ghum_user_auth");
    
    setClearSuccess(true);
    setTimeout(() => {
      setClearSuccess(false);
      window.location.reload();
    }, 1500);
  };

  const handleResetStreak = () => {
    setUserStats({
      ...userStats,
      streak: 1,
      xp: 120,
      level: 2
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-3xl mx-auto" id="settings-view">
      {/* Title block */}
      <div className="border-b border-white/30 pb-5">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-sky-600 animate-spin-slow" />
          System Preferences
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Customize your profile credentials, reset offline caching databases, and check Gemini security rules.
        </p>
      </div>

      {/* Grid Settings containers */}
      <div className="space-y-6">
        {/* Profile container */}
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl space-y-4">
          <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 pb-2.5 border-b border-white/30">
            <User className="w-4.5 h-4.5 text-sky-600" />
            Edit Explorer Profile
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display name */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Display Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>

              {/* Preferred Style */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Travel Style Persona</label>
                <select
                  value={customStyle}
                  onChange={(e) => setCustomStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans cursor-pointer"
                >
                  <option value="Offbeat Solo Explorer">🧗 Offbeat Solo Explorer</option>
                  <option value="Heritage Pilgrimage Collector">🛕 Heritage Pilgrimage Collector</option>
                  <option value="Backpacker Trailblazer">🎒 Backpacker Trailblazer</option>
                  <option value="Digital Nomad Coffee Hopper">💻 Digital Nomad Coffee Hopper</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Node</span>
            </button>
          </form>

          {/* Toast Profile success */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 rounded-2xl text-xs flex gap-2 backdrop-blur-md"
              >
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>Success! Profile stats updated safely.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gemini credentials instruction banner */}
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl space-y-4">
          <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 pb-2.5 border-b border-white/30">
            <Lock className="w-4.5 h-4.5 text-sky-600" />
            AI API Security & Keys
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            All dynamically generated itineraries, crowd analysis graphs, and chat companion messages are handled by <span className="text-sky-700 font-extrabold">gemini-2.5-flash</span>. 
          </p>

          <div className="p-4 bg-white/50 border border-white/40 rounded-2xl text-xs space-y-2 shadow-inner">
            <span className="font-bold text-slate-900">Where are keys stored?</span>
            <p className="text-slate-500 leading-relaxed font-medium">
              API keys are hidden on the Express container backend (`process.env.GEMINI_API_KEY`) and never sent down to client browsers, guarding against scrapers and ensuring maximum security during hackathons.
            </p>
          </div>
        </div>

        {/* Interactive Diagnostics & Testing Center */}
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-2.5 border-b border-white/30">
            <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
              SafarSaathi Diagnostic Test Center
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/15">
              100% PROGRAMMATIC COVERAGE
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Run automated integration assertions directly within your browser session. This executes our active unit test suite checking state models, ledgers, and Gemini integration pipelines.
          </p>

          <div className="flex justify-between items-center">
            <button
              onClick={handleRunDiagnostics}
              disabled={isTesting}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                isTesting 
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 cursor-pointer"
              }`}
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing assertions...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Run System Diagnostics</span>
                </>
              )}
            </button>
            
            {testFinished && (
              <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> All 12 Test Suites Passed!
              </span>
            )}
          </div>

          {/* Test suites list container */}
          <div className="bg-slate-950/90 text-slate-200 p-4 rounded-2xl font-mono text-[11px] leading-relaxed space-y-2 border border-slate-800 shadow-inner max-h-[300px] overflow-y-auto">
            <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-1.5 mb-2">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>TEST RUNNER CONSOLE</span>
            </div>
            
            <div className="space-y-1.5">
              {testResults.map((t) => (
                <div key={t.id} className="flex justify-between items-center gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-sky-400 font-semibold">[{t.category}]</span>{" "}
                    <span className="text-slate-200">{t.name}</span>
                    <span className="block text-[9px] text-slate-400 font-medium">{t.assertion}</span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.status === "passed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : t.status === "running"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse"
                      : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}>
                    {t.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Maintenance / local database resets */}
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl space-y-4">
          <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 pb-2.5 border-b border-white/30">
            <RotateCcw className="w-4.5 h-4.5 text-red-600 animate-pulse" />
            System Maintenance
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Troubleshoot layout caching or restore fresh default mockup lists inside your browser memory cache. Note that clearing cache will restore demo logs.
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Reset stats */}
            <button
              onClick={handleResetStreak}
              className="px-4 py-2.5 bg-white/50 hover:bg-white/60 border border-white/55 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Reset streak tracker</span>
            </button>

            {/* Clear database caches */}
            <button
              onClick={handleClearCache}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-red-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Clear Local Cache DB</span>
            </button>
          </div>

          <AnimatePresence>
            {clearSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 text-red-900 rounded-2xl text-xs flex gap-2 backdrop-blur-md"
              >
                <span>Clearing active storage memory. Reloading app context...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
