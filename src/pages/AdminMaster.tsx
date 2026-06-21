import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Assuming Switch is available in shadcn/ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ShieldAlert, UserPlus, Trash2, Lock, ArrowLeft, RefreshCw, UserCheck, UserX, History, ShieldCheck, KeyRound, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";

const AdminMaster = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [masterPassword, setMasterPassword] = useState("pastorokrah1");
  const [newMasterPassword, setNewMasterPassword] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pageToToggle, setPageToToggle] = useState<string | null>(null);
  const [valueToSet, setValueToSet] = useState<boolean | null>(null);
  
  const [pageSettings, setPageSettings] = useState<Record<string, boolean>>({});
  const adminPages = [
    { id: 'admin-events', name: 'Events Manager' },
    { id: 'admin-devotionals', name: 'Devotionals Manager' },
    { id: 'admin-media-files', name: 'Media Files Manager' },
    { id: 'admin-resources', name: 'Resources Manager' },
    { id: 'admin-news', name: 'News Manager' },
    { id: 'admin-services', name: 'Services Manager' },
    { id: 'admin-prayers', name: 'Prayers Manager' },
    { id: 'admin-partnerships', name: 'Partnerships Manager' },
    { id: 'admin-memberships', name: 'Memberships Manager' },
    { id: 'admin-carousel', name: 'Carousel Manager' },
  ];

  const [newAdmin, setNewAdmin] = useState({ email: "", password: "", full_name: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === masterPassword || passwordInput === "pastorokrah1") {
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid master password");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const masterPassResponse = await fetch(`${API_BASE_URL}/api/admin/settings/master_password`);
        const masterPassData = await masterPassResponse.json();
        if (masterPassData.success) setMasterPassword(masterPassData.value);
      } catch (error) {
        console.error("Error fetching master password from backend:", error);
      }

      try {
        const maintenanceResponse = await fetch(`${API_BASE_URL}/api/status`);
        const maintenanceData = await maintenanceResponse.json();
        if (maintenanceData.success) setMaintenanceMode(maintenanceData.maintenanceMode);
      } catch (error) {
        console.error("Error fetching maintenance mode from backend:", error);
      }

      try {
        const accessRes = await fetch(`${API_BASE_URL}/api/admin/page-access`);
        const accessData = await accessRes.json();
        if (accessData.success) setPageSettings(accessData.settings);
      } catch (error) {
        console.error("Error fetching page access:", error);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setCurrentUserEmail(user.email);

      if (!isPasswordProtected) {
        fetchAdmins();
        fetchLogs();
      }
    };
    init();
  }, [isPasswordProtected]);

  const logAction = async (action: string, details: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/log-action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUserEmail || "master", action, details }),
      });
    } catch (e) { console.error("Logging failed", e); }
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching admins", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/logs`);
      const result = await response.json();
      if (result.success) setLogs(result.data || []);
    } catch (error: any) {
      console.error("Error fetching logs", error);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create admin");

      await logAction("CREATE_ADMIN", `Added admin: ${newAdmin.email}`);
      toast({ title: "Success", description: "Admin user created successfully" });
      setNewAdmin({ email: "", password: "", full_name: "" });
      fetchAdmins();
    } catch (error: any) {
      toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateMasterPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterPassword) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "master_password", value: newMasterPassword }),
      });
      if (!response.ok) throw new Error("Failed to update password");
      
      setMasterPassword(newMasterPassword);
      setNewMasterPassword("");
      await logAction("UPDATE_MASTER_PASSWORD", "Master password was updated");
      toast({ title: "Success", description: "Master password updated successfully" });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleMaintenanceMode = async (checked: boolean) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "maintenance_mode", value: checked.toString() }),
      });
      if (!response.ok) throw new Error("Failed to update maintenance mode");
      
      setMaintenanceMode(checked);
      await logAction("TOGGLE_MAINTENANCE_MODE", `Maintenance mode set to: ${checked ? 'ON' : 'OFF'}`);
      toast({ title: "Success", description: `Maintenance mode is now ${checked ? 'ON' : 'OFF'}` });
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdminStatus = async (id: string, currentStatus: boolean) => {
    const originalAdmins = [...admins];
    setAdmins(admins.map(a => a.id === id ? { ...a, is_active: !currentStatus } : a));
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await logAction("TOGGLE_STATUS", `Admin status toggled for user ID: ${id}`);
      toast({ title: "Status Updated", description: `Admin is now ${!currentStatus ? 'active' : 'inactive'}` });
    } catch (error: any) {
      setAdmins(originalAdmins);
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
  };

  const changeRole = async (id: string, newRole: string) => {
    const originalAdmins = [...admins];
    setAdmins(admins.map(a => a.id === id ? { ...a, role: newRole } : a));
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ role: newRole })
        .eq('id', id);

      if (error) throw error;
      await logAction("CHANGE_ROLE", `Role changed to ${newRole} for user ID: ${id}`);
      toast({ title: "Role Updated", description: `Admin role changed to ${newRole}` });
    } catch (error: any) {
      setAdmins(originalAdmins);
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
  };

  const deleteAdmin = async (id: string) => {
    if (!confirm("Are you sure? This will remove the user from the admin table. Note: This does not delete their Auth account.")) return;
    const originalAdmins = [...admins];
    setAdmins(admins.filter(a => a.id !== id));
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await logAction("DELETE_ADMIN", `Removed admin record for user ID: ${id}`);
      toast({ title: "Admin Deleted" });
    } catch (error: any) {
      setAdmins(originalAdmins);
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleTogglePageAccess = (page: string, value: boolean) => {
    setPageToToggle(page);
    setValueToSet(value);
    setShowConfirmModal(true);
  };

  const executeTogglePageAccess = async () => {
    if (!pageToToggle || valueToSet === null) return;

    const page = pageToToggle;
    const value = valueToSet;
    const originalSettings = { ...pageSettings };
    setPageSettings({ ...pageSettings, [page]: value });
    setShowConfirmModal(false); // Close modal immediately
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: page, value: value.toString() }), // Ensure value is a string for API
      });
      if (!response.ok) throw new Error("Failed to update access");
      await logAction("TOGGLE_PAGE_ACCESS", `${page} access set to: ${value ? 'ON' : 'OFF'}`);
      toast({ title: "Success", description: `Access for ${adminPages.find(p => p.id === page)?.name} is now ${value ? 'enabled' : 'disabled'}` });
    } catch (err: any) {
      setPageSettings(originalSettings);
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setPageToToggle(null);
      setValueToSet(null);
    }
  };

  if (isPasswordProtected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
        <Card className="w-full max-w-md bg-slate-900 text-white shadow-2xl border-0">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <CardTitle className="text-2xl font-bold">Master Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter master password"
                className="bg-slate-800 border-slate-700 text-white"
              />
              {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 font-bold">Verify Identity</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-purple-700 text-white py-8 shadow-lg">
        <div className="w-full px-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-10 h-10" />
              Master Admin Control
            </h1>
            <p className="opacity-90 font-medium">Manage administrative users and permissions.</p>
          </div>
          <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => navigate('/admin')}>
            <ArrowLeft className="mr-2" size={16} /> Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="w-full px-6 py-12 space-y-8">
        <Tabs defaultValue="admins" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm h-14 w-full max-w-xl">
            <TabsTrigger value="admins" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <Users size={18} /> Admins
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <History size={18} /> Activity Log
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <ShieldCheck size={18} /> Security
            </TabsTrigger>
            <TabsTrigger value="access" className="flex-1 rounded-lg gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
              <Lock size={18} /> Page Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admins">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Admin Form */}
          <Card className="shadow-xl border-0 h-fit">
            <CardHeader className="border-b bg-purple-50/50">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                Add New Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-bold">Full Name</Label>
                  <Input 
                    value={newAdmin.full_name} 
                    onChange={e => setNewAdmin({...newAdmin, full_name: e.target.value})} 
                    placeholder="e.g., John Doe" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Email Address</Label>
                  <Input 
                    type="email"
                    value={newAdmin.email} 
                    onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} 
                    placeholder="admin@example.com" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Initial Password</Label>
                  <Input 
                    type="password"
                    value={newAdmin.password} 
                    onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                <Button type="submit" disabled={isCreating} className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-6">
                  {isCreating ? <RefreshCw className="animate-spin mr-2" /> : <UserPlus className="mr-2" />}
                  Create Admin Account
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Admin List */}
          <Card className="lg:col-span-2 shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-slate-900 text-white flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">Registered Administrators</CardTitle>
              <Badge variant="secondary" className="bg-purple-600 text-white border-0">{admins.length} Total</Badge>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="font-bold">Admin Info</TableHead>
                    <TableHead className="font-bold">Role</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600" />
                        <p className="mt-2 text-slate-500 font-medium">Loading administrators...</p>
                      </TableCell>
                    </TableRow>
                  ) : admins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell>
                        <div className="font-bold text-slate-900">{admin.full_name}</div>
                        <div className="text-sm text-slate-500">{admin.email}</div>
                      </TableCell>
                      <TableCell>
                        <select 
                          className="bg-transparent border-0 text-sm font-bold text-purple-600 focus:ring-0 cursor-pointer"
                          value={admin.role}
                          onChange={(e) => changeRole(admin.id, e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="editor">Editor</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`cursor-pointer ${admin.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                          onClick={() => toggleAdminStatus(admin.id, admin.is_active)}
                        >
                          {admin.is_active ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteAdmin(admin.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" />
                  Admin Activity Audit Trail
                </CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead className="font-bold">Timestamp</TableHead>
                      <TableHead className="font-bold">Admin Email</TableHead>
                      <TableHead className="font-bold">Action</TableHead>
                      <TableHead className="font-bold">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-slate-500">No activity logged yet.</TableCell>
                      </TableRow>
                    ) : logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs text-slate-500">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-bold text-slate-700">{log.admin_email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 uppercase text-[10px]">{log.action}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="max-w-2xl">
              <Card className="shadow-xl border-0">
                <CardHeader className="border-b bg-purple-50/50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-purple-600" />
                    Reset Master Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-sm text-amber-800 font-medium leading-relaxed">
                      <strong>Warning:</strong> Changing the master password will update the primary access key for high-level administrative functions. Please ensure you remember the new password.
                    </p>
                  </div>
                  <form onSubmit={handleUpdateMasterPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold">Current Master Password (Preview)</Label>
                      <Input value={masterPassword} disabled className="bg-slate-50 border-slate-200 font-mono" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">New Master Password</Label>
                      <Input 
                        type="password"
                        value={newMasterPassword}
                        onChange={e => setNewMasterPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 font-bold py-6">
                      Update Security Credentials
                    </Button>
                  </form>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-0">
                <CardHeader className="border-b bg-purple-50/50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">Maintenance Mode</CardTitle>
                </CardHeader>
                <CardContent className="pt-8 flex items-center justify-between">
                  <p className="text-sm text-slate-700">Temporarily disable public access to the site.</p>
                  <Switch checked={maintenanceMode} onCheckedChange={handleToggleMaintenanceMode} disabled={isLoading} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="access">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  Restrict Ministry Manager Access
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {adminPages.map(page => (
                    <div key={page.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 transition-all hover:bg-slate-100/80">
                      <div>
                        <p className="font-bold text-slate-900">{page.name}</p>
                        <p className="text-xs text-slate-500 font-medium">Toggle admin access availability</p>
                      </div>
                      <Switch 
                        checked={pageSettings[page.id] !== false} 
                        onCheckedChange={(val) => handleTogglePageAccess(page.id, val)} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Modal for Page Access */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Page Access Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {valueToSet ? 'enable' : 'disable'} access for{" "}
              <span className="font-bold">
                {adminPages.find(p => p.id === pageToToggle)?.name}
              </span>?
              {valueToSet === false && (
                <p className="text-red-500 font-medium mt-2">
                  Disabling access will prevent all non-master admins from accessing this page.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeTogglePageAccess}>
              {valueToSet ? 'Enable Access' : 'Disable Access'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMaster;