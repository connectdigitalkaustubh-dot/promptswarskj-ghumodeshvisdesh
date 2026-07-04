import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  UserCheck, 
  MessageCircle, 
  Heart, 
  Bookmark, 
  Send, 
  CheckCircle, 
  PlusCircle, 
  Compass, 
  Share2,
  Sparkles,
  Bot
} from "lucide-react";
import { INITIAL_TRAVEL_BUDDIES } from "../initialData";
import { TravelBuddy } from "../types";

export default function CommunityView() {
  const [buddies, setBuddies] = useState<TravelBuddy[]>(INITIAL_TRAVEL_BUDDIES);
  const [activeChatBuddy, setActiveChatBuddy] = useState<TravelBuddy | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLogs, setChatLogs] = useState<{[key: string]: {sender: "me" | "buddy", text: string}[]}>({});
  
  // Trip Feed state
  const [feedPosts, setFeedPosts] = useState([
    {
      id: "post-1",
      user: "Divya Rao",
      location: "Gurez Valley, Kashmir",
      content: "Just crossed the Dawar checkpost. Road conditions are slightly wet but absolutely scenic. Remember to register your Aadhaar/Passport copy in duplicate! Carry some warm jackets, it gets chilling after 6 PM.",
      likes: 12,
      comments: 3,
      bookmarked: false,
      liked: false
    },
    {
      id: "post-2",
      user: "Sumeet Goswami",
      location: "Hampi Ruins, Karnataka",
      content: "Pro-tip for visiting Virupaksha Temple: Take off your footwear at the designated counter on the left of the main gopuram (charges are only Rs. 2). Avoid guys selling local VIP entrance keys inside; there are no VIP doors! Met an amazing guide named Hanu, totally authentic.",
      likes: 24,
      comments: 5,
      bookmarked: true,
      liked: false
    }
  ]);
  const [newPostContent, setNewPostContent] = useState("");
  const [activeTab, setActiveTab] = useState<"buddies" | "feed">("buddies");

  // Handle Likes
  const handleLike = (id: string) => {
    setFeedPosts(posts => posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  // Handle Bookmarks
  const handleBookmark = (id: string) => {
    setFeedPosts(posts => posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          bookmarked: !p.bookmarked
        };
      }
      return p;
    }));
  };

  // Submit Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Math.random().toString(),
      user: "Current Explorer",
      location: "Active Location",
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      bookmarked: false,
      liked: false
    };

    setFeedPosts([newPost, ...feedPosts]);
    setNewPostContent("");
  };

  // Send Direct Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeChatBuddy) return;

    const buddyId = activeChatBuddy.id;
    const currentLogs = chatLogs[buddyId] || [
      { sender: "buddy", text: `Namaste! Excited that you're visiting ${activeChatBuddy.destination}. Let's coordinate!` }
    ];

    const updatedLogs = [
      ...currentLogs,
      { sender: "me" as const, text: chatMessage.trim() }
    ];

    setChatLogs({
      ...chatLogs,
      [buddyId]: updatedLogs
    });
    setChatMessage("");

    // Simulate responsive reply from the buddy after 1 second
    setTimeout(() => {
      setChatLogs(prevLogs => ({
        ...prevLogs,
        [buddyId]: [
          ...prevLogs[buddyId],
          { sender: "buddy" as const, text: "Excellent, bhaiya! Let's schedule a meet near the main square. I'll share my live location coordinates as soon as I check in." }
        ]
      }));
    }, 1200);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-7xl mx-auto" id="community-view">
      {/* Title block */}
      <div className="border-b border-white/30 pb-5">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-sky-600" />
          GhumDesh Explorer Community
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Coordinate trips with verified solo travelers, read authentic local reports, and discover active meetups.
        </p>
      </div>

      {/* Tabs selector */}
      <div className="flex bg-white/40 border border-white/40 p-1 rounded-xl w-fit text-xs font-semibold backdrop-blur-md">
        <button
          onClick={() => setActiveTab("buddies")}
          className={`py-2 px-4 rounded-lg transition-all cursor-pointer ${
            activeTab === "buddies"
              ? "bg-white/80 text-sky-700 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          🧑 Active Travel Buddies
        </button>
        <button
          onClick={() => setActiveTab("feed")}
          className={`py-2 px-4 rounded-lg transition-all cursor-pointer ${
            activeTab === "feed"
              ? "bg-white/80 text-sky-700 shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          📸 Local Story Feed
        </button>
      </div>

      {/* Output Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {activeTab === "buddies" ? (
          <>
            {/* Travel Buddies directory list */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pl-1">Vetted Solo Nomads</h3>
              
              <div className="space-y-3 animate-fade-in">
                {buddies.map((buddy) => (
                  <button
                    key={buddy.id}
                    onClick={() => {
                      setActiveChatBuddy(buddy);
                      // Initial log check
                      if (!chatLogs[buddy.id]) {
                        setChatLogs({
                          ...chatLogs,
                          [buddy.id]: [
                            { sender: "buddy", text: `Namaste! Excited that you're visiting ${buddy.destination}. Let's coordinate!` }
                          ]
                        });
                      }
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      activeChatBuddy?.id === buddy.id
                        ? "bg-sky-500/15 border-sky-500/30 text-sky-950 shadow-xs"
                        : "bg-white/40 backdrop-blur-md border-white/50 hover:bg-white/60 text-slate-700"
                    }`}
                  >
                    <img 
                      src={buddy.avatar} 
                      alt={buddy.name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-slate-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-800 truncate pr-2">{buddy.name}, {buddy.age}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{buddy.location}</span>
                      </div>
                      <p className="text-[11px] text-sky-600 font-bold font-mono tracking-wide uppercase mt-0.5">➔ {buddy.destination}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">"{buddy.bio}"</p>
                      
                      <div className="mt-2 text-[9px] bg-white/60 text-slate-600 px-2 py-0.5 rounded-md inline-block font-semibold border border-white/40">
                        {buddy.style}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Message Active chat component */}
            <div className="lg:col-span-7 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/50 p-6 shadow-xl min-h-[450px] flex flex-col justify-between">
              {activeChatBuddy ? (
                <>
                  {/* Active Header details */}
                  <div className="flex items-center justify-between border-b border-white/30 pb-3.5 mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={activeChatBuddy.avatar} 
                        alt={activeChatBuddy.name} 
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1">
                          {activeChatBuddy.name}
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        </h4>
                        <p className="text-[11px] text-sky-600 font-bold font-mono">Trip: {activeChatBuddy.dates}</p>
                      </div>
                    </div>
                  </div>

                  {/* Message body logs */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-72">
                    {(chatLogs[activeChatBuddy.id] || []).map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                          msg.sender === "me"
                            ? "bg-sky-600 text-white rounded-tr-none font-medium shadow-md shadow-sky-500/10"
                            : "bg-white/60 text-slate-800 rounded-tl-none border border-white/50 backdrop-blur-xs"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input sending bar */}
                  <form onSubmit={handleSendMessage} className="mt-4 pt-3.5 border-t border-white/30 flex items-center gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={`Send a coordinating coordinate request to ${activeChatBuddy.name.split(" ")[0]}...`}
                      className="flex-1 px-4 py-2.5 bg-white/60 border border-white/60 rounded-xl text-xs focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="w-10 h-10 bg-sky-600 hover:bg-sky-700 disabled:bg-white/20 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 bg-sky-500/10 text-sky-600 rounded-full flex items-center justify-center border border-sky-500/10">
                    <MessageCircle className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="font-display font-bold text-slate-800 text-sm">Nomad Coordinator Portal</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Select any verified buddy in the directory to coordinate hotel shares, private transport pools, or local street walks!
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* LOCAL STORY TRIP FEED BOARD */
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Post writing form */}
            <div className="bg-white/40 backdrop-blur-xl p-5 rounded-[32px] border border-white/50 shadow-xl lg:col-span-4 space-y-4">
              <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-2 pb-2.5 border-b border-white/30">
                <PlusCircle className="w-4.5 h-4.5 text-sky-600" />
                Write Local Story
              </h3>

              <form onSubmit={handleCreatePost} className="space-y-3">
                <textarea
                  required
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a local hack! e.g. Dress code for Rameshwaram, shoe counters at Golden temple, or UPI warnings at Dal Lake..."
                  className="w-full p-3 bg-white/60 border border-white/60 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-sans shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-sky-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish Story node</span>
                </button>
              </form>
            </div>

            {/* Posts list feed */}
            <div className="lg:col-span-8 space-y-4 animate-fade-in">
              {feedPosts.map((post) => (
                <div key={post.id} className="bg-white/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 shadow-xl space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{post.user}</h4>
                      <span className="text-[10px] text-sky-600 font-mono font-bold">📍 {post.location}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">2h ago</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line bg-white/40 p-4 rounded-2xl border border-white/40">
                    {post.content}
                  </p>

                  {/* Actions toolbar */}
                  <div className="flex items-center gap-5 pt-1 border-t border-white/30 text-slate-400">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold focus:outline-none transition-all cursor-pointer ${
                        post.liked ? "text-red-500 scale-102 font-bold animate-pulse" : "hover:text-slate-600"
                      }`}
                    >
                      <Heart className={`w-4.5 h-4.5 ${post.liked ? "fill-red-500 text-red-500" : ""}`} />
                      <span>{post.likes} Likes</span>
                    </button>
                    
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold focus:outline-none transition-all cursor-pointer ${
                        post.bookmarked ? "text-sky-600 scale-102 font-bold" : "hover:text-slate-600"
                      }`}
                    >
                      <Bookmark className={`w-4.5 h-4.5 ${post.bookmarked ? "fill-sky-600 text-sky-600" : ""}`} />
                      <span>{post.bookmarked ? "Bookmarked" : "Save"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
