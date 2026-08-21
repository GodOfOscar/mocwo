import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Heart, Award, Mail, Phone, Facebook, Instagram, Youtube } from "lucide-react";

export default function Communities() {
  const stats = [
    { label: "Communities Reached", value: "200+", icon: Award },
    { label: "Families Impacted", value: "10,000+", icon: Users },
    { label: "Lives Transformed", value: "100%", icon: Heart },
  ];

  const communities = [
    {
      id: 1,
      name: "Jamestown Community",
      description: "A vibrant waterfront community where we've established educational programs and spiritual mentorship for youth and families",
      location: "Accra, Ghana",
      image: "🏘️"
    },
    {
      id: 2,
      name: "Madina Ward",
      description: "An urban neighborhood where we're providing resources, counseling services, and community outreach initiatives",
      location: "Accra, Ghana",
      image: "🏘️"
    },
    {
      id: 3,
      name: "Tema Community",
      description: "Industrial area where we're impacting factory workers and their families through faith-based programs",
      location: "Tema, Ghana",
      image: "🏭"
    },
    {
      id: 4,
      name: "Cape Coast Settlement",
      description: "Coastal community experiencing spiritual revival through our prayer ministry and community service projects",
      location: "Cape Coast, Ghana",
      image: "🏘️"
    },
    {
      id: 5,
      name: "Kumasi Outreach Zone",
      description: "Metropolitan area where we're conducting outreach programs and establishing fellowship groups",
      location: "Kumasi, Ghana",
      image: "🏘️"
    },
    {
      id: 6,
      name: "Sekondi-Takoradi Initiative",
      description: "Twin city project focused on youth development and community transformation through integrated programs",
      location: "Sekondi-Takoradi, Ghana",
      image: "🏘️"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-950 via-cyan-800 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Communities We're Transforming</h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Reaching neighborhoods and families across the nation with the message of hope, purpose, and spiritual awakening. Witness how entire communities are experiencing transformation through faith-based initiatives.
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
            <h2 className="text-4xl font-bold mb-6">"Bringing Kingdom transformation to every neighborhood and household"</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We believe that community impact starts with relationship and genuine care. Our mission extends beyond spiritual growth to include social welfare, educational support, and practical assistance. We partner with local leaders to identify needs and provide holistic solutions that reflect Christ's love.
            </p>
          </div>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Communities in Our Network</h2>
            <p className="text-xl text-muted-foreground">Explore the neighborhoods where lives are being transformed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communities.map((community, idx) => (
              <Card 
                key={community.id} 
                className="border-0 shadow-card hover:shadow-divine transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
              >
                {/* Card Header with gradient */}
                <div className="h-32 bg-gradient-to-r from-cyan-600 to-blue-500 relative overflow-hidden flex items-center justify-center">
                  <div className="text-6xl group-hover:scale-125 transition-transform">{community.image}</div>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20"></div>
                </div>

                <CardContent className="pt-6 pb-4">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{community.name}</h3>
                  
                  <div className="flex items-start gap-2 mb-4 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{community.location}</span>
                  </div>

                  <p className="text-muted-foreground mb-6 text-sm line-clamp-3">
                    {community.description}
                  </p>

                  <div className="flex gap-3 mb-4">
                    <Link to={`/media/${community.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 text-white">
                        📸 View Media
                      </Button>
                    </Link>
                    <Link to={`/report/${community.id}`} className="flex-1">
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
            <h2 className="text-4xl font-bold mb-12 text-center">What We Accomplish in Each Community</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { 
                  icon: "💬", 
                  title: "Gospel Ministry", 
                  description: "Share the message of Christ with families and community leaders" 
                },
                { 
                  icon: "🤝", 
                  title: "Community Partnerships", 
                  description: "Collaborate with local leaders to address community needs" 
                },
                { 
                  icon: "🎓", 
                  title: "Educational Support", 
                  description: "Provide scholarships, mentoring, and learning resources for children" 
                },
                { 
                  icon: "🏥", 
                  title: "Social Welfare", 
                  description: "Offer healthcare awareness, food assistance, and practical support" 
                },
                { 
                  icon: "🌟", 
                  title: "Youth Development", 
                  description: "Empower young people with skills, values, and purpose" 
                },
                { 
                  icon: "🙏", 
                  title: "Prayer & Intercession", 
                  description: "Establish prayer groups and spiritual support networks" 
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-cyan-900 via-blue-900 to-blue-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Be Part of Community Transformation</h2>
            <p className="text-xl opacity-90 mb-8">
              Your support can directly impact families and communities. Whether through volunteering, giving, or partnership, you can be part of changing lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/give/communities">
                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-bold">
                  💖 Support Communities
                </Button>
              </Link>
              <Link to="/partnership">
                <Button className="bg-primary/20 hover:bg-primary/30 border border-white/30 text-white px-8 py-6 text-lg font-bold">
                  🤝 Partner With Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
              Fathers Heart Chapel
            </h3>
            <p className="text-muted-foreground">
              Transforming communities through faith, service, and compassion. Join us in making a difference.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", link: "/" },
                { name: "MOCWO", link: "/mocwo" },
                { name: "Schools", link: "/schools" },
                { name: "Partnership", link: "/partnership" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-400 hover:scale-105 hover:underline transition-transform duration-300"
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
              <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Accra, Ghana</li>
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
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Martyrs Of Christ World Outreach. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

