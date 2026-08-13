import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { Video, Image, UploadCloud, ArrowLeft, Layers, Trash2, Plus, MoveUp, MoveDown } from "lucide-react";
import { XCircle } from "lucide-react"; // Import XCircle for restricted access message
import { useNavigate } from "react-router-dom";

const mediaPages = [
  "Home",
  "Partnership",
  "Resources",
  "News",
  "Live",
  "About",
  "Contact",
];

const AdminMediaFiles = () => {
  const [selectedPage, setSelectedPage] = useState(mediaPages[0]);
  const [file, setFile] = useState<File | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAccessRestricted, setIsAccessRestricted] = useState(false); // NEW state for access restriction
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [carouselImages, setCarouselImages] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPasswordProtected) {
      fetchMediaFiles();
      fetchCarouselImages();
    }
  }, [isPasswordProtected, selectedPage]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordInput === "teritorial6" || passwordInput === "pastorokrah1") { // Existing password check
      // NEW: Check page access after successful password entry
      fetch(`${API_BASE_URL}/api/admin/page-access`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.settings['admin-media-files'] === false) {
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

  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result.split(',')[1] || '');
        } else {
          reject(new Error('Unable to read file'));
        }
      };
      reader.onerror = () => reject(reader.error || new Error('File read error'));
      reader.readAsDataURL(file);
    });
  };

  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true);
      const pagePath = selectedPage.toLowerCase();
      const response = await fetch(`${API_BASE_URL}/api/admin-media-files/list?page=${encodeURIComponent(pagePath)}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Unable to fetch media files');
      setMediaFiles(json.data || []);
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      if (/bucket not found|Bucket not found|Could not find the table|404|Bad Request/i.test(errMsg)) {
        toast({
          title: "Unable to access storage",
          description: "Storage bucket 'media-files' not found or misconfigured. Create the bucket in Supabase or verify project keys.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unable to load media files",
          description: errMsg || "Check bucket or storage access",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarouselImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin-media-files/carousel?page=${encodeURIComponent(selectedPage.toLowerCase())}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Unable to fetch carousel images');
      setCarouselImages(json.data || []);
    } catch (error: any) {
      console.error("Error fetching carousel images:", error);
      setCarouselImages([]);
      toast({
        title: "Carousel unavailable",
        description: error.message?.includes("carousel_images")
          ? "The carousel_images table is not available in this Supabase project."
          : "Unable to load carousel images.",
        variant: "destructive",
      });
    }
  };

  const addToCarousel = async (mediaFile: any) => {
    try {
      const maxOrder = carouselImages.length > 0 ? Math.max(...carouselImages.map(img => img.order_index || 0)) : 0;
      const response = await fetch(`${API_BASE_URL}/api/admin-media-files/carousel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: selectedPage.toLowerCase(),
          image_url: mediaFile.url,
          image_name: mediaFile.name,
          order_index: maxOrder + 1,
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Unable to add image to carousel');
      toast({ title: "Added to carousel", description: `Image added to ${selectedPage} carousel successfully.` });
      fetchCarouselImages();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const removeFromCarousel = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin-media-files/carousel/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Unable to remove carousel image');
      toast({ title: "Removed from carousel", description: "Image removed from carousel." });
      fetchCarouselImages();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const moveCarouselImage = async (id: string, direction: "up" | "down") => {
    try {
      const currentImage = carouselImages.find(img => img.id === id);
      if (!currentImage) return;

      const newOrder = direction === "up" ? currentImage.order_index - 1 : currentImage.order_index + 1;
      if (newOrder < 0 || newOrder >= carouselImages.length) return;

      const response = await fetch(`${API_BASE_URL}/api/admin-media-files/carousel/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, order_index: newOrder }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Unable to reorder carousel image');

      fetchCarouselImages();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "Select a media file", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      const folder = selectedPage.toLowerCase();
      const fileName = `${Date.now()}-${file.name}`;
      const base64 = await fileToBase64(file);
      const response = await fetch(`${API_BASE_URL}/api/admin-media-files/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: folder,
          fileName,
          base64,
          mimeType: file.type || 'application/octet-stream',
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Unable to upload media file');

      toast({ title: "Media file uploaded", description: "The file is now stored in Supabase storage." });
      setFile(null);
      fetchMediaFiles();
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      if (/bucket not found|Bucket not found|Could not find the table|404|Bad Request/i.test(errMsg)) {
        toast({
          title: "Upload failed: storage issue",
          description: "Bucket 'media-files' not found or misconfigured. Create the bucket in Supabase dashboard or verify the project keys.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload failed",
          description: errMsg || "Could not upload media file",
          variant: "destructive",
        });
      }
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 flex items-center justify-center">
                <Layers className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">Media Files Access</CardTitle>
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
                    className="mt-2 bg-slate-800 border-teal-500/30 text-white placeholder:text-slate-400"
                  />
                  {passwordError && <p className="text-sm text-red-400 mt-2">{passwordError}</p>}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:shadow-lg hover:shadow-teal-500/40 text-white font-semibold transition-all duration-300">
                  Access Media Files
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
                  Access to the Media Files Manager has been temporarily disabled by the Master Administrator.
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
          <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-slate-900 py-12 shadow-lg">
            <div className="w-full px-0">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">Media Files Manager</h1>
                  <p className="text-white/90 text-lg">Upload and manage page media for images and videos across the site.</p>
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
              <CardHeader className="bg-gradient-to-r from-teal-600/10 to-cyan-500/10 border-b border-slate-200/50">
                <CardTitle className="text-2xl text-slate-900 flex items-center gap-3">
                  <Video className="w-6 h-6 text-teal-600" />
                  Upload Media File
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                    <Label htmlFor="page">Target Page</Label>
                    <select
                      id="page"
                      value={selectedPage}
                      onChange={e => setSelectedPage(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
                    >
                      {mediaPages.map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="media-file">Media File</Label>
                    <Input
                      id="media-file"
                      type="file"
                      onChange={e => setFile(e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Badge variant="secondary">Bucket: media-files</Badge>
                    <Badge variant="secondary">Folder: {selectedPage.toLowerCase()}</Badge>
                    <Badge variant="secondary">Image or video formats supported</Badge>
                  </div>
                  <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-teal-600 to-cyan-500 text-white hover:shadow-xl transition-all duration-300">
                    <UploadCloud className="mr-2" size={16} />
                    {isLoading ? 'Uploading...' : 'Upload Media'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-0 shadow-2xl bg-slate-950/95 text-white">
                <CardHeader className="border-b border-slate-800/70">
                  <CardTitle className="text-xl">Media Pages</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-slate-300">Choose the page you want to manage media for and upload new assets.</p>
                  <div className="space-y-2">
                    {mediaPages.map(page => (
                      <Button
                        key={page}
                        variant={page === selectedPage ? "secondary" : "outline"}
                        className="w-full justify-between"
                        onClick={() => setSelectedPage(page)}
                      >
                        <span>{page}</span>
                        <span>{page === selectedPage ? 'Selected' : 'Choose'}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-2xl bg-white/95">
                <CardHeader className="border-b border-slate-200/70">
                  <CardTitle className="text-xl">Uploaded Media</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {mediaFiles.length === 0 ? (
                    <p className="text-slate-500">No media files uploaded yet for {selectedPage}.</p>
                  ) : (
                    <div className="space-y-3">
                      {mediaFiles.map(item => (
                        <div key={item.path} className="rounded-2xl border border-slate-200/70 p-3 bg-slate-50">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                              <p className="text-xs text-slate-500">{selectedPage}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(item.url, "_blank")}
                              >
                                Open
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-teal-600 hover:bg-teal-50"
                                onClick={() => addToCarousel(item)}
                                title="Add to carousel"
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader className="bg-gradient-to-r from-amber-600/10 to-orange-500/10 border-b border-amber-200/50">
                  <CardTitle className="text-xl flex items-center gap-2 text-amber-900">
                    <Image className="w-5 h-5" />
                    Carousel Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {carouselImages.length === 0 ? (
                    <p className="text-amber-700">No carousel images. Add media files above to create a carousel.</p>
                  ) : (
                    <div className="space-y-3">
                      {carouselImages.map((img, idx) => (
                        <div key={img.id} className="rounded-lg border border-amber-200 p-3 bg-white">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 text-sm truncate">{img.image_name}</p>
                              <p className="text-xs text-slate-500">Position: {idx + 1}</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={idx === 0}
                                onClick={() => moveCarouselImage(img.id, "up")}
                                className="h-8 w-8 p-0"
                                title="Move up"
                              >
                                <MoveUp size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={idx === carouselImages.length - 1}
                                onClick={() => moveCarouselImage(img.id, "down")}
                                className="h-8 w-8 p-0"
                                title="Move down"
                              >
                                <MoveDown size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCarousel(img.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                title="Remove from carousel"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
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

export default AdminMediaFiles;
