import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  gradient?: string;
  location?: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
  showContent?: boolean;
  cardMode?: boolean;
}

const HeroCarousel = ({ 
  slides, 
  autoPlay = true, 
  interval = 5000, 
  showContent = true,
  cardMode = false 
}: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoPlay || !cardMode) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length, cardMode]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    if (touchStart - touchEnd > 50) nextSlide();
    if (touchEnd - touchStart > 50) prevSlide();
  };

  if (slides.length === 0) return null;

  // Card Opening Mode - Hero image + stacked cards
  if (cardMode) {
    const visibleCards = 3; // Number of cards visible in the stack
    const getCardRotation = (index: number): number => {
      const relativeIndex = (index - currentSlide + slides.length) % slides.length;
      if (relativeIndex === 0) return 0;
      if (relativeIndex === 1) return 8;
      if (relativeIndex === 2) return 16;
      return 24;
    };

    const getCardOpacity = (index: number): number => {
      const relativeIndex = (index - currentSlide + slides.length) % slides.length;
      if (relativeIndex === 0) return 1;
      if (relativeIndex === 1) return 0.85;
      if (relativeIndex === 2) return 0.7;
      return 0;
    };

    const getCardScale = (index: number): number => {
      const relativeIndex = (index - currentSlide + slides.length) % slides.length;
      if (relativeIndex === 0) return 1;
      if (relativeIndex === 1) return 0.95;
      if (relativeIndex === 2) return 0.9;
      return 0.85;
    };

    const getCardTranslateY = (index: number): number => {
      const relativeIndex = (index - currentSlide + slides.length) % slides.length;
      return relativeIndex * 20;
    };

    return (
      <div 
        className="relative w-full min-h-screen md:h-screen overflow-hidden bg-gray-900"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <style>{`
          @keyframes slideInFromLeft {
            from {
              opacity: 0;
              transform: translateX(-100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes cardOpen {
            from {
              opacity: 0;
              transform: scale(0.9) rotateY(45deg);
            }
            to {
              opacity: 1;
              transform: scale(1) rotateY(0deg);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .hero-text-animate {
            animation: slideInFromLeft 0.8s ease-out forwards;
          }

          .hero-subtitle {
            animation: slideInFromLeft 0.8s ease-out 0.1s forwards;
            opacity: 0;
          }

          .hero-title {
            animation: slideInFromLeft 0.8s ease-out 0.2s forwards;
            opacity: 0;
          }

          .hero-description {
            animation: slideInFromLeft 0.8s ease-out 0.3s forwards;
            opacity: 0;
          }

          .hero-cta {
            animation: slideInFromLeft 0.8s ease-out 0.4s forwards;
            opacity: 0;
          }

          .card-stack {
            perspective: 1200px;
          }

          .stack-card {
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            transform-origin: center;
          }

          .stack-card.active {
            z-index: 30;
          }

          .pagination-dot {
            transition: all 0.3s ease;
          }
        `}</style>

        <div className="relative w-full h-full flex flex-col md:flex-row">
          {/* Hero Image Section - Full Background */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover transition-all duration-1000"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent md:from-black/40 md:via-transparent md:to-black/60" />
          </div>

          {/* Info + Cards Section - Overlay */}
          <div className="relative w-full h-full flex flex-col justify-center p-6 md:p-12 z-10 md:w-3/5">
            {/* Text Content */}
            <div className="mb-8 md:mb-12 max-w-md">
              <p className="hero-subtitle text-xs md:text-sm uppercase tracking-widest text-orange-400 font-mono mb-2">
                {slides[currentSlide].location || "Featured"}
              </p>
              
              <div className="mb-4">
                <h1 className="hero-title text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-2 break-words">
                  {slides[currentSlide].title}
                </h1>
                <h2 className="hero-subtitle text-xl md:text-2xl text-orange-400 font-bold">
                  {slides[currentSlide].subtitle}
                </h2>
              </div>

              <p className="hero-description text-sm md:text-base text-gray-200 leading-relaxed mb-6 line-clamp-3">
                {slides[currentSlide].description}
              </p>

              <button
                onClick={() => navigate(slides[currentSlide].ctaLink)}
                className="hero-cta inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {slides[currentSlide].ctaText}
                <span className="text-lg">→</span>
              </button>
            </div>

            {/* Stacked Cards */}
            <div className="relative h-40 md:h-56 card-stack mt-8 md:mt-auto mb-8">
              {slides.map((slide, index) => {
                const rotation = getCardRotation(index);
                const opacity = getCardOpacity(index);
                const scale = getCardScale(index);
                const translateY = getCardTranslateY(index);
                const isVisible = opacity > 0;

                if (!isVisible) return null;

                const isActive = index === currentSlide;

                return (
                  <div
                    key={`card-${slide.id}`}
                    className={`stack-card ${isActive ? "active" : ""} absolute w-48 md:w-64 h-40 md:h-48 rounded-xl overflow-hidden shadow-2xl cursor-pointer group`}
                    style={{
                      opacity,
                      transform: `translateY(${translateY}px) scale(${scale}) rotateZ(${rotation}deg)`,
                      right: `${rotation * 4}px`,
                    }}
                    onClick={() => goToSlide(index)}
                  >
                    {/* Card Image */}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Card Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 group-hover:to-black/90 transition-all duration-300" />

                    {/* Card Content */}
                    <div className={`absolute inset-x-0 bottom-0 p-4 text-white transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-60 group-hover:opacity-90"
                    }`}>
                      <h3 className="font-bold text-lg md:text-xl line-clamp-2">
                        {slide.title}
                      </h3>
                      <p className="text-xs md:text-sm text-orange-300 font-semibold">
                        {slide.subtitle}
                      </p>
                      {isActive && (
                        <div className="mt-2 pt-2 border-t border-orange-400/30">
                          <p className="text-xs text-gray-200 line-clamp-1">
                            {slide.location}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Active Badge */}
                    {isActive && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-4 md:mt-auto">
              <button
                onClick={prevSlide}
                className="p-2 md:p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} className="md:w-6 md:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 md:p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                aria-label="Next slide"
              >
                <ChevronRight size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2 md:gap-3 mt-6">
              {slides.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => goToSlide(index)}
                  className={`pagination-dot rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-orange-500 w-3 h-3 md:w-4 md:h-4"
                      : "bg-white/40 hover:bg-white/60 w-2 h-2 md:w-3 md:h-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <p className="text-xs md:text-sm text-white/70 mt-4 font-mono">
              {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Original Full-screen Mode (fallback)
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {typeof slide.image === "string" && slide.image.endsWith(".mp4") ? (
              <video
                className="absolute inset-0 w-full h-full object-cover max-w-full"
                src={slide.image}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${slide.image}")` }}
              />
            )}

            <div className="absolute inset-0 bg-black/40" />

            {slide.gradient && (
              <div
                className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-70`}
              />
            )}

            {showContent && (
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-sm font-medium uppercase tracking-wider mb-4 opacity-80">
                      {slide.subtitle}
                    </h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/20 hover:bg-background/30 text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/20 hover:bg-background/30 text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-secondary scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
