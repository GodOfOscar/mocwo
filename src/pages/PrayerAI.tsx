import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Phone, MapPin, Send, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { sendPrayerRequest } from "@/lib/api";

type Message = { sender: "ai" | "user"; content: React.ReactNode };

export default function PrayerAI() {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<"sms" | "whatsapp" | "email" | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [prayer, setPrayer] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      content: (
        <>
          👋 Hello, welcome to <strong>FHC Prayer Support</strong>.<br />
          My name is <strong>Apostle Wisdom</strong>. I'm here to pray with you and
          connect you to our ministry leaders.
        </>
      ),
    },
  ]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addUserMessage = (content: React.ReactNode) => {
    setMessages((m) => [...m, { sender: "user", content }]);
  };

  const addAIMessage = (content: React.ReactNode) => {
    setMessages((m) => [...m, { sender: "ai", content }]);
  };

  const next = () => setStep((s) => s + 1);

  const sendLeaderNotification = async () => {
    try {
      const data = await sendPrayerRequest({ method, name, phone, location, prayer });
      console.log("Prayer request sent:", data);
      addAIMessage(
        <>
          ✅ <strong>Message sent successfully!</strong> <br/>
          Our prayer leaders will respond to you soon.
        </>
      );
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Please check your internet and try again.";
      addAIMessage(
        <>
          ⚠️ <strong>Connection error.</strong> <br/>
          {errorMessage}
        </>
      );
    }
  };

  const steps = [
    { icon: "📱", label: "Method" },
    { icon: "👤", label: "Name" },
    { icon: "📞", label: "Phone" },
    { icon: "📍", label: "Location" },
    { icon: "🙏", label: "Prayer" },
    { icon: "✅", label: "Sent" },
  ];

  const handleContinueStep0 = () => {
    if (method) {
      addUserMessage(`Selected: ${method.toUpperCase()}`);
      addAIMessage(<>Great! We will send updates via <strong>{method.toUpperCase()}</strong>. 🎯</>);
      next();
    }
  };

  const handleContinueStep1 = () => {
    if (name) {
      addUserMessage(name);
      addAIMessage(<>Nice to meet you, <strong>{name}</strong>. 🙏</>);
      addAIMessage("Please share your phone number.");
      next();
    }
  };

  const handleContinueStep2 = () => {
    if (phone) {
      addUserMessage(phone);
      addAIMessage("Where are you located? 📍");
      next();
    }
  };

  const handleContinueStep3 = () => {
    if (location) {
      addUserMessage(location);
      addAIMessage("Please tell me your prayer request. I am listening. 💭");
      next();
    }
  };

  const handleContinueStep4 = async () => {
    if (prayer) {
      addUserMessage(prayer);
      addAIMessage(
        <>
          🙏 Thank you. I am praying for you now.
          <br />
          <em>"The Lord bless you and keep you." — Numbers 6:24–26</em>
        </>
      );
      addAIMessage(
        <>
          📖 Scripture: Isaiah 41:10 — "Fear not, for I am with you."
        </>
      );
      addAIMessage(
        <>
          📞 Prayer Leaders: <br />• Rev. Prince Appau — +233 24 352 7174
        </>
      );

      await sendLeaderNotification();

      if (method === 'whatsapp') {
        const waNumber = "233544733469";
        const text = encodeURIComponent(`🙏 New Prayer Request\n\nName: ${name}\nPhone: ${phone}\nLocation: ${location}\n\nPrayer: ${prayer}`);
        window.location.href = `https://wa.me/${waNumber}?text=${text}`;
        return;
      }

      next();
    }
  };

  const resetForm = () => {
    setStep(0);
    setMethod("");
    setName("");
    setPhone("");
    setLocation("");
    setPrayer("");
    setMessages([
      {
        sender: "ai",
        content: (
          <>
            👋 Hello, welcome to <strong>FHC Prayer Support</strong>.<br />
            My name is <strong>Apostle Wisdom</strong>. I'm here to pray with you and
            connect you to our ministry leaders.
          </>
        ),
      },
    ]);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-white via-blue-50 to-white">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 mb-6">
            <p className="text-sm font-semibold">Prayer Support</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Prayer with <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-200">Rev. Prince</span>
          </h1>
          <p className="text-xl opacity-95 max-w-2xl mx-auto">
            Connect with our prayer leaders and receive personalized spiritual support
          </p>
        </div>
      </section>

      {/* Main Chat Interface */}
      <section className="py-12 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-blue-100 flex flex-col" style={{ height: '650px' }}>
              
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-800 text-white px-6 py-4 font-semibold flex items-center gap-3 flex-shrink-0">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                <span>🤍 Prayer Assistant — Apostle Wisdom</span>
              </div>

              {/* Horizontal Progress Steps */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-blue-100 flex-shrink-0 overflow-x-auto">
                <div className="flex items-center justify-between gap-2 min-w-max">
                  {steps.map((s, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className={`flex flex-col items-center min-w-max ${step > idx ? 'opacity-100' : step === idx ? 'opacity-100' : 'opacity-50'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                          step > idx
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                            : step === idx
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white ring-2 ring-offset-2 ring-cyan-400"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {step > idx ? "✓" : s.icon}
                        </div>
                        <span className="text-xs font-bold mt-1 text-center text-gray-700 max-w-[40px]">{s.label}</span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`h-0.5 w-6 mx-1 ${step > idx ? 'bg-green-500' : 'bg-gray-300'} hidden sm:block`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-blue-50"
              >
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed font-medium transition-all duration-300 ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-br-none shadow-lg"
                          : "bg-white text-gray-900 rounded-bl-none shadow-md border-2 border-blue-100"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-blue-100 p-6 flex-shrink-0">
                {/* Step 0: Method Selection */}
                {step === 0 && (
                  <div className="space-y-3">
                    <p className="font-semibold text-gray-900 text-sm">How would you like to receive updates?</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => setMethod("sms")}
                        className={`transition-all duration-300 text-xs ${
                          method === "sms"
                            ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-900 hover:bg-blue-50"
                        }`}
                      >
                        📱 SMS
                      </Button>
                      <Button
                        onClick={() => setMethod("whatsapp")}
                        className={`transition-all duration-300 text-xs ${
                          method === "whatsapp"
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-900 hover:bg-green-50"
                        }`}
                      >
                        💬 WhatsApp
                      </Button>
                      <Button
                        onClick={() => setMethod("email")}
                        className={`transition-all duration-300 text-xs ${
                          method === "email"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-900 hover:bg-purple-50"
                        }`}
                      >
                        📧 Email
                      </Button>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all duration-300 font-bold text-sm"
                      onClick={handleContinueStep0}
                      disabled={!method}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {/* Step 1: Name */}
                {step === 1 && (
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 focus:border-blue-500 transition-all rounded-xl text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && name) {
                          handleContinueStep1();
                        }
                      }}
                    />
                    <Button
                      className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all duration-300 font-bold text-sm"
                      onClick={handleContinueStep1}
                      disabled={!name}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {/* Step 2: Phone */}
                {step === 2 && (
                  <div className="space-y-3">
                    <Input
                      placeholder="+233 XXX XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-2 focus:border-blue-500 transition-all rounded-xl text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && phone) {
                          handleContinueStep2();
                        }
                      }}
                    />
                    <Button
                      className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all duration-300 font-bold text-sm"
                      onClick={handleContinueStep2}
                      disabled={!phone}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {/* Step 3: Location */}
                {step === 3 && (
                  <div className="space-y-3">
                    <Input
                      placeholder="City / Country"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border-2 focus:border-blue-500 transition-all rounded-xl text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && location) {
                          handleContinueStep3();
                        }
                      }}
                    />
                    <Button
                      className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all duration-300 font-bold text-sm"
                      onClick={handleContinueStep3}
                      disabled={!location}
                    >
                      Continue
                    </Button>
                  </div>
                )}

                {/* Step 4: Prayer Request */}
                {step === 4 && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your prayer request..."
                      value={prayer}
                      onChange={(e) => setPrayer(e.target.value)}
                      className="border-2 focus:border-blue-500 transition-all rounded-xl resize-none text-sm"
                      rows={2}
                    />
                    <Button
                      className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all duration-300 font-bold text-sm"
                      onClick={handleContinueStep4}
                      disabled={!prayer}
                    >
                      Submit Prayer Request
                    </Button>
                  </div>
                )}

                {/* Step 5: Completion */}
                {step === 5 && (
                  <div className="text-center py-4">
                    <div className="text-5xl mb-4 animate-bounce">🙏</div>
                    <p className="font-bold text-gray-900 mb-4">Prayer submitted successfully!</p>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all duration-300 font-bold text-sm"
                      onClick={resetForm}
                    >
                      Submit Another Prayer
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Support Features */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-700">
              How Prayer Support Works
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Connect, share, and receive spiritual support from our prayer leaders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Share Your Request</h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Communicate your prayer needs through SMS or WhatsApp for your preferred method
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">We Pray for You</h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Our dedicated prayer leaders intercede on your behalf with faith and passion
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Connected</h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  Receive updates and connect with prayer leaders for ongoing spiritual support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prayer Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confidential</h3>
                <p className="text-sm text-gray-700">Your prayer requests are kept completely private</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-700">Available anytime, day or night for your prayers</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-pink-50 to-pink-100 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🙏</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Faith-Based</h3>
                <p className="text-sm text-gray-700">Rooted in Scripture and God's power to transform</p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-cyan-50 to-cyan-100 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
                <p className="text-sm text-gray-700">Join thousands in a global prayer movement</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prayer Leaders Section */}
      <section className="py-20 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Our Prayer Leaders</h2>
            <p className="text-xl text-blue-100">Dedicated to interceding for your spiritual needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-8">
            <Card className="border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-white mb-2">Rev. Prince Appau</h3>
                <p className="text-blue-100 mb-4">Senior Prayer Leader</p>
                <div className="flex items-center justify-center gap-2 text-blue-100">
                  <Phone className="w-5 h-5" />
                  <a href="tel:+233243527174" className="hover:text-cyan-300 transition-colors">
                    +233 24 352 7174
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🙏</div>
                <h3 className="text-2xl font-bold text-white mb-2">Prayer Team</h3>
                <p className="text-blue-100 mb-4">Intercession Ministry</p>
                <div className="flex items-center justify-center gap-2 text-blue-100">
                  <Users className="w-5 h-5" />
                  <span>Dedicated Prayer Warriors</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-2xl overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Your Prayer Matters
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Don't carry your burdens alone. Share your prayer request and connect with our prayer leaders today.
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setStep(0)}
              >
                Start Prayer Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Prayer Support
              </h3>
              <p className="text-gray-300 leading-relaxed">
                24/7 intercession and spiritual support through our dedicated prayer team.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", link: "/" },
                  { name: "Services", link: "/services" },
                  { name: "Contact", link: "/contact" },
                  { name: "About", link: "/about" }
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <a href="tel:+233243527174" className="hover:text-cyan-400 transition-colors">
                    +233 24 352 7174
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <span>WhatsApp Available</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <span>24/7 Prayer Line</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Fathers Heart Chapel International. Prayer Line 24/7.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}