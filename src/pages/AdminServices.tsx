import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, Trash2, Edit2, Plus, Lock, MoveUp, MoveDown, ArrowLeft, Link as LinkIcon, RefreshCcw, Power } from "lucide-react";
import { XCircle } from "lucide-react"; // Import XCircle for restricted access message
import { useNavigate } from "react-router-dom";

interface ServiceItem {
  id: string;
  title: string;
  day: string;
  time_string: string;
  description: string;
  details: string;
  image: string;
  color: string;
  live_link: string;
  is_live: boolean;
  order_index: number;
}

const AdminServices = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [form, setForm] = useState({
    title: "",
    day: "",
    time_string: "",
    description: "",
    details: "",
    image: "⛪",
    color: "from-blue-500 to-blue-600",
    live_link: "",
    is_live: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAccessRestricted, setIsAccessRestricted] = useState(false); // NEW state for access restriction
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAutoSyncing && !isPasswordProtected && services.length > 0) {
      // Run every minute to check if live status needs updating
      const interval = setInterval(runAutoSync, 60000);
      return () => clearInterval(interval);
    }
  }, [isAutoSyncing, isPasswordProtected, services]);

  const runAutoSync = async () => {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = days[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let foundLive = false;
    let targetServiceId = null;

    for (const s of services) {
      if (s.day !== currentDay) continue;

      // Simple parser for "8:00 AM" or "7PM".
      const timeMatch = s.time_string.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
      if (!timeMatch) continue;

      let hours = parseInt(timeMatch[1]);
      const mins = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const ampm = timeMatch[3].toUpperCase();

      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      const startMins = hours * 60 + mins;
      // Auto-live window: From start time to 2 hours later
      if (currentMinutes >= startMins && currentMinutes < startMins + 120) {
        foundLive = true;
        targetServiceId = s.id;
        break;
      }
    }

    if (foundLive && targetServiceId) {
      const currentService = services.find(s => s.id === targetServiceId);
      if (currentService && !currentService.is_live) {
        await toggleLive(targetServiceId, false, true);
      }
    } else if (!foundLive) {
      const currentlyLive = services.find(s => s.is_live);
      if (currentlyLive) {
        await toggleLive(currentlyLive.id, true, true);
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordInput === "teritorial7" || passwordInput === "pastorokrah1") {
      // NEW: Check page access after successful password entry
      fetch("/api/admin/page-access")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings['admin-services'] === false) {
            setIsAccessRestricted(true);
          }
        })
        .catch(error => console.error("Error checking page access:", error))
        .finally(() => {
          setIsPasswordProtected(false);
          setPasswordInput("");
        });
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid password");
    }
  };

  useEffect(() => {
    if (!isPasswordProtected) fetchServices();
  }, [isPasswordProtected]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('church_schedule')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching services", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('church_schedule')
          .update(form)
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: "Success", description: "Service updated successfully" });
      } else {
        const maxOrder = services.length > 0 ? Math.max(...services.map(s => s.order_index || 0)) : 0;
        const { error } = await supabase
          .from('church_schedule')
          .insert([{ ...form, order_index: maxOrder + 1 }]);
        if (error) throw error;
        toast({ title: "Success", description: "Service created successfully" });
      }
      setForm({ title: "", day: "", time_string: "", description: "", details: "", image: "⛪", color: "from-blue-500 to-blue-600", live_link: "", is_live: false });
      setEditingId(null);
      fetchServices();
    } catch (error: any) {
      toast({ title: "Error saving service", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    const { error } = await supabase.from('church_schedule').delete().eq('id', id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Deleted" });
      fetchServices();
    }
  };

  const moveService = async (id: string, direction: 'up' | 'down') => {
    const idx = services.findIndex(s => s.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === services.length - 1)) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const current = services[idx];
    const other = services[swapIdx];
    await supabase.from('church_schedule').update({ order_index: other.order_index }).eq('id', current.id);
    await supabase.from('church_schedule').update({ order_index: current.order_index }).eq('id', other.id);
    fetchServices();
  };

  const toggleLive = async (id: string, currentStatus: boolean, silent = false) => {
    try {
      // Ensure only one service is live at a time
      if (!currentStatus) {
        await supabase.from('church_schedule').update({ is_live: false }).neq('id', id);
      }
      
      const { error } = await supabase.from('church_schedule').update({ is_live: !currentStatus }).eq('id', id);
      if (error) throw error;
      
      if (!silent) toast({ title: !currentStatus ? "Service is now LIVE" : "Live status removed" });
      fetchServices();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {isPasswordProtected ? (
        <div className="min-h-[80vh] flex items-center justify-center px-0">
          <Card className="w-full max-w-md bg-slate-900 text-white shadow-2xl">
            <CardHeader className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <CardTitle className="text-2xl font-bold">Service Manager Access</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Enter access password"
                  className="bg-slate-800 border-slate-700 text-white"
                />
                {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold">Access Dashboard</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        isAccessRestricted ? ( // NEW: Restricted access message
          <div className="min-h-[80vh] flex items-center justify-center px-0">
            <Card className="w-full max-w-md bg-slate-900 text-white shadow-2xl border-0">
              <CardHeader className="text-center">
                <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <CardTitle className="text-2xl font-bold font-serif">Access Restricted</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-200 mb-4">
                  Access to the Services Manager has been temporarily disabled by the Master Administrator.
                  Please contact your Master Admin for further assistance.
                </p>
                <Button onClick={() => navigate('/admin')} className="w-full bg-red-600 hover:bg-red-700 font-bold">
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
        <div className="pb-16">
          <div className="bg-blue-900 text-white py-12 shadow-lg">
            <div className="w-full px-0 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">Service Schedule Manager</h1>
                <p className="opacity-90">Manage service titles, times, and live stream links.</p>
              </div>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => navigate('/admin')}>
                <ArrowLeft className="mr-2" size={16} /> Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Automation Control Banner */}
          <div className="bg-slate-100 border-b border-slate-200">
            <div className="w-full px-0 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isAutoSyncing ? 'bg-green-100 text-green-600 shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                  <RefreshCcw className={`w-5 h-5 ${isAutoSyncing ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Auto-Live Sync</h3>
                  <p className="text-xs text-slate-500 font-medium">Automatically toggles status based on time & day</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant={isAutoSyncing ? "default" : "outline"}
                  className={isAutoSyncing ? "bg-green-600 hover:bg-green-700 shadow-md text-white" : "border-slate-300"}
                  onClick={() => {
                    setIsAutoSyncing(!isAutoSyncing);
                    if (!isAutoSyncing) runAutoSync();
                  }}
                >
                  <Power className="w-4 h-4 mr-2" />
                  {isAutoSyncing ? "Automation Enabled" : "Enable Automation"}
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full px-0 py-12 space-y-8">
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  {editingId ? <Edit2 className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
                  {editingId ? 'Edit Service Details' : 'Add New Weekly Service'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="font-bold">Service Title</Label>
                    <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Sunday Service" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Day of Week</Label>
                    <Input value={form.day} onChange={e => setForm({...form, day: e.target.value})} placeholder="e.g., Sunday" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Display Time</Label>
                    <Input value={form.time_string} onChange={e => setForm({...form, time_string: e.target.value})} placeholder="e.g., 8:00 AM" required />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">YouTube Live Link</Label>
                    <Input value={form.live_link} onChange={e => setForm({...form, live_link: e.target.value})} placeholder="https://youtube.com/live/..." />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="font-bold">Short Description</Label>
                    <Input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief summary for the card" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="font-bold">Full Details</Label>
                    <Textarea value={form.details} onChange={e => setForm({...form, details: e.target.value})} placeholder="Additional info for the user" rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold">
                      {editingId ? 'Update Service' : 'Save New Service'}
                    </Button>
                    {editingId && (
                      <Button variant="ghost" onClick={() => {
                        setEditingId(null);
                        setForm({ title: "", day: "", time_string: "", description: "", details: "", image: "⛪", color: "from-blue-500 to-blue-600", live_link: "", is_live: false });
                      }}>Cancel</Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b"><CardTitle>Live Schedule List</CardTitle></CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Service Title</TableHead>
                      <TableHead className="font-bold">Schedule</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Live Link</TableHead>
                      <TableHead className="text-right font-bold">Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((s, idx) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-bold text-blue-900">{s.title}</TableCell>
                        <TableCell>{s.day} • {s.time_string}</TableCell>
                        <TableCell>
                          <Button 
                            variant={s.is_live ? "default" : "outline"} 
                            size="sm" 
                            onClick={() => toggleLive(s.id, s.is_live)}
                            className={s.is_live ? "bg-red-600 hover:bg-red-700 animate-pulse text-white" : "text-slate-500"}
                          >
                            {s.is_live ? "● LIVE" : "Go Live"}
                          </Button>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-blue-600 font-medium">
                          {s.live_link ? <a href={s.live_link} target="_blank" rel="noreferrer" className="flex items-center gap-1"><LinkIcon size={12} /> View Link</a> : <span className="text-slate-400">No link</span>}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="sm" disabled={idx === 0} onClick={() => moveService(s.id, 'up')}><MoveUp size={14} /></Button>
                          <Button variant="ghost" size="sm" disabled={idx === services.length - 1} onClick={() => moveService(s.id, 'down')}><MoveDown size={14} /></Button>
                          <Button variant="ghost" size="sm" onClick={() => { setEditingId(s.id); setForm(s); }}><Edit2 size={14} /></Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(s.id)}><Trash2 size={14} /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        )
      )}
    </div>
  );
};

export default AdminServices;
