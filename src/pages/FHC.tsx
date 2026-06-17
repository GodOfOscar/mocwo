import { useState } from "react";
import { Menu, X, Play, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import hero2 from "@/assets/hero2.jpeg";
import hero3 from "@/assets/hero3.jpeg";
import hero5 from "@/assets/hero5.jpeg";
import hero4 from "@/assets/hero4.jpeg";
import logo from "@/assets/logo.jpg";
import PAPS from "@/assets/paps.jpeg";
import { Link } from "react-router-dom";
import PO from "@/assets/po.jpeg";
import PK from "@/assets/pk.jpeg";
import SC from "@/assets/sc.jpeg";

export default function Fhc() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mediaExperts = [
    { name: "Pastor Oscar", role: "Media Head", image: PO, bio: "Oversees all media operations." },
    { name: "Pastor Kwame", role: "Senior Editor/Designer", image: PK, bio: "Captures moments from services and outreach programs." },
    { name: "Pastor Clinton", role: "Digital Media Manager", image: SC, bio: "Produces live streams and highlight videos." },
  ];

  const mediaSamples = [
    { title: "Sunday Service Highlights", image: hero2, type: "video", link: "/media/sunday-service" },
    { title: "Watch Night Highlights", image: hero4, type: "video", link: "/media/watch-night" },
    { title: "Atwea Camps", image: hero5, type: "image", link: "/media/atwea-camps" },
    { title: "Others", image: hero3, type: "image", link: "/media/others" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FHC" className="w-12 h-12 rounded-full object-cover shadow max-w-full" />
            <div>
              <div className="text-sm font-medium">FATHERS HEART CHAPEL</div>
              <div className="text-xs text-slate-500">Martyrs Of Christ World Outreach</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="/" className="py-2 px-3 rounded hover:bg-slate-100 transition">Home</a>
            <a href="/about" className="py-2 px-3 rounded hover:bg-slate-100 transition">About</a>
            <a href="/services" className="py-2 px-3 rounded hover:bg-slate-100 transition">Services</a>
            <a href="/community" className="py-2 px-3 rounded hover:bg-slate-100 transition">Community</a>
            <a href="/give/partner" className="py-2 px-4 rounded-full bg-amber-400 text-slate-900 font-semibold hover:shadow-lg transition">Partner</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <a href="/give/offering" className="hidden md:inline-block text-sm bg-slate-900 text-white px-4 py-2 rounded hover:opacity-95">Give</a>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
            <a href="/" className="py-2 px-3 rounded hover:bg-slate-100">Home</a>
            <a href="/about" className="py-2 px-3 rounded hover:bg-slate-100">About</a>
            <a href="/services" className="py-2 px-3 rounded hover:bg-slate-100">Services</a>
            <a href="/community" className="py-2 px-3 rounded hover:bg-slate-100">Community</a>
            <a href="/give/partner" className="py-2 px-3 rounded hover:bg-slate-100">Partner</a>
          </div>
        )}
      </header>

      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 py-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:flex sm:flex-row gap-4 items-center justify-center">
          <a href="/give/offering" className="px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">Offering</a>
          <a href="/give/seed" className="px-5 py-3 rounded-lg bg-amber-400 text-slate-900 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">Seed</a>
          <a href="/give/tithe" className="px-5 py-3 rounded-lg bg-teal-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">Tithe</a>
          <a href="/give/partner" className="px-5 py-3 rounded-lg bg-yellow-400 text-slate-900 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">Partner Now</a>
        </div>
      </div>

      <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28 grid md:grid-cols-2 gap-6 sm:gap-12 items-center">
          <div className="space-y-6">
            <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm">The Global Apostle</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-slate-900">Rev. Prince Appau Bediako</h1>
            <p className="text-slate-600 max-w-xl text-lg leading-relaxed">A ministry dedicated to transforming lives through passionate preaching, community outreach, and faithful service. Join us to experience revival and impact.</p>
            <div className="flex flex-wrap gap-4 mt-6">
              <a href="/live" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">Watch Live</a>
              <a href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-900 font-semibold hover:border-amber-400 hover:bg-amber-50 transition-all duration-200">Learn More</a>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-200">
              <div className="group">
                <p className="text-3xl font-bold text-slate-900">40K+</p>
                <p className="text-sm text-slate-500 font-medium">Members Worldwide</p>
              </div>
              <div className="group">
                <p className="text-3xl font-bold text-slate-900">120+</p>
                <p className="text-sm text-slate-500 font-medium">Outreach Programs</p>
              </div>
            </div>
          </div>
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl group">
            <img src={hero2} alt="Hero Banner" className="w-full h-full object-cover max-w-full group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            <div className="absolute left-6 bottom-6 bg-white/95 backdrop-blur-sm rounded-lg p-4 text-slate-800 shadow-lg">
              <div className="font-semibold text-slate-900">Next Service</div>
              <div className="text-sm text-slate-600">Sunday • 10:00 AM</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Prayer For You</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Prayer For You</h3>
                  <p className="text-sm text-slate-500">Rev. Prince Appau Bediako • 11:06</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-lg bg-slate-900 text-white hover:shadow-lg transition-shadow"><Play size={16} /></button>
                  <button className="p-2 rounded-lg border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all">Download</button>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-1/3 rounded-full"></div>
              </div>

              <p className="text-slate-600 leading-relaxed text-base">A short devotional prayer to uplift and encourage. Listen to connect with God and receive His peace.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg shadow-md border border-slate-100 flex items-start gap-4 hover:shadow-lg hover:border-amber-200 transition-all duration-200 group cursor-pointer">
              <div className="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors"><Play size={16} className="text-amber-600" /></div>
              <div>
                <p className="font-semibold text-slate-900">Prayer For You</p>
                <p className="text-xs text-slate-500">Rev. Prince Appau Bediako • 11:06</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md border border-slate-100 flex items-start gap-4 hover:shadow-lg hover:border-amber-200 transition-all duration-200 group cursor-pointer">
              <img src={hero3} alt="Baro" className="w-14 h-14 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow max-w-full" />
              <div>
                <p className="font-semibold text-slate-900">Faith</p>
                <p className="text-xs text-slate-500">Rev. Prince Appau Bediako • 5:23</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-white via-slate-50 to-white px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-2">Our Leadership</p>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Rev. Prince & Prophetess Beatrice Appau Bediako</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-4"></div>
            </div>
            <p className="text-amber-600 font-semibold text-lg">An Inspiration To Millions Around The World</p>
            <p className="text-slate-700 leading-relaxed text-base">Widely known for school outreach and campus evangelism. Their ministry has impacted thousands with practical discipleship and compassion-driven programs.</p>
            <a href="/about" className="inline-block px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-900 font-semibold hover:border-amber-400 hover:bg-amber-50 transition-all duration-200">Read Their Story</a>
          </div>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl group">
            <img src={PAPS} alt="PAPA & MAMA" className="w-full h-full object-cover max-w-full group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl group order-2 md:order-1">
            <img src={hero5} alt="Partnership" className="w-full h-full object-cover max-w-full group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div>
              <p className="text-amber-300 font-semibold uppercase tracking-widest text-sm mb-2">Join Us</p>
              <h2 className="text-4xl font-bold mb-4">Partnership</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"></div>
            </div>
            <p className="text-slate-200 leading-relaxed text-base">Partnership with the FHC Global Network is about being part of something greater — supporting outreach, discipleship, and global ministry.</p>
            <a href="/give/partner" className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">Become a Partner</a>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-2">Watch & Listen</p>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Broadcast</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mt-4"></div>
            </div>
            <h3 className="text-xl text-slate-600 font-medium">Watch Rev. Prince's teachings online 24/7</h3>
            <div className="flex gap-4">
              <a href="https://www.youtube.com/@revprincebediakoappau/videos" className="px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">YOUTUBE</a>
              <a href="https://www.tiktok.com/@revprinceappaubediako" className="px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-900 font-semibold hover:border-amber-400 hover:bg-amber-50 transition-all duration-200">TIKTOK</a>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl group">
            <img src={hero3} alt="Broadcast" className="w-full h-full object-cover max-w-full group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-slate-50 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-2">Gallery</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Media & Experts</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
            <p className="text-slate-600 mt-4 text-base">Explore images and videos from our services and programs — and meet the media team behind the coverage.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {mediaSamples.map((m, i) => (
                <Link key={i} to={m.link} aria-label={`Open ${m.title}`} className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl group block transition-all duration-300">
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 max-w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{m.title}</h3>
                      <div className="text-xs text-white/90 font-medium">{m.type === "video" ? "🎬 Video" : "🖼️ Image"}</div>
                    </div>
                  </div>
                  {m.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl group-hover:bg-amber-400 transition-colors">
                        <Play className="text-slate-900" size={20} />
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <aside className="space-y-4">
              {mediaExperts.map((e, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg shadow-md border border-slate-100 flex items-start gap-4 hover:shadow-lg hover:border-amber-200 transition-all duration-200 group">
                  <img src={e.image} alt={e.name} className="w-16 h-16 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow max-w-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{e.name}</div>
                    <div className="text-xs text-amber-600 font-semibold uppercase tracking-wide mt-1">{e.role}</div>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{e.bio}</p>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-md mx-auto text-center">
          <p className="text-amber-300 font-semibold uppercase tracking-widest text-sm mb-3">Stay Connected</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-slate-300 mb-8 text-lg leading-relaxed">Subscribe for updates, events, and weekly devotionals.</p>
          <div className="flex gap-3 mb-6">
            <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 whitespace-nowrap">Subscribe</button>
          </div>
          <a href="/register" className="inline-block px-8 py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors duration-200">Register</a>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-20 mt-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Martyrs Of Christ World Outreach</h3>
            <p className="text-slate-400 leading-relaxed">Transforming lives through faith, worship, and service. Join our vibrant community and grow in your spiritual journey.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[ 
                { name: "Services", link: "/services" },
                { name: "About Us", link: "/about" },
                { name: "Community", link: "/community" },
                { name: "Partnership", link: "/partnership" },
                { name: "Giving", link: "/give/offering" },
                { name: "Contact", link: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="text-slate-400 hover:text-amber-400 transition-colors duration-200 font-medium">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" /> 123 Church Street, Accra, Ghana
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" /> +233 24 352 7174
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" /> info@fathersheart.org
              </li>
            </ul>

            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-110" title="Facebook"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-pink-600 transition-all duration-200 hover:scale-110" title="Instagram"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-red-600 transition-all duration-200 hover:scale-110" title="YouTube"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Martyrs Of Christ World Outreach. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
