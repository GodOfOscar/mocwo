import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Camera, Save, Loader2, ArrowLeft, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    avatar_url: "",
    bio: "",
    email: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, bio, email")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || "",
          email: data.email || user.email || "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2 text-slate-500 hover:text-slate-900 font-bold"
        >
          <ArrowLeft size={18} /> Back to Community
        </Button>

        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500" />
          <CardHeader className="relative pb-0">
            <div className="absolute -top-16 left-8">
              <div className="relative group">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-3xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl">
                    <User size={48} className="text-slate-300" />
                  </div>
                )}
              </div>
            </div>
            <div className="pt-16 px-2">
              <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</CardTitle>
              <CardDescription className="text-lg">Manage your identity in The Martyrs World.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Account Email</Label>
                <Input value={profile.email} disabled className="bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed h-12 rounded-xl" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="full_name" className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Display Name</Label>
                <Input 
                  id="full_name" 
                  placeholder="How should we call you?"
                  value={profile.full_name} 
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio" className="text-slate-500 font-black uppercase text-[10px] tracking-widest">About Me</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell the community about yourself..."
                  value={profile.bio} 
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="min-h-[100px] rounded-xl border-slate-200 focus:ring-blue-500 font-medium resize-none"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="avatar_url" className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Avatar Image URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="avatar_url" 
                    placeholder="https://images.unsplash.com/..."
                    value={profile.avatar_url} 
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                    className="h-12 rounded-xl border-slate-200 focus:ring-blue-500 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1"><Globe size={12}/> Paste a direct link to a hosted image (JPG/PNG).</p>
              </div>
            </div>

            <Button 
              onClick={updateProfile} 
              disabled={updating}
              className="w-full bg-blue-600 hover:bg-blue-700 py-7 text-lg font-black rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              {updating ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-5 w-5" /> Save Changes</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;