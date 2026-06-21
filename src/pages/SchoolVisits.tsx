import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { schools } from "@/data/schools";
import { MapPin, Users, Heart, Award, Mail, Phone, Facebook, Instagram, Youtube } from "lucide-react";

export default function SchoolVisits() {
  const stats = [
    { label: "Schools Reached", value: "50+", icon: Award },
    { label: "Students Impacted", value: "15,000+", icon: Users },
    { label: "Lives Changed", value: "100%", icon: Heart },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Schools We've Transformed</h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Reaching students across multiple institutions with the message of hope, faith, and purpose. Witness the impact of spiritual awakening in academic communities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6" />
                      <div className="text-left">
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <div className="text-sm opacity-90">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground mb-4">Our Mission</p>
            <h2 className="text-4xl font-bold mb-6">"Reaching out to the reached before they get out of reach"</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We believe that every school visit is an opportunity to transform lives, strengthen faith, and ignite a passion for serving God. Our team goes beyond teaching—we inspire, mentor, and empower the next generation.
            </p>
          </div>
        </div>
      </section>

      {/* Schools Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Schools in Our Network</h2>
            <p className="text-xl text-muted-foreground">Explore each institution and discover the stories of transformation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school, idx) => (
              <Card 
                key={school.id} 
                className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
              >
                {/* Card Header with gradient */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 right-2 text-4xl">🎓</div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20"></div>
                </div>

                <CardContent className="pt-6 pb-4">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{school.name}</h3>
                  
                  <div className="flex items-start gap-2 mb-4 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{school.description}</span>
                  </div>

                  <p className="text-muted-foreground mb-6 text-sm line-clamp-2 min-h-10">
                    {school.description}
                  </p>

                  <div className="flex gap-3 mb-4">
                    <Link to={`/media/${school.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
                        📸 View Media
                      </Button>
                    </Link>
                    <Link to={`/report/${school.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        📖 Report
                      </Button>
                    </Link>
                  </div>

                  <Button variant="ghost" className="w-full text-primary hover:bg-primary/5">
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">What We Accomplish at Each Visit</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { 
                  icon: "💬", 
                  title: "Gospel Outreach", 
                  description: "Present the message of Christ's love and salvation to receptive audiences" 
                },
                { 
                  icon: "🤝", 
                  title: "Discipleship", 
                  description: "Establish mentorship connections and spiritual guidance groups" 
                },
                { 
                  icon: "🎯", 
                  title: "Character Building", 
                  description: "Inspire students to develop integrity, leadership, and purpose-driven lives" 
                },
                { 
                  icon: "🙏", 
                  title: "Prayer Ministry", 
                  description: "Intercede for students, staff, and the school's future" 
                },
                { 
                  icon: "🌟", 
                  title: "Vision Casting", 
                  description: "Help young people discover their calling and God's purpose for their lives" 
                },
                { 
                  icon: "🤲", 
                  title: "Community Care", 
                  description: "Provide practical support and resources to schools in need" 
                },
              ].map((item, idx) => (
                <Card key={idx} className="border-0 shadow-card hover:shadow-divine transition-all">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Want to Partner With Us?</h2>
            <p className="text-xl opacity-90 mb-8">
              Help us reach more schools and transform more lives. Whether through financial support, volunteering, or simply spreading the word, your contribution matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/partnership">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg">
                  Become a Partner
                </Button>
              </Link>
              <Link to="/give/mocwo">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary"
                >
                  Support Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Fathers Heart Chapel</h3>
            <p className="text-muted-foreground">
              Transforming lives through faith, worship, and service. Join our vibrant community and grow in your spiritual journey.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", link: "/" },
                { name: "Services", link: "/services" },
                { name: "MOCWO", link: "/mocwo" },
                { name: "Partnership", link: "/partnership" },
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
}