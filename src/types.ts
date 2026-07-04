export interface UserProfile {
  name: string;
  email: string;
  role: string; // e.g. Backpacker, Family, Solo Traveller
  xp: number;
  level: number;
  streakDays: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  unlockedAt?: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface CrowdReport {
  id: string;
  place: string;
  crowdLevel: "Low" | "Moderate" | "Crowded" | "Overcrowded";
  queueTimeMinutes: number;
  parkingStatus: "Available" | "Limited" | "Full" | "No Parking";
  comment: string;
  reporterName: string;
  timestamp: string;
}

export interface HiddenGem {
  id: string;
  name: string;
  region: string;
  category: "Secret Waterfall" | "Local Cafe" | "Panoramic Viewpoint" | "Hidden Temple" | "Quaint Village" | "Offbeat Market" | "Historic Museum";
  description: string;
  photographyTime: string;
  localSecret: string;
  scamWarning: string;
  upiAvailability: string;
  lat: number;
  lng: number;
}

export interface ItineraryItem {
  day: number;
  title: string;
  theme: string;
  activities: {
    time: string;
    activity: string;
    tip: string;
    cost: string;
  }[];
  localEats: string[];
  safetyAdvice: string;
  cultureInsight: string;
}

export interface TravelItinerary {
  destination: string;
  durationDays: number;
  travelerType: string;
  budgetType: string;
  totalEstimatedCost: string;
  packingList: string[];
  dailyPlan: ItineraryItem[];
  scamsToAvoid: string[];
  culturalDoAndDonts: string[];
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  rating: number; // 1-5
  expense: number;
  category: "Food" | "Transport" | "Stay" | "Tickets" | "Shopping" | "Other";
}

export interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  location: string;
  style: string;
  destination: string;
  dates: string;
  bio: string;
  avatar: string;
}
