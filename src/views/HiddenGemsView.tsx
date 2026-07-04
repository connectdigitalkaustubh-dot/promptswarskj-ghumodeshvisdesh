import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Gem, 
  MapPin, 
  Camera, 
  Eye, 
  HelpCircle, 
  ChevronRight, 
  Star, 
  Compass, 
  ShieldAlert, 
  Coins, 
  Navigation,
  ArrowRight
} from "lucide-react";
import MapComponent from "../components/MapComponent";
import { INITIAL_HIDDEN_GEMS } from "../initialData";
import { HiddenGem } from "../types";

export default function HiddenGemsView() {
  const [spots, setSpots] = useState<HiddenGem[]>(INITIAL_HIDDEN_GEMS);
  const [selectedSpot, setSelectedSpot] = useState<HiddenGem | null>(INITIAL_HIDDEN_GEMS[0]);

  // Open google maps direct navigation route
  const handleOpenGoogleMaps = (spot: HiddenGem) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}(${encodeURIComponent(spot.name)})`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-7xl mx-auto" id="hidden-gems-view">
      {/* Title block */}
      <div className="border-b border-white/30 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
            <Gem className="w-7 h-7 text-sky-600" />
            AI-Vetted Hidden Gems of India
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore breathtaking locations with low crowds, specific photography sweet-spots, and local secret stories.
          </p>
        </div>
        
        <span className="text-xs font-semibold text-sky-700 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          5 Offbeat Spots Active
        </span>
      </div>

      {/* Map Component integration - passes dynamic markers and click callbacks */}
      <div className="w-full">
        <MapComponent 
          spots={spots} 
          selectedSpot={selectedSpot} 
          onSelectSpot={(spot) => setSelectedSpot(spot)} 
        />
      </div>

      {/* Grid: Spot Cards list and Detail Focus panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Detail panel of selected spot */}
        <div className="lg:col-span-7 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/50 p-6 shadow-xl space-y-6 animate-fade-in">
          {selectedSpot ? (
            <motion.div
              key={selectedSpot.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header Details */}
              <div>
                <span className="text-[10px] font-mono text-sky-700 font-bold uppercase tracking-widest bg-sky-500/10 px-2.5 py-1.5 rounded-lg border border-sky-500/20">
                  {selectedSpot.category}
                </span>
                <h3 className="font-display font-bold text-2xl text-slate-900 mt-4">{selectedSpot.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedSpot.region}</span>
                </div>
              </div>

              {/* Description body */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">About this Gem</h4>
                <p className="text-sm text-slate-700 leading-relaxed mt-2 font-medium font-sans">
                  {selectedSpot.description}
                </p>
              </div>

              {/* Grid highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo spot */}
                <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sky-850 font-bold text-xs">
                    <Camera className="w-4 h-4 text-sky-600" />
                    <span>Photography Timing</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {selectedSpot.photographyTime}
                  </p>
                </div>

                {/* Local secret */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-850 font-bold text-xs">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span>Local Secret Story</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {selectedSpot.localSecret}
                  </p>
                </div>

                {/* Scam warning */}
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-orange-850 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-orange-600" />
                    <span>Scam Defense Alert</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {selectedSpot.scamWarning}
                  </p>
                </div>

                {/* UPI Access */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-850 font-bold text-xs">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>UPI Acceptance</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {selectedSpot.upiAvailability}
                  </p>
                </div>
              </div>

              {/* Route triggers */}
              <button
                onClick={() => handleOpenGoogleMaps(selectedSpot)}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                <Navigation className="w-4.5 h-4.5 animate-pulse" />
                <span>Get Driving Routes to Coords</span>
              </button>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Select a pin on the radar map or spot card on the right to load deep-dive traveler intelligence.
            </div>
          )}
        </div>

        {/* Right Side: Quick list of spots */}
        <div className="lg:col-span-5 space-y-3.5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pl-1">Vetted Spots Directory</h4>
          
          <div className="space-y-3">
            {spots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => setSelectedSpot(spot)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  selectedSpot?.id === spot.id
                    ? "bg-sky-500/15 border-sky-500/30 text-sky-950 shadow-xs scale-102"
                    : "bg-white/40 backdrop-blur-md border-white/50 hover:bg-white/60 hover:border-white text-slate-700"
                }`}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                  selectedSpot?.id === spot.id ? "bg-sky-600 text-white shadow-md shadow-sky-500/20" : "bg-white/50 text-slate-600"
                }`}>
                  <Gem className="w-4.5 h-4.5" />
                </span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-800 truncate pr-2">{spot.name.split(",")[0]}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{spot.region}</p>
                  
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <span className="text-[9px] bg-white/60 text-slate-600 px-2 py-0.5 rounded-md font-mono font-bold border border-white/40">
                      {spot.category}
                    </span>
                    <span className="text-[9px] bg-sky-500/10 text-sky-700 px-2 py-0.5 rounded-md font-mono font-bold border border-sky-500/15">
                      {spot.upiAvailability === "Fully Available" ? "UPI Active" : "Cash Back-up"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
