import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import pneuma1 from "@/assets/pnuema1.png";
import Footer from "@/components/Footer";
import Navigation from "@/components/layout/Navigation";

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("is_active", true)
          .order("start_date", { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (error: any) {
        console.error("Error loading events:", error);
        toast({
          title: "Unable to load events",
          description: error?.message ?? "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="container mx-auto px-4 py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-4 tracking-tight">Upcoming Events</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Join our upcoming programs and register for the events that inspire and equip you.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium animate-pulse">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-slate-700 mb-6">No upcoming events found at this time.</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8" onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {events.map((event) => {
              const coverImage = event.title?.toLowerCase().includes("pneumatikos") ? pneuma1 : null;
              const formattedDate = event.start_date
                ? new Date(event.start_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "TBA";

              return (
                <Card key={event.id} className="overflow-hidden border-0 shadow-card hover:shadow-divine transition-all group">
                  <CardHeader className="p-6">
                    {coverImage && (
                      <div className="h-52 overflow-hidden relative rounded-3xl mb-4">
                        <img src={coverImage} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                      </div>
                    )}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-blue-900">{event.title}</CardTitle>
                        <p className="mt-3 text-sm text-slate-600 line-clamp-3">
                          {event.description || "A powerful event experience."}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                        {event.event_type || "Event"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 font-bold rounded-full"
                      onClick={() => navigate(`/register-event/${event.id}`)}
                    >
                      Register to Attend
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Events;
