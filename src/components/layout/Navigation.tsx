import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo2 from "@/assets/logo2.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const normalizePath = (pathname: string) => pathname.replace(/\/+$|^\s+|\s+$/g, '') || "/";
  const isActive = (path: string) => {
    const currentPath = normalizePath(location.pathname);
    const targetPath = normalizePath(path);
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  };

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

  // Handle scroll-based navbar styling
  useEffect(() => {
    const pagesWithWhiteNavbar = ["/partnership", "/about", "/services", "/resources", "/rev-prince-ministries"];
    const shouldDisableScrollEffect = pagesWithWhiteNavbar.some((path) => {
      const current = location.pathname.replace(/\/+$|^\s+|\s+$/g, '') || "/";
      return current === path || current.startsWith(`${path}/`);
    });
    
    // Initialize based on current scroll or force white on specific pages
    if (shouldDisableScrollEffect) {
      setIsScrolled(true); // Always white background with black text on these pages
    } else {
      setIsScrolled(window.scrollY > 30);
    }
    
    const handleScroll = () => {
      if (!shouldDisableScrollEffect) {
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
        });
      }
      // On pages with white navbar, don't update scroll state
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Trigger check immediately on mount
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Hide navbar on FHC page only
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

      <nav className={`fixed top-0 left-0 right-0 z-50 font-medium transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50 h-14'
          : 'bg-transparent backdrop-blur-none shadow-none border-b border-transparent h-16'
      }`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-14' : 'h-16'
          }`}>

            {/* Logo - Responsive */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-4 transform transition-transform duration-300 hover:scale-105 flex-shrink-0">
              <img 
                src={logo2} 
                alt="MOCWO Logo" 
                className={`w-auto max-w-full filter transition-all duration-300 hover:drop-shadow-lg ${
                  isScrolled ? 'h-8 md:h-10' : 'h-10 md:h-12'
                }`} 
              />
              <span className={`font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent transition-all duration-300 hidden sm:inline ${
                isScrolled ? 'text-base md:text-lg' : 'text-lg md:text-xl'
              }`}>
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
                      ? "text-blue-600 font-bold"
                      : isScrolled
                        ? "text-gray-800 hover:text-blue-600"
                        : "text-white hover:text-cyan-300 drop-shadow-md"
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
                  className={`transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold ${
                    isScrolled
                      ? 'border-blue-600 text-white bg-blue-600 hover:bg-blue-700'
                      : 'border-white/50 text-white bg-blue-600/80 hover:bg-blue-600 drop-shadow-lg backdrop-blur'
                  }`}
                >
                  Admin
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`md:hidden p-2 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 relative group ${
                isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                {/* Background glow effect on hover */}
                <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
                  isScrolled
                    ? 'bg-blue-500/20 opacity-0 group-hover:opacity-100'
                    : 'bg-gradient-to-r from-blue-500/20 to-cyan-400/20 opacity-0 group-hover:opacity-100'
                }`} />
                <Menu 
                  size={24} 
                  className={`transition-all duration-300 absolute ${
                    isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                  } ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                />
                <X 
                  size={24} 
                  className={`transition-all duration-300 absolute ${
                    isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                  } ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile nav */}
          {isOpen && (
            <div 
              className={`md:hidden py-6 border-t transition-all duration-300 ${
                isScrolled
                  ? 'border-gray-200/50 bg-white/95 backdrop-blur-lg shadow-lg'
                  : 'border-border/50 bg-gradient-to-b from-background/98 via-background/95 to-background/90 backdrop-blur-xl shadow-2xl'
              }`}
              style={{
                animation: 'slideInDown 0.4s ease-out',
                background: isScrolled
                  ? 'rgba(255, 255, 255, 0.95)'
                  : 'linear-gradient(180deg, var(--background) 0%, rgba(59, 130, 246, 0.03) 50%, var(--background) 100%)',
              }}
            >
              <div className="flex flex-col space-y-3 px-2">
                {/* Header */}
                {navItems.length > 0 && (
                  <div className="px-2 py-2 mb-2 border-b pb-3" style={{
                    borderColor: isScrolled ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
                  }}>
                    <p className={`text-xs font-bold uppercase tracking-widest ${
                      isScrolled ? 'text-blue-600' : 'text-blue-400'
                    }`}>Navigation Menu</p>
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
                        : isScrolled
                          ? "text-gray-800 hover:text-blue-600 hover:scale-105 active:scale-95"
                          : "text-white hover:text-cyan-300 hover:scale-105 active:scale-95 drop-shadow-md"
                    }`}
                    style={{
                      animation: isOpen ? `slideInDown 0.4s ease-out forwards` : 'none',
                      animationDelay: `${index * 0.05 + 0.1}s`
                    }}
                  >
                    {/* Background hover effect */}
                    {!isActive(item.path) && (
                      <div className={`absolute inset-0 transition-all duration-300 rounded-xl ${
                        isScrolled
                          ? 'bg-blue-500/10 opacity-0 group-hover:opacity-100'
                          : 'bg-gradient-to-r from-blue-600/10 to-cyan-400/10 opacity-0 group-hover:opacity-100'
                      }`} />
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
                <div className={`my-2 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent ${
                  isScrolled ? 'via-gray-300/50' : 'via-border/50'
                }`} />

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
                      className={`w-full transition-all duration-300 transform hover:scale-105 active:scale-95 text-white font-semibold py-3 h-auto rounded-xl group ${
                        isScrolled
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:shadow-lg hover:shadow-purple-500/40'
                      }`}
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
                <div className={`px-4 pt-4 mt-2 text-center text-xs border-t pt-4 ${
                  isScrolled
                    ? 'text-gray-500/50 border-gray-200/20'
                    : 'text-muted-foreground/50 border-border/20'
                }`}>
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
