import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Calendar, Clock, Users, Play, Zap, Heart, Radio, Mail, Phone, MapPin, Facebook, Instagram, Youtube, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { NotificationSignup } from "@/components/NotificationSignup";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Services = () => {
  const [showPlanVisit, setShowPlanVisit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const weeklyServices = [
    {
      title: "Sunday Service",
      time_string: "8AM | 10AM",
      description: "Our main worship service with powerful praise, worship, and the Word",
      image: "🎵",
      details: "Join us for an uplifting time of worship, fellowship, and life-changing messages",
      color: "from-blue-500 to-blue-600",
      live_link: "https://www.youtube.com/live/yNB1h2ubyYM?si=_tPwUI9yxZCDFGMO",
      is_live: false
    },
    {
      title: "Monday TikTok Live",
      time_string: "9PM",
      description: "A moment of prayer and prophetic encouragement",
      image: "🌅",
      details: "Experience God's presence through prayer, prophecy, and spiritual breakthrough",
      color: "from-purple-500 to-purple-600",
      live_link: "https://www.tiktok.com/@revprinceappaubediako",
      is_live: false
    },
    {
      title: "Wednesday Midweek Service",
      time_string: "7PM",
      description: "Midweek spiritual refreshing and Bible study",
      image: "📖",
      details: "Dive deeper into God's Word with interactive Bible study and prayer",
      color: "from-green-500 to-green-600",
      live_link: "https://www.youtube.com/@revprincebediakoappau",
      is_live: false
    },
    {
      title: "Thursday TikTok Live",
      time_string: "9PM",
      description: "A moment of prayer and prophetic encouragement",
      image: "🙏",
      details: "Experience the power of prayer and prophetic ministry",
      color: "from-orange-500 to-orange-600",
      live_link: "https://www.tiktok.com/@revprinceappaubediako",
      is_live: false
    },
    {
      title: "Friday Prayer Encounter",
      time_string: "7PM",
      description: "Intensive prayer and Prophetic session",
      image: "⛪",
      details: "Join us for powerful prayer sessions and spiritual warfare",
      color: "from-red-500 to-red-600",
      live_link: "https://www.youtube.com/@revprincebediakoappau",
      is_live: false
    },
  ];

  const [services, setServices] = useState<any[]>(weeklyServices);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('church_schedule')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) setServices(data);
      } catch (err) {
        console.error("Error fetching church schedule:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const liveStreamOptions = [
    {
      platform: "Main Live Stream",
      description: "HD quality stream with multiple camera angles",
      viewers: "10K+ viewers",
      quality: "1080p HD",
      icon: "🎬"
    },
    {
      platform: "Mobile Stream",
      description: "Optimized for mobile devices and slower connections",
      viewers: "5K+ viewers",
      quality: "720p HD",
      icon: "📱"
    },
    {
      platform: "Audio Only",
      description: "Audio-only stream for those with limited bandwidth",
      viewers: "2K+ listeners",
      quality: "High Quality Audio",
      icon: "🎧"
    }
  ];

  // Detect which service is currently marked as live
  const currentlyLiveService = services.find(s => s.is_live === true);
  const sundayService = services.find(s => s.title === 'Sunday Service');
  
  const liveNowLink = currentlyLiveService?.live_link || sundayService?.live_link || 'https://www.youtube.com/live/yNB1h2ubyYM?si=_tPwUI9yxZCDFGMO';
  const isAnyServiceLive = !!currentlyLiveService;

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full">
              <span className="text-sm font-bold">Weekly Encounters</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 text-transparent bg-clip-text">
                Our Weekly Services
              </span>
            </h1>

            <p className="text-xl md:text-2xl opacity-95 mb-12 font-light">
              Life-transforming worship experiences designed to encounter God and grow in faith
            </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/live?source=${encodeURIComponent(liveNowLink)}`}>
                <Button
                  size="lg"
                  className={`${isAnyServiceLive ? "bg-red-600 hover:bg-red-700 animate-pulse ring-4 ring-red-500/30" : "bg-secondary hover:bg-secondary/90"} text-white px-8 py-6 text-lg font-bold rounded-full shadow-2xl transition-all duration-300 hover:scale-105`}
                >
                  {isAnyServiceLive ? "● Join Live Service Now" : "🔴 Join Live Now"}
                </Button>
              </Link>
              <Button
                size="lg"
                className="bg-white/10 backdrop-blur-md border-2 border-white text-white hover:bg-white/20 px-8 py-6 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105"
                onClick={() => setShowPlanVisit(true)}
              >
                📅 Plan Your Visit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Services Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <span className="text-sm font-bold text-blue-600">Service Schedule</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                Multiple Opportunities Weekly
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encounter God's presence throughout the week in worship, prayer, and fellowship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center py-12">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading service schedule...</p>
              </div>
            ) : services.length > 0 ? (
              services.map((service, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:-translate-y-2 group overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                
                <CardHeader className="text-center pb-2">
                  <div className="relative inline-block mx-auto mb-3">
                    <div className="text-7xl group-hover:scale-110 transition-transform">{service.image}</div>
                    {service.is_live && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full border-4 border-white animate-pulse shadow-lg" />
                    )}
                  </div>
                  <CardTitle className="text-2xl font-black group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text mb-2">
                    {service.title}
                  </CardTitle>
                  
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-blue-600">
                    <Clock className="w-4 h-4" />
                    {service.time_string}
                  </div>
                </CardHeader>

                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-3 font-medium">{service.description}</p>
                  <p className="text-sm text-muted-foreground mb-6">{service.details}</p>

                  <div className="space-y-3">
                    <Link to={`/live?source=${encodeURIComponent(service.live_link)}`}>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-full transition-all hover:shadow-lg"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Watch Live
                      </Button>
                    </Link>

                    <Button 
                      variant="outline" 
                      className="w-full font-bold rounded-full"
                      onClick={() => {
                        const event = {
                          title: service.title,
                          description: service.description,
                          startTime: new Date().toISOString(),
                          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                        };
                        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&dates=${event.startTime.replace(/[-:]/g, '').split('.')[0]}Z/${event.endTime.replace(/[-:]/g, '').split('.')[0]}Z`;
                        window.open(calendarUrl, '_blank');
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-muted-foreground">No services found.</p>
                <Button variant="link" onClick={() => window.location.reload()}>Try Refreshing</Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Live Streaming Section */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="text-sm font-bold text-red-600">🔴 Live Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                Join Our Live Services
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the power of worship from anywhere in the world
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            <div>
              <Card className="border-0 shadow-divine bg-gradient-to-br from-background to-muted/50 overflow-hidden h-full">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500">
                  <CardTitle className="text-2xl text-white">Currently Streaming</CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-900 to-black rounded-lg flex items-center justify-center mb-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/40 group-hover:to-cyan-500/40 transition-all"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Play className="w-10 h-10 text-white fill-white" />
                      </div>
                      <p className="text-2xl font-black text-white mb-2">Sunday Service</p>
                      <p className="text-sm opacity-75 text-white">The Power of Faith in Uncertain Times</p>
                      <p className="text-xs opacity-60 text-white mt-4">👥 8,543 watching now</p>
                    </div>
                  </div>

                  <h3 className="font-bold mb-4 text-lg">Choose Your Stream Quality</h3>
                  <div className="space-y-2">
                    {liveStreamOptions.map((option, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        className="w-full justify-between font-bold hover:bg-blue-50 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{option.icon}</span>
                          <div className="text-left">
                            <div className="font-bold">{option.platform}</div>
                            <div className="text-xs text-muted-foreground">{option.viewers}</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-blue-600">{option.quality}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-divine bg-gradient-to-br from-background to-muted/50 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black">Live Chat</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Connect with thousands of believers worldwide. Share prayer requests, testimonies, and receive spiritual encouragement from our vibrant community.
                  </p>
                  <Link to="/live">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-full">
                      💬 Join Live Chat
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-divine bg-gradient-to-br from-background to-muted/50 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black">Upcoming</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { day: "Wednesday", service: "Midweek Service", time: "7:00 PM" },
                      { day: "Thursday", service: "Prayer Live", time: "9:00 PM" },
                      { day: "Friday", service: "Prayer Encounter", time: "7:00 PM" }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all">
                        <div className="font-bold text-blue-900">{item.service}</div>
                        <div className="text-sm text-blue-700">{item.day} • {item.time}</div>
                      </div>
                    ))}
                  </div>

                  <Link to="/services">
                    <Button variant="outline" className="w-full mt-4 font-bold rounded-full">
                      View Full Schedule →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Signup Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <NotificationSignup
            title="Never Miss a Service"
            description="Subscribe to get email notifications about all our upcoming livestreams, prayer encounters, and special programs"
            variant="default"
          />
        </div>
      </section>

      {/* Service Information */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
              <span className="text-sm font-bold text-green-600">What to Expect</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                Service Experience
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each service is carefully designed to help you encounter God and grow in faith
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-card hover:shadow-divine transition-all hover:-translate-y-1 group">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black pt-2">In-Person Services</h3>
                </div>

                <ul className="space-y-4">
                  {[
                    "Arrive 15 minutes early for fellowship",
                    "Dress comfortably—all attire welcome",
                    "Bring your Bible or use ours",
                    "Children's ministry available"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      </span>
                      <span className="text-muted-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card hover:shadow-divine transition-all hover:-translate-y-1 group">
              <div className="h-2 bg-gradient-to-r from-cyan-600 to-blue-600"></div>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Radio className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black pt-2">Online Services</h3>
                </div>

                <ul className="space-y-4">
                  {[
                    "Stream starts 5 minutes early",
                    "Interactive live chat available",
                    "Multiple quality options",
                    "Replays for 48 hours"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                      </span>
                      <span className="text-muted-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Don't Miss God's Presence
            </h2>
            <p className="text-xl opacity-90 mb-12 leading-relaxed">
              Every service is an encounter with the living God. Whether in person or online, come prepared to be challenged, encouraged, and transformed by His Word.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/live">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg font-bold rounded-full"
                >
                  🔴 Join Live Now
                </Button>
              </Link>
              <Button
                size="lg"
                className="bg-white/10 hover:bg-white/20 border-2 border-white text-white px-8 py-6 text-lg font-bold rounded-full transition-all"
              >
                🔔 Get Reminders
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Plan Your Visit Modal */}
      {showPlanVisit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300 flex flex-col">
            {!selectedService ? (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">Hey! 👋</h2>
                    <p className="text-lg text-white/95">We're glad you're thinking of visiting 🙌</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPlanVisit(false);
                      setSelectedService(null);
                    }}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8">
                  <p className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
                    Let's get you set up real quick so your first time feels easy and chill.
                  </p>

                  <p className="text-center text-gray-600 font-bold mb-6">
                    Which service are you planning to attend? 👇
                  </p>

                  <div className="space-y-3">
                    {[
                      { title: "Sunday Service", time: "8AM | 10AM", emoji: "🎵" },
                      { title: "Wednesday Midweek Service", time: "7PM", emoji: "📖" },
                      { title: "Friday Prayer Encounter", time: "7PM", emoji: "⛪" },
                      { title: "Online/TikTok Live", time: "Varies", emoji: "📱" }
                    ].map((service, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedService(service)}
                        className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{service.emoji}</span>
                              <span className="font-bold text-gray-800 group-hover:text-blue-600">{service.title}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {service.time}
                            </div>
                          </div>
                          <div className="text-blue-600 group-hover:text-blue-700 font-bold">→</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700 text-center">
                      <span className="font-bold">Pro tip:</span> Subscribe below to get reminders for your chosen service!
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6 font-bold rounded-full"
                    onClick={() => setShowPlanVisit(false)}
                  >
                    I'll Decide Later
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">Perfect! ✨</h2>
                    <p className="text-lg text-white/95">You're all set</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPlanVisit(false);
                      setSelectedService(null);
                    }}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8">
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="text-4xl">{selectedService.emoji}</span>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{selectedService.title}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="w-4 h-4" />
                          {selectedService.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Awesome! We can't wait to see you at {selectedService.title}. Here's what we suggest next:
                  </p>

                  <div className="space-y-3 mb-6">
                    <button
                      onClick={() => {
                        const event = {
                          title: selectedService.title,
                          description: `Join us for ${selectedService.title}`,
                          startTime: new Date().toISOString(),
                          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                        };
                        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&dates=${event.startTime.replace(/[-:]/g, '').split('.')[0]}Z/${event.endTime.replace(/[-:]/g, '').split('.')[0]}Z`;
                        window.open(calendarUrl, '_blank');
                      }}
                      className="w-full p-4 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-bold text-gray-800 group-hover:text-blue-600">Add to Calendar</p>
                          <p className="text-xs text-gray-600">Never forget the date & time</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowPlanVisit(false);
                        setSelectedService(null);
                        document.getElementById('notification-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full p-4 rounded-lg border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-bold text-gray-800 group-hover:text-orange-600">Get Reminders</p>
                          <p className="text-xs text-gray-600">Email & WhatsApp notifications</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        window.open(`https://maps.google.com/?q=Fathers+Heart+Chapel+Accra`, '_blank');
                      }}
                      className="w-full p-4 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-400 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-bold text-gray-800 group-hover:text-purple-600">Get Directions</p>
                          <p className="text-xs text-gray-600">See our location on the map</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold rounded-full py-3"
                    onClick={() => {
                      setShowPlanVisit(false);
                      setSelectedService(null);
                    }}
                  >
                    Done! See You Soon 🙌
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;