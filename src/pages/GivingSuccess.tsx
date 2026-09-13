import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import { CheckCircle2, Heart, Home, Share2, ShieldCheck, Smartphone, LockKeyhole, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const GivingSuccess = () => {
  const location = useLocation();
  const { givingType = "giving", amount = "" } = location.state || {};
  const givingLabel = String(givingType).replace(/-/g, " ");

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#f4a261", "#2a9d8f", "#264653", "#e9c46a"],
      disableForReducedMotion: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eef7ff,#e7edf4)]">
      <main className="container mx-auto max-w-3xl px-4 py-20">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_30px_120px_rgba(30,64,175,0.22)] animate-in zoom-in-95 duration-500">
          <div className="relative bg-gradient-to-r from-blue-950 via-blue-700 to-cyan-600 p-10 text-center text-white">
            <Heart className="absolute right-8 top-8 opacity-10" size={120} fill="white" />
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/30 backdrop-blur-sm">
              <Smartphone className="h-10 w-10" />
            </div>
            <div className="mb-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-100">
              <Clock3 className="h-4 w-4" />
              Secure Payment
            </div>
            <h1 className="mb-3 text-4xl font-black tracking-tight">Payment Processing</h1>
            <p className="text-lg font-medium text-blue-100">
              Your request is being reviewed.
            </p>
          </div>

          <div className="space-y-8 p-8 text-center md:p-12">
            <div className="mx-auto max-w-2xl rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-7 shadow-sm">
              <div className="mb-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-blue-800">
                <ShieldCheck className="h-4 w-4" />
                Authorization Notice
              </div>
              <p className="text-2xl font-black leading-relaxed text-slate-900">
                Please check your phone for a secure authorization prompt.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Enter your mobile money password or PIN to complete your <span className="font-black text-blue-800">{givingLabel}</span> payment.
              </p>
            </div>

            <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-inner">
              <div className="mb-2 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                <LockKeyhole className="h-4 w-4" />
                {amount ? "Gift Amount" : "Payment Detail"}
              </div>
              <p className="mt-1 text-3xl font-black text-blue-800">{amount || "Processing"}</p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild className="flex-1 rounded-2xl bg-blue-700 py-6 text-lg font-black hover:bg-blue-800">
                <Link to="/"><Home className="mr-2 h-5 w-5" /> Back Home</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 rounded-2xl border-2 py-6 text-lg font-black">
                <Link to="/give/offering"><Heart className="mr-2 h-5 w-5" /> Give Again</Link>
              </Button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Secure giving",
                    text: "Your giving request is being processed through MOC World Outreach.",
                    url: window.location.origin,
                  }).catch(() => undefined);
                }
              }}
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-blue-700"
            >
              <Share2 size={16} /> Continue Securely
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GivingSuccess;
