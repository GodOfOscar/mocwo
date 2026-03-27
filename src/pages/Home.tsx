// src/pages/Home.tsx
import HeroCarousel from "@/components/ui/hero-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero1.jpeg";
import hero2 from "@/assets/hero2.jpeg";
import hero3 from "@/assets/hero3.jpeg";
import hero6 from "@/assets/hero6.jpg";
import vid from "@/assets/vid.mp4";
import NewsCarousel from "@/components/ui/news-carousel";
import { news } from "@/data/news";
import { Heart, BookOpen, Users, Globe, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const Home = () => {
  const carouselSlides = [
  { 
    id: 1, 
    title: "REACHING OUT TO THE UNREACHED", 
    subtitle: "Welcome to Martyrs of Christ World Outreach & Father's Heart Chapel Int'l", 
    description: "We are mandated to fulfill the Great Commission by reaching all people and making Christ known where His name is still unknown (Mark 16:15).", 
    image: hero1, 
    ctaText: "Join Our Family", 
    ctaLink: "/membership", 
    gradient: "from-blue-950 via-blue-800 to-cyan-600" 
  },
  { 
    id: 2, 
    title: "RAISING KINGDOM DISCIPLES", 
    subtitle: "Discipleship & Mentorship", 
    description: "Raising men and women to be effective witnesses of Christ and agents of positive change wherever they find themselves in the world (Matthew 28:19–20).", 
    image: hero2, 
    ctaText: "Join Our Family", 
    ctaLink: "/membership",
    gradient: "from-blue-950 via-blue-800 to-cyan-600"
  },
  { 
    id: 3, 
    title: "KINGDOM PARTNERSHIP", 
    subtitle: "Building Together", 
    description: "Raise a foundation for many generations. Support our mission to advance God's kingdom through missions, outreach, and community transformation (Philipians 1:5).", 
    image: hero3, 
    ctaText: "Partner With Us", 
    ctaLink: "/partnership",
    gradient: "from-blue-950 via-blue-800 to-cyan-600"
  },
  { 
    id: 4, 
    title: "GROWING STEADFASTLY", 
    subtitle: "FELLOWSHIP & COMMUNITY", 
    description: "We are a growing, Christ-centered community devoted to spiritual growth through teaching, fellowship, and prayer (Acts 2:42).", 
    image: hero6, 
    ctaText: "Join Our Family", 
    ctaLink: "/membership",
    gradient: "from-blue-950 via-blue-800 to-cyan-600"
  },
  { 
    id: 5, 
    title: "OUR YEAR OF REST", 
    subtitle: "Theme for 2026", 
    description: "Together in 2026, let's fulfill God's Word and the Father's heart desire for our lives, standing firm on His promises (Psalm 62:1-2).", 
    image: vid, 
    ctaText: "Join Our Family", 
    ctaLink: "/membership",
    gradient: "from-blue-950 via-blue-800 to-cyan-600"
  },
  // {
  //   id: 6,
  //   title: "HIGISA GADOLA",
  //   subtitle: "The Great Encounter",
  //   description: "Join us for a powerful encounter with God as we gather from December 20-24. Experience revival, transformation, and the presence of the Holy Spirit in a life-changing event.",
  //   image: hero1,
  //   ctaText: "Join Us",
  //   ctaLink: "/membership",
  //   gradient: "from-red-950 via-red-800 to-orange-600"
  // },
  // {
  //   id: 7,
  //   title: "REV. PRINCE'S 20 YEARS ANNIVERSARY",
  //   subtitle: "December 21st",
  //   description: "Celebrate two decades of apostolic ministry and divine calling. Join us as we honor the faithful service of Rev. Prince Bediako Appau in spreading the gospel and transforming lives.",
  //   image: hero2,
  //   ctaText: "Celebrate With Us",
  //   ctaLink: "/rev-prince-ministries",
  //   gradient: "from-purple-950 via-purple-800 to-pink-600"
  // },
  // {
  //   id: 8,
  //   title: "PNEUMATIKOS WATCH NIGHT",
  //   subtitle: "A Night of Spirit Fire and Revival",
  //   description: "Join us in June 2026 at the CCB Auditorium for an unforgettable night of worship, prayer, and revival. Experience the fire of the Holy Spirit as we cry out for restoration and renewal.",
  //   image: hero3,
  //   ctaText: "Mark Your Calendar",
  //   ctaLink: "/membership",
  //   gradient: "from-yellow-950 via-yellow-800 to-orange-500"
  // },
  // {
  //   id: 9,
  //   title: "ATWEA EASTER CAMP",
  //   subtitle: "A Season of Renewal",
  //   description: "Experience an incredible Easter season at the Atwea Camp. Join fellow believers for discipleship, fellowship, worship, and spiritual growth in a transformed environment.",
  //   image: hero6,
  //   ctaText: "Register Now",
  //   ctaLink: "/membership",
  //   gradient: "from-green-950 via-green-800 to-emerald-600"
  // }
];

  // ✅ Correct Order: FHC → Rev Prince → Offering → Partnership
  const quickActions = [
    { title: "FHCI", description: "Father’s Heart Chapel Int. – Equipping this generation to fulfill the Father’s desire", icon: Globe, gradient: "from-blue-700 to-cyan-500", link: "/fhc" },
    { title: "REV PRINCE MINISTRIES", description: "Rev. Prince Bediako Appau – Fulfilling Divine Calling, Living as Christ’s Representative", icon: BookOpen, gradient: "from-blue-700 to-cyan-500", link: "/rev-prince-ministries" },
    { title: "OFFERING", description: "Give Joyfully, Bless Generously", icon: Heart, gradient: "from-blue-700 to-cyan-500", link: "/give/offering" },
    { title: "PARTNER NOW", description: "Be a Partner. Fuel the Missions and Transform Lives.", icon: Users, gradient: "from-blue-700 to-cyan-500", link: "/partnership" }
  ];

  const features = [
    { title: "Live Streaming", description: "Join our services from anywhere in the world", icon: "📺", link: "/live" },
    { title: "Prayer Request", description: "Submit your prayer needs and receive support", icon: "🙏", link: "/Prayer-ai"},
    { title: "Evangelical Outreach", description: "Making a difference in our local and global communities", icon: "🌍", link: "/MOCWO" },
    { title: "Resources", description: "Access sermons, books, and study materials", icon: "📖", link: "/resources" }
  ];

  // `news` imported from src/data/news

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Carousel */}
      <HeroCarousel slides={carouselSlides} />

      {/* News Feed Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">News & Events</h2>
            <Link to="/news" className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 hover:underline">
              View All News
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured article carousel */}
            <div className="lg:col-span-2">
              <NewsCarousel slides={news} height={360} />
            </div>

            {/* Recent list */}
            <div className="space-y-4">
              {news.slice(1, 3).map((item) => (
                <Card key={item.id} className="flex items-start gap-4 border-0 shadow-card">
                  <img src={item.image} alt={item.title} className="max-w-full h-auto object-cover rounded-l-md w-28" />
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">{item.date}</div>
                    <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{item.excerpt}</p>
                    <Link to={item.link} className="text-sm text-blue-600 hover:underline">Read more →</Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.link} className="group">
                  <Card className="h-full border-0 shadow-card hover:shadow-divine transition-all duration-300 group-hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center mx-auto mb-4 shadow-glow`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{action.title}</h3>
                      <p className="text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-600">
        <div className="absolute inset-0 bg-black/20" /> 
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Martyrs Of Christ World Outreach</h2>
            <p className="text-xl mb-8 opacity-90">
             A Christian youth non-denominational evangelical movement fully commited to missions and mandated to empower the saints to be effective witnesses of Christ and also live as agents of change in the world at large.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/mocwo">
  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">MOCWO</Button>
</Link>
              {/* <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-blue-800">
                Watch Online
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Connect, Grow, and Serve</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the many ways you can be part of our community and grow in your faith journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link || "#"} className="no-underline">
                <Card className="text-center border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 mt-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Martyrs Of Christ World Outreach</h3>
            <p className="text-muted-foreground">
             Transforming lives  to be effective witnesses of Christ and also live as agents of change in the world at large.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[ 
                { name: "Services", link: "/services" },
                { name: "About Us", link: "/about" },
                { name: "News & Events", link: "/news" },
                { name: "Partnership", link: "/partnership" },
                { name: "Giving", link: "/give/offering" },
                { name: "Contact", link: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105 hover:underline transition-transform duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> 123 Church Street, Accra, Ghana</li>
              <li className="flex items-center gap-2"><Phone className="w-5 h-5" /> +233 24 352 7174</li>
              <li className="flex items-center gap-2"><Mail className="w-5 h-5" /> info@fathersheart.org</li>
            </ul>

            <div className="flex gap-4 mt-4">
              {[ 
                { icon: <Facebook className="w-5 h-5 text-white" />, link: "#" },
                { icon: <Instagram className="w-5 h-5 text-white" />, link: "#" },
                { icon: <Youtube className="w-5 h-5 text-white" />, link: "#" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-400 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Martyrs Of Christ World Outreach. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
