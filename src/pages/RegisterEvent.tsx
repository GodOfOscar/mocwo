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
  const [registrationCount, setRegistrationCount] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
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

        const { count: registrationCount = 0, error: countError } = await supabase
          .from("event_registrations")
          .select("id", { count: "exact", head: true })
          .eq("event_id", eventQuery);

        if (countError) throw countError;
        setRegistrationCount(registrationCount || 0);
        setDisplayedCount(0);
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

      // Check for existing registration by email or phone
      let alreadyRegistered = false;

      if (email) {
        const { count: emailCount, error: emailErr } = await supabase
          .from("event_registrations")
          .select("id", { count: "exact", head: true })
          .eq("event_id", eventQuery)
          .eq("email", email);

        if (emailErr) throw emailErr;
        if ((emailCount || 0) > 0) alreadyRegistered = true;
      }

      if (!alreadyRegistered && phone) {
        const { count: phoneCount, error: phoneErr } = await supabase
          .from("event_registrations")
          .select("id", { count: "exact", head: true })
          .eq("event_id", eventQuery)
          .eq("phone", phone);

        if (phoneErr) throw phoneErr;
        if ((phoneCount || 0) > 0) alreadyRegistered = true;
      }

      if (alreadyRegistered) {
        setIsSubmitting(false);
        toast({
          title: "Already registered",
          description: "You have already registered for this event using the same email or phone number.",
          variant: "destructive",
        });
        return;
      }

      const { error, data } = await supabase.from("event_registrations").insert([
        {
          event_id: eventQuery,
          event_name: event.title,
          full_name,
          email,
          phone,
          location,
          school,
          gender,
          notes,
        },
      ]);

      if (error) {
        console.error("Insert error:", error);
        throw error;
      }
      
      console.log("Registration inserted successfully:", data);

      setRegistrationCount((current) => current + 1);
      setIsSuccess(true);
      toast({
        title: "Registration successful",
        description: `You have successfully registered for ${event.title}.`,
      });
    } catch (error: any) {
      let errorMessage = "Unable to submit registration.";
      
      // Check for duplicate registration constraint violations
      if (error?.message?.includes("unique_event_email")) {
        errorMessage = "This email has already been registered for this event.";
      } else if (error?.message?.includes("unique_event_phone")) {
        errorMessage = "This phone number has already been registered for this event.";
      }
      
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

  useEffect(() => {
    if (registrationCount > 0) {
      let start = 0;
      const duration = 800;
      const increment = Math.max(1, Math.ceil(registrationCount / (duration / 30)));
      const interval = window.setInterval(() => {
        start += increment;
        if (start >= registrationCount) {
          setDisplayedCount(registrationCount);
          window.clearInterval(interval);
        } else {
          setDisplayedCount(start);
        }
      }, 30);

      return () => window.clearInterval(interval);
    }

    setDisplayedCount(registrationCount);
  }, [registrationCount]);

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
        <div className="container mx-auto px-4 pt-20">
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-2xl p-8 md:p-12 backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div className="space-y-8">
                <div className="max-w-3xl">
                  <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">Register for {event.title}</span>
                  <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">{event.title}</h1>
                  <p className="mt-6 text-lg leading-8 text-slate-600">{event.description || 'Reserve your seat and join us for an unforgettable event experience with community, worship, and life-changing teaching.'}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Date</p>
                    <p className="mt-4 text-2xl font-semibold text-slate-900">{formattedDate}</p>
                    <p className="mt-2 text-sm text-slate-500">{formattedTime}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Location</p>
                    <p className="mt-4 text-2xl font-semibold text-slate-900">{event.location || 'Online / TBA'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-2xl">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-sky-200">Attendee Count</p>
                      <p className="mt-2 text-4xl font-black text-white">{displayedCount}</p>
                    </div>
                    <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100">Live</div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl bg-white/10 p-4">
                      <p className="text-sm text-sky-200">Event Type</p>
                      <p className="mt-2 text-lg font-semibold text-white">{event.event_type || 'Event'}</p>
                    </div>
                    <div className="rounded-3xl bg-white/10 p-4">
                      <p className="text-sm text-sky-200">Registration</p>
                      <p className="mt-2 text-lg font-semibold text-white">Open for all</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-xl">
                  <div className="mb-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Secure your spot</p>
                    <h2 className="mt-3 text-2xl font-black text-slate-900">Register Now</h2>
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
                    <form onSubmit={handleRegister} className="space-y-5">
                      <div className="space-y-3">
                        <Label htmlFor="fullName" className="font-bold text-slate-700">Full Name</Label>
                        <Input id="fullName" name="fullName" placeholder="Enter your full name" className="rounded-2xl border-slate-200 h-12 bg-white" required />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label htmlFor="email" className="font-bold text-slate-700">Email Address</Label>
                          <Input id="email" name="email" type="email" placeholder="email@address.com" className="rounded-2xl border-slate-200 h-12 bg-white" required />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="phone" className="font-bold text-slate-700">Phone Number</Label>
                          <Input id="phone" name="phone" placeholder="+233..." className="rounded-2xl border-slate-200 h-12 bg-white" required />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="school" className="font-bold text-slate-700">School / Institution</Label>
                        <Input
                          id="school"
                          name="school"
                          placeholder="Enter your school or institution"
                          className="rounded-2xl border-slate-200 h-12 bg-white"
                          onChange={() => schoolError && setSchoolError("")}
                          required
                        />
                        {schoolError && <p className="text-red-500 text-sm mt-1">{schoolError}</p>}
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="location" className="font-bold text-slate-700">Location</Label>
                        <Input id="location" name="location" placeholder="City / Country" className="rounded-2xl border-slate-200 h-12 bg-white" required />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="gender" className="font-bold text-slate-700">Gender</Label>
                        <select
                          id="gender"
                          name="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 h-12 bg-white px-3"
                        >
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="notes" className="font-bold text-slate-700">Special Notes (Optional)</Label>
                        <Textarea id="notes" name="notes" placeholder="Any specific requirements?" className="rounded-2xl border-slate-200 bg-white resize-none" rows={3} />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 h-14 font-black text-lg rounded-full shadow-lg transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Confirm Registration"}
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
