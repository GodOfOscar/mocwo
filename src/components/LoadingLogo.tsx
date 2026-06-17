import { Loader2 } from "lucide-react";
import logo2 from "@/assets/logo2.png";

interface LoadingLogoProps {
  message?: string;
}

export function LoadingLogo({ message = "Loading site status..." }: LoadingLogoProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 p-4">
      <div className="relative flex items-center justify-center rounded-full bg-white/90 p-6 shadow-lg shadow-slate-200">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200/80 border-t-blue-600/90 animate-spin" />
        <div className="absolute inset-4 rounded-full border-4 border-slate-200/80 border-b-blue-600/90 animate-spin duration-1000" />
        <img src={logo2} alt="MOCWO logo" className="relative h-16 w-16 rounded-full object-cover shadow-xl" />
      </div>
      <p className="text-slate-600 text-lg font-semibold">{message}</p>
    </div>
  );
}
