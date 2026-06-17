import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navigation from "./components/layout/Navigation";
import AdminLayout from "./pages/AdminLayout";
import { LoadingLogo } from "./components/LoadingLogo";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Partnership from "./pages/Partnership";
import MOCWO from "./pages/MOCWO";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import GivePage from "./pages/GivePage";
import PartnershipSuccess from "./pages/PartnershipSuccess";
import MaintenancePage from "./pages/MaintenancePage"; // Import the new maintenance page
import { Loader2 } from "lucide-react";
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
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import MediaPage from "./pages/MediaPage";
import ReportPage from "./pages/ReportPage";
import News from "./pages/News";
import MembershipForm from "./pages/MembershipForm";
import Leadership from "./pages/Leadership";
import PastorOscarBot from "./pages/PastorOkrahBot";
import { InstallBanner } from "./components/InstallBanner";

// Admin Pages
import AdminPartnerships from "./pages/AdminPartnerships";
import AdminMemberships from "./pages/AdminMemberships";
import AdminPrayers from "./pages/AdminPrayers";
import AdminNews from "./pages/AdminNews";
import AdminResources from "./pages/AdminResources";
import AdminMediaFiles from "./pages/AdminMediaFiles";
import AdminServices from "./pages/AdminServices";
import AdminEvents from "./pages/AdminEvents";
import AdminDevotionals from "./pages/AdminDevotionals";
import CarouselManagement from "./pages/CarouselManagement";
import AdminMaster from "./pages/AdminMaster";

const queryClient = new QueryClient();

export default function App() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loadingMaintenanceStatus, setLoadingMaintenanceStatus] = useState(true);

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const response = await fetch("/api/status");
        const data = await response.json();
        if (data.success && data.maintenanceMode) {
          setIsMaintenanceMode(true);
        }
      } catch (error) {
        console.error("Failed to fetch maintenance status:", error);
      } finally {
        setLoadingMaintenanceStatus(false);
      }
    };
    checkMaintenanceStatus();
  }, []);

  if (loadingMaintenanceStatus) {
    return <LoadingLogo />;
  }

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

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
            <Route path="/partnership-success" element={<PartnershipSuccess />} />
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
              <Route path="/admin-devotionals" element={<AdminDevotionals />} />
              <Route path="/admin-carousel" element={<CarouselManagement />} />
              <Route path="/admin-master" element={<AdminMaster />} />
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
            <Route path="/community" element={<Community />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/media/:id" element={<MediaPage />} />
            <Route path="/report/:id" element={<ReportPage />} />

            {/* Leadership (not in top navigation) */}
            <Route path="/leadership" element={<Leadership />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PastorOscarBot />
            <InstallBanner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
