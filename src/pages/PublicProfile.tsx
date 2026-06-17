import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, MessageSquare, Heart, Share2, Star, Flame, Loader2, UserPlus, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user && id) {
        checkFollowStatus(user.id, id);
      }
    };
    checkSession();
  }, [id]);

  const checkFollowStatus = async (followerId: string, followingId: string) => {
    const { data } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();
    setIsFollowing(!!data);
  };

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Fetch Profile Details
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch Posts by this specific member
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*, post_likes(count), post_comments(count)')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch Follower Count
      const { count: followers, error: followersError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', id);
      
      if (!followersError) setFollowerCount(followers || 0);

      // Fetch Following Count
      const { count: following, error: followingError } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', id);

      if (!followingError) setFollowingCount(following || 0);

    } catch (error: any) {
      console.error("Error fetching member profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please log in to follow community members.",
        variant: "destructive"
      });
      return;
    }

    try {
      setFollowingLoading(true);
      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', id);
        
        if (error) throw error;
        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
        toast({ title: `Unfollowed ${profile.full_name}` });
      } else {
        const { error } = await supabase
          .from('follows')
          .insert([{ follower_id: currentUser.id, following_id: id }]);
        
        if (error) throw error;
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast({ title: `Now following ${profile.full_name}` });
      }
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setFollowingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Member not found</h2>
        <p className="text-slate-500 mb-6">This member may have left the community.</p>
        <Button onClick={() => navigate('/community')} className="bg-blue-600">Back to Community</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2 text-slate-500 hover:text-slate-900 font-bold"
        >
          <ArrowLeft size={18} /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white sticky top-24">
              <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <div className="px-6 pb-8">
                <div className="relative -mt-12 mb-4">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name} 
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg">
                      <User size={40} className="text-slate-300" />
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">{profile.full_name}</h2>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Community Member</p>

                {currentUser && currentUser.id !== id && (
                  <Button 
                    onClick={toggleFollow} 
                    disabled={followingLoading}
                    className={`w-full mb-6 font-bold rounded-xl shadow-md transition-all ${
                      isFollowing 
                        ? "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-slate-200" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {followingLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isFollowing ? (
                      <><UserMinus className="w-4 h-4 mr-2" /> Unfollow</>
                    ) : (
                      <><UserPlus className="w-4 h-4 mr-2" /> Follow</>
                    )}
                  </Button>
                )}
                
                {profile.bio && (
                  <div className="py-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{profile.bio}"</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-y-4 gap-x-4 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">{posts.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">
                      {posts.reduce((acc, post) => acc + (post.post_likes?.[0]?.count || 0), 0)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">{followerCount}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-900">{followingCount}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Following</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Member Activity Feed */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-600" /> Member Activity
            </h3>
            
            {posts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">This member hasn't shared any posts yet.</p>
              </div>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="border-0 shadow-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-xs text-slate-400 font-bold">{new Date(post.created_at).toLocaleDateString()}</p>
                      {post.post_type === 'testimony' && (
                        <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-0 text-[10px] uppercase font-black tracking-tighter">
                          <Star size={10} className="mr-1 fill-current" /> Testimony
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-800 leading-relaxed mb-6">{post.content}</p>
                    <div className="flex items-center gap-6 pt-4 border-t border-slate-50 text-slate-500">
                      <div className="flex items-center gap-2 text-sm font-bold"><Heart size={18} /> {post.post_likes?.[0]?.count || 0}</div>
                      <div className="flex items-center gap-2 text-sm font-bold"><MessageSquare size={18} /> {post.post_comments?.[0]?.count || 0}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;