import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

import {
  Heart,
  Sparkles,
  Globe,
  Users,
  CreditCard,
  Smartphone,
  Building,
} from "lucide-react";

import { partnershipLevels } from "@/data/PartnershipLevels";
import { paystackConfig } from "@/config/paystack";

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

const GivePage = () => {
  const { type } = useParams<{ type?: string }>();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("GHS");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [frequency, setFrequency] = useState("one-time");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const paystackRef = useRef<any>(null);

  // Match type param to partnership level slug
  const level = partnershipLevels.find((lvl) => lvl.slug === type);

  // Partnership level view
  if (level) {
    const Icon = level.icon;

    // Extract numeric amount from string like "$50/month"
    const numericAmount = parseInt(level.amount.replace(/[^0-9]/g, ""));

    const handlePartnershipPayment = () => {
      if (!email) {
        toast({
          title: "Email Required",
          description: "Please enter your email address to proceed",
          variant: "destructive",
        });
        return;
      }

      setIsProcessing(true);

      const handler = (window as any).PaystackPop.setup({
        key: paystackConfig.publicKey,
        email: email,
        amount: numericAmount * 100,
        currency: "USD",
        ref: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        onClose: () => {
          toast({
            title: "Payment Cancelled",
            description: "Partnership registration was not completed",
          });
          setIsProcessing(false);
        },
        onSuccess: (response: any) => {
          toast({
            title: "🎉 Partnership Successful!",
            description: `Thank you for becoming a ${level.title}. Transaction ref: ${response.reference}`,
          });
          setIsProcessing(false);
          setEmail("");
        },
      });
      handler.openIframe();
    };

    return (
      <div className="min-h-screen py-20 bg-muted/30 ">
        <div className="container mx-auto max-w-3xl px-4">
          <Card className="shadow-xl">
            <CardContent className="p-8 text-center">
              <div
                className={`bg-gradient-to-r ${level.color} p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-2">{level.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{level.amount}</p>

              <ul className="space-y-3 text-left max-w-md mx-auto mb-8">
                {level.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span>✅</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-6">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-lg h-12 mb-4"
                />
              </div>

              <Button
                onClick={handlePartnershipPayment}
                disabled={!email || isProcessing}
                className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold"
              >
                {isProcessing ? "Processing..." : `Become a ${level.title}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Regular giving flow fallback UI
  const giveTypes = {
    offering: {
      title: "Offering",
      subtitle: "Support Our Ministry",
      description:
        "Your offering supports the daily operations of our church and enables us to serve our community with excellence.",
      icon: Heart,
      gradient: "from-blue-950 to-cyan-600/70",
      suggestedAmounts: [50, 100, 200, 500],
    },
    tithe: {
      title: "Tithe",
      subtitle: "Honor God with Your First Fruits",
      description:
        "Tithing is a biblical principle of giving the first 10% of your income to God through His church.",
      icon: Globe,
      gradient: "from-accent to-cyan-400",
      suggestedAmounts: [100, 200, 400, 1000],
    },
    seed: {
      title: "Seed Offering",
      subtitle: "Sow into Your Future",
      description:
        "Plant a seed of faith for a harvest of blessings. Your seed offering is an investment in God's kingdom and your future.",
      icon: Sparkles,
      gradient: "from-secondary to-yellow-400",
      suggestedAmounts: [50, 200, 1000, 2000],
    },
    partnership: {
      title: "Partnership",
      subtitle: "Join Our Kingdom Mission",
      description:
        "Partner with us monthly to advance God's kingdom and impact lives around the world.",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      suggestedAmounts: [100, 200, 500, 1000],
    },
    mocwo: {
      title: "MOCWO Support",
      subtitle: "Support School Missions",
      description:
        "Support our outreach programs to be a blessing to millions of youths and students.",
      icon: Users,
      gradient: "from-green-500 to-emerald-400",
      suggestedAmounts: [50, 150, 300, 600],
    },
  };

  const currentGive =
    giveTypes[type as keyof typeof giveTypes] || giveTypes.offering;
  const Icon = currentGive.icon;

  const currencies = [
    { code: "GHS", symbol: "₵", name: "Cedis" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "ZWL", symbol: "Z$", name: "Zimbabwean Dollar" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "EUR", symbol: "€", name: "Euro" },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Secure payment via Visa, Mastercard, or American Express",
    },
    {
      id: "mobile",
      name: "Mobile Money",
      icon: Smartphone,
      description: "MTN MoMo, Vodafone Cash, or AirtelTigo Money",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct bank transfer or EFT",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!amount || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please select an amount and payment method",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "mobile" && !mobileNumber) {
      toast({
        title: "Mobile Number Required",
        description: "Please enter your mobile money number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === "card") {
      // Use Paystack for card payments
      initiatePaystackPayment("card");
    } else if (paymentMethod === "mobile") {
      // Use Paystack with mobile money channel
      initiatePaystackPayment("mobile_money", mobileNumber);
    } else if (paymentMethod === "bank") {
      // Use Paystack with bank transfer channel
      initiatePaystackPayment("bank_transfer");
    }
  };

  const initiatePaystackPayment = (paymentChannel: string, phone?: string) => {
    const numericAmount = parseInt(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Initialize Paystack payment
    const paymentConfig: any = {
      key: paystackConfig.publicKey,
      email: email,
      amount: numericAmount * 100, // Paystack expects amount in kobo/cents
      currency: currency,
      ref: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      channels: [paymentChannel],
    };

    // Add phone number for mobile money
    if (phone && paymentChannel === "mobile_money") {
      paymentConfig.phone = phone;
    }

    const handler = (window as any).PaystackPop.setup({
      ...paymentConfig,
      onClose: () => {
        toast({
          title: "Payment Cancelled",
          description: "Your payment was not completed",
        });
        setIsProcessing(false);
      },
      onSuccess: (response: any) => {
        toast({
          title: "Payment Successful! 🎉",
          description: `Thank you for your ${currentGive.title}. Transaction ref: ${response.reference}`,
        });
        setIsProcessing(false);
        // Reset form
        setAmount("");
        setEmail("");
        setPaymentMethod("");
        setMobileNumber("");
      },
    });
    handler.openIframe();
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-600/70 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentGive.gradient} flex items-center justify-center mx-auto mb-6 shadow-glow`}
            >
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {currentGive.title}
            </h1>
            <p className="text-2xl mb-4 font-semibold">{currentGive.subtitle}</p>
            <p className="text-xl opacity-90">{currentGive.description}</p>
          </div>
        </div>
      </section>

      {/* Giving Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-divine">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Complete Your {currentGive.title}
                </CardTitle>
                <p className="text-muted-foreground">
                  Thank you for your generous heart. Your gift makes a difference.
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-lg font-semibold mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-lg h-12"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">
                      Select Amount
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {currentGive.suggestedAmounts.map((suggestedAmount) => (
                        <Button
                          key={suggestedAmount}
                          type="button"
                          variant={
                            amount === suggestedAmount.toString()
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setAmount(suggestedAmount.toString())}
                          className="h-12"
                        >
                          ₵{suggestedAmount}
                        </Button>
                      ))}
                    </div>
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <Label htmlFor="amount">Custom Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="text-lg h-12"
                        />
                      </div>
                      <div className="w-32">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((curr) => (
                              <SelectItem key={curr.code} value={curr.code}>
                                {curr.symbol} {curr.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Frequency */}
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">
                      Frequency
                    </Label>
                    <RadioGroup value={frequency} onValueChange={setFrequency}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time">One-time gift</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly (recurring)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Weekly (recurring)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">
                      Payment Method
                    </Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      {paymentMethods.map(({ id, name, icon: Icon, description }) => (
                        <div
                          key={id}
                          className="flex items-center space-x-3 mb-3 cursor-pointer rounded-lg border border-muted p-3"
                        >
                          <RadioGroupItem value={id} id={id} />
                          <Icon className="w-6 h-6 text-primary" />
                          <div>
                            <Label htmlFor={id} className="font-semibold">
                              {name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Mobile Number (only for Mobile Money) */}
                  {paymentMethod === "mobile" && (
                    <div>
                      <Label htmlFor="mobile" className="text-lg font-semibold mb-2 block">
                        Mobile Money Number
                      </Label>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg mb-4 text-center">
                        <p className="text-sm text-blue-800 font-medium italic">Recipient MoMo Number: <span className="font-bold">024 287 5432</span></p>
                      </div>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="e.g., 024 123 4567"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="text-lg h-12"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter the mobile money number payment will be made from
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={!amount || !paymentMethod || !email || isProcessing || (paymentMethod === "mobile" && !mobileNumber)}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-950 via-blue-800 to-cyan-600/70"
                  >
                    {isProcessing ? "Processing..." : "Give Now"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GivePage;
