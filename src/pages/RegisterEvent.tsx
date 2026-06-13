import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { news } from "@/data/news";
import { Calendar, MapPin, User, Mail, Phone, Loader2, ArrowLeft, CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Navigation from "@/components/layout/Navigation";
import hero5 from "@/assets/hero5.jpeg";

const RegisterEvent = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [schoolError, setSchoolError] = useState("");
  const [eventList, setEventList] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      event_id: selectedEvent.id.toString(),
      event_name: selectedEvent.title,
      full_name: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      school: formData.get("school") as string,
      notes: formData.get("notes") as string,
    };

    if (!data.school.trim()) {
      setSchoolError("Please enter your school or institution.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("event_registrations").insert([data]);
      if (error) throw error;
      
      setIsSuccess(true);
      toast({
        title: "Registration Successful!",
        description: `You have successfully registered for ${selectedEvent.title}.`,
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setSchoolError(""); // Clear error on successful submission
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .order('start_date', { ascending: true });

        if (eventsError) throw eventsError;

        const { data: regsData, error: regsError } = await supabase
          .from('event_registrations')
          .select('event_id');
        if (regsError) throw regsError;

        const registrationCounts = regsData.reduce((acc: Record<string, number>, reg: any) => {
          acc[reg.event_id] = (acc[reg.event_id] || 0) + 1;
          return acc;
        }, {});

        const mappedEvents = (eventsData || []).map(ev => ({
          ...ev,
          registrationCount: registrationCounts[ev.id] || 0,
          image: hero5 // Default image for DB events, replace with actual image field if available
        }));
        setEventList(mappedEvents);
      } catch (err) {
        console.error("Error loading events:", err);
        // Fallback to news if DB table is empty or error occurs
        setEventList(news.filter(item => item.category === "Event" || item.category === "Camp"));
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="container mx-auto px-4 py-32">
        <Button 
          variant="ghost" 
          className="mb-8 hover:bg-blue-50 text-blue-700 font-bold"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-4 tracking-tight">Register for an Event</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Join us for powerful encounters and spiritual renewal. Select an event below to register.
          </p>
        </div>

        {isLoadingEvents ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Loading upcoming programs...</p>
          </div>
        ) : !isSuccess ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventList.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-slate-500">No upcoming events found at this time.</p>
              </div>
            ) : eventList.map((event) => (
              <Card key={event.id} className="overflow-hidden border-0 shadow-card hover:shadow-divine transition-all group">
                <div className="h-48 overflow-hidden relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {event.category}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-blue-900">{event.title}</CardTitle>
                  <CardDescription className="space-y-1.5 mt-2">
                    <div className="flex items-center gap-2 font-bold text-blue-600">
                      <Calendar className="h-4 w-4" /> {event.date}
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-500 text-xs">
                      <Users className="h-3.5 w-3.5" /> 
                      {event.registrationCount} {event.registrationCount === 1 ? 'person registered' : 'people registered'}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2">{event.excerpt}</p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 font-bold rounded-full"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Register to Attend
                  </Button>
                  {event.capacity > 0 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min((event.registrationCount / event.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 text-right">
                        {event.registrationCount} / {event.capacity} registered
                        {event.registrationCount >= event.capacity && <span className="text-red-500 font-bold ml-1"> (FULL)</span>}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )) }
          </div>
        ) : (
          <Card className="max-w-md mx-auto border-0 shadow-divine text-center p-12 animate-in zoom-in-95 duration-300 rounded-3xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-blue-900 mb-2">Registration Received!</h2>
            <p className="text-slate-600 mb-8 font-medium">
              We have received your registration for <strong>{selectedEvent?.title}</strong>. We look forward to seeing you!
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 font-bold rounded-full px-8"
              onClick={() => {
                setIsSuccess(false);
                setSelectedEvent(null);
              }}
            >
              Done
            </Button>
          </Card>
        )}
      </div>

      {/* Popup Registration Form */}
      {selectedEvent && !isSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-10 duration-300 rounded-3xl overflow-hidden border-0 my-auto">
            <div className="bg-gradient-to-r from-blue-950 to-blue-800 p-8 text-white relative">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black mb-1">Event Registration</h2>
              <p className="opacity-80 text-sm font-bold uppercase tracking-wider">{selectedEvent.title}</p>
            </div>
            <CardContent className="p-8">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-bold text-slate-700">Full Name</Label>
                  <Input id="fullName" name="fullName" placeholder="Enter your name" className="rounded-xl border-slate-200 h-12" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-slate-700">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="email@address.com" className="rounded-xl border-slate-200 h-12" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold text-slate-700">Phone Number</Label>
                    <Input id="phone" name="phone" placeholder="+233..." className="rounded-xl border-slate-200 h-12" required />
                  </div>
                </div>
              <div className="space-y-2">
                <Label htmlFor="school" className="font-bold text-slate-700">School / Institution</Label>
                <Input 
                  id="school" 
                  name="school" 
                  placeholder="Enter your school or institution" 
                  className="rounded-xl border-slate-200 h-12"
                  onChange={() => { if (schoolError) setSchoolError(""); }}
                />
                {schoolError && <p className="text-red-500 text-sm mt-1">{schoolError}</p>}
              </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="font-bold text-slate-700">Location</Label>
                  <Input id="location" name="location" placeholder="City / Country" className="rounded-xl border-slate-200 h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-bold text-slate-700">Special Notes (Optional)</Label>
                  <Textarea id="notes" name="notes" placeholder="Any specific requirements?" className="rounded-xl border-slate-200 resize-none" rows={2} />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-14 font-black text-lg rounded-full shadow-lg transition-all mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Confirm My Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default RegisterEvent;