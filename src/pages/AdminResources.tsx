import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, UploadCloud, ArrowLeft, FileText, FolderPlus } from "lucide-react";
import { XCircle } from "lucide-react"; // Import XCircle for restricted access message
import { useNavigate } from "react-router-dom";

const resourceCategories = [
  "Sermons",
  "Books",
  "Podcasts",
  "Downloads",
];

const AdminResources = () => {
  const [selectedCategory, setSelectedCategory] = useState(resourceCategories[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAccessRestricted, setIsAccessRestricted] = useState(false); // NEW state for access restriction
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPasswordProtected) {
      fetchResources();
    }
  }, [isPasswordProtected, selectedCategory]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordInput === "teritorial5" || passwordInput === "pastorokrah1") { // Existing password check
      // NEW: Check page access after successful password entry
      fetch("/api/admin/page-access")
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings['admin-resources'] === false) {
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

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const folder = selectedCategory.toLowerCase();
      const { data, error } = await supabase.storage
        .from("resources")
        .list(folder, { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } });

      if (error) throw error;

      const items = await Promise.all(
        (data || []).map(async (item: any) => {
          const filePath = `${folder}/${item.name}`;
          const { data: urlData } = await supabase.storage.from("resources").getPublicUrl(filePath);
          return {
            name: item.name,
            size: item.size,
            path: filePath,
            url: (urlData as any)?.publicUrl || (urlData as any)?.public_url || "",
          };
        })
      );

      setResources(items);
    } catch (error: any) {
      toast({
        title: "Unable to load resources",
        description: error.message || "Check bucket configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "Select a file", variant: "destructive" });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Enter a title", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const folder = selectedCategory.toLowerCase();
      const filePath = `${folder}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = await supabase.storage.from("resources").getPublicUrl(filePath);
      const publicUrl = (urlData as any)?.publicUrl || (urlData as any)?.public_url || "";

      toast({ title: "Resource uploaded", description: "The file is available in Supabase storage." });
      setTitle("");
      setDescription("");
      setFile(null);
      fetchResources();
      setResources(prev => [{ name: file.name, path: filePath, url: publicUrl, size: file.size }, ...prev]);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950/5">
      {isPasswordProtected ? (
        <div className="min-h-screen flex items-center justify-center px-0">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center">
                <FolderPlus className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Resources Upload Access</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-white">Enter Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="Enter access password"
                    className="mt-2 bg-slate-800 border-indigo-500/30 text-white placeholder:text-slate-400"
                  />
                  {passwordError && <p className="text-sm text-red-400 mt-2">{passwordError}</p>}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/40 text-white font-semibold transition-all duration-300">
                  Access Resources
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
                  Access to the Resources Manager has been temporarily disabled by the Master Administrator.
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
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-slate-900 py-12 shadow-lg">
            <div className="w-full px-0">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">Resource Manager</h1>
                  <p className="text-white/90 text-lg">Upload files for the resources page and keep your media organized.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur transition-all duration-300"
                    onClick={() => navigate('/admin')}
                  >
                    <ArrowLeft className="mr-2" size={16} />
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-0 py-12 space-y-8">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-600/10 to-cyan-500/10 border-b border-slate-200/50">
                <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  Upload Resource File
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleFileUpload} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter resource title" />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
                      >
                        {resourceCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Describe the resource or intended use"
                      className="mt-2"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resource-file">Resource File</Label>
                    <Input
                      id="resource-file"
                      type="file"
                      onChange={e => setFile(e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Badge variant="secondary">Bucket: resources</Badge>
                    <Badge variant="secondary">Folder: {selectedCategory.toLowerCase()}</Badge>
                    <Badge variant="secondary">Supports PDF, audio, video, docs</Badge>
                  </div>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:shadow-xl transition-all duration-300">
                    <UploadCloud className="mr-2" size={16} />
                    {isLoading ? 'Uploading...' : 'Upload Resource'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-0 shadow-2xl bg-slate-950/95 text-white">
                <CardHeader className="border-b border-slate-800/70">
                  <CardTitle className="text-xl">Resource Library</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-slate-300">Browse files already stored in the selected resource folder.</p>
                  <div className="space-y-2">
                    {resourceCategories.map(category => (
                      <Button
                        key={category}
                        variant={category === selectedCategory ? "secondary" : "outline"}
                        className="w-full justify-between"
                        onClick={() => setSelectedCategory(category)}
                      >
                        <span>{category}</span>
                        <span>{category === selectedCategory ? 'Selected' : 'Switch'}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-2xl bg-white/95">
                <CardHeader className="border-b border-slate-200/70">
                  <CardTitle className="text-xl">Recent Uploads</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {resources.length === 0 ? (
                    <p className="text-slate-500">No uploaded resources found for {selectedCategory}.</p>
                  ) : (
                    <div className="space-y-3">
                      {resources.map(item => (
                        <div key={item.path} className="rounded-2xl border border-slate-200/70 p-4 bg-slate-50">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{item.name}</p>
                              <p className="text-sm text-slate-500">{selectedCategory}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(item.url, "_blank")}
                            >
                              Open
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        )
      )}
    </div>
  );
};

export default AdminResources;
