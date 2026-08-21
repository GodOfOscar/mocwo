import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Globe, Send, MessageCircle, Heart, Heart as HeartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero1.jpeg";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    location: ""
  });

  const locations = [
    {
      name: "Main Branch - Kumasi",
      address: "Sawaba, Off Sofoline Rd",
      phone: "+233 24 352 7174",
      email: "fathersheart@gmail.com",
      hours: "Office: Mon-Fri 8AM-5PM | Services: Sun 8AM & 12AM",
      isMain: true,
      icon: "🏛️"
    },
    {
      name: "Accra Branch - Legon",
      address: "Legon",
      phone: "+233 24 352 7174",
      email: "fathersheart@gmail.com",
      hours: "Office: Mon-Fri 8AM-5PM | Services: Sun 8AM & 12AM",
      isMain: false,
      icon: "🏘️"
    },
    {
      name: "US Branch",
      address: "Texas",
      phone: "+233 24 352 7174",
      email: "fathersheart@gmail.com",
      hours: "Office: Mon-Fri 8AM-5PM | Services: Sun 8AM & 12AM",
      isMain: false,
      icon: "🗽"
    },
    {
      name: "Canada Branch",
      address: "Canada",
      phone: "+233 24 352 7174",
      email: "fathersheart@gmail.com",
      hours: "Office: Mon-Fri 8AM-5PM | Services: Sun 8AM & 12AM",
      isMain: false,
      icon: "🍁"
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      details: "+233 24 352 7174",
      action: "Call Now",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us a detailed message",
      details: "info@fathersheart.org",
      action: "Send Email",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with us online during services",
      details: "Available during live streams",
      action: "Start Chat",
      gradient: "from-purple-500 to-cyan-500"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submission:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Hero Section */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          backgroundImage: `url(${hero1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-800/90 to-cyan-600/80" />

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full">
            <span className="text-sm font-bold">Get in Touch</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 text-transparent bg-clip-text">
              We're Here to Help
            </span>
          </h1>

          <p className="text-xl md:text-2xl opacity-95 mb-4 font-light max-w-2xl mx-auto">
            Have questions? Need prayer? Want to partner with us? We'd love to hear from you.
          </p>

          <p className="text-lg opacity-80 max-w-xl mx-auto">
            Reach out today and let's connect on your spiritual journey
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <span className="text-sm font-bold text-blue-600">Quick Contact</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                Multiple Ways to Reach Us
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the communication method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card 
                  key={index} 
                  className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:-translate-y-2 group overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${method.gradient}`}></div>
                  
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${method.gradient} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text">
                      {method.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 text-center text-sm">
                      {method.description}
                    </p>

                    <p className="text-blue-600 font-bold mb-6 text-center text-lg">
                      {method.details}
                    </p>

                    <Button className={`w-full bg-gradient-to-r ${method.gradient} hover:shadow-lg text-white font-bold rounded-full transition-all`}>
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Locations */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-divine h-full">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-600"></div>

                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                    Send Us a Message
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    We'll respond within 24 hours
                  </p>
                </CardHeader>

                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="font-bold mb-2 block">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Your full name"
                          className="border-2 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-bold mb-2 block">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your@email.com"
                          className="border-2 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="font-bold mb-2 block">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+233 XXX XXX XXXX"
                        className="border-2 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="font-bold mb-2 block">Preferred Location</Label>
                      <Select onValueChange={(value) => handleInputChange("location", value)}>
                        <SelectTrigger className="border-2 focus:border-blue-500 transition-all">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location, index) => (
                            <SelectItem key={index} value={location.name}>
                              {location.icon} {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="font-bold mb-2 block">Subject *</Label>
                      <Select onValueChange={(value) => handleInputChange("subject", value)}>
                        <SelectTrigger className="border-2 focus:border-blue-500 transition-all">
                          <SelectValue placeholder="What can we help you with?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prayer">🙏 Prayer Request</SelectItem>
                          <SelectItem value="visit">📍 Plan a Visit</SelectItem>
                          <SelectItem value="partnership">🤝 Partnership Inquiry</SelectItem>
                          <SelectItem value="mocwo">🎓 MOCWO Programs</SelectItem>
                          <SelectItem value="media">📸 Media & Resources</SelectItem>
                          <SelectItem value="general">❓ General Inquiry</SelectItem>
                          <SelectItem value="testimony">✨ Share Testimony</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="font-bold mb-2 block">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Please share your message, prayer request, or question..."
                        rows={5}
                        className="border-2 focus:border-blue-500 transition-all resize-none"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-full py-6 text-lg transition-all hover:shadow-lg"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Locations */}
            <div className="space-y-6">
              <div>
                <div className="inline-block mb-4 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                  <span className="text-sm font-bold text-green-600">Our Locations</span>
                </div>
                <h2 className="text-4xl font-black mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                    Find Us Worldwide
                  </span>
                </h2>
              </div>

              {locations.map((location, index) => (
                <Card 
                  key={index} 
                  className={`border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:-translate-y-1 group overflow-hidden ${
                    location.isMain ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-600"></div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{location.icon}</span>
                        <div>
                          <h3 className="text-xl font-black group-hover:text-blue-600 transition-colors">
                            {location.name}
                          </h3>
                          {location.isMain && (
                            <span className="inline-block mt-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                              🏆 Main Campus
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 ml-16">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground font-medium">{location.address}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <a href={`tel:${location.phone}`} className="text-blue-600 hover:underline font-bold">
                          {location.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <a href={`mailto:${location.email}`} className="text-blue-600 hover:underline font-bold">
                          {location.email}
                        </a>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{location.hours}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6 ml-16">
                      <Button size="sm" variant="outline" className="flex-1 border-2 font-bold rounded-full">
                        📍 Directions
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-full"
                      >
                        📞 Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Request Section */}
      <section className="py-24 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-100 text-transparent bg-clip-text">
                🙏 Need Prayer?
              </span>
            </h2>

            <p className="text-xl opacity-90 mb-12 leading-relaxed">
              Our intercessory prayer team is standing by to pray for your needs. Whether you're facing challenges, seeking guidance, or need a breakthrough, submit your prayer request and join thousands who have experienced God's miraculous intervention.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-0 shadow-divine bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all group">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🙏</div>
                  <h3 className="font-black text-lg mb-2">24/7 Prayer Coverage</h3>
                  <p className="text-sm opacity-80">Our dedicated team prays around the clock for your requests</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-divine bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all group">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🔐</div>
                  <h3 className="font-black text-lg mb-2">Confidential</h3>
                  <p className="text-sm opacity-80">Your requests are kept private and handled with care</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-divine bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all group">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">✨</div>
                  <h3 className="font-black text-lg mb-2">Miraculous Results</h3>
                  <p className="text-sm opacity-80">Read testimonies of answered prayers and breakthroughs</p>
                </CardContent>
              </Card>
            </div>

            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-6 text-lg font-bold rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-105"
            >
              💌 Submit Prayer Request
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <Card className="border-0 shadow-divine max-w-4xl mx-auto overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-red-600 to-orange-500"></div>

            <CardContent className="p-12 text-center bg-gradient-to-br from-red-50 to-orange-50">
              <div className="text-5xl mb-4">🆘</div>

              <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-red-600 to-orange-600 text-transparent bg-clip-text">
                Emergency or Urgent Prayer Need?
              </h3>

              <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                If you have an urgent prayer need or spiritual emergency, please reach out immediately through our 24-hour prayer hotline or WhatsApp. We're here to support you in your time of need.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-full transition-all hover:shadow-lg"
                >
                  📞 Emergency Prayer Line
                </Button>

                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-bold rounded-full transition-all hover:shadow-lg"
                  onClick={() => window.open('https://wa.me/233243527174', '_blank')}                >
                  💬 WhatsApp Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;