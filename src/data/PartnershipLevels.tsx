import { Heart, Star, Sparkles, Crown } from "lucide-react";


export const partnershipLevels = [
  {
    slug: "bronze-partner",
    title: "Bronze Partner",
    amount: "$50/month",
    icon: Heart,
    color: "from-orange-400 to-orange-600",
    benefits: [
      "Monthly prayer support",
      "Access to partner events",
      "Digital resources",
      "Ministry updates",
    ],
  },
  {
    slug: "silver-partner",
    title: "Silver Partner",
    amount: "$100/month",
    icon: Star,
    color: "from-gray-400 to-gray-600",
    benefits: [
      "All Bronze benefits",
      "Quarterly ministry calls",
      "Physical resource gifts",
      "Priority prayer requests",
      "Special recognition",
    ],
  },
  {
    slug: "gold-partner",
    title: "Gold Partner",
    amount: "$250/month",
    icon: Sparkles,
    color: "from-yellow-400 to-yellow-600",
    benefits: [
      "All Silver benefits",
      "Annual partner retreat",
      "One-on-one prayer sessions",
      "Exclusive content access",
      "Ministry impact reports",
    ],
  },

];
