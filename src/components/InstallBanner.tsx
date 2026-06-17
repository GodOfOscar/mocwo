import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Download, Share, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Handle Android/Chrome/Edge prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Only show after 5 seconds to not annoy the user immediately
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    };

    // On iOS, we show the instructions manually if they haven't dismissed it this session
    if (isIosDevice && !sessionStorage.getItem('ios-prompt-dismissed')) {
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const dismiss = () => {
    setIsVisible(false);
    if (isIOS) sessionStorage.setItem('ios-prompt-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[110] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <Card className="p-6 bg-blue-900 text-white border-blue-800 shadow-2xl relative overflow-hidden rounded-2xl">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <button 
          onClick={dismiss}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4 pr-6">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
            <Download className="text-cyan-400" size={24} />
          </div>
          <div>
            <h4 className="font-black text-lg leading-tight mb-1">Install Champion App</h4>
            <p className="text-sm text-blue-100/80 leading-relaxed mb-4">
              Install our app for real-time notifications, faster access, and an offline prayer experience.
            </p>
            
            {isIOS ? (
              <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">iOS Instructions:</p>
                <div className="flex items-center gap-3 text-xs">
                  <Share size={16} className="shrink-0" />
                  <span>Tap the <strong>Share</strong> button below</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <PlusSquare size={16} className="shrink-0" />
                  <span>Select <strong>"Add to Home Screen"</strong></span>
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleInstallClick}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-blue-950 font-black rounded-xl"
              >
                Install Now
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};