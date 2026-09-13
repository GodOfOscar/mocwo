import { useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Heart, Home, Share2, Users, ShieldCheck, Smartphone, LockKeyhole, Clock3, MessageSquareText } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/Footer";

const PartnershipSuccess = () => {
  const location = useLocation();
  const { name, level, amount } = location.state || { 
    name: "Partner", 
    level: "Kingdom Partner", 
    amount: "0" 
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eef7ff,#e7edf4)]">
      <Navigation />
      <div className="container mx-auto px-4 py-20 max-w-3xl">
        <Card className="border-0 shadow-[0_30px_120px_rgba(30,64,175,0.22)] rounded-[2rem] overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="bg-gradient-to-r from-blue-950 via-blue-700 to-cyan-600 p-10 text-center text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Heart size={120} fill="white" />
            </div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl ring-4 ring-white/10">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <div className="mb-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-100">
              <Clock3 className="h-4 w-4" />
              Secure Payment
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Payment Processing</h1>
            <p className="text-blue-100 text-lg font-medium opacity-90">Your partnership request is being reviewed.</p>
          </div>

          <CardContent className="p-8 md:p-12 space-y-10">
            <div className="mx-auto max-w-2xl rounded-3xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-7 shadow-sm">
              <div className="mb-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-blue-800">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-white">1</span>
                Step One: Authorization
              </div>
              <p className="text-2xl font-black leading-relaxed text-slate-900">
                Please check your phone for a secure authorization prompt.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Enter your mobile money password or PIN to complete your partnership <span className="font-black text-blue-800">{level}</span> contribution.
              </p>
            </div>

            <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-emerald-50 p-7 text-center shadow-sm">
              <div className="mb-3 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-800">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white">2</span>
                Congratulations
              </div>
              <p className="text-xl font-black text-slate-900">Your partnership will be confirmed after authorization.</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Complete the mobile-money prompt first. Your partnership record is finalized after the provider confirms the payment.</p>
            </div>

            <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-7 text-center shadow-sm">
              <div className="mb-3 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-amber-800">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-white">3</span>
                <MessageSquareText className="h-4 w-4" />
                SMS Notification
              </div>
              <p className="text-xl font-black text-slate-900">Your partnership confirmation SMS follows successful authorization.</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Keep your phone available for the MOCWO confirmation message.</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Partnership Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Partner Name</p>
                  <p className="text-xl font-black text-slate-900">{name}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Covenant Level</p>
                  <p className="text-xl font-black text-blue-600">{level}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Monthly Seed</p>
                  <p className="text-xl font-black text-slate-900">₵ {amount}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <p className="text-xl font-black text-amber-600 uppercase tracking-tighter">Awaiting PIN</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-inner">
              <div className="mb-2 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                <LockKeyhole className="h-4 w-4" />
                Payment Detail
              </div>
              <p className="mt-1 text-3xl font-black text-blue-800">₵ {amount}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 py-7 text-lg font-black rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95">
                <Link to="/community"><Users className="mr-2 h-5 w-5" /> Join the Community</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 py-7 text-lg font-black rounded-2xl border-2 hover:bg-slate-50 transition-all active:scale-95">
                <Link to="/"><Home className="mr-2 h-5 w-5" /> Go Back Home</Link>
              </Button>
            </div>
            
            <div className="text-center pt-4">
               <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Kingdom Partnership',
                      text: `I just became a Kingdom Partner with MOC World Outreach! 🙏 Join the mission:`,
                      url: window.location.origin + '/partnership'
                    }).catch(e => console.log(e));
                  }
                }}
                className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
               >
                 <Share2 size={16} /> Invite others to join the mission
               </button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PartnershipSuccess;