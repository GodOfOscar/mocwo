import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Book, UploadCloud, ArrowLeft, Image as ImageIcon, Trash2, Calendar, Lock } from "lucide-react";
import { XCircle } from "lucide-react"; // Import XCircle for restricted access message
import { useNavigate } from "react-router-dom";

const months = [
  { name: "January", days: 31 },
  { name: "February", days: 28 },
  { name: "March", days: 31 },
  { name: "April", days: 30 },
  { name: "May", days: 31 },
  { name: "June", days: 30 },
  { name: "July", days: 31 },
  { name: "August", days: 31 },
  { name: "September", days: 30 },
  { name: "October", days: 31 },
  { name: "November", days: 30 },
  { name: "December", days: 31 }
];

const AdminDevotionals = () => {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedDay, setSelectedDay] = useState("1");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAccessRestricted, setIsAccessRestricted] = useState(false); // NEW state for access restriction
  const [devotionals, setDevotionals] = useState<any[]>([]);
  const [monthTheme, setMonthTheme] = useState("");
  const [monthCoverImageFile, setMonthCoverImageFile] = useState<File | null>(null);
  const [monthCoverImageUrl, setMonthCoverImageUrl] = useState("");
  const [monthBgColor, setMonthBgColor] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordInput === "teritorial10" || passwordInput === "pastorokrah1") {
      // NEW: Check page access after successful password entry
      fetch(`${API_BASE_URL}/api/admin/page-access`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings['admin-devotionals'] === false) {
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
      fetchDevotionals();
      fetchMonthSettings();
    }
  }, [isPasswordProtected, selectedMonth]);

  const fetchMonthSettings = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('devotional_settings')
        .select('theme, bg_color, cover_image_url')
        .eq('month', selectedMonth.name.toLowerCase())
        .maybeSingle();
      
      if (error) throw error;
      setMonthTheme(data?.theme || "");
      setMonthCoverImageUrl(data?.cover_image_url || "");
      setMonthBgColor(data?.bg_color || "");
    } catch (err) {
      console.error("Error fetching month settings:", err);
    }
  };

  const fetchDevotionals = async () => {
    try {
      setIsLoading(true);
      const folder = selectedMonth.name.toLowerCase();
      const { data, error } = await supabase.storage
        .from("devotionals")
        .list(folder, { limit: 100, sortBy: { column: "name", order: "asc" } });

      if (error) throw error;

      const items = await Promise.all(
        (data || []).map(async (item: any) => {
          const filePath = `${folder}/${item.name}`;
          const { data: urlData } = await supabase.storage.from("devotionals").getPublicUrl(filePath);
          return {
            name: item.name,
            path: filePath,
            url: (urlData as any)?.publicUrl || (urlData as any)?.public_url || "",
          };
        })
      );

      setDevotionals(items);
    } catch (error: any) {
      console.error("Storage error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMonthSettings = async () => {
    try {
      setIsLoading(true);
      let newCoverImageUrl = monthCoverImageUrl;

      if (monthCoverImageFile) {
        const folder = "devotional_covers"; // Separate folder for cover images
        const fileName = `${selectedMonth.name.toLowerCase()}.jpg`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("devotionals") // Using the same bucket as daily devotionals
          .upload(filePath, monthCoverImageFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from("devotionals").getPublicUrl(filePath);
        newCoverImageUrl = publicUrlData.publicUrl;
        setMonthCoverImageUrl(newCoverImageUrl); // Update state with new URL
        setMonthCoverImageFile(null); // Clear file input
      }

      const { error } = await (supabase as any)
        .from('devotional_settings')
        .upsert({ 
          month: selectedMonth.name.toLowerCase(), 
          theme: monthTheme,
          cover_image_url: newCoverImageUrl,
          bg_color: monthBgColor
        }, { onConflict: 'month' });
      
      if (error) throw error;
      toast({ title: "Month details updated", description: `Settings for ${selectedMonth.name} saved successfully.` });
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllDevotionals = async () => {
    if (devotionals.length === 0) return;
    if (!confirm(`Are you sure you want to delete ALL ${devotionals.length} images for ${selectedMonth.name}?`)) return;

    try {
      setIsLoading(true);
      const paths = devotionals.map(d => d.path);
      const { error } = await supabase.storage.from("devotionals").remove(paths);
      if (error) throw error;
      
      toast({ title: "Success", description: `All devotionals deleted for ${selectedMonth.name}` });
      fetchDevotionals();
    } catch (error: any) {
      toast({ title: "Delete all failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast({ title: "Select one or more JPG images", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const folder = selectedMonth.name.toLowerCase();
      
      const uploadPromises = Array.from(files).map(async (f) => {
        let day = selectedDay;
        if (files.length > 1) {
          const fileNameNoExt = f.name.split('.')[0];
          const parsedDay = parseInt(fileNameNoExt);
          if (!isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= selectedMonth.days) {
            day = parsedDay.toString();
          } else {
            throw new Error(`File ${f.name} is not named correctly (e.g., 1.jpg).`);
          }
        }
        
        const fileName = `${day}.jpg`;
        const filePath = `${folder}/${fileName}`;
        
        const { error } = await supabase.storage.from("devotionals").upload(filePath, f, { upsert: true });
        if (error) throw error;
        return true;
      });

      await Promise.all(uploadPromises);

      toast({ title: files.length > 1 ? "Batch upload complete" : "Devotional uploaded" });
      setFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDevotionals();
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDevotional = async (path: string) => {
    if (!confirm("Delete this devotional image?")) return;
    try {
      const { error } = await supabase.storage.from("devotionals").remove([path]);
      if (error) throw error;
      fetchDevotionals();
      toast({ title: "Deleted" });
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    }
  };

  if (isPasswordProtected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
        <Card className="w-full max-w-md bg-slate-900 text-white shadow-2xl border-0">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-orange-400" />
            <CardTitle className="text-2xl font-bold">Devotional Manager Access</CardTitle>
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
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {isAccessRestricted ? ( // NEW: Restricted access message
        <div className="min-h-[80vh] flex items-center justify-center px-0">
          <Card className="w-full max-w-md bg-slate-900 text-white shadow-2xl border-0">
            <CardHeader className="text-center">
              <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <CardTitle className="text-2xl font-bold font-serif">Access Restricted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-200 mb-4">
                Access to the Devotionals Manager has been temporarily disabled by the Master Administrator.
                Please contact your Master Admin for further assistance.
              </p>
              <Button onClick={() => navigate('/admin')} className="w-full bg-red-600 hover:bg-red-700 font-bold">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      ) :
      <>
      <div className="bg-orange-600 text-white py-12 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Daily Devotional Manager</h1>
            <p className="opacity-90">Upload JPG images for the daily devotionals.</p>
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
              <UploadCloud className="w-5 h-5 text-orange-600" />
              Upload Devotional Image
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleFileUpload} className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="font-bold">Select Month</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedMonth.name}
                  onChange={e => setSelectedMonth(months.find(m => m.name === e.target.value)!)}
                >
                  {months.map(m => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4 md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-2">
                  <Label className="font-bold">Month Theme</Label>
                  <Input 
                    value={monthTheme} 
                    onChange={e => setMonthTheme(e.target.value)} 
                    placeholder="e.g., New Beginnings"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Card Background Color</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[
                      "from-blue-600 to-blue-400",
                      "from-red-600 to-red-400",
                      "from-cyan-600 to-cyan-400",
                      "from-emerald-600 to-emerald-400",
                      "from-purple-600 to-purple-400",
                      "from-pink-600 to-pink-400",
                      "from-orange-600 to-orange-400",
                      "from-amber-600 to-amber-400",
                      "from-indigo-600 to-indigo-400"
                    ].map((grad) => (
                      <button
                        key={grad}
                        type="button"
                        onClick={() => setMonthBgColor(grad)}
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${grad} border-2 transition-all ${
                          monthBgColor === grad ? "border-slate-900 scale-110 shadow-md" : "border-white hover:scale-105"
                        }`}
                        title={grad}
                      />
                    ))}
                  </div>
                  <Input 
                    value={monthBgColor} 
                    onChange={e => setMonthBgColor(e.target.value)} 
                    placeholder="Tailwind classes (e.g. from-blue-600 to-blue-400)"
                    className="text-xs"
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={saveMonthSettings} 
                    disabled={isLoading}
                    className="bg-slate-900 text-white font-bold px-8"
                  >
                    {isLoading ? 'Saving...' : 'Save Month Details'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Select Day</Label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value)}
                >
                  {Array.from({ length: selectedMonth.days }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>Day {d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="font-bold">JPG File(s)</Label>
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/jpeg" 
                  multiple 
                  onChange={e => setFiles(e.target.files)} 
                />
                {files && files.length > 1 && (
                  <p className="text-[10px] text-slate-500 font-medium">Batch mode: Files will be mapped to days based on filenames (1.jpg, 2.jpg...)</p>
                )}
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 font-bold px-8">
                  {isLoading ? 'Uploading...' : 
                   files && files.length > 1 ? `Upload ${files.length} Devotionals` : 'Upload Image'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-slate-900 text-white flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-orange-400" />
              Current Images for {selectedMonth.name}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{devotionals.length} Uploaded</Badge>
              {devotionals.length > 0 && (
                <Button onClick={deleteAllDevotionals} variant="destructive" size="sm" className="h-8 gap-2">
                  <Trash2 className="w-4 h-4" /> Delete All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {devotionals.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 italic">No images uploaded for this month yet.</div>
              ) : (
                devotionals.map(dev => (
                  <div key={dev.path} className="group relative aspect-[2/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img src={dev.url} className="w-full h-full object-cover" alt={dev.name} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <p className="text-white font-bold text-sm">Day {dev.name.split('.')[0]}</p>
                      <div className="flex gap-2">
                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => deleteDevotional(dev.path)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </>
      }
    </div>
  );
};

export default AdminDevotionals;