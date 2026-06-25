import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";

const RegisterEvent = () => {
  const [event, setEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [schoolError, setSchoolError] = useState("");
  const [gender, setGender] = useState("Male");
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
const eventQuery = id ? String(id) : "";

        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventQuery)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);
      } catch (error: any) {
        console.error("Error loading event:", error);
        toast({
          title: "Unable to load event",
          description: error?.message ?? "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [id, toast]);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const full_name = formData.get("fullName")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const phone = formData.get("phone")?.toString().trim() ?? "";
    const location = formData.get("location")?.toString().trim() ?? "";
    const school = formData.get("school")?.toString().trim() ?? "";
    const notes = formData.get("notes")?.toString().trim() ?? "";

    if (!school) {
      setSchoolError("Please enter your school or institution.");
      setIsSubmitting(false);
      return;
    }

    try {
      const eventQuery = id ? String(id) : "";

      // Call backend API to handle registration and SMS
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventQuery,
          event_name: event.title,
          full_name,
          email,
          phone,
          location,
          school,
          gender,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setIsSubmitting(false);
        toast({
          title: "Registration failed",
          description: result.error || "Unable to submit registration.",
          variant: "destructive",
        });
        return;
      }
      
      
      console.log("Registration submitted successfully:", result);

      setIsSuccess(true);
      
      const message = result.sms_sent 
        ? "Registration successful! An SMS confirmation has been sent to your phone."
        : "Registration successful! You will receive SMS confirmation shortly.";
      
      toast({
        title: "Registration successful",
        description: message,
      });
    } catch (error: any) {
      const errorMessage = error?.message || "Unable to submit registration.";
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = event?.start_date
    ? new Date(event.start_date).toLocaleDateString("en-GB", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "GMT",
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
          .toLocaleTimeString("en-GB", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC",
          })
          .replace(" GMT", " (GMT)");
      })()
    : "TBA";

  const eventDescription = event?.title?.includes("Pneumatikos")
    ? "Join the gathering of believers across the country and beyond at Pneumatikos Night 2026 – The Way of the Spirit with Rev. Prince Bediako Appau for the new age revival."
    : event?.description || 'Reserve your seat and join us for an unforgettable event experience with community, worship, and life-changing teaching.';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white/95 p-12 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="w-14 h-14 text-blue-600 animate-spin" />
            <div className="text-center">
              <p className="text-xl font-semibold text-slate-900">Loading event details</p>
              <p className="mt-2 text-slate-500">We're fetching your registration information. Please wait a moment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white flex items-center justify-center">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-12 shadow-2xl">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">Event not found</span>
            <h1 className="mt-6 text-5xl font-black text-slate-900">Something went missing.</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">The event you are trying to register for is unavailable.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden pb-24">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 opacity-20 blur-3xl" />
        <div className="container mx-auto px-3 sm:px-4 pt-12 sm:pt-16 md:pt-20">
          <div className="rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-slate-200 bg-white shadow-lg sm:shadow-xl lg:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 backdrop-blur-xl">
            <div className="grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div className="space-y-8">
                <div className="max-w-3xl">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-blue-700">Register for {event.title}</span>
                  <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">{event.title}</h1>
                  <p className="mt-3 sm:mt-6 text-sm sm:text-base md:text-lg leading-6 sm:leading-8 text-slate-600">{eventDescription}</p>
                </div>

                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                    <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-slate-500">Date</p>
                    <p className="mt-2 sm:mt-4 text-xl sm:text-2xl font-semibold text-slate-900">{formattedDate}</p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500">{formattedTime}</p>
                  </div>
                  <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                    <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-slate-500">Location</p>
                    <p className="mt-2 sm:mt-4 text-xl sm:text-2xl font-semibold text-slate-900">{event.location || 'Online / TBA'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl sm:rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-lg sm:shadow-2xl">
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-full bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-sky-100">Live</div>
                  </div>
                  <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                    <div className="rounded-2xl sm:rounded-3xl bg-white/10 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-sky-200">Event Type</p>
                      <p className="mt-1.5 sm:mt-2 text-base sm:text-lg font-semibold text-white">{event.event_type || 'Event'}</p>
                    </div>
                    <div className="rounded-2xl sm:rounded-3xl bg-white/10 p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-sky-200">Registration</p>
                      <p className="mt-1.5 sm:mt-2 text-base sm:text-lg font-semibold text-white">Open for all</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl sm:rounded-[2rem] border border-slate-200 bg-slate-50 p-4 sm:p-6 shadow-lg sm:shadow-xl">
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-slate-500">Secure your spot</p>
                    <h2 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-slate-900">Register Now</h2>
                  </div>
                  {isSuccess ? (
                    <div className="space-y-6 text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
                        <CheckCircle2 className="h-12 w-12" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">Registration Received</h3>
                        <p className="mt-3 text-slate-600">Thanks for registering. We’ll see you at the event!</p>
                      </div>

                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="fullName" className="font-bold text-sm sm:text-base text-slate-700">Full Name</Label>
                        <Input id="fullName" name="fullName" placeholder="Enter your full name" className="rounded-xl sm:rounded-2xl border-slate-200 h-10 sm:h-12 bg-white text-sm sm:text-base" required />
                      </div>
                      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="email" className="font-bold text-sm sm:text-base text-slate-700">Email Address</Label>
                          <Input id="email" name="email" type="email" placeholder="email@address.com" className="rounded-xl sm:rounded-2xl border-slate-200 h-10 sm:h-12 bg-white text-sm sm:text-base" required />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="phone" className="font-bold text-sm sm:text-base text-slate-700">Phone Number</Label>
                          <Input id="phone" name="phone" placeholder="+233..." className="rounded-xl sm:rounded-2xl border-slate-200 h-10 sm:h-12 bg-white text-sm sm:text-base" required />
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="school" className="font-bold text-sm sm:text-base text-slate-700">School / Institution</Label>
                        <Input
                          id="school"
                          name="school"
                          placeholder="Enter your school or institution"
                          className="rounded-xl sm:rounded-2xl border-slate-200 h-10 sm:h-12 bg-white text-sm sm:text-base"
                          onChange={() => schoolError && setSchoolError("")}
                          required
                        />
                        {schoolError && <p className="text-red-500 text-xs sm:text-sm mt-1">{schoolError}</p>}
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="location" className="font-bold text-sm sm:text-base text-slate-700">Location</Label>
                        <Input id="location" name="location" placeholder="City / Country" className="rounded-xl sm:rounded-2xl border-slate-200 h-10 sm:h-12 bg-white text-sm sm:text-base" required />
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="gender" className="font-bold text-sm sm:text-base text-slate-700">Gender</Label>
                        <select
                          id="gender"
                          name="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full rounded-xl sm:rounded-2xl border border-slate-200 h-10 sm:h-12 bg-white px-3 text-sm sm:text-base"
                        >
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="notes" className="font-bold text-sm sm:text-base text-slate-700">Special Notes (Optional)</Label>
                        <Textarea id="notes" name="notes" placeholder="Any specific requirements?" className="rounded-xl sm:rounded-2xl border-slate-200 bg-white resize-none text-sm sm:text-base" rows={3} />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 h-11 sm:h-14 font-black text-base sm:text-lg rounded-full shadow-lg transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="h-5 sm:h-6 w-5 sm:w-6 animate-spin" /> : "Confirm Registration"}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEvent;
