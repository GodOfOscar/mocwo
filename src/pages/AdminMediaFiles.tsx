import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Video, Image, UploadCloud, ArrowLeft, Layers, Trash2, Plus, MoveUp, MoveDown } from "lucide-react";
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

    if (passwordInput === "teritorial6" || passwordInput === "pastorokrah1") {
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid password");
      setPasswordInput("");
    }
  };

  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true);
      const pagePath = selectedPage.toLowerCase();
      const { data, error } = await supabase.storage
        .from("media-files")
        .list(pagePath, { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } });

      if (error) throw error;

      const items = await Promise.all(
        (data || []).map(async (item: any) => {
          const filePath = `${pagePath}/${item.name}`;
          const { data: urlData } = await supabase.storage.from("media-files").getPublicUrl(filePath);
          return {
            name: item.name,
            size: item.size,
            path: filePath,
            url: (urlData as any)?.publicUrl || (urlData as any)?.public_url || "",
          };
        })
      );

      setMediaFiles(items);
    } catch (error: any) {
      toast({
        title: "Unable to load media files",
        description: error.message || "Check bucket or storage access",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarouselImages = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("carousel_images")
        .select("*")
        .eq("page", selectedPage.toLowerCase())
        .order("order_index", { ascending: true });

      if (error) throw error;
      setCarouselImages(data || []);
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
      
      const { error } = await (supabase as any)
        .from("carousel_images")
        .insert([{
          image_url: mediaFile.url,
          image_name: mediaFile.name,
          order_index: maxOrder + 1,
          page: selectedPage.toLowerCase(),
        }]);

      if (error) throw error;
      toast({ title: "Added to carousel", description: `Image added to ${selectedPage} carousel successfully.` });
      fetchCarouselImages();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const removeFromCarousel = async (id: string) => {
    try {
      const { error } = await supabase
        .from("carousel_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
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

      if (direction === "up" && currentImage.order_index > 0) {
        const prevImage = carouselImages.find(img => img.order_index === currentImage.order_index - 1);
        if (prevImage) {
          await supabase.from("carousel_images").update({ order_index: currentImage.order_index - 1 }).eq("id", id);
          await supabase.from("carousel_images").update({ order_index: currentImage.order_index }).eq("id", prevImage.id);
        }
      } else if (direction === "down" && currentImage.order_index < carouselImages.length - 1) {
        const nextImage = carouselImages.find(img => img.order_index === currentImage.order_index + 1);
        if (nextImage) {
          await supabase.from("carousel_images").update({ order_index: currentImage.order_index + 1 }).eq("id", id);
          await supabase.from("carousel_images").update({ order_index: currentImage.order_index }).eq("id", nextImage.id);
        }
      }

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
      const filePath = `${folder}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("media-files")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = await supabase.storage.from("media-files").getPublicUrl(filePath);
      const publicUrl = (urlData as any)?.publicUrl || (urlData as any)?.public_url || "";

      toast({ title: "Media file uploaded", description: "The file is now stored in Supabase storage." });
      setFile(null);
      fetchMediaFiles();
      setMediaFiles(prev => [{ name: file.name, path: filePath, url: publicUrl, size: file.size }, ...prev]);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload media file",
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
      )}
    </div>
  );
};

export default AdminMediaFiles;
