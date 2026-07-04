import React from "react";
import { motion } from "motion/react";
import { 
  ShoppingBag, 
  Sparkles, 
  Award, 
  CheckCircle, 
  Percent, 
  MapPin, 
  CreditCard, 
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";

interface MarketplaceViewProps {
  userStats: {
    level: number;
    xp: number;
  };
}

export default function MarketplaceView({ userStats }: MarketplaceViewProps) {
  // Partnership catalog with levels discounts
  const partners = [
    {
      id: "partner-1",
      name: "Zostel Hostels & Homestays",
      category: "Hostel Partner",
      description: "Get curated backpacker stays across India. Seamless check-in with offline digital check logs.",
      benefit: "15% OFF bookings",
      minLevel: 1,
      code: "ZOSTELGHUM15",
      type: "Stay"
    },
    {
      id: "partner-2",
      name: "Royal Brothers Bike Rentals",
      category: "Bike Rentals",
      description: "Rent premium scootys and motorbikes in Rishikesh, Manali, Goa, and Munnar.",
      benefit: "Free helmet + 10% OFF",
      minLevel: 2,
      code: "BIKEGHUM10",
      type: "Transport"
    },
    {
      id: "partner-3",
      name: "Sanskriti Temple VIP Pass Partners",
      category: "Temple VIP Pass Partners",
      description: "Access hassle-free, fast darshan entries at Varanasi, Tirupati, and Jagannath Puri temples.",
      benefit: "Direct entry gate pass",
      minLevel: 3,
      code: "VIPDARSHAN",
      type: "Pilgrimage"
    },
    {
      id: "partner-4",
      name: "SafarSankalp Travel Insurance",
      category: "Travel Insurance",
      description: "Emergency medical evacuation, high altitude precautions support, and flight baggage loss defense.",
      benefit: "₹ 5 Lakhs coverage starting ₹99",
      minLevel: 1,
      code: "SAFARINSURE",
      type: "Security"
    },
    {
      id: "partner-5",
      name: "SBI GhumExplorer Credit Card",
      category: "Travel Credit Card",
      description: "Earn 10x reward points on railway ticket bookings and local street food UPI transactions.",
      benefit: "Complimentary railway lounge access",
      minLevel: 4,
      code: "CARDGHUM",
      type: "Finance"
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans max-w-7xl mx-auto" id="marketplace-view">
      {/* Title block */}
      <div className="border-b border-white/30 pb-5">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-sky-600" />
          GhumDesh Partner Marketplace
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Explore exclusive, verified travel partnerships. Level up your Explorer XP to unlock higher discount coupons and VIP passes.
        </p>
      </div>

      {/* Explorer level discount banner */}
      <div className="bg-gradient-to-r from-sky-950/80 to-indigo-950/80 backdrop-blur-md rounded-[32px] p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden border border-white/25 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]"></div>
        
        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-sky-200">
            <Award className="w-3.5 h-3.5" />
            <span>Active Explorer Level: Lvl {userStats.level}</span>
          </div>
          <h3 className="font-display font-extrabold text-xl text-amber-300">Unlock Premium Gen Z Travel Discounts</h3>
          <p className="text-xs text-sky-100">
            Every SafarSaathi AI itinerary generation and Community story report rewards you with XP points. Leveling up instantly unlocks discount codes!
          </p>
        </div>
        
        <div className="text-right shrink-0">
          <span className="text-[10px] text-sky-300 font-mono block font-bold">REWARD STATUS</span>
          <span className="text-xl font-bold font-mono text-emerald-400">ACTIVE CODES: 2 UNLOCKED</span>
        </div>
      </div>

      {/* Partners catalog list */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Official Partners Catalog</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => {
            const isUnlocked = userStats.level >= partner.minLevel;

            return (
              <div 
                key={partner.id} 
                className={`bg-white/40 backdrop-blur-xl rounded-[32px] border p-6 flex flex-col justify-between h-[280px] relative transition-all ${
                  isUnlocked 
                    ? "border-white/50 hover:shadow-lg hover:scale-[1.01]" 
                    : "border-white/20 bg-white/10 opacity-70"
                }`}
              >
                <div>
                  {/* Category Pill row */}
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/15">
                      {partner.category}
                    </span>
                    
                    {isUnlocked ? (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/20">
                        🟢 UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[9px] bg-white/20 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border border-white/30">
                        🔒 UNLOCKS AT LVL {partner.minLevel}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-base mt-3.5">{partner.name}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3 font-medium">
                    {partner.description}
                  </p>
                </div>

                {/* Bottom benefit box */}
                <div className="mt-4 pt-3 border-t border-white/30">
                  <div className="bg-white/50 border border-white/40 p-2.5 rounded-xl flex justify-between items-center text-xs shadow-inner">
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">EXCLUSIVE DEAL</span>
                      <span className="font-bold text-slate-900 text-xs">{partner.benefit}</span>
                    </div>
                    
                    {isUnlocked ? (
                      <span className="font-mono font-bold text-sky-700 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg text-xs tracking-wider">
                        {partner.code}
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-slate-400 italic">Code Locked</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Future roadmap helper box */}
      <div className="p-4.5 bg-sky-500/10 border border-sky-500/20 text-slate-800 rounded-2xl flex gap-3 text-xs leading-relaxed max-w-3xl backdrop-blur-md">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sky-900">Future Monetization Architecture:</span>
          GhumDeshVidesh is built to partner directly with State Tourism boards and verified adventure operators. Future features will include direct in-app secure transactions, digital ticket wallet generation, and UPI-linked discount disbursements.
        </div>
      </div>
    </div>
  );
}
