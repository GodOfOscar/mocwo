import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import PAPS from "@/assets/paps.jpeg";
import hero5 from "@/assets/hero5.jpeg";
import hero1 from "@/assets/hero1.jpeg";
import hero3 from "@/assets/hero3.jpeg";
import hero6 from "@/assets/hero6.jpg";
import p1_1 from "@/assets/p1 (1).jpg";
import p1_2 from "@/assets/p1 (2).jpg";
import p1_3 from "@/assets/p1 (3).jpg";
import p1_6 from "@/assets/p1 (6).jpg";
import p1_7 from "@/assets/p1 (7).jpg";
import p1_8 from "@/assets/p1 (8).jpg";
import p1_9 from "@/assets/p1 (9).jpg";
import p1_10 from "@/assets/p1 (10).jpg";
import p1_11 from "@/assets/p1 (11).jpg";
import p1_12 from "@/assets/p1 (12).jpg";
import p1_13 from "@/assets/p1 (13).jpg";
import p1_14 from "@/assets/p1 (14).jpg";
import p1_15 from "@/assets/p1 (15).jpg";
import p1_16 from "@/assets/p1 (16).jpg";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, CheckCircle, Sparkles, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

const FlipCard = ({ point }: { point: { year: string; title: string; description: string; icon: string; image: string } }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="h-80 cursor-pointer perspective"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full bg-white rounded-lg shadow-lg p-8 flex flex-col justify-center items-center border-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-5xl font-bold text-white mb-4">{point.year}</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{point.title}</h3>
          <p className="text-gray-600 text-center text-sm leading-relaxed">{point.description}</p>
          <div className="mt-4 text-xs text-gray-400 font-semibold">Click to flip</div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full rounded-lg shadow-lg overflow-hidden relative"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <img 
            src={point.image} 
            alt={point.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-6">
            <p className="text-white text-center font-semibold text-sm leading-relaxed px-4">
              {point.year === "2000" && "Started with vision and faith"}
              {point.year === "2010" && "Grew across continents"}
              {point.year === "2024" && "Transforming millions globally"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const carouselImages = [p1_1, p1_2, p1_3, p1_6, p1_7, p1_8, p1_9, p1_10, p1_11, p1_12, p1_13, p1_14, p1_15, p1_16];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(nextImage, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  return (
    <div 
      className="inline-block float-left mr-8 mb-4 w-full md:w-96 md:h-96 rounded-lg overflow-hidden shadow-2xl md:mb-0 relative group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      style={{
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)"
      }}
    >
      <style>{`
        @keyframes bounceSpring {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          50% {
            transform: scale(1.02);
          }
          70% {
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .carousel-image {
          animation: bounceSpring 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .carousel-btn {
          animation: slideIn 0.4s ease-out forwards;
        }
        .carousel-btn:nth-child(2) {
          animation: slideInLeft 0.4s ease-out forwards;
        }
      `}</style>

      <img 
        key={currentIndex}
        src={carouselImages[currentIndex]} 
        alt="Journey carousel" 
        className="carousel-image w-full h-full object-cover" 
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Previous Button */}
      <button
        onClick={prevImage}
        className="carousel-btn absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-300 z-10 hover:scale-110 hover:shadow-lg active:scale-95"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Next Button */}
      <button
        onClick={nextImage}
        className="carousel-btn absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-300 z-10 hover:scale-110 hover:shadow-lg active:scale-95"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {carouselImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setIsAutoPlay(false);
            }}
            className={`rounded-full transition-all duration-500 cursor-pointer ${
              idx === currentIndex 
                ? "bg-white w-8 h-2 shadow-lg" 
                : "bg-white/50 w-2 h-2 hover:bg-white/75 hover:scale-125"
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Indicator */}
      {isAutoPlay && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/70 px-3 py-1 rounded-full text-xs font-semibold text-gray-700 backdrop-blur-sm animate-pulse">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Auto
        </div>
      )}
    </div>
  );
};

const About = () => {
  const [scrollY, setScrollY] = useState(0);

  const parallax = (factor: number) => `translateY(${scrollY * factor}px)`;
  const parallaxOpposite = (factor: number) => `translateY(-${scrollY * factor}px)`;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const storyPointsData = [
    { year: "2000", title: "Foundation Year", description: "Established with a mission to spread God's love globally", icon: "🌱", image: p1_1 },
    { year: "2010", title: "Growth Expansion", description: "Opened branches across multiple African countries", icon: "🌍", image: p1_6 },
    { year: "2024", title: "Global Impact", description: "Impacting millions through digital and physical ministry", icon: "✨", image: p1_7 },
  ];

  const visionPoints = [
    "A non-denominational movement of evangelical Christians in the world",
    "Strong passion for soulwinning and discipleship",
    "Producing disciples with godly impact in the world",
    "Responsible leadership in all spheres of life"
  ];

  const missionPoints = [
    "Empower youth and adults as effective witnesses of Christ",
    "Equip believers to live as agents of change",
    "Transform churches, campuses, and communities",
    "Impact nations and the world for God's kingdom"
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes textReveal {
          0% { opacity: 0; background-position: 200% center; }
          100% { opacity: 1; background-position: 0% center; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
        .text-gradient-animated { 
          background: linear-gradient(90deg, #0369a1, #06b6d4, #0369a1);
          background-size: 200% center;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textReveal 2s ease-in-out infinite;
        }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-8px); }
      `}</style>

      {/* Hero Section with Gradient Overlay */}
      <section className="relative min-h-[110vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${hero5})`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-cyan-700/60" />
        
        {/* Accent gradients */}
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl"
          style={{ transform: `${parallax(0.1)} scale(1.08)` }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl"
          style={{ transform: `${parallaxOpposite(0.08)} scale(1.05)` }}
        />

        <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="animate-fade-in-down mb-6" style={{ transform: `${parallaxOpposite(0.02)}` }}>
              <div className="inline-block px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/30 mb-6 hover:bg-white/25 transition-all duration-300">
                <span className="text-sm font-semibold text-cyan-200">WELCOME TO OUR STORY</span>
              </div>
            </div>

            {/* <p className="text-cyan-300 font-semibold uppercase tracking-widest text-sm mb-4">WELCOME TO OUR STORY</p> */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">20+ Years of Impact</h1>

            <p className="animate-fade-in-up text-xl md:text-2xl opacity-95 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Transforming lives, empowering communities, and building a legacy of faith across continents
            </p>

            <div className="animate-fade-in-up flex justify-center">
              <Button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold px-10 py-7 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Link to="/partnership">Partner With Us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white">
          <span className="text-xs uppercase tracking-[0.35em] mb-2 text-white/80">Scroll</span>
          <div className="w-10 h-10 rounded-full border border-white/60 bg-white/10 backdrop-blur-xl flex items-center justify-center animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-white">
              <path fill="currentColor" d="M12 16.5l-6-6 1.4-1.4L12 13.7l4.6-4.6 1.4 1.4z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <ScrollReveal className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Story</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              <p></p>
              From humble beginnings to global impact, our journey is marked by faith, dedication, and God's grace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storyPointsData.map((point, idx) => (
              <FlipCard key={idx} point={point} />
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Early Beginning Section */}
      <ScrollReveal className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ImageCarousel />
          
          <div>
            <div className="inline-block px-4 py-2 bg-cyan-100 rounded-full mb-6">
              <p className="text-sm font-semibold text-cyan-700">Our Journey</p>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Early Beginning to Today
            </h2>
            
            <div className="space-y-4 mb-8 text-gray-700">
              <p className="text-lg leading-relaxed">
                The passion began in the early years of the 90's when Rev. Prince had a divine visitation and his assignment unfolded unto him. He didn't start active ministry until 2005 when he was appointed as the National School's Mission Coordinator of the International School of Prayer Incorporated (ISOPI), where he served under Papa Manasseh Wesley.
              </p>
              
              <p className="text-lg leading-relaxed">
                In 2008, he was given the right hand of fellowship to start a new campus outreach ministry called Martyrs of Christ Youth Network, which became Martyrs of Christ World Outreach in 2016. That same year, Father's Heart Chapel International was established, becoming the discipleship hub for souls reached out to and the embassy for training missionaries to various campuses and villages.
              </p>
              
              <p className="text-lg leading-relaxed">
                What began as a passionate call to evangelism and discipleship has grown into a dynamic ministry impacting lives across Ghana through church planting, community outreach, and missions to schools and remote communities. The ministry has expanded across nine regions in Ghana, establishing a strong presence in the Northern, Middle, and Southern belts, and has extended its footprints beyond Ghana to the USA and Canada.
              </p>
              
              <p className="text-lg leading-relaxed">
                Through these efforts, more than a million souls have been reached over the past two decades. Rev. Prince has raised and mentored many leaders now leading churches and non-denominational movements across the world. His ministry's philanthropic activities have helped pay school fees for brilliant but needy converts, shaping great destinies for the Kingdom of God. His teaching ministry has also birthed student entrepreneurs, helping them gain grounds for self-sufficiency through self-employment.
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {["Impacting millions across continents", "Established in over 9 regions in Ghana", "Global presence in USA, Canada, and beyond"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="clear-both"></div>
        </div>
      </ScrollReveal>

      {/* Visionary Leaders Section */}
      <ScrollReveal className="py-20 bg-gradient-to-r from-blue-900 to-blue-800 text-white relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Driven by Visionary Leaders</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Led by experienced ministers with a proven track record of kingdom impact and spiritual leadership
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-cyan-400 hover:bg-cyan-500 text-blue-900 font-bold px-8 py-6 text-lg">
              <Link to="/leadership">Meet Our Leaders</Link>
            </Button>
            {/* <Button className="bg-white/20 hover:bg-white/30 text-white border border-white font-bold px-8 py-6 text-lg">
              Learn More
            </Button> */}
          </div>
        </div>
      </ScrollReveal>

      {/* Vision & Mission Section */}
      <ScrollReveal className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision */}
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 mb-6">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <ul className="space-y-4">
                {visionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mission */}
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-100 mb-6">
                <Target className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <ul className="space-y-4">
                {missionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Call to Action Section */}
      <ScrollReveal className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-cyan-600 shadow-2xl overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to start your journey?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of believers who are transforming their lives and impacting their communities through our ministry programs and services.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-blue-600 hover:bg-gray-50 font-bold px-8 py-6 text-lg">
                  <Link to="/membership">Get Started</Link>
                </Button>
                <Button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-6 text-lg border border-white">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollReveal>

      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
};

// Eye icon component
function Eye({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export default About;