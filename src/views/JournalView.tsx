import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  PlusCircle, 
  Coins, 
  Trash2, 
  CheckCircle, 
  Star, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  PiggyBank, 
  PieChart, 
  DollarSign,
  Briefcase
} from "lucide-react";
import { JournalEntry } from "../types";

export default function JournalView() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  
  // New entry state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [expense, setExpense] = useState("");
  const [category, setCategory] = useState<JournalEntry["category"]>("Other");

  const [formSuccess, setFormSuccess] = useState(false);

  // Load and sync localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ghum_journal_entries");
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      const defaults: JournalEntry[] = [
        {
          id: "entry-1",
          title: "Magical Sunrise at Assi Ghat",
          date: "2026-06-15",
          location: "Varanasi, UP",
          content: "Woke up at 4:30 AM to catch the Subah-e-Banaras. The sound of morning classical music coupled with the chanting and pristine Ganga Arati left me speechless. Had hot kachori sabzi and sweet jalebi for breakfast at Ram Bhandar. Logged Rs. 150 for wood boats and Rs. 80 for street snacks.",
          rating: 5,
          expense: 230,
          category: "Food"
        },
        {
          id: "entry-2",
          title: "Lonar Crater Hiking Adventure",
          date: "2026-06-20",
          location: "Buldhana, Maharashtra",
          content: "Trekking down to the base of the impact crater was slightly steep and slippery due to loose basalt dirt. Explored the beautifully carved Gomukh Temple. Had direct interactions with monkeys, keep bags safe! Logged local guide fee of Rs. 600.",
          rating: 4,
          expense: 600,
          category: "Transport"
        }
      ];
      setEntries(defaults);
      localStorage.setItem("ghum_journal_entries", JSON.stringify(defaults));
    }
  }, []);

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !location.trim()) return;

    const newEntry: JournalEntry = {
      id: Math.random().toString(),
      title: title.trim(),
      date,
      location: location.trim(),
      content: content.trim(),
      rating,
      expense: Number(expense) || 0,
      category
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("ghum_journal_entries", JSON.stringify(updated));

    // Reset Form
    setTitle("");
    setLocation("");
    setContent("");
    setExpense("");
    setRating(5);
    setCategory("Other");

    // Toast success
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("ghum_journal_entries", JSON.stringify(updated));
  };

  // Financial aggregates calculation
  const totalSpend = entries.reduce((acc, curr) => acc + curr.expense, 0);
  
  // Category splits
  const splits = entries.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.expense;
    return acc;
  }, {} as {[key in JournalEntry["category"]]: number});

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-7xl mx-auto" id="journal-view">
      {/* Title block */}
      <div className="border-b border-white/30 pb-5">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-sky-600" />
          Personal Safar Journal & Ledger
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Chronicle your sensory experiences, rate local stays, and monitor your travel expenditures dynamically.
        </p>
      </div>

      {/* Aggregates Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/40 backdrop-blur-xl p-5 rounded-2xl border border-white/50 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Aggregate Spend</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">₹ {totalSpend.toLocaleString("en-IN")}</p>
            <p className="text-xs text-slate-400 mt-0.5">INR logged in active logs</p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-5 rounded-2xl border border-white/50 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 shrink-0">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Active Logs Count</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{entries.length} Entries Logged</p>
            <p className="text-xs text-orange-600 font-semibold mt-0.5">Keep updating to track streaks!</p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-5 rounded-2xl border border-white/50 shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 shrink-0">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase">Food & Street split</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">₹ {(splits["Food"] || 0).toLocaleString("en-IN")}</p>
            <p className="text-xs text-slate-400 mt-0.5">Street treats & restaurant meals</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Journal History Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form panel */}
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl lg:col-span-5 space-y-4">
          <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-white/30">
            <PlusCircle className="w-4.5 h-4.5 text-sky-600" />
            Write Log Entry
          </h3>

          <form onSubmit={handleCreateEntry} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="logTitleInput" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Log Title</label>
              <input
                id="logTitleInput"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunrise boat ride, Local Chai Spot..."
                className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            {/* Grid Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date */}
              <div className="space-y-1.5">
                <label htmlFor="logDateInput" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Date</label>
                <input
                  id="logDateInput"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans cursor-pointer"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label htmlFor="logLocationInput" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Location</label>
                <input
                  id="logLocationInput"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Varanasi, UP"
                  className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans"
                />
              </div>
            </div>

            {/* Expense & Category Grid row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Expense logged */}
              <div className="space-y-1.5">
                <label htmlFor="logExpenseInput" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Spend Amount (₹)</label>
                <input
                  id="logExpenseInput"
                  type="number"
                  value={expense}
                  onChange={(e) => setExpense(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans font-mono"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label htmlFor="logCategorySelect" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Spend Category</label>
                <select
                  id="logCategorySelect"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as JournalEntry["category"])}
                  className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans cursor-pointer"
                >
                  <option value="Food">🍲 Food & Treat</option>
                  <option value="Stay">🏨 Stay Hotel</option>
                  <option value="Transport">🚕 Transport/Cab</option>
                  <option value="Tickets">🎟️ Tickets/Passes</option>
                  <option value="Shopping">🛍️ Shopping Bazaar</option>
                  <option value="Other">🏷️ Other tag</option>
                </select>
              </div>
            </div>

            {/* Experience Rating */}
            <div className="space-y-1.5">
              <label htmlFor="sensoryRatingInput" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Sensory Rating</label>
              <div id="sensoryRatingInput" className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                      rating >= num
                        ? "bg-amber-500/15 border-amber-300 text-amber-800 font-extrabold"
                        : "bg-white/50 border-white/50 text-slate-400"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${rating >= num ? "fill-amber-500 text-amber-500" : ""}`} />
                    <span>{num}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Narrative text content */}
            <div className="space-y-1.5">
              <label htmlFor="logNarrativeTextArea" className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Log Narrative Story</label>
              <textarea
                id="logNarrativeTextArea"
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="How did the morning breeze feel? What was the street food taste? Capture details for memory recall..."
                className="w-full p-3 bg-white/60 border border-white/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-sans shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/20 cursor-pointer font-sans"
            >
              <span>Save Log Node</span>
            </button>
          </form>

          {/* Success toast */}
          <AnimatePresence>
            {formSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 rounded-2xl text-xs flex gap-2 backdrop-blur-md"
              >
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>Success! Log and expenses logged safely on local storage database.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History directory */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center pl-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Chronological Logs Feed</h3>
            <span className="text-xs text-slate-400 font-semibold">{entries.length} Logs Active</span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 animate-fade-in">
            {entries.length === 0 ? (
              <div className="p-8 text-center bg-white/30 border border-dashed border-white/40 backdrop-blur-md rounded-3xl text-xs text-slate-400">
                Log is empty. Start writing your travel notes above to keep track of memories and budgets!
              </div>
            ) : (
              entries.map((entry) => (
                <div key={entry.id} className="bg-white/40 backdrop-blur-xl p-5 rounded-[24px] border border-white/50 shadow-xl space-y-3">
                  {/* Top row details */}
                  <div className="flex justify-between items-start gap-2 border-b border-white/30 pb-2.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{entry.title}</h4>
                      <div className="flex items-center gap-3.5 mt-1 text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {entry.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {entry.location}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] bg-sky-500/10 text-sky-850 font-mono font-bold px-2 py-0.5 rounded-full uppercase border border-sky-500/15">
                        ₹ {entry.expense} ({entry.category})
                      </span>
                      <div className="flex justify-end gap-0.5 mt-1">
                        {Array.from({ length: entry.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Body paragraph content */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium font-sans">
                    {entry.content}
                  </p>

                  {/* Trash delete action */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 focus:outline-none cursor-pointer"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove entry</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
