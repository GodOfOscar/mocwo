import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Trash2, Lock } from "lucide-react";
import { XCircle } from "lucide-react"; // Import XCircle for restricted access message
import { useNavigate } from "react-router-dom";

interface Partnership {
  id: string;
  name: string;
  email: string;
  level: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

const AdminPartnerships = () => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
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
    
    if (passwordInput === "teritorial1" || passwordInput === "pastorokrah1") { // Existing password check
      // NEW: Check page access after successful password entry
      fetch("/api/admin/page-access")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings['admin-partnerships'] === false) {
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
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('partnerships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartnerships(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching partnerships",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePartnershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('partnerships')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Status updated", description: `Partnership ${status}` });
      fetchPartnerships();
    } catch (error: any) {
      toast({
        title: "Error updating partnership",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deletePartnership = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partnership?')) return;
    
    try {
      const { error } = await supabase
        .from('partnerships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Partnership deleted" });
      fetchPartnerships();
    } catch (error: any) {
      toast({
        title: "Error deleting partnership",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const stats = {
    total: partnerships.length,
    approved: partnerships.filter(p => p.status === 'approved').length,
    pending: partnerships.filter(p => p.status === 'pending').length,
    rejected: partnerships.filter(p => p.status === 'rejected').length,
    totalRevenue: partnerships.filter(p => p.status === 'approved').reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/5">
      {isPasswordProtected ? (
        // Password Gate Modal
        <div className="min-h-screen flex items-center justify-center px-0">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Partnerships Access</CardTitle>
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
                    className="mt-2 bg-slate-800 border-blue-500/30 text-white placeholder:text-slate-400"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-400 mt-2">{passwordError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/50 text-white font-semibold transition-all duration-300">
                  Access Partnerships
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
                  Access to the Partnerships Manager has been temporarily disabled by the Master Administrator.
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
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 py-12 shadow-lg">
            <div className="w-full px-0">
              <div className="flex justify-between items-start gap-4">
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">Partnerships</h1>
                  <p className="text-white/90 text-lg">Manage and track all partnership applications</p>
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
              <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Total Partnerships</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Approved</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Pending</p>
                      <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                      <p className="text-3xl font-bold text-cyan-600 mt-2">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Table Card */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600/5 to-cyan-400/5 border-b border-blue-200/20">
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 flex items-center justify-center mr-3">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  Partnership Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-muted-foreground mt-4">Loading partnerships...</p>
                  </div>
                ) : partnerships.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">No partnerships yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-100/50">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-bold text-slate-700">Name</TableHead>
                          <TableHead className="font-bold text-slate-700">Email</TableHead>
                          <TableHead className="font-bold text-slate-700">Level</TableHead>
                          <TableHead className="font-bold text-slate-700">Amount</TableHead>
                          <TableHead className="font-bold text-slate-700">Payment</TableHead>
                          <TableHead className="font-bold text-slate-700">Status</TableHead>
                          <TableHead className="font-bold text-slate-700">Date</TableHead>
                          <TableHead className="font-bold text-slate-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {partnerships.map((partnership) => (
                          <TableRow key={partnership.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell className="font-semibold text-slate-800">{partnership.name}</TableCell>
                            <TableCell className="text-slate-600">{partnership.email}</TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{partnership.level}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-cyan-600">${partnership.amount}</TableCell>
                            <TableCell className="text-slate-600">{partnership.payment_method}</TableCell>
                            <TableCell>
                              <Badge 
                                className={`font-semibold ${
                                  partnership.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                                  partnership.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}
                              >
                                {partnership.status.charAt(0).toUpperCase() + partnership.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{new Date(partnership.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="space-x-2">
                              {partnership.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm"
                                    onClick={() => updatePartnershipStatus(partnership.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    onClick={() => updatePartnershipStatus(partnership.id, 'rejected')}
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deletePartnership(partnership.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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

export default AdminPartnerships;
