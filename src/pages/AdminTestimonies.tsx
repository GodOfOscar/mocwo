import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckCircle,
  XCircle,
  Trash2,
  ArrowLeft,
  Star,
  Search,
  Lock,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { API_BASE_URL } from "@/lib/api";

interface Testimony {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  testimony: string;
  media_url: string | null;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  created_at: string;
}

const AdminTestimonies = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [filteredTestimonies, setFilteredTestimonies] = useState<Testimony[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAccessRestricted, setIsAccessRestricted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTestimony, setSelectedTestimony] = useState<Testimony | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "teritorial7" || passwordInput === "pastorokrah1") {
      setIsPasswordProtected(false);
      setPasswordInput("");
      checkPageAccess();
    } else {
      setPasswordError("Invalid password");
    }
  };

  const checkPageAccess = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/page-access`);
      const data = await response.json();
      if (data.success && data.settings["admin-testimonies"] === false) {
        setIsAccessRestricted(true);
      }
    } catch (error) {
      console.error("Error checking page access:", error);
    }
  };

  useEffect(() => {
    if (!isPasswordProtected) fetchTestimonies();
  }, [isPasswordProtected]);

  const fetchTestimonies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin-testimonials`);
      const responseData = await response.json();
      if (!responseData.success) throw new Error(responseData.error || "Unable to fetch testimonies");
      const data = responseData.data || [];
      setTestimonies(data);
      filterTestimonies(data, statusFilter, searchTerm);
    } catch (error: any) {
      toast({
        title: "Error fetching testimonies",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTestimonies = (items: Testimony[], status: string, search: string) => {
    let filtered = items;

    if (status !== "all") {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.email?.toLowerCase().includes(term) ||
          t.phone?.includes(term) ||
          t.testimony.toLowerCase().includes(term)
      );
    }

    setFilteredTestimonies(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterTestimonies(testimonies, statusFilter, term);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    filterTestimonies(testimonies, status, searchTerm);
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin-testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Unable to approve testimony");
      toast({ title: "Testimony approved", variant: "default" });
      fetchTestimonies();
    } catch (error: any) {
      toast({
        title: "Error approving testimony",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin-testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Unable to reject testimony");
      toast({ title: "Testimony rejected", variant: "default" });
      fetchTestimonies();
    } catch (error: any) {
      toast({
        title: "Error rejecting testimony",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin-testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Unable to update testimony");
      toast({
        title: !currentFeatured ? "Marked as featured" : "Removed from featured",
        variant: "default",
      });
      fetchTestimonies();
    } catch (error: any) {
      toast({
        title: "Error updating testimony",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimony?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin-testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Unable to delete testimony");
      toast({ title: "Testimony deleted", variant: "default" });
      fetchTestimonies();
    } catch (error: any) {
      toast({
        title: "Error deleting testimony",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isPasswordProtected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Protected Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Master Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError("");
                  }}
                  className="mt-2"
                />
                {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
              </div>
              <Button type="submit" className="w-full">
                Unlock
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAccessRestricted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="w-5 h-5" />
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This admin page is currently disabled. Contact the administrator to enable it.
            </p>
            <Button onClick={() => navigate("/admin")} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingCount = testimonies.filter((t) => t.status === "pending").length;
  const approvedCount = testimonies.filter((t) => t.status === "approved").length;
  const rejectedCount = testimonies.filter((t) => t.status === "rejected").length;

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-4xl font-bold">Testimony Manager</h1>
          <p className="text-muted-foreground mt-2">
            Manage all testimonies submitted by members
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{testimonies.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Testimonies</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                <p className="text-sm text-muted-foreground mt-1">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground mt-1">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or testimony content..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => handleStatusFilterChange("all")}
                size="sm"
              >
                All ({testimonies.length})
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => handleStatusFilterChange("pending")}
                size="sm"
                className={statusFilter === "pending" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              >
                Pending ({pendingCount})
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                onClick={() => handleStatusFilterChange("approved")}
                size="sm"
                className={statusFilter === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Approved ({approvedCount})
              </Button>
              <Button
                variant={statusFilter === "rejected" ? "default" : "outline"}
                onClick={() => handleStatusFilterChange("rejected")}
                size="sm"
                className={statusFilter === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Rejected ({rejectedCount})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Testimonies Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {statusFilter === "all" ? "All Testimonies" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Testimonies`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading testimonies...</p>
            ) : filteredTestimonies.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm ? "No testimonies match your search" : "No testimonies found"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestimonies.map((testimony) => (
                      <TableRow key={testimony.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {testimony.featured && (
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            )}
                            {testimony.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            {testimony.email && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                                {testimony.email}
                              </div>
                            )}
                            {testimony.phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3.5 h-3.5" />
                                {testimony.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                            {testimony.testimony.substring(0, 100)}...
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(testimony.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(testimony.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTestimony(testimony);
                                setShowViewModal(true);
                              }}
                              title="View full testimony"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {testimony.status !== "approved" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(testimony.id)}
                                title="Approve"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            {testimony.status !== "rejected" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(testimony.id)}
                                title="Reject"
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFeatured(testimony.id, testimony.featured)}
                              title={testimony.featured ? "Remove from featured" : "Mark as featured"}
                              className={testimony.featured ? "text-yellow-600" : ""}
                            >
                              <Star className={`w-4 h-4 ${testimony.featured ? "fill-current" : ""}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(testimony.id)}
                              title="Delete"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTestimony && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {selectedTestimony.name}'s Testimony
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Name</Label>
                    <p className="font-medium">{selectedTestimony.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Status</Label>
                    <p>{getStatusBadge(selectedTestimony.status)}</p>
                  </div>
                  {selectedTestimony.email && (
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Email</Label>
                      <p className="font-mono text-sm">{selectedTestimony.email}</p>
                    </div>
                  )}
                  {selectedTestimony.phone && (
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Phone</Label>
                      <p className="font-mono text-sm">{selectedTestimony.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Date</Label>
                    <p className="text-sm">{new Date(selectedTestimony.created_at).toLocaleDateString()} {new Date(selectedTestimony.created_at).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Featured</Label>
                    <p className="text-sm">{selectedTestimony.featured ? "Yes" : "No"}</p>
                  </div>
                </div>

                {selectedTestimony.media_url && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Media</Label>
                    <a
                      href={selectedTestimony.media_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline text-sm"
                    >
                      View Media
                    </a>
                  </div>
                )}

                <div>
                  <Label className="text-xs text-muted-foreground uppercase">Testimony</Label>
                  <p className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedTestimony.testimony}
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleApprove(selectedTestimony.id);
                      setShowViewModal(false);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      handleReject(selectedTestimony.id);
                      setShowViewModal(false);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      handleToggleFeatured(selectedTestimony.id, selectedTestimony.featured);
                      setShowViewModal(false);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {selectedTestimony.featured ? "Unfeature" : "Feature"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestimonies;
