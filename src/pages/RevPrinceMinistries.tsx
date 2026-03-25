import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Award, BookOpen, Users, Globe, Heart, Zap } from "lucide-react";

import hero2 from "@/assets/hero2.jpeg";
import rev1 from "@/assets/rev1.jpeg";

export default function RevPrinceMinistries() {
  const stats = [
    { label: "Years of Ministry", value: "20+", icon: Award },
    { label: "Nations Reached", value: "50+", icon: Globe },
    { label: "Leaders Trained", value: "1000+", icon: Users },
    { label: "Lives Impacted", value: "100K+", icon: Heart },
  ];

  const ministries = [
    { 
      title: "Prophetic & Healing", 
      desc: "Deliverance, healing, and prophetic direction through the Holy Spirit",
      icon: Zap,
      color: "from-red-500 to-pink-500"
    },
    { 
      title: "Teaching & Discipleship", 
      desc: "Transformative teachings, mentorship, and spiritual development",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Outreach & Missions", 
      desc: "Evangelistic crusades, rural missions, and international ministry",
      icon: Globe,
      color: "from-green-500 to-emerald-500"
    },
    { 
      title: "Media & Broadcast", 
      desc: "Online services, TV broadcasts, podcasts, and digital evangelism",
      icon: Zap,
      color: "from-purple-500 to-indigo-500"
    },
    { 
      title: "Leadership Network", 
      desc: "Training and empowering pastors and leaders globally",
      icon: Users,
      color: "from-orange-500 to-red-500"
    },
    { 
      title: "Youth Programs", 
      desc: "Youth revival, capacity building, and talent development",
      icon: Heart,
      color: "from-pink-500 to-rose-500"
    },
  ];

  const timeline = [
    { year: 2004, event: "Called into full-time ministry", scripture: "Jeremiah 1:5" },
    { year: 2006, event: "Started first outreach programs", scripture: "Matthew 28:19-20" },
    { year: 2010, event: "Faced hardships but remained faithful", scripture: "Philippians 4:19" },
    { year: 2015, event: "Launched international missions", scripture: "Acts 1:8" },
    { year: 2020, event: "20 years of ministry impact", scripture: "2 Timothy 4:7" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-16">

      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0">
          <img
            src={hero2}
            alt="Rev Prince Ministries"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/70 to-indigo-900/80" />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 z-10">
          <div className="mb-6 animate-fade-in-down">
            <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
              <p className="text-sm font-semibold text-blue-200">Global Ministry Leader</p>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight animate-fade-in-up">
            Rev. Prince <br className="hidden md:block" /> Ministries
          </h1>
          <p className="max-w-2xl mt-4 text-lg md:text-xl text-blue-100 font-light leading-relaxed animate-fade-in-up" style={{animationDelay: "0.1s"}}>
            20 Years of Endurance, Sacrifice, and Unwavering Faith. A life dedicated to transforming lives and raising Kingdom leaders.
          </p>
          <div className="mt-8 flex gap-4 animate-fade-in-up" style={{animationDelay: "0.2s"}}>
            <Button asChild size="lg" className="bg-white text-blue-900 font-bold hover:bg-blue-50 transition-all hover:scale-105">
              <Link to="/contact">Get In Touch</Link>
            </Button>
            <Button asChild size="lg" className="bg-blue-600/50 backdrop-blur text-white font-bold border border-white/30 hover:bg-blue-600 transition-all">
              <Link to="/partnership">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center text-white">
                  <div className="flex justify-center mb-3">
                    <Icon className="w-8 h-8 text-blue-200" />
                  </div>
                  <p className="text-3xl md:text-4xl font-black">{stat.value}</p>
                  <p className="text-sm md:text-base text-blue-100 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur opacity-30" />
              <img 
                src={rev1} 
                alt="Rev. Prince" 
                className="relative rounded-3xl shadow-2xl object-cover w-full h-96 md:h-full"
              />
            </div>
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                About The Leader
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Rev. Prince
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                For over two decades, Rev. Prince has walked a path of trials, rejection, and relentless pursuit of God's mandate. From humble beginnings, facing opposition and financial struggles, he has remained steadfast in his calling.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Every tear, every sleepless night in prayer, and every sacrifice has forged a man of spiritual depth and resilience. His journey reflects a life surrendered to God, proving that endurance, faith, and obedience birth lasting impact.
              </p>
              <blockquote className="border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 rounded italic text-gray-800 font-semibold text-lg">
                "I have seen God's faithfulness in the wilderness, and His power transforms even the smallest acts of obedience into eternal impact."
              </blockquote>
              <div className="mt-8 flex gap-4">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg">
                  <Link to="/contact">Invite For Ministry</Link>
                </Button>
                <Button asChild variant="outline" className="px-8 py-3 rounded-lg font-bold">
                  <Link to="/partnership">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Journey of a Servant</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">20 Years of faithfulness, growth, and ministry transformation</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-6 mb-8 relative">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {idx + 1}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="w-1 h-24 bg-gradient-to-b from-blue-400 to-transparent mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-600">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-black text-blue-600">{item.year}</h3>
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{item.scripture}</span>
                    </div>
                    <p className="text-lg text-gray-800 font-semibold">{item.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-Ministries */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Ministry Domains</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Six pillars of spiritual impact and transformation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, idx) => {
              const Icon = ministry.icon;
              return (
                <div key={idx} className="group relative">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${ministry.color} rounded-2xl blur opacity-25 group-hover:opacity-100 transition-all duration-300`} />
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${ministry.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{ministry.title}</h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">{ministry.desc}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                        Learn More →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Invitation Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Invite Rev. Prince</h2>
          <p className="max-w-3xl mx-auto text-lg text-blue-100 mb-10 leading-relaxed">
            For conferences, crusades, church programs, leadership training, and international ministry events — invite Rev. Prince for a life-transforming encounter filled with power and revelation.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-700 font-bold px-10 py-4 hover:bg-blue-50 transition-all hover:scale-105 shadow-2xl">
            <Link to="/contact">Make An Invitation</Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: "Location", info: "Accra, Ghana" },
              { icon: Phone, title: "Phone", info: "+233 24 352 7174" },
              { icon: Mail, title: "Email", info: "revprince@ministries.org" },
            ].map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <div key={idx} className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:border-blue-400 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{contact.title}</h3>
                  <p className="text-gray-700 font-semibold">{contact.info}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:shadow-lg">
              <Link to="/contact">Send A Message</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Rev Prince Ministries</h3>
              <p className="text-gray-400">A global mandate bringing transformation, healing, empowerment, and prophetic direction to nations.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { name: "Home", link: "/" },
                  { name: "FHC", link: "/fhc" },
                  { name: "Partnership", link: "/partnership" },
                  { name: "Contact", link: "/contact" },
                ].map((i) => (
                  <li key={i.link}>
                    <Link to={i.link} className="text-gray-400 hover:text-blue-400 transition-colors">
                      {i.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📍 Accra, Ghana</li>
                <li>📞 +233 24 352 7174</li>
                <li>📧 revprince@ministries.org</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Rev. Prince Ministries. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
