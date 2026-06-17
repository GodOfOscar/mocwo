import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, Play, Download, Headphones, Mail, Phone, MapPin, Facebook, Instagram, Youtube, X, Flame, CheckCircle2, Target, Share2, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Resources = () => {
  const resourceCategories = [
    { title: "Sermons", description: "Life-changing messages from our weekly services", icon: Play, gradient: "from-blue-700 to-cyan-500", link: "/resources/sermons" },
    { title: "Books", description: "Spiritual literature for growth and inspiration", icon: Book, gradient: "from-blue-600 to-blue-400", link: "/resources/books" },
    { title: "Podcasts", description: "On-the-go inspiration for your daily journey", icon: Headphones, gradient: "from-cyan-500 to-blue-400", link: "/resources/podcasts" },
    { title: "Downloads", description: "Study guides, worksheets, and digital content", icon: Download, gradient: "from-blue-800 to-cyan-600", link: "/resources/downloads" }
  ];

 const featuredSermons = [
  { 
    title: "The Power of Faith", 
    speaker: "Rev. Prince Appau Bediako", 
    date: "March 15, 2024", 
    duration: "45 min", 
    image: "🎬",
    videoLink: "https://www.youtube.com/watch?v=CuSjTgJV_lA"
  },
  { 
    title: "Walking in Purpose", 
    speaker: "Rev. Prince Appau Bediako", 
    date: "March 8, 2024", 
    duration: "52 min", 
    image: "🎬",
    videoLink: "https://www.youtube.com/watch?v=JtdKbMrPwqQ"
  },
  { 
    title: "Kingdom Principles", 
    speaker: "Rev. Prince Appau Bediako", 
    date: "March 1, 2024", 
    duration: "48 min", 
    image: "🎬",
    videoLink: "https://www.youtube.com/watch?v=cJU6wW5Veo8"
  }
];

  const featuredBooks = [
    { title: "Prophetic Breakthrough", author: "Rev. Prince Appau Bediako", description: "Discover the power of prophetic ministry in your life", price: "$15.99", image: "📚" },
    { title: "Faith That Moves Mountains", author: "Rev. Prince Appau Bediako", description: "Build unshakeable faith for impossible situations", price: "$12.99", image: "📚" },
    { title: "The Believer's Authority", author: "Rev. Prince Appau Bediako", description: "Understanding your position in Christ", price: "$18.99", image: "📚" }
  ];

  const dailyDevotionals = [
    { month: "January", shortMonth: "Jan", theme: "New Beginnings", bgColor: "from-blue-600 to-blue-400", days: 31 },
    { month: "February", shortMonth: "Feb", theme: "Love & Compassion", bgColor: "from-red-600 to-red-400", days: 28 },
    { month: "March", shortMonth: "Mar", theme: "Praying With The Word", bgColor: "from-cyan-600 to-cyan-400", days: 31 },
    { month: "April", shortMonth: "Apr", theme: "Resurrection Power", bgColor: "from-emerald-600 to-emerald-400", days: 30 },
    { month: "May", shortMonth: "May", theme: "Spiritual Growth", bgColor: "from-purple-600 to-purple-400", days: 31 },
    { month: "June", shortMonth: "Jun", theme: "Grace & Mercy", bgColor: "from-pink-600 to-pink-400", days: 30 },
    { month: "July", shortMonth: "Jul", theme: "Freedom In Christ", bgColor: "from-orange-600 to-orange-400", days: 31 },
    { month: "August", shortMonth: "Aug", theme: "Strength & Courage", bgColor: "from-amber-600 to-amber-400", days: 31 },
    { month: "September", shortMonth: "Sep", theme: "Faithfulness", bgColor: "from-yellow-600 to-yellow-400", days: 30 },
    { month: "October", shortMonth: "Oct", theme: "Transformation", bgColor: "from-indigo-600 to-indigo-400", days: 31 },
    { month: "November", shortMonth: "Nov", theme: "Gratitude & Thanksgiving", bgColor: "from-teal-600 to-teal-400", days: 30 },
    { month: "December", shortMonth: "Dec", theme: "Hope & Joy", bgColor: "from-rose-600 to-rose-400", days: 31 }
  ];

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [devotionalSettings, setDevotionalSettings] = useState<Record<string, {theme: string, bg_color: string, cover_image_url: string}>>({});

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const { data } = await (supabase as any).from('devotional_settings').select('month, theme, bg_color, cover_image_url');
        if (data) {
          const mapping = data.reduce((acc: any, curr: any) => ({
            ...acc,
            [curr.month]: { theme: curr.theme, bg_color: curr.bg_color, cover_image_url: curr.cover_image_url }
          }), {});
          setDevotionalSettings(mapping);
        }
      } catch (err) {
        console.error("Error loading devotional themes:", err);
      }
    };
    fetchThemes();
  }, []);

  const displayDevotionals = dailyDevotionals.map(d => ({
    ...d,
    theme: devotionalSettings[d.month.toLowerCase()]?.theme || d.theme, // Fallback to default theme
    bgColor: devotionalSettings[d.month.toLowerCase()]?.bg_color || d.bgColor, // Fallback to default color
    cover_image_url: devotionalSettings[d.month.toLowerCase()]?.cover_image_url || null // New cover image URL
  }));

  const [completedDays, setCompletedDays] = useState<string[]>(() => {
    const saved = localStorage.getItem("moc_completed_devotions");
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("moc_devotional_streak");
    return saved ? parseInt(saved) : 0;
  });

  const toggleComplete = (dayId: string) => {
    const isMarkingComplete = !completedDays.includes(dayId);
    const newCompleted = isMarkingComplete
      ? [...completedDays, dayId]
      : completedDays.filter(id => id !== dayId);
    
    setCompletedDays(newCompleted);
    localStorage.setItem("moc_completed_devotions", JSON.stringify(newCompleted));
    
    if (isMarkingComplete) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("moc_devotional_streak", newStreak.toString());
    }
  };

  const handleShareStreak = () => {
    const shareText = `I'm on a ${streak}-day spiritual growth streak with the Martyrs of Christ World Outreach Daily Devotional! 🙏✨ Join me in our daily walk with God.`;
    const shareUrl = window.location.origin + "/resources";

    if (navigator.share) {
      navigator.share({
        title: 'MOC Daily Devotional Streak',
        text: shareText,
        url: shareUrl,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 min-h-[110vh] py-24 flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <p className="text-cyan-300 font-semibold uppercase tracking-widest text-sm mb-4">Spiritual Growth</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">Spiritual Resources</h1>
            <p className="text-xl md:text-2xl opacity-95 mb-10 leading-relaxed max-w-2xl mx-auto">
              Equip yourself with powerful spiritual tools for growth and transformation
            </p>
            <Button size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-200 text-white px-8 py-6 text-lg font-semibold shadow-lg">
              Browse All Resources
            </Button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white">
          <span className="text-xs uppercase tracking-[0.35em] mb-2 text-white/80">Scroll</span>
          <div className="w-10 h-10 rounded-full border border-white/60 bg-white/10 backdrop-blur-xl flex items-center justify-center animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-white">
              <path fill="currentColor" d="M12 16.5l-6-6 1.4-1.4L12 13.7l4.6-4.6 1.4 1.4z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-cyan-600 font-semibold uppercase tracking-widest text-sm mb-3">Available Resources</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Explore Our Collections</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-slate-600">Choose from our curated collections to deepen your spiritual journey</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={index} to={category.link} className="group">
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-white hover:bg-gradient-to-br hover:from-white hover:to-slate-50">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">{category.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Sermons */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-cyan-600 font-semibold uppercase tracking-widest text-sm mb-3">Latest Teachings</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Featured Sermons</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-slate-600">Recent messages that have touched hearts and changed lives</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSermons.map((sermon, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group bg-white">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-blue-700 to-cyan-500 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500 overflow-hidden">{sermon.image}</div>
                  <div className="p-8 space-y-3">
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight">{sermon.title}</h3>
                    <p className="text-slate-600 font-medium">{sermon.speaker}</p>
                    <div className="flex justify-between text-sm text-slate-500 font-medium pt-2 border-t border-slate-100">
                      <span>📅 {sermon.date}</span>
                      <span>⏱️ {sermon.duration}</span>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg text-white font-semibold mt-4 py-5"
                      onClick={() => window.open(sermon.videoLink, '_blank')}
                    >
                      Watch Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <p className="text-cyan-600 font-semibold uppercase tracking-widest text-sm mb-3">Spiritual Nourishment</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Daily Devotional</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-slate-600">Choose a month to access daily devotions, pray with Scripture, and deepen your connection with God</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayDevotionals.map((devotional, index) => (
              <button
                key={index}
                onClick={() => setSelectedMonth(devotional)}
                className="group h-full"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white cursor-pointer overflow-hidden relative">
                  {devotional.cover_image_url ? (
                    <div className="relative h-32">
                      <img src={devotional.cover_image_url} alt={`${devotional.month} Cover`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ) : (
                    <div className={`w-full h-32 rounded-t-lg bg-gradient-to-br ${devotional.bgColor} flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                      <div className="text-center">
                        <div className="text-xs font-semibold opacity-75 mb-1">MONTH OF</div>
                        <div className="text-2xl font-bold">{devotional.shortMonth}</div>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6 text-center space-y-3 h-full flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900">{devotional.month}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{devotional.theme}</p>
                    <div className="mt-auto pt-2 border-t border-slate-100">
                      <p className="text-xs text-cyan-600 font-semibold">View Devotions</p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Devotional Modal */}
      {selectedMonth && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedMonth.bgColor} text-white p-8 relative sticky top-0 z-40`}>
              <button
                onClick={() => setSelectedMonth(null)}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="text-center">
                <p className="text-sm font-semibold opacity-90 mb-2 uppercase tracking-widest">MONTH OF</p>
                <h2 className="text-5xl font-bold mb-4 italic">{selectedMonth.month.toUpperCase()}</h2>
                <div className="w-20 h-1 bg-white/50 rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-semibold opacity-95">{selectedMonth.theme}</p>
              </div>
            </div>

            {/* Monthly Progress Bar */}
            <div className="px-8 pt-8">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="text-amber-500" size={20} />
                    <span className="font-bold text-slate-700">Monthly Progress</span>
                  </div>
                  <span className="text-sm font-black text-cyan-600">
                    {Math.round((completedDays.filter(id => id.startsWith(`${selectedMonth.month}-`)).length / selectedMonth.days) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out bg-gradient-to-r ${selectedMonth.bgColor}`}
                    style={{ 
                      width: `${(completedDays.filter(id => id.startsWith(`${selectedMonth.month}-`)).length / selectedMonth.days) * 100}%` 
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-3 font-medium">
                  You've completed {completedDays.filter(id => id.startsWith(`${selectedMonth.month}-`)).length} out of {selectedMonth.days} devotions for {selectedMonth.month}.
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: selectedMonth.days }, (_, i) => i + 1).map((day) => (
                  <div key={day}>
                    <button
                      onClick={() => setExpandedDay(day)}
                      className="w-full text-left group"
                    >
                      <div className={`bg-white border-2 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer flex justify-between items-center ${
                        completedDays.includes(`${selectedMonth.month}-${day}`) 
                        ? "border-green-200 bg-green-50/30" 
                        : "border-slate-100 hover:border-blue-200"
                      }`}>
                        <div>
                          <div className={`text-lg font-bold bg-gradient-to-r ${selectedMonth.bgColor} bg-clip-text text-transparent mb-1`}>
                            Day {day}
                          </div>
                        </div>
                        {completedDays.includes(`${selectedMonth.month}-${day}`) && (
                          <CheckCircle2 className="text-green-500" size={24} />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {expandedDay === day && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
                        <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200`}>
                          <div className={`bg-gradient-to-r ${selectedMonth.bgColor} p-6 text-white flex justify-between items-center`}>
                            <div className="flex items-center gap-3">
                              <Book size={24} />
                              <div>
                                <h3 className="text-xl font-bold">Day {day}</h3>
                                <p className="text-sm opacity-80">{selectedMonth.month} Devotional</p>
                              </div>
                            </div>
                            <button onClick={() => setExpandedDay(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                              <X size={24} />
                            </button>
                          </div>

                          <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-50">
                            <img 
                              src={supabase.storage.from('devotionals').getPublicUrl(`${selectedMonth.month.toLowerCase()}/${day}.jpg`).data.publicUrl}
                              alt={`Devotional Day ${day}`}
                              className="max-w-full rounded-lg shadow-xl object-contain"
                              onError={(e) => {
                                e.currentTarget.src = `https://placehold.co/800x1200/slate/white?text=${selectedMonth.month}+Day+${day}`;
                              }}
                            />
                          </div>

                          <div className="p-4 bg-white border-t flex gap-4">
                            <Button 
                              onClick={() => toggleComplete(`${selectedMonth.month}-${day}`)}
                              className={`flex-1 py-6 text-lg font-bold shadow-lg transition-all ${
                                completedDays.includes(`${selectedMonth.month}-${day}`)
                                ? "bg-green-500 hover:bg-green-600"
                                : `bg-gradient-to-r ${selectedMonth.bgColor}`
                              }`}
                            >
                              {completedDays.includes(`${selectedMonth.month}-${day}`) ? (
                                <span className="flex items-center gap-2"><CheckCircle2 /> Done</span>
                              ) : (
                                "Mark as Completed"
                              )}
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => setExpandedDay(null)}
                              className="flex-1 py-6 font-semibold"
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Download Section */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200">
                <Button 
                  onClick={() => {
                    alert(`Downloading ${selectedMonth.month} Devotional Manual...`);
                  }}
                  className={`flex-1 bg-gradient-to-r ${selectedMonth.bgColor} hover:shadow-lg text-white font-semibold py-6 flex items-center justify-center gap-2`}
                >
                  <Download size={20} />
                  Download Full Manual
                </Button>
                <Button 
                  onClick={() => setSelectedMonth(null)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-6"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-20 mt-20 border-t border-slate-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Fathers Heart Chapel</h3>
            <p className="text-slate-400 leading-relaxed text-base">
              Transforming lives through faith, worship, and service. Join our vibrant community and grow in your spiritual journey.
            </p>
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
                  <Link
                    to={item.link}
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-3 hover:text-white transition-colors"><MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" /> 123 Church Street, Accra, Ghana</li>
              <li className="flex items-center gap-3 hover:text-white transition-colors"><Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" /> +233 24 352 7174</li>
              <li className="flex items-center gap-3 hover:text-white transition-colors"><Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" /> info@fathersheart.org</li>
            </ul>
            <div className="flex gap-4 mt-6">
              {[
                { icon: <Facebook className="w-4 h-4" />, link: "#", hover: "hover:bg-blue-600" },
                { icon: <Instagram className="w-4 h-4" />, link: "#", hover: "hover:bg-pink-600" },
                { icon: <Youtube className="w-4 h-4" />, link: "#", hover: "hover:bg-red-600" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white ${social.hover} transition-all duration-200 hover:scale-110`}
                  title={social.link}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Fathers Heart Chapel International. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Resources;
