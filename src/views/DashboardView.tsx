import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  MapPin, 
  Flame, 
  Award, 
  TrendingUp, 
  PhoneCall, 
  Volume2, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  ShieldAlert,
  Coins,
  Map as MapIcon,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles
} from "lucide-react";
import { INITIAL_HIDDEN_GEMS, INITIAL_CROWD_REPORTS } from "../initialData";

interface DashboardViewProps {
  userStats: {
    level: number;
    xp: number;
    streak: number;
    name: string;
  };
  setActiveTab: (tab: string) => void;
}

export default function DashboardView({ userStats, setActiveTab }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhrase, setActivePhrase] = useState<string | null>(null);

  // Local language helper phrases
  const localPhrases = [
    { phrase: "Bhaiya, UPI chalega?", translation: "Brother, is UPI/digital payment accepted?", context: "Street food / Autos" },
    { phrase: "Darshan ka samay kya hai?", translation: "What is the time for divine viewing/darshan?", context: "Temples" },
    { phrase: "Meter se chalenge ya fixed?", translation: "Will we go by meter or a fixed rate?", context: "Rickshaw negotiations" },
    { phrase: "Swad bahut achha hai!", translation: "The taste is excellent!", context: "Food stalls" },
    { phrase: "Yahan footwear kahan utarein?", translation: "Where do we remove footwear here?", context: "Temple entry rules" },
  ];

  // Quick emergency numbers
  const emergencyHotlines = [
    { name: "National Tourism Helpline", number: "1363" },
    { name: "Women's Safety Help", number: "1091" },
    { name: "Police Helpline", number: "112" },
    { name: "Railway Inquiry", number: "139" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-7xl mx-auto" id="dashboard-view">
      {/* 1. PARALLAX/GRADIENT HERO PORTAL */}
      <div className="relative rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-xl border border-white/50 text-slate-800 p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-700 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            <span>SafarSaathi AI Engine Online</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-extrabold tracking-tight leading-tight text-slate-900"
          >
            Aapka Swagat Hai, <br className="md:hidden" />
            <span className="text-sky-600 font-display">{userStats.name}!</span>
          </motion.h2>

          <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
            Discover breathtaking Indian valleys, schedule temple darshans with perfect etiquette, track crowd spikes dynamically, and unlock deep cultural stories.
          </p>

          {/* Quick Search Action */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where to? (e.g., Mawlynnong, Gurez, Lonar Crater...)"
                className="w-full pl-11 pr-4 py-3 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-inner transition-all font-sans"
              />
            </div>
            <button
              onClick={() => {
                if (searchQuery) {
                  setActiveTab("planner");
                }
              }}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <span>Ask SafarSaathi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. TRAVEL STREAKS & XP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/40 backdrop-blur-md p-5 rounded-[24px] border border-white/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Active Streak</span>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{userStats.streak} Days Streak</p>
            <p className="text-xs text-orange-600 font-semibold mt-0.5">🔥 Keep planning to grow your level!</p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md p-5 rounded-[24px] border border-white/50 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Explorer XP Level</span>
            <p className="text-xl font-bold text-slate-800 mt-0.5">Lvl {userStats.level} ({userStats.xp} XP)</p>
            <div className="w-36 bg-white/40 border border-white/50 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-sky-500 h-full" style={{ width: `${userStats.xp % 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md p-5 rounded-[24px] border border-white/50 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Achievements Unlocked</span>
            <p className="text-xl font-bold text-slate-800 mt-0.5">3 Badges</p>
            <p className="text-xs text-slate-400 mt-0.5">Unlocked "First Step" & "Cultural Custodian"</p>
          </div>
        </div>
      </div>

      {/* 3. COGNITIVE TRAVEL EMERGENCY RESOLUTION HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-World Problems Module */}
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl lg:col-span-2 space-y-5">
          <div className="flex items-center gap-2 pb-1 border-b border-white/30">
            <ShieldAlert className="w-5 h-5 text-sky-600" />
            <h3 className="font-display font-semibold text-slate-800">Street-Smart Travel Guidelines</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl space-y-1.5">
              <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-mono font-bold">TEMPLE RULES</span>
              <h4 className="font-bold text-sm text-slate-800">Darshan & Dress Codes</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Always cover shoulders and knees. Remove footwear before step-stone areas. Avoid inside photos unless marked allowed. Carrying small cash is useful for prasad lines.
              </p>
            </div>

            <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl space-y-1.5">
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-mono font-bold">UPI AVAILABILITY</span>
              <h4 className="font-bold text-sm text-slate-800">Cash vs QR Code Payments</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                UPI works on 95% of street food zones, but drops in high mountain passes (e.g., Gurez, Ladakh). Carry back-up cash (100 & 500 notes) inside secret wallet bags.
              </p>
            </div>

            <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl space-y-1.5">
              <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-mono font-bold">SCAM DEFENSE</span>
              <h4 className="font-bold text-sm text-slate-800">Rickshaw & Guide Scams</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Negotiate rickshaws before boarding. Use 'Ola/Uber' or public state metros when available to reference true rates. Ignore self-proclaimed VIP darshan priests.
              </p>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1.5">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">ALTITUDE & WEATHER</span>
              <h4 className="font-bold text-sm text-slate-800">Gorge & Valley Precautions</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take DIAMOX or rest 24h when ascending above 10,000 ft (Leh, Gurez). Always check rain backups and offline Google maps for road closures.
              </p>
            </div>
          </div>
        </div>

        {/* Hotlines Sidebar */}
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-1 border-b border-white/30">
            <PhoneCall className="w-4.5 h-4.5 text-sky-600" />
            <h3 className="font-display font-semibold text-slate-800">Emergency Hotlines</h3>
          </div>

          <div className="space-y-3">
            {emergencyHotlines.map((hotline, idx) => (
              <div key={idx} className="flex justify-between items-center p-3.5 bg-white/30 border border-white/40 rounded-2xl">
                <div>
                  <h4 className="font-semibold text-xs text-slate-800">{hotline.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Toll-free 24/7 support</p>
                </div>
                <a
                  href={`tel:${hotline.number}`}
                  className="font-mono font-bold text-xs bg-sky-100 text-sky-800 px-3 py-1.5 rounded-lg border border-sky-200/50 hover:bg-sky-200 transition-colors"
                >
                  📞 {hotline.number}
                </a>
              </div>
            ))}
          </div>

          <div className="p-3 bg-sky-500/10 text-sky-800 rounded-xl text-xs flex gap-2 border border-sky-500/20">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-sky-600" />
            <p className="leading-relaxed">
              These hotlines operate offline and support English, Hindi, and regional languages. Bookmark these!
            </p>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE LANGUAGE COMPASS */}
      <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/30 pb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-sky-600" />
            <h3 className="font-display font-semibold text-slate-800">Learn Local Phrases (Hinglish Compass)</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Tap to pronounce</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          Hinglish and polite local greetings establish instant trust with drivers, tea sellers, and hotel staff. Tap any block to read standard pronunciation context:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {localPhrases.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhrase(activePhrase === item.phrase ? null : item.phrase)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                activePhrase === item.phrase
                  ? "bg-sky-500/10 border-sky-500/40 shadow-xs scale-102"
                  : "bg-white/40 backdrop-blur-md border-white/50 hover:bg-white/60 hover:border-white"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-sm text-slate-800 font-mono">"{item.phrase}"</span>
                <Volume2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-2">Meaning: {item.translation}</p>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-450 font-mono block mt-1.5">
                💼 Used for: {item.context}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. CROWD ALERT PREVIEW */}
      <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/30 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-sky-600" />
            <h3 className="font-display font-semibold text-slate-800">Recent Crowd Alerts Feed</h3>
          </div>
          <button
            onClick={() => setActiveTab("crowd-alerts")}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 focus:outline-none"
          >
            <span>Report Crowd</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INITIAL_CROWD_REPORTS.slice(0, 3).map((report) => (
            <div key={report.id} className="p-4 bg-white/30 border border-white/40 rounded-2xl flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 truncate pr-2">{report.place}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 font-mono ${
                    report.crowdLevel === "Overcrowded" 
                      ? "bg-red-500/15 text-red-700" 
                      : report.crowdLevel === "Crowded" 
                      ? "bg-orange-500/15 text-orange-700"
                      : "bg-amber-500/15 text-amber-700"
                  }`}>
                    {report.crowdLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-650 line-clamp-2 mt-2 leading-relaxed">"{report.comment}"</p>
              </div>

              <div className="mt-3.5 pt-2 border-t border-white/30 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-medium text-slate-500">By {report.reporterName}</span>
                <span className="font-mono text-slate-450">{new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
