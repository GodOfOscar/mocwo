import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import { Crown, Star, Sparkles, Heart, TrendingUp, Shield, Award, Handshake, CheckCircle, Users, Globe, BookOpen, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Zap, Target, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import HeroCarousel from "@/components/ui/hero-carousel";
import { useToast } from "@/components/ui/use-toast";
import { paystackConfig } from "@/config/paystack";

import hero1 from "../assets/hero1.jpeg";
import tImage from "../assets/t.jpg";
import vImage from "../assets/v.jpg";

// Load all m(...) images from assets with Vite glob (relative path works in this module)
const mImageModules = import.meta.glob("../assets/m*.{jpg,jpeg}", { eager: true, query: '?url', import: 'default' });

// Explicitly include m(1) through m(30); use both .jpg and .jpeg extension options.
const mImages = Array.from({ length: 30 }, (_, i) => {
  const basename = `m (${i + 1})`;
  const jpegKey = `../assets/${basename}.jpeg`;
  const jpgKey = `../assets/${basename}.jpg`;
  return (mImageModules[jpegKey] as string | undefined) || (mImageModules[jpgKey] as string | undefined) || null;
})
  .filter((img): img is string => !!img);

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

console.log("Partnership mImages loaded:", mImages.length, mImages);

const Partnership = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
    amount: "",
    paymentMethod: "",
    message: ""
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [carouselSlides, setCarouselSlides] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("carousel_images")
        .select("*")
        .eq("page", "partnership")
        .order("order_index", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Use carousel images from database
        const ctaTexts = ["Partner With Us", "Partner With Us", "Explore Levels"];
        const ctaLinks = ["/membership", "/partnership", "#partnership-levels"];

        const slides = data.map((img: any, idx: number) => ({
          id: img.id,
          title: `Partnership Highlight`,
          subtitle: "Our mission is to impact nations together",
          description: "Partner with us to empower outreach, transform communities, and share the gospel across the world.",
          location: "Global Ministry",
          image: img.image_url,
          ctaText: ctaTexts[idx % ctaTexts.length],
          ctaLink: ctaLinks[idx % ctaLinks.length]
        }));
        setCarouselSlides(slides);
      } else {
        // Fall back to hardcoded images
        const allCarouselImages = [tImage, vImage, ...mImages];

        const slides = allCarouselImages.length > 0
          ? allCarouselImages.map((img, idx) => ({
              id: idx + 1,
              title: `Partnership Highlights ${idx + 1}`,
              subtitle: "Our mission is to impact nations together",
              description: "Partner with us to empower outreach, transform communities, and share the gospel across the world.",
              location: "Global Ministry",
              image: img,
              ctaText: "Partner With Us",
              ctaLink: "/partnership"
            }))
          : [
              {
                title: "Kingdom Partnership in Action",
                subtitle: "Join hands with Fathers Heart Chapel Int'l",
                description: "Partner with us to empower outreach, support vulnerable communities, and spread the Gospel worldwide.",
                location: "Worldwide",
                image: hero1,
                ctaText: "Join Our Family",
                ctaLink: "/membership"
              }
            ];
        setCarouselSlides(slides);
      }
    } catch (error) {
      console.error("Error fetching carousel images:", error);
      // Fall back to default images on error
      const allCarouselImages = [tImage, vImage, ...mImages];

      const slides = allCarouselImages.map((img, idx) => ({
        id: idx + 1,
        title: `Partnership Highlights ${idx + 1}`,
        subtitle: "Our mission is to impact nations together",
        description: "Partner with us to empower outreach, transform communities, and share the gospel across the world.",
        location: "Global Ministry",
        image: img,
        ctaText: "Partner With Us",
        ctaLink: "/partnership"
      }));
      setCarouselSlides(slides);
    }
  };

  const partnershipLevels = [
    {
      title: "Bronze Partner",
      amount: "₵ 50/month",
      icon: Heart,
      color: "from-orange-400 to-orange-600",
      description: "Planting seeds of hope and joining our global intercession family",
      benefits: [
        "Monthly prayer support",
        "Access to partner events",
        "Digital resources",
        "Ministry updates",
      ]
    },
    {
      title: "Silver Partner",
      amount: "₵ 100/month",
      icon: Star,
      color: "from-gray-400 to-gray-600",
      description: "Walking closer with us as we transform communities together",
      benefits: [
        "All Bronze benefits",
        "Pastoral Engagement",
        "Physical resource gifts",
        "Priority prayer requests",
        "Special recognition",
      ]
    },
    {
      title: "Gold Partner",
      amount: "₵ 250/month",
      icon: Sparkles,
      color: "from-yellow-400 to-yellow-600",
      description: "Leading the charge in global mission and kingdom advancement",
      benefits: [
        "All Silver benefits",
        "Annual partner retreat",
        "One-on-one prayer sessions",
        "Exclusive content access",
        "Ministry impact reports",
      ]
    },

  ];

  const partnershipMinimums: Record<string, number> = {
    "Bronze Partner": 50,
    "Silver Partner": 100,
    "Gold Partner": 250,
    custom: 250,
  };

  const getMinimumAmount = (level: string) => partnershipMinimums[level] ?? 0;

  const handleInputChange = (field: string, value: string) => {
    if (field === "level") {
      const minAmount = getMinimumAmount(value);
      setFormData(prev => ({
        ...prev,
        level: value,
        amount: value === "custom" ? prev.amount : String(minAmount),
      }));
      return;
    }

    if (field === "amount") {
      const selectedLevel = formData.level || "custom";
      const minAmount = getMinimumAmount(selectedLevel);
      const amountNumber = Number(value);
      if (value === "" || Number.isNaN(amountNumber)) {
        setFormData(prev => ({ ...prev, amount: value }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        amount: amountNumber < minAmount ? String(minAmount) : String(amountNumber),
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.amount || !formData.paymentMethod) {
      toast({
        title: "Required Fields",
        description: "Please fill in your email, amount and payment method.",
        variant: "destructive",
      });
      return;
    }

    const selectedLevel = formData.level || "custom";
    const minimumAmount = getMinimumAmount(selectedLevel);
    const amountNumber = Number(formData.amount);

    if (Number.isNaN(amountNumber) || amountNumber < minimumAmount) {
      toast({
        title: "Invalid Amount",
        description: `The selected partnership level requires a minimum of ₵ ${minimumAmount}.`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Lead user to the respective payment method
    if (formData.paymentMethod === 'card' || formData.paymentMethod === 'mobile-money') {
      const handler = (window as any).PaystackPop.setup({
        key: paystackConfig.publicKey,
        email: formData.email,
        amount: parseFloat(formData.amount) * 100, // Amount in pesewas/kobo
        currency: "GHS",
        ref: `PARTNER-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        onClose: () => {
          toast({
            title: "Payment Required",
            description: "Please complete the payment process to submit your partnership application.",
          });
          setIsProcessing(false);
        },
        onSuccess: (response: any) => {
          savePartnershipData(response.reference);
        },
      });
      handler.openIframe();
    } else {
      // For manual verification methods
      if (formData.paymentMethod === 'bank-transfer') {
        toast({
          title: "Awaiting Transfer",
          description: "Please follow the bank transfer instructions below. Your application will be processed once verified.",
        });
      }
      // Submit for manual verification
      savePartnershipData("MANUAL_VERIFICATION_REQUIRED");
    }
  };

  const savePartnershipData = async (reference: string) => {
    try {
      const { error } = await supabase
        .from('partnerships')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          level: formData.level,
          amount: parseFloat(formData.amount) || 0,
          payment_method: formData.paymentMethod,
          message: `${formData.message} | Reference: ${reference}`,
          status: reference === "MANUAL_VERIFICATION_REQUIRED" ? 'pending' : 'approved'
        }]);

      if (error) throw error;

      toast({
        title: "Success! 🙏",
        description: "Redirecting to your partnership summary...",
      });

      // Redirect to success page with data
      navigate('/partnership-success', { 
        state: { 
          name: formData.name, 
          level: formData.level, 
          amount: formData.amount 
        } 
      });
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden">
      
      {/* Hero Carousel */}
      <HeroCarousel slides={carouselSlides} showContent={false} cardMode={true} />

      {/* Dancing text animation */}
      <div className="relative overflow-hidden h-14 bg-gradient-to-r from-sky-700/30 via-blue-700/30 to-sky-700/30 border border-blue-400/80 mt-4 mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="inline-flex whitespace-nowrap text-lg sm:text-3xl font-extrabold text-white tracking-widest animate-marquee">
            <span className="mx-8">Partner with us to empower communities</span>
            <span className="mx-8">Partner with us and multiply your impact</span>
            <span className="mx-8">Partner with us to feed, shelter & educate</span>
            <span className="mx-8">Partner with us for sustainable outreach</span>
            <span className="mx-8">Partner with us and transform lives globally</span>
            <span className="mx-8">Partner with us and join our kingdom mission</span>
            <span className="mx-8">Partner with us to empower communities</span>
            <span className="mx-8">Partner with us and multiply your impact</span>
            <span className="mx-8">Partner with us to feed, shelter & educate</span>
            <span className="mx-8">Partner with us for sustainable outreach</span>
            <span className="mx-8">Partner with us and transform lives globally</span>
            <span className="mx-8">Partner with us and join our kingdom mission</span>
          </div>
        </div>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-marquee { animation: marquee 20s linear infinite; display: inline-flex; }
            .animate-marquee:hover { animation-play-state: paused; }
      `}</style>

      {/* Partnership Levels */}
      <section id="partnership-levels" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-300 mb-6">
              <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">Levels</p>
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-700">
              Partnership Levels
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Choose the level of partnership that aligns with your heart and capacity
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {partnershipLevels.map((level, index) => {
              const Icon = level.icon;
              return (
                <Card
                  key={index}
                  className="mx-auto w-full max-w-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 group overflow-hidden relative"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${level.color}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <CardHeader className="text-center pb-2 relative z-10">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{level.title}</CardTitle>
                    <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600 mt-2">{level.amount}</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">{level.description}</p>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <ul className="space-y-3 mb-6">
                      {level.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 font-medium">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>


      {/* Payment Methods Section */}
      <section className="py-20 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Secure Payment Options</h2>
            <p className="text-blue-100 text-lg">Multiple ways to support the ministry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🏦</div>
                <h3 className="text-xl font-bold text-white mb-3">Bank Transfer</h3>
                <p className="text-blue-100">Direct bank transfers for secure and reliable giving</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-white mb-3">Mobile Money</h3>
                <p className="text-blue-100 mb-3">Convenient mobile payments for easy giving</p>
                <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <p className="text-sm font-black text-white tracking-wider">024 287 5432</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">💳</div>
                <h3 className="text-xl font-bold text-white mb-3">Online Payments</h3>
                <p className="text-blue-100">Secure PayPal and credit card payments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Partnership Application Form */}
      <section id="application" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-300 mb-6">
                <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">Application</p>
              </div>
              <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-700">
                Begin Your Partnership
              </h2>
              <p className="text-xl text-gray-700 font-medium">
                Take the first step in your kingdom partnership journey
              </p>
            </div>

            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-500" />
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-bold mb-2 block">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        className="border-2 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-bold mb-2 block">Email Address *</Label>
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
                    <Label htmlFor="phone" className="text-gray-700 font-bold mb-2 block">Phone Number</Label>
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
                    <Label htmlFor="level" className="text-gray-700 font-bold mb-2 block">Partnership Level *</Label>
                    <Select onValueChange={(value) => handleInputChange("level", value)}>
                      <SelectTrigger className="border-2 focus:border-blue-500 transition-all">
                        <SelectValue placeholder="Select partnership level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bronze Partner"> Bronze Partner - ₵ 50/month</SelectItem>
                        <SelectItem value="Silver Partner"> Silver Partner - ₵ 100/month</SelectItem>
                        <SelectItem value="Gold Partner"> Gold Partner - ₵ 250/month</SelectItem>

                        <SelectItem value="custom"> Beyound 250</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount" className="text-gray-700 font-bold mb-2 block">Monthly Partnership Amount (₵)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      placeholder="Enter amount"
                      className="border-2 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod" className="text-gray-700 font-bold mb-2 block">Preferred Payment Method *</Label>
                    <Select onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                      <SelectTrigger className="border-2 focus:border-blue-500 transition-all">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank-transfer">🏦 Bank Transfer</SelectItem>
                        <SelectItem value="mobile-money">📱 Mobile Money</SelectItem>
                        <SelectItem value="paypal">💳 PayPal</SelectItem>
                        <SelectItem value="card">💳 Credit/Debit Card</SelectItem>
                        <SelectItem value="crypto">₿ Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 font-bold mb-2 block">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Share your vision for partnering with us...."
                      rows={5}
                      className="border-2 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-bold text-lg disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </span>
                    ) : (
                      "Submit Partnership Application"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Why Partnership Section */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-300 mb-6">
                <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">Partnership Mission</p>
              </div>
              <h2 className="text-5xl font-bold mb-4 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-700">
                  Building God's Kingdom Together
                </span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed font-medium">
                Partnership with Fathers Heart Chapel International is about being part of something BIGGER than yourself and reaching far beyond your personal sphere of influence.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Through your partnership, we're able to reach millions through satellite broadcasting, support missionary work, feed the hungry, care for orphans, and build churches that transform communities across the globe.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#partnership-levels" className="scroll-smooth">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-bold w-full sm:w-auto"
                  >
                    Explore Levels
                  </Button>
                </a>
                <a href="#application" className="scroll-smooth">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold w-full sm:w-auto"
                  >
                    Apply Now
                  </Button>
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 rounded-2xl opacity-20 blur-xl animate-pulse" />
              <Card className="border-0 shadow-2xl overflow-hidden relative">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative flex items-center justify-center overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-cyan-600/40 z-10" />
                    <img
                      src={hero1}
                      alt="Partnership Ministry"
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500 max-w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section> */}

      {/* Partnership Impact Stats */}
      {/* <section className="py-20 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-3xl font-bold text-white mb-2">50+</h3>
                <p className="text-blue-100 font-semibold">Countries Reached</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-3xl font-bold text-white mb-2">$Millions</h3>
                <p className="text-blue-100 font-semibold">Invested in Ministry</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-3xl font-bold text-white mb-2">10K+</h3>
                <p className="text-blue-100 font-semibold">Active Partners</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      

      {/* Partnership Benefits */}
      {/* <section className="py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-700">
              Partnership Benefits
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Exclusive benefits and recognition for your commitment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Award, title: "Recognition", desc: "Acknowledged in annual partner appreciation events", color: "from-yellow-500 to-orange-500" },
              { icon: BookOpen, title: "Exclusive Access", desc: "Early access to new teachings, books, and resources", color: "from-blue-500 to-cyan-500" },
              { icon: Shield, title: "Prayer Coverage", desc: "Personalized prayer support from intercession team", color: "from-green-500 to-emerald-500" },
              { icon: Users, title: "Community", desc: "Connect with like-minded partners in exclusive network", color: "from-purple-500 to-pink-500" },
              { icon: TrendingUp, title: "Impact Reports", desc: "Detailed reports showing investment impact", color: "from-red-500 to-pink-500" },
              { icon: Heart, title: "Legacy Building", desc: "Build lasting legacy through kingdom investment", color: "from-rose-500 to-red-500" }
            ].map((benefit, idx) => {
              const BenefitIcon = benefit.icon;
              return (
                <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden relative">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color}`} />
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${benefit.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <BenefitIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-700 leading-relaxed font-medium">{benefit.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section> */}

      

      
      {/* Call to Action Section */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Card className="border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-2xl overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Make an Impact?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of partners who are transforming lives and impacting nations for God's kingdom. Your partnership matters.
              </p>
              <a href="#application" className="scroll-smooth">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Today
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
};

export default Partnership;