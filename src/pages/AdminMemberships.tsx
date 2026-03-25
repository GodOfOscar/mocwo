import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Users, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MembershipRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  membership_type?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  message?: string;
  status: string;
  created_at: string;
}

const AdminMemberships = () => {
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [selectedMember, setSelectedMember] = useState<MembershipRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordInput === "teritorial2") {
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid password");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    fetchMembershipRequests();
  }, []);

  const fetchMembershipRequests = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembershipRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching membership requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateMembershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Status updated", description: `Membership ${status}` });
      fetchMembershipRequests();
      setSelectedMember(null);
    } catch (error: any) {
      toast({
        title: "Error updating membership",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMembershipRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership request?')) return;
    
    try {
      const { error } = await supabase
        .from('membership_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Membership request deleted" });
      fetchMembershipRequests();
      setSelectedMember(null);
    } catch (error: any) {
      toast({
        title: "Error deleting membership request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const stats = {
    total: membershipRequests.length,
    approved: membershipRequests.filter(m => m.status === 'approved').length,
    pending: membershipRequests.filter(m => m.status === 'pending').length,
    rejected: membershipRequests.filter(m => m.status === 'rejected').length
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-background via-background to-green-950/5">
      {isPasswordProtected ? (
        // Password Gate Modal
        <div className="min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Memberships Access</CardTitle>
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
                    className="mt-2 bg-slate-800 border-green-500/30 text-white placeholder:text-slate-400"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-400 mt-2">{passwordError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:shadow-lg hover:shadow-green-500/50 text-white font-semibold transition-all duration-300">
                  Access Memberships
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Main Content
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-400 py-12 shadow-lg">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-start gap-4">
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">Memberships</h1>
                  <p className="text-white/90 text-lg">Manage and track membership applications</p>
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

          <div className="container mx-auto px-4 py-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Total Members</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Approved</p>
                      <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.approved}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
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

              <Card className="border-0 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Rejected</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Card */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600/5 to-emerald-400/5 border-b border-green-200/20">
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-emerald-400 flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Membership Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="text-muted-foreground mt-4">Loading memberships...</p>
                  </div>
                ) : selectedMember ? (
                  <div className="space-y-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedMember(null)}
                      className="border-green-200 hover:bg-green-50 transition-all duration-300"
                    >
                      ← Back to List
                    </Button>
                    
                    {/* Member Detail Card */}
                    <Card className="border-0 bg-gradient-to-br from-slate-50 to-green-50/30 shadow-lg">
                      <CardContent className="p-8">
                        <div className="mb-6 pb-6 border-b border-green-200/30">
                          <h2 className="text-3xl font-bold text-slate-800">
                            {selectedMember.first_name} {selectedMember.last_name}
                          </h2>
                          <p className="text-green-600 font-semibold mt-2">
                            {selectedMember.membership_type || 'Membership Type N/A'}
                          </p>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-white/50 rounded-lg border border-green-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</p>
                              <p className="text-lg font-semibold text-slate-800 mt-1">{selectedMember.email}</p>
                            </div>
                            <div className="p-4 bg-white/50 rounded-lg border border-green-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Phone</p>
                              <p className="text-lg font-semibold text-slate-800 mt-1">{selectedMember.phone}</p>
                            </div>
                          </div>
                        </div>

                        {/* Personal Information */}
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Personal Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-white/50 rounded-lg border border-green-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Date of Birth</p>
                              <p className="text-lg font-semibold text-slate-800 mt-1">{selectedMember.date_of_birth || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-white/50 rounded-lg border border-green-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Gender</p>
                              <p className="text-lg font-semibold text-slate-800 mt-1">{selectedMember.gender || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-white/50 rounded-lg border border-green-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Marital Status</p>
                              <p className="text-lg font-semibold text-slate-800 mt-1">{selectedMember.marital_status || 'N/A'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Address Information */}
                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Address Information</h3>
                          <div className="grid grid-cols-1 gap-6">
                            <div className="p-4 bg-white/50 rounded-lg border border-green-200/20">
                              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Address</p>
                              <p className="text-lg font-semibold text-slate-800 mt-1">{selectedMember.address || 'N/A'}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="p-4 bg-white/50 rounded-lg border border-green-200/20">
                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">City</p>
                                <p className="text-lg font-semibold text-slate-800 mt-1">{selectedMember.city || 'N/A'}</p>
                              </div>
                              <div className="p-4 bg-white/50 rounded-lg border border-green-200/20">
                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">State</p>
                                <p className="text-lg font-semibold text-slate-800 mt-1">{selectedMember.state || 'N/A'}</p>
                              </div>
                              <div className="p-4 bg-white/50 rounded-lg border border-green-200/20">
                                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Country</p>
                                <p className="text-lg font-semibold text-slate-800 mt-1">{selectedMember.country || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Message */}
                        {selectedMember.message && (
                          <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Member Message</h3>
                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/30">
                              <p className="text-slate-800 leading-relaxed">{selectedMember.message}</p>
                            </div>
                          </div>
                        )}

                        {/* Status Section */}
                        <div className="pt-6 border-t border-green-200/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <Badge 
                                className={`font-semibold text-sm mt-2 ${
                                  selectedMember.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                                  selectedMember.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}
                              >
                                {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-2">Submitted: {new Date(selectedMember.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedMember.status === 'pending' && (
                      <div className="flex flex-wrap gap-3 mt-6">
                        <Button 
                          onClick={() => updateMembershipStatus(selectedMember.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Approve Membership
                        </Button>
                        <Button 
                          onClick={() => updateMembershipStatus(selectedMember.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          Reject Membership
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => deleteMembershipRequest(selectedMember.id)}
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
                          <TableHead className="font-bold text-slate-700">Email</TableHead>
                          <TableHead className="font-bold text-slate-700">Phone</TableHead>
                          <TableHead className="font-bold text-slate-700">Membership Type</TableHead>
                          <TableHead className="font-bold text-slate-700">Status</TableHead>
                          <TableHead className="font-bold text-slate-700">Date</TableHead>
                          <TableHead className="font-bold text-slate-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {membershipRequests.map((member) => (
                          <TableRow key={member.id} className="hover:bg-green-50/50 transition-colors">
                            <TableCell className="font-semibold text-slate-800">{member.first_name} {member.last_name}</TableCell>
                            <TableCell className="text-slate-600">{member.email}</TableCell>
                            <TableCell className="text-slate-600">{member.phone}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{member.membership_type || 'N/A'}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={`font-semibold ${
                                  member.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                                  member.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}
                              >
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{new Date(member.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedMember(member)}
                                className="border-green-200 hover:bg-green-50 transition-all duration-300"
                              >
                                View Details
                              </Button>
                              {member.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm"
                                    onClick={() => updateMembershipStatus(member.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => updateMembershipStatus(member.id, 'rejected')}
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => deleteMembershipRequest(member.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {membershipRequests.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">No membership requests yet</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminMemberships;
