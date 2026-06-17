import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Heart, Home, Share2, Users } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import confetti from 'canvas-confetti';
import Footer from "@/components/Footer";

const PartnershipSuccess = () => {
  const location = useLocation();
  const { name, level, amount } = location.state || { 
    name: "Partner", 
    level: "Kingdom Partner", 
    amount: "0" 
  };

  // Trigger confetti on mount
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a8dadc', '#457b9d', '#1d3557', '#e63946', '#f1faee'],
      disableForReducedMotion: true
    });
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.4, x: 0.5 },
      colors: ['#a8dadc', '#457b9d', '#1d3557', '#e63946', '#f1faee'],
      disableForReducedMotion: true
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="container mx-auto px-4 py-32 max-w-3xl">
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-12 text-center text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Heart size={120} fill="white" />
            </div>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-white/10">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Covenant Sealed! 🙏</h1>
            <p className="text-blue-100 text-lg font-medium opacity-90">Thank you for joining our global mission family.</p>
          </div>

          <CardContent className="p-8 md:p-12 space-y-10">
            {/* Partnership Summary */}
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
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xl font-black text-green-600 uppercase tracking-tighter">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message from Leadership */}
            <div className="relative p-8 md:p-10 bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl text-white shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <span className="text-9xl font-serif">"</span>
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-xl font-black text-blue-400 italic">A Word from our Founder</h3>
                <p className="text-lg leading-relaxed font-light text-blue-50/90 italic">
                  "Beloved {name.split(' ')[0]}, your decision to partner with us today is not just a financial contribution; it is a spiritual investment into eternity. Together, we are taking the light of Christ to the unreached and raising a generation of Kingdom disciples. I declare that as you water others, the Lord God shall water you abundantly. Welcome to the frontline."
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="font-black text-white">Rev. Prince Appau Bediako</p>
                  <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">Founder, MOC World Outreach</p>
                </div>
              </div>
            </div>

            {/* Next Steps / Actions */}
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