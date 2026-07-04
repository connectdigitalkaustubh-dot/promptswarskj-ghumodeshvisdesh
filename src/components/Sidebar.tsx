import React from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Compass, 
  Gem, 
  Users, 
  AlertTriangle, 
  BookOpen, 
  Settings, 
  LogOut,
  Sparkles,
  ShoppingBag,
  Award
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userStats: {
    level: number;
    xp: number;
    streak: number;
  };
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, userStats }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "planner", label: "AI Planner", icon: Compass },
    { id: "hidden-gems", label: "Hidden Gems", icon: Gem },
    { id: "crowd-alerts", label: "Crowd Alerts", icon: AlertTriangle },
    { id: "community", label: "Community Feed", icon: Users },
    { id: "journal", label: "Travel Journal", icon: BookOpen },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside 
        className="hidden md:flex flex-col w-68 bg-white/40 backdrop-blur-xl border-r border-white/40 h-screen sticky top-0 font-sans shadow-lg relative z-10"
        id="desktop-sidebar"
        aria-label="Sidebar Navigation"
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/30 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 tracking-tight text-sm uppercase block">GhumDeshVidesh</span>
              <span className="text-[10px] text-sky-600 font-mono tracking-widest uppercase font-bold -mt-1 block">AI Travel Portal</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-medium italic mt-2">"Travel Like a Local. Explore Like Never Before."</p>
        </div>

        {/* User Level and XP Dashboard Badge */}
        <div className="p-5 border-b border-white/30 bg-white/25 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/60 border border-white/40 flex items-center justify-center text-sky-700 font-bold font-mono text-sm shadow-xs">
              L{userStats.level}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">Explorer Level</span>
                <span className="text-[10px] text-sky-700 font-mono font-semibold">{userStats.xp} XP</span>
              </div>
              <div className="w-full bg-white/40 backdrop-blur-xs h-1.5 rounded-full mt-1.5 overflow-hidden border border-white/20">
                <div 
                  className="bg-gradient-to-r from-sky-500 to-teal-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(userStats.xp % 100)}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Active Streak
            </span>
            <span className="font-mono font-bold text-orange-700 bg-orange-100/60 border border-orange-200/40 px-1.5 py-0.5 rounded-md text-xs backdrop-blur-xs">
              🔥 {userStats.streak} Days
            </span>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-white/60 backdrop-blur-md text-sky-700 font-semibold border border-white/50 shadow-sm"
                    : "text-slate-600 hover:bg-white/30 hover:text-sky-600"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <IconComponent className={`w-5 h-5 transition-transform ${
                  isActive ? "text-sky-600 scale-105" : "text-slate-400 group-hover:text-slate-600"
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-white/30 bg-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50/50 rounded-xl text-sm font-medium transition-all cursor-pointer focus:outline-none"
            aria-label="Logout account"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/60 backdrop-blur-xl border-t border-white/40 z-40 px-3 py-2 flex justify-around items-center font-sans shadow-lg pb-safe"
        id="mobile-bottom-nav"
        aria-label="Mobile Navigation"
      >
        {menuItems.slice(0, 5).map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive ? "text-sky-700 font-semibold scale-105 bg-white/40 border border-white/40 shadow-xs" : "text-slate-500 hover:text-sky-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-tight">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
          {/* More option targeting Journal & Settings */}
          <button
            onClick={() => setActiveTab(activeTab === "journal" ? "settings" : "journal")}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              ["journal", "settings", "marketplace"].includes(activeTab) ? "text-sky-700 font-semibold scale-105 bg-white/40 border border-white/40 shadow-xs" : "text-slate-500 hover:text-sky-600"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[9px] font-medium tracking-tight">Journal</span>
          </button>
      </nav>
    </>
  );
}
