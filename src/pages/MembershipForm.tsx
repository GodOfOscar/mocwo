// src/pages/MembershipForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MembershipForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    dateOfBirth: "",
    maritalStatus: "single",
    occupation: "",
    church: "",
    howDidYouHear: "",
    interests: [] as string[],
    message: "",
  });

  const interests = [
    "Missions & Outreach",
    "Discipleship & Mentorship",
    "Worship & Music",
    "Prayer Ministry",
    "Community Service",
    "Bible Study",
    "Youth Ministry",
    "Counseling & Support"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await (supabase as any)
        .from('membership_requests')
        .insert([{
          first_name: formData.fullName.split(' ')[0],
          last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth || null,
          gender: null,
          marital_status: formData.maritalStatus,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          membership_type: 'member',
          message: formData.message,
          status: 'approved'
        }]);

      if (error) throw error;
      
      toast({
        title: "Welcome to Our Family! 🙏",
        description: "Thank you for joining us. You are now an approved member!",
        duration: 5000,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        dateOfBirth: "",
        maritalStatus: "single",
        occupation: "",
        church: "",
        howDidYouHear: "",
        interests: [],
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-rose-500 mr-2" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Join Our Family</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Welcome to Martyrs of Christ World Outreach
          </p>
          <p className="text-gray-500">
            Fill out the form below to officially become part of our community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">1</span>
                Personal Information
              </CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="font-semibold">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="font-semibold">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="font-semibold">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth" className="font-semibold">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maritalStatus" className="font-semibold">Marital Status</Label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="occupation" className="font-semibold">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Your job title or profession"
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">2</span>
                Address Information
              </CardTitle>
              <CardDescription>Where can we find you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="address" className="font-semibold">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="city" className="font-semibold">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="font-semibold">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State/Province"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="font-semibold">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Church Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">3</span>
                Church Information
              </CardTitle>
              <CardDescription>Help us know your spiritual background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="church" className="font-semibold">Home Church / Assembly</Label>
                <Input
                  id="church"
                  name="church"
                  value={formData.church}
                  onChange={handleChange}
                  placeholder="Name of your church or assembly"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="howDidYouHear" className="font-semibold">How did you hear about us?</Label>
                <select
                  id="howDidYouHear"
                  name="howDidYouHear"
                  value={formData.howDidYouHear}
                  onChange={handleChange}
                  className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select an option</option>
                  <option value="social-media">Social Media</option>
                  <option value="friend-family">Friend/Family</option>
                  <option value="website">Website</option>
                  <option value="event">Event</option>
                  <option value="church">Church Visit</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Interests Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">4</span>
                Areas of Interest
              </CardTitle>
              <CardDescription>Select all that apply</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interests.map((interest) => (
                  <label key={interest} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">5</span>
                Additional Message
              </CardTitle>
              <CardDescription>Tell us anything else we should know</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Share any prayer requests, testimonies, or additional information..."
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4 justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold"
            >
              {loading ? "Submitting..." : "Join Our Family"}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
              className="px-8 py-6 text-lg font-semibold"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Contact Info Footer */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Mail className="text-blue-600 mb-3" size={32} />
            <p className="font-semibold text-gray-900">Email</p>
            <p className="text-gray-600">contact@moc.org</p>
          </div>
          <div className="flex flex-col items-center">
            <Phone className="text-blue-600 mb-3" size={32} />
            <p className="font-semibold text-gray-900">Phone</p>
            <p className="text-gray-600">+1 (555) 000-0000</p>
          </div>
          <div className="flex flex-col items-center">
            <MapPin className="text-blue-600 mb-3" size={32} />
            <p className="font-semibold text-gray-900">Address</p>
            <p className="text-gray-600">Your City, Country</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipForm;
