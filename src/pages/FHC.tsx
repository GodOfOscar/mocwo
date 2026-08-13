import { useEffect, useRef, useState } from "react";
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
import { initFhcAnimations, cleanupFhcAnimations } from "@/animations/fhcAnimations";

export default function Fhc() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanup = initFhcAnimations(pageRef.current);
    return () => {
      cleanup?.();
      cleanupFhcAnimations();
    };
  }, []);

  const mediaSamples = [
    { title: "Sunday Service Highlights", image: hero2, type: "video", link: "/media/sunday-service" },
    { title: "Watch Night Highlights", image: hero4, type: "video", link: "/media/watch-night" },
    { title: "Atwea Camps", image: hero5, type: "image", link: "/media/atwea-camps" },
    { title: "Others", image: hero3, type: "image", link: "/media/others" },
  ];

  const sermonCards = [
    { title: "Kingdom Living", speaker: "Rev. Prince Appau Bediako", description: "A practical roadmap for walking in purpose and power.", link: "https://www.youtube.com/watch?v=f7_p_A2iKf0&pp=ygUYcmV2IHByaW5jZSBhcHBhdSBiZWRpYWtv", image: hero4, type: "video", label: "Most Watched" },
    { title: "Breakthrough Prayer", speaker: "Rev. Prince Appau Bediako", description: "Keys to persistent prayer that open doors and shift atmospheres.", link: "https://www.youtube.com/watch?v=2KvLRUTCkDs&pp=ygUYcmV2IHByaW5jZSBhcHBhdSBiZWRpYWtv", image: hero5, type: "video", label: "Most Watched" },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-slate-900" data-fhc-animate>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FHC" className="w-12 h-12 rounded-full object-cover shadow-xl" />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-500">FATHERS HEART CHAPEL</div>
              <div className="text-xs text-slate-500">Martyrs Of Christ World Outreach</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="/" className="py-2 px-3 rounded-lg hover:bg-slate-100 transition">Home</a>
            <a href="/about" className="py-2 px-3 rounded-lg hover:bg-slate-100 transition">About</a>
            <a href="/services" className="py-2 px-3 rounded-lg hover:bg-slate-100 transition">Services</a>
            <a href="/community" className="py-2 px-3 rounded-lg hover:bg-slate-100 transition">Community</a>
            <a href="/give/partner" className="py-2 px-4 rounded-full bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-500/20 hover:shadow-xl transition">Partner</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden rounded-lg border border-slate-200/80 p-2 hover:bg-slate-100 transition">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <a href="/give/offering" className="hidden md:inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-xl transition">Give</a>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2 bg-white/95 border-t border-slate-200">
            <a href="/" className="py-2 px-3 rounded-lg hover:bg-slate-100 transition">Home</a>
            <a href="/about" className="py-2 px-3 rounded-lg hover:bg-slate-100 transition">About</a>
            <a href="/services" className="py-2 px-3 rounded-lg hover:bg-slate-100 transition">Services</a>
            <a href="/community" className="py-2 px-3 rounded-lg hover:bg-slate-100 transition">Community</a>
            <a href="/give/partner" className="py-2 px-3 rounded-lg bg-amber-400 text-slate-950 font-semibold transition">Partner</a>
          </div>
        )}
      </header>

      <div className="py-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-3">
          <a href="/give/offering" className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-semibold shadow-lg shadow-slate-200/70 hover:shadow-xl transition">Offering</a>
          <a href="/give/seed" className="px-5 py-3 rounded-2xl bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-500/30 hover:shadow-xl transition">Seed</a>
          <a href="/give/tithe" className="px-5 py-3 rounded-2xl bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl transition">Tithe</a>
          <a href="/give/partner" className="px-5 py-3 rounded-2xl bg-slate-200 text-slate-900 font-semibold shadow-lg shadow-slate-200/70 hover:shadow-xl transition">Partner Now</a>
        </div>
      </div>

      <section className="relative overflow-hidden bg-white" data-fhc-section data-fhc-parallax-bg>
        <div className="absolute inset-0 opacity-30" data-fhc-bg>
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-amber-200 blur-3xl" />
          <div className="absolute -bottom-28 left-0 h-80 w-80 rounded-full bg-cyan-200/60 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-6 text-slate-900" data-fhc-animate>
              <p className="uppercase tracking-[0.28em] text-amber-500 text-sm font-semibold" data-fhc-copy>Father’s Heart Chapel International</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight" data-fhc-heading>A creative ministry experience designed for a generation on fire.</h1>
              <p className="max-w-2xl text-slate-600 text-lg leading-relaxed" data-fhc-copy>FHCI is a global family of believers committed to bold worship, creative outreach, and life-changing discipleship. We combine spiritual depth with modern expression to make faith accessible and powerful.</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-200/60" data-fhc-stat>
                  <p className="text-2xl font-bold text-slate-900">10K+</p>
                  <p className="mt-2 text-sm text-slate-500">Members engaged every week</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg shadow-slate-200/60" data-fhc-stat>
                  <p className="text-2xl font-bold text-slate-900">250+</p>
                  <p className="mt-2 text-sm text-slate-500">Creative media and outreach events</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <a href="/live" data-fhc-button className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5">Watch Live</a>
                <a href="/about" data-fhc-button className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-amber-300 transition">Learn More</a>
              </div>
            </div>

            <div className="relative grid gap-6">
              <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-50 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.08)]" data-fhc-parallax-card>
                <img src={hero2} alt="Hero Banner" className="w-full h-72 object-cover" data-fhc-image />
                <div className="p-6 bg-white">
                  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600" data-fhc-copy>Featured Encounter</span>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900" data-fhc-heading>Sunday Revival Highlight</h2>
                  <p className="mt-3 text-slate-600" data-fhc-copy>A glimpse of our vibrant worship and the life-changing atmosphere that draws people from all walks of life.</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="rounded-2xl bg-slate-100 px-4 py-2 text-xs text-slate-500">Worship</span>
                    <span className="rounded-2xl bg-slate-100 px-4 py-2 text-xs text-slate-500">Media Live</span>
                    <span className="rounded-2xl bg-slate-100 px-4 py-2 text-xs text-slate-500">Community</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] bg-slate-50 p-5 border border-slate-200 shadow-lg">
                  <p className="text-2xl font-bold text-slate-900">Next Gathering</p>
                  <p className="mt-2 text-slate-600">Sunday • 10:00 AM</p>
                </div>
                <div className="rounded-[2rem] bg-slate-50 p-5 border border-slate-200 shadow-lg">
                  <p className="text-2xl font-bold text-slate-900">Live Access</p>
                  <p className="mt-2 text-slate-600">Stream videos from every service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border-t border-slate-200 px-6 py-20" data-fhc-section>
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div className="space-y-6">
            <p className="text-amber-500 uppercase tracking-[0.28em] text-sm font-semibold" data-fhc-copy>Sermons</p>
            <h2 className="text-4xl font-black text-slate-900" data-fhc-heading>Biblical teaching for every season of life.</h2>
            <p className="max-w-xl text-slate-600 leading-relaxed" data-fhc-copy>Our sermons bring Scripture to life with clarity, passion, and practical application for today’s generation.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sermonCards.map((sermon, idx) => (
              <a key={idx} href={sermon.link} target="_blank" rel="noreferrer" data-fhc-card className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200 transition hover:-translate-y-1 hover:border-amber-300/40">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={sermon.image} alt={sermon.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" data-fhc-image />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-amber-500 shadow-xl shadow-slate-200/70 transition duration-300 group-hover:scale-110">
                      <Play className="h-7 w-7" />
                    </div>
                  </div>
                  <div className="absolute left-4 bottom-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white">Video</div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{sermon.title}</h3>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">{sermon.label}</span>
                  </div>
                  <p className="mt-4 text-slate-600 leading-relaxed">{sermon.description}</p>
                  <p className="mt-4 text-sm font-semibold text-slate-500">{sermon.speaker}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 text-slate-900" data-fhc-section>
        <div className="mb-12 text-center">
          <p className="text-amber-500 uppercase tracking-[0.3em] text-sm font-semibold" data-fhc-copy>Media</p>
          <h2 className="mt-3 text-4xl font-black" data-fhc-heading>Visual ministry that feels premium.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 leading-relaxed" data-fhc-copy>Explore our media portfolio and the impactful stories behind our most watched sermons.</p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {mediaSamples.map((m, i) => (
              <Link key={i} to={m.link} aria-label={`Open ${m.title}`} data-fhc-card className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/70 transition hover:-translate-y-1">
                <img src={m.image} alt={m.title} className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110" data-fhc-image />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent px-6 py-5 flex flex-col justify-end">
                  <span className="text-xs uppercase tracking-[0.3em] text-amber-500">{m.type === 'video' ? '🎬 Video' : '🖼️ Image'}</span>
                  <h3 className="mt-3 text-xl font-bold text-slate-900">{m.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20" data-fhc-section>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-amber-500 uppercase tracking-[0.28em] text-sm font-semibold mb-4" data-fhc-copy>Stay connected</p>
          <h2 className="text-4xl font-black text-slate-900 mb-4" data-fhc-heading>Be part of the FHCI movement.</h2>
          <p className="mx-auto max-w-2xl text-slate-600 leading-relaxed mb-10" data-fhc-copy>Subscribe for updates, events, weekly devotionals, and stories from our global campus network.</p>
          <form className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row" data-fhc-animate>
            <input type="email" placeholder="you@example.com" className="flex-1 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            <button data-fhc-button className="rounded-3xl bg-amber-400 px-8 py-4 text-slate-950 font-semibold shadow-xl shadow-amber-400/20 hover:bg-amber-300 transition">Subscribe</button>
          </form>
        </div>
      </section>

      <footer className="bg-white px-6 py-16 border-t border-slate-200 text-slate-600" data-fhc-section>
        <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Fathers Heart Chapel</h3>
            <p className="leading-relaxed text-slate-600">A global ministry with creative worship, powerful media, and strong community impact.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-5">Quick Links</h3>
            <ul className="space-y-3 text-slate-600">
              {[ 
                { name: "Services", link: "/services" },
                { name: "About Us", link: "/about" },
                { name: "Community", link: "/community" },
                { name: "Partnership", link: "/partnership" },
                { name: "Giving", link: "/give/offering" },
                { name: "Contact", link: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="hover:text-amber-500 transition">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-5">Contact</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-amber-500" /> 123 Church Street, Accra, Ghana</li>
              <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-amber-500" /> +233 24 352 7174</li>
              <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-amber-500" /> info@fathersheart.org</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-900 hover:bg-blue-100 transition"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-900 hover:bg-pink-100 transition"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-900 hover:bg-red-100 transition"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">&copy; {new Date().getFullYear()} Fathers Heart Chapel International. All rights reserved.</div>
      </footer>
    </div>
  );
}
