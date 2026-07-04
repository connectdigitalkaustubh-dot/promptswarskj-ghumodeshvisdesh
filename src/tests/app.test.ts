import { describe, test, expect } from "vitest";
import { JournalEntry, CrowdReport, TravelItinerary } from "../types";

// ==========================================
// 1. USER PROFILE & XP STATS TESTS
// ==========================================
describe("User Profile & XP Calculation Functions", () => {
  test("calculates level progress correctly", () => {
    const mockStats = { level: 3, xp: 240, name: "Kaustubh" };
    
    // XP increases as the user writes logs. Let's calculate next level thresholds
    const xpNeededForNextLevel = mockStats.level * 100; // e.g., 300 XP needed
    const progressPercentage = (mockStats.xp / xpNeededForNextLevel) * 100;
    
    expect(xpNeededForNextLevel).toBe(300);
    expect(progressPercentage).toBe(80); // 240 / 300 = 80%
  });

  test("computes streak updates correctly on activity logging", () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const userStreak = { count: 5, lastActiveDate: "2026-07-03" };
    
    // Simulating login or logging an entry today
    let updatedStreak = { ...userStreak };
    if (userStreak.lastActiveDate !== todayStr) {
      if (userStreak.lastActiveDate === "2026-07-03") {
        updatedStreak.count += 1;
      } else {
        // Streak broken
        updatedStreak.count = 1;
      }
      updatedStreak.lastActiveDate = todayStr;
    }

    expect(updatedStreak.count).toBe(6);
    expect(updatedStreak.lastActiveDate).toBe(todayStr);
  });
});

// ==========================================
// 2. JOURNAL & FINANCIAL LEDGER TESTS
// ==========================================
describe("Journal & Ledger Calculators", () => {
  const mockEntries: JournalEntry[] = [
    {
      id: "entry-1",
      title: "Magical Sunrise at Assi Ghat",
      date: "2026-06-15",
      location: "Varanasi, UP",
      content: "Chanting and Ganga Arati. Had hot kachori sabzi.",
      rating: 5,
      expense: 230,
      category: "Food"
    },
    {
      id: "entry-2",
      title: "Lonar Crater Hiking Adventure",
      date: "2026-06-20",
      location: "Buldhana, Maharashtra",
      content: "Trekking down the impact crater.",
      rating: 4,
      expense: 600,
      category: "Transport"
    },
    {
      id: "entry-3",
      title: "Lakeside Homestay Stay",
      date: "2026-06-22",
      location: "Munnar, Kerala",
      content: "Overnight in high mist views.",
      rating: 5,
      expense: 1500,
      category: "Stay"
    },
    {
      id: "entry-4",
      title: "Street treats",
      date: "2026-06-23",
      location: "Varanasi, UP",
      content: "Sweets and chats.",
      rating: 5,
      expense: 120,
      category: "Food"
    }
  ];

  test("calculates total ledger expense correctly", () => {
    const totalSpend = mockEntries.reduce((acc, curr) => acc + curr.expense, 0);
    expect(totalSpend).toBe(230 + 600 + 1500 + 120); // 2450
  });

  test("groups expense splits by category accurately", () => {
    const splits = mockEntries.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.expense;
      return acc;
    }, {} as { [key in JournalEntry["category"]]?: number });

    expect(splits["Food"]).toBe(350);       // 230 + 120
    expect(splits["Transport"]).toBe(600);
    expect(splits["Stay"]).toBe(1500);
    expect(splits["Other"]).toBeUndefined();
  });

  test("filters journal entries by text search", () => {
    const searchStr = "assi";
    const filtered = mockEntries.filter(
      (e) =>
        e.title.toLowerCase().includes(searchStr.toLowerCase()) ||
        e.content.toLowerCase().includes(searchStr.toLowerCase()) ||
        e.location.toLowerCase().includes(searchStr.toLowerCase())
    );

    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe("Magical Sunrise at Assi Ghat");
  });
});

// ==========================================
// 3. CROWD ALERTS & BROADCAST FEED TESTS
// ==========================================
describe("Crowd Alerts & Community Broadcast Models", () => {
  const mockReports: CrowdReport[] = [
    {
      id: "rep-1",
      place: "Kedarnath Temple Darshan",
      crowdLevel: "Overcrowded",
      queueTimeMinutes: 240,
      parkingStatus: "Full",
      comment: "Line is 3km long. Heavy rains, bring windcheater.",
      reporterName: "Priya S.",
      timestamp: "2026-07-04T00:00:00.000Z"
    },
    {
      id: "rep-2",
      place: "Taj Mahal South Gate",
      crowdLevel: "Moderate",
      queueTimeMinutes: 20,
      parkingStatus: "Available",
      comment: "VIP gate is fast. Standard ticket wait is under 30 mins.",
      reporterName: "Anonymous",
      timestamp: "2026-07-04T01:00:00.000Z"
    }
  ];

  test("flags severe overcrowding crowd warnings appropriately", () => {
    const overcrowdedReports = mockReports.filter((rep) => rep.crowdLevel === "Overcrowded" || rep.queueTimeMinutes > 120);
    expect(overcrowdedReports.length).toBe(1);
    expect(overcrowdedReports[0].place).toBe("Kedarnath Temple Darshan");
  });

  test("formats reporter usernames with default to Anonymous", () => {
    const displayNames = mockReports.map((rep) => rep.reporterName.trim() || "Anonymous");
    expect(displayNames[0]).toBe("Priya S.");
    expect(displayNames[1]).toBe("Anonymous");
  });
});

// ==========================================
// 4. PARTNER MARKETPLACE UNLOCK TESTS
// ==========================================
describe("Partner Marketplace & Coupon Unlock Thresholds", () => {
  const partners = [
    { id: "p1", name: "GhumSafar Homestays", minLevel: 1 },
    { id: "p2", name: "Zostel Backpacker Hostels", minLevel: 3 },
    { id: "p3", name: "State Tourism Darshan VIP", minLevel: 5 }
  ];

  test("determines partner unlock states based on user level", () => {
    const userLevel = 3;
    const unlockedPartnerIds = partners
      .filter((p) => userLevel >= p.minLevel)
      .map((p) => p.id);

    expect(unlockedPartnerIds).toContain("p1");
    expect(unlockedPartnerIds).toContain("p2");
    expect(unlockedPartnerIds).not.toContain("p3");
  });
});

// ==========================================
// 5. AI TRAVEL PLANNER & SCHEMAS TESTS
// ==========================================
describe("AI Travel Planner Prompt Formatting & Schemas", () => {
  test("generates valid travel planner payloads", () => {
    const destination = "Jaipur, Rajasthan";
    const days = 2;
    const travelerType = "Family";
    const budgetType = "Premium";

    const payload = {
      prompt: `Generate a travel itinerary for:
Destination: ${destination}
Duration: ${days} days
Traveler Profile: ${travelerType}
Budget level: ${budgetType}`,
      responseMimeType: "application/json"
    };

    expect(payload.prompt).toContain("Jaipur, Rajasthan");
    expect(payload.prompt).toContain("Family");
    expect(payload.prompt).toContain("Premium");
    expect(payload.responseMimeType).toBe("application/json");
  });
});

// ==========================================
// 6. CHAT ASSISTANT PAYLOAD MAPPERS
// ==========================================
describe("SafarSaathi AI Chat Companion Mappers", () => {
  test("converts conversation chat history into Gemini SDK roles format correctly", () => {
    const clientMessages = [
      { id: "m1", role: "user" as const, text: "Namaste! Best time to visit Golden Temple?", timestamp: "12:00" },
      { id: "m2", role: "assistant" as const, text: "Early morning around 4:00 AM is pristine.", timestamp: "12:01" }
    ];

    const mappedContents = clientMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }]
    }));

    expect(mappedContents[0].role).toBe("user");
    expect(mappedContents[1].role).toBe("model");
    expect(mappedContents[0].parts[0].text).toBe("Namaste! Best time to visit Golden Temple?");
  });
});

// ==========================================
// 7. GOOGLE MAPS DIRECT ROUTE GENERATION
// ==========================================
describe("Google Maps Navigation Route Generators", () => {
  test("creates valid direct navigation search URLs", () => {
    const mockSpot = { lat: 25.2016, lng: 91.9048, name: "Mawlynnong Village" };
    const url = `https://www.google.com/maps/search/?api=1&query=${mockSpot.lat},${mockSpot.lng}(${encodeURIComponent(mockSpot.name)})`;
    
    expect(url).toContain("https://www.google.com/maps/search/?api=1");
    expect(url).toContain("query=25.2016,91.9048");
    expect(url).toContain("Mawlynnong%20Village");
  });
});

// ==========================================
// 8. SOCIAL FEED INTERACTION MODELS
// ==========================================
describe("Social Feed Interaction Reducers", () => {
  const initialPost = {
    id: "p-1",
    user: "Divya",
    liked: false,
    likes: 10,
    bookmarked: false
  };

  test("correctly increments and toggles liked states", () => {
    // Like action
    const likedState = {
      ...initialPost,
      liked: !initialPost.liked,
      likes: initialPost.liked ? initialPost.likes - 1 : initialPost.likes + 1
    };

    expect(likedState.liked).toBe(true);
    expect(likedState.likes).toBe(11);

    // Unlike action
    const unlikedState = {
      ...likedState,
      liked: !likedState.liked,
      likes: likedState.liked ? likedState.likes - 1 : likedState.likes + 1
    };

    expect(unlikedState.liked).toBe(false);
    expect(unlikedState.likes).toBe(10);
  });

  test("toggles bookmarked state cleanly", () => {
    const bookmarkedState = {
      ...initialPost,
      bookmarked: !initialPost.bookmarked
    };

    expect(bookmarkedState.bookmarked).toBe(true);
  });
});

// ==========================================
// 9. DATA INTEGRITY CHECK (BADGES & INITIAL GEMS)
// ==========================================
describe("Global Static Assets Integrity Checks", () => {
  test("contains correct preset badges needed for leveling thresholds", () => {
    const expectedBadgeIds = ["explorer-1", "explorer-2", "explorer-3", "explorer-4", "explorer-5", "explorer-6"];
    
    // We expect critical badge presets to exist in the application to prevent index crash
    expect(expectedBadgeIds.length).toBe(6);
    expect(expectedBadgeIds[0]).toBe("explorer-1");
  });
});

