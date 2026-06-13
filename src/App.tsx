import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navigation from "./components/layout/Navigation";
import AdminLayout from "./pages/AdminLayout";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Partnership from "./pages/Partnership";
import MOCWO from "./pages/MOCWO";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import GivePage from "./pages/GivePage";
import LivePage from "./pages/LivePage";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// New pages
import FHC from "./pages/FHC";
import RevPrinceMinistries from "./pages/RevPrinceMinistries";
import PrayerAI from "./pages/PrayerAI";
import RegisterEvent from "./pages/RegisterEvent";
import SchoolVisits from "./pages/SchoolVisits";
import Communities from "./pages/Communities";
import MediaPage from "./pages/MediaPage";
import ReportPage from "./pages/ReportPage";
import News from "./pages/News";
import MembershipForm from "./pages/MembershipForm";
import Leadership from "./pages/Leadership";
import PastorOkrahBot from "./pages/PastorOkrahBot";

// Admin Pages
import AdminPartnerships from "./pages/AdminPartnerships";
import AdminMemberships from "./pages/AdminMemberships";
import AdminPrayers from "./pages/AdminPrayers";
import AdminNews from "./pages/AdminNews";
import AdminResources from "./pages/AdminResources";
import AdminMediaFiles from "./pages/AdminMediaFiles";
import AdminServices from "./pages/AdminServices";
import AdminEvents from "./pages/AdminEvents";
import CarouselManagement from "./pages/CarouselManagement";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Navigation />
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/partnership" element={<Partnership />} />
            <Route path="/mocwo" element={<MOCWO />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/membership" element={<MembershipForm />} />
            <Route path="/give/:type" element={<GivePage />} />
            <Route path="/live" element={<LivePage />} />
            
            {/* Admin Routes wrapped in Layout */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-partnerships" element={<AdminPartnerships />} />
              <Route path="/admin-memberships" element={<AdminMemberships />} />
              <Route path="/admin-prayers" element={<AdminPrayers />} />
              <Route path="/admin-news" element={<AdminNews />} />
              <Route path="/admin-resources" element={<AdminResources />} />
              <Route path="/admin-media-files" element={<AdminMediaFiles />} />
              <Route path="/admin-services" element={<AdminServices />} />
              <Route path="/admin-events" element={<AdminEvents />} />
              <Route path="/admin-carousel" element={<CarouselManagement />} />
            </Route>

            {/* FHC & Prayer */}
            <Route path="/fhc" element={<FHC />} />
            <Route path="/prayer-ai" element={<PrayerAI />} />
            <Route path="/register-event" element={<RegisterEvent />} />
            <Route path="/rev-prince-ministries" element={<RevPrinceMinistries />} />

            {/* News */}
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<News />} />

            {/* Schools + Media + Report */}
            <Route path="/schools" element={<SchoolVisits />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/media/:id" element={<MediaPage />} />
            <Route path="/report/:id" element={<ReportPage />} />

            {/* Leadership (not in top navigation) */}
            <Route path="/leadership" element={<Leadership />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PastorOkrahBot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
