import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  User, 
  Coins, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Heart, 
  Luggage, 
  BookOpen, 
  Compass, 
  Activity,
  Share2,
  Utensils
} from "lucide-react";
import { TravelItinerary, ItineraryItem } from "../types";

export default function DiscoverView() {
  const [destination, setDestination] = useState("Varanasi, Uttar Pradesh");
  const [days, setDays] = useState(3);
  const [travelerType, setTravelerType] = useState("Solo Traveler");
  const [budgetType, setBudgetType] = useState("Backpacker");
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0);
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<"itinerary" | "packing" | "culture">("itinerary");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Rotating loading messages to keep user engaged during generation
  const loadingQuotes = [
    "Consulting SafarSaathi AI travel logs...",
    "Retrieving local temple darshan guidelines...",
    "Analyzing UPI payment networks in the area...",
    "Mapping street food stalls and safety advice...",
    "Generating custom adventure checklist for your profile..."
  ];

  const popularDestinations = [
    { name: "Varanasi, UP", query: "Varanasi, Uttar Pradesh" },
    { name: "Leh Ladakh, J&K", query: "Leh Ladakh, Jammu & Kashmir" },
    { name: "Hampi, Karnataka", query: "Hampi, Karnataka" },
    { name: "Munnar, Kerala", query: "Munnar, Kerala" },
    { name: "Old Delhi, NCR", query: "Chandni Chowk, Old Delhi" }
  ];

  // Schema declaration for Gemini response structure
  const itinerarySchema = {
    type: "OBJECT",
    properties: {
      destination: { type: "STRING" },
      durationDays: { type: "INTEGER" },
      travelerType: { type: "STRING" },
      budgetType: { type: "STRING" },
      totalEstimatedCost: { type: "STRING" },
      packingList: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      scamsToAvoid: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      culturalDoAndDonts: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      dailyPlan: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            day: { type: "INTEGER" },
            title: { type: "STRING" },
            theme: { type: "STRING" },
            activities: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  time: { type: "STRING" },
                  activity: { type: "STRING" },
                  tip: { type: "STRING" },
                  cost: { type: "STRING" }
                },
                required: ["time", "activity", "tip", "cost"]
              }
            },
            localEats: {
              type: "ARRAY",
              items: { type: "STRING" }
            },
            safetyAdvice: { type: "STRING" },
            cultureInsight: { type: "STRING" }
          },
          required: ["day", "title", "theme", "activities", "localEats", "safetyAdvice", "cultureInsight"]
        }
      }
    },
    required: [
      "destination",
      "durationDays",
      "travelerType",
      "budgetType",
      "totalEstimatedCost",
      "packingList",
      "scamsToAvoid",
      "culturalDoAndDonts",
      "dailyPlan"
    ]
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setLoadingQuoteIndex(0);

    // Rotate loading quotes
    const quoteInterval = setInterval(() => {
      setLoadingQuoteIndex((prev) => (prev + 1) % loadingQuotes.length);
    }, 2800);

    const systemInstruction = `You are SafarSaathi AI, a veteran Indian local guide and travel expert.
Generate a structured travel itinerary matching the specified JSON schema.
Ensure your response is highly authentic, strictly avoiding generic travel fluff.
Include:
- Hyper-local details: Specific local restaurants, temples with real rules, exact street foods (like tamatar chaat in Varanasi).
- Realistic cost calculations in Rupees (e.g., 'Rs. 150 for Rickshaw', 'Rs. 40 for Prasad').
- Concrete temple rules: Shoe storage rules, clothing advice.
- Female travel safety warnings and local scams (like the false burning-ghat wood donation scam in Varanasi or fake trekking guides in Ladakh).
- Active local transit tips (metro, public bus, exact rickshaw negotiation strategies).`;

    const prompt = `Generate a travel itinerary for:
Destination: ${destination}
Duration: ${days} days
Traveler Profile: ${travelerType}
Budget level: ${budgetType}

Adhere strictly to the requested schema. Use Rupees for all costing calculations and emphasize street-smart local tips.`;

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction,
          responseMimeType: "application/json",
          schema: itinerarySchema
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to contact SafarSaathi AI. Please double-check your API key connection in Settings > Secrets.");
      }

      const data = await response.json();
      const parsedItinerary = JSON.parse(data.text);
      setItinerary(parsedItinerary);
      setExpandedDay(1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse itinerary. Please try with another destination.");
    } finally {
      clearInterval(quoteInterval);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-7xl mx-auto" id="discover-view">
      {/* Title block */}
      <div className="border-b border-white/30 pb-5">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-7 h-7 text-sky-600 animate-spin-slow" />
          SafarSaathi AI Destination Planner
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Co-create your dream journey. Generate fully localized itineraries, packing templates, and security defenses.
        </p>
      </div>

      {/* Grid: Inputs Form & Visual Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls Column */}
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl lg:col-span-4 space-y-6">
          <h3 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2 pb-3 border-b border-white/30">
            <Sparkles className="w-4.5 h-4.5 text-sky-600" />
            Trip Customizer
          </h3>

          <div className="space-y-4">
            {/* 1. Destination Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Target Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Varanasi, Leh Ladakh, Munnar..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-sans shadow-inner"
                />
              </div>
              
              {/* Destination presets */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {popularDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => setDestination(dest.query)}
                    className="text-[10px] bg-white/50 border border-white/60 text-slate-600 px-2.5 py-1 rounded-full hover:border-sky-500 hover:text-sky-600 transition-colors cursor-pointer backdrop-blur-xs"
                  >
                    {dest.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Days Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-mono font-bold uppercase tracking-wider text-slate-400">Duration (Days)</label>
                <span className="font-bold text-sky-600 font-mono bg-sky-500/10 px-2 py-0.5 rounded-md">{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-white/40 border border-white/50 rounded-lg"
              />
            </div>

            {/* 3. Traveler Profile select */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Traveler Profile</label>
              <select
                value={travelerType}
                onChange={(e) => setTravelerType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans cursor-pointer"
              >
                <option value="Solo Traveler">Solo Traveler 🧑</option>
                <option value="Student Explorers">Student / Budget Group 🎒</option>
                <option value="Family Outing">Family Vacation 👨‍👩‍👧‍👦</option>
                <option value="Couple Retreat">Couple Getaway 💑</option>
                <option value="Senior Pilgrimage">Senior Citizens / Temple Focus 🛕</option>
                <option value="Digital Nomad">Digital Nomad Workation 💻</option>
                <option value="Adventure Seeker">Adventure / Biking Seekers 🏍️</option>
              </select>
            </div>

            {/* 4. Budget level select */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Budget Style</label>
              <select
                value={budgetType}
                onChange={(e) => setBudgetType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 font-sans cursor-pointer"
              >
                <option value="Backpacker">Backpacker (Hostels, local state bus)</option>
                <option value="Moderate">Moderate (Homestays, private cabs)</option>
                <option value="Luxury">Luxury (Heritage hotels, expert guide)</option>
                <option value="Student Tier">Student Budget (Max discounts)</option>
              </select>
            </div>

            {/* Generate Trigger */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !destination.trim()}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-sky-500/20"
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Generate SafarItinerary</span>
            </button>
          </div>
        </div>

        {/* Output Area Column */}
        <div className="lg:col-span-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              /* ACTIVE GENERATION SKELETON WITH ROTATING QUOTES */
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/50 p-12 text-center shadow-xl flex flex-col items-center justify-center min-h-[450px]"
              >
                {/* Custom glowing compass bounce */}
                <div className="w-20 h-20 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-600 mb-6 border border-sky-500/20 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-sky-500/30 border-t-sky-500 animate-spin"></div>
                  <Compass className="w-8 h-8" />
                </div>
                
                <h4 className="font-display font-bold text-slate-850 text-base">Weaving Your Local Map</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">Please wait up to 10 seconds. SafarSaathi is drafting specific temple routes, food spots, and safety protocols.</p>
                
                {/* Rotating engaging text quote banner */}
                <div className="mt-8 px-6 py-3.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl max-w-md w-full">
                  <p className="text-xs font-mono text-sky-850 font-semibold animate-pulse">
                    ✨ "{loadingQuotes[loadingQuoteIndex]}"
                  </p>
                </div>
              </motion.div>
            ) : error ? (
              /* ERROR REPORT HUB */
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-red-500/10 border border-red-500/20 backdrop-blur-xl rounded-[32px] p-8 text-center shadow-xl"
              >
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h4 className="font-bold text-red-900 font-display">Generation Interrupt</h4>
                <p className="text-xs text-red-700 mt-2 max-w-md mx-auto leading-relaxed">{error}</p>
                <button
                  onClick={handleGenerate}
                  className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors shadow-lg"
                >
                  Retry Plan
                </button>
              </motion.div>
            ) : itinerary ? (
              /* COMPREHENSIVE PERSONALIZED ITINERARY DISPLAY */
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Dynamic Summary Panel */}
                <div className="bg-white/50 border border-white/60 backdrop-blur-md p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-sky-700 uppercase font-mono">Dynamic Destination Map</span>
                    <h3 className="font-display font-extrabold text-xl text-slate-800 mt-0.5">{itinerary.destination}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Designed for {itinerary.travelerType} • {itinerary.durationDays} Days • {itinerary.budgetType}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-[9px] font-bold text-sky-600 block uppercase font-mono">ESTIMATED BUDGET EXPENDITURE</span>
                    <p className="text-xl font-bold font-mono text-sky-850">{itinerary.totalEstimatedCost}</p>
                    <span className="text-[9px] text-slate-400 block mt-0.5">*Includes local food, rickshaws, and stay</span>
                  </div>
                </div>

                {/* Itinerary Tab Selector */}
                <div className="flex border-b border-white/30 text-sm font-medium">
                  <button
                    onClick={() => setActiveSubTab("itinerary")}
                    className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeSubTab === "itinerary"
                        ? "border-sky-600 text-sky-700 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>🗺️ Plan</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("packing")}
                    className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeSubTab === "packing"
                        ? "border-sky-600 text-sky-700 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Luggage className="w-4 h-4" />
                    <span>🎒 Defense & Gear</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("culture")}
                    className={`pb-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeSubTab === "culture"
                        ? "border-sky-600 text-sky-700 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    <span>🛕 Locals Guide</span>
                  </button>
                </div>

                {/* Sub Tab Outputs */}
                {activeSubTab === "itinerary" && (
                  <div className="space-y-4">
                    {itinerary.dailyPlan.map((dayItem) => {
                      const isExpanded = expandedDay === dayItem.day;

                      return (
                        <div key={dayItem.day} className="bg-white/40 backdrop-blur-xl rounded-[24px] border border-white/50 shadow-md overflow-hidden animate-fade-in">
                          {/* Accordion Toggle Header */}
                          <button
                            onClick={() => setExpandedDay(isExpanded ? null : dayItem.day)}
                            className="w-full text-left p-5 flex justify-between items-center bg-white/30 hover:bg-white/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <span className="w-9 h-9 rounded-xl bg-sky-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-md shadow-sky-500/15">
                                D{dayItem.day}
                              </span>
                              <div>
                                <span className="text-[10px] font-mono text-sky-600 font-bold tracking-wider uppercase">{dayItem.theme}</span>
                                <h4 className="font-bold text-slate-800 text-sm">{dayItem.title}</h4>
                              </div>
                            </div>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                          </button>

                          {/* Accordion Expansion Content */}
                          {isExpanded && (
                            <div className="p-5 border-t border-white/30 space-y-5">
                              {/* Activities timeline */}
                              <div className="space-y-4">
                                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 uppercase">Chronicle Roadmap</span>
                                <div className="space-y-3.5 pl-3 border-l-2 border-sky-500/20">
                                  {dayItem.activities.map((act, idx) => (
                                    <div key={idx} className="relative pl-4 space-y-1">
                                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-white shadow-2xs"></div>
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <span className="text-xs font-mono font-bold text-sky-700 bg-sky-500/10 px-2 py-0.5 rounded-md inline-block w-fit">
                                          ⏱️ {act.time}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono font-medium">{act.cost}</span>
                                      </div>
                                      <p className="text-xs font-semibold text-slate-800">{act.activity}</p>
                                      <p className="text-[11px] text-slate-500 italic">💡 Local hack: {act.tip}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Local Eats preview */}
                              {dayItem.localEats && dayItem.localEats.length > 0 && (
                                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                                  <span className="text-[9px] font-bold font-mono text-amber-800 uppercase block">Day Gastronomy Highlight</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {dayItem.localEats.map((eat, idx) => (
                                      <span key={idx} className="text-xs bg-white/50 text-slate-800 px-2.5 py-1 rounded-md border border-white/60 font-medium shadow-2xs backdrop-blur-xs">
                                        🍲 {eat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Warnings / Insights footnotes */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-800">
                                  <span className="font-bold block text-[10px] uppercase font-mono tracking-wide">⚠️ Safety advice</span>
                                  <p className="mt-0.5 text-[11px]">{dayItem.safetyAdvice}</p>
                                </div>
                                <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-xs text-sky-850">
                                  <span className="font-bold block text-[10px] uppercase font-mono tracking-wide">🛕 Cultural insight</span>
                                  <p className="mt-0.5 text-[11px]">{dayItem.cultureInsight}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeSubTab === "packing" && (
                  <div className="bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/50 p-6 space-y-6 shadow-xl">
                    {/* Packing Checklist */}
                    <div>
                      <h4 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2 mb-3">
                        <Luggage className="w-4.5 h-4.5 text-sky-600" />
                        Custom Packing Checklist
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {itinerary.packingList.map((item, idx) => (
                           <div key={idx} className="flex items-center gap-2.5 p-2 bg-white/30 border border-white/40 rounded-xl">
                            <CheckCircle className="w-4 h-4 text-sky-500 shrink-0" />
                            <span className="text-xs text-slate-700 font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scams defense radar */}
                    <div>
                      <h4 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4.5 h-4.5 text-orange-600" />
                        Scam Defense Shield (Ignore Fake Guides)
                      </h4>
                      <div className="space-y-2">
                        {itinerary.scamsToAvoid.map((scam, idx) => (
                          <div key={idx} className="p-3.5 bg-orange-500/10 border border-orange-500/20 text-orange-850 rounded-2xl text-xs leading-relaxed">
                            <span className="font-bold uppercase tracking-wider text-[9px] text-orange-700 font-mono block">DEFENSE SHIELD #{idx + 1}</span>
                            <p className="mt-0.5">{scam}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSubTab === "culture" && (
                  <div className="bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/50 p-6 space-y-4 shadow-xl">
                    <h4 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-2">
                      <BookOpen className="w-4.5 h-4.5 text-sky-600" />
                      Cultural Do's & Don'ts
                    </h4>
                    
                    <div className="space-y-3.5">
                      {itinerary.culturalDoAndDonts.map((rule, idx) => (
                        <div key={idx} className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* DEFAULT INVITATION BOX */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/50 p-12 text-center shadow-xl flex flex-col items-center justify-center min-h-[450px]"
              >
                <div className="w-14 h-14 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-600 mb-4">
                  <Compass className="w-7 h-7" />
                </div>
                <h4 className="font-display font-bold text-slate-800 text-base">Unleash SafarSaathi Travel Maps</h4>
                <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
                  Enter your desired destination on the left panel (e.g. Munnar, Ladakh, Goa, or Hampi) and choose your style to co-generate an extremely detailed, scam-proof itinerary.
                </p>
                
                <button
                  onClick={handleGenerate}
                  className="mt-5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
                >
                  Generate Varanasi Default
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
