import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import pneuma1 from "@/assets/pnuema1.png";

const Events = () => {
  const [event, setEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNextEvent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("is_active", true)
          .order("start_date", { ascending: true })
          .limit(1);

        if (error) throw error;
        setEvent(data?.[0] ?? null);
      } catch (err: any) {
        console.error("Error loading event:", err);
        toast({ title: "Unable to load event", description: err?.message ?? "Please try again later.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNextEvent();
  }, [toast]);

  const formattedDate = event?.start_date
    ? new Date(event.start_date).toLocaleDateString("en-GB", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "TBA";

  const formattedTime = event?.start_date
    ? (() => {
        const d = new Date(event.start_date);
        const y = d.getUTCFullYear();
        const m = d.getUTCMonth();
        const day = d.getUTCDate();
        const forced = new Date(Date.UTC(y, m, day, 19, 0, 0));
        return forced
          .toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC" })
          .replace(" GMT", " (GMT)");
      })()
    : "7:00 PM (GMT)";

  const eventDescription = event?.title?.includes("Pneumatikos")
    ? "Join the gathering of believers across the country and beyond at Pneumatikos Night 2026 – The Way of the Spirit with Rev. Prince Bediako Appau for the new age revival."
    : event?.description || 'An energetic event designed for young people who want to connect, celebrate, and grow together.';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
        <Loader2 className="h-16 w-16 text-sky-300 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
        <div className="text-center">
          <p className="text-xl font-semibold">No upcoming event</p>
        </div>
      </div>
    );
  }

  const imageSrc = event.image || pneuma1;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.15),_transparent_20%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white px-4 py-14">
      <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-slate-950/80 shadow-[0_35px_120px_-25px_rgba(14,165,233,0.45)] backdrop-blur-xl overflow-hidden">
        <div className="relative">
          <img src={imageSrc} alt={event.title || 'Event'} className="w-full h-72 object-cover brightness-90" />
          <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-slate-950/40 via-slate-950/10 to-transparent" />
          <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-sky-400/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100 shadow-lg shadow-sky-700/20 backdrop-blur-xl">
            <span className="inline-flex h-2 w-2 rounded-full bg-sky-300 animate-pulse" />
            Featured Event
          </div>
        </div>

        <div className="space-y-6 p-8 sm:p-10">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.9)]">
            <div className="flex flex-wrap items-center gap-3 text-slate-300">
              <span className="rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">{event.event_type || 'Youth Gathering'}</span>
              <span className="text-xs uppercase tracking-[0.28em] text-slate-500">{event.location || 'Online / TBA'}</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{event.title}</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">{eventDescription}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800/70 bg-slate-950/95 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Date</p>
              <p className="mt-3 text-2xl font-bold text-white">{formattedDate}</p>
              <p className="mt-2 text-sm text-slate-400">{formattedTime}</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800/70 bg-slate-950/95 p-5 shadow-lg shadow-slate-950/20">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</p>
              <p className="mt-3 text-2xl font-bold text-white">{event.location || 'Online / TBA'}</p>
              {event.registration_link && <p className="mt-2 text-sm text-slate-400">Link available</p>}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button onClick={() => navigate(`/register-event/${event.id}`)} className="flex-1 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 px-6 py-4 text-lg font-black text-slate-950 shadow-xl shadow-cyan-500/25 hover:scale-[1.01] transition-transform">
              Register Now
            </Button>
            {event.registration_link && (
              <a href={event.registration_link} target="_blank" rel="noreferrer" className="flex-1">
                <Button className="w-full rounded-full border border-slate-700 bg-white/10 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-slate-950/20 hover:bg-white/15">
                  Open Link
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;


