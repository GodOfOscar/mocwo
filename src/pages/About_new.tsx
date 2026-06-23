import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PAPS from "@/assets/paps.jpeg";
import hero5 from "@/assets/hero5.jpeg";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, CheckCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const About = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const storyPoints = [
    { year: "2000", title: "Foundation Year", description: "Established with a mission to spread God's love globally", icon: "🌱" },
    { year: "2010", title: "Growth Expansion", description: "Opened branches across multiple African countries", icon: "🌍" },
    { year: "2024", title: "Global Impact", description: "Impacting millions through digital and physical ministry", icon: "✨" },
  ];

  const visionPoints = [
    "Empower believers with God's word",
    "Build strong communities of faith",
    "Reach the unreached with Gospel",
    "Transform nations for God's kingdom"
  ];

  const missionPoints = [
    "Preach the Gospel with power",
    "Nurture spiritual growth",
    "Serve the vulnerable and needy",
    "Establish sustainable ministry"
  ];

  return (
    <div className="min-h-screen pt-16 bg-white overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .text-white { 
          background: linear-gradient(90deg, #0369a1, #06b6d4, #0369a1);
          background-size: 200% center;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease-in-out infinite;
        }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-12px); }
        .shimmer-effect { animation: shimmer 2s ease-in-out infinite; }
      `}</style>

      {/* Hero Section with Gradient Overlay & Parallax */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${hero5})`,
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        />
        
        {/* Multi-layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/75 to-cyan-800/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/40" />
        
        {/* Animated accent gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="animate-fade-in-down mb-6" style={{ animationDelay: "0.1s" }}>
              <div className="inline-block px-6 py-3 bg-white/15 backdrop-blur-xl rounded-full border border-white/40 mb-8 hover:bg-white/25 transition-all duration-300 cursor-pointer group">
                <span className="text-sm font-bold text-cyan-200 group-hover:text-cyan-100 transition-colors">✨ WELCOME TO OUR STORY</span>
              </div>
            </div>

            <h1 className="animate-fade-in-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight" style={{ animationDelay: "0.2s" }}>
              20<sup className="align-super text-5xl sm:text-6xl text-white font-bold">+</sup>
              <span className="text-white"> Years of Impact</span>
            </h1>

            <p className="animate-fade-in-up text-lg md:text-xl lg:text-2xl opacity-95 max-w-3xl mx-auto mb-12 leading-relaxed font-light tracking-wide" style={{ animationDelay: "0.3s" }}>
              Transforming lives, empowering communities, and building a lasting legacy of faith across continents
            </p>

            <div className="animate-fade-in-up flex flex-col sm:flex-row gap-6 justify-center" style={{ animationDelay: "0.4s" }}>
              <Button className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-500 hover:via-cyan-600 hover:to-blue-600 text-white font-bold px-12 py-7 text-lg shadow-2xl hover:shadow-cyan-500/50 hover:scale-110 transition-all duration-300 rounded-lg">
                <Link to="/partnership">Partner With Us</Link>
              </Button>
              <Button className="bg-white/20 hover:bg-white/35 text-white font-bold px-12 py-7 text-lg border-2 border-white/60 backdrop-blur-lg hover:scale-110 transition-all duration-300 rounded-lg">
                Explore More
              </Button>
            </div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2 text-white">
            <span className="text-sm font-bold opacity-80">Scroll to Discover</span>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Our Story Timeline Section */}
      <section className="py-32 bg-gradient-to-b from-white via-blue-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-200/25 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/25 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="animate-fade-in-down text-5xl md:text-6xl lg:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-700" style={{ animationDelay: "0s" }}>
              Our Journey
            </h2>
            <p className="animate-fade-in-up text-xl text-gray-600 max-w-2xl mx-auto font-light" style={{ animationDelay: "0.2s" }}>
              From humble beginnings to global impact, our story is marked by faith, dedication, and God's grace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {storyPoints.map((point, idx) => (
              <div 
                key={idx} 
                className="animate-scale-in hover-lift group"
                style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-blue-50 to-cyan-50 overflow-hidden h-full group-hover:shadow-2xl group-hover:border-cyan-200 transition-all duration-300">
                  <CardContent className="p-10">
                    <div className="relative mb-6">
                      <div className="text-7xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-cyan-600 to-blue-600 group-hover:scale-110 transition-transform duration-300">
                        {point.year}
                      </div>
                      <div className="text-5xl shimmer-effect">{point.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors">{point.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-light text-base">{point.description}</p>
                    <div className="mt-6 h-1.5 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500 rounded-full" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Early Beginning Section with Image */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image - Right on Desktop */}
            <div className="animate-slide-in-left order-2 lg:order-1 relative group" style={{ animationDelay: "0s" }}>
              <div className="relative h-96 lg:h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img src={PAPS} alt="Early Beginning" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-cyan-700/30 group-hover:from-blue-900/10 group-hover:to-cyan-700/10 transition-all duration-500" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-tr from-cyan-400/30 to-blue-400/30 rounded-full blur-2xl" />
            </div>

            {/* Content - Left on Desktop */}
            <div className="animate-slide-in-right order-1 lg:order-2" style={{ animationDelay: "0.2s" }}>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full mb-6 border border-cyan-300">
                <p className="text-sm font-bold text-cyan-700">OUR HERITAGE</p>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-8 text-gray-900 leading-tight">
                From Small Beginnings to <span className="text-white">Global Purpose</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                What began as a group of committed believers now touches lives across multiple continents. Our foundation is built on biblical principles, community service, and an unwavering vision to advance God's kingdom.
              </p>
              <ul className="space-y-6 mb-10">
                {["Founded on unshakeable Biblical principles", "Rooted in authentic community service", "Driven by kingdom vision and excellence"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 group/item">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 group-hover/item:scale-125 transition-transform">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-lg text-gray-700 font-medium group-hover/item:text-cyan-700 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visionary Leaders Section */}
      <section className="py-32 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="animate-fade-in-down text-5xl md:text-6xl font-black mb-6">Driven by Visionary Leadership</h2>
            <p className="animate-fade-in-up text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light">
              Led by experienced leaders with proven track records in kingdom advancement and spiritual transformation
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button className="bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-500 hover:to-cyan-400 text-blue-900 font-bold px-12 py-6 text-lg hover:shadow-xl hover:shadow-cyan-400/50 hover:scale-110 transition-all duration-300 rounded-lg">
              <Link to="/leadership">Meet Our Leaders</Link>
            </Button>
            <Button className="bg-white/20 hover:bg-white/35 text-white border-2 border-white/60 font-bold px-12 py-6 text-lg backdrop-blur-sm hover:scale-110 transition-all duration-300 rounded-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Vision */}
            <div className="animate-slide-in-left" style={{ animationDelay: "0s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 mb-8 group hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-8">Our Vision</h3>
              <ul className="space-y-5">
                {visionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4 group/item">
                    <CheckCircle className="w-7 h-7 text-cyan-600 flex-shrink-0 mt-1 group-hover/item:scale-125 transition-transform" />
                    <span className="text-lg text-gray-700 font-medium group-hover/item:text-cyan-700 transition-colors">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mission */}
            <div className="animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-200 mb-8 group hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-cyan-700" />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-8">Our Mission</h3>
              <ul className="space-y-5">
                {missionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-4 group/item">
                    <CheckCircle className="w-7 h-7 text-blue-600 flex-shrink-0 mt-1 group-hover/item:scale-125 transition-transform" />
                    <span className="text-lg text-gray-700 font-medium group-hover/item:text-blue-700 transition-colors">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 bg-gradient-to-b from-blue-50 via-cyan-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-3xl animate-pulse" />

        <div className="container mx-auto px-4 relative z-10">
          <Card className="border-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 shadow-2xl overflow-hidden">
            <CardContent className="p-12 md:p-20 text-center">
              <h2 className="animate-fade-in-up text-4xl md:text-5xl font-black text-white mb-6">Ready to Begin Your Journey?</h2>
              <p className="animate-fade-in-up text-lg md:text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Join thousands of believers transforming their lives and impacting communities through our ministry programs, services, and spiritual guidance.
              </p>
              <div className="animate-fade-in-up flex flex-col sm:flex-row justify-center gap-6">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-12 py-6 text-lg hover:shadow-xl hover:scale-110 transition-all duration-300 rounded-lg">
                  <Link to="/membership">Get Started Now</Link>
                </Button>
                <Button className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-12 py-6 text-lg border-2 border-white/40 hover:scale-110 transition-all duration-300 rounded-lg">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* About */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0s" }}>
              <h3 className="text-2xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Fathers Heart Chapel
              </h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Transforming lives through faith, worship, and service. Impacting nations for God's kingdom across the globe.
              </p>
            </div>

            {/* Quick Links */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Services", link: "/services" },
                  { name: "Live Stream", link: "/live" },
                  { name: "Partnership", link: "/partnership" },
                  { name: "Giving", link: "/give/offering" }
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.link} className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 font-medium hover:translate-x-1 inline-block">
                      → {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-xl font-bold mb-6 text-white">Contact</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <span>+233 24 352 7174</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <a href="mailto:info@fathersheart.org" className="hover:text-cyan-400 transition-colors">
                    info@fathersheart.org
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <span>Kumasi, Ghana & Global</span>
                </li>
              </ul>

              <div className="flex gap-4 mt-8">
                {[
                  { icon: Facebook, link: "#" },
                  { icon: Instagram, link: "#" },
                  { icon: Youtube, link: "#" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 transition-all duration-300 text-white hover:scale-125"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Martyrs Of Christ World Outreach. All rights reserved.
              </p>
              <p className="text-sm text-gray-500">
                Transforming Lives • Impacting Nations • Serving God
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
