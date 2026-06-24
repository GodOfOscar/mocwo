import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Users, Trash2, Edit2, Plus, Lock, ArrowLeft, CheckCircle2, Clock, MapPin, Download, Filter, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";
import { XCircle } from "lucide-react"; // Import XCircle for restricted access message

const AdminEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAccessRestricted, setIsAccessRestricted] = useState(false); // NEW state for access restriction
  const [filterEventName, setFilterEventName] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedRegistrationIds, setSelectedRegistrationIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    event_type: "Event",
    is_active: true
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordInput === "teritorial8" || passwordInput === "pastorokrah1") { // Existing password check
      // NEW: Check page access after successful password entry
      fetch(`${API_BASE_URL}/api/admin/page-access`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings['admin-events'] === false) {
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
    if (!isPasswordProtected) {
      fetchData();
      
      // Subscribe to real-time changes in event_registrations
      const regsSubscription = supabase
        .channel('event_registrations_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'event_registrations' },
          (payload: any) => {
            console.log('Registration change detected:', payload);
            fetchData(); // Refresh data when any change occurs
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });

      return () => {
        supabase.removeChannel(regsSubscription);
      };
    }
  }, [isPasswordProtected]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const eventsResponse = await fetch(`${API_BASE_URL}/api/admin-events`);
      if (!eventsResponse.ok) {
        const err = await eventsResponse.json().catch(() => null);
        throw new Error(err?.error || `Events fetch failed (${eventsResponse.status})`);
      }
      const eventsResult = await eventsResponse.json();

      const regsResponse = await fetch(`${API_BASE_URL}/api/admin-events/registrations`);
      if (!regsResponse.ok) {
        const err = await regsResponse.json().catch(() => null);
        throw new Error(err?.error || `Registrations fetch failed (${regsResponse.status})`);
      }
      const regsResult = await regsResponse.json();

      setEvents(eventsResult.data || []);
      setRegistrations(regsResult.data || []);
      setSelectedRegistrationIds([]);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast({ title: "Error fetching data", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventPayload = {
        title: form.title,
        description: form.description,
        start_date: form.start_date,
        end_date: form.end_date || null,
        location: form.location,
        event_type: form.event_type,
        is_active: form.is_active,
      };

      const endpoint = editingId ? `${API_BASE_URL}/api/admin-events/${editingId}` : `${API_BASE_URL}/api/admin-events`;
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || `Event save failed (${response.status})`);
      }

      const result = await response.json();
      toast({ title: editingId ? "Event updated" : "Event created" });
      setEditingId(null);
      setForm({ title: "", description: "", start_date: "", end_date: "", location: "", event_type: "Event", is_active: true });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!id) {
      toast({ title: "Error", description: "Event ID is missing.", variant: "destructive" });
      return;
    }

    if (!confirm("Delete this event?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin-events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || `Delete failed (${response.status})`);
      }

      toast({ title: "Event deleted", description: "The event has been removed successfully." });
      fetchData();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message || "Unable to delete the event.", variant: "destructive" });
    }
  };

  const handleDeleteSelectedRegistrations = async () => {
    if (selectedRegistrationIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedRegistrationIds.length} selected registration(s)? This action cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin-events/registrations`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRegistrationIds }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || `Delete failed (${response.status})`);
      }

      toast({ title: "Success", description: `${selectedRegistrationIds.length} registration(s) deleted.` });
      setSelectedRegistrationIds([]);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error deleting registrations", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteAllFilteredRegistrations = async () => {
    if (filteredRegistrations.length === 0) return;
    if (!confirm(`Are you sure you want to delete all ${filteredRegistrations.length} visible registration(s)? This action cannot be undone.`)) return;

    try {
      const filteredIds = filteredRegistrations.map((reg) => String(reg.id));
      const response = await fetch(`${API_BASE_URL}/api/admin-events/registrations`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: filteredIds }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || `Delete failed (${response.status})`);
      }

      toast({ title: "Success", description: `Deleted ${filteredRegistrations.length} registration(s).` });
      setSelectedRegistrationIds([]);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error deleting registrations", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteAllRegistrationsForEvent = async () => {
    if (filterEventName === "all") return; // Should not happen if button is disabled
    if (!confirm(`Are you sure you want to delete ALL registrations for "${filterEventName}"? This action cannot be undone.`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin-events/registrations`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_name: filterEventName }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || `Delete failed (${response.status})`);
      }

      toast({ title: "Success", description: `All registrations for "${filterEventName}" deleted.` });
      setSelectedRegistrationIds([]);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error deleting registrations", description: error.message, variant: "destructive" });
    }
  };

  const uniqueEventNames = Array.from(new Set(registrations.map(r => r.event_name))).sort();

  const filteredRegistrations = registrations.filter(reg => {
    const eventMatch = filterEventName === "all" || reg.event_name === filterEventName;
    
    // Compare dates using YYYY-MM-DD format
    const regDateStr = new Date(reg.created_at).toISOString().split('T')[0];
    const startMatch = !startDate || regDateStr >= startDate;
    const endMatch = !endDate || regDateStr <= endDate;

    const searchMatch = !searchTerm || 
      reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.school?.toLowerCase().includes(searchTerm.toLowerCase());

    return eventMatch && startMatch && endMatch && searchMatch;
  });

  const isAnyFilterActive = searchTerm !== "" || filterEventName !== "all" || startDate !== "" || endDate !== "";

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterEventName("all");
    setStartDate("");
    setEndDate("");
  };

  const exportToCSV = () => {
    const dataToExport = filteredRegistrations;
    if (dataToExport.length === 0) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }

    const headers = ["Program", "Member Name", "Email", "Phone", "School", "Location", "Notes", "Date Registered"];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map(reg => [
        `"${reg.event_name.replace(/"/g, '""')}"`,
        `"${reg.full_name.replace(/"/g, '""')}"`,
        `"${reg.email.replace(/"/g, '""')}"`,
        `"${reg.phone.replace(/"/g, '""')}"`,
        `"${(reg.school || 'N/A').replace(/"/g, '""')}"`,
        `"${(reg.location || 'N/A').replace(/"/g, '""')}"`,
        `"${(reg.notes || '').replace(/"/g, '""')}"`,
        `"${new Date(reg.created_at).toLocaleDateString()}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const fileNameSuffix = filterEventName === 'all' ? 'all_events' : filterEventName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const dateSuffix = startDate || endDate ? `_${startDate || 'any'}_to_${endDate || 'any'}` : '';
    
    link.setAttribute("href", url);
    link.setAttribute("download", `event_registrations_${fileNameSuffix}${dateSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {isPasswordProtected ? (
        <div className="min-h-[80vh] flex items-center justify-center px-0">
          <Card className="w-full max-w-md bg-slate-900 text-white shadow-2xl border-0">
            <CardHeader className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <CardTitle className="text-2xl font-bold font-serif">Events Manager Access</CardTitle>
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
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 font-bold">Access Dashboard</Button>
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
                  Access to the Events Manager has been temporarily disabled by the Master Administrator.
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
          <div className="bg-orange-600 text-white py-12 shadow-lg">
            <div className="w-full px-0 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black tracking-tight">Ministry Events Manager</h1>
                <p className="opacity-90 font-medium">Manage programs and view member registrations.</p>
              </div>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => navigate('/admin')}>
                <ArrowLeft className="mr-2" size={16} /> Dashboard
              </Button>
            </div>
          </div>

          <div className="w-full px-0 py-12">
            <Tabs defaultValue="manage" className="space-y-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-sm border">
                <TabsTrigger value="manage" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  <Calendar className="w-4 h-4 mr-2" /> Manage Events
                </TabsTrigger>
                <TabsTrigger value="registrations" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                  <Users className="w-4 h-4 mr-2" /> Registrations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manage" className="space-y-8">
                <Card className="shadow-xl border-0">
                  <CardHeader className="border-b bg-orange-50/50">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      {editingId ? <Edit2 className="w-5 h-5 text-orange-600" /> : <Plus className="w-5 h-5 text-orange-600" />}
                      {editingId ? "Edit Event" : "Create New Event"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <form onSubmit={handleSaveEvent} className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="font-bold">Event Title</Label>
                        <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Youth Camp 2026" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Location</Label>
                        <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g., Main Campus" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Start Date</Label>
                        <Input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Category</Label>
                        <select 
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={form.event_type}
                          onChange={e => setForm({...form, event_type: e.target.value})}
                        >
                          <option value="Event">Event</option>
                          <option value="Camp">Camp</option>
                          <option value="Conference">Conference</option>
                          <option value="Outreach">Outreach</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="font-bold">Description</Label>
                        <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Tell people about the event..." rows={4} />
                      </div>
                      <div className="flex gap-3">
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 font-bold px-8">
                          {editingId ? "Update Program" : "Publish Program"}
                        </Button>
                        {editingId && (
                          <Button variant="ghost" onClick={() => {
                            setEditingId(null);
                            setForm({ title: "", description: "", start_date: "", end_date: "", location: "", event_type: "Event", is_active: true });
                          }}>Cancel</Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-100">
                      <TableRow>
                        <TableHead className="font-bold text-slate-900">Event</TableHead>
                        <TableHead className="font-bold text-slate-900">Date & Location</TableHead>
                        <TableHead className="font-bold text-slate-900 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-bold text-orange-900">{event.title}</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <span className="flex items-center gap-1"><Clock size={12}/> {event.start_date}</span>
                              <span className="flex items-center gap-1"><MapPin size={12}/> {event.location}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditingId(event.id);
                              setForm({
                                title: event.title || "",
                                description: event.description || "",
                                start_date: event.start_date || "",
                                end_date: event.end_date || "",
                                location: event.location || "",
                                event_type: event.event_type || "Event",
                                is_active: event.is_active ?? true,
                              });
                            }}><Edit2 size={16} /></Button>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteEvent(event.id)}><Trash2 size={16} /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="registrations">
                <Card className="shadow-xl border-0">
                  <CardHeader className="bg-slate-900 text-white rounded-t-xl flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-400" />
                      Member Registrations ({isAnyFilterActive ? `${filteredRegistrations.length} of ${registrations.length}` : registrations.length})
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={fetchData}
                        className="text-orange-400 border-orange-400 hover:bg-orange-400/10"
                      >
                        ↻ Refresh
                      </Button>
                      <div className="flex items-center gap-2 relative">
                        <Search size={16} className="absolute left-3 text-slate-400" />
                        <Input 
                          placeholder="Search name or email..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 w-[220px] bg-slate-800 border-slate-700 text-white h-9 text-sm"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Filter size={16} className="text-orange-400" />
                        <Select value={filterEventName} onValueChange={setFilterEventName}>
                          <SelectTrigger className="w-[200px] bg-slate-800 border-slate-700 text-white h-9">
                            <SelectValue placeholder="Filter by Event" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Events</SelectItem>
                            {uniqueEventNames.map(name => (
                              <SelectItem key={name} value={name}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-400" />
                        <Input 
                          type="date" 
                          value={startDate} 
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-[150px] bg-slate-800 border-slate-700 text-white h-9 text-xs"
                        />
                        <span className="text-white/60 text-xs">to</span>
                        <Input 
                          type="date" 
                          value={endDate} 
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-[150px] bg-slate-800 border-slate-700 text-white h-9 text-xs"
                        />
                      </div>

                      {isAnyFilterActive && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearAllFilters}
                          className="text-orange-400 hover:text-orange-300 hover:bg-white/10 gap-2 h-9"
                        >
                          <X size={16} />
                          Clear All
                        </Button>
                      )}
                      
                      {selectedRegistrationIds.length > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteSelectedRegistrations}
                          className="gap-2 h-9"
                        >
                          <Trash2 size={16} />
                          Delete Selected
                        </Button>
                      )}

                      {filteredRegistrations.length > 0 && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={handleDeleteAllFilteredRegistrations}
                          className="gap-2 h-9"
                        >
                          <Trash2 size={16} />
                          Delete Visible
                        </Button>
                      )}

                      {filterEventName !== "all" && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={handleDeleteAllRegistrationsForEvent}
                          className="gap-2 h-9"
                        >
                          <Trash2 size={16} />
                          Delete All for "{filterEventName}"
                        </Button>
                      )}

                      {filteredRegistrations.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={exportToCSV}
                          className="bg-white/10 border-white/20 hover:bg-white/20 text-white gap-2 h-9"
                        >
                          <Download size={16} />
                          Export CSV
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {/* Analytics Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                    <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Registered</span>
                        <Users className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="text-3xl font-black text-slate-900">{filteredRegistrations.length}</div>
                      <div className="text-xs text-slate-500 mt-2">{isAnyFilterActive ? 'Filtered results' : 'All registrations'}</div>
                    </div>

                    <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Males</span>
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">♂</div>
                      </div>
                      <div className="text-3xl font-black text-blue-600">{filteredRegistrations.filter(r => r.gender === 'Male').length}</div>
                      <div className="text-xs text-slate-500 mt-2">
                        {filteredRegistrations.length > 0 ? `${((filteredRegistrations.filter(r => r.gender === 'Male').length / filteredRegistrations.length) * 100).toFixed(1)}%` : '0%'} of total
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Females</span>
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-700">♀</div>
                      </div>
                      <div className="text-3xl font-black text-pink-600">{filteredRegistrations.filter(r => r.gender === 'Female').length}</div>
                      <div className="text-xs text-slate-500 mt-2">
                        {filteredRegistrations.length > 0 ? `${((filteredRegistrations.filter(r => r.gender === 'Female').length / filteredRegistrations.length) * 100).toFixed(1)}%` : '0%'} of total
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-bold text-slate-900 w-12">
                              <Checkbox
                                checked={filteredRegistrations.length > 0 && filteredRegistrations.every(reg => selectedRegistrationIds.includes(String(reg.id)))}
                                onCheckedChange={() => {
                                  if (filteredRegistrations.length > 0 && filteredRegistrations.every(reg => selectedRegistrationIds.includes(String(reg.id)))) {
                                    setSelectedRegistrationIds([]);
                                  } else {
                                    setSelectedRegistrationIds(filteredRegistrations.map(reg => String(reg.id)));
                                  }
                                }}
                              />
                            </TableHead>
                            <TableHead className="font-bold text-slate-900">Program</TableHead>
                            <TableHead className="font-bold text-slate-900">Member Name</TableHead>
                            <TableHead className="font-bold text-slate-900">Email</TableHead>
                            <TableHead className="font-bold text-slate-900">Contact</TableHead>
                            <TableHead className="font-bold text-slate-900">School</TableHead>
                            <TableHead className="font-bold text-slate-900">Location</TableHead>
                            <TableHead className="font-bold text-slate-900">Date Registered</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRegistrations.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                                No registrations found for this selection.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredRegistrations.map((reg) => (
                              <TableRow key={reg.id} className="hover:bg-orange-50/30 transition-colors">
                                <TableCell className="w-12">
                                  <Checkbox
                                    checked={selectedRegistrationIds.includes(String(reg.id))}
                                    onCheckedChange={() => {
                                      const regId = String(reg.id);
                                      setSelectedRegistrationIds((prev) =>
                                        prev.includes(regId)
                                          ? prev.filter((id) => id !== regId)
                                          : [...prev, regId]
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="font-bold text-orange-700">{reg.event_name}</TableCell>
                                <TableCell className="font-semibold">{reg.full_name}</TableCell>
                                <TableCell className="text-sm">
                                  <a href={`mailto:${reg.email}`} className="text-blue-600 hover:underline">
                                    {reg.email}
                                  </a>
                                </TableCell>
                                <TableCell className="text-sm">{reg.phone || "N/A"}</TableCell>
                                <TableCell className="text-sm">{reg.school || "N/A"}</TableCell>
                                <TableCell className="text-sm">{reg.location || "N/A"}</TableCell>
                                <TableCell className="text-xs text-slate-500">
                                  {new Date(reg.created_at).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        )
      )
      }
    </div>
  );
};

export default AdminEvents;
