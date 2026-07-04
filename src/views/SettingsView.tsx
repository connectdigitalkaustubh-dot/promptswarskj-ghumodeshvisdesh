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
  RotateCcw
} from "lucide-react";

interface SettingsViewProps {
  userStats: {
    level: number;
    xp: number;
    streak: number;
    name: string;
  };
  setUserStats: (stats: any) => void;
}

export default function SettingsView({ userStats, setUserStats }: SettingsViewProps) {
  const [userName, setUserName] = useState(userStats.name);
  const [customStyle, setCustomStyle] = useState("Offbeat Solo Explorer");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

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
