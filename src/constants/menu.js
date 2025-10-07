// src/constants/menu.js
import { HomeIcon, UserIcon, TrophyIcon, WalletIcon } from "@heroicons/react/24/outline";

export const dashboardMenu = [
  { name: "Dashboard", link: "/dashboard", icon: <HomeIcon className="w-5 h-5" /> },
  { name: "Profile", link: "/profile", icon: <UserIcon className="w-5 h-5" /> },
  { name: "Wallet", link: "/wallet", icon: <WalletIcon className="w-5 h-5" /> },
  { name: "Leaderboard", link: "/leaderboard", icon: <TrophyIcon className="w-5 h-5" /> },
];