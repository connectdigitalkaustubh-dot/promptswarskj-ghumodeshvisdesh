import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Users, 
  Info, 
  Sliders, 
  ParkingCircle,
  HelpCircle,
  Sparkles,
  Bot
} from "lucide-react";
import { INITIAL_CROWD_REPORTS } from "../initialData";
import { CrowdReport } from "../types";

export default function CrowdAlertsView() {
  const [reports, setReports] = useState<CrowdReport[]>([]);
  
  // Form States
  const [place, setPlace] = useState("");
  const [crowdLevel, setCrowdLevel] = useState<"Low" | "Moderate" | "Crowded" | "Overcrowded">("Moderate");
  const [queueTime, setQueueTime] = useState(30);
  const [parking, setParking] = useState<"Available" | "Limited" | "Full" | "No Parking">("Available");
  const [comment, setComment] = useState("");
  const [reporterName, setReporterName] = useState("");

  const [formSuccess, setFormSuccess] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  // Load and sync localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ghum_crowd_reports");
    if (saved) {
      setReports(JSON.parse(saved));
    } else {
      setReports(INITIAL_CROWD_REPORTS);
      localStorage.setItem("ghum_crowd_reports", JSON.stringify(INITIAL_CROWD_REPORTS));
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!place.trim() || !comment.trim()) return;

    const newReport: CrowdReport = {
      id: Math.random().toString(),
      place: place.trim(),
      crowdLevel,
      queueTimeMinutes: queueTime,
      parkingStatus: parking,
      comment: comment.trim(),
      reporterName: reporterName.trim() || "Anonymous Explorer",
      timestamp: new Date().toISOString(),
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem("ghum_crowd_reports", JSON.stringify(updated));

    // Reset Form
    setPlace("");
    setComment("");
    setReporterName("");
    setQueueTime(30);
    setCrowdLevel("Moderate");
    setParking("Available");
    
    // Show Toast
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  // Trigger SafarSaathi AI analysis of current crowd reports to generate crowd hacks
  const handleGenerateAiHacks = async () => {
    setIsAiLoading(true);
    setAiInsights(null);

    const prompt = `Here are some recent crowd reports submitted by travelers in India:
${reports.slice(0, 4).map(r => `- Place: ${r.place}, Crowd Level: ${r.crowdLevel}, Wait Time: ${r.queueTimeMinutes} min, Comment: "${r.comment}"`).join("\n")}

As SafarSaathi AI, analyze these crowd logs and compile 3 highly actionable, specific recommendations for travelers to bypass long lines and optimize their visiting times at these locations. Write in direct, concise, friendly local Hinglish-touched bullet points. Also, clearly mention a standard disclaimer that crowds are highly dynamic.`;

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction: "You are SafarSaathi AI, an experienced Indian travel expert and crowd controller."
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to reach SafarSaathi AI right now.");
      }

      const data = await response.json();
      setAiInsights(data.text);
    } catch (err) {
      setAiInsights("Namaste! SafarSaathi is unable to synthesize crowd reports at this second. General rule of thumb: Arrive at temples by 4:30 AM and forts by 4:00 PM for optimal lighting and minimal crowds!");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-7xl mx-auto" id="crowd-alerts-view">
      {/* Title block */}
      <div className="border-b border-white/30 pb-5">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-sky-600" />
          CrowdSourced Travel Alerts
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Share live queue timings, temple crowd spikes, and parking updates to help others bypass wait times.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-slate-800 rounded-2xl flex gap-3 text-xs leading-relaxed backdrop-blur-md">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">🚨 Disclaimer & Advisory notice:</span>
          Community crowd reports are advisory and submitted by independent travelers. Crowds change dynamically based on festival days, weather spikes, and VIP passes. GhumDeshVidesh does not claim legal real-time precision. Always consult local temple helpdesks!
        </div>
      </div>

      {/* Main Grid: Form Submission & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Submission form */}
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl lg:col-span-5 space-y-5">
          <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-white/30">
            <Sliders className="w-4.5 h-4.5 text-sky-600" />
            File Crowd Alert Report
          </h3>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* 1. Place name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Target Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="e.g. Kedarnath Temple Darshan, Taj Mahal..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* 2. Crowd level buttons selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Current Crowd Density</label>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-bold font-mono">
                {(["Low", "Moderate", "Crowded", "Overcrowded"] as const).map((lvl) => {
                  const isSel = crowdLevel === lvl;

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCrowdLevel(lvl)}
                      className={`py-2 px-1 text-center rounded-lg border text-[10px] transition-all cursor-pointer ${
                        isSel
                          ? "bg-sky-600 border-sky-600 text-white shadow-md shadow-sky-500/10 scale-102 font-extrabold"
                          : "bg-white/50 border-white/50 text-slate-600 hover:bg-white/60"
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Queue wait time slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-mono font-bold uppercase tracking-wider text-slate-400">Queue wait (Minutes)</label>
                <span className="font-mono font-bold text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded-md">{queueTime} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="240"
                step="5"
                value={queueTime}
                onChange={(e) => setQueueTime(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-white/40 border border-white/50 rounded-lg"
              />
            </div>

            {/* 4. Parking availability select */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Parking Capacity Status</label>
              <select
                value={parking}
                onChange={(e) => setParking(e.target.value as "Available" | "Limited" | "Full" | "No Parking")}
                className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans cursor-pointer"
              >
                <option value="Available">🟢 Parking Available</option>
                <option value="Limited">🟡 Limited Spaces Left</option>
                <option value="Full">🔴 Parking Completely Full</option>
                <option value="No Parking">⚫ No Official Vehicle Parking</option>
              </select>
            </div>

            {/* 5. Comment notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Detailed Review notes</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Shoes must be submitted 200m before the gate. VIP line moves fast but cost is Rs. 300. ATMs have long cash queues."
                className="w-full p-3 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans shadow-inner"
              />
            </div>

            {/* 6. Reporter name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Reporter Username</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Priya S. (Leave empty for Anonymous)"
                className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans cursor-pointer"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Alert Node</span>
            </button>
          </form>

          {/* Success message toast */}
          <AnimatePresence>
            {formSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 rounded-2xl text-xs flex gap-2 backdrop-blur-md"
              >
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-500" />
                <span>Success! Your crowd report was saved locally and mapped to SafarSaathi database.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Alerts Feed & AI Analyzer */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Optimizer Panel */}
          <div className="bg-white/50 border border-white/60 p-6 rounded-[32px] space-y-4 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-sky-600 animate-bounce-slow" />
                <h4 className="font-display font-bold text-slate-900 text-sm">SafarSaathi AI Crowd Optimizer</h4>
              </div>
              <span className="text-[9px] bg-sky-500/10 text-sky-700 px-2 py-0.5 rounded-full font-mono font-bold border border-sky-500/15">GEMINI</span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Let SafarSaathi synthesize all current community crowd reports to recommend optimal visiting hours and line hacks for active locations.
            </p>

            <button
              onClick={handleGenerateAiHacks}
              disabled={isAiLoading}
              className="px-4.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-sky-500/10 flex items-center gap-1.5 transition-all cursor-pointer disabled:bg-slate-300"
            >
              {isAiLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Analyzing Reports...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Crowd Hacks</span>
                </>
              )}
            </button>

            {/* AI Insights Display Container */}
            {aiInsights && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 backdrop-blur-xs p-4 rounded-2xl border border-white/60 text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line shadow-2xs font-medium"
              >
                {aiInsights}
              </motion.div>
            )}
          </div>

          {/* Crowd alerts list */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center pl-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Traveler Broadcast Feed</h4>
              <span className="text-xs text-slate-400 font-semibold">{reports.length} Logs Active</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 animate-fade-in">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl rounded-[24px] space-y-3">
                  {/* Top line details */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-white/50 flex items-center justify-center shrink-0 border border-white/40">
                        <MapPin className="w-4.5 h-4.5 text-slate-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{rep.place}</h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {rep.queueTimeMinutes} min wait
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <ParkingCircle className="w-3.5 h-3.5 text-slate-400" />
                            {rep.parkingStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full shrink-0 ${
                      rep.crowdLevel === "Overcrowded"
                        ? "bg-red-500/15 text-red-800 border border-red-500/20"
                        : rep.crowdLevel === "Crowded"
                        ? "bg-orange-500/15 text-orange-850 border border-orange-500/20"
                        : "bg-emerald-500/15 text-emerald-800 border border-emerald-500/20"
                    }`}>
                      {rep.crowdLevel}
                    </span>
                  </div>

                  {/* Comment notes content */}
                  <p className="text-xs text-slate-600 bg-white/40 p-3.5 border border-white/40 rounded-xl font-medium leading-relaxed italic">
                    "{rep.comment}"
                  </p>

                  {/* Footer details */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span className="font-semibold">By {rep.reporterName}</span>
                    <span className="font-mono">
                      {new Date(rep.timestamp).toLocaleDateString()} {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
