import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo2 from "@/assets/logo2.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Resources", path: "/resources" },
    { name: "Partnership", path: "/partnership" },
    { name: "MOCWO", path: "/mocwo" },
    { name: "Services", path: "/services" },
    // { name: "Live Streaming", path: "/live" },
    // { name: "Contact", path: "/contact" },
    // { name: "Prayer", path: "/prayer-ai" }, // ✅ Prayer AI Page
    { name: "FHCI", path: "/fhc" }, // ✅ FHC Page
    {name: "Rev. Prince", path: "/rev-prince-ministries"}, // ✅ Rev.Prince External Link
  ];

  const isActive = (path: string) => location.pathname === path;

  // Handle navigation animation
  useEffect(() => {
    setIsNavigating(true);
    setLoadingProgress(0);
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const nextProgress = prev + Math.random() * 40;
        return nextProgress > 90 ? 90 : nextProgress;
      });
    }, 200);

    const timer = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setIsNavigating(false);
        setLoadingProgress(0);
      }, 600);
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  // Hide navbar only on main FHC landing page
  if (location.pathname === "/fhc") return null;

  return (
    <>
      {/* Navigation Progress Bar */}
      {isNavigating && (
        <style>{`
          @keyframes progressSlide {
            0% { width: 0; opacity: 1; }
            100% { width: 100%; opacity: 0; }
          }
          @keyframes slideInDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .nav-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #06b6d4, #2563eb);
            box-shadow: 0 0 10px rgba(37, 99, 235, 0.8);
            z-index: 9999;
            animation: progressSlide 1.4s ease-in-out forwards;
          }
          .nav-item-stagger {
            animation: slideInDown 0.6s ease-out forwards;
          }
        `}</style>
      )}
      <div className="nav-progress-bar" style={{ width: `${loadingProgress}%` }} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border font-medium transition-all duration-300 ease-out md:bg-background/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo - Responsive */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-4 transform transition-transform duration-300 hover:scale-105 flex-shrink-0">
              <img 
                src={logo2} 
                alt="MOCWO Logo" 
                className="h-10 md:h-12 w-auto max-w-full filter transition-all duration-300 hover:drop-shadow-lg" 
              />
              <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent transition-all duration-300 hidden sm:inline">
                MOCWO
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative group px-4 py-2 text-sm font-medium transition-all duration-300 ease-out ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    animation: isNavigating ? `slideInDown 0.6s ease-out forwards` : 'none',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <span className="uppercase relative group">
                    {item.name}
                    {/* Animated underline effect */}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500 ease-out ${
                      isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </span>
                </Link>
              ))}
              <Link to="/admin" className="ml-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Admin
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-all duration-300 transform hover:scale-110 active:scale-95 relative group"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Menu 
                  size={24} 
                  className={`transition-all duration-300 absolute ${isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
                />
                <X 
                  size={24} 
                  className={`transition-all duration-300 absolute ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
                />
              </div>
            </button>
          </div>

          {/* Mobile nav */}
          {isOpen && (
            <div 
              className="md:hidden py-6 border-t border-border/50 bg-gradient-to-b from-background/98 via-background/95 to-background/90 backdrop-blur-xl animate-in slide-in-from-top-2 duration-300 shadow-2xl"
              style={{
                animation: 'slideInDown 0.4s ease-out',
                background: 'linear-gradient(180deg, var(--background) 0%, rgba(59, 130, 246, 0.03) 50%, var(--background) 100%)',
              }}
            >
              <div className="flex flex-col space-y-3 px-2">
                {/* Header */}
                {navItems.length > 0 && (
                  <div className="px-2 py-2 mb-2 border-b border-border/30 pb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500/70">Navigation Menu</p>
                  </div>
                )}

                {navItems.map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`mobile-nav-item group relative px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-xl transform overflow-hidden ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30 scale-105"
                        : "text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95"
                    }`}
                    style={{
                      animation: isOpen ? `slideInDown 0.4s ease-out forwards` : 'none',
                      animationDelay: `${index * 0.05 + 0.1}s`
                    }}
                  >
                    {/* Background hover effect */}
                    {!isActive(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
                    )}
                    <span className="uppercase relative z-10 flex items-center">
                      {item.name}
                      {isActive(item.path) && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                      )}
                    </span>
                    {/* Bottom border animation */}
                    {!isActive(item.path) && (
                      <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500" />
                    )}
                  </Link>
                ))}

                {/* Divider */}
                <div className="my-2 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

                {/* Admin Section */}
                <div 
                  className="px-2 pt-2"
                  style={{
                    animation: isOpen ? `slideInDown 0.4s ease-out forwards` : 'none',
                    animationDelay: `${(navItems.length * 0.05) + 0.1}s`
                  }}
                >
                  <Link 
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95 text-white font-semibold py-3 h-auto rounded-xl group"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/80 group-hover:scale-150 transition-transform duration-300" />
                        Admin Panel
                        <div className="w-1.5 h-1.5 rounded-full bg-white/80 group-hover:scale-150 transition-transform duration-300" />
                      </div>
                    </Button>
                  </Link>
                </div>

                {/* Footer info */}
                <div className="px-4 pt-4 mt-2 text-center text-xs text-muted-foreground/50 border-t border-border/20 pt-4">
                  <p>MOCWO Administration</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Add global style for animations */}
      <style>{`
        @keyframes slideInDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(37, 99, 235, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(37, 99, 235, 0.6);
          }
        }

        @keyframes mobileMenuSlide {
          from {
            transform: translateY(-20px) scaleY(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scaleY(1);
            opacity: 1;
          }
        }

        @keyframes itemFloat {
          0%, 100% {
            transform: translateX(-5px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Mobile menu enhanced animations */
        @media (max-width: 768px) {
          .mobile-nav-item {
            animation: itemFloat 0.4s ease-out forwards;
          }
        }

        /* Ensure smooth transitions */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
};

export default Navigation;
