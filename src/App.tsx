import React, { useState, useEffect } from "react";
import LoginView from "./views/LoginView";
import Sidebar from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import DiscoverView from "./views/DiscoverView";
import HiddenGemsView from "./views/HiddenGemsView";
import CrowdAlertsView from "./views/CrowdAlertsView";
import CommunityView from "./views/CommunityView";
import JournalView from "./views/JournalView";
import MarketplaceView from "./views/MarketplaceView";
import SettingsView from "./views/SettingsView";
import SafarSaathiFloating from "./components/SafarSaathiFloating";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userStats, setUserStats] = useState({
    level: 3,
    xp: 240,
    streak: 5,
    name: "Kaustubh"
  });

  // 1. Session Restore & Auth sync
  useEffect(() => {
    const cachedAuth = localStorage.getItem("ghum_user_auth");
    if (cachedAuth) {
      const parsed = JSON.parse(cachedAuth);
      setIsAuthenticated(true);
      setUserStats(prev => ({
        ...prev,
        name: parsed.name || prev.name,
        streak: parsed.streak || prev.streak,
        level: parsed.level || prev.level,
        xp: parsed.xp || prev.xp
      }));
    }
  }, []);

  // Save changes to localStorage on auth login
  const handleLoginSuccess = (name: string) => {
    const authState = {
      name,
      isAuthenticated: true,
      streak: 5,
      level: 3,
      xp: 240,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("ghum_user_auth", JSON.stringify(authState));
    setUserStats(prev => ({ ...prev, name }));
    setIsAuthenticated(true);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("ghum_user_auth");
    setIsAuthenticated(false);
  };

  // Render proper Sub-View
  const renderViewContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView userStats={userStats} setActiveTab={setActiveTab} />;
      case "planner":
        return <DiscoverView />;
      case "hidden-gems":
        return <HiddenGemsView />;
      case "crowd-alerts":
        return <CrowdAlertsView />;
      case "community":
        return <CommunityView />;
      case "journal":
        return <JournalView />;
      case "marketplace":
        return <MarketplaceView userStats={userStats} />;
      case "settings":
        return <SettingsView userStats={userStats} setUserStats={setUserStats} />;
      default:
        return <DashboardView userStats={userStats} setActiveTab={setActiveTab} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-[#E0F2FE] text-slate-800 relative overflow-hidden" id="ghum-app-root">
      {/* Mesh Gradient Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-sky-300 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-200 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-emerald-200 rounded-full blur-[80px] opacity-30"></div>
      </div>

      {/* Sidebar - Desktop and bottom navigation bar for Mobile */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userStats={userStats} 
        onLogout={handleLogout} 
      />

      {/* Main viewport area */}
      <main className="flex-1 pb-24 md:pb-6 overflow-x-hidden relative z-10">
        {renderViewContent()}
      </main>

      {/* Dynamic SafarSaathi Floating Assistant Chatbot (Always active in viewport) */}
      <SafarSaathiFloating />
    </div>
  );
}
