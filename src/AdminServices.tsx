import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, Trash2, Edit2, Plus, Lock, MoveUp, MoveDown, ArrowLeft, Link as LinkIcon } from "lucide-react";
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
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "teritorial7" || passwordInput === "pastorokrah1") {
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

  const toggleLive = async (id: string, currentStatus: boolean) => {
    try {
      // Ensure only one service is live at a time: Turn off all others first if turning this one ON
      if (!currentStatus) {
        await supabase.from('church_schedule').update({ is_live: false }).neq('id', id);
      }
      
      const { error } = await supabase.from('church_schedule').update({ is_live: !currentStatus }).eq('id', id);
      if (error) throw error;
      
      toast({ title: !currentStatus ? "Service is now LIVE" : "Live status removed" });
      fetchServices();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {isPasswordProtected ? (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
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
        <div className="pb-16">
          <div className="bg-blue-900 text-white py-12 shadow-lg">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">Service Schedule Manager</h1>
                <p className="opacity-90">Manage service titles, times, and live stream links.</p>
              </div>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => navigate('/admin')}>
                <ArrowLeft className="mr-2" size={16} /> Back to Dashboard
              </Button>
            </div>
          </div>
          <div className="container mx-auto px-4 py-12 space-y-8">
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
      )}
    </div>
  );
};

export default AdminServices;