import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown,
  Layout,
  Link as LinkIcon,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface CarouselImage {
  id: string;
  image_url: string;
  image_name: string;
  order_index: number;
  page: string;
  created_at: string;
}

const CarouselManagement = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    image_url: '',
    image_name: '',
    order_index: 0,
    page: 'partnership'
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "teritorial9" || passwordInput === "pastorokrah1") {
      setIsPasswordProtected(false);
      setPasswordInput("");
    } else {
      setPasswordError("Invalid password");
    }
  };

  useEffect(() => {
    if (!isPasswordProtected) fetchImages();
  }, [isPasswordProtected]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('carousel_images')
        .select('*')
        .order('page', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      alert("Error fetching images: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('carousel_images')
          .update(formData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('carousel_images')
          .insert([formData]);
        if (error) throw error;
      }

      resetForm();
      fetchImages();
      alert(`Image ${editingId ? 'updated' : 'added'} successfully!`);
    } catch (error: any) {
      alert("Error saving image: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const { error } = await supabase
        .from('carousel_images')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchImages();
    } catch (error: any) {
      alert("Error deleting image: " + error.message);
    }
  };

  const startEdit = (img: CarouselImage) => {
    setEditingId(img.id);
    setFormData({
      image_url: img.image_url,
      image_name: img.image_name,
      order_index: img.order_index,
      page: img.page
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      image_url: '',
      image_name: '',
      order_index: images.length,
      page: 'partnership'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {isPasswordProtected ? (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="w-full max-w-md bg-slate-900 text-white shadow-2xl border-0">
            <CardHeader className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-sky-400" />
              <CardTitle className="text-2xl font-bold">Carousel Manager Access</CardTitle>
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
                <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 font-bold">Access Dashboard</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="pb-16">
          <div className="bg-sky-900 text-white py-12 shadow-lg">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">Carousel Manager</h1>
                <p className="opacity-90">Manage hero images and page assignments across the site.</p>
              </div>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => navigate('/admin')}>
                <ArrowLeft className="mr-2" size={16} /> Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carousel Manager</h1>
          <p className="text-gray-500">Manage hero images across the platform</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
            <Plus size={18} /> Add New Image
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-2 border-blue-100 shadow-xl animate-in fade-in slide-in-from-top-4">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Image' : 'Add New Carousel Image'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Display Name</Label>
                  <Input 
                    value={formData.image_name} 
                    onChange={e => setFormData({...formData, image_name: e.target.value})}
                    placeholder="e.g. Partnership Banner"
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input 
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Page Assignment</Label>
                    <Select 
                      value={formData.page} 
                      onValueChange={val => setFormData({...formData, page: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="home">Home Page</SelectItem>
                        <SelectItem value="about">About Us</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Order Index</Label>
                    <Input 
                      type="number"
                      value={formData.order_index} 
                      onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 bg-gray-50">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="max-h-48 rounded-lg shadow-md object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Image preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save size={18} className="mr-2" /> {editingId ? 'Update Image' : 'Save Image'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <Card key={img.id} className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={img.image_url} 
                  alt={img.image_name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-md flex items-center gap-1">
                    <Layout size={12} /> {img.page}
                  </span>
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full flex items-center gap-1">
                    Order: {img.order_index}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 truncate max-w-[180px]">{img.image_name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <LinkIcon size={12} /> {img.image_url.substring(0, 30)}...
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-blue-600"
                      onClick={() => startEdit(img)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-red-600"
                      onClick={() => handleDelete(img.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex border-t pt-4 gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    <ArrowUp size={14} className="mr-1" /> Move Up
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    <ArrowDown size={14} className="mr-1" /> Move Down
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {images.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No carousel images found</h3>
          <p className="text-gray-500">Add your first image to get started</p>
        </div>
      )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselManagement;