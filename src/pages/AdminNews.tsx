import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Newspaper, Trash2, Edit2, Plus, Lock, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  link: string;
  created_at: string;
}

const AdminNews = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", content: "", date: "", image: "", link: "" });
  const [editing, setEditing] = useState<any | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordInput === "teritorial4" || passwordInput === "pastorokrah1") {
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid password");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNewsItems(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching news", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const fileName = `news-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = await (supabase as any).storage.from('news-images').getPublicUrl(fileName);
      const publicUrl = (urlData as any)?.publicUrl || (urlData as any)?.public_url || '';

      setNewsForm(prev => ({ ...prev, image: publicUrl }));
      toast({ title: 'Image uploaded', description: 'Image uploaded to storage.' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || String(err), variant: 'destructive' });
    } finally {
      setImageUploading(false);
    }
  };

  const handleNewsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        const { error } = await supabase
          .from("news")
          .update(newsForm)
          .eq("id", editing.id);

        if (error) throw error;
        toast({ title: "Success", description: "News updated successfully" });
      } else {
        const { error } = await supabase
          .from("news")
          .insert([newsForm]);

        if (error) throw error;
        toast({ title: "Success", description: "News created successfully" });
      }

      setNewsForm({ title: "", excerpt: "", content: "", date: "", image: "", link: "" });
      setEditing(null);
      fetchNews();
    } catch (error: any) {
      toast({
        title: "Error saving news",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditing(item);
    setNewsForm(item);
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Entry has been removed successfully",
      });

      fetchNews();
    } catch (error: any) {
      console.error('Delete news error:', error);
      toast({
        title: "Error deleting news item",
        description: error.message || 'Check console for details',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/5">
      {isPasswordProtected ? (
        // Password Gate Modal
        <div className="min-h-screen flex items-center justify-center px-0">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">News Management Access</CardTitle>
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
                    className="mt-2 bg-slate-800 border-purple-500/30 text-white placeholder:text-slate-400"
                  />
                  {passwordError && (
                    <p className="text-sm text-red-400 mt-2">{passwordError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold transition-all duration-300">
                  Access News Management
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Main Content
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-400 py-12 shadow-lg">
            <div className="w-full px-0">
              <div className="flex justify-between items-start gap-4">
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">News Management</h1>
                  <p className="text-white/90 text-lg">Create and manage news articles</p>
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
            {/* Stats Card */}
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-indigo-400/10 backdrop-blur shadow-lg mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Total News Articles</p>
                    <p className="text-4xl font-bold text-purple-600 mt-2">{newsItems.length}</p>
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 flex items-center justify-center">
                    <Newspaper className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create/Edit Form */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 overflow-hidden mb-8">
              <CardHeader className="bg-gradient-to-r from-purple-600/5 to-indigo-400/5 border-b border-purple-200/20">
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 flex items-center justify-center mr-3">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  {editing ? 'Edit News Article' : 'Create New Article'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleNewsSave} className="space-y-6">
                  {/* Title and Date Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title" className="text-slate-700 font-semibold">Article Title *</Label>
                      <Input 
                        id="title" 
                        value={newsForm.title} 
                        onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))} 
                        placeholder="Enter article title"
                        className="mt-2 border-purple-200/30 focus:border-purple-500"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="date" className="text-slate-700 font-semibold">Publication Date</Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={newsForm.date} 
                        onChange={(e) => setNewsForm(prev => ({ ...prev, date: e.target.value }))}
                        className="mt-2 border-purple-200/30 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <Label htmlFor="excerpt" className="text-slate-700 font-semibold">Article Excerpt (Summary) *</Label>
                    <Input 
                      id="excerpt" 
                      value={newsForm.excerpt} 
                      onChange={(e) => setNewsForm(prev => ({ ...prev, excerpt: e.target.value }))} 
                      placeholder="Brief summary of the article"
                      className="mt-2 border-purple-200/30 focus:border-purple-500"
                      required 
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <Label htmlFor="content" className="text-slate-700 font-semibold">Full Content</Label>
                    <Textarea 
                      id="content" 
                      value={newsForm.content} 
                      onChange={(e: any) => setNewsForm(prev => ({ ...prev, content: e.target.value }))} 
                      placeholder="Full article content"
                      rows={6}
                      className="mt-2 border-purple-200/30 focus:border-purple-500"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="border-2 border-dashed border-purple-200/40 rounded-lg p-6 bg-purple-50/30">
                    <div className="mb-4">
                      <Label htmlFor="imageFile" className="text-slate-700 font-semibold flex items-center gap-2">
                        <Image className="w-5 h-5 text-purple-600" />
                        Upload Article Image
                      </Label>
                      <input 
                        id="imageFile" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="mt-2 w-full"
                        disabled={imageUploading}
                      />
                      {imageUploading && (
                        <div className="text-sm text-purple-600 font-semibold mt-2 flex items-center gap-2">
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                          Uploading...
                        </div>
                      )}
                    </div>

                    {newsForm.image && (
                      <div className="mt-4">
                        <p className="text-sm text-slate-600 font-semibold mb-2">Image Preview:</p>
                        <img src={newsForm.image} alt="preview" className="max-w-full h-auto object-cover rounded-lg shadow-md border border-purple-200/30" />
                      </div>
                    )}

                    {!newsForm.image && (
                      <div>
                        <Label htmlFor="image" className="text-slate-700 font-semibold mt-4 block">Or Enter Image URL</Label>
                        <Input 
                          id="image" 
                          value={newsForm.image} 
                          onChange={(e) => setNewsForm(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          className="mt-2 border-purple-200/30 focus:border-purple-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Link/Slug */}
                  <div>
                    <Label htmlFor="link" className="text-slate-700 font-semibold">Link / Slug</Label>
                    <Input 
                      id="link" 
                      value={newsForm.link} 
                      onChange={(e) => setNewsForm(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="article-url-slug"
                      className="mt-2 border-purple-200/30 focus:border-purple-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold transition-all duration-300">
                      {editing ? (
                        <><Edit2 className="mr-2 w-4 h-4" /> Update Article</>
                      ) : (
                        <><Plus className="mr-2 w-4 h-4" /> Publish Article</>
                      )}
                    </Button>
                    {editing && (
                      <Button 
                        variant="outline" 
                        onClick={() => { 
                          setEditing(null); 
                          setNewsForm({ title: "", excerpt: "", content: "", date: "", image: "", link: "" }); 
                        }}
                        className="border-purple-200 hover:bg-purple-50 transition-all duration-300"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* News Articles Grid */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600/5 to-indigo-400/5 border-b border-purple-200/20">
                <CardTitle className="flex items-center text-2xl text-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 flex items-center justify-center mr-3">
                    <Newspaper className="w-5 h-5 text-white" />
                  </div>
                  News Articles ({newsItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="text-muted-foreground mt-4">Loading articles...</p>
                  </div>
                ) : newsItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">No news articles yet. Create one to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsItems.map((item) => (
                      <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-purple-50/20 hover:scale-105 transform">
                        {item.image && (
                          <div className="relative overflow-hidden h-48">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                          <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2">{item.title}</h3>
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.excerpt}</p>
                          
                          {item.link && (
                            <p className="text-xs text-purple-600 font-semibold mb-4">Slug: {item.link}</p>
                          )}
                          
                          <div className="flex gap-2 pt-4 border-t border-purple-100/50">
                            <Button 
                              size="sm"
                              onClick={() => handleEdit(item)}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-500 hover:shadow-lg text-white font-semibold transition-all duration-300"
                            >
                              <Edit2 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => deleteNews(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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

export default AdminNews;
