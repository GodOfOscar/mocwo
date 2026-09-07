import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import { CheckCircle2, Heart, Home, Share2 } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto max-w-3xl px-4 py-32">
        <section className="overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="relative bg-gradient-to-r from-blue-800 via-blue-700 to-cyan-600 p-12 text-center text-white">
            <Heart className="absolute right-8 top-8 opacity-10" size={120} fill="white" />
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/10">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mb-3 text-4xl font-black tracking-tight">Thank You for Giving</h1>
            <p className="text-lg font-medium text-blue-100">
              We appreciate your heart to give to the LORD.
            </p>
          </div>

          <div className="space-y-8 p-8 text-center md:p-12">
            <div className="mx-auto max-w-xl space-y-4">
              <p className="text-xl leading-relaxed text-slate-700">
                Your {givingLabel} is a blessing and a meaningful part of advancing God&apos;s work.
              </p>
              <p className="text-slate-500">
                May the LORD bless you abundantly and use your generosity to touch many lives.
              </p>
            </div>

            {amount && (
              <div className="mx-auto max-w-xs rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Gift Amount</p>
                <p className="mt-1 text-2xl font-black text-blue-700">{amount}</p>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild className="flex-1 rounded-2xl bg-blue-700 py-6 text-lg font-bold hover:bg-blue-800">
                <Link to="/"><Home className="mr-2 h-5 w-5" /> Go Back Home</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 rounded-2xl border-2 py-6 text-lg font-bold">
                <Link to="/give/offering"><Heart className="mr-2 h-5 w-5" /> Give Again</Link>
              </Button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Giving thanks",
                    text: "I just gave to support the work of the LORD through MOC World Outreach.",
                    url: window.location.origin,
                  }).catch(() => undefined);
                }
              }}
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-blue-700"
            >
              <Share2 size={16} /> Share your gratitude
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GivingSuccess;
