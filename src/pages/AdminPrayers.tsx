import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Trash2, Lock } from "lucide-react";
import { XCircle } from "lucide-react"; // Import XCircle for restricted access message
import { useNavigate } from "react-router-dom";

interface PrayerRequest {
  id: string;
  name: string;
  phone: string;
  location?: string;
  prayer_text: string;
  method?: string;
  status: string;
  created_at: string;
}

const AdminPrayers = () => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAccessRestricted, setIsAccessRestricted] = useState(false); // NEW state for access restriction
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordInput === "teritorial3" || passwordInput === "pastorokrah1") { // Existing password check
      // NEW: Check page access after successful password entry
      fetch("/api/admin/page-access")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings['admin-prayers'] === false) {
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
      setPasswordInput("");
    }
  };

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const fetchPrayerRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrayerRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching prayer requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrayerStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Status updated", description: `Prayer marked as ${status}` });
      fetchPrayerRequests();
      setSelectedPrayer(null);
    } catch (error: any) {
      toast({
        title: "Error updating prayer status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deletePrayerRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prayer request?')) return;
    
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Prayer request deleted" });
      fetchPrayerRequests();
      setSelectedPrayer(null);
    } catch (error: any) {
      toast({
        title: "Error deleting prayer request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const stats = {
    total: prayerRequests.length,
    received: prayerRequests.filter(p => p.status === 'received').length,
    processed: prayerRequests.filter(p => p.status === 'processed').length,
    failed: prayerRequests.filter(p => p.status === 'failed').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-rose-950/5">
      {isPasswordProtected ? (
        // Password Gate Modal
        <div className="min-h-screen flex items-center justify-center px-0">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Prayer Requests Access</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-white">Enter Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter access password"
                    className="mt-2 bg-slate-800 border-rose-500/30 text-white placeholder:text-slate-400"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-400 mt-2">{passwordError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-pink-500 hover:shadow-lg hover:shadow-rose-500/50 text-white font-semibold transition-all duration-300">
                  Access Prayer Requests
                </Button>
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
                  Access to the Prayer Requests Manager has been temporarily disabled by the Master Administrator.
                  Please contact your Master Admin for further assistance.
                </p>
                <Button onClick={() => navigate('/admin')} className="w-full bg-red-600 hover:bg-red-700 font-bold">
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
        // Main Content
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-400 py-12 shadow-lg">
            <div className="w-full px-0">
              <div className="flex justify-between items-start gap-4">
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">Prayer Requests</h1>
                  <p className="text-white/90 text-lg">Intercede for and manage prayer requests</p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300"
                  onClick={() => navigate('/admin')}
                >
                  ← Back to Dashboard
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full px-0 py-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 bg-gradient-to-br from-rose-500/10 to-rose-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Total Prayers</p>
                      <p className="text-3xl font-bold text-rose-600 mt-2">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-rose-600/20 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-rose-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Received</p>
                      <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.received}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Processed</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{stats.processed}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Failed</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">{stats.failed}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Table Card */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-600/5 to-pink-400/5 border-b border-rose-200/20">
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-rose-600 to-pink-400 flex items-center justify-center mr-3">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  Prayer Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
                    <p className="text-muted-foreground mt-4">Loading prayer requests...</p>
                  </div>
                ) : selectedPrayer ? (
                  <div className="space-y-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedPrayer(null)}
                      className="border-rose-200 hover:bg-rose-50 transition-all duration-300"
                    >
                      ← Back to List
                    </Button>
                    
                    {/* Prayer Detail Card */}
                    <Card className="border-0 bg-gradient-to-br from-slate-50 to-rose-50/30 shadow-lg">
                      <CardContent className="p-8">
                        <div className="mb-6 pb-6 border-b border-rose-200/30">
                          <h2 className="text-3xl font-bold text-slate-800">{selectedPrayer.name}</h2>
                          <div className="flex items-center gap-3 mt-3">
                            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 font-semibold">
                              Prayer Request
                            </Badge>
                            <Badge 
                              className={`font-semibold ${
                                selectedPrayer.status === 'processed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                                selectedPrayer.status === 'failed' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                                'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                            >
                              {selectedPrayer.status.charAt(0).toUpperCase() + selectedPrayer.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-white/50 rounded-lg border border-rose-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Phone</p>
                              <p className="text-lg font-semibold text-slate-800 mt-1">{selectedPrayer.phone}</p>
                            </div>
                            <div className="p-4 bg-white/50 rounded-lg border border-rose-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Location</p>
                              <p className="text-lg font-semibold text-slate-800 mt-1">{selectedPrayer.location || 'Not provided'}</p>
                            </div>
                            <div className="p-4 bg-white/50 rounded-lg border border-rose-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Method</p>
                              <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 font-semibold mt-1">
                                {selectedPrayer.method?.toUpperCase() || 'SMS'}
                              </Badge>
                            </div>
                            <div className="p-4 bg-white/50 rounded-lg border border-rose-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Submitted</p>
                              <p className="text-lg font-semibold text-slate-800 mt-1">{new Date(selectedPrayer.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Prayer Text */}
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Prayer Request</h3>
                          <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border-2 border-rose-200/40 shadow-inner">
                            <p className="text-slate-800 leading-relaxed text-lg whitespace-pre-wrap">
                              {selectedPrayer.prayer_text}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedPrayer.status === 'received' && (
                      <div className="flex flex-wrap gap-3 mt-6">
                        <Button 
                          onClick={() => updatePrayerStatus(selectedPrayer.id, 'processed')}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Mark as Processed
                        </Button>
                        <Button 
                          onClick={() => updatePrayerStatus(selectedPrayer.id, 'failed')}
                          className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Mark as Failed
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => deletePrayerRequest(selectedPrayer.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                        >
                          <Trash2 className="mr-2 w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-100/50">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-bold text-slate-700">Name</TableHead>
                          <TableHead className="font-bold text-slate-700">Phone</TableHead>
                          <TableHead className="font-bold text-slate-700">Location</TableHead>
                          <TableHead className="font-bold text-slate-700">Method</TableHead>
                          <TableHead className="font-bold text-slate-700">Status</TableHead>
                          <TableHead className="font-bold text-slate-700">Date</TableHead>
                          <TableHead className="font-bold text-slate-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {prayerRequests.map((prayer) => (
                          <TableRow key={prayer.id} className="hover:bg-rose-50/50 transition-colors">
                            <TableCell className="font-semibold text-slate-800">{prayer.name}</TableCell>
                            <TableCell className="text-slate-600">{prayer.phone}</TableCell>
                            <TableCell className="text-slate-600">{prayer.location || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200">{prayer.method?.toUpperCase() || 'SMS'}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={`font-semibold ${
                                  prayer.status === 'processed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                                  prayer.status === 'failed' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}
                              >
                                {prayer.status.charAt(0).toUpperCase() + prayer.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{new Date(prayer.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedPrayer(prayer)}
                                className="border-rose-200 hover:bg-rose-50 transition-all duration-300"
                              >
                                View Details
                              </Button>
                              {prayer.status === 'received' && (
                                <>
                                  <Button 
                                    size="sm"
                                    onClick={() => updatePrayerStatus(prayer.id, 'processed')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                  >
                                    Processed
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => updatePrayerStatus(prayer.id, 'failed')}
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                  >
                                    Failed
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deletePrayerRequest(prayer.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {prayerRequests.length === 0 && (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">No prayer requests yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
        )
      )}
    </div>
  );
};

export default AdminPrayers;
